const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
const access=document.querySelector('#charm-access');
let w,h,dpr,anchor,length,radius,points=[],drag=null,paused=false,sound=false,ac,last=0,accumulator=0,angle=0,elasticLength=0,stretchVelocity=0;
let charm='eye';
const charmStorageKey='little-doodles.selected-charm';
const charmChoices=['eye','dream','pig','chillies','nazar','thor','ironman','spiderman','captain','hulk','panda','bunny','penguin','koala','elephant','fox','owl','bubududu','dog'];
const N=24,dt=1/120;
function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);anchor={x:w*(w<700?.68:.665),y:-8};length=Math.min(h*(w<700?.4:.33),300);radius=w<700?53:72;reset();}
function reset(){elasticLength=length;stretchVelocity=0;points=Array.from({length:N+1},(_,i)=>({x:anchor.x,y:anchor.y+length*i/N,px:anchor.x,py:anchor.y+length*i/N}));drag=null;angle=0;document.querySelector('#hint').style.opacity=1;}
function physics(){
// A damped spring controls cord extension independently of its flexible shape.
const targetLength=drag?Math.max(length,Math.hypot(drag.x-anchor.x,drag.y-anchor.y)):length;
const stiffness=drag?180:65,damping=drag?24:5;
stretchVelocity+=((targetLength-elasticLength)*stiffness-stretchVelocity*damping)*dt;
elasticLength+=stretchVelocity*dt;
if(elasticLength<length*.65){elasticLength=length*.65;stretchVelocity=Math.max(0,stretchVelocity);}
if(elasticLength>length*2.5){elasticLength=length*2.5;stretchVelocity=Math.min(0,stretchVelocity);}
const seg=elasticLength/N;for(let i=1;i<=N;i++){const p=points[i],vx=(p.x-p.px)*.998,vy=(p.y-p.py)*.998;p.px=p.x;p.py=p.y;p.x+=vx;p.y+=vy+1100*dt*dt;}
if(drag){const p=points[N];p.x+=(drag.x-p.x)*.24;p.y+=(drag.y-p.y)*.24;}
for(let k=0;k<32;k++){points[0].x=anchor.x;points[0].y=anchor.y;for(let i=0;i<N;i++){const a=points[i],b=points[i+1],dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy)||.001;const correction=(dist-seg)/dist;const wa=i===0?0:1,wb=i+1===N?.035:1;const total=wa+wb;a.x+=dx*correction*wa/total;a.y+=dy*correction*wa/total;b.x-=dx*correction*wb/total;b.y-=dy*correction*wb/total;}const p=points[N];p.x=Math.max(radius,Math.min(w-radius,p.x));p.y=Math.min(h-radius*(charm==='dream'?3.5:1)-85,p.y);}
}
function circle(x,y,r,fill){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
function draw(){ctx.clearRect(0,0,w,h);const p=points[N];const target=Math.atan2(p.x-anchor.x,p.y-anchor.y);angle+=(target-angle)*.09;const cx=p.x+Math.sin(angle)*radius*.88,cy=p.y+Math.cos(angle)*radius*.88;
ctx.save();ctx.translate(cx+16,h-164);ctx.scale(1,.16);const shadow=ctx.createRadialGradient(0,0,1,0,0,radius*1.4);shadow.addColorStop(0,'rgba(63,74,51,.12)');shadow.addColorStop(1,'rgba(63,74,51,0)');circle(0,0,radius*1.4,shadow);ctx.restore();
ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<=N;i++)ctx.lineTo(points[i].x,points[i].y);ctx.strokeStyle='#bbb8a6';ctx.lineWidth=1.7*Math.sqrt(length/elasticLength);ctx.stroke();ctx.save();ctx.translate(cx,cy);ctx.rotate(-angle);
if(charm!=='bubududu'){ctx.beginPath();ctx.ellipse(0,-radius*.94,5,9,0,0,Math.PI*2);ctx.strokeStyle='#9f9475';ctx.lineWidth=2.5;ctx.stroke();}
if(charm==='bubududu'){drawBubuDudu();}else if(charm==='dream'){drawDreamCatcher();}else if(charm==='pig'){drawPig();}else if(charm==='chillies'){drawChillies();}else if(charm==='nazar'){drawNazar();}else if(['koala','elephant','fox','owl','seal','unicorn'].includes(charm)){drawMoreAnimals(charm);}else if(charm==='hulk'){drawBabyHulk();}else if(['panda','bunny','kitten','penguin','frog','bear','dog'].includes(charm)){drawCuteAnimal(charm);}else if(['thor','ironman','spiderman','captain'].includes(charm)){drawHero(charm);}else{
ctx.shadowColor='rgba(19,37,76,.18)';ctx.shadowBlur=20;ctx.shadowOffsetY=12;
let g=ctx.createRadialGradient(-radius*.4,-radius*.5,1,0,0,radius);g.addColorStop(0,'#4079db');g.addColorStop(.48,'#164eac');g.addColorStop(.85,'#123982');g.addColorStop(1,'#0a235b');circle(0,0,radius,g);ctx.shadowColor='transparent';
ctx.beginPath();ctx.arc(0,0,radius-2,0,Math.PI*2);ctx.strokeStyle='#548ae66b';ctx.lineWidth=1.5;ctx.stroke();
g=ctx.createRadialGradient(-20,-25,0,0,0,radius*.65);g.addColorStop(0,'#fffff5');g.addColorStop(.85,'#ececdd');g.addColorStop(1,'#b9cfda');circle(-1,1,radius*.655,g);
g=ctx.createRadialGradient(-12,-12,0,1,2,radius*.43);g.addColorStop(0,'#79cae9');g.addColorStop(.68,'#4aa8d6');g.addColorStop(1,'#2677ae');circle(1,2,radius*.435,g);
g=ctx.createRadialGradient(-6,-8,1,2,2,radius*.23);g.addColorStop(0,'#172d48');g.addColorStop(1,'#061329');circle(2,2,radius*.23,g);
ctx.save();ctx.rotate(-.45);g=ctx.createRadialGradient(-12,-radius*.7,1,-12,-radius*.7,radius*.48);g.addColorStop(0,'#ffffff79');g.addColorStop(1,'#ffffff00');ctx.scale(1,.38);circle(-12,-radius*1.8,radius*.5,g);ctx.restore();circle(-radius*.12,-radius*.15,radius*.055,'#ffffffaa');circle(-radius*.03,-radius*.09,radius*.021,'#ffffff8a');ctx.beginPath();ctx.arc(0,0,radius*.88,.25,1.35);ctx.strokeStyle='#9bbef344';ctx.lineWidth=2;ctx.stroke();}
ctx.restore();
const hitRadius=radius*(charm==='bubududu'?1.35:1);access.style.left=(cx-hitRadius)+'px';access.style.top=(cy-hitRadius)+'px';access.style.width=access.style.height=hitRadius*2+'px';canvas.dataset.charmX=cx;canvas.dataset.charmY=cy;
}
function frame(t){accumulator+=Math.min((t-last)/1000,.04);last=t;if(!paused){while(accumulator>=dt){physics();accumulator-=dt;}}else accumulator=0;draw();requestAnimationFrame(frame);}
function hit(e){return Math.hypot(e.clientX-Number(canvas.dataset.charmX),e.clientY-Number(canvas.dataset.charmY))<radius*(charm==='bubududu'?1.35:1)+15;}
canvas.addEventListener('pointerdown',e=>{if(!hit(e))return;if(paused)togglePause();canvas.setPointerCapture(e.pointerId);drag={x:points[N].x,y:points[N].y,ox:e.clientX-points[N].x,oy:e.clientY-points[N].y};canvas.style.cursor='grabbing';document.querySelector('#hint').style.opacity=0;document.querySelector('#status').textContent='Hold on. Let go. Find your flow.';});
canvas.addEventListener('pointermove',e=>{if(drag){let dx=e.clientX-drag.ox-anchor.x,dy=e.clientY-drag.oy-anchor.y;const distance=Math.hypot(dx,dy),max=length*2.5;if(distance>max){dx*=max/distance;dy*=max/distance;}drag.x=anchor.x+dx;drag.y=anchor.y+dy;}else canvas.style.cursor=hit(e)?'grab':'default';});
function release(){if(!drag)return;drag=null;canvas.style.cursor='grab';if(sound)chime();document.querySelector('#status').textContent='A little physics. A little magic.';}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
function togglePause(){paused=!paused;document.querySelector('#pause-label').textContent=paused?'Resume':'Pause';document.querySelector('#pause-icon').textContent=paused?'▷':'Ⅱ';document.querySelector('#pause').setAttribute('aria-label',paused?'Resume animation':'Pause animation');}
function chime(){ac??=new (window.AudioContext||window.webkitAudioContext)();ac.resume();const o=ac.createOscillator(),gain=ac.createGain();o.type='sine';o.frequency.setValueAtTime(660,ac.currentTime);gain.gain.setValueAtTime(.035,ac.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+1.4);o.connect(gain).connect(ac.destination);o.start();o.stop(ac.currentTime+1.4);}
document.querySelector('#sound').onclick=()=>{sound=!sound;const b=document.querySelector('#sound');b.setAttribute('aria-label',sound?'Disable sound':'Enable sound');b.title=sound?'Disable sound':'Enable sound';b.style.background=sound?'#e6eadf':'transparent';b.setAttribute('aria-pressed',String(sound));b.querySelector('path').setAttribute('d',sound?'M11 5 6 9H3v6h3l5 4V5Z M15 8q5 4 0 8 M18 5q8 7 0 14':'M11 5 6 9H3v6h3l5 4V5Z M16 9l5 6m0-6-5 6');if(sound)chime();};
document.querySelector('#reset').onclick=()=>{reset();if(paused)togglePause();};document.querySelector('#pause').onclick=togglePause;
const dialog=document.querySelector('dialog');document.querySelector('#about').onclick=()=>dialog.showModal();document.querySelector('#close-about').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
access.addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')){e.preventDefault();if(paused)togglePause();const p=points[N];p.px+=e.key==='ArrowLeft'?9:e.key==='ArrowRight'?-9:0;p.py+=e.key==='ArrowUp'?12:e.key==='ArrowDown'?-7:0;document.querySelector('#hint').style.opacity=0;}if(e.code==='Space'){e.preventDefault();togglePause();}});document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='r'&&!dialog.open)reset();});
window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{last=performance.now();accumulator=0;});resize();requestAnimationFrame(frame);

