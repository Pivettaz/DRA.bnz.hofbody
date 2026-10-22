const { test, expect } = require('@playwright/test');

test('carrossel profissional mostra as cinco fotos e mantém uma visível por vez', async ({ page }) => {
  await page.goto('/');
  const slides = page.locator('[data-about-slide]');
  await expect(slides).toHaveCount(5);
  await expect(page.locator('img[src$="bruna-retrato-lateral.jpg"]')).toHaveCount(0);
  await expect(page.locator('[data-about-count]')).toHaveText('1 de 5');
  for (let index = 1; index < 5; index++) {
    await page.locator('[data-about-next]').click();
    await expect(page.locator('[data-about-count]')).toHaveText(`${index + 1} de 5`);
    await expect(slides.nth(index)).toBeVisible();
    await expect(slides.locator('img:visible')).toHaveCount(1);
    await expect.poll(() => slides.nth(index).locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.locator('[data-about-next]').click();
  await expect(page.locator('[data-about-count]')).toHaveText('1 de 5');
});

for (const [name, count] of [['vasinhos', 3], ['microagulhamento', 2]]) {
  test(`galeria de ${name} abre, percorre ${count} resultados e fecha`, async ({ page }) => {
    await page.goto('/');
    const trigger = page.locator(`[data-open-results="${name}"]`);
    await trigger.click();
    const dialog = page.locator('#results-dialog');
    await expect(dialog).toBeVisible();
    expect(await page.locator(`[data-results="${name}"] [data-result-slide]:visible img`).evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(page.locator('[data-results-count]')).toHaveText(`1 de ${count}`);
    for (let index = 0; index < count; index++) {
      const image = page.locator(`[data-results="${name}"] [data-result-slide]:visible img`);
      await expect(image).toHaveCount(1);
      await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(page.locator(`[data-results="${name}"] [data-result-slide]:visible figcaption`)).toContainText('Divulgação autorizada pelo usuário');
      await page.locator('[data-results-next]').click();
    }
    await expect(page.locator('[data-results-count]')).toHaveText(`1 de ${count}`);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
}

test('galerias funcionam sem rolagem horizontal no celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('[data-about-next]').click();
  await expect(page.locator('[data-about-count]')).toHaveText('2 de 5');
  await page.locator('[data-open-results="vasinhos"]').click();
  await expect(page.locator('#results-dialog')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
