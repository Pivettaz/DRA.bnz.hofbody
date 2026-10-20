const { test, expect } = require('@playwright/test');

async function completeForm(page) {
  await page.locator('#name').fill('Pessoa de teste');
  await page.locator('#phone').fill('11987654321');
  await page.locator('#service').selectOption('Escleroterapia');
  await page.locator('#period').selectOption('Tarde');
  await page.locator('#consent').check();
}

test('formulário disponível valida e prepara WhatsApp sem aviso de revisão', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://wa.me/**', route => route.abort());
  await page.goto('/');
  await expect(page.locator('#contact-form')).toBeVisible();
  await expect(page.locator('#form-unavailable')).toHaveCount(0);
  await expect(page.locator('.form-card h3')).toHaveText('Conte como podemos entrar em contato');
  await expect(page.locator('#form-fields')).not.toHaveAttribute('disabled', '');
  await expect(page.locator('#contato [data-whatsapp]').first()).toHaveAttribute('href', /wa\.me\/5519999052156/);
  await expect(page.locator('[data-service="Escleroterapia"]')).toHaveAttribute('href', '#contato');
  await page.locator('.submit-button').click();
  await expect(page.locator('#name-error')).toContainText('Informe');
  await expect(page.locator('#consent-error')).toContainText('consentimento');
  await completeForm(page);
  await expect(page.locator('#phone')).toHaveValue('(11) 98765-4321');
  await page.locator('.submit-button').click();
  await expect(page.locator('#form-status')).toContainText('Mensagem preparada');
  const send = page.locator('#whatsapp-send');
  await expect(send).toBeVisible();
  const url = new URL(await send.getAttribute('href'));
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe('/5519999052156');
  expect(url.searchParams.get('text')).toContain('Pessoa de teste');
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('formulário configurado prepara link sem enviar e invalida ao editar ou revogar consentimento', async ({ page }) => {
  // Números e identidade sintéticos somente no browser isolado; nunca enviados para serviços externos.
  await page.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: `window.SITE_CONFIG = { name: 'EXEMPLO DE TESTE', whatsapp: '11987654321', privacy: { reviewed: true, controller: 'TESTE', contact: 'teste@example.invalid', retention: 'TESTE', hostingProvider: 'TESTE' } };` }));
  await page.route('https://wa.me/**', route => route.abort());
  await page.goto('/');
  await expect(page.locator('#form-unavailable')).toHaveCount(0);
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
