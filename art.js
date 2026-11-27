"use strict";

function pixelScene(canvas, chapter = 3, night = false) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.setTransform(width / 480, 0, 0, height / 240, 0, 0);
  let seed = 28 + chapter * 71;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const box = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  const skies = [
    ["#698c99","#7da5a7","#9bb9ac","#baccae","#d0ccb0","#e4c79b","#f0d49c"],
    ["#6b8b9c","#819eab","#aab3ab","#c2b6a4","#d8b9a0","#e8bd96","#f0d49c"],
    ["#658c99","#7aa4a7","#9cbbb1","#afc3aa","#c8ccb0","#e4c595","#edcf9a"],
    ["#527888","#709aa2","#8cb3b1","#a8c2af","#c3c6a8","#d9bb8b","#efce91"]
  ];
  const tones = night ? ["#0f1c31","#12273d","#18384e","#285268","#426d74","#72908a","#ae9270"] : skies[chapter];
  const lights = [];
  for (let y = 0; y < 150; y++) {
    const n = y / 150 * (tones.length - 1);
    const left = tones[Math.floor(n)].match(/\w{2}/g).map(s => parseInt(s, 16));
    const right = tones[Math.ceil(n)].match(/\w{2}/g).map(s => parseInt(s, 16));
    const color = left.map((v, i) => Math.round(v + (right[i] - v) * (n % 1)));
    box(0, y, 480, 1, 'rgb(' + color.join(',') + ')');
  }
  for (let i = 0; !night && i < 49; i++) {
    const x = rand() * 490;
    const y = 10 + rand() * 111;
    if (i < 12) {
      box(x, y, 12 + rand() * 49, 2, "#9da99b37");
      box(x + 9, y + 2, 14 + rand() * 44, 1, "#e0cba143");
    } else {
      box(x, y, 1 + (i % 2), 1, "#ffdca657");
    }
  }
  const sunX = chapter === 3 ? 386 : 342;
  const sunY = night ? 53 : chapter === 1 ? 70 : 80;
  const radius = night ? 19 : 24;
  for (let y = -radius; y <= radius; y++) {
    const span = Math.floor(Math.sqrt(radius * radius - y * y));
    box(sunX - span, sunY + y, span * 2 + 1, 1, y < 10 ? "#ffe2a0" : (y % 4 ? "#f8ce8f" : "#dfaa75"));
  }
  if (night) {
    box(376, 46, 10, 4, "#e9bb84");
    box(380, 50, 7, 3, "#e9bb84");
    box(390, 59, 9, 3, "#edc590");
    box(395, 61, 3, 3, "#edc590");
  }
  const ridge = (floor, base, fill, shift) => {
    for (let x = 0; x < 480; x += 3) {
      const y = base + Math.sin((x + shift) / 21) * 11 + Math.sin((x + shift) / 53) * 13 + Math.cos((x + shift) / 8) * 2;
      box(x, y, 3, floor - y, fill);
    }
  };
  ridge(152, 116, night ? "#456975" : "#68878a", 33);
  ridge(155, 125, night ? "#2b5364" : "#436873", 89);
  ridge(156, 135, night ? "#213f50" : "#325766", 160);

  const tower = (x, y, w, h, color, side, light, columns = 3) => {
    box(x, y, w, h, color);
    box(x + w, y+3, Math.max(4,w/4), h - 3, side);
    box(x, y - 2, w + 2, 2, light);
    for (let yy = y + 5; yy < y + h - 3; yy += 5) {
      for (let xx = x + 3; xx < x + w - 2; xx += Math.max(3, (w - 4) / columns)) {
        const lit = rand() > .62;
        box(xx, yy, 2, 2, lit ? "#e9b879" : light);
        if (night && lit && lights.length % 4 === 0) lights.push([Math.round(xx),Math.round(yy)]);
        else if (night && lit) lights.push(null);
      }
    }
  };
  for (let x = -4; x < 482;) {
    const w = 5 + rand() * 14;
    const h = 5 + rand() * (chapter === 3 ? 31 : 21);
    tower(x, 151 - h, w, h, "#284856", "#31555c", "#4a6d70");
    x += w + 2;
  }
  box(0, 150, 480, 2, "#99a99a");
  for (let y = 153; y < 240; y++) {
    const water = night ? ["#3b6879","#32596b","#294858","#213e53","#182c43"] : ["#648f91","#578584","#477577","#3d656d","#34495b"];
    box(0, y, 480, 1, water[Math.min(4, Math.floor((y-153)/16))]);
  }
  for (let i = 0; i < 525; i++) {
    const y = 154 + rand() * 87;
    const x = rand()*480;
    const inLight = Math.abs(x - sunX) < (y - 140) * .49;
    box(x, y, 2 + rand() * ((y - 150) / 5 + 5), 1, inLight && i % 2 === 0 ? "#e5b77982" : (i % 3 ? "#84aca040" : "#75c7bd75"));
  }

  // A stepped shoreline carries the foreground city and construction sites.
  const shore = chapter === 0 ? 181 : 161;
  for (let x = 118; x < 480; x += 4) {
    const bank = shore + Math.floor(Math.sin(x / 33) * 11 + Math.cos(x / 78) * 10);
    box(x, 148, 4, bank - 148 + 27, "#213d46");
    box(x, bank + 27, 4, 3, "#536565");
    box(x, bank + 30, 4, 3, "#191f29");
  }
  for (let x = 134; x < 475; x += 24) {
    const y = shore + 10 + Math.floor(Math.sin(x / 33) * 11 + Math.cos(x / 78) * 10);
    box(x, y+12, 19, 2, "#9a894f");
    box(x+6, y+6, 19, 5, "#486961");
    box(x+6, y+4, 19, 2, "#9aa273");
    box(x+8, y+7, 5, 2, "#cbbb80");
  }
  const buildings = [[216,35,25],[249,42,17],[276,24,19],[302,51,26],[331,35,17],[353,28,20],[375,83,28],[407,39,18],[429,53,24],[459,31,19]];
  buildings.forEach(([x,h,w], index) => {
    if (chapter === 0 && index % 2 === 0) return;
    if (chapter === 1 && index > 4 && index < 8) return;
    if (chapter === 2 && index === 6) return;
    const base = shore + Math.floor(Math.sin(x / 33) * 11 + Math.cos(x / 78) * 10) + 11;
    const height = chapter === 0 ? h * .68 : h;
    tower(x, base - height, w, height, index % 2 ? "#25424d" : "#314e59", "#172f42", "#537781", 4);
    if (index === 6 || index === 9) {
      box(x + 4, base - height - 7, w - 8, 5, "#315661");
      box(x + w/2, base - height - 14, 2, 8, "#a6b797");
      box(x + 6, base - height - 7, w - 11, 1, "#e7a971");
    }
  });
  const crane = (x, y, reach) => {
    box(x, y, 3, 53, "#d59a62");
    box(x - 14, y + 4, reach + 14, 3, "#efb979");
    box(x - 12, y + 8, 11, 4, "#966947");
    box(x + reach - 3, y + 7, 1, 19, "#e6b88c");
    box(x + reach - 3, y + 26, 3, 2, "#efb979");
    for (let k = 0; k < 12; k++) box(x + k, y - k + 1, 2, 1, "#e8ac70");
    for (let k = 0; k < 12; k++) box(x + k+12, y + k - 10, 2, 1, "#e8ac70");
  };
  crane(chapter === 3 ? 344 : 313, chapter === 0 ? 126 : 95, 34);
  if (chapter > 0) crane(449, 111, 24);
  const boat = (x,y,w) => {
    box(x-13,y+9,w+37,1,"#8cbaaf");
    box(x-3,y+7,w+9,2,"#162c38");
    box(x,y+3,w,4,"#b08564");
    box(x+4,y,w-9,4,"#b0b6a0");
    box(x+6,y+1,4,2,"#426771");
    box(x+w/2,y-4,1,5,"#c2cfb6");
  };
  if (night) return lights.filter(Boolean);
  boat(329, 215, 23);
  boat(444, 200, 16);
}

