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
const required = ['name', 'biography', 'crm', 'uf', 'city', 'whatsapp', 'email', 'instagram', 'address', 'reference', 'hours', 'education', 'complementaryEducation', 'portrait', 'siteUrl'];
const missing = required.filter(key => !filled(config[key]));
const privacy = config.privacy || {};
if (!privacy.reviewed || !['controller', 'contact', 'retention', 'hostingProvider'].every(key => filled(privacy[key]))) missing.push('privacy (revisão e campos)');
if (!Array.isArray(config.confirmedDifferentials) || config.confirmedDifferentials.filter(filled).length < 3) missing.push('confirmedDifferentials (mínimo 3 confirmados)');
if (!config.brand && !config.logo) missing.push('brand ou logo');
const specialty = config.specialtyRegistered === true && filled(config.specialty) && filled(config.rqe);
if ((config.specialty || config.rqe || config.specialtyRegistered) && !specialty) missing.push('especialidade: remover ou confirmar registro e RQE');
let siteUrl;
try { siteUrl = new URL(config.siteUrl); if (siteUrl.protocol !== 'https:') missing.push('siteUrl HTTPS'); } catch { missing.push('siteUrl válido'); }
const number = String(config.whatsapp || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
if (!/^[1-9]\d(?:[2-5]\d{7}|9\d{8})$/.test(number)) missing.push('whatsapp válido');
if (config.published && missing.length) { console.error(`Publicação bloqueada. Preencha/revise: ${[...new Set(missing)].join(', ')}`); process.exit(1); }
const ready = config.published === true;
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const name = filled(config.name) ? config.name : '[NOME]';
const city = filled(config.city) ? config.city : '[CIDADE]';
const title = `${filled(config.name) ? `Dra. ${name} | ` : ''}Escleroterapia e Microagulhamento em ${city}`;
const description = `Conheça o atendimento${filled(config.name) ? ` da Dra. ${name}` : ''} em ${city}. Informações sobre secagem de vasinhos, microagulhamento, localização e agendamento.`;
html = html.replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
  .replace(/(<meta name="description" content=")[^"]*(">)/, (_, a, b) => a + escape(description) + b)
  .replace(/(<meta property="og:title" content=")[^"]*(">)/, (_, a, b) => a + escape(title) + b)
  .replace(/(<meta property="og:description" content=")[^"]*(">)/, (_, a, b) => a + escape(description) + b);
const doctor = `Dra. ${filled(config.name) ? config.name : '[NOME COMPLETO]'}`;
const crm = filled(config.crm) && filled(config.uf) ? `CRM-${config.uf} ${config.crm}` : '[CRM E ESTADO]';
const values = { ...config, doctor, crm };
// Bind text-only fields for readable HTML even when JavaScript is disabled.
html = html.replace(/(<([\w-]+)\b[^>]*\bdata-bind="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g, (all, open, tag, key, previous, close) => filled(values[key]) || ['doctor', 'crm'].includes(key) ? open + escape(values[key]) + close : all);
if (ready) {
  html = html.replace('content="noindex, nofollow"', 'content="index, follow"');
  const url = siteUrl.href.replace(/\/$/, '');
  const schema = {
    '@context': 'https://schema.org', '@type': 'Physician', '@id': `${url}/#profissional`,
    name: doctor, url, description, telephone: `+55${number}`, email: config.email,
    address: { '@type': 'PostalAddress', streetAddress: config.address, addressLocality: config.city, addressRegion: config.uf, addressCountry: 'BR' },
    identifier: [{ '@type': 'PropertyValue', propertyID: `CRM-${config.uf}`, value: config.crm }],
    sameAs: [config.instagram, config.facebook].filter(value => filled(value) && value.startsWith('https://'))
  };
  if (specialty) schema.identifier.push({ '@type': 'PropertyValue', propertyID: 'RQE', value: config.rqe });
  if (filled(config.portrait)) schema.image = new URL(config.portrait, `${url}/`).href;
  if (filled(config.mapsUrl)) schema.hasMap = config.mapsUrl;
  const ogImage = new URL(config.ogImage || config.portrait, `${url}/`).href;
  const head = `<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(ogImage)}"><meta property="og:image:alt" content="${escape(`Fotografia profissional de ${doctor}`)}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  html = html.replace('</head>', `${head}</head>`);
}
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
// Incorporar apenas imagens locais declaradas para preservar a entrega portátil.
const portableConfig = JSON.parse(JSON.stringify(config));
for (const key of ['logo', 'logoDark', 'logoCompact', 'logoCompactDark', 'portrait', 'headerLogo', 'heroLogo']) {
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
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
fs.writeFileSync(path.join(out, 'robots.txt'), ready ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl.href.replace(/\/$/, '')}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
if (ready) fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(siteUrl.href)}</loc></url></urlset>`);
else if (fs.existsSync(path.join(out, 'sitemap.xml'))) fs.unlinkSync(path.join(out, 'sitemap.xml'));
console.log(`Build ${ready ? 'publicável' : 'de personalização (noindex)'}: ${path.join(out, 'index.html')}`);
console.log(`HTML: ${Buffer.byteLength(html)} bytes. Dependências de execução: nenhuma.`);
