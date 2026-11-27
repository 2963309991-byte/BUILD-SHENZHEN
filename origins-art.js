"use strict";

const originDefaultExpressions=["serious","curious","thoughtful","smiling"];
const originPortraitSizes=[.97,.90,1.035,.85];

function paintOriginsFace(r,expression,look,ink) {
  const {eye,shade,cheek}=look;
  const eyesClosed=expression==="delighted";
  const raised=expression==="curious" || expression==="inquisitive" || expression==="skeptical";
  const concerned=expression==="concerned";
  const stern=expression==="serious";
  const focused=expression==="thoughtful" || expression==="skeptical";
  const excited=expression==="enthusiastic";
  const encouraging=expression==="encouraging";
  for(const [i,x] of [44,68].entries()){
    const direction=i===0?1:-1;
    const browY=raised?(i===0?54:57):excited?53:57;
    if(concerned){
      for(let j=0;j<11;j++) r(x+j,browY+Math.floor((direction>0?10-j:j)/4),1,2,ink);
    }else if (stern || focused) {
      for(let j=0;j<11;j++) r(x+j,browY+Math.floor((direction>0?j:10-j)/4),1,2,ink);
    } else {
      r(x,browY+2,2,1,ink);r(x+2,browY+1,7,1,ink);r(x+9,browY+2,2,1,ink);
    }
    if(eyesClosed){
      r(x,68,2,2,ink);r(x+2,65,2,3,ink);r(x+4,63,4,2,ink);
      r(x+8,65,2,3,ink);r(x+10,68,2,2,ink);
    }else{
      const eyeY=raised || excited?62:focused?65:63;
      const height=raised || excited?7:focused || encouraging?4:6;
      r(x+1,eyeY+1,10,height,"#fae6d2");r(x,eyeY,11,2,ink);
      const pupil=x+(focused?7:expression==="inquisitive"?3:5);
      r(pupil,eyeY+1,4,height,eye);r(pupil+1,eyeY+2,2,height-1,ink);
      r(pupil,eyeY+1,1,1,"#fff6e3");
    }
  }
  r(61,66,2,9,shade);r(60,74,5,2,shade);
  const happy=["smiling","delighted","encouraging","enthusiastic","hopeful"].includes(expression);
  r(42,73,happy?7:5,2,cheek);r(76,73,happy?7:5,2,cheek);
  if(happy){
    r(55,81,2,2,"#864b4a");r(67,81,2,2,"#864b4a");
    r(57,83,10,eyesClosed || excited?5:3,"#864b4a");
    if(eyesClosed || excited){r(58,83,8,2,"#fff0da");r(60,87,5,1,cheek);}
    else r(60,85,5,1,cheek);
  }else if (expression==="curious"){
    r(59,82,6,1,"#864b4a");r(58,83,8,3,"#864b4a");r(59,86,6,1,cheek);
  }else if(stern || concerned){
    r(57,83,10,2,"#864b4a");r(55,84,2,1,"#864b4a");r(67,84,2,1,"#864b4a");
  }else if(expression==="inquisitive"){
    r(58,83,6,2,"#864b4a");r(64,84,4,1,"#864b4a");
  }else{
    r(57,83,8,1,"#864b4a");r(65,84,3,1,"#864b4a");
  }
}

