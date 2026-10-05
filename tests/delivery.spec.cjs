const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('HTML entregue abre diretamente e mantém interações sem servidor', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(`file://${path.resolve('dist/index.html')}`);
  await expect(page.locator('h1')).toContainText('Cuidado individualizado');
  await page.locator('.hero [data-whatsapp]').click();
  await expect(page.locator('#info-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('.submit-button').click();
  await expect(page.locator('#name-error')).toContainText('Informe');
  expect(errors).toEqual([]);
});

test('build publicado inclui SEO verificável no HTML sem JavaScript', async () => {
  const temp = fs.mkdtempSync(path.join(process.env.TMPDIR, 'landing-published-'));
  const config = {
    // Fixture interna; nunca publicada e nunca enviada a serviços externos.
    name: 'IDENTIDADE SINTÉTICA DE TESTE', biography: 'BIO TESTE', crm: '123456', uf: 'SP', city: 'CIDADE TESTE',
    whatsapp: '11987654321', phone: '11987654321', email: 'teste@example.invalid', instagram: 'https://example.invalid/perfil',
    address: 'ENDEREÇO SINTÉTICO', reference: 'REFERÊNCIA TESTE', hours: 'HORÁRIOS TESTE', education: 'FORMAÇÃO TESTE', complementaryEducation: 'CURSOS TESTE',
    portrait: 'assets/favicon.svg', siteUrl: 'https://example.invalid', brand: 'MARCA TESTE',
    confirmedDifferentials: ['TESTE A', 'TESTE B', 'TESTE C'], published: true,
    privacy: { reviewed: true, controller: 'TESTE', contact: 'teste@example.invalid', retention: 'TESTE', hostingProvider: 'TESTE' }
  };
  const configFile = path.join(temp, 'config.js'); fs.writeFileSync(configFile, `window.SITE_CONFIG=${JSON.stringify(config)}`);
  const out = path.join(temp, 'out');
  const result = spawnSync(process.execPath, ['scripts/build.cjs', '--config', configFile, '--out', out], { encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  expect(html).toContain('content="index, follow"');
  expect(html).toContain('<link rel="canonical" href="https://example.invalid">');
  expect(html).toContain('property="og:image"');
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  expect(schema['@type']).toBe('Physician');
  expect(schema.name).toBe('Dra. IDENTIDADE SINTÉTICA DE TESTE');
  expect(schema.medicalSpecialty).toBeUndefined();
  expect(fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8')).toContain('https://example.invalid/');
});

test('botão flutuante não esconde conteúdo da faixa de tratamentos', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const overlap = await page.evaluate(() => {
    const a = document.querySelector('.floating-whatsapp').getBoundingClientRect();
    const b = document.querySelector('.strip-end').getBoundingClientRect();
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  });
  expect(overlap).toBe(false);
});
