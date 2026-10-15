import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const origin=process.env.RAMA_URL || 'http://127.0.0.1:4173/';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[], failedRequests=[], externalRequests=[], checks=[], screenshots=[];
await mkdir('qa/screenshots',{recursive:true});
const check=(name,condition)=>{assert.ok(condition,name);checks.push(name);};
async function capture(page,name,fullPage=true){await page.evaluate(()=>document.fonts.ready);const path=`qa/screenshots/${name}.png`;await page.screenshot({path,fullPage});screenshots.push(path);}
async function noOverflow(page,name){check(`Sin desbordamiento horizontal: ${name}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
try {
  for(const width of [1440,390]){
    const page=await browser.newPage({viewport:{width,height:width===1440?1000:844},acceptDownloads:true});
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
    page.on('response',res=>{if(res.status()>=400)failedRequests.push(`${res.status()} ${res.url()}`);});
    page.on('request',req=>{if(!req.url().startsWith(origin)&&!req.url().startsWith('data:'))externalRequests.push(req.url());});
    for(const variant of ['a','b']){
      const suffix=`${variant}-${width}`;
      const response=await page.goto(`${origin}#/${variant}/inicio`,{waitUntil:'networkidle'});
      check(`Inicio ${suffix} devuelve HTTP 200`,(response?.status() ?? (await page.request.get(origin)).status())===200);
      check(`Inicio ${suffix} muestra un título`,await page.locator('h1').count()===1);
      check(`Logo local ${suffix}`,await page.locator('.brand img').evaluate(img=>img.complete&&img.naturalWidth>0));
      check(`Fuente local ${suffix}`,await page.evaluate(()=>document.fonts.check('600 16px Raleway')));
      await noOverflow(page,`inicio ${suffix}`);await capture(page,`inicio-${suffix}`);
      if(width===390){
        await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
        check(`Menú móvil ${variant} abre`,await page.getByRole('button',{name:'Cerrar menú',exact:true}).getAttribute('aria-expanded')==='true');
        await page.getByRole('navigation',{name:'Navegación principal'}).getByRole('link',{name:'Biblioteca',exact:true}).click();
        check(`Menú móvil ${variant} cierra al navegar`,await page.getByRole('button',{name:'Abrir menú',exact:true}).count()===1);
      } else await page.getByRole('navigation',{name:'Navegación principal'}).getByRole('link',{name:'Biblioteca',exact:true}).click();
      await page.getByRole('status').filter({hasText:'14'}).waitFor();
      check(`Catálogo ${suffix} contiene 14 registros`,(await page.getByRole('status').innerText()).startsWith('14'));
      await noOverflow(page,`catálogo ${suffix}`);await capture(page,`catalogo-${suffix}`);
      const search=page.getByLabel('Buscar en el catálogo',{exact:true});
      await search.fill('zzzzsinresultados');await page.getByRole('heading',{name:'No encontramos documentos'}).waitFor();
      check(`Búsqueda vacía ${suffix}`,await page.getByRole('heading',{name:'No encontramos documentos'}).isVisible());
      await page.getByRole('link',{name:'Limpiar búsqueda y filtros'}).click();
      await page.getByRole('status').filter({hasText:'14'}).waitFor();
      await search.fill('AREA DE DEMOSTRACION');await page.getByRole('status').filter({hasText:'3 documentos'}).waitFor();
      check(`Búsqueda por autor y sin tildes ${suffix}`,await page.locator('.catalog-results .document-card').count()===3);
      await page.getByRole('button',{name:'Borrar búsqueda'}).click();
      if(width===390)await page.getByRole('button',{name:'Filtrar documentos'}).click();
      await page.getByRole('radio',{name:'Derecho y ciudadanía'}).check();
      await page.getByLabel('Tipo de documento',{exact:true}).selectOption('Jurisprudencia');
      await page.getByRole('status').filter({hasText:'3 documentos'}).waitFor();
      check(`Filtros combinados ${suffix}`,await page.locator('.catalog-results .document-card').count()===3);
      await page.getByLabel('Tipo de documento',{exact:true}).selectOption('Libro');
      await page.getByRole('heading',{name:'No encontramos documentos'}).waitFor();
      check(`Intersección de filtros sin resultados ${suffix}`,await page.getByRole('heading',{name:'No encontramos documentos'}).isVisible());
      await page.getByRole('link',{name:'Limpiar búsqueda y filtros'}).click();
      await page.getByLabel('Ordenar documentos').selectOption('titulo');
      check(`Orden por título ${suffix}`,(await page.locator('.catalog-results h3').first().innerText())==='Acceso y consulta de información');
      await page.getByRole('button',{name:'Página siguiente',exact:true}).click();
      check(`Paginación ${suffix}`,(await page.getByRole('navigation',{name:'Páginas del catálogo'}).innerText()).includes('7–12'));
      await page.getByRole('button',{name:'Vista de lista',exact:true}).click();
      check(`Cambio a lista ${suffix}`,await page.locator('.list-results').count()===1);
      await page.getByRole('button',{name:'Vista de tarjetas',exact:true}).click();
      check(`Cambio a tarjetas ${suffix}`,await page.locator('.grid-results').count()===1);
      await page.locator('.catalog-results h3 a').first().click();
      await page.locator('.detail-actions').waitFor();
      await noOverflow(page,`ficha ${suffix}`);await capture(page,`ficha-${suffix}`);
      const pdfLink=page.getByRole('link',{name:/Abrir PDF de muestra/});
      const pdf=await page.request.get(new URL(await pdfLink.getAttribute('href'),page.url()).href);
      check(`PDF accesible ${suffix}`,pdf.status()===200&&pdf.headers()['content-type'].includes('application/pdf'));
      check(`PDF válido ${suffix}`,(await pdf.body()).subarray(0,5).toString()==='%PDF-');
      const popupPromise=page.waitForEvent('popup');
      await pdfLink.click();
      const popup=await popupPromise;
      await popup.waitForLoadState('domcontentloaded');
      check(`Apertura en otra pestaña ${suffix}`,popup.url().endsWith('/documents/documento-demostracion.pdf'));
      await popup.close();
      const downloadPromise=page.waitForEvent('download');
      await page.getByRole('link',{name:'Descargar',exact:true}).click();
      const download=await downloadPromise;
      check(`Descarga real ${suffix}`,download.suggestedFilename()==='RAMA-documento-demostracion.pdf');
      await download.saveAs(`qa/${suffix}-descarga.pdf`);
      const other=variant==='a'?'b':'a';
      const docTitle=await page.locator('h1').innerText();
      await page.locator('.variant-switch a').filter({hasText:other==='a'?'Institucional':'Biblioteca'}).click();
      check(`Selector conserva ficha ${suffix}`,(await page.locator('h1').innerText())===docTitle&&page.url().includes(`#/${other}/documento/`));
      await page.goto(`${origin}#/${variant}/institucion`);await noOverflow(page,`institución ${suffix}`);
      check(`Institución sin datos inventados ${suffix}`,await page.getByText('Contenido institucional pendiente de validación.').isVisible());
      await page.goto(`${origin}#/${variant}/contacto`);await noOverflow(page,`contacto ${suffix}`);
      await capture(page,`contacto-${suffix}`);
      await page.getByLabel('Nombre',{exact:true}).fill('Persona de prueba');
      await page.getByLabel('Correo electrónico',{exact:true}).fill('prueba@example.test');
      await page.getByLabel('Mensaje',{exact:true}).fill('Mensaje para verificar la demostración.');
      await page.getByRole('button',{name:'Probar formulario'}).click();
      check(`Formulario explica que no envía ${suffix}`,await page.getByRole('status').filter({hasText:'No se ha enviado ni guardado'}).isVisible());
      await page.goto(`${origin}#/${variant}/documento/no-existe`);
      check(`Ruta desconocida ${suffix}`,await page.getByRole('heading',{name:'Volvamos a la biblioteca.'}).isVisible());
    }
    if(width===1440){
      await page.goto(`${origin}#/b/inicio`);
      await page.getByLabel('Buscar documentos por título, autor o tema').fill('archivo digital');
      await page.getByRole('button',{name:'Buscar',exact:true}).click();
      await page.getByRole('heading',{name:'Cómo organizar un archivo digital',exact:true}).waitFor();
      check('Buscador de inicio B lleva a los resultados',page.url().includes('/b/biblioteca?q='));
      await page.goto(`${origin}#/a/inicio`);
      await page.reload({waitUntil:'networkidle'});
      await page.keyboard.press('Tab');
      check('Enlace para saltar contenido accesible por teclado',await page.evaluate(()=>document.activeElement.textContent==='Saltar al contenido'));
      await page.keyboard.press('Enter');
      check('Saltar contenido conserva ruta',await page.locator('main').evaluate(el=>el===document.activeElement)&&page.url().includes('/a/inicio'));
    }
    await page.close();
  }
  check('Sin errores de JavaScript ni consola',errors.length===0);
  check('Sin archivos ausentes',failedRequests.length===0);
  check('Sin solicitudes externas durante el uso',externalRequests.length===0);
  const final={status:'ok',checks:checks.length,passed:checks,errors,failedRequests,externalRequests,screenshots};
  await writeFile('qa/verification.json',JSON.stringify(final,null,2));console.log(JSON.stringify({status:'ok',checks:checks.length,screenshots:screenshots.length}));
} catch(error) {
  await writeFile('qa/verification.json',JSON.stringify({status:'failed',passed:checks,errors,failedRequests,externalRequests,error:String(error)},null,2));
  console.error(error);process.exitCode=1;
} finally {await browser.close();}