function paintOriginsPortrait(canvas,index,expression=originDefaultExpressions[index]) {
  const ctx=canvas.getContext("2d");
  ctx.save();
  const size=originPortraitSizes[index];
  ctx.translate(64*(1-size),165*(1-size));
  ctx.scale(size,size);
  const look=guideLooks[index];
  const [hair,shine,shadow]=hairColors[look.hair];
  const {skin,shade,cheek,eye}=faceColors[look.face];
  const [cloth,light,dark,trim]=clothesColors[look.clothes];
  const ink="#231d2b";
  const r=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
  const p=(points,color,outline=false)=>{
    ctx.beginPath();
    points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.closePath();
    ctx.fillStyle=color;
    ctx.fill();
    if(outline){ctx.lineWidth=1.8;ctx.strokeStyle=ink;ctx.stroke();}
  };

  if(index===0){
    p([[27,55],[21,46],[21,32],[29,24],[42,25],[50,38],[44,54],[35,62]],shadow,true);
    p([[24,33],[31,27],[40,28],[43,34],[34,33],[28,38]],shine);
    r(29,44,14,2,hair);r(26,40,12,2,hair);
  }
  if(index===3){
    p([[82,40],[91,48],[98,60],[110,68],[116,84],[113,103],[118,113],[103,115],[94,109],[91,92],[81,74]],hair,true);
    p([[93,65],[105,72],[111,85],[107,98],[104,90],[100,82],[94,78]],shine);
    p([[109,79],[111,94],[106,111],[116,111],[111,103],[116,86]],shadow);
    r(90,61,7,5,"#569e94");r(91,61,5,1,"#b4d5ab");
  }
  // Shoulders and clothes
  p([[48,94],[78,93],[91,107],[111,113],[121,134],[126,164],[4,164],[10,134],[21,115],[42,107]],cloth,true);
  p([[15,133],[31,126],[38,143],[34,164],[4,164]],dark);
  p([[106,120],[117,132],[126,164],[88,164],[94,132]],dark);
  p([[20,116],[43,107],[54,122],[25,133],[16,137]],light);
  p([[80,107],[107,115],[111,126],[88,121]],light);
  p([[49,81],[76,80],[77,102],[83,108],[66,123],[43,108],[50,99]],skin,true);
  p([[53,89],[75,85],[76,104],[64,108],[50,100]],shade);

  // Face, hair and the small expression details remain visible at game scale.
  p([[41,30],[58,19],[78,23],[89,37],[89,60],[93,65],[90,77],[84,79],[78,90],[67,97],[56,95],[45,88],[39,78],[33,75],[31,64],[36,62],[35,49]],skin,true);
  p([[81,30],[89,39],[88,62],[94,66],[89,77],[84,78],[75,92],[66,96],[58,94],[71,89],[80,76],[83,56]],shade);
  p([[43,38],[55,31],[70,34],[76,43],[72,49],[54,45],[42,49]],"#fff1d850");
  r(35,68,4,7,shade);r(87,68,3,6,cheek);
  const hairCuts=[
    [[30,64],[24,44],[28,31],[38,22],[55,15],[74,16],[88,22],[97,35],[96,46],[91,64],[85,61],[85,45],[80,34],[75,30],[63,30],[51,35],[42,45],[37,57],[37,66]],
    [[28,62],[26,41],[33,26],[38,22],[36,16],[52,19],[62,12],[79,17],[91,24],[98,34],[95,51],[89,65],[84,55],[83,38],[75,38],[67,44],[58,48],[61,43],[47,48],[40,57],[39,65]],
    [[28,58],[26,43],[32,29],[43,21],[61,17],[79,20],[92,27],[96,41],[92,60],[86,65],[84,47],[80,37],[70,36],[57,40],[45,42],[41,51],[37,64]],
    [[28,72],[22,60],[24,43],[31,27],[43,18],[61,13],[80,17],[91,25],[98,40],[91,49],[91,63],[85,64],[81,48],[73,39],[64,34],[59,44],[55,53],[48,55],[50,46],[41,51],[34,63],[36,71]]
  ];
  p(hairCuts[index],hair,true);
  p([[29,45],[36,29],[48,23],[69,21],[78,25],[56,27],[44,32],[36,44]],shine);
  p([[34,53],[42,40],[62,32],[74,29],[64,37],[47,43],[40,52]],shadow);
  p([[77,25],[88,31],[94,42],[91,56],[88,45],[86,37]],shine);
  if(index===0){
    r(31,46,3,13,"#9f7769");r(34,49,4,9,shine);r(87,45,4,13,"#856d67");
  }
  if(index===3){
    r(77,39,9,2,"#7ac0b1");r(79,43,9,2,"#e2b672");r(36,72,2,3,"#e1b97c");
  }
  paintOriginsFace(r,expression,{eye,shade,cheek},ink);
  if(index===0){
    const rim="#805b40";
    for(const x of [41,65]){
      r(x+3,60,13,1,rim);r(x+2,73,14,1,rim);
      r(x,63,1,8,rim);r(x+17,63,1,8,rim);
      r(x+1,61,2,2,rim);r(x+15,61,2,2,rim);
      r(x+1,71,2,2,rim);r(x+15,71,2,2,rim);
      r(x+4,60,4,1,"#eac684");
    }
    r(58,64,7,1,rim);r(37,63,4,1,rim);r(83,62,4,1,rim);
  }
  if(index===2){
    ctx.strokeStyle="#292931";ctx.lineWidth=1.5;
    ctx.strokeRect(42.5,62.5,15,10);ctx.strokeRect(65.5,62.5,15,10);
    r(58,66,8,1,"#292931");r(38,64,5,1,"#292931");
    r(43,74,7,1,shade);r(71,74,7,1,shade);
    r(30,39,3,11,"#7c6a65");r(87,37,3,10,"#7c6a65");
  }
  if(index===0){r(34,76,3,3,"#f4e1bd");r(35,79,2,3,"#bd9966");r(84,76,3,3,"#f4e1bd");}

  // Collar folds, stitches and character-specific working props.
  p([[47,101],[62,113],[54,126],[36,112]],trim,true);
  p([[77,101],[62,113],[71,126],[87,112]],trim,true);
  r(60,121,5,43,dark);
  for(let y=128;y<158;y+=9){r(62,y,2,2,trim);r(63,y+2,2,1,ink);}
  r(26,127,16,3,dark);r(27,129,13,2,light);
  r(89,128,16,3,dark);r(90,130,12,2,light);
  for(let x=20;x<113;x+=3) if(x<48 || x>79) for(let y=136+(x%2);y<164;y+=4) r(x,y,1,1,"#fff4df22");
  if(index===1 || index===3){
    const prop=index===1?"#c3996f":"#4d7b8a";
    p([[72,136],[105,129],[117,162],[82,163]],prop,true);
    p([[76,138],[105,132],[114,159],[83,161]],index===1?"#efe0b7":"#759ca6");
    for(let i=0;i<4;i++) r(82+i,142+i*4,22,1,index===1?"#9c8270":"#c0d6cb");
    r(107,144,7,12,skin);r(109,146,6,11,shade);
  }
  if(index===0){
    p([[55,113],[64,116],[76,109],[70,127],[63,132],[54,123]],"#aa675e",true);
    r(61,119,4,3,"#e3a583");
  }
  if(index===2){r(26,117,16,2,"#c0a783");r(37,112,2,14,"#644c46");r(37,112,2,3,"#bc7566");}
  ctx.restore();
  // Quantize polygon edges so the hand-drawn geometry reads as pixel art.
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
  for(let i=3;i<pixels.data.length;i+=4) pixels.data[i]=pixels.data[i]>96?255:0;
  ctx.putImageData(pixels,0,0);
}