function pixelMap(canvas, stop, layer) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let seed = 88;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const mainland = [[0,0],[420,0],[420,139],[388,132],[366,117],[332,111],[317,103],[292,113],[274,125],[249,131],[233,141],[204,137],[192,147],[175,150],[151,143],[139,149],[132,166],[111,174],[86,145],[58,139],[38,122],[0,116]];
  const hk = [[420,160],[397,164],[373,152],[345,142],[319,134],[303,145],[282,154],[255,157],[229,171],[199,165],[173,176],[158,197],[180,220],[191,245],[229,248],[251,261],[274,248],[315,257],[337,246],[369,259],[393,250],[420,262]];
  const hkIsland = [[327,270],[346,267],[365,275],[388,269],[408,276],[402,289],[381,303],[357,292],[335,294],[321,284]];
  const islands = [mainland,hk,hkIsland,[[92,229],[119,228],[137,241],[148,257],[141,272],[104,277],[76,266],[64,247]],[[43,178],[60,184],[64,206],[47,214],[34,204]]];
  const path = (points, close = false) => {
    ctx.beginPath();
    points.forEach(([x,y],i)=> i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    if (close) ctx.closePath();
  };
  const sea=ctx.createLinearGradient(0,0,width,height);
  sea.addColorStop(0,"#729da0");
  sea.addColorStop(.68,"#477388");
  sea.addColorStop(1,"#335267");
  ctx.fillStyle=sea;
  ctx.fillRect(0,0,width,height);
  for (let i=0;i<590;i++){
    const x=random()*width|0,y=random()*height|0;
    ctx.fillStyle=i%4===0?"#c5ddce66":"#afcfca32";
    ctx.fillRect(x,y,2+(random()*8|0),1);
  }
  for(const [x,y] of [[24,151],[116,199],[70,285],[236,284],[296,273],[417,151]]){
    ctx.fillStyle="#16485a";
    ctx.fillRect(x-7,y+2,14,2);
    ctx.fillStyle="#dac298";
    ctx.fillRect(x-5,y,11,3);
    ctx.fillStyle="#f1e6c8";
    ctx.fillRect(x-1,y-4,5,4);
    ctx.fillStyle="#355c68";
    ctx.fillRect(x+1,y-3,2,1);
    ctx.fillStyle="#abc6bd80";
    ctx.fillRect(x-11,y+6,16,1);
  }

  islands.forEach((land,index) => {
    path(land,true);
    ctx.fillStyle = index === 0 ? "#a4bda0" : "#a6bb9e";
    ctx.fill();
    ctx.strokeStyle="#b3d3c3";
    ctx.lineWidth=4;
    ctx.stroke();
    ctx.strokeStyle="#e4d8ac";
    ctx.lineWidth=1.35;
    ctx.stroke();
    ctx.save();
    ctx.clip();
    const shades=["#7ba88d60","#629b8a5e","#ccceaa70","#57858140"];
    for(let i=0;i<380;i++){
      ctx.fillStyle=shades[i%4];
      ctx.fillRect(random()*420|0,random()*306|0,3+random()*12|0,2+random()*8|0);
    }
    const hills=index===0?[[75,41,36],[118,57,29],[187,61,31],[252,33,35],[334,34,21],[391,123,33]]:
      [[180,199,25],[224,226,28],[260,174,18],[355,166,29],[400,204,27]];
    for(const [x,y,size] of hills){
      for(let ridge=0;ridge<5;ridge++){
        const r=size-ridge*5;
        if(r<3) continue;
        path([[x-r,y+4],[x-r*.55,y-r*.27],[x-r*.22,y-r*.20],[x+r*.06,y-r*.60],[x+r*.30,y-r*.39],[x+r*.62,y-r*.24],[x+r,y+4]],true);
        ctx.fillStyle=["#779e84","#729681","#688e7b","#618677","#578071"][ridge];
        ctx.fill();
        ctx.strokeStyle="#e0dbc048";
        ctx.lineWidth=.65;
        ctx.stroke();
      }
    }
    for(let i=0;i<130;i++){
      const x=random()*width|0,y=random()*height|0;
      ctx.fillStyle="#577f6e";
      ctx.fillRect(x+2,y+4,1,3);
      ctx.fillStyle=i%4===0?"#aaba82":"#4b8d79";
      ctx.fillRect(x+1,y,3,2);
      ctx.fillRect(x,y+2,5,2);
    }
    const roads=index===0?[
      [[9,92],[97,102],[158,94],[195,100],[237,87],[300,91],[349,66],[420,64]],
      [[48,41],[99,57],[157,56],[204,68],[244,56],[330,47],[389,55]],
      [[131,141],[161,95],[154,54],[185,28],[290,24],[357,34],[394,0]],
      [[262,132],[276,104],[276,68],[297,53],[299,0]],
      [[39,5],[40,37],[73,57],[84,101],[116,127]]
    ]:[
      [[183,195],[233,196],[264,176],[313,176],[353,188],[389,181],[420,192]],
      [[208,223],[260,222],[317,199],[362,210],[415,211]],
      [[329,153],[311,175],[310,208],[339,243],[369,248]],
      [[255,183],[275,209],[278,240]]
    ];
    roads.forEach((road,i)=>{
      path(road);
      ctx.strokeStyle=i===0?"#f1e2b9":"#d3dec1";
      ctx.lineWidth=i===0?2:1;
      ctx.stroke();
    });
    ctx.restore();
  });
  ctx.fillStyle = "#1c30441f";
  for (let x=0;x<width;x+=21) ctx.fillRect(x,0,1,height);
  for (let y=0;y<height;y+=18) ctx.fillRect(0,y,width,1);

  // The skyline and civic landmarks are illustrative, not a survey of individual buildings.
  const districts = [
    [74,130,0],[106,119,0],[164,101,1],[202,98,1],[305,81,1],[340,67,1],
    [298,106,3],[327,94,3],[359,93,3],[246,79,4],[202,118,5],[241,113,5],
    [270,226,0],[306,242,0],[326,243,0],[369,234,0],[359,284,0]
  ];
  districts.forEach(([x,y,year],index)=>{
    if(year>stop) return;
    for(let i=0;i<3;i++){
      const left=x+i*7;
      const h=8+(index*3+i*7)%17;
      const w=6+(index+i)%4;
      ctx.fillStyle="#25445560";
      ctx.fillRect(left+3,y-1,w+3,4);
      ctx.fillStyle=i%2===0?"#456d6b":"#507278";
      ctx.fillRect(left+2,y-h+1,w,h);
      ctx.fillStyle=layer==="economy" && index<12?"#d6b47b":i%2===0?"#e5d6a8":"#a6bfb4";
      ctx.fillRect(left,y-h,w,h);
      ctx.fillStyle="#f0e2ba";
      ctx.fillRect(left+1,y-h-2,w-2,2);
      for(let row=3;row<h-1;row+=4){
        ctx.fillStyle=row%3===0?"#456774":"#729489";
        ctx.fillRect(left+1,y-h+row,w-3,1);
      }
    }
  });

  for(const [x,y] of [[130,131],[184,137],[259,121],[386,116],[335,225],[219,235]]){
    ctx.fillStyle="#456b6780";ctx.fillRect(x+3,y,17,3);
    ctx.fillStyle="#e5d4a8";ctx.fillRect(x,y-7,15,8);
    ctx.fillStyle="#5f8883";ctx.fillRect(x-2,y-9,19,2);
    ctx.fillStyle="#345768";ctx.fillRect(x+2,y-5,3,3);ctx.fillRect(x+8,y-5,4,3);
    ctx.fillStyle="#eabf86";ctx.fillRect(x+6,y-12,5,3);
  }

}
