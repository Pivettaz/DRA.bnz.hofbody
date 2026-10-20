const { test, expect } = require('@playwright/test');

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`layout sem rolagem horizontal em ${width}px e auditoria automática de acessibilidade`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const externalRequests = [];
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1')) externalRequests.push(request.url()); });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const results = await page.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
    expect(results.violations.map(item => ({ id: item.id, nodes: item.nodes.map(n => n.target) }))).toEqual([]);
    expect(externalRequests).toEqual([]);
    if ([390, 768, 1440].includes(width)) {
      await page.locator('#sobre').scrollIntoViewIfNeeded();
      await expect(page.locator('#sobre img[data-image="portrait"]')).toBeVisible();
      await expect.poll(() => page.locator('#sobre img[data-image="portrait"]').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    }
  });
}

test('sem JavaScript, o formulário não transmite dados via URL', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('.submit-button')).toBeDisabled();
  await expect(page.locator('.noscript-note')).toBeVisible();
  await context.close();
});
