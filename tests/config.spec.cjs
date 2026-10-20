const { test, expect } = require('@playwright/test');

test('configuração personaliza identidade, registro e diferenciais', async ({ page }) => {
  await page.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: `window.SITE_CONFIG = { name: 'EXEMPLO EXCLUSIVO DE TESTE', crbm: '000000', crbmRegion: '1', city: 'CIDADE DE TESTE', biography: 'BIOGRAFIA DE TESTE', confirmedDifferentials: ['DIFERENCIAL DE TESTE'], privacy: {} };` }));
  await page.goto('/');
  await expect(page.locator('[data-bind="biography"]')).toHaveText('BIOGRAFIA DE TESTE');
  await expect(page.locator('[data-registration]')).toHaveText('CRBM-1 000000');
  await expect(page.locator('#differentials .differential-copy')).toHaveText('DIFERENCIAL DE TESTE');
  await expect(page).toHaveTitle('EXEMPLO EXCLUSIVO DE TESTE | Biomédica Esteta em CIDADE DE TESTE');
});
