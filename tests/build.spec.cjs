const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

test('build gera HTML portátil e SEO estático sem publicar identidade incompleta', async () => {
  const temp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'landing-build-'));
  const out = path.join(temp, 'site');
  const result = spawnSync(process.execPath, ['scripts/build.cjs', '--out', out], { encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  expect(html).toContain('noindex, nofollow');
  expect(html).not.toContain('src="app.js"');
  expect(html).not.toContain('href="styles.css"');
  expect(html).not.toContain('application/ld+json');
  expect(fs.readFileSync(path.join(out, 'robots.txt'), 'utf8')).toContain('Disallow: /');
});

test('build em modo publicado recusa campos obrigatórios ausentes', async () => {
  const temp = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'landing-build-'));
  const config = path.join(temp, 'config.js');
  fs.writeFileSync(config, 'window.SITE_CONFIG = { published: true };');
  const result = spawnSync(process.execPath, ['scripts/build.cjs', '--config', config, '--out', path.join(temp, 'site')], { encoding: 'utf8' });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Publicação bloqueada');
});