function drawDreamCatcher(){
 const r=radius;
 ctx.shadowColor='#66503525';ctx.shadowBlur=8;ctx.shadowOffsetY=4;
 ctx.beginPath();ctx.arc(0,0,r*.95,0,Math.PI*2);ctx.strokeStyle='#92704f';ctx.lineWidth=7;ctx.stroke();
 ctx.shadowColor='transparent';ctx.strokeStyle='#d4b98c';ctx.lineWidth=2;
 ctx.beginPath();ctx.arc(0,0,r*.95,0,Math.PI*2);ctx.stroke();
 // Fine wrapped thread around a wooden hoop.
 for(let i=0;i<90;i++){const a=i*Math.PI*2/90;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.9,Math.sin(a)*r*.9);ctx.lineTo(Math.cos(a+.022)*r,Math.sin(a+.022)*r);ctx.strokeStyle='#ead9b5';ctx.lineWidth=.7;ctx.stroke();}
 let nodes=Array.from({length:12},(_,i)=>{const a=i*Math.PI/6-Math.PI/2;return {x:Math.cos(a)*r*.89,y:Math.sin(a)*r*.89};});
 ctx.strokeStyle='#b6a082';ctx.lineWidth=.85;
 for(let ring=0;ring<8;ring++){const next=[];ctx.beginPath();for(let i=0;i<nodes.length;i++){const a=nodes[i],b=nodes[(i+1)%nodes.length];const mid={x:(a.x+b.x)*.45,y:(a.y+b.y)*.45};ctx.moveTo(a.x,a.y);ctx.lineTo(mid.x,mid.y);ctx.lineTo(b.x,b.y);next.push(mid);}ctx.stroke();nodes=next;}
 circle(0,0,5,'#4c8c91');circle(-1,-1,1.5,'#cbe4db');
 const velocity=points[N].x-points[N].px;
 for(let i=-1;i<=1;i++){
  const x=i*r*.58,y=Math.sqrt((r*.95)**2-x*x),cord=r*(i===0?.62:.34);
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.max(-.5,Math.min(.5,velocity*.045))+angle*.18+i*.1);
  ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(i*4,cord*.5,0,cord);ctx.strokeStyle='#b49a73';ctx.lineWidth=1.2;ctx.stroke();
  circle(0,cord*.4,4,'#568e90');circle(0,cord*.4+8,3,'#b99863');
  ctx.translate(0,cord);const f=r*.75;
  ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-f*.45,f*.27,-f*.3,f*.75,0,f);ctx.bezierCurveTo(f*.33,f*.64,f*.3,f*.19,0,0);
  const gradient=ctx.createLinearGradient(-f*.2,0,f*.2,f);gradient.addColorStop(0,'#b9c7b9');gradient.addColorStop(.5,i===0?'#638f8e':'#91a697');gradient.addColorStop(1,'#d5c4a0');ctx.fillStyle=gradient;ctx.fill();
  ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(0,f);ctx.strokeStyle='#eee7d4';ctx.lineWidth=.9;ctx.stroke();
  for(let j=1;j<10;j++){const t=j/11,spread=Math.sin(t*Math.PI)*f*.22;ctx.beginPath();ctx.moveTo(-spread,f*t-5);ctx.lineTo(0,f*t+3);ctx.lineTo(spread,f*t-5);ctx.strokeStyle='#e9e5cf88';ctx.lineWidth=.65;ctx.stroke();}
  ctx.restore();
 }
}
function selectCharm(value){
 if(!charmChoices.includes(value))return;
 charm=value;
 try{localStorage.setItem(charmStorageKey,charm);}catch{}
 document.querySelectorAll('[data-charm]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.charm===charm)));
 const name={eye:'Evil eye',dream:'Dream catcher',pig:'Pink pig',chillies:'Chillies & lemon',nazar:'Nazar doll',thor:'Cute Thor',ironman:'Cute Iron Man Face',spiderman:'Cute Spider-Man Face',captain:'Cute Captain America',hulk:'Baby Cute Hulk',panda:'Little Panda',bunny:'Marshmallow Bunny',kitten:'Peach Kitten',penguin:'Baby Penguin',frog:'Pocket Frog',bear:'Honey Bear',dog:'Cute Dog',koala:'Sleepy Koala',elephant:'Baby Elephant',fox:'Little Fox',owl:'Little Owl',seal:'Baby Seal',unicorn:'Pastel Unicorn',bubududu:'Bubu & Dudu'}[charm];
 access.setAttribute('aria-label',name+' charm. Use arrow keys to swing and Space to pause.');
 canvas.setAttribute('aria-label','An interactive '+name.toLowerCase()+' hanging on a stretchy thread');
 reset();
 document.querySelector('#status').textContent='A little physics. A little magic.';
}
document.querySelectorAll('[data-charm]').forEach(button=>button.addEventListener('click',()=>selectCharm(button.dataset.charm)));

function drawPig(){
 const r=radius;
 // Soft pink ears sit behind the rounded ceramic face.
 for(const side of [-1,1]){
  ctx.save();ctx.scale(side,1);
  ctx.beginPath();ctx.moveTo(r*.25,-r*.65);ctx.bezierCurveTo(r*.35,-r*1.22,r*.83,-r*1.19,r*.88,-r*.84);ctx.lineTo(r*.8,-r*.25);ctx.closePath();ctx.fillStyle='#e78ca8';ctx.fill();
  ctx.beginPath();ctx.moveTo(r*.43,-r*.66);ctx.quadraticCurveTo(r*.66,-r*1.1,r*.73,-r*.82);ctx.lineTo(r*.67,-r*.47);ctx.closePath();ctx.fillStyle='#c96788';ctx.fill();ctx.restore();
 }
 const g=ctx.createRadialGradient(-r*.34,-r*.45,r*.06,0,0,r);
 g.addColorStop(0,'#ffe0e8');g.addColorStop(.65,'#f5adc3');g.addColorStop(1,'#dd7f9e');
 ctx.shadowColor='#9a456329';ctx.shadowBlur=17;ctx.shadowOffsetY=10;circle(0,0,r*.94,g);ctx.shadowColor='transparent';
 for(const side of [-1,1]){
  circle(side*r*.56,r*.15,r*.17,'#ed8dac');
  ctx.beginPath();ctx.ellipse(side*r*.32,-r*.18,r*.065,r*.087,0,0,Math.PI*2);ctx.fillStyle='#543342';ctx.fill();
  circle(side*r*.32-r*.018,-r*.205,r*.018,'#fff5f6');
 }
 ctx.beginPath();ctx.ellipse(0,r*.23,r*.37,r*.26,0,0,Math.PI*2);
 const snout=ctx.createLinearGradient(0,0,0,r*.49);snout.addColorStop(0,'#ffc8d8');snout.addColorStop(1,'#ea91ad');ctx.fillStyle=snout;ctx.fill();ctx.strokeStyle='#d87b99';ctx.lineWidth=1.3;ctx.stroke();
 for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(side*r*.13,r*.22,r*.048,r*.076,0,0,Math.PI*2);ctx.fillStyle='#a55372';ctx.fill();}
 ctx.beginPath();ctx.arc(0,r*.42,r*.17,.18,Math.PI-.18);ctx.strokeStyle='#a55372';ctx.lineWidth=1.8;ctx.lineCap='round';ctx.stroke();
 ctx.beginPath();ctx.ellipse(-r*.28,-r*.57,r*.2,r*.055,-.4,0,Math.PI*2);ctx.fillStyle='#fff7fa70';ctx.fill();
}

