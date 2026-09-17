/** Discover same-origin URLs without guessing templates.
 * --limit N: explicit page cap (default 40; --all removes that default).
 * --all: retain every discovered HTML URL, subject to explicit limits/budget.
 * --crawl: follow links instead of sitemap discovery.
 * --max-requests N: discovery budget, default 300; truncation is recorded.
 * --out urls.txt: also writes urls.txt.coverage.json.
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { httpUrl, sameOrigin, guardNavigation, navigate, integer } from './navigation.mjs';

const SKIP=/\.(pdf|docx?|xlsx?|pptx?|jpe?g|png|gif|svg|webp|zip|mp4|mov|webm|css|js|ico|xml|json)$/i;
const SITEMAPS=['/sitemap_index.xml','/sitemap.xml','/wp-sitemap.xml','/sitemap-index.xml'];
export function parseArgs(argv) {
  const o={root:null,limit:null,all:false,crawl:false,maxRequests:300,out:null};
  for(let i=0;i<argv.length;i++) {
    const a=argv[i];
    if(a==='--limit') o.limit=integer(argv[++i],a);
    else if(a==='--max-requests') o.maxRequests=integer(argv[++i],a);
    else if(a==='--out') {o.out=argv[++i];if(!o.out)throw new Error('--out requires a path');}
    else if(a==='--all') o.all=true;
    else if(a==='--crawl') o.crawl=true;
    else if(a.startsWith('--')) throw new Error(`Unknown flag ${a}`);
    else if(o.root) throw new Error('Only one root URL is supported');
    else o.root=httpUrl(a);
  }
  if(!o.root) throw new Error('Provide a root HTTP(S) URL');
  if(o.limit===null && !o.all) o.limit=40;
  return o;
}

// DOMParser decodes XML entities and CDATA; a regex does not.
export async function sitemapEntries(page,xml) {
  return page.evaluate(xml=>{
    const doc=new DOMParser().parseFromString(xml,'application/xml');
    if(doc.querySelector('parsererror')) throw new Error('Invalid sitemap XML');
    const kind=doc.documentElement.localName;
    if(!['sitemapindex','urlset'].includes(kind)) throw new Error('Not a sitemap document');
    return {index:kind==='sitemapindex',urls:[...doc.getElementsByTagNameNS('*','loc')].map(el=>el.textContent.trim())};
  },xml);
}

export async function discover(page,o) {
  const found=new Set(), excluded=[], errors=[], blocked=[], pending=[];
  let requests=0;
  const eligible=value=>{
    let url;
    try {url=httpUrl(value,o.root);} catch {excluded.push({url:String(value),reason:'invalid URL'});return null;}
    if(!sameOrigin(url,o.root)){excluded.push({url,reason:'outside selected origin'});return null;}
    return url;
  };
  const add=value=>{
    const url=eligible(value);if(!url)return;
    if(SKIP.test(new URL(url).pathname)){excluded.push({url,reason:'non-HTML resource; review separately if in scope'});return;}
    found.add(url);
  };
  // Redirects are followed explicitly so an off-site Location is never fetched.
  const fetchXML=async initial=>{
    let url=initial;
    for(let hop=0;hop<10;hop++) {
      if(requests>=o.maxRequests){pending.push(url);return null;}
      requests++;
      const response=await page.request.get(url,{timeout:20000,maxRedirects:0});
      const status=response.status();
      if(status>=300 && status<400){
        const location=response.headers().location;
        if(!location)throw new Error('Sitemap redirect without Location');
        const next=eligible(new URL(location,url).href);
        if(!next){blocked.push({url,reason:'off-origin sitemap redirect'});return null;}
        url=next;continue;
      }
      if(!response.ok()) {if(status!==404)errors.push({url,reason:`HTTP ${status}`});return null;}
      return await response.text();
    }
    throw new Error('Too many sitemap redirects');
  };
  if(!o.crawl){
    const queue=SITEMAPS.map(path=>new URL(path,o.root).href), seen=new Set();
    while(queue.length && requests<o.maxRequests){
      const url=queue.shift();if(seen.has(url))continue;seen.add(url);
      try {
        const xml=await fetchXML(url);if(!xml)continue;
        const entries=await sitemapEntries(page,xml);
        for(const value of entries.urls){if(entries.index){const nested=eligible(value);if(nested && !seen.has(nested))queue.push(nested);}else add(value);}
      } catch(e){errors.push({url,reason:String(e.message || e)});}
    }
    pending.push(...queue.filter(url=>!seen.has(url)));
  }
  let source='sitemap';
  if(o.crawl || found.size===0){
    source=o.crawl ? 'crawl' : 'crawl-fallback';
    const queue=[o.root],seen=new Set([o.root]);
    await guardNavigation(page,o.root);
    while(queue.length && requests<o.maxRequests && (o.limit===null || found.size<o.limit)){
      const url=queue.shift();requests++;
      try {
        const navigation=await navigate(page,url,100);
        if(navigation.status!=='completed'){blocked.push({url,...navigation});continue;}
        add(url);
        const links=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.href));
        for(const value of links){
          const link=eligible(value);if(!link || seen.has(link))continue;seen.add(link);
          if(SKIP.test(new URL(link).pathname)){excluded.push({url:link,reason:'non-HTML resource; review separately if in scope'});continue;}
          queue.push(link);
        }
      } catch(e){errors.push({url,reason:String(e.message || e)});}
    }
    pending.push(...queue);
  }
  const discovered=[...found];
  const selected=o.limit===null ? discovered : discovered.slice(0,o.limit);
  const omitted=discovered.slice(selected.length);
  return {urls:selected,coverage:{checkedAt:new Date().toISOString(),root:o.root,source,
    selectedCount:selected.length,discoveredCount:discovered.length,pageLimit:o.limit,requests,maxRequests:o.maxRequests,
    truncated:omitted.length>0 || pending.length>0,omitted,pending:[...new Set(pending)],excluded,blocked,errors,
    completeSiteInventory:false,
    limitations:['Discovery covers URLs, not interactive states or authenticated journeys.','Sitemaps can omit pages; compare with --crawl.','No path-template deduplication. Select representative components and complete workflows explicitly.']}};
}
export async function main(argv=process.argv.slice(2)) {
  const o=parseArgs(argv),browser=await chromium.launch();
  let result;
  try {const page=await browser.newPage({serviceWorkers:'block'});result=await discover(page,o);}
  finally {await browser.close();}
  const text=result.urls.join('\n')+(result.urls.length?'\n':'');
  const coveragePath=o.out ? o.out+'.coverage.json' : './ada-discovery.coverage.json';
  if(o.out)writeFileSync(o.out,text);
  writeFileSync(coveragePath,JSON.stringify(result.coverage,null,2));
  process.stdout.write(text);
  console.error(`Selected ${result.urls.length} URLs; coverage: ${coveragePath}; truncated: ${result.coverage.truncated}`);
  return !result.urls.length || result.coverage.errors.length || result.coverage.blocked.length ? 2 : result.coverage.truncated ? 3 : 0;
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().then(code=>{process.exitCode=code;}).catch(e=>{console.error(e);process.exitCode=2;});
