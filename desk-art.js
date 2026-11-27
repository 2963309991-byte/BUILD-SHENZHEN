"use strict";

function drawDeskArt() {
  const scene=document.querySelector("#desk-scene");
  const ctx=scene.getContext("2d");
  const box=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
  const oval=(x,y,rx,ry,color)=>{
    ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();
  };
  function pencil(context,x,y,angle,color,length) {
    context.save();
    context.translate(x,y);
    context.rotate(angle);
    const fill=(x0,y0,w,h,tint)=>{context.fillStyle=tint;context.fillRect(x0,y0,w,h);};
    fill(2,5,length,4,"#15263163");
    fill(0,0,length,5,color);
    fill(0,0,length,1,"#f6d5a775");
    fill(length-7,0,3,5,"#d5bf91");
    fill(length-4,0,4,5,"#a76860");
    fill(-6,1,6,3,"#daba86");
    fill(-9,2,3,1,"#253641");
    context.restore();
  }
  let seed=23;
  const rand=()=>{
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    return seed/4294967296;
  };
  const timber=ctx.createLinearGradient(0,0,720,440);
  timber.addColorStop(0,"#926d52");
  timber.addColorStop(.46,"#6f4e40");
  timber.addColorStop(1,"#41323a");
  box(0,0,720,440,timber);
  for(let y=6;y<440;y+=46){
    box(0,y,720,1,"#301f235b");
    box(0,y+1,720,1,"#ce98784d");
  }
  for(let i=0;i<1650;i++){
    const x=rand()*720|0,y=rand()*440|0;
    box(x,y,3+(rand()*84|0),1,i%3===0?"#f1b88719":"#36252820");
  }
  const lamp=ctx.createRadialGradient(265,96,0,240,93,375);
  lamp.addColorStop(0,"#ffdba743");
  lamp.addColorStop(1,"#ffdba700");
  box(0,0,720,440,lamp);

  // Desk blotter, stitching and the loose stationery around it.
  box(37,104,652,307,"#211c25a8");
  box(30,95,652,307,"#233e43");
  box(34,99,644,299,"#294951");
  box(30,95,652,2,"#7d8f7b");
  box(31,400,652,2,"#142a33");
  for(let x=39;x<677;x+=7){
    box(x,103,3,1,"#a99b77");
    box(x,393,3,1,"#a99b77");
  }
  for(let y=106;y<392;y+=7){
    box(39,y,1,3,"#a99b77");
    box(674,y,1,3,"#a99b77");
  }
  ctx.save();
  ctx.translate(82,337);
  ctx.rotate(-.17);
  box(6,8,111,82,"#1528317a");
  box(-4,5,109,78,"#b8a47b");
  box(0,0,111,77,"#e3d4ad");
  box(7,7,94,62,"#e9dbb8");
  box(17,10,1,56,"#bc8b77");
  for(let y=15;y<65;y+=7) box(9,y,94,1,"#b7b69a");
  for(let i=0;i<6;i++) box(24,17+i*7,24+(rand()*49|0),1,"#6c8175");
  ctx.restore();
  pencil(ctx,151,399,-.22,"#d6a663",84);
  pencil(ctx,502,73,.18,"#8e9d91",87);

  oval(624,64,34,28,"#2a202486");
  oval(615,59,26,25,"#233c4a");
  oval(615,56,24,23,"#b8c6b5");
  oval(615,56,20,19,"#273a43");
  pencil(ctx,605,59,-1.55,"#bb766c",40);
  pencil(ctx,612,61,-1.13,"#d8ab74",39);
  pencil(ctx,622,60,-.96,"#8ca39b",39);
  oval(608,70,10,3,"#121d2b61");

  ctx.save();
  ctx.translate(422,361);
  ctx.rotate(.18);
  ctx.strokeStyle="#1b2936";
  ctx.lineWidth=3;
  for(const x of [10,36]){
    ctx.beginPath();ctx.ellipse(x,10,10,7,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.beginPath();ctx.moveTo(20,11);ctx.quadraticCurveTo(23,7,26,11);ctx.moveTo(0,10);ctx.lineTo(-10,15);ctx.moveTo(46,10);ctx.lineTo(60,15);ctx.stroke();
  ctx.restore();
  pencil(ctx,467,391,-.19,"#71998d",76);

  const art={
    atlas(canvas){
      const map=document.createElement("canvas");
      map.width=420;map.height=306;
      pixelMap(map,7,"transfer");
      const cx=canvas.getContext("2d");
      cx.imageSmoothingEnabled=false;
      cx.save();cx.translate(110,75);cx.rotate(-.075);
      const pages=[[-71,37,10],[-43,83,-4],[33,37,9]];
      for(const [index,[x,w,y]] of pages.entries()){
        cx.fillStyle="#172d3ca6";cx.fillRect(x+4,y-48,w,106);
        cx.fillStyle=index===1?"#eee4c6":"#d7c597";cx.fillRect(x,y-53,w,106);
        cx.drawImage(map,index*140,0,140,306,x+4,y-49,w-8,98);
        cx.fillStyle=index===1?"#264a5f14":"#29455532";cx.fillRect(x+4,y-49,w-8,98);
      }
      cx.fillStyle="#30475892";cx.fillRect(-43,-48,3,100);cx.fillRect(36,-48,3,100);
      cx.fillStyle="#fff2c4";cx.fillRect(-40,-53,77,2);
      cx.fillStyle="#d4bc83";cx.fillRect(-41,48,80,2);cx.fillRect(-39,51,78,1);
      cx.fillStyle="#f5dfab";cx.fillRect(-20,-28,42,18);
      cx.fillStyle="#3b635e";cx.fillRect(-15,-24,32,2);cx.fillRect(-11,-18,24,2);
      cx.fillStyle="#edc483";
      for(const [x,y] of [[-57,10],[8,11],[60,24]]){cx.fillRect(x-3,y-3,6,6);cx.fillRect(x-1,y+3,2,2);}
      cx.restore();
    },
    transfer(canvas){
      const cx=canvas.getContext("2d");
      const covers=["#815e58","#285971","#47796d"];
      for(let i=0;i<3;i++){
        cx.save();cx.translate(78,68+i*2);cx.rotate([.12,-.19,.04][i]);cx.translate(-49,-37-i*9);
        cx.fillStyle="#192b377f";cx.fillRect(3,6,99,78);
        cx.fillStyle=covers[i];cx.fillRect(0,0,99,73);
        cx.fillStyle="#e2cf9d";cx.fillRect(5,69,91,6);
        cx.fillStyle="#ae976a";cx.fillRect(8,71,83,1);
        cx.fillStyle="#ead398";cx.fillRect(12,4,1,61);cx.fillRect(4,10,5,2);cx.fillRect(4,56,5,2);
        if(i===2){
          cx.strokeStyle="#b6b184";cx.strokeRect(21,8,67,50);
          cx.fillStyle="#f4dda8";cx.fillRect(30,15,50,18);
          cx.fillStyle="#51766e";cx.fillRect(36,20,38,2);cx.fillRect(41,26,28,1);
          cx.fillStyle="#c1a16d";cx.fillRect(50,39,10,9);cx.fillRect(53,36,4,15);
        }
        cx.restore();
      }
    },
    compare(canvas){
      const cx=canvas.getContext("2d");
      cx.save();cx.translate(66,60);cx.rotate(-.46);
      cx.fillStyle="#1029318d";cx.fillRect(0,22,16,66);
      cx.fillStyle="#c7a36d";cx.fillRect(-7,26,13,55);
      cx.fillStyle="#263f49";cx.fillRect(-5,42,10,41);
      cx.fillStyle="#50716e";cx.fillRect(-4,42,3,39);
      for(const [x,y,rx,ry,color] of [[3,4,34,34,"#16344098"],[0,0,34,34,"#bf9e65"],[0,0,31,31,"#e6c98b"],[0,0,28,28,"#2f555c"],[0,0,26,26,"#6a9a9a"]]){
        cx.fillStyle=color;cx.beginPath();cx.ellipse(x,y,rx,ry,0,0,Math.PI*2);cx.fill();
      }
      cx.fillStyle="#87b3ab";cx.fillRect(-14,-13,28,22);
      cx.fillStyle="#ebd7aa";cx.fillRect(-13,-3,25,2);cx.fillRect(3,-11,2,17);
      cx.fillStyle="#567b76";cx.fillRect(-9,-9,8,5);cx.fillRect(6,0,6,6);
      cx.strokeStyle="#e5f5de9c";cx.lineWidth=2;cx.beginPath();cx.arc(0,0,21,3.7,5.1);cx.stroke();
      cx.restore();
    },
    budget(canvas){
      const cx=canvas.getContext("2d");
      for(let i=0;i<3;i++){
        cx.save();cx.translate(65,58-i*6);cx.rotate(-.15+i*.09);
        cx.fillStyle="#142c367f";cx.fillRect(-42,-15,88,43);
        cx.fillStyle=["#c8b785","#97a582","#b6c29b"][i];cx.fillRect(-45,-19,88,42);
        cx.strokeStyle="#4b776d";cx.strokeRect(-41,-15,80,34);
        cx.fillStyle="#69927e";cx.fillRect(-34,-8,16,3);cx.fillRect(16,10,15,3);
        cx.beginPath();cx.ellipse(0,2,10,12,0,0,Math.PI*2);cx.fill();cx.restore();
      }
      for(const [n,x,y] of [[3,91,67],[2,79,80],[1,38,80]]){
        for(let i=n-1;i>=0;i--){
          const dy=y+i*3;
          for(const [rx,ry,color] of [[15,10,"#6e5138"],[14,8,"#d5ac63"],[11,6,"#efd092"]]){
            cx.fillStyle=color;cx.beginPath();cx.ellipse(x,dy,rx,ry,0,0,Math.PI*2);cx.fill();
          }
          cx.fillStyle="#986d3e";cx.fillRect(x-3,dy-2,6,4);
        }
      }
    }
  };
  for(const button of document.querySelectorAll(".desk-object")) art[button.dataset.deskOpen](button.querySelector("canvas"));
}

drawDeskArt();