function drawChillies(){
 const r=radius;
 ctx.save();ctx.scale(r,r);
 // Three horizontal chillies, tied together down their centers.
 ctx.lineCap='round';
 ctx.beginPath();ctx.moveTo(0,-.94);ctx.lineTo(0,1.0);ctx.strokeStyle='#b69b70';ctx.lineWidth=.025;ctx.stroke();
 for(let i=0;i<3;i++){
  ctx.save();ctx.translate(0,.28+i*.31);ctx.rotate((i-1)*.07);
  const green=ctx.createLinearGradient(0,-.12,0,.18);green.addColorStop(0,'#8ebd44');green.addColorStop(.4,'#428b32');green.addColorStop(1,'#1e5525');
  ctx.beginPath();ctx.moveTo(-.63,-.08);ctx.bezierCurveTo(-.25,-.22,.47,-.05,.92,-.23);ctx.bezierCurveTo(.75,.15,-.15,.27,-.62,.12);ctx.quadraticCurveTo(-.77,.05,-.63,-.08);ctx.fillStyle=green;ctx.fill();
  ctx.beginPath();ctx.moveTo(-.67,.01);ctx.quadraticCurveTo(-.87,-.03,-.91,-.17);ctx.strokeStyle='#537a2c';ctx.lineWidth=.055;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-.5,-.04);ctx.quadraticCurveTo(-.1,-.09,.48,-.05);ctx.strokeStyle='#c5e49b77';ctx.lineWidth=.023;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-.025,-.13);ctx.lineTo(-.025,.18);ctx.moveTo(.02,-.13);ctx.lineTo(.02,.18);ctx.strokeStyle='#e0cc9c';ctx.lineWidth=.02;ctx.stroke();
  ctx.restore();
 }
 ctx.beginPath();ctx.moveTo(0,-.02);ctx.lineTo(0,.28);ctx.strokeStyle='#b69b70';ctx.lineWidth=.025;ctx.stroke();
 ctx.save();ctx.translate(0,-1.28);
 const yellow=ctx.createRadialGradient(-.16,.58,.02,0,.77,.53);yellow.addColorStop(0,'#fff5a2');yellow.addColorStop(.48,'#f6d83c');yellow.addColorStop(1,'#caa416');
 ctx.beginPath();ctx.moveTo(0,.35);ctx.bezierCurveTo(.1,.44,.45,.39,.46,.77);ctx.bezierCurveTo(.46,1.06,.15,1.16,.04,1.19);ctx.quadraticCurveTo(0,1.29,-.05,1.19);ctx.bezierCurveTo(-.55,1.07,-.57,.53,-.12,.43);ctx.closePath();ctx.fillStyle=yellow;ctx.fill();
 for(let i=0;i<36;i++){const a=i*2.3998,d=Math.sqrt(i/36)*.34;circle(Math.cos(a)*d,.79+Math.sin(a)*d,.009,i%2?'#b99a202f':'#fffac866');}
 ctx.beginPath();ctx.ellipse(-.16,.59,.12,.035,-.5,0,Math.PI*2);ctx.fillStyle='#fffbd777';ctx.fill();ctx.restore();ctx.restore();
}
function drawNazar(){
 const r=radius;
 ctx.save();ctx.scale(r,r);
 // A stylized red-and-black guardian face with horns and painted details.
 for(const side of [-1,1]){
  ctx.save();ctx.scale(side,1);
  ctx.beginPath();ctx.moveTo(.42,-.64);ctx.quadraticCurveTo(.96,-.72,.84,-1.16);ctx.quadraticCurveTo(.53,-1.02,.28,-.78);ctx.closePath();ctx.fillStyle='#262127';ctx.fill();
  ctx.beginPath();ctx.moveTo(.55,-.78);ctx.lineTo(.8,-1.08);ctx.strokeStyle='#76606a';ctx.lineWidth=.035;ctx.stroke();
  circle(.86,.04,.21,'#9f202d');circle(.87,.04,.11,'#252026');ctx.restore();
 }
 const red=ctx.createRadialGradient(-.25,-.35,.04,0,0,1);red.addColorStop(0,'#ed5447');red.addColorStop(.6,'#c72d35');red.addColorStop(1,'#821b2c');
 ctx.beginPath();ctx.ellipse(0,0,.84,.93,0,0,Math.PI*2);ctx.fillStyle=red;ctx.fill();
 ctx.beginPath();ctx.moveTo(-.75,-.44);ctx.quadraticCurveTo(-.5,-1.03,0,-.85);ctx.quadraticCurveTo(.5,-1.03,.75,-.44);ctx.lineTo(.45,-.57);ctx.lineTo(.2,-.48);ctx.lineTo(0,-.61);ctx.lineTo(-.2,-.48);ctx.lineTo(-.45,-.57);ctx.closePath();ctx.fillStyle='#231e24';ctx.fill();
 circle(0,-.48,.09,'#f0c76f');circle(0,-.48,.04,'#a6222c');
 for(const side of [-1,1]){
  ctx.save();ctx.scale(side,1);
  ctx.beginPath();ctx.ellipse(.34,-.14,.24,.19,-.17,0,Math.PI*2);ctx.fillStyle='#fff4d9';ctx.fill();ctx.strokeStyle='#302129';ctx.lineWidth=.035;ctx.stroke();circle(.3,-.12,.092,'#231e24');circle(.275,-.15,.024,'#fff');
  ctx.beginPath();ctx.moveTo(.12,-.32);ctx.quadraticCurveTo(.37,-.47,.6,-.33);ctx.strokeStyle='#231e24';ctx.lineWidth=.09;ctx.lineCap='round';ctx.stroke();
  ctx.beginPath();ctx.moveTo(.05,.35);ctx.bezierCurveTo(.27,.17,.48,.52,.66,.28);ctx.bezierCurveTo(.6,.64,.27,.5,.05,.43);ctx.closePath();ctx.fillStyle='#231e24';ctx.fill();
  for(let i=0;i<3;i++)circle(.61-i*.02,.08+i*.075,.018,'#f5ce95');ctx.restore();
 }
 ctx.beginPath();ctx.moveTo(0,-.14);ctx.quadraticCurveTo(-.19,.17,-.13,.23);ctx.quadraticCurveTo(0,.3,.13,.23);ctx.quadraticCurveTo(.19,.17,0,-.14);ctx.fillStyle='#f16a4b';ctx.fill();
 ctx.beginPath();ctx.ellipse(0,.59,.35,.19,0,0,Math.PI*2);ctx.fillStyle='#2b1b24';ctx.fill();
 for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*.23,.47);ctx.lineTo(side*.16,.73);ctx.lineTo(side*.08,.48);ctx.closePath();ctx.fillStyle='#fff1d4';ctx.fill();}
 ctx.beginPath();ctx.moveTo(-.09,.65);ctx.quadraticCurveTo(-.12,.95,0,.99);ctx.quadraticCurveTo(.12,.95,.09,.65);ctx.fillStyle='#ef615c';ctx.fill();ctx.beginPath();ctx.moveTo(0,.73);ctx.lineTo(0,.91);ctx.strokeStyle='#a5283e';ctx.lineWidth=.017;ctx.stroke();ctx.restore();
}

