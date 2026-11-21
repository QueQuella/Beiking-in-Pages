import {loadZhou} from './zhou-model.js';
import * as T from './vendor/three.module.js';
const control=id=>document.querySelector(id)||{};
const el=document.querySelector('#scene'), scene=new T.Scene();
let renderer;
const canvas=document.createElement('canvas');let creationError='';
canvas.addEventListener('webglcontextcreationerror',event=>{creationError=event.statusMessage||'No driver status returned';});
try{renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true})}catch(error){throw new Error(error.message+'\n'+creationError);}
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();const message=document.createElement('div');message.id='context-lost';message.style.cssText='position:absolute;inset:30%;background:#eeeadd;padding:25px;z-index:2';message.textContent='The graphics context was lost. Reload this page to restart the 3D book.';el.append(message);document.querySelectorAll('button').forEach(b=>b.disabled=true);});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;el.append(renderer.domElement);
const camera=new T.PerspectiveCamera(34,1,.1,100);const home=new T.Vector3(4.9,8.4,9.5);camera.position.copy(home);camera.lookAt(0,0,0);
scene.add(new T.HemisphereLight(0xfff8e8,0xb0b6a3,2.2));const light=new T.DirectionalLight(0xfff5df,3.6);light.position.set(-3,9,4);light.castShadow=true;light.shadow.mapSize.set(2048,2048);light.shadow.camera.left=-7;light.shadow.camera.right=7;light.shadow.camera.top=7;light.shadow.camera.bottom=-7;light.shadow.normalBias=.025;light.shadow.bias=-.0002;light.shadow.radius=5;scene.add(light);const fill=new T.DirectionalLight(0xe2e9f0,1);fill.position.set(5,4,-3);scene.add(fill);
const ground=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.13}));ground.rotation.x=-Math.PI/2;ground.position.y=-.2;ground.receiveShadow=true;scene.add(ground);
const book=new T.Group();book.rotation.y=-.12;scene.add(book);
const paper=new T.MeshStandardMaterial({color:0xf4efd9,roughness:.95}),edge=new T.MeshStandardMaterial({color:0xd7d1b6,roughness:1}),red=new T.MeshStandardMaterial({color:0x743e32,roughness:.9}),green=new T.MeshStandardMaterial({color:0x7c8970,roughness:.9}),stone=new T.MeshStandardMaterial({color:0xc4b897,roughness:1});
function box(w,h,d,x,y,z,mat=paper,parent=book){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
box(8.05,.12,5.45,0,-.12,0,green);box(.19,.17,5.45,0,-.05,0,red);
for(const side of [-1,1]){box(3.87,.17,5.22,side*2,.01,0,edge);for(let j=0;j<12;j++)box(3.86,.006,5.2,side*2,.015+j*.013,0,paper);}
function texture(ch,left=false){const c=document.createElement('canvas');c.width=900;c.height=1200;const ctx=c.getContext('2d');ctx.fillStyle='#f3efdd';ctx.fillRect(0,0,900,1200);let seed=42;for(let i=0;i<35000;i++){seed=(seed*16807)%2147483647;const x=seed%900;seed=(seed*16807)%2147483647;const y=seed%1200;ctx.fillStyle=i%2?'rgba(106,91,55,.035)':'rgba(255,255,255,.2)';ctx.fillRect(x,y,1,1)}ctx.fillStyle='#8d483a';ctx.font='18px Arial';ctx.fillText(left?'FIELD NOTES / BEIJING':'BEIJING IN PAGES / HERITAGE ARCHIVE',70,90);ctx.strokeStyle='#c9c4ae';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(70,120);ctx.lineTo(830,120);ctx.stroke();if(left){ctx.font='18px Georgia';ctx.fillStyle='#93917c';ctx.fillText('A place remembered, a story unfolded.',70,1090)}else{ctx.fillStyle='#914c3d';ctx.font='110px Georgia';ctx.fillText('0'+(ch+1),75,310);ctx.fillStyle='#343c30';ctx.font='58px Georgia';ctx.fillText(ch===1?'Zhoukoudian':'Heritage Site',75,430);ctx.fillText(ch===1?'Site':'0'+(ch+1),75,505);ctx.font='26px Georgia';const lines=ch===1?['A textured scan of an excavation display.','Explore the uploaded model and move','between observation points and spaces.']:['A fragment of the city, held in paper.','This chapter opens a space for looking,','remembering and interpreting heritage.'];lines.forEach((l,i)=>ctx.fillText(l,75,625+i*43));ctx.strokeStyle='#ccc6ae';ctx.beginPath();ctx.moveTo(75,825);ctx.lineTo(805,825);ctx.stroke();ctx.font='17px Arial';ctx.fillStyle='#777d69';ctx.fillText('LOCATION     BEIJING / FIELD TRIP ARCHIVE',75,885);ctx.fillText('OBJECT          PLACEHOLDER STUDY '+(ch+1),75,925);ctx.fillText('MEDIUM        DIGITAL PAPER / 3D FORM',75,965);ctx.fillStyle='#914c3d';ctx.font='18px Georgia';ctx.fillText('An encounter, preserved.',75,1090)}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t}
const textures=Array.from({length:4},(_,i)=>texture(i));const leftTex=texture(0,true);
function page(x,map){const mesh=new T.Mesh(new T.PlaneGeometry(3.85,5.2,1,1),new T.MeshStandardMaterial({map,roughness:1,side:T.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.205,0);mesh.receiveShadow=true;book.add(mesh);return mesh}
page(-2,leftTex);const right=page(2,textures[0]);
// Keep the centre fold clear so the bound spine never intersects a turning page.
const popup=new T.Group();popup.position.set(-2,.22,0);book.add(popup);
function roof(w,d,y,parent){const shape=new T.Shape();shape.moveTo(-w/2,0);shape.lineTo(0,.55);shape.lineTo(w/2,0);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false});const m=new T.Mesh(geo,red);m.position.set(0,y,-d/2);m.castShadow=true;parent.add(m);return m}
let bookModelVersion=0;
function model(ch){const version=++bookModelVersion;disposeScan();popup.traverse(o=>o.geometry?.dispose());popup.clear();box(2.65,.045,2.5,0,.025,0,paper,popup);if(ch===0||ch===3){box(2.2,.14,1.7,0,.12,0,stone,popup);for(const x of [-.85,0,.85])for(const z of [-.6,.6])box(.08,1.3,.08,x,.83,z,red,popup);roof(2.6,1.95,1.48,popup);if(ch===3){box(1.1,.8,.55,0,.65,0,stone,popup);roof(1.3,.8,1.05,popup)}}if(ch===1){loadZhou().then(root=>{if(current!==1||anim||version!==bookModelVersion)return;root.traverse(o=>{if(o.isMesh){const geometry=o.geometry.clone();geometry.scale(.56,.56,.56);geometry.rotateY(Math.PI*1.5);geometry.translate(0,.06,0);const mesh=new T.Mesh(geometry,o.material.clone());mesh.castShadow=mesh.receiveShadow=true;popup.add(mesh);}});setupScan();popStart=performance.now();}).catch(error=>{console.error('Zhoukoudian book asset:',error);document.querySelector('#explore').textContent='OPEN ZHOUKOUDIAN SITE ↗';});}if(ch===2){box(1.8,.15,1.7,0,.15,0,stone,popup);for(let j=0;j<3;j++){box(1.1-j*.25,.6,1.1-j*.25,0,.5+j*.65,0,stone,popup);roof(1.55-j*.3,1.5-j*.3,.8+j*.65,popup)}}}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let scanPoints,parts=[],pointTargets,pointOrigins,pointCollapse,scanMinY=0;
const pointSprite=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#fff';x.beginPath();x.arc(32,32,29,0,Math.PI*2);x.fill();const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t})();
let current=0,target=0,anim=null,popStart=performance.now(),focused=false;model(0);setupScan();
const turnGeo=new T.PlaneGeometry(3.85,5.2,48,12);turnGeo.translate(1.925,0,0);turnGeo.rotateX(-Math.PI/2);const base=turnGeo.attributes.position.array.slice();const turn=new T.Mesh(turnGeo,new T.MeshStandardMaterial({map:textures[0],side:T.FrontSide,roughness:1}));turn.position.set(.075,.23,0);const turnBack=new T.Mesh(turnGeo,new T.MeshStandardMaterial({map:leftTex,side:T.BackSide,roughness:1}));turn.add(turnBack);turn.castShadow=true;turn.receiveShadow=true;turn.visible=false;book.add(turn);
const nav=document.querySelector('#chapters');for(let i=0;i<4;i++){const b=nav.children[i];b.disabled=false;b.innerHTML=`<img src="${i===1?'media/zhou-thumbnail.jpg':'media/chapter-'+(i+1)+'.svg'}" alt="Heritage image placeholder"><strong>${i===1?'周口店遗址 / Zhoukoudian Site':'Heritage Site 0'+(i+1)}</strong>`;b.onclick=()=>{target=i;startTurn()};}
const explore=document.querySelector('#explore');
function ui(){explore.hidden=true;explore.href='#explore/heritage-0'+(current+1);explore.textContent=current===1?'EXPLORE ZHOUKOUDIAN SITE ↗':'EXPLORE HERITAGE 0'+(current+1)+' ↗';[...nav.children].forEach((b,i)=>{b.classList.toggle('active',i===current);b.setAttribute('aria-current',i===current?'page':'false')});control('#prev').disabled=!!anim||current===0;control('#next').disabled=!!anim||current===3;control('#pagecount').textContent=`0${current+1} — 04`;control('#status').textContent=anim?'Turning the archive…':`0${current+1} / 04 — Heritage Site 0${current+1}`}
function startTurn(){if(anim){anim=null;turn.visible=false;popup.visible=true;}if(current===target){ui();return;}focused=false;const dir=Math.sign(target-current);anim={start:performance.now(),dir,next:target};turn.visible=true;turn.material.map=textures[dir>0?current:target];turnBack.material.map=leftTex;right.material.map=textures[dir>0?target:current];ui()}
control('#prev').onclick=()=>{target=Math.max(0,current-1);startTurn()};control('#next').onclick=()=>{target=Math.min(3,current+1);startTurn()};document.querySelector('#reset').onclick=()=>{focused=false};
const raycaster=new T.Raycaster(),pointer=new T.Vector2();
renderer.domElement.onclick=e=>{if(anim)return;const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);if(raycaster.intersectObject(popup,true).length)focused=!focused;};
renderer.domElement.style.cursor='zoom-in';
function resize(){const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(el);ui();document.querySelector('#loading').remove();
const lookTarget=new T.Vector3(0,.15,0);
function frame(now){requestAnimationFrame(frame);if(anim){const p=Math.min(1,(now-anim.start)/1350),e=p*p*(3-2*p),a=(anim.dir>0?e:1-e)*Math.PI;const pos=turnGeo.attributes.position;for(let i=0;i<pos.count;i++){const x=base[i*3],z=base[i*3+2],u=x/3.85;let px=0,py=0;const steps=32;for(let k=0;k<steps;k++){const q=(k+.5)/steps*u;const angle=a+Math.sin(Math.PI*e)*.52*Math.sin(q*Math.PI);px+=Math.cos(angle)*x/steps;py+=Math.sin(angle)*x/steps;}pos.setXYZ(i,px,py,z)}pos.needsUpdate=true;turnGeo.computeVertexNormals();popup.visible=false;if(p===1){current=anim.next;anim=null;turn.visible=false;right.material.map=textures[current];model(current);setupScan();popup.visible=true;popup.scale.y=.001;popStart=now;ui();}}else{const t=Math.min(1,(now-popStart)/850),e=1-Math.pow(1-t,3);popup.scale.y=Math.max(.001,e);popup.rotation.z=(1-e)*-.16;explore.hidden=t<1||current!==target;}const desired=focused?new T.Vector3(1.2,5.8,6.8):home.clone();camera.position.lerp(desired,.045);lookTarget.lerp(focused?new T.Vector3(-1.65,.7,0):new T.Vector3(0,.15,0),.045);camera.lookAt(lookTarget);updateScan(now);if(!document.hidden&&!document.body.classList.contains('exploring'))renderer.render(scene,camera)}requestAnimationFrame(frame);
window.__book={get state(){return{current,target,turning:!!anim,popup:popup.scale.y}},go(i){target=Math.max(0,Math.min(3,i));startTurn()}};


function disposeScan(){
 if(scanPoints){popup.remove(scanPoints);scanPoints.geometry.dispose();scanPoints.material.dispose();scanPoints=null}
 pointTargets=pointOrigins=pointCollapse=null;parts=[];
}
function setupScan(){
 disposeScan();parts=popup.children.filter(o=>o.isMesh).slice(1);scanMinY=Infinity;if(!parts.length)return;
 const targets=[];let seed=1301;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 for(const mesh of parts){
  mesh.material=mesh.material.clone();mesh.updateMatrix();const pos=mesh.geometry.attributes.position,idx=mesh.geometry.index;const limit=parts.length===1?26000:Math.max(1400,Math.floor(18000/parts.length));
  if(pos.count>=limit){const step=Math.max(1,Math.ceil(pos.count/limit));for(let i=0;i<pos.count;i+=step)addTarget(new T.Vector3().fromBufferAttribute(pos,i).applyMatrix4(mesh.matrix))}
  else{const triangles=Math.floor((idx?idx.count:pos.count)/3);for(let i=0;i<limit;i++){const tri=Math.floor(rand()*triangles)*3,a=rand(),b0=rand(),b=a+b0>1?1-b0:b0,u=a+b0>1?1-a:a;const ids=[0,1,2].map(k=>idx?idx.getX(tri+k):tri+k),v0=new T.Vector3().fromBufferAttribute(pos,ids[0]),v1=new T.Vector3().fromBufferAttribute(pos,ids[1]),v2=new T.Vector3().fromBufferAttribute(pos,ids[2]);addTarget(v0.multiplyScalar(1-u-b).addScaledVector(v1,u).addScaledVector(v2,b).applyMatrix4(mesh.matrix))}}
 }
 function addTarget(p){targets.push(p.x,p.y,p.z);scanMinY=Math.min(scanMinY,p.y)}
 pointTargets=new Float32Array(targets);pointOrigins=new Float32Array(pointTargets.length);pointCollapse=new Float32Array(pointTargets.length/3*4);
 for(let i=0,p=0;i<pointTargets.length;i+=3,p++){const a=rand()*Math.PI*2,r=.45+rand()*1.35;pointOrigins[i]=pointTargets[i]+Math.cos(a)*r;pointOrigins[i+1]=pointTargets[i+1]+(rand()-.25)*1.6;pointOrigins[i+2]=pointTargets[i+2]+Math.sin(a)*r;pointCollapse[p*4]=rand()*.38;pointCollapse[p*4+1]=(rand()-.5)*.9;pointCollapse[p*4+2]=(rand()-.5)*.9;pointCollapse[p*4+3]=.75+rand()*.75}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pointOrigins.slice(),3));geo.attributes.position.setUsage(T.DynamicDrawUsage);scanPoints=new T.Points(geo,new T.PointsMaterial({map:pointSprite,color:0xd9f5e2,size:.038,transparent:true,opacity:.92,alphaTest:.025,depthWrite:false,blending:T.AdditiveBlending,sizeAttenuation:true}));popup.add(scanPoints);
}
const ease=t=>t*t*(3-2*t);
function updateScan(now){
 if(anim||!scanPoints)return;const phase=reducedMotion?6.5:((now-popStart)/1000)%12.5,positions=scanPoints.geometry.attributes.position.array;
 const gathering=phase<4.2,gather=ease(T.MathUtils.clamp(phase/4,0,1)),collapsing=phase>=8,collapseT=T.MathUtils.clamp((phase-8)/3.1,0,1);
 for(let i=0,p=0;i<positions.length;i+=3,p++){
  if(gathering){positions[i]=T.MathUtils.lerp(pointOrigins[i],pointTargets[i],gather);positions[i+1]=T.MathUtils.lerp(pointOrigins[i+1],pointTargets[i+1],gather);positions[i+2]=T.MathUtils.lerp(pointOrigins[i+2],pointTargets[i+2],gather)}
  else if(collapsing){const d=pointCollapse[p*4],fall=ease(T.MathUtils.clamp((collapseT-d)/(1-d),0,1)),spread=fall*fall;positions[i]=pointTargets[i]+pointCollapse[p*4+1]*spread;positions[i+1]=T.MathUtils.lerp(pointTargets[i+1],scanMinY-.015,Math.min(1,spread*pointCollapse[p*4+3]));positions[i+2]=pointTargets[i+2]+pointCollapse[p*4+2]*spread}
  else{positions[i]=pointTargets[i];positions[i+1]=pointTargets[i+1];positions[i+2]=pointTargets[i+2]}
 }
 scanPoints.geometry.attributes.position.needsUpdate=true;scanPoints.visible=phase<4.9||phase>=7.75;
 scanPoints.material.opacity=phase<.45?.92*phase/.45:phase<4.1?.92:phase<4.9?.92*(1-(phase-4.1)/.8):phase<8?.82:phase<11.25?.82:.82*(1-T.MathUtils.clamp((phase-11.25)/.85,0,1));
 const solidIn=T.MathUtils.smoothstep(phase,3.65,4.8),solidOut=1-T.MathUtils.smoothstep(phase,7.85,8.35);for(const mesh of parts){mesh.visible=phase>=3.6&&phase<8.4;mesh.material.transparent=true;mesh.material.opacity=solidIn*solidOut;mesh.material.depthWrite=mesh.material.opacity>.45}
}
