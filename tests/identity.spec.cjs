const { test, expect } = require('@playwright/test');

test('retrato profissional e logos oficiais carregam', async ({ page }) => {
  await page.goto('/');
  const portrait = page.locator('#sobre img[data-image="portrait"]');
  await expect(portrait).toHaveAttribute('alt', 'Bruna Nobre Zenícola em seu consultório');
  await portrait.scrollIntoViewIfNeeded();
  await expect.poll(() => portrait.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.site-header img.brand-logo')).toHaveCount(1);
  await expect(page.locator('footer img.brand-logo')).toHaveCount(1);
});

test('retrato configurado substitui o padrão na seção profissional', async ({ page }) => {
  await page.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: `window.SITE_CONFIG = { portrait: 'assets/favicon.svg' };` }));
  await page.goto('/');
  await expect(page.locator('#sobre img[data-image="portrait"]')).toHaveAttribute('src', /favicon\.svg$/);
});

test('identidade e dados profissionais são atuais e sem registro fictício', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sobre')).toContainText('Bruna Nobre Zenícola');
  await expect(page.locator('#sobre')).toContainText('Perfiloplastia');
  await expect(page.locator('[data-registration]')).toBeHidden();
  await expect(page.locator('body')).not.toContainText('[CRM');
  await expect(page.locator('.hero .button')).toHaveCSS('background-color', 'rgb(23, 31, 47)');
});
