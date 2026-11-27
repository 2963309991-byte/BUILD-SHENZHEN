"use strict";

const runnerBackdrop=document.querySelector("#runner-lobby-art");
const runnerBackdropContext=runnerBackdrop.getContext("2d");
const lobbyWidth=runnerBackdrop.width;
const lobbyHeight=runnerBackdrop.height;
const rooftopY=258;

function lobbyLayer(paint) {
  const canvas=document.createElement("canvas");
  canvas.width=lobbyWidth;
  canvas.height=lobbyHeight;
  paint(canvas.getContext("2d"));
  return canvas;
}

let lobbySeed=2387;
function lobbyRandom() {
  lobbySeed=(Math.imul(lobbySeed,1664525)+1013904223)>>>0;
  return lobbySeed/4294967296;
}

const lobbySky=lobbyLayer(ctx=>{
  const colors=ctx.createLinearGradient(0,0,0,lobbyHeight);
  ["#122038","#223e60","#637d8c","#e8a884","#edc595"].forEach((color,index)=>colors.addColorStop(index/4,color));
  rect(ctx,0,0,lobbyWidth,lobbyHeight,colors);
  const haze=ctx.createRadialGradient(447,118,1,447,118,116);
  haze.addColorStop(0,"#ffd2a688");haze.addColorStop(1,"#ead0ac00");
  rect(ctx,322,0,238,236,haze);
  for(let row=-25;row<=25;row++){
    const radius=Math.floor(Math.sqrt(676-row*row));
    rect(ctx,466-radius,83+row,2*radius,1,row<6?"#f7d79f":"#eabb8d");
    if(row>4 && row%5===0) rect(ctx,466-radius,83+row,2*radius,1,"#dda785");
  }
  for(let i=0;i<180;i++){
    const x=lobbyRandom()*lobbyWidth,y=lobbyRandom()*123;
    if(Math.hypot(x-466,y-83)>29) rect(ctx,x,y,i%23===0?2:1,1,"#c8ddd665");
  }
  for(let group=0;group<7;group++){
    const y=58+group*16;
    for(let x=0;x<lobbyWidth;x+=3){
      const wave=Math.sin(x*.053+group*3)+.62*Math.sin(x*.127+group);
      if(wave>.33) rect(ctx,x,y+wave*2,3,Math.round(wave*2),group>3?"#e9b89c45":"#95a4b660");
    }
  }
});

function lobbyCity(front) {
  return lobbyLayer(ctx=>{
    for(let x=0;x<lobbyWidth;){
      const w=12+Math.round(lobbyRandom()*(front?25:15));
      const h=22+Math.round(lobbyRandom()*(front?85:56));
      const top=(front?247:220)-h;
      const color=front?"#243c54":"#425e73";
      rect(ctx,x,top+5,w+1,h+20,color);
      rect(ctx,x+3,top,w-8,7,front?"#334e63":"#668290");
      rect(ctx,x+w-4,top+7,5,h+16,front?"#172d46":"#3e576d");
      rect(ctx,x,top+5,w-4,1,front?"#799491":"#90a1a1");
      if(w>27){
        rect(ctx,x+7,top-9,1,11,"#567688");
        rect(ctx,x+7,top-9,2,1,"#fbbe89");
      }
      for(let dy=top+12;dy<247;dy+=front?6:5) for(let dx=x+3;dx<x+w-6;dx+=5){
        const light=lobbyRandom();
        if(light>.23) rect(ctx,dx,dy,front?2:1,2,light>.79?"#e8b87a":light>.48?"#759c9c":"#526b7f");
      }
      if(front && w>25){
        rect(ctx,x+3,top+23,w-9,6,"#25424d");
        rect(ctx,x+4,top+24,w-11,1,"#70aca6");
        rect(ctx,x+4,top+27,w-11,1,"#508278");
      }
      x+=w+(front?3:0);
    }
  });
}
const lobbyFarCity=lobbyCity(false);
const lobbyNearCity=lobbyCity(true);

function drawRunnerBackdrop(seconds) {
  const ctx=runnerBackdropContext;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(lobbySky,0,0);
  for(const [layer,pace] of [[lobbyFarCity,5],[lobbyNearCity,14]]){
    const shift=Math.floor(seconds*pace)%lobbyWidth;
    ctx.drawImage(layer,-shift,0);
    ctx.drawImage(layer,lobbyWidth-shift,0);
  }
  rect(ctx,0,239,lobbyWidth,rooftopY-239,"#396578");
  rect(ctx,0,246,lobbyWidth,2,"#82a59c");
  for(let x=-(Math.floor(seconds*42)%28);x<lobbyWidth;x+=28){
    rect(ctx,x,227,2,22,"#1a394d");rect(ctx,x+1,227,1,17,"#9eb8a6");
    rect(ctx,x,236,29,1,"#759f9b");
  }
  rect(ctx,0,227,lobbyWidth,2,"#b2bf9e");
  rect(ctx,0,rooftopY-3,lobbyWidth,3,"#ebb879");
  rect(ctx,0,rooftopY,lobbyWidth,24,"#294259");
  rect(ctx,0,rooftopY+24,lobbyWidth,38,"#182f46");
  for(let x=-(Math.floor(seconds*69)%33);x<lobbyWidth;x+=33){
    rect(ctx,x,rooftopY+12,17,2,"#ab8f75");
    rect(ctx,x+5,rooftopY+28,22,2,"#3d6378");
    rect(ctx,x,rooftopY+39,3,13,"#29465c");
  }
  for(let i=0;i<8;i++){
    const x=318+(i*32+528-seconds*31%256)%256;
    const y=229-Math.sin((x-318)/255*Math.PI)*52+Math.sin(seconds*4+i)*3;
    const size=1.1+Math.abs(Math.cos(seconds*4+i))*4;
    rect(ctx,x-size/2,y-6,size,12,"#b97443");
    rect(ctx,x-size/2,y-5,size,10,"#ffd787");
    rect(ctx,x-size/2+1,y-4,1,6,"#fff2bb");
    if(i%3===0) {
      rect(ctx,x+9,y-5,5,1,"#ffe8b9");
      rect(ctx,x+11,y-7,1,5,"#ffe8b9");
    }
  }
  const phase=Math.floor(seconds*10)%4;
  const jump=seconds%4.4-2.3;
  const flight=jump>0 && jump<1.05?Math.sin(jump*Math.PI/1.05)*24:0;
  const x=402;
  ctx.fillStyle="#1826339c";
  ctx.beginPath();ctx.ellipse(x+2,rooftopY-1,24-flight*.2,3,0,0,Math.PI*2);ctx.fill();
  for(let i=0;i<7;i++){
    const age=(seconds*18+i*1.7)%12;
    rect(ctx,x-13-age*3,rooftopY-4-age*.66,4-age*.2,2,age<6?"#c2dbbf":"#719892");
  }
  const frame=flight>12?1:phase%2===0?0:2;
  ctx.drawImage(spriteFrames[0][frame],x-33,rooftopY-66-flight-(phase%2),66,66);

  const barrierX=591-seconds*43%272;
  paintRunHazard((dx,y,w,h,color)=>rect(ctx,barrierX+dx*1.36,y,w*1.36,h,color),2,rooftopY,0);
}

function animateRunnerBackdrop(time) {
  if(!runnerLobby.hidden && !runnerPage.hidden){
    drawRunnerBackdrop(reducedMotion.matches?.7:time/1000);
  }
  requestAnimationFrame(animateRunnerBackdrop);
}
requestAnimationFrame(animateRunnerBackdrop);
