/* Build estático, sem bibliotecas de produção. config.js é código local confiável,
   nunca aceite ou execute um arquivo de configuração enviado por visitantes. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const option = (flag, fallback) => args.includes(flag) ? path.resolve(args[args.indexOf(flag) + 1]) : fallback;
const configFile = option('--config', path.join(root, 'config.js'));
const out = option('--out', path.join(root, 'dist'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const filled = value => typeof value === 'string' && value.trim() && !/[\[\]]/.test(value);
const configSource = fs.readFileSync(configFile, 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(configSource, sandbox, { timeout: 1000, filename: configFile });
const config = sandbox.window.SITE_CONFIG || {};
const required = ['name', 'biography', 'crbm', 'crbmRegion', 'city', 'whatsapp', 'email', 'instagram', 'address', 'hours', 'education', 'complementaryEducation', 'portrait', 'siteUrl'];
const missing = required.filter(key => !filled(config[key]));
const privacy = config.privacy || {};
if (!privacy.reviewed || !['controller', 'contact', 'retention', 'hostingProvider'].every(key => filled(privacy[key]))) missing.push('privacy (revisão e campos)');
if (!Array.isArray(config.confirmedDifferentials) || config.confirmedDifferentials.filter(filled).length < 3) missing.push('confirmedDifferentials (mínimo 3 confirmados)');
if (!config.brand && !config.logo) missing.push('brand ou logo');
let siteUrl;
try { siteUrl = new URL(config.siteUrl); if (siteUrl.protocol !== 'https:') missing.push('siteUrl HTTPS'); } catch { missing.push('siteUrl válido'); }
const number = String(config.whatsapp || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
if (!/^[1-9]\d(?:[2-5]\d{7}|9\d{8})$/.test(number)) missing.push('whatsapp válido');
if (config.published && missing.length) { console.error(`Publicação bloqueada. Preencha/revise: ${[...new Set(missing)].join(', ')}`); process.exit(1); }
const ready = config.published === true;
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const name = filled(config.name) ? config.name : '[NOME]';
const city = filled(config.city) ? config.city : '[CIDADE]';
const title = `${filled(config.name) ? `${name} | Biomédica Esteta em ` : 'Escleroterapia e Microagulhamento em '}${city}`;
const description = `Conheça o atendimento${filled(config.name) ? ` de ${name}, Biomédica Esteta,` : ''} em ${city}. Informações sobre secagem de vasinhos, microagulhamento, localização e agendamento.`;
html = html.replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
  .replace(/(<meta name="description" content=")[^"]*(">)/, (_, a, b) => a + escape(description) + b)
  .replace(/(<meta property="og:title" content=")[^"]*(">)/, (_, a, b) => a + escape(title) + b)
  .replace(/(<meta property="og:description" content=")[^"]*(">)/, (_, a, b) => a + escape(description) + b);
const doctor = `Dra. ${filled(config.name) ? config.name : '[NOME COMPLETO]'}`;
const registration = filled(config.crbm) && filled(config.crbmRegion) ? `CRBM-${config.crbmRegion} ${config.crbm}` : '';
const values = { ...config, doctor, registration };
// Bind text-only fields for readable HTML even when JavaScript is disabled.
html = html.replace(/(<([\w-]+)\b[^>]*\bdata-bind="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g, (all, open, tag, key, previous, close) => filled(values[key]) || key === 'doctor' ? open + escape(values[key]) + close : all);
if (ready) {
  html = html.replace('content="noindex, nofollow"', 'content="index, follow"');
  const url = siteUrl.href.replace(/\/$/, '');
  const schema = {
    '@context': 'https://schema.org', '@type': 'Person', '@id': `${url}/#profissional`,
    name: config.name, jobTitle: 'Biomédica Esteta', url, description, telephone: `+55${number}`, email: config.email,
    address: { '@type': 'PostalAddress', streetAddress: config.address, addressLocality: config.city, addressRegion: config.state, addressCountry: 'BR' },
    identifier: [{ '@type': 'PropertyValue', propertyID: `CRBM-${config.crbmRegion}`, value: config.crbm }],
    sameAs: [config.instagram, config.facebook].filter(value => filled(value) && value.startsWith('https://'))
  };
  if (filled(config.portrait)) schema.image = new URL(config.portrait, `${url}/`).href;
  if (filled(config.mapsUrl)) schema.hasMap = config.mapsUrl;
  const ogImage = new URL(config.ogImage || config.portrait, `${url}/`).href;
  const head = `<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(ogImage)}"><meta property="og:image:alt" content="${escape(`Fotografia profissional de ${config.name}`)}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  html = html.replace('</head>', `${head}</head>`);
}
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
// Incorporar os logos; o retrato permanece em dist/assets para não inflar o HTML.
const portableConfig = JSON.parse(JSON.stringify(config));
for (const key of ['logo', 'logoDark', 'logoCompact', 'logoCompactDark', 'headerLogo', 'heroLogo']) {
  const value = config[key];
  if (!filled(value) || !value.startsWith('assets/')) continue;
  const asset = path.resolve(root, value);
  if (!asset.startsWith(path.join(root, 'assets') + path.sep)) throw new Error('Imagem fora da pasta assets.');
  const mime = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif' }[path.extname(asset).toLowerCase()];
  if (mime && fs.existsSync(asset)) portableConfig[key] = `data:${mime};base64,${fs.readFileSync(asset).toString('base64')}`;
}
const portableConfigSource = `window.SITE_CONFIG=${JSON.stringify(portableConfig).replace(/</g, '\\u003c')};`;
const safeJS = source => source.replace(/<\/script/gi, '<\\/script');
html = html.replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script src="config.js" defer></script>', '')
  .replace('<script src="app.js" defer></script>', '')
  .replace('</body>', () => `<script>${safeJS(portableConfigSource)}</script><script>${safeJS(app)}</script></body>`);
const favicon = fs.readFileSync(path.join(root, 'assets/favicon.svg'));
html = html.replace('href="assets/favicon.svg"', `href="data:image/svg+xml;base64,${favicon.toString('base64')}"`);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
const sourceAssets = path.join(root, 'assets');
const outputAssets = path.join(out, 'assets');
// dist/assets é gerado: só o substitua quando ainda for uma cópia intacta dos arquivos de origem.
const verifyGenerated = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const destination = path.join(dir, entry.name);
    const source = path.join(sourceAssets, path.relative(outputAssets, destination));
    if (entry.isDirectory()) verifyGenerated(destination);
    else if (!entry.isFile() || !fs.existsSync(source) || !fs.readFileSync(destination).equals(fs.readFileSync(source))) {
      throw new Error(`Arquivo em ${outputAssets} difere da origem; preserve a alteração antes de gerar o site: ${destination}`);
    }
  }
};
if (fs.existsSync(outputAssets)) {
  if (!fs.lstatSync(outputAssets).isDirectory()) throw new Error(`Pasta de saída inesperada: ${outputAssets}`);
  verifyGenerated(outputAssets);
  fs.rmSync(outputAssets, { recursive: true });
}
const publicAssets = new Set([...html.matchAll(/(?:src|href)="(assets\/[^"#?]+)"/g)].map(match => match[1]));
for (const value of Object.values(config)) if (filled(value) && value.startsWith('assets/')) publicAssets.add(value);
for (const relative of publicAssets) {
  const source = path.resolve(root, relative);
  if (!source.startsWith(sourceAssets + path.sep) || !fs.statSync(source).isFile()) throw new Error(`Imagem inválida: ${relative}`);
  const destination = path.join(out, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}
fs.writeFileSync(path.join(out, 'robots.txt'), ready ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl.href.replace(/\/$/, '')}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
if (ready) fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(siteUrl.href)}</loc></url></urlset>`);
else if (fs.existsSync(path.join(out, 'sitemap.xml'))) fs.unlinkSync(path.join(out, 'sitemap.xml'));
console.log(`Build ${ready ? 'publicável' : 'de personalização (noindex)'}: ${path.join(out, 'index.html')}`);
console.log(`HTML: ${Buffer.byteLength(html)} bytes. Dependências de execução: nenhuma.`);
