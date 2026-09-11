import React, {useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {lectures} from './slides';
import './style.css';
const readHash=()=>{const m=location.hash.match(/^#session-(\d)(?:-slide-(\d+))?$/);return m?{session:Math.max(1,Math.min(5,+m[1])),index:Math.max(0,+(m[2]||1)-1)}:{session:3,index:0}};
function App(){
 const [route,setRoute]=useState(readHash),[size,setSize]=useState({w:innerWidth,h:innerHeight}),[toc,setToc]=useState(false),[copied,setCopied]=useState(''),[locked,setLocked]=useState(true),[checks,setChecks]=useState(()=>{try{return JSON.parse(localStorage.getItem('lesson3-checks'))||[]}catch{return []}});
 const {session,index}=route, currentSlides=lectures[session]||lectures[3], s=currentSlides[index]||currentSlides[0];
 const navigate=(n,i=0)=>{location.hash=`session-${n}-slide-${i+1}`;setToc(false);setCopied('')};
 const move=d=>{navigate(session,Math.max(0,Math.min(currentSlides.length-1,index+d)))};
 useEffect(()=>{const resize=()=>setSize({w:innerWidth,h:innerHeight});const hash=()=>setRoute(readHash());addEventListener('resize',resize);addEventListener('hashchange',hash);return()=>{removeEventListener('resize',resize);removeEventListener('hashchange',hash)}},[]);
 useEffect(()=>{const key=e=>{if(e.target.matches('input,textarea,select')||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='Escape'){setToc(false);return}if(toc)return;if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(/^[1-5]$/.test(e.key))navigate(+e.key);if(e.key==='Home')navigate(session);if(e.key==='End')navigate(session,currentSlides.length-1);if(e.key==='0')setToc(true)};addEventListener('keydown',key);return()=>removeEventListener('keydown',key)},[route,toc,session,currentSlides.length]);
 useEffect(()=>{document.title=`${session}회차 · ${s.title} | Codex Vibe Coding`},[route]);
 const copy=async()=>{try{await navigator.clipboard.writeText(s.code);setCopied('복사 완료')}catch{setCopied('복사 실패 · 코드를 선택해 복사하세요')}};
 const toggle=i=>{const next=checks.includes(i)?checks.filter(x=>x!==i):[...checks,i];setChecks(next);try{localStorage.setItem('lesson3-checks',JSON.stringify(next))}catch{}};
 const scale=Math.min((size.w-76)/1524,(size.h-58)/842),mobile=size.w<760;
 return <><aside className="rail"><button className="round home" aria-label="3회차 표지" onClick={()=>navigate(3)}>·</button><nav aria-label="회차 선택">{[1,2,3,4,5].map(n=><button key={n} className={'round '+(session===n?'active':'')} aria-label={`${n}회차`} aria-current={session===n?'page':undefined} onClick={()=>navigate(n)}>{n}</button>)}</nav><span className="rail-brand">CODEX VIBE CODING</span></aside>
 <main className="viewport"><div className="stage" style={mobile?{}:{width:1524,height:842,transform:`translate(-50%, -50%) scale(${scale})`}}>
 {session!==3&&s.referenceImage?<article key={`${session}-${index}`} className="reference-slide" aria-label={`${index+1} / ${currentSlides.length} 참고 이미지 슬라이드`}><img src={s.referenceImage} alt={`${session}강 ${index+1}페이지 참고 교안`} /></article>:<article key={`${session}-${index}`} className={`slide ${s.kind||''} slide-${index}`} aria-label={`${index+1} / ${currentSlides.length} 슬라이드`}>
 {s.kind==='cover'&&<div className="big-number">3</div>}
 <div className="eyebrow">{s.label}{s.tag&&<span className="badge">{s.tag}</span>}</div><h1>{s.title}</h1>
 {s.highlight&&<div className="highlight">{s.highlight}</div>}
 {s.description&&<p className="description">{s.description}</p>}
 {s.steps&&<ol className="steps">{s.steps.map(x=><li key={x}>{x}</li>)}</ol>}
 {s.code&&<div className="codebox"><button className="copy" onClick={copy} aria-label="코드 복사">{copied||'복사'}</button><pre><code>{s.code}</code></pre></div>}
 {s.success&&<section className="callout success"><h2>✓ 이렇게 보이면 성공</h2><p>{s.success}</p></section>}
 {s.errors&&<section className="callout error"><h2>⚠ 안 되면</h2><dl>{s.errors.map(([a,b])=><React.Fragment key={a}><dt>{a}</dt><dd>{b}</dd></React.Fragment>)}</dl></section>}
 {s.warning&&<p className="warning">⚠ {s.warning}</p>}
 {s.after&&<p className="after">{s.after}</p>}
 {s.cards&&<div className="cards">{s.cards.map(([a,b],i)=><section key={a} className={'mode-card '+(i===1?'selected':'')}><span className="mode-symbol">{['◉','✎','↗'][i]}</span><h2>{a}</h2><p>{b}</p></section>)}</div>}
 {s.checks&&<div className="checklist">{s.checks.map((x,i)=><label key={x}><input type="checkbox" checked={checks.includes(i)} onChange={()=>toggle(i)}/><span>{x}</span></label>)}<div className="completion">{checks.length} / 4 완료{checks.length===4?' · 오늘의 실습을 완료했습니다!':''}</div></div>}
 </article>}
 </div></main>
 <footer><span className="page-count">{String(index+1).padStart(2,'0')} / {currentSlides.length}</span><progress aria-label="슬라이드 진행률" max={currentSlides.length} value={index+1}/><div className="status" title="로컬 발표 화면의 상태 표시입니다. 다른 기기와 동기화되지 않습니다."><i/> 발표자 <span>· 따라오는 중</span><button onClick={()=>setLocked(!locked)} aria-pressed={locked}>{locked?'잠금':'해제'}</button></div><span className="local-label">로컬 발표</span><span className="key-hint">← → 이동 · 1~5 회차</span><button onClick={()=>navigate(session)}>홈</button><button onClick={()=>setToc(true)}>목차</button><button aria-label="이전 슬라이드" disabled={index===0} onClick={()=>move(-1)}>←</button><button aria-label="다음 슬라이드" disabled={index===currentSlides.length-1} onClick={()=>move(1)}>→</button></footer>
 <span className="sr-only" role="status">{copied}</span>
 {toc&&<div className="modal-backdrop" onClick={()=>setToc(false)}><section className="toc" role="dialog" aria-modal="true" aria-label={`${session}회차 목차`} onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Tab'){const buttons=[...e.currentTarget.querySelectorAll('button')];if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus()}}}}><div className="toc-header"><h2>{session}회차 목차</h2><button autoFocus onClick={()=>setToc(false)}>닫기 ✕</button></div>{currentSlides.map((x,i)=><button className={index===i?'current':''} key={x.title+i} onClick={()=>navigate(session,i)}><span>{String(i+1).padStart(2,'0')}</span>{x.title}</button>)}</section></div>}
 </>
}
createRoot(document.getElementById('root')).render(<App/>);
