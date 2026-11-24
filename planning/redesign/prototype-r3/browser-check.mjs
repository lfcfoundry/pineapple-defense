// Run only with the project-approved ungoogled browser, never a stock fallback.
// Re-read the current knowledge-base browsers README before using this runner.
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const binary=process.env.PD_CHROME;
if(!binary||!/ungoogled/i.test(binary))throw Error('Set PD_CHROME to the installed approved ungoogled executable; no stock fallback.');
const req=createRequire(import.meta.url),puppeteer=req(process.env.PUPPETEER_MODULE||'/data/data/com.termux/files/home/browser-harness/node_modules/puppeteer-core');
const browser=await puppeteer.launch({executablePath:binary,headless:true,args:['--no-sandbox']});
console.log(await browser.version());
const root=path.dirname(fileURLToPath(import.meta.url));
const results=[];
try{
 const page=await browser.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
 await page.goto(pathToFileURL(path.join(root,'index.html')).href);await page.waitForFunction(()=>window.pineappleExperiment);
 for(const [width,height] of [[320,568],[360,640],[412,732],[640,360]]){
  await page.setViewport({width:Math.max(800,width),height:Math.max(1000,height)});
  for(const condition of ['F0','N0','N1']){
   await page.evaluate(({condition,width,height})=>{document.getElementById('condition').value=condition;document.getElementById('viewport').value=width+'x'+height;pineappleExperiment.reset(true);pineappleExperiment.engine.start();},{condition,width,height});
   await page.waitForFunction(()=>pineappleExperiment.engine.phase==='Active');
   const info=await page.evaluate(()=>({size:[pineappleExperiment.engine.W,pineappleExperiment.engine.H],phase:pineappleExperiment.engine.phase}));
   if(info.size[0]!==width||info.size[1]!==height)throw Error('Wrong canvas geometry '+JSON.stringify(info));
   results.push({condition,width,height,status:'boot and geometry pass'});
  }
 }
 await page.evaluate(()=>{document.getElementById('condition').value='N0';document.getElementById('viewport').value='360x640';pineappleExperiment.reset(true);pineappleExperiment.engine.start();const c=document.getElementById('board');c.focus();});
 await page.keyboard.press('ArrowRight');
 await page.focus('#fire');
 const preserved=await page.evaluate(()=>!!pineappleExperiment.input.point&&!pineappleExperiment.engine.excluded);
 if(!preserved)throw Error('Composite focus cancelled keyboard point');
 await page.keyboard.press('Enter');
 if(await page.evaluate(()=>pineappleExperiment.engine.launches)!==1)throw Error('Keyboard Fire did not commit once');
 // Save an actual screenshot for visual inspection; screenshot existence is not an approval.
 await page.screenshot({path:path.join(root,'browser-evidence.png'),fullPage:true});
 if(errors.length||requests.length)throw Error(JSON.stringify({errors,requests}));
 fs.writeFileSync(path.join(root,'BROWSER-RESULTS.json'),JSON.stringify({browser:await browser.version(),results,keyboardFocusFire:'pass',errors,requests,performance:'Not measured by boot/geometry checks',physicalTouch:'Not tested',humanPlaytest:false},null,2));
 console.log('PASS',results.length,'condition/viewport boot checks and keyboard focus/Fire. Screenshot requires visual review.');
}finally{await browser.close();}
