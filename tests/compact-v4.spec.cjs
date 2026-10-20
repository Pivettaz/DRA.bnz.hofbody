const {test,expect}=require('@playwright/test');

for(const width of [320,390,768,1024,1280,1440,1920]){
 test(`card compacto e assinatura horizontal sem colisões em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const sig=page.locator('header .header-signature');
  await expect(sig).toHaveText('Saúde vascular & cuidado com a pele');
  await expect(sig).toHaveCSS('writing-mode','horizontal-tb');
  await expect(page.locator('.vertical-caption, .portrait-footnote')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('Uma avaliação.');
  await expect(page.locator('body')).not.toContainText('Um cuidado pensado para você.');
  await expect(page.locator('.hero-brand-tagline')).toHaveText('O cuidado começa com presença.');
  await expect.poll(()=>page.locator('.hero-brand-image').evaluate(i=>i.complete&&i.naturalWidth===800&&i.naturalHeight===630)).toBe(true);
  const metrics=await page.evaluate(()=>{
   const box=s=>document.querySelector(s).getBoundingClientRect();
   const card=box('.hero-brand-panel'),copy=box('.hero-copy'),logo=box('.header-symbol'),sig=box('.header-signature'),header=box('.site-header');
   const menu=box(innerWidth>1020?'#main-nav':'.menu-toggle');
   const image=box('.hero-brand-image');
   return {cardWidth:card.width,cardHeight:card.height,textHeight:copy.height,centerOffset:Math.abs(card.y+card.height/2-copy.y-copy.height/2),mobileBelow:card.top>=copy.bottom,centerX:Math.abs(card.x+card.width/2-innerWidth/2),headerHeight:header.height,signatureRight:sig.right,menuLeft:menu.left,signatureLeft:sig.left,logoRight:logo.right,signatureY:Math.abs(sig.y+sig.height/2-logo.y-logo.height/2),imageRatio:image.width/image.height,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  expect(metrics.overflow).toBe(false);
  expect(metrics.signatureLeft).toBeGreaterThanOrEqual(metrics.logoRight);
  expect(metrics.signatureRight).toBeLessThanOrEqual(metrics.menuLeft);
  expect(metrics.signatureY).toBeLessThan(2);
  expect(metrics.headerHeight).toBeLessThanOrEqual(88);
  expect(metrics.imageRatio).toBeCloseTo(800/630,2);
  if(width>760){
   expect(metrics.cardHeight).toBeLessThanOrEqual(metrics.textHeight);
   expect(metrics.centerOffset).toBeLessThan(2);
   if(width>=1024){expect(metrics.cardWidth).toBeGreaterThanOrEqual(320);expect(metrics.cardWidth).toBeLessThanOrEqual(380);}
  }else{
   expect(metrics.cardWidth).toBeLessThanOrEqual(320);
   expect(metrics.mobileBelow).toBe(true);expect(metrics.centerX).toBeLessThan(2);
  }
 });
}

test('menu mobile abre e fecha ao selecionar seção',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await page.locator('.menu-toggle').click();
 await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','true');
 await page.locator('#main-nav a[href="#sobre"]').click();
 await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');
});
