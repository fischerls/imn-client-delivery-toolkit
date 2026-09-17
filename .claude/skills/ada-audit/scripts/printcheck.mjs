/**
 * Print-media check. Only for deliverables that become a PDF.
 *
 * Print media can expose clipping that is absent from the screen layout.
 * This is a layout heuristic, not a paginated PDF or PDF accessibility test.
 *
 * Usage:
 *   node printcheck.mjs https://example.com/report
 *   node printcheck.mjs file:///abs/path/report.html --width 720
 *
 * Options:
 *   --width <px>   printable content width (default 720 = Letter @ 96dpi
 *                  minus two 0.5in margins; A4 with those margins is about 698)
 */

import { chromium } from 'playwright';

function parseArgs(argv) {
  const o = { urls: [], width: 720 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--width') o.width = +argv[++i];
    else if (a.startsWith('http') || a.startsWith('file:')) o.urls.push(a);
  }
  if (!Number.isSafeInteger(o.width) || o.width < 1) throw new Error('--width must be a positive integer');
  if (!o.urls.length) throw new Error('usage: node printcheck.mjs <url> [--width 720]');
  return o;
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const browser = await chromium.launch();
  let bad = 0;

  for (const url of o.urls) {
    const page = await browser.newPage({ viewport: { width: o.width, height: 960 } });
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (response && response.status() >= 400) throw new Error(`HTTP ${response.status()}: print target not audited`);
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(1200);

    const report = await page.evaluate((limit) => {
      const over = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > limit + 1 || r.left < -1);
        })
        .map((el) => {
          const cls = typeof el.className === 'string' && el.className
            ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
          return {
            sel: el.tagName.toLowerCase() + cls,
            right: Math.round(el.getBoundingClientRect().right),
            nowrap: getComputedStyle(el).whiteSpace.includes('nowrap'),
          };
        });

      // break-inside:avoid on something taller than a page makes the renderer
      // shunt the whole block to a fresh page and leave the previous one mostly
      // white. Only small units should carry it.
      const tallAvoid = [...document.querySelectorAll('*')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          if (!/avoid/.test(cs.breakInside || cs.pageBreakInside || '')) return false;
          return el.getBoundingClientRect().height > 960;
        })
        .map((el) => ({
          sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
            ? '.' + el.className.trim().split(/\s+/)[0] : ''),
          h: Math.round(el.getBoundingClientRect().height),
        }));

      const tables = [...document.querySelectorAll('table')].map((t) => ({
        repeatsHeader: getComputedStyle(t.querySelector('thead') || t).display === 'table-header-group',
      }));

      return {
        docWidth: Math.round(document.documentElement.scrollWidth),
        overflowing: over.slice(0, 12),
        overflowCount: over.length,
        tallBreakAvoid: tallAvoid.slice(0, 6),
        tablesMissingHeaderRepeat: tables.filter((t) => !t.repeatsHeader).length,
        tableCount: tables.length,
      };
    }, o.width);

    const fail = report.overflowCount > 0 || report.tallBreakAvoid.length > 0;
    if (fail) bad++;
    console.log(`\n${fail ? 'REVIEW PRINT LAYOUT' : 'No print-layout candidates'}  ${url}`);
    console.log(`  printable width ${o.width}px, document ${report.docWidth}px`);
    if (report.overflowCount) {
      console.log(`  ${report.overflowCount} element(s) extend beyond a horizontal content boundary:`);
      for (const e of report.overflowing) {
        console.log(`    ${e.sel}  right=${e.right}px${e.nowrap ? '  (white-space:nowrap)' : ''}`);
      }
      console.log('  Fix in @media print: release min-width on tables, let nowrap badges wrap,');
      console.log('  shrink cell padding. Better: do not put long strings in nowrap badges at all.');
    }
    if (report.tallBreakAvoid.length) {
      console.log(`  break-inside:avoid on ${report.tallBreakAvoid.length} element(s) taller than a page:`);
      for (const e of report.tallBreakAvoid) console.log(`    ${e.sel}  ${e.h}px`);
      console.log('  Inspect actual PDF pagination before changing break-inside rules.');
    }
    if (report.tablesMissingHeaderRepeat) {
      console.log(`  ${report.tablesMissingHeaderRepeat}/${report.tableCount} table(s) without ` +
        `thead{display:table-header-group}: inspect whether headers repeat across pages.`);
    }
    await page.close();
  }

  await browser.close();
  console.log('Print-media screening only. Render and inspect the final PDF; this does not test PDF accessibility, tags, or reading order.');
  console.log(`\nPage-break whitespace is measured separately: render to PDF, then pdftoppm at`);
  console.log(`60dpi and report where ink stops per page. Large trailing whitespace that`);
  console.log(`is not on the cover or last page merits inspection; it is not proof of a defect.`);
  process.exit(bad ? 1 : 0);
}

main().catch((e) => { console.error(e.message || e); process.exit(2); });
