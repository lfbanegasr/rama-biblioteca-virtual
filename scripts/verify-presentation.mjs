import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const checks=[];
const check=(name,result)=>{assert.ok(result,name);checks.push(name);};
async function settled(page){await page.waitForFunction(()=>document.getAnimations().every(animation=>animation.playState!=='running'));}
try{
  for(const width of [390,768,1440]){
    const page=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'no-preference'});
    for(const variant of ['a','b']){
      await page.goto(`http://127.0.0.1:4173/#/${variant}/inicio`,{waitUntil:'networkidle'});
      await page.evaluate(async()=>{
        for(const image of document.images)image.loading='eager';
        await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
        window.scrollTo(0,0);
      });
      await settled(page);
      check(`Imágenes disponibles ${variant}-${width}`,await page.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)));
      check(`Sin desbordamiento ${variant}-${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      await page.screenshot({path:`qa/screenshots/portada-${variant}-${width}.png`,animations:'disabled'});
      if(variant==='b'&&width===1440){
        const exhibit=page.locator('.collection-exhibit');
        const box=await exhibit.boundingBox();
        await page.mouse.move(box.x+box.width*.85,box.y+box.height*.5);
        check('Expositor de libros responde al cursor',Math.abs(await exhibit.evaluate(element=>parseFloat(element.style.getPropertyValue('--turn'))))>0);
        await page.mouse.move(10,10);
      }
      await page.locator('.category-section').scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>document.querySelector('.category-section').classList.contains('is-revealed'));
      await settled(page);
      check(`Sección entra al recorrer la página ${variant}-${width}`,await page.locator('.category-section').evaluate(element=>element.classList.contains('is-revealed')));
      check(`Cabecera fija al recorrer ${variant}-${width}`,Math.abs((await page.locator('.site-chrome').boundingBox()).y)<1);
      await page.evaluate(()=>window.scrollBy(0,800));
      await page.getByRole('button',{name:'Volver al inicio de la página'}).waitFor({state:'visible'});
      check(`Progreso de lectura ${variant}-${width}`,await page.evaluate(()=>Number(document.documentElement.style.getPropertyValue('--reading-progress'))>0));
      await page.getByRole('button',{name:'Volver al inicio de la página'}).click();
      await page.waitForFunction(()=>window.scrollY===0);
      check(`Volver arriba funciona ${variant}-${width}`,await page.locator('main').evaluate(element=>element===document.activeElement));
    }
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4173/#/b/inicio',{waitUntil:'networkidle'});
  check('Movimiento reducido sin animaciones activas',await page.evaluate(()=>document.getAnimations().length===0));
  const box=await page.locator('.collection-exhibit').boundingBox();
  await page.mouse.move(box.x+box.width*.85,box.y+box.height*.5);
  check('Movimiento reducido no inclina los libros',await page.locator('.collection-exhibit').evaluate(element=>!element.style.getPropertyValue('--turn')));
  await page.goto('http://127.0.0.1:4173/#/a/inicio',{waitUntil:'networkidle'});
  await page.evaluate(()=>window.scrollTo(0,700));
  await page.waitForFunction(()=>window.scrollY>0);
  check('Movimiento reducido sin paralaje',await page.locator('.hero-photograph').evaluate(element=>getComputedStyle(element).transform==='none'));
  await page.close();
  await writeFile('qa/presentation-verification.json',JSON.stringify({status:'ok',checks:checks.length,passed:checks},null,2));
  console.log(JSON.stringify({status:'ok',checks:checks.length}));
}finally{await browser.close();}