const menuToggle=document.querySelector('#menu-toggle');
const doodleMenu=document.querySelector('#doodle-menu');
const stringToggle=document.querySelector('#string-toggle');
const stringOptions=document.querySelector('#string-options');
function closeDoodleMenu(returnFocus=false){
 doodleMenu.hidden=true;
 menuToggle.setAttribute('aria-expanded','false');
 menuToggle.setAttribute('aria-label','Open doodle menu');
 if(returnFocus)menuToggle.focus();
}
menuToggle.addEventListener('click',()=>{
 const open=doodleMenu.hidden;
 doodleMenu.hidden=!open;
 menuToggle.setAttribute('aria-expanded',String(open));
 menuToggle.setAttribute('aria-label',open?'Close doodle menu':'Open doodle menu');
 if(open)stringToggle.focus();
});
stringToggle.addEventListener('click',()=>{
 stringOptions.hidden=!stringOptions.hidden;
 stringToggle.setAttribute('aria-expanded',String(!stringOptions.hidden));
});
document.querySelectorAll('[data-charm]').forEach(button=>button.addEventListener('click',()=>closeDoodleMenu(true)));
document.addEventListener('pointerdown',event=>{
 if(!doodleMenu.hidden&&!doodleMenu.contains(event.target)&&!menuToggle.contains(event.target))closeDoodleMenu();
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&!doodleMenu.hidden){event.preventDefault();closeDoodleMenu(true);}
});
document.addEventListener('focusin',event=>{
 if(!doodleMenu.hidden&&!doodleMenu.contains(event.target)&&!menuToggle.contains(event.target))closeDoodleMenu();
});

// Restore only known options; storage restrictions must not prevent playing.
try{
 const savedCharm=localStorage.getItem(charmStorageKey);
 if(charmChoices.includes(savedCharm))selectCharm(savedCharm);
}catch{}

