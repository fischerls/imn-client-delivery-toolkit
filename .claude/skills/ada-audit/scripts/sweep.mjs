/** WCAG 2.2 A/AA screening, with full evidence and explicit review states.
 * node sweep.mjs --urls urls.txt --out results.json
 * Exit: 0 no automated findings, 1 A/AA findings, 2 blocked/error, 3 needs review.
 * Every exit still requires the manual layer before an audit conclusion.
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { guardNavigation, navigate, httpUrl, integer } from './navigation.mjs';

export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa', 'best-practice'];
export function parseArgs(argv) {
  const o = { urls: [], out: './ada-results.json', settle: 2500, desktop: 1440, mobile: 390, concurrency: 3, quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--urls') o.urls.push(...readFileSync(argv[++i], 'utf8').split(/\r?\n/).map(s=>s.trim()).filter(s=>s && !s.startsWith('#')));
    else if (a === '--out') { o.out = argv[++i]; if (!o.out) throw new Error('--out requires a path'); }
    else if (['--settle','--desktop','--mobile','--concurrency'].includes(a)) o[a.slice(2)] = integer(argv[++i], a, a === '--settle' ? 0 : 1);
    else if (a === '--quiet') o.quiet = true;
    else if (a.startsWith('--')) throw new Error(`Unknown flag ${a}`);
    else o.urls.push(a);
  }
  o.urls = [...new Set(o.urls.map(u=>httpUrl(u)))];
  if (!o.urls.length) throw new Error('Provide HTTP(S) URLs or --urls <file>');
  return o;
}

// Inventory only. Target exceptions and focus visibility require evaluation of
// actual behavior; DOM dimensions or stylesheet counts do not prove conformance.
export const pageProbe = () => {
  const visible = el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility === 'visible';
  };
  const selector = el => el.id ? `#${CSS.escape(el.id)}` : el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).map(CSS.escape).join('.') : '');
  const targets = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=checkbox],[role=radio],[role=slider],[role=tab],[role=menuitem],[onclick]')].filter(visible);
  const smallTargets = targets.flatMap(el => {
    const r = el.getBoundingClientRect();
    return r.width < 24 || r.height < 24 ? [{ selector: selector(el), width:r.width, height:r.height, disposition:'inventory-only', exceptionsEvaluated:false }] : [];
  });
  let focusRules = 0, inspected = 0, blocked = 0;
  const walk = rules => { for (const rule of rules) { inspected++; if (/:focus(?:-visible|-within)?\b/.test(rule.selectorText || '')) focusRules++; if (rule.cssRules) walk(rule.cssRules); } };
  for (const sheet of document.styleSheets) { try { walk(sheet.cssRules); } catch { blocked++; } }
  const viewportMeta = document.querySelector('meta[name=viewport]')?.content || '';
  const maximumScale = viewportMeta.match(/maximum-scale\s*=\s*([\d.]+)/i);
  return {
    title:document.title, lang:document.documentElement.lang, hasMain:!!document.querySelector('main,[role=main]'),
    viewportMeta, zoomRestrictionCandidate:/user-scalable\s*=\s*(no|0)(?:\s|,|$)/i.test(viewportMeta) || !!(maximumScale && Number(maximumScale[1]) < 2),
    smallTargets, smallTargetCount:smallTargets.length,
    focusRules, cssRulesInspected:inspected, inaccessibleStylesheets:blocked,
    focusInterpretation:'Inventory only. Verify computed focus appearance and visibility by keyboard.',
    accessibilityStatementLink:[...document.querySelectorAll('a[href]')].find(a=>/accessib/i.test(a.textContent || ''))?.href || null,
  };
};

export const reflowProbe = () => {
  const root = document.documentElement;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    if (!r.width || !r.height || cs.visibility !== 'visible' || cs.display === 'none') continue;
    const reasons = [];
    if (r.left < -1 || r.right > root.clientWidth + 1) reasons.push('outside viewport');
    if (el.clientWidth && el.scrollWidth > el.clientWidth + 1 && /hidden|clip|auto|scroll/.test(cs.overflowX)) reasons.push('nested horizontal overflow or clipping');
    if (el.clientHeight && el.scrollHeight > el.clientHeight + 1 && /hidden|clip/.test(cs.overflowY)) reasons.push('vertical clipping candidate');
    if (reasons.length) offenders.push({
      selector:el.id ? `#${CSS.escape(el.id)}` : el.tagName.toLowerCase(),
      html:el.outerHTML.slice(0,500), left:r.left, right:r.right,
      overflowX:cs.overflowX, overflowY:cs.overflowY, reasons,
      inlineStyle:el.getAttribute('style'),
    });
  }
  const needsReview = root.scrollWidth > root.clientWidth + 1 || offenders.length > 0;
  return { status:needsReview ? 'needs-review' : 'no-candidates', ok:needsReview ? null : true,
    scrollW:root.scrollWidth, clientW:root.clientWidth, offenders,
    interpretation:'Check loss of content/functionality and two-dimensional-content exceptions. No candidates is not a manual reflow pass.' };
};

export const reducedMotionProbe = () => [...document.querySelectorAll('body *')].filter(el=>{
  const r=el.getBoundingClientRect(), cs=getComputedStyle(el);
  return cs.display !== 'none' && cs.visibility === 'visible' && Number(cs.opacity) <= .05 && r.width > 40 && r.height > 20 && el.textContent.trim().length > 10;
}).map(el=>({html:el.outerHTML.slice(0,500), text:el.textContent.trim().slice(0,100)}));

export async function runAxe(page) {
  const raw = await new AxeBuilder({page}).withTags(AXE_TAGS).analyze();
  const summary = arr => arr.map(v=>({id:v.id, impact:v.impact, help:v.help, helpUrl:v.helpUrl, wcag:v.tags.filter(t=>t.startsWith('wcag')), count:v.nodes.length}));
  return { raw, summary:{violations:summary(raw.violations), incomplete:summary(raw.incomplete)} };
}

export async function firstTabStop(ctx, url, o) {
  const p=await ctx.newPage();
  try {
    await p.setViewportSize({width:o.desktop,height:900});
    await guardNavigation(p,url);
    const navigation=await navigate(p,url,o.settle);
    if (navigation.status !== 'completed') return {...navigation};
    await p.keyboard.press('Tab');
    const focused=p.locator(':focus');
    if (!await focused.count()) return {status:'completed',none:true,skipLink:{status:'not-tested',reason:'No first tab stop'}};
    // Playwright's accessibility snapshot respects native and ARIA names. Name
    // failures are taken from axe, never from a textContent approximation.
    const accessibilitySnapshot=await focused.ariaSnapshot();
    const observation=await focused.evaluate(el=>{
      const cs=getComputedStyle(el), r=el.getBoundingClientRect();
      const href=el.getAttribute('href') || '';
      let target=null;
      try { if (href.startsWith('#') && href.length>1) target=document.getElementById(decodeURIComponent(href.slice(1))); } catch {}
      return {tag:el.tagName.toLowerCase(),href,text:el.textContent.trim(),outline:cs.outline,boxShadow:cs.boxShadow,
        visibleCandidate:r.width>0 && r.height>0 && cs.visibility==='visible' && Number(cs.opacity)>0 && r.right>0 && r.left<innerWidth,
        looksLikeSkipLink:href.startsWith('#') && /skip|main|content/i.test(href+' '+el.textContent),
        targetExists:!!target};
    });
    let skipLink={status:'not-tested',reason:'First tab stop is not an identified skip link; inspect other bypass mechanisms'};
    if (observation.looksLikeSkipLink) {
      if (!observation.targetExists) skipLink={status:'needs-review',reason:'Skip-link target missing'};
      else {
        await p.keyboard.press('Enter');
        await p.waitForTimeout(100);
        const focusMoved=await p.evaluate(href=>{
          const target=document.getElementById(decodeURIComponent(href.slice(1)));
          return !!target && (document.activeElement===target || target.contains(document.activeElement));
        },observation.href);
        skipLink={status:focusMoved && observation.visibleCandidate ? 'mechanism-observed' : 'needs-review',focusMoved,
          reason:'Inspect destination, next tab stop, visibility, and repeated-block bypass manually'};
      }
    }
    return {status:'completed',accessibilitySnapshot,...observation,skipLink};
  } catch(e) { return {status:'error',error:String(e.message || e)}; }
  finally { await p.close(); }
}

export async function reducedMotionPass(browser,url,o) {
  const ctx=await browser.newContext({viewport:{width:o.desktop,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  try {
    const p=await ctx.newPage(); await guardNavigation(p,url);
    const navigation=await navigate(p,url,o.settle);
    if(navigation.status!=='completed') return {...navigation};
    const candidates=await p.evaluate(reducedMotionProbe);
    return {status:candidates.length ? 'needs-review' : 'completed',candidates,
      scope:'Low-opacity text inventory at desktop width. Interaction animation (AAA 2.3.3) remains manual.'};
  } catch(e) { return {status:'error',error:String(e.message || e)}; }
  finally {await ctx.close();}
}

export function verdict(rec) {
  const reasons=[], review=[];
  for (const width of ['desktop','mobile']) {
    const violations=(rec[width]?.violations || []).filter(v=>v.wcag.some(t=>/^wcag2(?:1|2)?a{1,2}$/.test(t)));
    if(violations.length) reasons.push(`${violations.length} axe A/AA rule(s) at ${width}`);
    if(rec[width]?.incomplete.length) review.push(`Unresolved axe checks at ${width}`);
  }
  if(rec.reflow?.status==='needs-review') review.push('Reflow/clipping candidates require inspection');
  if(rec.probes?.zoomRestrictionCandidate) review.push('Verify text resizing and zoom restriction');
  if(rec.firstTabStop?.skipLink?.status==='needs-review') review.push('Verify skip-link operation');
  if(rec.reducedMotion?.status==='needs-review') review.push('Inspect reduced-motion candidates (separate from AA verdict)');
  const blocked=rec.navigation?.status==='blocked' || rec.mobileNavigation?.status==='blocked' || rec.firstTabStop?.status==='blocked' || rec.reducedMotion?.status==='blocked';
  const error=!!rec.error || rec.firstTabStop?.status==='error' || rec.reducedMotion?.status==='error';
  const status=blocked ? 'blocked' : error ? 'error' : reasons.length ? 'findings' : review.length ? 'needs-review' : 'no-automated-findings';
  return {status,fail:reasons.length ? true : (blocked || error || review.length ? null : false), reasons,review,
    manualRequired:true,conformance:'not-determined'};
}

export async function auditPage(browser,url,o) {
  const ctx=await browser.newContext({viewport:{width:o.desktop,height:900},serviceWorkers:'block'});
  const rec={url,checkedAt:new Date().toISOString(),testedStates:['initial page only'],manualStatus:'not-tested'};
  const raw={};
  try {
    const page=await ctx.newPage(); await guardNavigation(page,url);
    rec.navigation=await navigate(page,url,o.settle);
    if(rec.navigation.status==='completed') {
      const desktop=await runAxe(page); rec.desktop=desktop.summary; raw.desktop=desktop.raw;
      rec.probes=await page.evaluate(pageProbe);
      rec.firstTabStop=await firstTabStop(ctx,url,o);
      // Reload at mobile width so width-dependent initialization executes.
      await page.setViewportSize({width:o.mobile,height:844});
      const mobileNavigation=await navigate(page,url,o.settle);
      rec.mobileNavigation=mobileNavigation;
      if(mobileNavigation.status!=='completed') {rec.error='Mobile navigation blocked';}
      else {
        const mobile=await runAxe(page); rec.mobile=mobile.summary; raw.mobile=mobile.raw;
        rec.probesMobile=await page.evaluate(pageProbe);
        await page.setViewportSize({width:320,height:800});
        await page.waitForTimeout(o.settle);
        rec.reflow=await page.evaluate(reflowProbe);
      }
      rec.reducedMotion=await reducedMotionPass(browser,url,o);
    }
  } catch(e) {rec.error=String(e.message || e);}
  finally {await ctx.close();}
  rec.verdict=verdict(rec);
  return {rec,raw};
}

export async function main(argv=process.argv.slice(2)) {
  const o=parseArgs(argv), results={}, rawResults={}, queue=[...o.urls];
  const browser=await chromium.launch();
  const browserVersion=browser.version();
  try {
    const worker=async()=>{while(queue.length){const url=queue.shift();const {rec,raw}=await auditPage(browser,url,o);results[url]=rec;rawResults[url]=raw;if(!o.quiet) console.log(`${rec.verdict.status}  ${url}`);}};
    await Promise.all(Array.from({length:Math.min(o.concurrency,o.urls.length)},worker));
  } finally {await browser.close();}
  const values=Object.values(results);
  const summary={checkedAt:new Date().toISOString(),pages:values.length,
    pagesFailing:values.filter(r=>r.verdict.fail===true).length,
    pagesBlocked:values.filter(r=>r.verdict.status==='blocked').length,
    pagesErrored:values.filter(r=>r.verdict.status==='error').length,
    pagesNeedingReview:values.filter(r=>r.verdict.review.length).length,
    manualStatus:'not-tested',conformance:'not-determined'};
  const rawFile=resolve(o.out+'.raw.json');
  writeFileSync(rawFile,JSON.stringify({schemaVersion:2,options:o,browserVersion,results:rawResults},null,2));
  writeFileSync(o.out,JSON.stringify({schemaVersion:2,summary,rawFile,options:o,browserVersion,results},null,2));
  console.log(JSON.stringify(summary));
  console.log(`Saved ${o.out} and ${rawFile}. Complete references/manual-layer.md before drawing an audit conclusion.`);
  return summary.pagesBlocked || summary.pagesErrored ? 2 : summary.pagesFailing ? 1 : summary.pagesNeedingReview ? 3 : 0;
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) main().then(code=>{process.exitCode=code;}).catch(e=>{console.error(e);process.exitCode=2;});
