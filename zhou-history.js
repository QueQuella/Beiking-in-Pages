const rows=[
['1921–1926 年｜周口店龙骨山遗址的初步调查与试掘','Preliminary survey and trial excavations of Zhoukoudian Longgushan Site during 1921 to 1926'],
['1927–1937 年｜周口店遗址的系统发掘','Systematic excavations of Zhoukoudian Site during 1927 to 1937'],
['1929 年｜首个北京猿人头盖骨化石发现','Discovery of the first Homo erectus pekinensis skullcap in 1929'],
['1933 年｜山顶洞人遗址发掘','Excavations of Upper Cave Man Site in 1933'],
['1937–1948 年｜发掘中断，北京人头盖骨化石遗失','Suspension of excavation and loss of Peking Man skull fossils during 1937 to 1948'],
['1949 年起｜周口店遗址发掘与研究工作恢复','Resumption of excavation and research at Zhoukoudian Site since 1949'],
['1987 年｜周口店北京人遗址列入《世界文化遗产名录》','Zhoukoudian Peking Man Site inscribed on the World Heritage List in 1987'],
['接下来进一步探索：首个出土的“北京人”头骨','Explore further: the first excavated “Peking Man” skullcap']];
let token=0;
export function cancelHistory(){token++;document.querySelector('#zhou-history')?.remove()}
export async function playHistory(){cancelHistory();const id=token,node=document.createElement('section');node.id='zhou-history';node.setAttribute('aria-label','历史脉络 / Historical timeline');node.innerHTML='<div class="history-film"><p>历史脉络 / HISTORICAL TIMELINE</p>'+rows.map(()=>'<div class="history-row"><div lang="zh"></div><div lang="en"></div></div>').join('')+'</div>';document.body.append(node);const elements=[...node.querySelectorAll('.history-row')],start=performance.now();return new Promise(resolve=>{function frame(now){if(id!==token){resolve(false);return}const t=now-start;node.style.opacity=t<400?t/400:t>8050?Math.max(0,1-(t-8050)/700):1;elements.forEach((el,i)=>{const p=Math.max(0,Math.min(1,(t-400-i*850)/760));el.children[0].textContent=rows[i][0].slice(0,Math.ceil(rows[i][0].length*p));el.children[1].textContent=rows[i][1].slice(0,Math.ceil(rows[i][1].length*p));el.classList.toggle('revealed',p>0)});const film=node.firstElementChild;film.style.transform='translateY(-'+Math.max(0,Math.min(1,(t-3600)/3500))*Math.max(0,film.scrollHeight-innerHeight+120)+'px)';if(t<8750)requestAnimationFrame(frame);else{node.remove();resolve(true)}}requestAnimationFrame(frame)})}