function heroOval(x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
function heroPath(points,fill,stroke){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.025;ctx.stroke();}}
function heroStar(x,y,size,fill){heroPath(Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?size*.44:size;return [x+Math.cos(a)*r,y+Math.sin(a)*r];}),fill);}
function heroSmile(y){ctx.beginPath();ctx.arc(0,y,.12,.2,Math.PI-.2);ctx.strokeStyle='#75483f';ctx.lineWidth=.025;ctx.lineCap='round';ctx.stroke();}
function heroEyes(y){for(const side of [-1,1]){heroOval(side*.29,y,.064,.09,'#282b39');circle(side*.29-.017,y-.025,.018,'#fff');heroOval(side*.43,y+.17,.1,.045,'#eeb0a0');}}
function drawHero(kind){
 ctx.save();ctx.scale(radius,radius);ctx.lineJoin='round';ctx.lineCap='round';
 if(kind==='ironman'){
  const red=ctx.createLinearGradient(-.7,-.8,.7,.9);red.addColorStop(0,'#e96b62');red.addColorStop(.45,'#b52e3c');red.addColorStop(1,'#731e32');
  heroOval(0,0,.87,.96,red);heroOval(-.82,.09,.09,.24,'#902d37');heroOval(.82,.09,.09,.24,'#902d37');
  const gold=ctx.createLinearGradient(-.6,-.7,.6,.75);gold.addColorStop(0,'#fff0a2');gold.addColorStop(.5,'#e7bf63');gold.addColorStop(1,'#b8873e');
  heroPath([[-.62,-.69],[-.23,-.78],[-.14,-.48],[.14,-.48],[.23,-.78],[.62,-.69],[.68,.17],[.44,.68],[.2,.81],[-.2,.81],[-.44,.68],[-.68,.17]],gold,'#9f693b');
  for(const side of [-1,1]){
   ctx.save();ctx.scale(side,1);heroPath([[.12,-.1],[.56,-.15],[.49,.07],[.17,.08]],'#394354');
   ctx.shadowColor='#b6f9ff';ctx.shadowBlur=9;heroPath([[.16,-.055],[.5,-.1],[.46,.025],[.19,.035]],'#d6fcff');ctx.shadowBlur=0;
   heroPath([[.45,.25],[.56,.18],[.43,.56],[.22,.61]],'#b58945');ctx.restore();
  }
  ctx.beginPath();ctx.moveTo(-.19,.51);ctx.quadraticCurveTo(0,.58,.19,.51);ctx.strokeStyle='#6b513e';ctx.lineWidth=.04;ctx.stroke();
  heroPath([[-.24,.85],[0,.91],[.24,.85],[.18,.74],[-.18,.74]],'#d24746');
 }else if(kind==='spiderman'){
  const red=ctx.createRadialGradient(-.3,-.4,.05,0,0,1);red.addColorStop(0,'#f16a68');red.addColorStop(.65,'#d33d4d');red.addColorStop(1,'#94283e');
  ctx.save();ctx.beginPath();ctx.ellipse(0,0,.86,.96,0,0,Math.PI*2);ctx.clip();heroOval(0,0,.86,.96,red);
  ctx.strokeStyle='#702d3b';ctx.lineWidth=.018;
  for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.beginPath();ctx.moveTo(0,-.13);ctx.lineTo(Math.cos(a)*1.5,-.13+Math.sin(a)*1.5);ctx.stroke();}
  for(let ring=1;ring<6;ring++){const d=ring*.24;ctx.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6;if(!i)ctx.moveTo(Math.cos(a)*d,-.13+Math.sin(a)*d);ctx.quadraticCurveTo(Math.cos((a+b)/2)*d*.88,-.13+Math.sin((a+b)/2)*d*.88,Math.cos(b)*d,-.13+Math.sin(b)*d);}ctx.stroke();}ctx.restore();
  for(const side of [-1,1]){ctx.save();ctx.scale(side,1);ctx.beginPath();ctx.moveTo(.1,-.18);ctx.quadraticCurveTo(.38,-.32,.71,-.43);ctx.bezierCurveTo(.78,.13,.46,.4,.2,.2);ctx.quadraticCurveTo(.11,.08,.1,-.18);ctx.fillStyle='#fff9ef';ctx.fill();ctx.strokeStyle='#25283a';ctx.lineWidth=.065;ctx.stroke();ctx.restore();}
 }else{
  const thor=kind==='thor';
  // Small body and oversized head for a playful, chibi silhouette.
  if(thor)heroPath([[-.33,.13],[-.59,.9],[.53,.9],[.3,.13]],'#bb3948');
  heroOval(0,.56,.35,.39,thor?'#48536c':'#366baf');
  for(const side of [-1,1]){heroOval(side*.18,.9,.14,.12,thor?'#403f51':'#a94348');heroOval(side*.38,.48,.12,.2,thor?'#f1c9a3':'#366baf');}
  if(thor){for(const x of [-.17,.17])for(const y of [.4,.61])circle(x,y,.065,'#c6d2df');}else{heroStar(0,.42,.13,'#f4f0df');heroPath([[-.27,.64],[.27,.64],[.25,.77],[-.25,.77]],'#eee5d9');for(const x of [-.17,0,.17])heroPath([[x-.035,.64],[x+.035,.64],[x+.035,.77],[x-.035,.77]],'#c44650');}
  if(thor)heroOval(0,-.18,.72,.7,'#d8ae56');
  heroOval(0,-.22,.65,.6,'#f3d0ae');heroEyes(-.2);heroSmile(.005);
  if(thor){
   for(const side of [-1,1]){ctx.save();ctx.scale(side,1);heroPath([[.48,-.56],[.66,-.24],[.68,.36],[.42,.24],[.49,-.08]],'#e7bd60');ctx.restore();}
   ctx.beginPath();ctx.moveTo(-.65,-.33);ctx.quadraticCurveTo(-.69,-.96,0,-.96);ctx.quadraticCurveTo(.69,-.96,.65,-.33);ctx.lineTo(.4,-.47);ctx.quadraticCurveTo(0,-.68,-.4,-.47);ctx.closePath();
   const silver=ctx.createLinearGradient(-.6,-.9,.6,-.3);silver.addColorStop(0,'#f0f4f5');silver.addColorStop(.5,'#a8b8c9');silver.addColorStop(1,'#73869c');ctx.fillStyle=silver;ctx.fill();
   for(const side of [-1,1]){ctx.save();ctx.scale(side,1);heroPath([[.5,-.63],[.94,-.95],[.84,-.59],[.61,-.38]],'#dbe5ec','#8b9eaf');ctx.restore();}
   ctx.save();ctx.translate(-.56,.52);ctx.rotate(-.22);heroPath([[-.035,-.12],[.035,-.12],[.035,.39],[-.035,.39]],'#8c634c');heroPath([[-.24,-.34],[.24,-.34],[.26,-.05],[-.23,-.05]],'#b6c8d4','#70879b');heroPath([[-.21,-.3],[.19,-.3],[.19,-.24],[-.21,-.24]],'#e2edf0');ctx.restore();
  }else{
   ctx.beginPath();ctx.moveTo(-.64,-.08);ctx.bezierCurveTo(-.86,-1.14,.86,-1.14,.64,-.08);ctx.lineTo(.44,-.06);ctx.lineTo(.38,-.34);ctx.lineTo(.13,-.31);ctx.lineTo(0,-.13);ctx.lineTo(-.13,-.31);ctx.lineTo(-.38,-.34);ctx.lineTo(-.44,-.06);ctx.closePath();ctx.fillStyle='#386cae';ctx.fill();
   ctx.font='bold .28px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff7e4';ctx.fillText('A',0,-.49);
   for(const side of [-1,1]){ctx.save();ctx.scale(side,1);heroPath([[.54,-.49],[.81,-.62],[.71,-.35],[.55,-.28]],'#e9e9df');ctx.restore();}
   circle(.48,.57,.38,'#bf414b');circle(.48,.57,.29,'#f2eee2');circle(.48,.57,.21,'#c74951');circle(.48,.57,.14,'#386da9');heroStar(.48,.57,.115,'#fff7e5');
  }
 }
 ctx.restore();
}

