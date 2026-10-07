const { test, expect } = require('@playwright/test');

test('navegação móvel funciona por teclado, fecha com Escape e destaca seção ativa', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Abrir menu' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('#main-nav a[href="#duvidas"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#main-nav a[href="#duvidas"]')).toHaveAttribute('aria-current', 'location');
  const question = page.locator('#duvidas summary').first();
  await question.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#duvidas details').first()).toHaveAttribute('open', '');
  await page.locator('[data-service="Microagulhamento"]').click();
  await expect(page.locator('#service')).toHaveValue('Microagulhamento');
});
