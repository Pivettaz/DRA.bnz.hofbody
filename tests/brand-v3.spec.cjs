const { test, expect } = require('@playwright/test');

test('cabeçalho apresenta apenas BNZ e Hero usa identidade completa enviada', async ({ page }) => {
  await page.goto('/');
  const brand = page.locator('header .brand');
  await expect(brand).toHaveText('Saúde vascular & cuidado com a pele');
  await expect(brand.locator('img')).toHaveAttribute('src', /bnz-cabecalho.webp$/);
  await expect(brand.locator('img')).toHaveAttribute('alt', 'BNZ');
  const hero = page.locator('#inicio .hero-brand-image');
  await expect(hero).toHaveAttribute('src', /bnz-hof-body-compacto.webp$/);
  await expect(hero).toHaveAttribute('alt', 'BNZ — HOF | BODY');
  await expect(hero).toHaveCSS('object-fit', 'contain');
  await expect(hero).toHaveCSS('filter', 'none');
  await expect.poll(() => hero.evaluate(img => img.complete && img.naturalWidth === 800 && img.naturalHeight === 630)).toBe(true);
  await expect(page.locator('[data-portrait]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('[NOME');
  await expect(page.locator('body')).not.toContainText('[CRM');
  await expect(page.locator('body')).not.toContainText('[IMAGEM DA DOUTORA]');
  await expect(page.locator('body')).not.toContainText('RETRATO PROFISSIONAL');
  await expect(page.locator('.credentials')).toContainText('Biomédica Esteta');
  await expect(page.locator('[data-registration]')).toBeHidden();
  await expect(page).not.toHaveTitle(/Dra\. \[NOME/);
});

test('identidade e contato atuais aparecem sem registro inventado', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sobre')).toContainText('Bruna Nobre Zenícola');
  await expect(page.locator('#contato')).toContainText('bnz.drabruna@gmail.com');
  await expect(page.locator('[data-registration]')).toBeHidden();
});

for (const width of [390,768,1440]) {
  test(`logos íntegras e prévia do topo em ${width}px`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/');
    const hero = page.locator('.hero-brand-image');
    await expect(hero).toHaveCount(1);
    await expect.poll(() => hero.evaluate(i=>i.complete && i.naturalWidth>0)).toBe(true);
    const header = page.locator('header .brand img');
    const rect = await header.boundingBox();
    expect(rect.height).toBeGreaterThanOrEqual(40);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const fits = await page.evaluate(()=>{
      const img=document.querySelector('.hero-brand-image'), box=img.getBoundingClientRect(), parent=img.parentElement.getBoundingClientRect();
      return box.left>=parent.left && box.right<=parent.right && box.top>=parent.top && box.bottom<=parent.bottom;
    });
    expect(fits).toBe(true);
    await expect(page.locator('.portrait-footnote')).toHaveCount(0);
  });
}