function drawCuteAnimal(kind){
 ctx.save();ctx.scale(radius,radius);ctx.lineCap='round';ctx.lineJoin='round';
 const colors={panda:['#fffaf0','#393c49'],bunny:['#fff5ed','#eab2ba'],kitten:['#f6c095','#bf825f'],penguin:['#637a96','#405773'],frog:['#b4d88a','#78a761'],bear:['#d6a06d','#986745'],dog:['#f1d1a4','#af805a']};
 const [coat,accent]=colors[kind];
 const body=ctx.createLinearGradient(-.4,-.2,.4,.9);body.addColorStop(0,coat);body.addColorStop(1,accent);
 // Tiny feet, a plump body, and an oversized head.
 for(const side of [-1,1])heroOval(side*.23,.84,.19,.12,kind==='penguin'?'#edb564':accent);
 heroOval(0,.5,.44,.43,body);
 heroOval(0,.55,.28,.27,kind==='frog'?'#deebad':'#fff0dc');
 for(const side of [-1,1]){
  ctx.save();ctx.translate(side*.41,.44);ctx.rotate(side*-.3);heroOval(0,0,.12,.23,kind==='panda'?accent:coat);ctx.restore();
 }
 if(kind==='bunny'){
  for(const side of [-1,1]){ctx.save();ctx.translate(side*.3,-.72);ctx.rotate(side*.15);heroOval(0,-.23,.18,.4,coat);heroOval(0,-.23,.095,.29,'#efbbc2');ctx.restore();}
 }else if(kind==='kitten'){
  for(const side of [-1,1]){ctx.save();ctx.scale(side,1);heroPath([[.23,-.59],[.64,-1.02],[.72,-.35]],coat);heroPath([[.4,-.62],[.6,-.85],[.63,-.44]],'#e89fa0');ctx.restore();}
 }else if(kind==='dog'){
  for(const side of [-1,1]){ctx.save();ctx.translate(side*.55,-.35);ctx.rotate(side*-.2);heroOval(0,0,.23,.46,accent);heroOval(0,.08,.12,.28,'#c69578');ctx.restore();}
 }else if(kind==='panda'||kind==='bear'){
  for(const side of [-1,1]){circle(side*.51,-.68,.24,kind==='panda'?accent:coat);circle(side*.51,-.68,.13,kind==='panda'?'#555463':'#eac29c');}
 }
 const face=ctx.createRadialGradient(-.25,-.4,.04,0,-.15,.86);face.addColorStop(0,coat);face.addColorStop(.75,coat);face.addColorStop(1,kind==='panda'||kind==='bunny'?'#e6d8cc':accent);
 heroOval(0,-.18,.7,.62,face);
 if(kind==='penguin'){
  heroOval(-.2,-.12,.31,.42,'#fff6e7');heroOval(.2,-.12,.31,.42,'#fff6e7');
  ctx.beginPath();ctx.moveTo(-.12,-.76);ctx.quadraticCurveTo(-.04,-.96,.05,-.75);ctx.quadraticCurveTo(.13,-.9,.19,-.73);ctx.strokeStyle=accent;ctx.lineWidth=.065;ctx.stroke();
 }
 if(kind==='frog'){
  for(const side of [-1,1]){circle(side*.39,-.65,.24,coat);circle(side*.39,-.65,.15,'#f8f4d8');circle(side*.39,-.65,.073,'#384533');circle(side*.39-.022,-.68,.023,'#fff');}
 }else{
  for(const side of [-1,1]){
   if(kind==='panda'){ctx.save();ctx.translate(side*.29,-.21);ctx.rotate(side*.3);heroOval(0,0,.17,.2,accent);ctx.restore();}
   heroOval(side*.28,-.2,.064,.085,kind==='panda'?'#171e29':'#393039');circle(side*.28-.019,-.225,.021,'#fff');
  }
 }
 for(const side of [-1,1])heroOval(side*.44,0,.105,.053,kind==='frog'?'#edb4a6':'#efa9aa');
 if(kind==='penguin'){
  heroPath([[-.105,-.015],[.105,-.015],[0,.1]],'#eab05b');
 }else if(kind==='frog'){
  ctx.beginPath();ctx.moveTo(-.2,.02);ctx.quadraticCurveTo(0,.23,.2,.02);ctx.strokeStyle='#527247';ctx.lineWidth=.025;ctx.stroke();
 }else{
  if(kind==='dog'){heroOval(-.1,.015,.17,.13,'#fff1d8');heroOval(.1,.015,.17,.13,'#fff1d8');heroOval(0,.13,.057,.09,'#eaa6aa');}
  if(kind==='bear')heroOval(0,.015,.22,.15,'#f5d9af');
  heroPath([[-.065,-.015],[.065,-.015],[0,.045]],kind==='bunny'||kind==='kitten'?'#c78791':'#51413e');
  ctx.beginPath();ctx.moveTo(0,.045);ctx.quadraticCurveTo(-.02,.13,-.1,.085);ctx.moveTo(0,.045);ctx.quadraticCurveTo(.02,.13,.1,.085);ctx.strokeStyle='#795756';ctx.lineWidth=.022;ctx.stroke();
 }
 if(kind==='kitten'){
  for(const side of [-1,1]){for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(side*.46,.02+i*.07);ctx.lineTo(side*.68,-.005+i*.12);ctx.strokeStyle='#ac785f';ctx.lineWidth=.018;ctx.stroke();}}
  for(const x of [-.16,0,.16]){ctx.beginPath();ctx.moveTo(x,-.72);ctx.lineTo(x*.85,-.54);ctx.strokeStyle='#d5946c';ctx.lineWidth=.045;ctx.stroke();}
 }
 // A little accessory gives each figurine its own personality.
 if(kind==='panda'){
  ctx.beginPath();ctx.moveTo(.2,.82);ctx.lineTo(.29,.32);ctx.strokeStyle='#87a66a';ctx.lineWidth=.04;ctx.stroke();
  heroOval(.17,.45,.12,.04,'#91b772');heroOval(.34,.58,.12,.04,'#91b772');
 }else if(kind==='bunny'){
  heroPath([[-.11,.41],[.13,.44],[0,.81]],'#eaa468');
  for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(0,.44);ctx.quadraticCurveTo(side*.18,.22,side*.07,.29);ctx.strokeStyle='#88ac73';ctx.lineWidth=.045;ctx.stroke();}
 }else if(kind==='kitten'){
  heroPath([[-.17,.29],[0,.35],[-.17,.42]],'#a487b4');heroPath([[.17,.29],[0,.35],[.17,.42]],'#a487b4');circle(0,.35,.045,'#c7aed3');
 }else if(kind==='dog'){
  heroPath([[-.36,.24],[.36,.24],[.32,.34],[-.32,.34]],'#87aaa0');circle(0,.36,.075,'#edca77');circle(-.015,.34,.018,'#fff1bb');
 }else if(kind==='penguin'){
  heroPath([[-.4,.24],[.38,.24],[.35,.34],[-.35,.34]],'#dea1a4');heroPath([[.13,.3],[.26,.3],[.28,.58],[.16,.59]],'#dea1a4');
 }else if(kind==='frog'){
  heroPath([[-.19,-.88],[-.22,-1.09],[-.07,-.99],[0,-1.17],[.09,-.99],[.23,-1.09],[.19,-.88]],'#edce77');circle(0,-.94,.029,'#e29e91');
 }else{
  heroOval(0,.62,.17,.18,'#ddb25f');heroPath([[-.18,.46],[.18,.46],[.16,.52],[-.16,.52]],'#b88943');
  ctx.beginPath();ctx.moveTo(0,.71);ctx.bezierCurveTo(-.21,.59,-.06,.53,0,.6);ctx.bezierCurveTo(.06,.53,.21,.59,0,.71);ctx.fillStyle='#fff0bf';ctx.fill();
 }
 ctx.restore();
}

