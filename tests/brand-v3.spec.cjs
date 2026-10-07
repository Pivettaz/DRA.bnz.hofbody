const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const baseline = path.resolve('tests/fixtures/before-v3');
const readConfig = dir => { const box = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(dir,'config.js'),'utf8'),box); return JSON.parse(JSON.stringify(box.window.SITE_CONFIG)); };

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
  await expect(page.locator('.credentials, .brand-detail')).toHaveCount(0);
  await expect(page).not.toHaveTitle(/Dra\. \[NOME/);
});

test('cores e funcionalidades permanecem inalteradas', async ({ page }) => {
  const css = fs.readFileSync('styles.css','utf8');
  const beforeCSS = fs.readFileSync(path.join(baseline,'styles.css'),'utf8');
  expect(css.match(/:root\{[\s\S]*?\}/)[0]).toBe(beforeCSS.match(/:root\{[\s\S]*?\}/)[0]);
  const beforeJS = fs.readFileSync(path.join(baseline,'app.js'),'utf8'), afterJS = fs.readFileSync('app.js','utf8');
  expect(afterJS.slice(afterJS.indexOf('  const menu ='))).toBe(beforeJS.slice(beforeJS.indexOf('  const menu =')));
  const before = readConfig(baseline), after = readConfig('.');
  for (const key of ['whatsapp','phone','email','instagram','facebook','address','mapsUrl','mapsEmbedUrl','privacy','published']) expect(after[key]).toEqual(before[key]);
  await page.goto('/');
  const snapshot = () => ({ nav: [...document.querySelectorAll('#main-nav a')].map(x=>[x.textContent,x.getAttribute('href')]), sections:[...document.querySelectorAll('main section[id]')].map(x=>x.id), treatment:document.querySelector('#tratamentos').textContent, faq:document.querySelector('#duvidas').textContent, contact:document.querySelector('#contato').textContent });
  const current = await page.evaluate(snapshot);
  await page.goto(`file://${baseline}/index.html`);
  expect(current).toEqual(await page.evaluate(snapshot));
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
    const label=width===390?'celular':width===768?'tablet':'desktop';
    fs.mkdirSync('qa/v3',{recursive:true});
    const height=await page.locator('#inicio').evaluate(el=>Math.ceil(el.getBoundingClientRect().bottom));
    await page.screenshot({path:`qa/v3/${label}-cabecalho-hero.png`,fullPage:true,clip:{x:0,y:0,width,height}});
  });
}
