const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');

for(const width of [390,768,1440]){
 test(`acabamento champanhe exclusivo do card em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const card=page.locator('.hero-brand-panel'),band=page.locator('.hero-brand-tagline');
  await expect(card).toHaveCSS('border-top-left-radius','18px');
  await expect(card).toHaveCSS('border-bottom-right-radius','18px');
  await expect(card).toHaveCSS('border-top-width','1px');
  await expect(card).not.toHaveCSS('box-shadow','none');
  await expect(band).toHaveCSS('background-color','rgb(231, 215, 190)');
  await expect(band).toHaveCSS('color','rgb(23, 34, 56)');
  await expect(band.locator('em')).toHaveCSS('color','rgb(138, 105, 53)');
  await expect(band).toHaveCSS('border-top-width','1px');
  await expect(band).toHaveCSS('text-align','center');
  await expect(band).toHaveText('O cuidado começa com presença.');
  expect(await band.evaluate(el=>parseFloat(getComputedStyle(el).paddingTop))).toBe(12);
  await expect(page.locator('.hero-brand-image')).toHaveCSS('object-fit','contain');
  await expect(page.locator('.hero-brand-image')).toHaveCSS('filter','none');
  await expect.poll(()=>page.locator('.hero-brand-image').evaluate(i=>i.complete&&i.naturalWidth===800&&i.naturalHeight===630)).toBe(true);
  const gap=await page.evaluate(()=>document.querySelector('.hero-brand-tagline').getBoundingClientRect().top-document.querySelector('.hero-brand-image').getBoundingClientRect().bottom);
  expect(Math.abs(gap)).toBeLessThan(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  fs.mkdirSync('qa/v5',{recursive:true});
  const label=width===390?'celular':width===768?'tablet':'desktop';
  await card.screenshot({path:`qa/v5/${label}-card.png`});
  await page.evaluate(()=>window.scrollTo(0,0));
  const height=await page.locator('#inicio').evaluate(e=>Math.ceil(e.getBoundingClientRect().bottom));
  await page.screenshot({path:`qa/v5/${label}-hero.png`,fullPage:true,clip:{x:0,y:0,width,height}});
 });
}

test('nenhuma mudança no HTML, imagens, configuração, interações ou estilos anteriores',async()=>{
 const baseline='tests/fixtures/before-v5';
 for(const file of ['index.html','app.js','config.js']) expect(fs.readFileSync(file,'utf8')).toBe(fs.readFileSync(`${baseline}/${file}`,'utf8'));
 const before=fs.readFileSync(`${baseline}/styles.css`,'utf8'),after=fs.readFileSync('styles.css','utf8');
 expect(after.startsWith(before)).toBe(true);
 const added=after.slice(before.length).replace(/\/\*[\s\S]*?\*\//g,'');
 const selectors=[...added.matchAll(/([^{}]+)\{/g)].map(m=>m[1].trim());
 expect(selectors).toEqual([':root','.hero-brand-panel','.hero-brand-panel .hero-brand-tagline','.hero-brand-panel .hero-brand-tagline em']);
});
