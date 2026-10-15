import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('https://fundacion-rama.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.locator('h2').first().waitFor({ timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await mkdir('qa/reference', { recursive: true });
  await page.screenshot({ path: 'qa/reference/sitio-actual-desktop.png', fullPage: false });
  const styles = await page.evaluate(() => ['body', 'h2', 'nav a', '.q_logo img'].map(selector => {
    const el=document.querySelector(selector);if(!el)return {selector,found:false};const css=getComputedStyle(el);
    return {selector,font:css.fontFamily,color:css.color,fontSize:css.fontSize};
  }));
  await writeFile('qa/reference/estilos-observados.json', JSON.stringify(styles,null,2));
  console.log(JSON.stringify(styles));
} finally { await browser.close(); }
