const loading=document.querySelector('#loading');
function fallback(error){
 document.querySelectorAll('nav button, #prev, #next, #reset').forEach(b=>b.disabled=true);
 const status=document.querySelector('#status');if(status)status.textContent='3D unavailable on this browser';
 loading.hidden=false;loading.style.display='flex';loading.style.flexDirection='column';loading.style.alignItems='flex-start';loading.style.justifyContent='center';loading.style.padding='25px';loading.style.font='16px/1.6 Georgia';
 loading.replaceChildren();const title=document.createElement('h2');title.textContent='The archive is here. 3D needs WebGL.';loading.append(title);
 const p=document.createElement('p');p.textContent='The interactive book could not start in this browser. Try Chrome or Edge with graphics acceleration enabled, or another device. No installation or local server is required.';loading.append(p);
 const details=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('pre');summary.textContent='Technical details';pre.textContent=error.message;pre.style.cssText='white-space:pre-wrap;font:11px/1.5 monospace;max-height:130px;overflow:auto';details.append(summary,pre);loading.append(details);
 const button=document.createElement('button');button.textContent='Retry 3D';button.onclick=()=>location.reload();button.style.cssText='padding:10px 18px;margin-top:15px;background:transparent;border:1px solid #aaa;cursor:pointer';loading.append(button);
}
try{await import('./book.js')}catch(error){console.error('Beijing in Pages initialization:',error);fallback(error)}
