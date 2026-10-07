const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('versão portátil mantém logo oficial mesmo sem a pasta de assets', async ({ page }) => {
  const temp = fs.mkdtempSync(path.join(process.env.TMPDIR, 'landing-logo-portable-'));
  const result = spawnSync(process.execPath, ['scripts/build.cjs', '--out', path.join(temp, 'build')], { encoding: 'utf8' });
  expect(result.status).toBe(0);
  fs.copyFileSync(path.join(temp, 'build/index.html'), path.join(temp, 'isolada.html'));
  await page.goto(`file://${path.join(temp, 'isolada.html')}`);
  await page.locator('#sobre').scrollIntoViewIfNeeded();
  const logo = page.locator('#sobre .professional-logo');
  await expect(logo).toHaveCount(1);
  await expect.poll(() => logo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator('header .brand-logo')).toHaveCount(1);
  await expect.poll(() => page.locator('header .brand-logo').evaluate(img => img.complete && img.naturalWidth === 406)).toBe(true);
  await expect.poll(() => page.locator('.hero-brand-image').evaluate(img => img.complete && img.naturalWidth === 800 && img.naturalHeight === 630)).toBe(true);
});

test('versão oficial clara é selecionada automaticamente sobre fundo escuro', async ({ page }) => {
  await page.route('**/styles.css', route => route.fulfill({ contentType: 'text/css', body: fs.readFileSync('styles.css', 'utf8') + '\n.logo-panel{background:#171f2f!important}' }));
  await page.goto('/');
  await expect(page.locator('#sobre .professional-logo')).toHaveAttribute('src', /logo-gold.webp$/);
});
