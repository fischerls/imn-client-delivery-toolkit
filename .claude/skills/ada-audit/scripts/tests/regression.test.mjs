import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { main as sweep, parseArgs, verdict, firstTabStop, reducedMotionPass } from '../sweep.mjs';
import { discover, parseArgs as discoveryArgs, sitemapEntries } from '../discover.mjs';
import { sameOrigin } from '../navigation.mjs';

const listen = server=>new Promise(r=>server.listen(0,'127.0.0.1',r));
const stop = server=>new Promise(r=>server.close(r));
const shell=(body,css='',title='Fixture')=>`<!doctype html><html lang="en"><head><title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:white;color:#111;font:18px Arial;margin:16px}h1{font-size:24px}a{color:#003366}input,button{min-height:32px}${css}</style></head><body><main><h1>${title}</h1>${body}</main></body></html>`;
const svg='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2240%22%3E%3C/svg%3E';
const fixtures={
  '/logo':shell(`<a href="/"><img alt="Home" width="80" height="40" src="${svg}"></a>`),
  '/labelledby':shell('<button aria-labelledby="name"></button><p id="name">Open details</p>'),
  '/submit':shell('<form><input type="submit" value="Send request"></form>'),
  '/label':shell('<label for="name">Name</label><input id="name">'),
  '/hidden-frame':shell('<p>Welcome.</p><iframe style="display:none" src="about:blank"></iframe>'),
  '/challenge':shell('<p>Please verify you are human.</p>','','Just a moment...'),
  '/soft-challenge':shell('<p>Please verify you are human.</p>','','Security check'),
  '/clipped':shell('<p style="width:600px">Required text that must remain visible and readable at narrow widths, including this sentence at the end.</p>','html,body{overflow-x:hidden}'),
  '/nested':shell('<div style="width:180px;overflow:hidden"><p style="width:260px">Required content is clipped inside this small container.</p></div>'),
  '/broken-skip':shell('<a href="#main-content">Skip to main content</a>'),
  '/working-skip':shell('<a href="#main-content">Skip to main content</a><div id="main-content" tabindex="-1">Destination</div>'),
  '/focus':shell('<button>Open details</button>','@media(min-width:1px){button:focus-visible{outline:3px solid black}}'),
  '/spacing':shell('<div><button style="min-height:0;width:20px;height:20px;padding:0" aria-label="More">+</button></div>'),
  '/toolbar':shell('<div><button style="height:18px;min-height:0;padding:0">Previous section</button><button style="height:18px;min-height:0;padding:0">Following section</button><button style="height:18px;min-height:0;padding:0">Additional settings</button></div>'),
  '/missing-alt':shell(Array.from({length:5},()=>`<img width="80" height="40" src="${svg}">`).join('')),
  '/print-width':shell('<div style="width:760px">Print content</div>'),
};

test('CLI validation and verdicts do not confuse unknown with failure',()=>{
  assert.throws(()=>parseArgs(['https://example.com','--concurrency','NaN']));
  assert.throws(()=>discoveryArgs(['https://example.com','--limit','0']));
  assert.equal(discoveryArgs(['https://example.com','--all']).limit,null);
  assert.equal(discoveryArgs(['https://example.com','--all','--limit','2']).limit,2);
  assert.equal(sameOrigin('https://example.com.evil.test/path','https://example.com'),false);
  assert.equal(sameOrigin('https://example.com:8443/path','https://example.com'),false);
  assert.equal(verdict({firstTabStop:{status:'error',error:'timeout'}}).fail,null);
  assert.equal(verdict({reducedMotion:{status:'error',error:'timeout'}}).status,'error');
  assert.equal(verdict({desktop:{violations:[{wcag:['best-practice']}],incomplete:[]}}).fail,false);
  assert.equal(verdict({desktop:{violations:[],incomplete:[{id:'color-contrast'}]}}).status,'needs-review');
});

