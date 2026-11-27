"use strict";

const hairShapes = [
  [
    ".......OOOOOO.......",".....OOHHHHHHOO.....","....OHHHHHHHHHHO....","...OHHLLHHHHHHHHO...",
    "..OHLLHHHHHHHHHHHO..",".OHHHHHHHHHHHHHHHHO.",".OHHHHHHHHHHHHHHHHO.",".OHHHHHHHHHHHHHHHHO.",
    "OHHHHHHHHHHHHHHHHHHO","OHHHHHHHHHHHHHHHHHHO","OHHHHHHHHHHHHHHHHHHO","OHHHHHH.HHH.HHHHHHHO",
    "OHHHHH...H...HHHHHHO","OHHSH.........HSHHHO","OHHSH.........HSHHHO",".OHSH.........HSHHO.",
    ".OHSH.........HSHHO.",".OHSH.........HSHHO.",".OHSH.........HSHHO.",".OHSS.........SSHO.",
    "..OHS.........SHO...","..OOO.........OOO..."
  ],
  [
    "......OOOOOOO.......","....OOHHHHHHHOO.....","...OHHHHHHHHHHHOO...","..OHLLLHHHHHHHHHHO..",
    ".OHLLHHHHHHHHHHHHHO.",".OHHHHHHHHHHHHHHHHO.","OHHHHHHHHHHHHHHHHHHO","OHHHHHHHHHHHHHHHHHHO",
    "OHHHHHHHHHHHHHHHHHOO","OHHHHHHHHHHHHHHHHHO.",".OHHHHHHH.HHHHHHHHO.",".OHHHHHH...HHHHHHHO.",
    ".OHHHHH.....HHHHHHO.",".OHHHH.......HHHHO..","..OHH.........HHHO..","..OH...........HO...",
    "...O............O...","...................."
  ],
  [
    "........OOOOO.......",".......OHHHHHO......","......OHLLHHHHO.....","......OHHHHHHHO.....",
    ".....OOHHHHHHHOO....","...OOHHHHHHHHHHHOO..","..OHHHLLHHHHHHHHHHO.",".OHLLHHHHHHHHHHHHHO.",
    ".OHHHHHHHHHHHHHHHO..",".OHHHHHHHHHHHHHHHHO.",".OHHHHHHHH.HHHHHHO..",".OHHHHHH....HHHHHO..",
    ".OHHHH.......HHHHO..","..OHH.........HHO...","..OHH.........HHO...","..OH...........HO...",
    "...O...........O...."
  ],
  [
    ".......OOOOOO.......",".....OOHHHHHHOO.....","...OOHHHHHHHHHHOO...","..OHHLLLLHHHHHHHHO..",
    ".OHHLLHHHHHHHHHHHHO.",".OHHHHHHHHHHHHHHHHO.","OHHHHHHHHHHHHHHHHHHO","OHHHHHHHHHHHHHHHHHHO",
    "OHHHHHHHHHHHHHHHHHHO","OHHHHHHHHHHHHHHHHHHO","OHHHHHHHHHH.HHHHHHHO","OHHHHHHHHH...HHHHHHO",
    "OHHHHHHH......HHHHHO","OHHHHHH........HHHHO",".OHHHH.........HHHO.",".OHHH..........HHHO.",
    "..OHH..........HHO..","...OH..........HO...","....O..........O...."
  ],
  [
    "......OOOOOOOO......","....OOHHHHHHHHOO....","...OHHLLLLHHHHHHO...","..OHHLLHHHHHHHHHHO..",
    "..OHHHHHHHHHHHHHHO..",".OHHHHHHHHHHHHHHHHO.",".OHHHHHHHHHHSHHHHHO.",".OHHHHHHHHH.SHHHHHO.",
    ".OHHHHHHHH...HHHHHO.","..OHHHHH.....HHHHO..","..OHHH.........HHO..","..OH...........HO..."
  ],
  [
    "....................",".......OOOOOO.......",".....OOHHHHHHOO.....","....OHHLLHHHHHHO....",
    "...OHHHHHHHHHHHHO...","...OHHHHHHHHHHHHO...","..OHHHHHHHHHHHHHHO..","..OHSSSSHHHHSSSHO...",
    "..OHS.........SHO...","..OHS.........SHO...","..OH...........HO..."
  ],
  [
    "......OOOO..........","....OOHHHHOO........","...OHLLHHHHHOO......","..OHLLHHHHHHHHOO....",
    "..OHHHHHHHHHHHHHO...",".OHHHHHHHHHHHHHHHO..",".OHHHHHHHHHHHHHHHO..",".OHSHHHHHHHHHHHHHO..",
    "..OHSHHH...HHHHHO...","..OHS.........HHO...","..OHS.........HHO...","...O...........O...."
  ]
];

