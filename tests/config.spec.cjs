const { test, expect } = require('@playwright/test');

test('configuração única personaliza identidade e só exibe especialidade registrada', async ({ page }) => {
  await page.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: `window.SITE_CONFIG = { name: 'EXEMPLO EXCLUSIVO DE TESTE', crm: '000000', uf: 'XX', city: 'CIDADE DE TESTE', biography: 'BIOGRAFIA DE TESTE', specialty: 'ESPECIALIDADE NÃO CONFIRMADA', rqe: '00000', specialtyRegistered: false, confirmedDifferentials: ['DIFERENCIAL DE TESTE'], privacy: {} };` }));
  await page.goto('/');
  await expect(page.locator('.brand-name').first()).toHaveText('Dra. EXEMPLO EXCLUSIVO DE TESTE');
  await expect(page.locator('body')).not.toContainText('ESPECIALIDADE NÃO CONFIRMADA');
  await expect(page.locator('#differentials')).toHaveText('DIFERENCIAL DE TESTE');
  await expect(page).toHaveTitle('Dra. EXEMPLO EXCLUSIVO DE TESTE | Escleroterapia e Microagulhamento em CIDADE DE TESTE');
});