test('browser regressions, retained evidence, discovery boundaries, and print geometry',async t=>{
  const dir=await mkdtemp(join(tmpdir(),'ada-regressions-'));
  let origin, outsideHits=0;
  const outside=createServer((req,res)=>{outsideHits++;res.end('Outside origin');});
  await listen(outside);
  const outsideUrl=`http://127.0.0.1:${outside.address().port}`;
  const server=createServer((req,res)=>{
    if(req.url==='/sitemap.xml'){
      res.setHeader('Content-Type','application/xml');
      res.end(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url>${Array.from({length:45},(_,i)=>`<url><loc>${origin}/pages/${i}</loc></url>`).join('')}<url><loc>${origin}/checkout/address</loc></url><url><loc>${origin}/checkout/payment</loc></url><url><loc>${outsideUrl}/external</loc></url><url><loc>${origin}/guide.pdf</loc></url></urlset>`);
    }else if(req.url==='/sitemap_index.xml'){
      res.writeHead(302,{Location:outsideUrl+'/sitemap.xml'});res.end();
    }else if(req.url.includes('sitemap')){res.writeHead(404);res.end();}
    else if(req.url==='/redirect'){res.writeHead(302,{Location:outsideUrl+'/outside'});res.end();}
    else {
      res.writeHead(req.url==='/challenge'?403:200,{'Content-Type':'text/html'});
      res.end(fixtures[req.url] || shell(`<a href="/checkout/address">Address</a><a href="/checkout/payment">Payment</a><a href="/redirect">Redirect</a><a href="${outsideUrl}/outside">Outside</a><a href="/guide.pdf">Guide</a>`));
    }
  });
  await listen(server);origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch();
  try {
    let report,raw;
    await t.test('actual sweep distinguishes valid, blocked, candidate and failed pages',async()=>{
      const out=join(dir,'results.json');
      const paths=Object.keys(fixtures).filter(p=>p!=='/print-width');
      const code=await sweep([...paths.map(p=>origin+p),'--settle','20','--concurrency','3','--quiet','--out',out]);
      assert.equal(code,2,'blocked pages take precedence');
      report=JSON.parse(await readFile(out,'utf8'));raw=JSON.parse(await readFile(report.rawFile,'utf8'));
      for(const path of ['/logo','/labelledby','/submit','/label','/hidden-frame']){
        assert.equal(report.results[origin+path].verdict.fail,false,path);
        assert.equal(report.results[origin+path].verdict.conformance,'not-determined');
      }
      assert.match(report.results[origin+'/logo'].firstTabStop.accessibilitySnapshot,/Home/);
      assert.match(report.results[origin+'/submit'].firstTabStop.accessibilitySnapshot,/Send request/);
      assert.match(report.results[origin+'/labelledby'].firstTabStop.accessibilitySnapshot,/Open details/);
      for(const path of ['/challenge','/soft-challenge']){
        const rec=report.results[origin+path];assert.equal(rec.verdict.status,'blocked');assert.equal(rec.verdict.fail,null);assert.equal(rec.desktop,undefined);
      }
      assert.equal(report.results[origin+'/challenge'].navigation.httpStatus,403);
      for(const path of ['/clipped','/nested']){
        assert.equal(report.results[origin+path].reflow.status,'needs-review',path);
        assert.equal(report.results[origin+path].reflow.ok,null,path);
      }
      assert.equal(report.results[origin+'/broken-skip'].firstTabStop.skipLink.status,'needs-review');
      assert.equal(report.results[origin+'/working-skip'].firstTabStop.skipLink.focusMoved,true);
      assert.equal(report.results[origin+'/focus'].probes.focusRules,1);
      assert.match(report.results[origin+'/focus'].firstTabStop.outline,/3px/);
      assert.equal(report.results[origin+'/spacing'].probes.smallTargets[0].exceptionsEvaluated,false);
      assert.equal(report.results[origin+'/toolbar'].probes.smallTargetCount,3);
      assert.equal(report.results[origin+'/missing-alt'].verdict.fail,true);
      for(const path of paths.filter(p=>!p.includes('challenge')))assert.equal(report.results[origin+path].reducedMotion.status,'completed');
    });
    await t.test('full axe evidence retains all nodes, structured targets, check data and metadata',()=>{
      const data=raw.results[origin+'/missing-alt'].desktop;
      const issue=data.violations.find(v=>v.id==='image-alt');
      assert.equal(issue.nodes.length,5);
      assert.ok(Array.isArray(issue.nodes[0].target));
      assert.ok(issue.nodes[0].any.length);
      assert.ok(data.testEngine.version);
      assert.ok(data.testEnvironment.userAgent);
      assert.ok(Array.isArray(data.incomplete));assert.ok(Array.isArray(data.passes));assert.ok(Array.isArray(data.inapplicable));
    });
    await t.test('navigation errors are explicit in both supplemental probes',async()=>{
      const ctx=await browser.newContext();
      try{
        const first=await firstTabStop(ctx,'http://127.0.0.1:1/',{desktop:1440,settle:0});
        const motion=await reducedMotionPass(browser,'http://127.0.0.1:1/',{desktop:1440,settle:0});
        assert.equal(first.status,'error');assert.equal(motion.status,'error');
      }finally{await ctx.close();}
    });
    await t.test('sitemap --all keeps distinct workflow steps, excludes other origins, decodes XML',async()=>{
      const page=await browser.newPage();
      try{
        const o=discoveryArgs([origin,'--all']);const result=await discover(page,o);
        assert.equal(result.urls.length,48);assert.ok(result.urls.includes(origin+'/checkout/address'));assert.ok(result.urls.includes(origin+'/checkout/payment'));
        assert.ok(result.urls.every(u=>sameOrigin(u,origin)));assert.equal(result.coverage.truncated,false);
        assert.ok(result.coverage.excluded.some(e=>e.url.endsWith('/guide.pdf')));
        assert.ok(result.coverage.blocked.some(e=>e.reason.includes('sitemap redirect')));
        const capped=await discover(page,discoveryArgs([origin,'--all','--limit','2']));assert.equal(capped.urls.length,2);assert.equal(capped.coverage.truncated,true);assert.equal(capped.coverage.omitted.length,46);
        const entries=await sitemapEntries(page,`<urlset><url><loc>${origin}/?a=1&amp;b=2</loc></url><url><loc><![CDATA[${origin}/?c=3&d=4]]></loc></url></urlset>`);
        assert.equal(entries.urls[0],origin+'/?a=1&b=2');assert.equal(entries.urls[1],origin+'/?c=3&d=4');
        await assert.rejects(()=>sitemapEntries(page,'<urlset>'));
      }finally{await page.close();}
    });
    await t.test('crawl refuses off-origin redirects and records pending URLs at its cap',async()=>{
      const page=await browser.newPage();
      try{
        const result=await discover(page,discoveryArgs([origin,'--crawl','--all']));
        assert.ok(result.urls.includes(origin+'/checkout/address'));assert.ok(result.urls.includes(origin+'/checkout/payment'));
        assert.ok(result.coverage.errors.some(e=>e.url.endsWith('/redirect')));
        assert.equal(outsideHits,0,'off-origin requests must never be fetched');
      }finally{await page.close();}
      const page2=await browser.newPage();
      try{const result=await discover(page2,discoveryArgs([origin,'--crawl','--limit','1']));assert.equal(result.coverage.truncated,true);assert.ok(result.coverage.pending.length);}
      finally{await page2.close();}
    });
    await t.test('default print content width flags a 760px block',async()=>{
      const script=fileURLToPath(new URL('../printcheck.mjs',import.meta.url));
      const result=await new Promise((resolve,reject)=>{
        const proc=spawn(process.execPath,[script,origin+'/print-width']);let text='';
        proc.stdout.on('data',b=>text+=b);proc.stderr.on('data',b=>text+=b);proc.on('error',reject);proc.on('close',code=>resolve({code,text}));
      });
      assert.equal(result.code,1);assert.match(result.text,/720px/);assert.match(result.text,/REVIEW PRINT LAYOUT/);
    });
  }finally{await browser.close();await stop(server);await stop(outside);await rm(dir,{recursive:true,force:true});}
});