const hairColors = [
  ["#36303a","#514550","#2b2531"], ["#34434b","#53656b","#27383d"],
  ["#6a403c","#965d50","#4c302e"], ["#a26b4c","#c39169","#794d40"], ["#352b2d","#64504a","#231f24"], ["#554541","#7a6a62","#332c2d"], ["#43333c","#75555c","#292536"]
];

const faceColors = [
  {skin:"#ffe8d4",shade:"#e9b7a2",cheek:"#e99d9b",eye:"#475650"},
  {skin:"#efbc94",shade:"#ce8d75",cheek:"#d8847a",eye:"#4e3d3d"},
  {skin:"#f7d4b5",shade:"#e3a389",cheek:"#db9693",eye:"#566580"},
  {skin:"#bb8267",shade:"#935e52",cheek:"#c67c75",eye:"#50443c"},
  {skin:"#e6b496",shade:"#bf826f",cheek:"#c98578",eye:"#554b50"},
  {skin:"#bd8871",shade:"#966854",cheek:"#a66d62",eye:"#484651"}
];

const clothesColors = [
  ["#426876","#6b9a9a","#2c4e63","#f1debd"],
  ["#566588","#8290ac","#3b4769","#eed6b2"],
  ["#985d53","#c18472","#68454b","#f6d5ac"],
  ["#8a775b","#b5a37d","#5f594e","#f0d9a5"], ["#556064","#899394","#3e454c","#d9ba8a"], ["#8b7149","#bda36e","#624b42","#ebdab0"]
];

const guideLooks = [
  {hair:2,face:1,clothes:2}, {hair:1,face:0,clothes:0},
  {hair:0,face:3,clothes:3}, {hair:3,face:2,clothes:1}
];
const spriteSize=28;

function paintPerson(ctx, look, pose=0, upgrade=0) {
  ctx.clearRect(0,0,spriteSize,spriteSize);
  const outline="#211d29";
  const [hair,shine,shadow]=hairColors[look.hair];
  const {skin,shade,cheek,eye}=faceColors[look.face];
  const [cloth,light,dark,trim]=clothesColors[look.clothes];
  const r=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
  const shape=(rows,x,y,colors)=>rows.forEach((row,i)=>[...row].forEach((key,j)=>{
    if (key!==".") r(x+j,y+i,1,1,colors[key]);
  }));

  r(9+pose,23,4,4,outline);r(15-pose,23,4,4,outline);
  r(10+pose,23,2,2,dark);r(16-pose,23,2,2,dark);
  r(10+pose,25,2,1,trim);r(16-pose,25,2,1,trim);
  r(8,18,12,6,outline);r(9,23,10,2,outline);
  r(9,19,10,4,cloth);r(10,21,8,3,dark);r(11,21,6,2,cloth);
  r(6,19+pose,3,4,outline);r(19,19-pose,3,4,outline);
  r(7,20+pose,2,1,light);r(19,20-pose,2,1,light);
  r(7,21+pose,2,1,skin);r(19,21-pose,2,1,skin);
  r(10,18,8,2,light);r(12,18,4,2,trim);
  if (look.clothes===0) {r(10,19,1,3,trim);r(17,19,1,3,trim);r(12,21,4,2,light);}
  if (look.clothes===1) {r(13,19,2,4,trim);r(13,20,1,2,"#a95452");}
  if (look.clothes===2) {r(10,20,8,1,trim);r(12,22,4,1,light);}
  if (look.clothes===3) {r(13,19,2,4,dark);r(10,21,2,1,trim);r(16,21,2,1,trim);}

  if (look.clothes===4) {r(13,19,2,4,dark);r(10,21,2,1,light);r(16,21,2,1,trim);}
  if (look.clothes===5) {r(10,19,1,4,trim);r(17,19,1,4,trim);r(11,21,6,2,dark);r(13,21,2,1,light);}
  r(6,9,16,9,outline);r(7,10,14,7,skin);
  r(7,16,14,1,shade);r(9,17,10,2,outline);r(10,17,8,1,skin);
  r(7,14,2,3,shade);r(19,14,2,3,shade);
  shape(hairShapes[look.hair],4,0,{O:outline,H:hair,L:shine,S:shadow});
  for (const x of [9,16]) {
    r(x,14,3,1,outline);r(x,15,3,2,eye);r(x,15,1,1,"#fff2dc");
    r(x-1+(x===16?2:0),17,2,1,cheek);
  }
  if (look.face===1) {
    for (const x of [8,15]) {
      r(x,13,5,1,"#694a49");r(x,17,5,1,"#694a49");
      r(x,14,1,3,"#694a49");r(x+4,14,1,3,"#694a49");
    }
    r(13,14,2,1,"#694a49");
  }
  if (look.face===2) {r(13,17,2,1,"#a25e64");r(14,16,1,1,shade);}
  if (look.face===3) {r(9,16,3,1,"#816563");r(16,16,3,1,"#816563");r(13,17,2,1,"#754a48");}
  if (look.face===4) {r(10,17,1,1,"#956858");r(12,18,4,1,"#74534e");r(17,17,1,1,"#956858");}
  if (look.face===5) {r(10,17,8,2,"#48373b");r(12,17,4,1,"#805b55");r(13,17,2,1,"#d69d86");}
  if (look.hair===0) {r(18,7,3,1,"#f5dec5");r(19,6,2,1,"#fdf0db");}
  if (look.hair===2) {r(13,5,4,1,"#cb9e7b");r(15,6,2,1,"#cb9e7b");}
  if (upgrade===1) {r(17,20,2,2,trim);r(18,20,1,1,"#e29b53");}
  if (upgrade===2) {r(10,21,8,1,"#e6c982");r(17,19,2,2,"#e6c982");}
}

