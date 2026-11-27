"use strict";

function createHomeHarbor(width,height) {
  const coast = 169;
  let seed = 721;
  const random = () => {
    seed = (Math.imul(seed,1664525)+1013904223) >>> 0;
    return seed / 4294967296;
  };
  const pixel = (ctx,x,y,w,h,color) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x),Math.round(y),w,h);
  };
  function layer(draw,w=width,h=height) {
    const canvas=document.createElement("canvas");
    canvas.width=w;
    canvas.height=h;
    draw(canvas.getContext("2d"),w,h);
    return canvas;
  }
  function halo(ctx,x,y,radius,color) {
    const glow=ctx.createRadialGradient(x,y,0,x,y,radius);
    glow.addColorStop(0,color);
    glow.addColorStop(1,"#1b294e00");
    pixel(ctx,x-radius,y-radius,radius*2,radius*2,glow);
  }

  const sky=layer(ctx=>{
    const colors=ctx.createLinearGradient(0,0,0,coast);
    ["#0d172e","#152544","#233b59","#3e6170","#587a80"].forEach((color,index)=>colors.addColorStop(index/4,color));
    pixel(ctx,0,0,width,height,colors);
    halo(ctx,358,121,120,"#b992664e");
    halo(ctx,365,43,64,"#e6bb643d");
    for(let i=0;i<590;i++){
      const x=random()*width, y=random()*140;
      pixel(ctx,x,y,1+Math.floor(random()*3),1,i%3 ? "#9eb7bb10" : "#10193230");
    }
    for (let band=0;band<5;band++) {
      for (let x=0;x<width;x+=3) {
        const wave=Math.sin((x+band*77)*.034)+.55*Math.cos((x-band*47)*.091);
        if (wave<.17) continue;
        const y=34+band*15+wave*3;
        pixel(ctx,x,y,3,1+Math.floor(wave*1.5),band%2 ? "#708b921e" : "#779caa15");
      }
    }
    for(let y=-17;y<=17;y++){
      const radius=Math.floor(Math.sqrt(315-y*y));
      pixel(ctx,365-radius,43+y,2*radius+1,1,y<2?"#ffe4a4":y<10?"#eec586":"#d8a671");
      if(y>2 && y%3===0) pixel(ctx,370,43+y,Math.max(0,radius-6),1,"#c4a080");
    }
    for(let y=0;y<3;y++){
      for(let x=0;x<width;x+=2){
        const ridge=123+y*13+Math.sin((x+y*24)*.04)*6+Math.cos((x+y*47)*.086)*2;
        pixel(ctx,x,ridge,2,coast-ridge,["#405e72","#334d67","#283c57"][y]);
      }
    }
  });
  const stars=Array.from({length:195},()=>{
    const x=random()*width,y=random()*108;
    return {x,y,phase:random()*12,size:random()>.91?2:1};
  }).filter(({x,y})=>Math.hypot(x-365,y-43)>21);

  function tower(x,w,h,base,kind,distant=false) {
    const canvasWidth=w+7;
    const image=layer((ctx,w0,h0)=>{
      const wall=distant?"#273b56":["#243958","#1b304b","#283b58","#2c4a62"][kind%4];
      const side=distant?"#22334d":"#14253e";
      const trim=distant?"#5d7a8a":"#7297a1";
      const roof=kind===1?7:kind===2?4:kind===4?12:3;
      for(let y=roof;y<h0;y++){
        const inset=kind===2?Math.max(1,Math.floor((h0-y)/22)):kind===4&&y<22?5:0;
        pixel(ctx,inset,y,w-inset,1,wall);
        pixel(ctx,w-3,y,4,1,side);
        if(y%7===0) pixel(ctx,inset,y,w-inset-3,1,"#607b8a42");
        if(y%12===0 && inset) pixel(ctx,inset,y,2,1,trim);
      }
      pixel(ctx,kind===2?4:0,roof,w-(kind===2?7:1),1,trim);
      if(kind===1 || kind===4){
        pixel(ctx,4,4,w-10,4,wall);
        pixel(ctx,6,4,w-13,1,trim);
        pixel(ctx,w/2,0,1,5,trim);
        pixel(ctx,w/2,0,2,1,distant?"#ad825f":"#ffd287");
      }
      for(let y=roof+5;y<h0-3;y+=kind===3?3:4){
        for(let x=3;x<w-5;x+=distant?4:3){
          if(kind===2 && x<(h0-y)/22+1 || kind===4 && y<23 && x<7) continue;
          const lit=random();
          if(lit<.38) continue;
          const tint=distant?(lit>.77?"#bda97e":"#608795"):(lit>.84?"#ffe3a6":lit>.70?"#e9ab62":lit>.54?"#7eb5b2":"#3e647c");
          pixel(ctx,x,y,kind===3?2:1,distant?1:2,tint);
        }
      }
      if(!distant){
        pixel(ctx,1,roof+4,1,h0-roof-6,"#99bfb780");
        pixel(ctx,w-4,roof+4,1,h0-roof-7,"#adc3a874");
        if(kind===0 || kind===3) {
          pixel(ctx,3,roof+12,w-7,2,kind===0?"#c79862":"#65a5a4");
          pixel(ctx,6,roof+12,w-14,1,"#d1dcc0");
        }
      }
    },canvasWidth,h);
    return {image,x,base,h,delay:random()*.28};
  }
  const towers=[];
  for(let x=-4;x<width;){
    const w=5+Math.floor(random()*15);
    const h=18+Math.floor(random()*53);
    towers.push(tower(x,w,h,coast-15,Math.floor(random()*5),true));
    x+=w-2;
  }
  const skyline=[[3,16,29,3],[23,15,38,1],[47,25,30,0],[74,17,42,2],
    [96,18,55,3],[108,26,40,4],[139,22,66,1],[160,26,43,0],[184,21,71,4],[203,17,53,3],
    [222,37,75,2],[249,32,47,1],[278,25,87,4],[302,22,67,0],[322,29,105,1],
    [347,19,68,2],[369,28,89,4],[398,23,63,3],[421,27,77,0],[443,21,51,2],[462,22,66,1]];
  skyline.forEach(([x,w,h,kind])=>towers.push(tower(x,w,h,coast,kind)));
  for(let x=3;x<width;){
    const w=9+Math.floor(random()*12);
    towers.push(tower(x,w,12+Math.floor(random()*16),coast+1,Math.floor(random()*3)));
    x+=w+3;
  }

  const promenade=layer(ctx=>{
    pixel(ctx,0,coast-1,width,2,"#bb9b72");
    pixel(ctx,0,coast+1,width,3,"#27374d");
    pixel(ctx,0,coast+4,width,1,"#8c9fa189");
    pixel(ctx,0,coast+5,width,5,"#1d354c");
    for(let x=2;x<width;x+=7){
      pixel(ctx,x,coast+5,1,5,"#4c767b");
      if(x%3===0){
        halo(ctx,x,coast-3,5,"#e2bd6577");
        pixel(ctx,x,coast-3,2,1,"#f8ce86");
      }
    }
    for(const [x,w] of [[63,48],[300,49],[418,48]]){
      pixel(ctx,x,coast+12,w,5,"#182d45");
      pixel(ctx,x,coast+11,w,1,"#749691");
      for(let a=x+3;a<x+w;a+=9) pixel(ctx,a,coast+16,2,5,"#253a55");
    }
  });
  const water=layer(ctx=>{
    const tones=ctx.createLinearGradient(0,coast,0,height);
    tones.addColorStop(0,"#274660");
    tones.addColorStop(.4,"#1c3a54");
    tones.addColorStop(1,"#142942");
    pixel(ctx,0,coast,width,height-coast,tones);
  });
  const reflections=Array.from({length:580},()=>{
    const y=coast+5+random()*(height-coast-4);
    const x=random()*width;
    const gold=Math.abs(x-365)<(y-coast)*.47+11 || Math.sin(x*.156)>.76;
    return {x,y,gold,w:1+random()*(y-coast)*.26,phase:random()*26};
  });

  function background(ctx,seconds,amount) {
    ctx.drawImage(sky,0,0);
    ctx.save();
    for(const {x,y,size,phase} of stars){
      ctx.globalAlpha=amount*(.32+(1+Math.sin(seconds*1.2+phase))*.31);
      pixel(ctx,x,y,size,1,size===2?"#ffdfac":"#b8d6d4");
      if(size===2 && ctx.globalAlpha>.72) pixel(ctx,x,y-1,1,3,"#d9ded0");
    }
    ctx.restore();
  }

  function draw(ctx,seconds,{rise=10,flow=1,spread=1.52}={}) {
    const waterLevel=height-(height-coast)*flow;
    ctx.save();
    ctx.beginPath();
    for(let x=0;x<width;x+=4){
      const y=waterLevel+Math.sin(x*.07-seconds*3)*(1-flow)*8;
      if(x===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.lineTo(width,height);
    ctx.lineTo(0,height);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(water,0,0);
    for(const {x,y,w,gold,phase} of reflections){
      ctx.globalAlpha=.18+(1+Math.sin(seconds*(gold?2.1:1.5)+phase))*(gold?.30:.22);
      pixel(ctx,x+Math.sin(seconds*1.25+phase)*4,y,w,1,gold?"#ddba7b":"#659eaa");
    }
    ctx.globalAlpha=1;
    if (flow<1) {
      for(let x=0;x<width;x+=6) {
        const y=waterLevel+Math.sin(x*.07-seconds*3)*(1-flow)*8;
        pixel(ctx,x,y+1,6,1,"#bfd5b5");
        pixel(ctx,x+2,y+3,3,1,"#6faeb5");
      }
    }
    for (let i=0;i<2;i++) {
      const x=i?width-((seconds*7+45)%(width+36)):((seconds*10+280)%(width+42))-28;
      const y=195+i*21+Math.round(Math.sin(seconds*2+i));
      pixel(ctx,x-16,y+7,38,1,"#7babac9c");
      pixel(ctx,x-8,y+9,31,1,"#6e9ca895");
      pixel(ctx,x,y+3,24,3,"#0b233a");
      pixel(ctx,x+3,y,16,3,"#9caa9c");
      pixel(ctx,x+4,y+1,12,1,"#ffd18a");
      pixel(ctx,x+18,y-3,1,5,"#b8c3a8");
      pixel(ctx,x+18,y-3,2,1,"#f9d7a1");
    }
    ctx.restore();
    for (const {image,x,base,h,delay} of towers){
      const distance=Math.min(1,Math.abs(x+image.width/2-width/2)/(width/2));
      const p=Math.max(0,Math.min(1,(rise-distance*spread-delay)/(1.12+h*.006)));
      const shown=Math.floor(h*p*p*(3-2*p));
      if(!shown) continue;
      const floorMix=Math.min(1,Math.max(0,(p-.23)/.63));
      const ground=coast+Math.round((base-coast)*floorMix);
      ctx.drawImage(image,0,0,image.width,shown,x,ground-shown,image.width,shown);
      if(p<1){
        const light=Math.sin(Math.PI*p);
        pixel(ctx,x+image.width*.47,ground-shown-1,2,1,`rgba(255,216,145,${light*.85})`);
        if(p<.62) pixel(ctx,x+image.width*.55,ground-2,2,2,`rgba(255,217,150,${light*.78})`);
      }
    }
    if (rise>1.2) {
      ctx.save();
      ctx.globalAlpha=Math.min(1,(rise-1.2)*1.6);
      ctx.drawImage(promenade,0,0);
      const carX=(seconds*28+55)%(width+36)-30;
      pixel(ctx,carX,coast-5,29,4,"#85aeab");
      pixel(ctx,carX+1,coast-6,26,1,"#98bbb5");
      for(let x=3;x<26;x+=5) pixel(ctx,carX+x,coast-4,3,1,"#ffd994");
      pixel(ctx,carX+27,coast-4,3,1,"#fff1bc");
      for(const x of [149,288,336,380,437]) {
        const blink=(1+Math.sin(seconds*2.5+x))*.5;
        ctx.globalAlpha=blink;
        pixel(ctx,x,coast-45-(x%24),1,1,"#ffe1b1");
      }
      ctx.restore();
    }
  }
  return {background,draw,coast,waterline:coast+10};
}
