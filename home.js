"use strict";

const homeScreen = document.querySelector("#home");
const homeCanvas = document.querySelector("#hero-art");
const homeMotionButton = document.querySelector("#home-motion");
const homeSkipButton = document.querySelector("#home-skip");
const homeContext = homeCanvas.getContext("2d");
const homeReducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const homeWidth = 480;
const homeHeight = 240;
homeContext.scale(homeCanvas.width/homeWidth,homeCanvas.height/homeHeight);
homeContext.imageSmoothingEnabled = false;
const homeHarbor = createHomeHarbor(homeWidth,homeHeight);
const homeProgress = document.querySelector("#home-progress");
const homeProgressMeter = homeProgress.querySelector("progress");
const homeIntroLength = 13050;
const homeMenuStart = 11700;
let homeFrame = 0;
let homeTime = 0;
let homeLastFrame = null;
let homeWasOpened = false;
let homePaused = homeReducedMotion.matches;

let homeSeed = 3241;
function homeRandom() {
  homeSeed = (Math.imul(1664525, homeSeed) + 1013904223) >>> 0;
  return homeSeed / 4294967296;
}

const coinLaunch = 1.38;
const coinImpact = 3.53;
const coinCenter = [homeWidth/2,homeHeight/2];
const dotStart = 3.79;
const burstStart = 3.84;
const burstEnd = 4.62;
const pointLanding = 4.66;
const lineStart = pointLanding+1.50;
const cityStart = lineStart+.69;
const citySpread = 1.52;
const waterStart = 9.18;
const openingSounds = [[coinLaunch*1000,"openingFlip"],[2200,"openingMagic"],[3100,"openingTurn"],[burstStart*1000,"openingMagicBurst"],[pointLanding*1000,"openingLand"],
  [(pointLanding+.63)*1000,"openingTick"],[(pointLanding+1.07)*1000,"openingTick"],[lineStart*1000,"openingLine"],
  [(cityStart+.38)*1000,"openingRise"],[waterStart*1000,"openingWater"]];
const openingSparks = Array.from({length:28}, () => {
  const angle = homeRandom() * Math.PI * 2;
  return {dx:Math.cos(angle)*(17+homeRandom()*40),dy:Math.sin(angle)*(9+homeRandom()*34)};
});

function openingProgress(time, start, end) {
  return Math.max(0, Math.min(1, (time-start)/(end-start)));
}

function openingEase(progress) {
  return progress * progress * (3-2*progress);
}

function homePixel(x, y, width, height, color) {
  homeContext.fillStyle = color;
  homeContext.fillRect(Math.round(x), Math.round(y), width, height);
}

const harborCoins = document.querySelector("#harbor-coins");
const harborParticles = [];
const harborFlights = [];
const harborCoinSlots = [
  {water:false,button:null,readyAt:homeIntroLength+1500,expiresAt:0},
  {water:true,button:null,readyAt:homeIntroLength+4600,expiresAt:0}
];
let harborView=null;
let previousHarborPoint=null;

function syncHarborView() {
  const bounds=homeCanvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const scale=Math.max(bounds.width/homeWidth,bounds.height/homeHeight);
  const camera=parseFloat(getComputedStyle(homeCanvas).getPropertyValue("--home-camera-end")) || 75;
  harborView={
    scale,
    left:(bounds.width-homeWidth*scale)*camera/100,
    top:(bounds.height-homeHeight*scale)*.5,
    width:bounds.width,
    height:bounds.height
  };
}

function drawHarborInteraction() {
  const ctx=homeContext;
  ctx.save();
  for (let i=harborParticles.length-1;i>=0;i--) {
    const p=harborParticles[i];
    const age=(homeTime-p.at)/p.life;
    if (age>=1) {
      harborParticles.splice(i,1);
    } else if (p.water) {
      ctx.globalAlpha=(1-age)*.65;
      const radius=(4+age*18)*p.size;
      ctx.strokeStyle="#aed8d2";
      ctx.lineWidth=.55;
      ctx.beginPath();
      ctx.ellipse(p.x,p.y,radius,radius*.25,0,0,Math.PI*2);
      ctx.stroke();
      if (age>.15) {
        ctx.globalAlpha=(1-age)*.32;
        ctx.beginPath();
        ctx.ellipse(p.x,p.y,radius*.62,radius*.16,0,0,Math.PI*2);
        ctx.stroke();
      }
    } else {
      ctx.globalAlpha=(1-age)*.86;
      const x=p.x+p.dx*age;
      const y=p.y+p.dy*age;
      homePixel(x-1.5*p.size,y,p.size*3,.7,p.color);
      homePixel(x,y-1.5*p.size,.7,p.size*3,p.color);
    }
  }
  for (let i=harborFlights.length-1;i>=0;i--) {
    const flight=harborFlights[i];
    const age=(homeTime-flight.at)/flight.duration;
    if (age>=1) {
      harborFlights.splice(i,1);
      continue;
    }
    drawHarborFlight(ctx,flight,age);
  }
  ctx.restore();
}

function createHarborFlight(x,y) {
  const {left,width,scale,top}=harborView;
  const minX=-left/scale;
  const maxX=(width-left)/scale;
  const span=maxX-minX;
  const skyTop=Math.max(10,-top/scale+12);
  const skyY=skyTop+12+Math.random()*38;
  const direction=Math.random()<.5?-1:1;
  const drift=Math.random()<.5?-1:1;
  const headX=Math.max(minX+12,Math.min(maxX-12,x+drift*span*(.24+Math.random()*.42)));
  const launchShift=18+Math.random()*span*.30;
  const clampedLaunch=Math.max(minX+7,Math.min(maxX-7,x+drift*launchShift));
  const launchX=Math.abs(clampedLaunch-x)>=12?clampedLaunch:x-drift*launchShift;
  const exitX=direction<0?minX-12:maxX+12;
  const sweepX=direction<0?minX+span*.3:maxX-span*.3;
  const exitY=Math.max(skyTop,skyY+(Math.random()-.55)*44);
  return {
    x,y,launchX,headX,skyY,exitX,sweepX,exitY,
    bend:9+Math.random()*25,duration:1370+Math.random()*440,at:homeTime
  };
}

