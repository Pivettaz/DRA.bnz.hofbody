const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
for(const width of [390,1440]){
 test(`faixa reduzida e arte centralizada em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect.poll(()=>page.locator('.hero-brand-image').evaluate(i=>i.complete&&i.naturalWidth===800)).toBe(true);
  const center=await page.locator('.hero-brand-image').evaluate(img=>{
   const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
   const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,c.width,c.height).data;
   let x1=c.width,y1=c.height,x2=0,y2=0;
   for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
    const i=(y*c.width+x)*4,r=data[i],g=data[i+1],b=data[i+2];
    if(r>65&&r>b*1.25&&g>b*1.12){x1=Math.min(x1,x);x2=Math.max(x2,x);y1=Math.min(y1,y);y2=Math.max(y2,y);}
   }
   return {x:Math.abs((x1+x2+1)/2-c.width/2),y:Math.abs((y1+y2+1)/2-c.height/2)};
  });
  expect(center.x).toBeLessThanOrEqual(1);expect(center.y).toBeLessThanOrEqual(1);
  const band=page.locator('.hero-brand-tagline');
  await expect(band).toHaveCSS('padding-top','12px');
  await expect(band).toHaveCSS('padding-bottom','14px');
  await expect(band).toHaveText('O cuidado começa com presença.');
  fs.mkdirSync('qa/v6',{recursive:true});
  await page.locator('.hero-brand-panel').screenshot({path:`qa/v6/${width===390?'celular':'desktop'}-card.png`});
 });
}
