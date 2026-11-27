"use strict";

const sceneGoal=42;
const diamondValue=3;
const startingPace=112;
const cityGoals=[sceneGoal,sceneGoal*2,sceneGoal*3];
const supplies={
  shield:{color:"#477a9f",symbol:"S"}, revive:{color:"#a45d76",symbol:"+"},
  magnet:{color:"#925e9c",symbol:"M",seconds:6}, boots:{color:"#ac713a",symbol:">",seconds:2.2},
  materials:{color:"#577d55",symbol:"+4",coins:4}
};
const supplyKinds=["shield","magnet","revive","boots","materials"];
const hazards=[
  {half:5,bottom:0,height:8}, {half:5,bottom:0,height:10},
  {half:8,bottom:0,height:11}, {half:11,bottom:17,height:10},
  {half:8,bottom:18,height:8}
];

function difficulty(run,mode) {
  const time=run.elapsed/(mode==="level"?115:61);
  const score=run.coins/(mode==="level"?190:165);
  return Math.min(1,time*.62+score*.56);
}

function basePace(run,mode) {
  return startingPace+72*difficulty(run,mode);
}

function simulateMotion(run,mode,dt) {
  const factor=run.boots>0?1.22:run.slow>0?.72:1;
  const target=basePace(run,mode)*factor;
  // Ease toward the target in simulation time, including boot boosts and recovery.
  const response=run.slow>0 && run.boots<=0 ? .28 : .65;
  run.pace+=(target-run.pace)*(-Math.expm1(-dt/response));
  run.distance+=run.pace*dt;
  for (const clock of ["magnet","boots","grace","slow"]) run[clock]=Math.max(0,run[clock]-dt);
  simulateRunnerPose(run,dt);
}

function simulateRunnerPose(run,dt) {
  run.slide=Math.max(0,run.slide-dt);
  if (run.velocity!==0 || run.pixelY>0) {
    run.pixelY+=run.velocity*dt;
    run.velocity-=640*dt;
    if (run.pixelY<=0) {
      run.pixelY=0;
      run.velocity=0;
      run.jumps=0;
    }
  }
}

function runnerJump(run) {
  if (run.jumps>=2) return false;
  run.slide=0;
  run.velocity=run.jumps?179:206;
  run.jumps++;
  return true;
}

function runnerSlide(run) {
  if (run.pixelY>0 || run.jumps>0 || run.slide>0) return false;
  run.slide=.62;
  return true;
}

function routeTier(run,mode) {
  if (mode==="level") return run.stage>0 || run.coins>=19 || run.elapsed>=21 ? 1 : 0;
  if (run.coins>=62 || run.elapsed>=33) return 2;
  return run.coins>=22 || run.elapsed>=13 ? 1 : 0;
}

function buildRunSegment(run,mode,random=Math.random) {
  const x=run.spawnAt;
  const tier=routeTier(run,mode);
  const strength=difficulty(run,mode);
  const between=(min,max)=>Math.floor(min+random()*(max-min+1));
  const length=between(325,405)-Math.round(strength*66);
  const obstacle=between(97,139);
  const item=(offset,y,type,kind=0)=>({x:x+offset,y,type,kind,used:false});
  const hazardAt=offset=>{
    const roll=random();
    const kind=tier===2 && roll<.32 ? 4 : tier>0 && roll<.58 ? 3 : between(0,2);
    return {...item(offset,0,"hazard",kind),phase:random()*Math.PI*2};
  };
  const first=hazardAt(obstacle);
  const pattern=[first];
  if (length-obstacle>=160 && strength>.22 && random()<strength*.88) pattern.push(hazardAt(obstacle+132));
  // The wider approach gaps leave time to read the next obstacle and land.
  const level=mode==="level";
  const gemAt=level ? between(3,6) : -1;
  for (let at=between(1,7),index=0;at<length-17;at+=level?between(25,34):between(12,17),index++) {
    const nearby=pattern.find(entry=>entry.type==="hazard" && Math.abs(entry.x-x-at)<31);
    const height=nearby && nearby.kind<3 ? 25+Math.max(0,19-Math.round(Math.abs(nearby.x-x-at))) : 9;
    pattern.push(item(at,height,index===gemAt?"diamond":"coin"));
  }
  if (mode!=="level" && random()<.88) {
    const offset=between(34,obstacle-28);
    pattern.push(item(offset,11,"supply",supplyKinds[between(0,supplyKinds.length-1)]));
  }
  run.spawnAt+=length;
  return pattern.sort((a,b)=>a.x-b.x);
}

function hazardPosition(run,item) {
  const shape=hazards[item.kind];
  const x=item.x-run.distance;
  if (item.kind!==4) return {...shape,x};
  const wing=run.elapsed*7+item.phase;
  return {...shape,x:x+Math.sin(wing*.42)*12,bottom:shape.bottom+Math.sin(wing)*3};
}

function touchesHazard(run,item,runnerX) {
  const {x,half,bottom,height}=hazardPosition(run,item);
  const playerBottom=run.pixelY;
  const playerTop=playerBottom+(run.slide>0?12:24);
  return Math.abs(x-runnerX)<half+5 &&
    playerBottom<bottom+height-1 && playerTop>bottom+1;
}

function absorbHazard(run,mode) {
  if (run.boots>0 || run.grace>0) return null;
  if (run.shield) {
    run.shield=false;
    run.grace=.42;
    return "shieldUsed";
  }
  if (run.revive) {
    run.revive=false;
    run.grace=1.7;
    run.slow=.35;
    return "reviveUsed";
  }
  if (mode==="endless") return "loss";
  run.slow=.56;
  run.grace=.72;
  return "slow";
}

function collectSupply(run,kind) {
  if (kind==="shield" || kind==="revive") run[kind]=true;
  else if (supplies[kind].seconds) run[kind]=supplies[kind].seconds;
  return supplies[kind].coins??0;
}

function coinAward(run,mode,value) {
  const target=cityGoals[run.stage];
  const collected=mode==="level"?Math.min(value,target-run.coins):value;
  run.coins+=collected;
  return collected;
}
