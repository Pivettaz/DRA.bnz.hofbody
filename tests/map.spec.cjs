const { test, expect } = require('@playwright/test');

test('mapa sem endereço informa pendência; configurado só incorpora após consentimento', async ({ page }) => {
  await page.goto('/');
  await page.locator('#load-map').click();
  await expect(page.locator('#info-dialog')).toBeVisible();
  await expect(page.locator('#dialog-content')).toContainText('endereço');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: `window.SITE_CONFIG = { address: 'ENDEREÇO SINTÉTICO DE TESTE', privacy: {} };` }));
  // Stub prevents sending the test address to Google. Checks integration wiring, not Google availability.
  await page.route('https://www.google.com/**', route => route.fulfill({ contentType: 'text/html', body: '<html><body>Mapa isolado para teste</body></html>' }));
  await page.reload();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.locator('#load-map').click();
  await expect(page.locator('iframe')).toHaveAttribute('title', 'Localização do atendimento no Google Maps');
  await expect(page.locator('iframe')).toHaveAttribute('src', /https:\/\/www.google.com\/maps\?q=/);
  await page.getByRole('button', { name: 'Remover mapa' }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('#load-map')).toBeFocused();
});