function harborFlightPoint(flight,progress) {
  const p=Math.max(0,progress);
  const split=.42;
  // The matching tangents join an oblique launch to the sweep across the sky.
  const base=p<split?0:split;
  const length=p<split?split:1-split;
  const t=(p-base)/length;
  const u=1-t;
  const direction=Math.sign(flight.exitX-flight.headX);
  const tangent=direction*flight.bend;
  const points=p<split
    ? [[flight.x,flight.y],[flight.launchX,flight.y-39],[flight.headX-tangent,flight.skyY+13],[flight.headX,flight.skyY]]
    : [[flight.headX,flight.skyY],[flight.headX+tangent*length/split,flight.skyY-13*length/split],[flight.sweepX,flight.exitY-7],[flight.exitX,flight.exitY]];
  return [0,1].map(axis=>u**3*points[0][axis]+3*u*u*t*points[1][axis]+3*u*t*t*points[2][axis]+t**3*points[3][axis]);
}

function drawHarborFlight(ctx,flight,age) {
  const point=progress=>harborFlightPoint(flight,progress);
  const [x,y]=point(age);
  const fade=1-openingProgress(age,.83,1);
  for(let segment=16;segment>=1;segment--){
    if(age-segment*.014<0) continue;
    const [tx,ty]=point(age-segment*.014);
    ctx.globalAlpha=fade*(1-segment/17)*.8;
    homePixel(tx,ty,segment<6?2:1,1,segment%3?"#efba72":"#afd4ce");
  }
  ctx.globalAlpha=fade;
  if (age<.23) {
    const width=Math.max(1,4*Math.abs(Math.cos(age*35)));
    homePixel(x-width,y-4,width*2,8,"#dba956");
    homePixel(x-width*.5,y-3,width,6,"#ffdc8a");
  } else {
    const span=age<.49?5:3;
    ctx.globalAlpha=fade*.45;
    homePixel(x-span,y-1,2*span+1,3,"#e6ac67");
    homePixel(x-1,y-span,3,2*span+1,"#e6ac67");
    ctx.globalAlpha=fade;
    homePixel(x-span,y,2*span+1,1,"#ffdf9c");
    homePixel(x,y-span,1,2*span+1,"#ffdf9c");
    homePixel(x,y,1,1,"#fff8d7");
  }
}

function chooseHarborCoinPosition(slot) {
  const {width,height,top,scale}=harborView;
  const bounds=homeCanvas.getBoundingClientRect();
  const clearance=28;
  const controls=[...document.querySelectorAll(
    ".top .language, #sound-settings, .home-period, .home-content h1, .home-subtitle, .home-menu button, .home-foot p, #home-motion"
  )].flatMap(element=>[...element.getClientRects()]);
  const minY=Math.max(clearance,top+(slot.water?homeHarbor.waterline+5:84)*scale);
  const maxY=Math.min(height-clearance,top+(slot.water?homeHeight-3:homeHarbor.waterline-5)*scale);
  if(maxY<=minY || width<=2*clearance) return null;

  // Sample the visible scene in screen coordinates, where UI hit areas are known.
  for(let attempt=0;attempt<48;attempt++){
    const x=clearance+Math.random()*(width-2*clearance);
    const y=minY+Math.random()*(maxY-minY);
    const screenX=x+bounds.left;
    const screenY=y+bounds.top;
    if(controls.some(rect=>screenX>rect.left-clearance && screenX<rect.right+clearance &&
       screenY>rect.top-clearance && screenY<rect.bottom+clearance)) continue;
    if(harborCoinSlots.some(other=>other!==slot && other.button &&
       Math.hypot(x-other.left*width,y-(top+other.y*scale))<56)) continue;
    return {left:x/width,y:(y-top)/scale};
  }
  return null;
}

function updateHarborCoins() {
  if (harborCoins.hidden || !harborView) return;
  for (const slot of harborCoinSlots) {
    if (slot.button && document.activeElement!==slot.button && homeTime>=slot.expiresAt) {
      slot.button.remove();
      slot.button=null;
      slot.readyAt=homeTime+2100+homeRandom()*2200;
    }
    if (!slot.button && homeTime>=slot.readyAt) {
      const position=chooseHarborCoinPosition(slot);
      if(!position){
        slot.readyAt=homeTime+1000;
        continue;
      }
      const button=document.createElement("button");
      button.type="button";
      button.className="harbor-coin";
      button.dataset.label="homeCoin";
      button.dataset.surface=slot.water?"water":"land";
      button.setAttribute("aria-label",t("homeCoin"));
      slot.button=button;
      Object.assign(slot,position);
      slot.expiresAt=homeTime+6200+homeRandom()*2100;
      harborCoins.append(button);
      button.addEventListener("click",()=>{
        const {scale,left}=harborView;
        const x=(slot.left*harborView.width-left)/scale;
        gameAudio.effect("harborCoin");
        if (!homePaused) harborFlights.push(createHarborFlight(x,slot.y));
        const focused=document.activeElement===button;
        button.remove();
        slot.button=null;
        slot.readyAt=homeTime+3300+homeRandom()*1700;
        if (focused) {
          (harborCoins.querySelector("button") || homeMotionButton).focus({preventScroll:true});
        }
      });
    }
    if (slot.button) {
      const bob=homePaused?0:Math.sin(homeTime*.003+slot.y)*2;
      slot.button.style.left=slot.left*100+"%";
      slot.button.style.top=(harborView.top+(slot.y+bob)*harborView.scale)+"px";
    }
  }
}

