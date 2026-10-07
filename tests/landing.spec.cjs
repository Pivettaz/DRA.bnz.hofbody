const { test, expect } = require('@playwright/test');

test('página apresenta conteúdo educativo completo sem identidade médica inventada', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Cuidado individualizado para a saúde vascular e a qualidade da sua pele');
  await expect(page.locator('main section[id]')).toHaveCount(8);
  await expect(page.locator('#duvidas details')).toHaveCount(7);
  await expect(page.locator('body')).not.toContainText('[NOME COMPLETO]');
  await expect(page.locator('body')).not.toContainText('[CRM E ESTADO]');
  await expect(page.locator('body')).toContainText('não substituem consulta, diagnóstico ou avaliação profissional');
  await expect(page.locator('body')).toContainText('Infecções ativas, acne inflamatória');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
