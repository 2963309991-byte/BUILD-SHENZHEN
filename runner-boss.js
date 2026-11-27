"use strict";

const bossUnlock=321;
const bossHealth=240;
const bossMoves={
  wrench:{key:"J",damage:10,charge:16,recovery:.44,color:"#f4c572",reach:192},
  survey:{key:"K",damage:8,charge:13,recovery:.42,color:"#8fe3eb",reach:0},
  ram:{key:"U",damage:32,cost:28,recovery:.8,color:"#ffac6d",reach:198},
  drones:{key:"I",damage:42,cost:38,recovery:.9,color:"#a4ebad",reach:0},
  blueprint:{key:"L",damage:72,cost:100,recovery:1.15,color:"#ffeb9e",reach:0}
};
const bossPatterns={
  ground:[{high:false,delay:0}],
  crane:[{high:true,delay:0}],
  freight:[{high:false,delay:0},{high:true,delay:.76}]
};
const bossOrigin=296;

function makeBoss() {
  return {hp:bossHealth,player:100,energy:0,phase:1,delay:1.1,pattern:null,last:null,
    warning:0,launches:[],waves:[],recovery:0,grace:0,move:null,moveTime:0,flash:0,rage:0};
}

function attackBoss(boss,kind) {
  const move=bossMoves[kind];
  if (!move || boss.recovery>0 || boss.rage>0 || boss.energy<(move.cost||0)) return false;
  boss.recovery=move.recovery;
  boss.move=kind;
  boss.moveTime=move.recovery*.82;
  boss.energy=Math.min(100,boss.energy+(move.charge||0)-(move.cost||0));
  boss.hp=Math.max(0,boss.hp-move.damage);
  boss.flash=.22;
  if (boss.phase===1 && boss.hp<=bossHealth*.2) {
    boss.hp=bossHealth*.2;
    boss.phase=2;
    boss.rage=1.45;
    boss.delay=.32;
    boss.warning=0;
    boss.pattern=null;
    boss.launches=[];
    boss.waves=[];
  }
  return true;
}

function bossLunge(boss) {
  const move=bossMoves[boss.move];
  return boss.moveTime>0 && move.reach
    ? Math.sin(boss.moveTime/(move.recovery*.82)*Math.PI)*move.reach : 0;
}

function updateBoss(boss,run,dt,playerX,random=Math.random) {
  const previousX=playerX+bossLunge(boss);
  simulateRunnerPose(run,dt);
  for (const timer of ["recovery","moveTime","grace","flash","rage"]) boss[timer]=Math.max(0,boss[timer]-dt);
  if (boss.rage>0) return false;

  if (boss.warning>0) {
    boss.warning=Math.max(0,boss.warning-dt);
    if (!boss.warning) {
      boss.launches=bossPatterns[boss.pattern].map(shot=>({...shot}));
      boss.delay=boss.phase===1?2.0:1.68;
    }
  } else {
    boss.delay-=dt;
    if (boss.delay<=0) {
      const available=Object.keys(bossPatterns).filter(key=>key!==boss.last);
      boss.pattern=available[Math.floor(random()*available.length)];
      boss.last=boss.pattern;
      boss.warning=boss.phase===1?.9:.57;
    }
  }

  for (const launch of boss.launches) {
    launch.delay-=dt;
    if (launch.delay<=0) boss.waves.push({x:bossOrigin-21,high:launch.high});
  }
  boss.launches=boss.launches.filter(launch=>launch.delay>0);

  const currentX=playerX+bossLunge(boss);
  let hit=false;
  for (const wave of boss.waves) {
    const before=wave.x-previousX;
    wave.x-=dt*(boss.phase===1?196:240);
    const low=wave.high?16:0;
    const top=run.pixelY+(run.slide>0?11:24);
    const after=wave.x-currentX;
    if (Math.min(before,after)<13 && Math.max(before,after)>-13 && run.pixelY<low+11 && top>low) {
      wave.hit=true;
      if (!boss.grace) {
        boss.grace=.48;
        boss.player=Math.max(0,boss.player-(boss.phase===1?15:24));
        hit=true;
      }
    }
  }
  boss.waves=boss.waves.filter(wave=>!wave.hit && wave.x>-18);
  return hit;
}
