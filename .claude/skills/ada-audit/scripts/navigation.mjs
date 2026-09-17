// Shared navigation guards. Subresources may be cross-origin; top-level audit
// navigation stays on the explicitly selected origin, including redirects.
export function httpUrl(value, base) {
  const url = new URL(value, base);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error(`Expected an HTTP(S) URL without credentials: ${value}`);
  }
  url.hash = '';
  return url.href;
}

export function sameOrigin(value, root) {
  try { return new URL(httpUrl(value, root)).origin === new URL(root).origin; }
  catch { return false; }
}

export async function guardNavigation(page, root) {
  // Playwright routes only the first request in a redirect chain. Chromium's
  // Fetch interception also pauses redirect hops, before the off-origin fetch.
  const session = await page.context().newCDPSession(page);
  const { frameTree } = await session.send('Page.getFrameTree');
  const mainFrameId = frameTree.frame.id;
  session.on('Fetch.requestPaused', async event => {
    try {
      const block = event.frameId === mainFrameId && !sameOrigin(event.request.url, root);
      await session.send(block ? 'Fetch.failRequest' : 'Fetch.continueRequest', block
        ? { requestId:event.requestId, errorReason:'BlockedByClient' }
        : { requestId:event.requestId });
    } catch { /* Page/session closed while a request was pending. */ }
  });
  await session.send('Fetch.enable', { patterns:[{resourceType:'Document',requestStage:'Request'}] });
}

export async function navigate(page, url, settle = 2500) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(settle);
  const identity = await page.evaluate(() => ({
    title: document.title,
    text: (document.body?.innerText || '').slice(0, 1600),
    passwordField: !!document.querySelector('input[type="password"]'),
  }));
  const httpStatus = response?.status() ?? null;
  const finalUrl = page.url();
  let reason = null;
  if (!sameOrigin(finalUrl, url)) reason = 'redirected outside selected origin';
  else if (httpStatus === null || httpStatus >= 400) reason = `HTTP ${httpStatus ?? 'response unavailable'}`;
  else if (/^(just a moment|access denied|attention required|security check)/i.test(identity.title.trim())
      || /verify (?:that )?you are human|checking your browser|enable javascript and cookies to continue/i.test(identity.text)) {
    reason = 'possible challenge or access interstitial';
  } else if (identity.passwordField && finalUrl !== url && /login|sign.?in|auth/i.test(new URL(finalUrl).pathname)) {
    reason = 'redirected to authentication; intended page not audited';
  }
  return { status: reason ? 'blocked' : 'completed', httpStatus, finalUrl, title: identity.title, reason };
}

export function integer(value, name, min = 1) {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < min) throw new Error(`${name} must be an integer >= ${min}`);
  return n;
}