function drawBabyHulk(){
 ctx.save();ctx.scale(radius,radius);ctx.lineCap='round';ctx.lineJoin='round';
 // Baby proportions: tiny limbs, purple shorts, and a big friendly face.
 for(const side of [-1,1]){heroOval(side*.23,.86,.18,.12,'#85bb70');heroOval(side*.42,.4,.16,.23,'#8dc677');circle(side*.47,.58,.16,'#99ce80');}
 const green=ctx.createLinearGradient(-.4,-.3,.4,.8);green.addColorStop(0,'#c0e99c');green.addColorStop(1,'#73ad65');
 heroOval(0,.43,.38,.4,green);
 heroPath([[-.36,.58],[.36,.58],[.34,.83],[.2,.79],[.1,.85],[0,.75],[-.1,.85],[-.23,.79],[-.34,.83]],'#9780bd');
 ctx.beginPath();ctx.moveTo(0,.64);ctx.lineTo(0,.75);ctx.strokeStyle='#74609d';ctx.lineWidth=.025;ctx.stroke();
 for(const side of [-1,1])circle(side*.64,-.16,.13,'#90c479');
 heroOval(0,-.2,.69,.63,green);
 heroPath([[-.67,-.38],[-.66,-.66],[-.49,-.75],[-.39,-.91],[-.17,-.85],[.01,-.96],[.17,-.83],[.37,-.88],[.5,-.73],[.63,-.68],[.68,-.35],[.5,-.49],[.4,-.38],[.26,-.55],[.09,-.47],[-.08,-.57],[-.25,-.46],[-.43,-.54],[-.51,-.35]],'#354a39');
 for(const side of [-1,1]){
  heroOval(side*.28,-.17,.071,.09,'#304035');circle(side*.28-.02,-.2,.023,'#fff');heroOval(side*.44,.01,.1,.05,'#d3b092');
  ctx.beginPath();ctx.moveTo(side*.17,-.34);ctx.quadraticCurveTo(side*.3,-.4,side*.39,-.34);ctx.strokeStyle='#4b6543';ctx.lineWidth=.038;ctx.stroke();
 }
 ctx.beginPath();ctx.moveTo(-.13,.06);ctx.quadraticCurveTo(0,.26,.13,.06);ctx.closePath();ctx.fillStyle='#506449';ctx.fill();heroPath([[-.08,.075],[.08,.075],[.055,.12],[-.055,.12]],'#fff7e5');
 ctx.beginPath();ctx.moveTo(-.19,.38);ctx.quadraticCurveTo(-.08,.42,0,.38);ctx.quadraticCurveTo(.08,.42,.19,.38);ctx.strokeStyle='#76ac63';ctx.lineWidth=.018;ctx.stroke();
 ctx.restore();
}

function drawMoreAnimals(kind){
 ctx.save();ctx.scale(radius,radius);ctx.lineCap='round';ctx.lineJoin='round';
 const palette={koala:['#c2c9d0','#8999a7'],elephant:['#b9c5db','#8d9fbe'],fox:['#efb082','#c97e56'],owl:['#c6afcf','#9680a4'],seal:['#f3f2eb','#bccdd0'],unicorn:['#fff1f3','#e8b7d4']};
 const [coat,shade]=palette[kind];
 const g=ctx.createLinearGradient(-.5,-.6,.5,.8);g.addColorStop(0,coat);g.addColorStop(1,shade);
 for(const side of [-1,1])heroOval(side*.23,.86,.19,.1,shade);
 heroOval(0,.48,.46,.44,g);heroOval(0,.53,.3,.3,kind==='fox'?'#fff0dc':'#f5eee7');
 for(const side of [-1,1]){ctx.save();ctx.translate(side*.43,.46);ctx.rotate(side*(kind==='seal'?-.85:-.3));heroOval(0,0,kind==='seal'?.12:.1,.23,coat);ctx.restore();}
 if(kind==='koala'||kind==='elephant'){
  for(const side of [-1,1]){heroOval(side*.6,-.36,kind==='elephant'?.35:.29,kind==='elephant'?.43:.29,shade);heroOval(side*.63,-.36,.2,kind==='elephant'?.3:.19,'#e8bdc8');}
 }else if(kind==='fox'||kind==='unicorn'||kind==='owl'){
  for(const side of [-1,1]){ctx.save();ctx.scale(side,1);heroPath([[.25,-.62],[.6,-1],[.7,-.32]],coat);heroPath([[.4,-.63],[.58,-.85],[.61,-.44]],kind==='fox'?'#78514c':'#dfb3c5');ctx.restore();}
 }
 heroOval(0,-.18,.68,.62,g);
 if(kind==='fox'){
  for(const side of [-1,1]){ctx.save();ctx.scale(side,1);ctx.beginPath();ctx.moveTo(0,.16);ctx.bezierCurveTo(.24,-.1,.38,-.03,.63,-.2);ctx.quadraticCurveTo(.55,.44,0,.32);ctx.closePath();ctx.fillStyle='#fff1da';ctx.fill();ctx.restore();}
 }else if(kind==='owl'){
  for(const side of [-1,1])heroOval(side*.27,-.2,.3,.33,'#fff0db');
  for(let row=0;row<2;row++)for(let col=-1;col<=1;col++){ctx.beginPath();ctx.arc(col*.14,.45+row*.14,.04,0,Math.PI);ctx.strokeStyle='#b39ba9';ctx.lineWidth=.018;ctx.stroke();}
 }else if(kind==='unicorn'){
  heroPath([[-.12,-.74],[0,-1.19],[.13,-.74]],'#efd491','#cbb378');
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-.04-i*.02,-1.03+i*.09);ctx.lineTo(.045+i*.02,-.995+i*.09);ctx.strokeStyle='#c9ab75';ctx.lineWidth=.016;ctx.stroke();}
  for(let i=0;i<4;i++)heroOval(-.28+i*.15,-.65+Math.sin(i)*.04,.13,.18,['#e4b2d2','#c1b5e0','#accfcf','#e8c2d5'][i]);
 }
 for(const side of [-1,1]){
  if(kind==='koala'||kind==='seal'){
   ctx.beginPath();ctx.arc(side*.27,-.2,.08,0,Math.PI);ctx.strokeStyle='#50505c';ctx.lineWidth=.028;ctx.stroke();
  }else{heroOval(side*.27,-.19,kind==='owl'?.085:.062,kind==='owl'?.11:.082,'#41404e');circle(side*.27-.02,-.22,.022,'#fff');}
  heroOval(side*.43,.005,.105,.045,'#e8b0bd');
 }
 if(kind==='elephant'){
  ctx.beginPath();ctx.moveTo(-.11,-.06);ctx.bezierCurveTo(-.14,.43,.05,.59,.22,.31);ctx.strokeStyle=shade;ctx.lineWidth=.18;ctx.stroke();ctx.beginPath();ctx.moveTo(-.08,0);ctx.quadraticCurveTo(-.08,.35,.08,.36);ctx.strokeStyle='#c8d3e4';ctx.lineWidth=.035;ctx.stroke();
 }else if(kind==='koala'){
  heroOval(0,-.01,.115,.16,'#606371');heroSmile(.13);
 }else if(kind==='owl'){
  heroPath([[-.07,.04],[.07,.04],[0,.15]],'#dfad71');
 }else if(kind==='unicorn'){
  heroOval(0,.09,.25,.15,'#f1d7e3');for(const side of [-1,1])circle(side*.09,.09,.019,'#bb8ea6');
  heroStar(0,.53,.13,'#d4b16b');
 }else{
  heroPath([[-.06,.025],[.06,.025],[0,.08]],'#61505b');
  ctx.beginPath();ctx.moveTo(0,.08);ctx.quadraticCurveTo(-.02,.15,-.09,.12);ctx.moveTo(0,.08);ctx.quadraticCurveTo(.02,.15,.09,.12);ctx.strokeStyle='#806370';ctx.lineWidth=.018;ctx.stroke();
  if(kind==='seal')for(const side of [-1,1])for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(side*.15,.06+i*.06);ctx.lineTo(side*.35,.035+i*.1);ctx.strokeStyle='#a0afb5';ctx.lineWidth=.014;ctx.stroke();}
 }
 if(kind==='fox'){
  heroPath([[-.32,.29],[.3,.29],[.24,.4],[-.27,.4]],'#87a89f');heroPath([[.1,.33],[.22,.33],[.24,.59],[.12,.6]],'#87a89f');
 }else if(kind==='koala'){
  ctx.beginPath();ctx.moveTo(.17,.8);ctx.lineTo(.24,.36);ctx.strokeStyle='#7e9b76';ctx.lineWidth=.027;ctx.stroke();for(let i=0;i<3;i++)heroOval(.2+(i%2?.08:-.04),.44+i*.1,.1,.035,'#a4b99a');
 }else if(kind==='elephant'){
  heroPath([[-.13,.56],[0,.61],[-.13,.69]],'#d1a2b9');heroPath([[.13,.56],[0,.61],[.13,.69]],'#d1a2b9');circle(0,.61,.035,'#f2d2dd');
 }else if(kind==='seal'){
  heroStar(0,.6,.14,'#e3bc83');
 }
 ctx.restore();
}