function drawGuide(canvas,index) {
  paintPerson(canvas.getContext("2d"),guideLooks[index]);
}

function makeRunnerSprites(look) {
  return [0,1,2].map(upgrade=>[-1,0,1].map(pose=>{
    const canvas=document.createElement("canvas");
    canvas.width=spriteSize;
    canvas.height=spriteSize;
    paintPerson(canvas.getContext("2d"),look,pose,upgrade);
    return canvas;
  }));
}

function drawGuideCat(cat, pose, elapsed) {
  const ink="#142b3b", fur="#f6deb1", shadow="#ce9d73", cream="#fff1d3", pink="#db9a89", teal="#68a498", gold="#efc776";
  const rect=(x,y,w,h,color)=>{cat.fillStyle=color;cat.fillRect(x,y,w,h);};
  cat.clearRect(0,0,52,32);
  const wave = Math.floor(elapsed / 270) % 3;
  const tail = pose===2 ? 7+wave : 10+wave;
  // The tail, chin and front paws overlap the edge of the tooltip.
  rect(32,17,11,9,ink); rect(37,14,10,9,ink); rect(44,tail,6,11,ink);
  rect(45,tail+1,4,9,shadow); rect(40,16,7,5,shadow); rect(34,18,8,6,fur);
  rect(13,18,26,10,ink); rect(15,19,22,7,shadow); rect(15,20,20,4,teal);
  rect(13,3,6,9,ink); rect(25,3,6,9,ink); rect(14,4,4,8,fur); rect(26,4,4,8,fur);
  rect(15,6,2,5,pink); rect(27,6,2,5,pink);
  rect(14,7,16,15,ink); rect(11,11,22,9,ink); rect(13,9,18,11,fur);
  rect(12,12,20,6,fur); rect(15,15,15,6,cream); rect(20,8,2,4,shadow); rect(23,8,2,3,shadow);
  rect(14,16,3,1,pink); rect(28,16,3,1,pink); rect(21,16,2,1,"#9e615c");
  rect(11,15,3,1,ink); rect(30,15,3,1,ink); rect(22,18,2,1,ink);
  const blink = elapsed % 3600 >= 3430;
  if (blink || pose===3) {
    rect(16,14,4,1,ink); rect(25,14,4,1,ink);
    if (pose===3) {rect(17,13,2,1,ink);rect(26,13,2,1,ink);}
  } else {
    const tall = pose===1 ? 5 : 4;
    for (const x of [16,25]) {
      rect(x,12,4,tall,ink); rect(x+2,12,1,1,cream); rect(x+1,12+tall-1,2,1,teal);
    }
  }
  rect(27,21,5,4,ink); rect(28,21,3,3,gold);
  rect(15,24,8,6,ink); rect(16,24,6,5,cream); rect(18,28,1,1,shadow); rect(20,28,1,1,shadow);
  const paw = pose===2 ? 22-wave : 24;
  rect(28,paw,8,6,ink); rect(29,paw,6,5,cream); rect(31,paw+4,1,1,shadow); rect(33,paw+4,1,1,shadow);
  if (pose===1 || pose===2) {
    const y = pose===1 ? 5 : 9;
    rect(37,y,1,5,gold); rect(35,y+2,5,1,gold);
  }
}
