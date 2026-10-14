const { test, expect } = require('@playwright/test');

test('navegação móvel funciona por teclado, fecha com Escape e destaca seção ativa', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Abrir menu' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#main-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#main-nav')).toBeHidden();
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
  await toggle.click();
  await page.locator('#main-nav a.button').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('navegação desktop destaca apenas a seção ativa ao clicar e rolar', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const active = page.locator('#main-nav a[aria-current="location"]');
  await expect(active).toHaveCount(1);
  await expect(active).toHaveAttribute('href', '#inicio');
  await page.locator('#main-nav a[href="#tratamentos"]').click();
  await expect(active).toHaveCount(1);
  await expect(active).toHaveAttribute('href', '#tratamentos');
  await page.evaluate(() => {
    const section = document.querySelector('#sobre');
    const header = document.querySelector('.site-header');
    window.scrollTo(0, window.scrollY + section.getBoundingClientRect().top - header.offsetHeight - 26);
  });
  await expect(active).toHaveAttribute('href', '#sobre');
  await expect(active).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('arquivo portátil mantém navegação desktop e menu móvel funcionais', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/dist/index.html');
  const active = page.locator('#main-nav a[aria-current="location"]');
  await page.locator('#main-nav a[href="#tratamentos"]').click();
  await expect(active).toHaveAttribute('href', '#tratamentos');
  await page.evaluate(() => {
    const section = document.querySelector('#sobre');
    const header = document.querySelector('.site-header');
    window.scrollTo(0, window.scrollY + section.getBoundingClientRect().top - header.offsetHeight - 26);
  });
  await expect(active).toHaveAttribute('href', '#sobre');
  await expect(active).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole('button', { name: 'Abrir menu' });
  await toggle.click();
  await expect(page.locator('#main-nav')).toBeVisible();
  await page.locator('#main-nav a[href="#duvidas"]').click();
  await expect(page.locator('#main-nav')).toBeHidden();
  expect(errors).toEqual([]);
});
