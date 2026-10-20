const { test, expect } = require('@playwright/test');

test('política exibe informações confirmadas e revisão concluída', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer [data-dialog="privacy"]').click();
  await expect(page.locator('#dialog-content')).toContainText('Bruna Nobre Zenícola');
  await expect(page.locator('#dialog-content')).toContainText('bnz.drabruna@gmail.com');
  await expect(page.locator('#dialog-content')).toContainText('6 meses sem novas interações');
  await expect(page.locator('#dialog-content')).toContainText('Vercel');
  await expect(page.locator('#dialog-content .draft-note')).toHaveCount(0);
  expect(await page.evaluate(() => window.SITE_CONFIG.privacy.reviewed)).toBe(true);
});

test('contatos ausentes informam pendência e política abre sem transmitir dados', async ({ page }) => {
  await page.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: 'window.SITE_CONFIG = { privacy: {} };' }));
  await page.goto('/');
  await page.locator('.hero [data-whatsapp]').click();
  await expect(page.locator('#info-dialog')).toBeVisible();
  await expect(page.locator('#dialog-content')).toContainText('WhatsApp ainda não foi configurado');
  await page.keyboard.press('Escape');
  await expect(page.locator('#info-dialog')).not.toBeVisible();
  await page.locator('footer [data-dialog="privacy"]').click();
  await expect(page.locator('#dialog-title')).toHaveText('Política de Privacidade');
  await expect(page.locator('#dialog-content')).toContainText('[RESPONSÁVEL PELO TRATAMENTO DOS DADOS]');
  await expect(page.locator('#dialog-content')).toContainText('não armazena');
  await page.locator('#info-dialog > .dialog-close').click();
  await expect(page.locator('footer [data-dialog="privacy"]')).toBeFocused();
  await page.locator('footer [data-dialog="cookies"]').click();
  await expect(page.locator('#dialog-title')).toHaveText('Aviso de Cookies');
  await expect(page.locator('#dialog-content')).toContainText('não utiliza cookies próprios');
});