function paintOriginsScene(canvas,chapter) {
  const ctx=canvas.getContext("2d");
  if (chapter===1) {
    pixelScene(canvas,3);
    ctx.fillStyle="#18293d45";
    ctx.fillRect(0,0,480,240);
    return;
  }
  const r=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
  r(0,0,480,240,"#35444c");
  r(0,23,480,165,"#9c9275");
  r(0,23,480,10,"#c2af87");
  for(let x=0;x<480;x+=29) r(x,33,1,151,"#5b6258");
  r(77,29,320,118,"#253440");r(81,33,312,110,"#6d918b");
  r(84,36,305,82,"#afc5aa");
  for(let x=84;x<390;x+=4){
    const hill=65+Math.cos(x/29)*10+Math.sin(x/15)*4;
    r(x,hill,4,36,"#7f9e94");
    const h=8+(x*17)%44;
    r(x,124-h,3,h,chapter>1?"#567478":"#71918a");
    if(chapter>1 && x%3===0) for(let y=128-h;y<122;y+=6) r(x+1,y,1,2,"#e5ca8a");
  }
  for(let x=81;x<393;x+=51){r(x,31,3,115,"#2d3e47");r(x+3,34,2,107,"#82938a");}
  r(82,84,313,2,"#365659");
  r(68,145,335,5,"#dac49a");
  for(const x of [15,416]){
    r(x,57,46,107,"#554a49");r(x+3,61,40,98,"#6c5a52");
    for(let y=87;y<156;y+=23){
      r(x+3,y,40,3,"#ad8666");
      for(let shelf=x+6;shelf<x+41;shelf+=6) r(shelf,y-16+(shelf%3),4,15-(shelf%3),["#7d9d91","#c59b70","#96594c"][shelf%3]);
    }
  }
  r(0,172,480,68,"#765a4d");r(0,171,480,3,"#e0b184");
  for(let i=0;i<12;i++) r(0,185+i*5,480,1,i%3?"#886757":"#ad8465");
  r(160,152,158,36,"#d8c49d");r(165,155,148,29,"#dfd3aa");
  for(let x=171;x<308;x+=9) r(x,158,1,24,"#b6b89c");
  for(let y=158;y<182;y+=6) r(168,y,144,1,"#b6b89c");
  r(171,171,134,2,"#638f8b");r(230,156,2,26,"#718d83");
  r(249,160,27,9,"#b8b97f");r(193,169,27,10,"#b3c8a3");
  if(chapter===2){
    r(133,162,37,20,"#a47560");r(135,160,35,18,"#d5b17f");
    for(let z=0;z<4;z++) r(140,164+z*3,21,1,"#7b6255");
    r(313,153,4,21,"#7a604d");r(310,152,10,8,"#b18b5d");r(308,174,15,3,"#624f4c");
  }
  if(chapter===3){
    r(157,151,167,38,"#557984");r(161,154,159,32,"#749a9b");
    for(let y=155;y<184;y+=6) r(161,y,159,1,"#91b6a8");
    for(let x=162;x<319;x+=8) r(x,155,1,30,"#91b6a8");
    r(179,164,28,8,"#b49375");r(213,156,16,21,"#dbc68f");r(247,170,34,6,"#a8c2a3");
    r(173,173,137,2,"#d3c896");r(235,155,2,30,"#d3c896");
  }
}
