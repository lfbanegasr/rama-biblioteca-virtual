import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const root=resolve('dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf'};
// A local-only fixture checks that a basic static host can serve a subfolder.
const server=createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(!pathname.startsWith('/rama/'))throw new Error('Outside fixture');
    const file=resolve(root,pathname.slice('/rama/'.length)||'index.html');
    if(!file.startsWith(root+sep))throw new Error('Outside dist');
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(bytes);
  } catch {res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}/rama/`;
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const checks=[],errors=[];
try {
  const page=await browser.newPage({viewport:{width:768,height:1024}});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',res=>{if(res.status()>=400)errors.push(`${res.status()} ${res.url()}`);});
  for(const variant of ['a','b']){
    for(const view of ['inicio','biblioteca','documento/muestra-01','institucion','contacto']){
      await page.goto(`${origin}#/${variant}/${view}`,{waitUntil:'networkidle'});
      assert.equal(await page.locator('h1').count(),1);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      checks.push(`Tableta 768 y hosting estático en subcarpeta: ${variant}/${view}`);
      if(view==='institucion')await page.screenshot({path:`qa/screenshots/institucion-${variant}-768.png`,fullPage:true});
      if(view==='documento/muestra-01'){
        const url=await page.getByRole('link',{name:/Abrir PDF de muestra/}).getAttribute('href');
        assert.ok(new URL(url,page.url()).pathname.startsWith('/rama/documents/'));
        const pdf=await page.request.get(new URL(url,page.url()).href);
        assert.equal(pdf.status(),200);
      }
    }
  }
  assert.deepEqual(errors,[]);
  await writeFile('qa/static-verification.json',JSON.stringify({status:'ok',checks,errors},null,2));
  console.log(JSON.stringify({status:'ok',checks:checks.length}));
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
