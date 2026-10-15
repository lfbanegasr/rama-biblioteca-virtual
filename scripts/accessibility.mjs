import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
try {
  for(const width of [1440,390]) {
    const context=await browser.newContext({viewport:{width,height:1000}});
    const page=await context.newPage();
    for(const variant of ['a','b']) {
      for(const view of ['inicio','biblioteca','documento/muestra-01','institucion','contacto']) {
        const route=`#/${variant}/${view}`;
        await page.goto(`http://127.0.0.1:4173/${route}`,{waitUntil:'networkidle'});
        await page.evaluate(()=>document.fonts.ready);
        const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
        results.push({width,route,violations:scan.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
      }
    }
    await context.close();
  }
  const violations=results.reduce((sum,r)=>sum+r.violations.length,0);
  await writeFile('qa/accessibility.json',JSON.stringify({status:violations?'failed':'ok',views:results.length,violations,results},null,2));
  console.log(JSON.stringify({views:results.length,violations}));
  if(violations)process.exitCode=1;
} finally {await browser.close();}