homeScreen.addEventListener("pointermove",event=>{
  if (harborCoins.hidden || homePaused || !harborView || event.pointerType==="touch" || event.target.closest("button")) return;
  const bounds=homeCanvas.getBoundingClientRect();
  const x=(event.clientX-bounds.left-harborView.left)/harborView.scale;
  const y=(event.clientY-bounds.top-harborView.top)/harborView.scale;
  const water=y>=homeHarbor.waterline;
  const prior=previousHarborPoint;
  if (prior && prior.water===water &&
      (homeTime-prior.at<(water?98:25) || Math.hypot(x-prior.x,y-prior.y)<(water?6:2))) return;
  previousHarborPoint={x,y,water,at:homeTime};
  const colors=["#fff0b4","#83c6bf","#efbf78"];
  for(let i=0;i<(water?1:3);i++){
    harborParticles.push({
      x,y,water,at:homeTime,life:water?820:300+homeRandom()*370,
      size:water?.55+homeRandom()*.36:1+homeRandom(),
      dx:(homeRandom()-.5)*12,dy:-3-homeRandom()*11,color:colors[i]
    });
  }
  if (harborParticles.length>78) harborParticles.splice(0,harborParticles.length-78);
},{passive:true});
homeScreen.addEventListener("pointerleave",()=>{previousHarborPoint=null;});
new ResizeObserver(()=>{
  const previous=harborView;
  syncHarborView();
  if (harborCoins.hidden) return;
  if(previous && (previous.width!==harborView.width || previous.height!==harborView.height)){
    for(const slot of harborCoinSlots){
      if(!slot.button) continue;
      const position=chooseHarborCoinPosition(slot);
      if(position) Object.assign(slot,position);
    }
  }
  if (homePaused) updateHarborCoins();
}).observe(homeScreen);

function drawHomeScenery() {
  const seconds = homeTime / 1000;
  if (seconds >= cityStart || homeTime >= homeIntroLength) {
    homeHarbor.background(homeContext,seconds,openingEase(openingProgress(seconds,cityStart,8.9)));
    const flow = openingEase(openingProgress(seconds,waterStart,waterStart+2.03));
    homeHarbor.draw(homeContext,seconds,{rise:seconds-cityStart,flow,spread:citySpread});
  }
  if (homeTime < homeIntroLength) drawOpening(seconds);
  else drawHarborInteraction();
}

const coinStars=Array.from({length:100},(_,index)=>({
  angle:index*2.39996+homeRandom()*.22,
  radius:42+Math.pow(homeRandom(),1.6)*163,
  delay:homeRandom()*.53,
  size:index%11===0?2.9+homeRandom()*1.7:.45+homeRandom()*1.2,
  front:index%4===0,
  color:["#ffdf9e","#c8b9ff","#9cefe2","#fff3d5"][index%4]
}));
const coinTiles=[];
for(let y=-36;y<36;y+=4) {
  for(let x=-36;x<36;x+=4) {
    const r=Math.hypot(x+2,y+2);
    if(r<39) coinTiles.push({x,y,order:Math.max(0,(35-r)/49)+homeRandom()*.29});
  }
}

const vortexStreams=[
  ["#26435f","#527887",-.14],["#1c354e","#478685",.59],
  ["#456c78","#93b5a5",1.36],["#203950","#456d7d",2.07],
  ["#8f7049","#d9b879",2.8],["#304963","#668994",3.53],
  ["#284962","#68969a",4.28],["#3b7579","#81a69f",5.06],
  ["#745e43","#bf9d61",5.79]
];
const burstFragments=Array.from({length:68},(_,i)=>({
  angle:i*2.39996+homeRandom()*.24,
  speed:.15+homeRandom()*.85,
  size:i%9===0?3.5+homeRandom()*6:.65+homeRandom()*1.6,
  phase:homeRandom()*.26,
  color:["#658b92","#8db2ac","#2d536b","#f3d291","#456d83"][i%5]
}));

function vortexPoint(angle,progress) {
  const radius=9+321*Math.pow(1-progress,1.30);
  const rotation=angle+2.47*progress;
  return [240+Math.cos(rotation)*radius,120+Math.sin(rotation)*radius*.75];
}

