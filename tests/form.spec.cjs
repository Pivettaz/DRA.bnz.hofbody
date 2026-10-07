const { test, expect } = require('@playwright/test');

async function completeForm(page) {
  await page.locator('#name').fill('Pessoa de teste');
  await page.locator('#phone').fill('11987654321');
  await page.locator('#service').selectOption('Escleroterapia');
  await page.locator('#period').selectOption('Tarde');
  await page.locator('#consent').check();
}

test('formulário valida dados e consentimento e não simula envio sem configuração', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.submit-button').click();
  await expect(page.locator('#name-error')).toContainText('Informe');
  await expect(page.locator('#consent-error')).toContainText('consentimento');
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name')).toBeFocused();
  await completeForm(page);
  await expect(page.locator('#phone')).toHaveValue('(11) 98765-4321');
  await page.locator('.submit-button').click();
  await expect(page.locator('#form-status')).toContainText('Nenhum dado foi enviado');
  await expect(page.locator('#whatsapp-send')).toBeHidden();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('formulário configurado prepara link sem enviar e invalida ao editar ou revogar consentimento', async ({ page }) => {
  // Números e identidade sintéticos somente no browser isolado; nunca enviados para serviços externos.
  await page.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: `window.SITE_CONFIG = { name: 'EXEMPLO DE TESTE', whatsapp: '11987654321', privacy: { reviewed: true, controller: 'TESTE', contact: 'teste@example.invalid', retention: 'TESTE', hostingProvider: 'TESTE' } };` }));
  await page.route('https://wa.me/**', route => route.abort());
  await page.goto('/');
  await completeForm(page);
  await page.locator('.submit-button').click();
  await expect(page.locator('#form-status')).toContainText('Mensagem preparada');
  const send = page.locator('#whatsapp-send');
  await expect(send).toBeVisible();
  const href = new URL(await send.getAttribute('href'));
  expect(href.hostname).toBe('wa.me');
  expect(href.searchParams.get('text')).toContain('Pessoa de teste');
  expect(href.searchParams.get('text')).toContain('Escleroterapia');
  await expect(send).toHaveAttribute('rel', 'noopener noreferrer');
  await page.locator('#name').fill('Outro nome de teste');
  await expect(send).toBeHidden();
  await page.locator('.submit-button').click();
  await expect(send).toBeVisible();
  await page.locator('#consent').uncheck();
  await expect(send).toBeHidden();
});