const themeToggle=document.querySelector('#theme-toggle');
function setTheme(theme){
 const dark=theme==='dark';
 document.documentElement.dataset.theme=dark?'dark':'light';
 const label=dark?'Switch to light background':'Switch to dark background';
 themeToggle.setAttribute('aria-label',label);
 themeToggle.setAttribute('aria-pressed',String(dark));
 themeToggle.title=label;
 themeToggle.querySelector('path').setAttribute('d',dark?'M12 3V1m0 22v-2M3 12H1m22 0h-2M4.2 4.2 2.8 2.8m18.4 18.4-1.4-1.4M4.2 19.8l-1.4 1.4M21.2 2.8l-1.4 1.4M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0':'M20 14.2A8.5 8.5 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z');
 document.querySelector('meta[name="theme-color"]').setAttribute('content',dark?'#191f25':'#f7f5ef');
 try{localStorage.setItem('little-doodles.theme',dark?'dark':'light');}catch{}
}
themeToggle.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
setTheme(document.documentElement.dataset.theme||'light');

function drawBubuDudu(){
 ctx.save();ctx.scale(radius,radius);ctx.lineCap='round';ctx.lineJoin='round';
 // The shared cord splits into two taut branches, one for each bear.
 ctx.beginPath();ctx.moveTo(-.64,-.19);ctx.lineTo(0,-.88);ctx.lineTo(.64,-.19);ctx.strokeStyle='#b9ac92';ctx.lineWidth=.024;ctx.stroke();
 circle(0,-.88,.044,'#b3a183');circle(0,-.89,.018,'#e4d5b5');
 for(const side of [-1,1]){
  ctx.save();ctx.translate(side*.64,.37);ctx.scale(.68,.68);
  const white=side===1,coat=white?'#fff9ef':'#ba896c',edge=white?'#bdb4a8':'#815b49',ink='#503b37';
  // Rounded ears, tiny feet, and a softly shaded body.
  for(const x of [-.4,.4]){circle(x,-.62,.2,coat);circle(x,-.62,.095,white?'#e9c9c2':'#c69a80');}
  for(const x of [-.22,.22])heroOval(x,.77,.18,.13,coat);
  const body=ctx.createLinearGradient(-.3,0,.3,.8);body.addColorStop(0,coat);body.addColorStop(1,white?'#e9dfd2':'#a7775c');
  heroOval(0,.38,.43,.43,body);
  heroOval(0,.48,.26,.23,white?'#fffaf1':'#d2ae8c');
  // Outer paw hangs down; inner paw reaches toward the other bear.
  ctx.save();ctx.translate(side*.41,.35);ctx.rotate(side*-.25);heroOval(0,0,.12,.21,coat);ctx.restore();
  ctx.beginPath();ctx.moveTo(-side*.29,.3);ctx.quadraticCurveTo(-side*.56,.43,-side*.88,.34);ctx.strokeStyle=edge;ctx.lineWidth=.19;ctx.stroke();ctx.strokeStyle=coat;ctx.lineWidth=.15;ctx.stroke();
  const face=ctx.createRadialGradient(-.22,-.4,.01,0,-.15,.7);face.addColorStop(0,white?'#fffef8':'#cea386');face.addColorStop(1,coat);
  heroOval(0,-.17,.6,.53,face);
  for(const x of [-.22,.22]){heroOval(x,-.16,.042,.059,ink);circle(x-.012,-.177,.012,'#fff8eb');heroOval(x*1.6,-.015,.085,.041,'#e6a29d');}
  heroOval(0,.015,.16,.1,white?'#f9eee3':'#dbb89b');
  heroOval(0,-.015,.042,.029,ink);
  ctx.beginPath();ctx.moveTo(0,.009);ctx.quadraticCurveTo(-.015,.073,-.07,.047);ctx.moveTo(0,.009);ctx.quadraticCurveTo(.015,.073,.07,.047);ctx.strokeStyle=ink;ctx.lineWidth=.019;ctx.stroke();
  ctx.restore();
 }
 // Overlapping paws make their handhold continuous as the pair swings.
 heroOval(-.025,.61,.085,.064,'#ba896c');heroOval(.035,.61,.069,.057,'#fff9ef');
 ctx.beginPath();ctx.moveTo(0,-.05);ctx.bezierCurveTo(-.22,-.19,-.09,-.31,0,-.2);ctx.bezierCurveTo(.09,-.31,.22,-.19,0,-.05);ctx.fillStyle='#e9a0ad';ctx.fill();
 ctx.restore();
}
