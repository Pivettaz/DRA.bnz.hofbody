const {test,expect}=require('@playwright/test');

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
 });
}

test('card mantém arte e assinatura atual',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.hero-brand-image')).toHaveAttribute('alt','BNZ — HOF | BODY');
 await expect(page.locator('.hero-brand-tagline')).toHaveText('O cuidado começa com presença.');
});
