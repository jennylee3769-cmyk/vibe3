import {chromium} from '@playwright/test';
import {slides} from '../src/slides.js';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const context=await browser.newContext({viewport:{width:1600,height:900},permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const results=[];const assert=(ok,label)=>{results.push({label,passed:!!ok});if(!ok)throw Error(label)};
await page.goto('http://localhost:3000/slides.html');await page.evaluate(()=>document.fonts.ready);
for(const viewport of [{width:1600,height:900},{width:1920,height:1080},{width:1366,height:768}]){
 await page.setViewportSize(viewport);
 for(let i=0;i<slides.length;i++){
 await page.goto(`http://localhost:3000/slides.html#session-3-slide-${i+1}`);await page.locator('h1').waitFor();
 assert(await page.locator('h1').innerText()===slides[i].title,`${viewport.width} slide ${i+1} title`);
 const overflow=await page.locator('article').evaluate(el=>{const v=document.querySelector('.viewport').getBoundingClientRect();return [...el.querySelectorAll('*')].filter(x=>{const r=x.getBoundingClientRect();return r.bottom>v.bottom+2||r.right>v.right+2||r.top<v.top-2}).map(x=>x.tagName)});
 assert(overflow.length===0,`${viewport.width} slide ${i+1} fits: ${overflow}`);
 if(viewport.width===1600){await page.screenshot({path:`qa/slide-${String(i+1).padStart(2,'0')}.png`});if(slides[i].code){assert(await page.locator('pre').innerText()===slides[i].code,`slide ${i+1} code text`);await page.getByRole('button',{name:'코드 복사',exact:true}).click();assert((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n')===slides[i].code,`slide ${i+1} clipboard`)}}
 }
}
await page.goto('http://localhost:3000/');await page.locator('h1').waitFor();await page.waitForTimeout(200);await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);assert(await page.locator('h1').innerText()==='오늘의 안전장치','keyboard next');await page.keyboard.press('ArrowLeft');await page.waitForTimeout(100);assert(await page.locator('h1').innerText()===slides[0].title,'keyboard previous');
for(const n of [1,2,4,5,3]){await page.getByRole('button',{name:`${n}회차`,exact:true}).click();await page.waitForTimeout(80);assert(await page.locator('.round.active').innerText()===String(n),`session ${n}`)}
await page.getByRole('button',{name:'목차',exact:true}).click();await page.getByRole('dialog').getByRole('button').last().click();await page.waitForTimeout(100);assert(await page.locator('h1').innerText()==='오늘 여기까지','table of contents');await page.locator('input').first().check();await page.reload();assert(await page.locator('input').first().isChecked(),'checklist persisted');await page.locator('input').first().uncheck();
await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:3000/#session-3-slide-4');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile no horizontal page overflow');await page.screenshot({path:'qa/mobile.png',fullPage:true});assert(errors.length===0,`no browser exceptions: ${errors}`);
fs.writeFileSync('qa/results.json',JSON.stringify({date:new Date().toISOString(),browser:'Microsoft Edge',results,errors},null,2));await browser.close();console.log(`${results.length} checks passed`);

