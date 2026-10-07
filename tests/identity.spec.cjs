const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const original = path.resolve('tests/fixtures/before-identity');
const current = path.resolve('.');
const readConfig = root => { const box = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, 'config.js'), 'utf8'), box); return JSON.parse(JSON.stringify(box.window.SITE_CONFIG)); };

test('logo profissional permanece e Hero não possui retrato', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-portrait]')).toHaveCount(0);
  await expect(page.locator('#inicio .hero-brand-image')).toHaveCount(1);
  const logo = page.locator('#sobre [data-logo] img');
  await expect(logo).toHaveCount(1);
  await expect(logo).toHaveAttribute('alt', /Logotipo oficial/);
  await expect(logo).toHaveCSS('object-fit', 'contain');
  await expect(logo).toHaveCSS('filter', 'none');
  await logo.scrollIntoViewIfNeeded();
  await expect.poll(() => logo.evaluate(img => img.complete && img.naturalWidth >= 1000)).toBe(true);
  await expect(page.locator('.site-header img.brand-logo')).toHaveCount(1);
  await expect(page.locator('footer img.brand-logo')).toHaveCount(1);
});

test('futura foto nunca reaparece na seção profissional', async ({ page }) => {
  const config = readConfig(current);
  config.portrait = 'assets/favicon.svg';
  config.portraitSecondary = 'assets/favicon.svg';
  await page.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: `window.SITE_CONFIG=${JSON.stringify(config)}` }));
  await page.goto('/');
  await expect(page.locator('#inicio img[src*="favicon"]')).toHaveCount(0);
  await expect(page.locator('#sobre img[src*="favicon"]')).toHaveCount(0);
  await expect(page.locator('#sobre [data-logo] img')).toHaveCount(1);
});

test('paleta é baseada na marca e todas as cores de componentes usam variáveis globais', async ({ page }) => {
  const css = fs.readFileSync('styles.css', 'utf8');
  const rest = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '');
  expect(rest.match(/#[a-f0-9]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/gi)).toBeNull();
  await page.goto('/');
  await expect(page.locator('.hero .button')).toHaveCSS('background-color', 'rgb(23, 31, 47)');
  await expect(page.locator('.hero .button')).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('textos, seções e links preservados fora do espaço de imagem substituído', async ({ browser }) => {
  const page = await browser.newPage();
  const snapshot = async root => {
    await page.goto(`file://${root}/index.html`);
    return await page.evaluate(() => {
      const root = document.body.cloneNode(true);
      root.querySelectorAll('.about-visual .portrait, .brand-symbol, .brand-logo, #brand-note, script, .hero-visual, .brand-detail, .credentials, .header-signature').forEach(el => el.remove());
      return {
        text: root.textContent.replace(/A Dra\. \[NOME COMPLETO\] realiza/g, 'Realiza').replace(/Para a Dra\. \[NOME COMPLETO\], um/g, 'Um').replace(/Dra\. \[NOME COMPLETO\]|\[CRM E ESTADO\]|— Médica/g, '').replace(/\s+\./g, '.').replace(/\s+/g, ' ').trim(),
        sections: [...document.querySelectorAll('main section[id]')].map(el => el.id),
        links: [...document.querySelectorAll('a')].map(el => el.getAttribute('href'))
      };
    });
  };
  expect(await snapshot(current)).toEqual(await snapshot(original));
  const before = readConfig(original), after = readConfig(current);
  for (const key of ['name','biography','crm','uf','city','whatsapp','phone','email','instagram','facebook','address','reference','hours','mapsUrl','mapsEmbedUrl','privacy','published']) expect(after[key]).toEqual(before[key]);
  await page.close();
});
