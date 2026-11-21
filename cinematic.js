const video=document.querySelector('#architectural-film'),play=document.querySelector('#film-play'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
video.muted=true;video.loop=true;video.playsInline=true;
function start(){if(reduced.matches){video.pause();video.removeAttribute('autoplay');play.hidden=false;return;}video.play().then(()=>play.hidden=true).catch(()=>play.hidden=false)}
play.onclick=()=>video.play().then(()=>play.hidden=true).catch(()=>play.textContent='Video unavailable — showing still');video.addEventListener('error',()=>{video.style.opacity='0';play.hidden=false;play.textContent='Video unavailable — showing still'});reduced.addEventListener('change',start);start();
// The diagonal boundary is part of document flow: scroll carries the light page upward over the film.
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('#background h2,#background .background-copy').forEach(el=>{el.classList.add('reference-reveal');observer.observe(el)});

const shell=document.querySelector('.hero-scroll-shell'),hero=document.querySelector('.reference-home');let queued=false;
function updateHero(){queued=false;const travel=Math.max(1,shell.offsetHeight-innerHeight);const p=Math.max(0,Math.min(1,-shell.getBoundingClientRect().top/travel));const exit=Math.max(0,(p-.55)/.45);hero.style.setProperty('--title-exit',reduced.matches?0:exit*exit);}
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateHero)}},{passive:true});window.addEventListener('resize',updateHero);updateHero();
