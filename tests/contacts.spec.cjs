const { test, expect } = require('@playwright/test');

test('contatos ausentes informam pendência e política abre sem transmitir dados', async ({ page }) => {
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