function drawVortex(seconds) {
  const opening=2.20;
  const retreat=openingEase(openingProgress(seconds,burstStart,burstEnd));
  if(seconds<opening || retreat===1) return;
  const widening=openingEase(openingProgress(seconds,2.72,3.60));
  const ctx=homeContext;
  ctx.save();
  for(const [i,[color,accent,angle]] of vortexStreams.entries()){
    const start=opening+i%3*.076;
    const end=3.47+i%3*.055;
    const head=openingProgress(seconds,start,end);
    if(!head) continue;
    const fade=openingEase(openingProgress(head,0,.20))*(1-retreat);
    const tail=Math.max(0,head-.22-widening*.78-retreat*.25);
    const sides=[[],[]];
    const steps=33;
    for(let i=0;i<=steps;i++){
      const t=i/steps;
      const p=tail+(head-tail)*t;
      const [x,y]=vortexPoint(angle,p);
      const [nextX,nextY]=vortexPoint(angle,Math.min(.9999,p+.002));
      const normal=Math.atan2(nextY-y,nextX-x)+Math.PI/2;
      const flare=(1-t)**.80*Math.min(1,t*7+.16);
      const width=(2.2+widening*89)*flare*(.96+.10*Math.sin(p*21+angle))+.35;
      sides[0].push([x+Math.cos(normal)*width,y+Math.sin(normal)*width]);
      sides[1].push([x-Math.cos(normal)*width,y-Math.sin(normal)*width]);
    }
    const [x,y]=vortexPoint(angle,head);
    const gradient=ctx.createLinearGradient(...vortexPoint(angle,tail),x,y);
    gradient.addColorStop(0,color+(widening>.75?"bd":"00"));
    gradient.addColorStop(.44,color+"ee");
    gradient.addColorStop(.84,accent);
    gradient.addColorStop(1,"#ebce93");
    ctx.globalAlpha=fade*(.77+.22*widening);
    ctx.fillStyle=gradient;
    ctx.beginPath();
    ctx.moveTo(...sides[0][0]);
    for(const point of sides[0].slice(1)) ctx.lineTo(...point);
    for(const point of sides[1].reverse()) ctx.lineTo(...point);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha=fade*.57;
    ctx.strokeStyle=accent;
    ctx.lineWidth=.5+widening*1.25;
    ctx.beginPath();
    ctx.moveTo(...vortexPoint(angle-.027,tail+.013));
    for(let j=1;j<=16;j++) {
      const p=tail+(head-tail)*j/16;
      ctx.lineTo(...vortexPoint(angle-.027*(1-j/16),p));
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawOpeningStar(x,y,size,color) {
  const ctx=homeContext;
  ctx.save();
  ctx.translate(x,y);
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.moveTo(0,-size*1.35);
  ctx.quadraticCurveTo(size*.12,-size*.20,size,0);
  ctx.quadraticCurveTo(size*.12,size*.20,0,size*1.35);
  ctx.quadraticCurveTo(-size*.12,size*.20,-size,0);
  ctx.quadraticCurveTo(-size*.12,-size*.20,0,-size*1.35);
  ctx.fill();
  ctx.restore();
}

function convergencePoint(angle,radius,progress) {
  const distance=22+(radius-22)*Math.pow(1-progress,1.24);
  const rotation=angle+2.8*progress;
  return [240+Math.cos(rotation)*distance,120+Math.sin(rotation)*distance*.73];
}

function drawCoinConvergence(seconds,front) {
  if(seconds<2.17 || seconds>3.88) return;
  const ctx=homeContext;
  ctx.save();
  for(const {angle,radius,delay,size,front:inFront,color} of coinStars) {
    if(inFront!==front) continue;
    const start=2.24+delay;
    const progress=openingProgress(seconds,start,3.31+delay*.74);
    if(!progress || progress===1) continue;
    const [x,y]=convergencePoint(angle,radius,progress);
    const visibility=openingProgress(progress,0,.19)*(1-openingProgress(progress,.86,1));
    const twinkle=1+Math.sin(angle+progress*13)*.21;
    const tailGrowth=openingEase(openingProgress(seconds,2.58,3.50));
    const tail=convergencePoint(angle,radius,Math.max(0,progress-.095-tailGrowth*.17));
    const trail=ctx.createLinearGradient(...tail,x,y);
    trail.addColorStop(0,color+"00");
    trail.addColorStop(1,color+"b8");
    ctx.globalAlpha=visibility*.83;
    ctx.strokeStyle=trail;
    ctx.lineWidth=size*(.24+tailGrowth*.82)+.20;
    ctx.beginPath();
    ctx.moveTo(...tail);
    ctx.quadraticCurveTo(...convergencePoint(angle,radius,Math.max(0,progress-.047)),x,y);
    ctx.stroke();
    if(size>2) {
      const bloom=ctx.createRadialGradient(x,y,0,x,y,size*3);
      bloom.addColorStop(0,color+"91");
      bloom.addColorStop(1,color+"00");
      homePixel(x-size*3,y-size*3,size*6,size*6,bloom);
      drawOpeningStar(x,y,size*twinkle,color);
      homePixel(x-.48,y-.48,.96,.96,"#fffdf4");
    } else if(progress>.72) {
      homePixel(Math.round(x),Math.round(y),size,size,color);
    } else {
      drawOpeningStar(x,y,size*twinkle,color);
    }
  }

  if(front){
    for(const [i,[color,accent,angle]] of vortexStreams.entries()){
      const p=openingProgress(seconds,2.20+i%3*.076,3.47+i%3*.055);
      if(!p || p===1) continue;
      const [x,y]=vortexPoint(angle,p);
      ctx.globalAlpha=openingProgress(p,0,.20)*(1-openingProgress(p,.86,1));
      drawOpeningStar(x,y,4.0,color);
      drawOpeningStar(x,y,2.45,"#fff8d6");
    }
    const commit=openingProgress(seconds,3.09,3.69);
    const pulse=Math.sin(Math.PI*commit);
    ctx.globalAlpha=pulse*.85;
    ctx.strokeStyle="#ffdfae";
    ctx.lineWidth=.6;
    ctx.beginPath();
    ctx.ellipse(240,120,34+commit*51,20+commit*25,-.26,-.26,Math.PI*1.37);
    ctx.stroke();
    drawOpeningStar(240+26*commit,117-22*commit,7*pulse,"#fff1cf");
  }
  ctx.restore();
}

function drawTossArc(seconds,flight,angle) {
  const ctx=homeContext;
  const launch=openingProgress(seconds,coinLaunch-.025,coinLaunch+.82);
  const launchGlow=Math.sin(Math.PI*Math.pow(launch,.53));
  const glow=openingProgress(flight,0,.1)*(1-openingProgress(flight,.74,.95));
  if(!launchGlow && !glow) return;
  ctx.save();
  ctx.lineCap="round";
  for(let ribbon=0;ribbon<2;ribbon++){
    const drift=launch*15;
    const light=ctx.createLinearGradient(-51,39,22,-57);
    light.addColorStop(0,"#cb743100");
    light.addColorStop(.37,"#c58440bd");
    light.addColorStop(.73,"#ffd18b");
    light.addColorStop(1,"#fffbe400");
    ctx.globalAlpha=launchGlow*(1-ribbon*.53);
    ctx.strokeStyle=light;
    ctx.lineWidth=ribbon===0?2.4:.8;
    ctx.beginPath();
    ctx.moveTo(-24-ribbon*8,48-drift);
    ctx.bezierCurveTo(-75-ribbon*5,24-drift,-39+ribbon*6,-37-drift,29+ribbon*8,-49-drift);
    ctx.stroke();
  }
  for(let side=0;side<2;side++){
    const offset=angle*.48+side*Math.PI+.3;
    const x=Math.cos(offset+1.3)*(48+side*5);
    const y=Math.sin(offset+1.3)*(32+side*3);
    const light=ctx.createLinearGradient(-x*.75,-y*.75,x,y);
    light.addColorStop(0,"#b3713400");
    light.addColorStop(.46,"#cd90496b");
    light.addColorStop(.8,"#ffdfa9");
    light.addColorStop(1,"#fff9dd");
    ctx.globalAlpha=glow*(1-side*.36);
    ctx.strokeStyle=light;
    ctx.lineWidth=side===0?1.6:.78;
    ctx.beginPath();
    ctx.ellipse(0,0,47+side*6,30+side*4,-.3,offset-.56,offset+1.54);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCoinMorph(angle,turn,mix) {
  if(mix<=0) {
    drawMetalCoin(angle,turn);
    return;
  }
  if(mix>=1) {
    drawPixelCoin();
    return;
  }
  const ctx=homeContext;
  const revealed=new Path2D();
  const metalMask=new Path2D();
  metalMask.rect(-39,-39,78,78);
  for(const {x,y,order} of coinTiles) {
    if(order>mix) continue;
    revealed.rect(x,y,4,4);
    metalMask.rect(x,y,4,4);
  }
  ctx.save();
  ctx.clip(metalMask,"evenodd");
  drawMetalCoin(angle,turn);
  ctx.restore();
  ctx.save();
  ctx.clip(revealed);
  drawPixelCoin();
  ctx.restore();
  ctx.globalAlpha=.6;
  for(const {x,y,order} of coinTiles) {
    if(order>mix || order<mix-.065 || Math.hypot(x+2,y+2)>32) continue;
    homePixel(x,y,4,1,"#fff7c2");
    homePixel(x,y,1,3,"#a9eddd");
  }
  ctx.globalAlpha=1;
}

function vortexBurstOutline(progress) {
  const radius=285*(1-(1-progress)**2.1);
  const [cx,cy]=coinCenter;
  const points=Array.from({length:36},(_,i)=>{
    const angle=i*Math.PI/18;
    const ripple=1+.103*Math.cos(angle*7+progress)+.054*Math.sin(angle*11+1.4);
    return [cx+Math.cos(angle)*radius*ripple,cy+Math.sin(angle)*radius*ripple*.77];
  });
  const path=new Path2D();
  const [firstX,firstY]=points[0];
  const [lastX,lastY]=points.at(-1);
  path.moveTo((firstX+lastX)/2,(firstY+lastY)/2);
  for(const [i,[x,y]] of points.entries()){
    const [nextX,nextY]=points[(i+1)%points.length];
    path.quadraticCurveTo(x,y,(x+nextX)/2,(y+nextY)/2);
  }
  path.closePath();
  return path;
}

function drawVortexBurst(progress,outline) {
  if(!outline) return;
  const ctx=homeContext;
  const [cx,cy]=coinCenter;
  const linger=1-openingEase(openingProgress(progress,.19,1));
  ctx.save();
  const flash=Math.sin(Math.PI*openingProgress(progress,0,.42));
  ctx.globalAlpha=linger*.60;
  ctx.strokeStyle="#92c9ca";
  ctx.lineWidth=1+flash*5;
  ctx.stroke(outline);
  ctx.globalAlpha=linger*.25;
  ctx.strokeStyle="#f1c882";
  ctx.lineWidth=1.1;
  ctx.stroke(outline);
  for(const {angle,speed,size,phase,color} of burstFragments){
    const life=openingProgress(progress,phase,Math.min(1,phase+.63+speed*.24));
    if(life===0 || life===1) continue;
    const spread=1-(1-life)**2.35;
    const drift=angle+.33*life;
    const distance=12+spread*(76+speed*235);
    const x=cx+Math.cos(drift)*distance;
    const y=cy+Math.sin(drift)*distance*.80;
    const width=size*(.47+1.8*Math.sin(Math.PI*life))*(1-life*.75);
    ctx.globalAlpha=Math.sin(Math.PI*Math.pow(life,.57))*(color==="#f3d291"?.85:.62);
    ctx.fillStyle=color;
    if(size<2.1){
      homePixel(x,y,width+1,width,color);
    }else{
      ctx.beginPath();
      ctx.ellipse(x,y,width*1.36,width*.76,drift,0,Math.PI*2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function openingLightPoint(seconds,x,y) {
  const ctx=homeContext;
  const pulse=Math.sin(Math.PI*openingProgress(seconds,burstStart,burstStart+.30));
  const glowSize=14+12*pulse;
  const light=ctx.createRadialGradient(x,y,1,x,y,glowSize);
  light.addColorStop(0,"#fff0bdea");
  light.addColorStop(.34,"#eabb6e6c");
  light.addColorStop(1,"#eabb6e00");
  homePixel(x-glowSize,y-glowSize,glowSize*2,glowSize*2,light);
  drawOpeningStar(x,y,3.8+3.4*pulse,"#ffedbe");
  homePixel(x-1,y-1,2,2,"#fffdf0");
}

function drawOpening(seconds) {
  if (seconds >= cityStart+3.12) return;
  const ctx = homeContext;
  const darkness = openingEase(openingProgress(seconds,3.20,burstStart+.08));
  const city = .8*openingEase(openingProgress(seconds,cityStart,cityStart+.30))+
    .2*openingEase(openingProgress(seconds,cityStart+.30,cityStart+2.5));
  ctx.save();
  const studio = ctx.createRadialGradient(240,102,30,240,120,280);
  studio.addColorStop(0,"#fffefa");
  studio.addColorStop(1,"#f2efeb");
  if (darkness<1) homePixel(0,0,homeWidth,homeHeight,studio);
  ctx.globalAlpha = darkness*(1-city);
  homePixel(0,0,homeWidth,homeHeight,"#0c192c");
  if(seconds>=burstStart && city<1){
    const reveal=openingEase(openingProgress(seconds,burstStart,burstEnd));
    for(const [i,{angle,speed}] of burstFragments.entries()){
      const x=(i*.618034%1)*homeWidth;
      const y=(.5+.5*Math.sin(angle+speed))*108;
      ctx.globalAlpha=reveal*(1-city)*(.22+.15*Math.sin(seconds*1.4+i));
      homePixel(x,y,i%13===0?2:1,1,i%6===0?"#f3d291":"#9dbcbc");
    }
  }
  ctx.globalAlpha = 1;
  const burst=openingProgress(seconds,burstStart,burstEnd);
  const outline=burst>0 && burst<1?vortexBurstOutline(burst):null;
  ctx.save();
  if(outline){
    const mask=new Path2D();
    mask.rect(0,0,homeWidth,homeHeight);
    mask.addPath(outline);
    ctx.clip(mask,"evenodd");
  }
  drawVortex(seconds);
  ctx.restore();
  drawCoinConvergence(seconds,false);
  if (seconds < coinImpact+.3) drawOpeningToss(seconds,darkness);
  drawCoinConvergence(seconds,true);
  drawVortexBurst(burst,outline);
  if (seconds >= pointLanding && seconds < lineStart+.7) drawOpeningImpacts(seconds);
  if(seconds>=dotStart && seconds<pointLanding){
    const drop=openingProgress(seconds,burstEnd-.17,pointLanding);
    openingLightPoint(seconds,coinCenter[0],coinCenter[1]+29*drop*drop);
  }
  if (seconds >= pointLanding) drawOpeningLine(seconds);
  ctx.restore();
}

function drawOpeningLine(seconds) {
  const ctx=homeContext;
  const seed=openingEase(openingProgress(seconds,lineStart,cityStart));
  const spread=openingProgress(seconds,cityStart,cityStart+citySpread);
  const y=149+(homeHarbor.coast-149)*seed;
  const extent=Math.max(2,seed*20+spread*homeWidth);
  if(seconds<lineStart){
    openingLightPoint(seconds,240,y-openingBounce(seconds));
    return;
  }
  const light=ctx.createRadialGradient(240,y,0,240,y,16);
  light.addColorStop(0,"#ffce7491");
  light.addColorStop(1,"#ffce7400");
  ctx.save();
  ctx.globalAlpha=1-openingEase(openingProgress(seconds,cityStart+1.56,cityStart+3.05));
  const rail=ctx.createLinearGradient(240-extent/2,0,240+extent/2,0);
  rail.addColorStop(0,"#fff3c6");
  rail.addColorStop(.2,"#edbc76");
  rail.addColorStop(.5,"#fff0bb");
  rail.addColorStop(.8,"#edbc76");
  rail.addColorStop(1,"#fff3c6");
  homePixel(224,y-16,32,32,light);
  if(seed>.3) homePixel(240-extent/2,y+2,extent,2,"#e4bb6860");
  homePixel(240-extent/2,y-1,extent,2,rail);
  if(spread>0 && spread<.96){
    for(const side of [-1,1]){
      const edge=240+side*extent/2;
      drawOpeningStar(edge,y,3.1,"#fff2bb");
      for(let i=0;i<6;i++){
        const drift=3+i*4;
        const lift=3+Math.sin(seconds*18+i*2)*2;
        homePixel(edge-side*drift,y+i%3*3-lift,2-i%2,1,i%2?"#a9ccc0":"#ffdba0");
      }
    }
  }
  ctx.restore();
}

function drawOpeningToss(seconds,darkness) {
  const flight = openingProgress(seconds,coinLaunch,coinImpact);
  const altitude = Math.sin(Math.PI*flight)*113;
  const zoom = 1 + Math.sin(Math.PI*flight)*.17 + Math.sin(Math.PI*openingProgress(seconds,0,coinLaunch))*.08;
  const roll = Math.sin(flight*Math.PI*1.8)*.11;
  const groundY = 149+altitude*zoom;
  const ctx = homeContext;
  ctx.save();
  ctx.globalAlpha=1-darkness;
  ctx.translate(240,groundY+1);
  ctx.scale(1,.18);
  homePixel(-37,-37,74,74,shadowAtLocalOrigin());
  ctx.restore();

  if (seconds < 2.24) drawOpeningHand(seconds,altitude);
  ctx.save();
  ctx.translate(...coinCenter);
  ctx.rotate(roll);
  const angle = seconds < coinImpact ? Math.PI*flight*5 : Math.PI + (seconds-coinImpact)*11;
  const turn = Math.cos(angle);
  drawTossArc(seconds,flight,angle);
  const shrink=1-.96*openingEase(openingProgress(seconds,coinImpact,coinImpact+.29));
  ctx.scale(Math.max(.085,Math.abs(turn))*zoom*shrink,zoom*shrink);
  const pixelMix=openingEase(openingProgress(seconds,2.93,3.53));
  drawCoinMorph(angle,turn,pixelMix);
  ctx.restore();
}

function shadowAtLocalOrigin() {
  const shade = homeContext.createRadialGradient(0,0,0,0,0,36);
  shade.addColorStop(0,"#211b235d");
  shade.addColorStop(1,"#211b2300");
  return shade;
}

function openingBounce(seconds) {
  const bounce = seconds-pointLanding;
  if (bounce < .63) return Math.sin(Math.PI*bounce/.63)*25;
  if (bounce < 1.07) return Math.sin(Math.PI*openingProgress(bounce,.63,1.07))*14;
  return Math.sin(Math.PI*openingProgress(bounce,1.07,1.37))*7;
}

function drawOpeningHand(seconds,altitude) {
  const ctx = homeContext;
  const enter = openingEase(openingProgress(seconds,.04,.66));
  const press = openingEase(openingProgress(seconds,.76,1.13));
  const flick = openingEase(openingProgress(seconds,1.24,1.43));
  const leave = openingEase(openingProgress(seconds,1.57,2.24));
  ctx.save();
  ctx.translate(221-(1-enter)*30-leave*46,163+(1-enter)*75+altitude+leave*20);
  ctx.rotate(-.22 + .19*flick);
  ctx.globalAlpha = 1-leave;
  const skin = ctx.createLinearGradient(-31,-31,35,40);
  skin.addColorStop(0,"#f5cbb2");
  skin.addColorStop(.46,"#d99a7e");
  skin.addColorStop(.82,"#b16c55");
  skin.addColorStop(1,"#995944");
  ctx.fillStyle = skin;
  ctx.strokeStyle = "#aa6d57";
  ctx.lineWidth = .55;
  ctx.beginPath();
  ctx.moveTo(-71,103);
  ctx.bezierCurveTo(-56,64,-51,43,-42,21);
  ctx.bezierCurveTo(-35,4,-25,-6,-14,-7);
  ctx.bezierCurveTo(-9,-12,1,-10,5,-6);
  ctx.bezierCurveTo(11,-11,18,-8,22,-2);
  ctx.bezierCurveTo(31,-5,39,-1,39,7);
  ctx.bezierCurveTo(39,14,33,17,27,18);
  ctx.bezierCurveTo(33,29,25,43,13,54);
  ctx.bezierCurveTo(-5,66,-13,88,-15,111);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  const palmLight = ctx.createRadialGradient(-23,14,0,-23,14,30);
  palmLight.addColorStop(0,"#ffe1c58c");
  palmLight.addColorStop(1,"#f7c1a000");
  ctx.save();
  ctx.clip();
  homePixel(-61,-12,81,78,palmLight);
  ctx.restore();
  ctx.strokeStyle = "#995b474d";
  for (let finger=0;finger<3;finger++) {
    ctx.beginPath();
    ctx.moveTo(-10+finger*12,-4);
    ctx.quadraticCurveTo(-5+finger*12,0,-7+finger*12,6);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(-14,21);
  ctx.rotate(.19*press-1.03*flick);
  const thumb = ctx.createLinearGradient(-5,-30,24,10);
  thumb.addColorStop(0,"#ffddc3");
  thumb.addColorStop(.5,"#e8ad91");
  thumb.addColorStop(1,"#ad684e");
  ctx.fillStyle = thumb;
  ctx.strokeStyle = "#ae705a";
  ctx.beginPath();
  ctx.moveTo(-9,17);
  ctx.bezierCurveTo(-14,7,-9,-7,1,-14);
  ctx.bezierCurveTo(10,-21,16,-31,24,-35);
  ctx.bezierCurveTo(30,-38,36,-34,35,-29);
  ctx.bezierCurveTo(35,-21,26,-14,21,-7);
  ctx.bezierCurveTo(18,3,11,13,7,19);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#f5c1ae";
  ctx.beginPath();
  ctx.ellipse(29,-29,4.8,5.7,.67,0,2*Math.PI);
  ctx.fill();
  ctx.restore();
  ctx.restore();
}

function drawMetalCoin(angle,turn) {
  const ctx = homeContext;
  const metal = ctx.createLinearGradient(-33,-17,35+9*Math.sin(angle),20);
  for (const [stop,color] of [[0,"#81501d"],[.18,"#c4903b"],[.36,"#fff0b2"],[.52,"#dfac50"],[.7,"#a76d29"],[.9,"#f7d989"],[1,"#b78333"]]) {
    metal.addColorStop(stop,color);
  }
  ctx.fillStyle = "#865c29";
  ctx.beginPath(); ctx.arc(2,1,34,0,2*Math.PI); ctx.fill();
  ctx.fillStyle = metal;
  ctx.beginPath(); ctx.arc(0,0,34,0,2*Math.PI); ctx.fill();
  ctx.strokeStyle = "#fff4cf";
  ctx.lineWidth = .85;
  ctx.beginPath(); ctx.arc(0,0,30.6,0,2*Math.PI); ctx.stroke();
  ctx.strokeStyle = "#8e5b29";
  ctx.beginPath(); ctx.arc(0,0,27.8,0,2*Math.PI); ctx.stroke();
  for (let i=0;i<48;i++) {
    const a = i*Math.PI/24;
    ctx.strokeStyle = i%4 ? "#75451279" : "#fff4cbbd";
    ctx.beginPath();
    ctx.moveTo(Math.cos(a)*31.5,Math.sin(a)*31.5);
    ctx.lineTo(Math.cos(a)*33.3,Math.sin(a)*33.3);
    ctx.stroke();
  }
  const stamp = turn >= 0 ? [[-17,7,6],[-10,14,7],[-2,22,6],[5,13,7],[13,9,5]] : [[-17,10,6],[-10,17,7],[-2,23,6],[5,17,7],[13,10,5]];
  for (const [x,h,w] of stamp) {
    homePixel(x+1,12-h,w,h,"#fff0b1b0");
    homePixel(x,11-h,w,h,"#875722");
    for (let floor=3;floor<h-1;floor+=4) homePixel(x+2,11-h+floor,2,1,"#e9bb66");
  }
  homePixel(-19,12,38,1,"#96682f");
  homePixel(0,-16,1,5,"#96682f");
  if(angle>0){
    ctx.save();
    ctx.beginPath();
    ctx.arc(0,0,33.6,0,Math.PI*2);
    ctx.clip();
    const sweep=-53+106*((angle*.32)%1);
    const reflection=ctx.createLinearGradient(sweep-12,-12,sweep+16,6);
    reflection.addColorStop(0,"#fff0c000");
    reflection.addColorStop(.38,"#fff0bd3b");
    reflection.addColorStop(.58,"#fffbdfc9");
    reflection.addColorStop(.72,"#fff4c750");
    reflection.addColorStop(1,"#fff0c000");
    homePixel(-35,-35,70,70,reflection);
    ctx.restore();
  }
}

function drawPixelCoin() {
  for (let row=-30;row<=30;row+=3) {
    const span = Math.floor(Math.sqrt(981-row*row)/3)*3;
    homePixel(-span,row,span*2+3,3,row < -13 ? "#fff0ae" : row > 18 ? "#a86a35" : "#dca155");
  }
  for (let row=-24;row<=24;row+=3) {
    const span = Math.floor(Math.sqrt(650-row*row)/3)*3;
    homePixel(-span,row,span*2+3,3,"#efc376");
  }
  homePixel(-18,12,36,3,"#835630");
  for (const [x,height,width] of [[-15,9,6],[-9,15,6],[-3,24,6],[3,15,6],[9,9,6]]) {
    homePixel(x,12-height,width,height,"#956237");
    homePixel(x+2,15-height,2,2,"#ffd995");
  }
}

function drawOpeningImpacts(seconds) {
  const ctx = homeContext;
  for (const [time,power] of [[pointLanding,.52],[pointLanding+.63,.35],[pointLanding+1.07,.27],[lineStart,.73]]) {
    const elapsed = seconds-time;
    if (elapsed < 0 || elapsed > .7) continue;
    ctx.save();
    ctx.globalAlpha = (1-elapsed/.7)*power;
    const radius = elapsed*116;
    ctx.strokeStyle = "#9fc9bd";
    ctx.beginPath(); ctx.ellipse(240,149,radius,radius*.17,0,0,2*Math.PI); ctx.stroke();
    openingSparks.forEach(({dx,dy},index) => {
      homePixel(240+dx*elapsed*3*power,132+dy*elapsed*3+elapsed*elapsed*26,2+index%2,2,index%3 ? "#f9d283" : "#8cbbad");
    });
    ctx.restore();
  }
}

function syncOpening() {
  const isOpening = homeWasOpened && homeTime < homeIntroLength;
  const isRevealing = isOpening && homeTime >= homeMenuStart;
  const restoreFocus = !isOpening && document.activeElement === homeSkipButton;
  homeScreen.classList.toggle("home-arrival",isOpening);
  homeScreen.classList.toggle("home-reveal",isRevealing);
  homeScreen.classList.toggle("home-city",isOpening && homeTime >= (waterStart+.5)*1000);
  homeProgress.hidden = !isOpening;
  homeProgressMeter.value = Math.floor(100 * Math.min(homeTime/homeIntroLength,1));
  gameAudio.setOpening(isOpening && !homeScreen.hidden);
  const hideCoins=isOpening || homeScreen.hidden;
  if (harborCoins.hidden!==hideCoins) {
    harborCoins.hidden=hideCoins;
    if (!hideCoins) syncHarborView();
  }
  homeSkipButton.hidden = !isOpening;
  if (restoreFocus) homeScreen.querySelector(".home-menu button").focus({preventScroll:true});
}

function stepHomeScene(now) {
  const previousTime=homeTime;
  if (homeLastFrame !== null) homeTime += now - homeLastFrame;
  if (previousTime<homeIntroLength) {
    for (const [time,cue] of openingSounds) {
      if (previousTime<time && homeTime>=time && homeTime-time<400) gameAudio.effect(cue);
    }
  }
  homeLastFrame = now;
  drawHomeScenery();
  syncOpening();
  updateHarborCoins();
  homeFrame = requestAnimationFrame(stepHomeScene);
}

function refreshHomeScene() {
  cancelAnimationFrame(homeFrame);
  homeLastFrame = null;
  homeMotionButton.textContent = t(homePaused ? "homeResume" : "homePause");
  homeMotionButton.setAttribute("aria-pressed", String(homePaused));
  if (homePaused) homeTime = Math.max(homeTime, homeIntroLength);
  syncOpening();
  if (homeScreen.hidden || document.hidden) return;
  drawHomeScenery();
  updateHarborCoins();
  if (!homePaused) homeFrame = requestAnimationFrame(stepHomeScene);
}

function setHomeSceneVisible(visible) {
  if (visible && !homeWasOpened) {
    homeWasOpened = true;
  } else if (!visible && homeWasOpened) {
    homeTime = Math.max(homeTime, homeIntroLength);
    harborParticles.length=0;
    harborFlights.length=0;
    previousHarborPoint=null;
  }
  refreshHomeScene();
}

homeSkipButton.addEventListener("click", () => {
  homeTime = homeIntroLength;
  refreshHomeScene();
});
homeMotionButton.addEventListener("click", () => {
  homePaused = !homePaused;
  refreshHomeScene();
});
homeReducedMotion.addEventListener("change", event => {
  homePaused = event.matches;
  refreshHomeScene();
});
document.addEventListener("visibilitychange", refreshHomeScene);
