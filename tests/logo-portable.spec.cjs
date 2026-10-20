const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

test('versão portátil mantém logos incorporados e retrato junto dos assets', async ({ page }) => {
  const temp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'landing-logo-portable-'));
  const result = spawnSync(process.execPath, ['scripts/build.cjs', '--out', path.join(temp, 'build')], { encoding: 'utf8' });
  expect(result.status).toBe(0);
  await page.goto(`file://${path.join(temp, 'build/index.html')}`);
  await page.locator('#sobre').scrollIntoViewIfNeeded();
  const portrait = page.locator('#sobre img[data-image="portrait"]');
  await expect(portrait).toHaveCount(1);
  await expect.poll(() => portrait.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator('header .brand-logo')).toHaveCount(1);
  await expect.poll(() => page.locator('header .brand-logo').evaluate(img => img.complete && img.naturalWidth === 406)).toBe(true);
  await expect.poll(() => page.locator('.hero-brand-image').evaluate(img => img.complete && img.naturalWidth === 800 && img.naturalHeight === 630)).toBe(true);
});

test('versão oficial clara é selecionada automaticamente no rodapé escuro', async ({ page }) => {
  await page.route('**/styles.css', route => route.fulfill({ contentType: 'text/css', body: fs.readFileSync('styles.css', 'utf8') + '\nfooter{background:#171f2f!important}' }));
  await page.goto('/');
  await expect(page.locator('footer .brand-logo')).toHaveAttribute('src', /logo-gold-compacta.webp$/);
});
