"use strict";

const runStages = [
  {sky:["#80a6a5","#ead1a0"], far:"#769391", near:"#617d73", ground:"#94795a", road:"#ba9c72", lane:"#e7cd9d",
    en:{place:"Early worksite", upgrade:"Roads and utilities", next:"Public revenue pays for roads and utility connections."},
    zh:{place:"早期工地", upgrade:"道路与管网", next:"把公共收入投入道路和管网建设。"}},
  {sky:["#88b9b1","#e4ddae"], far:"#629388", near:"#3e6e70", ground:"#54646a", road:"#7a8c87", lane:"#eee1a7",
    en:{place:"Industrial district", upgrade:"Sites ready for investment", next:"Serviced land gives new businesses a place to build."},
    zh:{place:"工业片区", upgrade:"可供投资的新地块", next:"道路和管网接通后，企业有了可以投资开发的新地块。"}},
  {sky:["#a2b6c1","#f1c795"], far:"#6c8797", near:"#3f647c", ground:"#424f60", road:"#6e7b8a", lane:"#f1ddad",
    en:{place:"New urban district", upgrade:"Parks and public facilities", next:"Planning reserves space for facilities residents need."},
    zh:{place:"城市新区", upgrade:"公园与公共设施", next:"通过城市规划，为居民需要的公共设施留出空间。"}}
];

const runnerCanvas = document.querySelector("#runner-art");
const runCtx = runnerCanvas.getContext("2d");
const runnerPage = document.querySelector("#run");
const runnerOverlay = document.querySelector("#runner-overlay");
const overlayCopy = document.querySelector("#runner-overlay-copy");
const overlayActions = document.querySelector("#runner-overlay-actions");
const eventNote = document.querySelector("#runner-event");
const ledger = document.querySelector("#runner-ledger");
const runJump = runnerPage.querySelector('[data-run-action="jump"]');
const runSlide = runnerPage.querySelector('[data-run-action="slide"]');
const inventory = document.querySelector("#runner-inventory");
const manual = document.querySelector("#runner-manual");
const runPause = runnerPage.querySelector('[data-run-action="pause"]');
const runnerWidth = runnerCanvas.width;
const runnerHeight = runnerCanvas.height;
const ground = 157;
const runnerX = 66;
const stageArt = runStages.map(buildStageArt);
const avatarOptions=document.querySelector("#avatar-options");
const avatarPreview=document.querySelector("#avatar-preview");
const look={hair:0,face:0,clothes:0};
const avatarNames={
  en:{hair:["Midnight bob","Slate crop","Chestnut bun","Honey fringe","Side part","Crew cut","Swept pompadour"],face:["Bright eyes","Glasses","Smile","Calm eyes","Stubble","Short beard"],clothes:["Workwear","Blue blazer","Brick jacket","Field vest","Engineer jacket","Canvas overalls"]},
  zh:{hair:["墨黑短发","石板蓝短发","栗色发髻","蜂蜜色刘海","侧分短发","板寸","上梳短发"],face:["明亮眼睛","圆框眼镜","微笑","沉静眼睛","淡胡茬","短胡须"],clothes:["青绿工装","蓝色外套","砖红夹克","勘测马甲","工程夹克","帆布背带裤"]}
};
try {
  const saved=JSON.parse(localStorage.getItem("build-shenzhen-runner-look"));
  for (const part of Object.keys(look)) {
    if (Number.isInteger(saved?.[part]) && saved[part]>=0 && saved[part]<avatarNames.en[part].length) look[part]=saved[part];
  }
} catch {}
let spriteFrames=makeRunnerSprites(look);
const modeButtons=[...runnerPage.querySelectorAll("[data-run-mode]")];
const runFinish=runnerPage.querySelector('[data-run-action="finish"]');
const clock=document.querySelector("#runner-clock");
const clockValue=document.querySelector("#runner-clock-value");
const timedLimit=60;
const revealDuration=3.1;
const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)");
const brief=document.querySelector("#runner-brief");
const confetti=document.querySelector("#runner-confetti");
const bossHud=document.querySelector("#boss-hud");
const bossControls=document.querySelector("#boss-controls");
const attackLabels={
  wrench:["bossWrench","bossMelee"], survey:["bossSurvey","bossRanged"],
  ram:["bossRam","bossMeleeSpecial"], drones:["bossDrones","bossRangedSpecial"],
  blueprint:["bossBlueprint","bossUltimate"]
};
const sessions={level:freshRun(),timed:freshRun(),endless:freshRun()};
let mode="level";
let run=sessions[mode];

function rect(ctx,x,y,w,h,color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
}

function artLayer() {
  const canvas = document.createElement("canvas");
  canvas.width = runnerWidth;
  canvas.height = runnerHeight;
  return canvas;
}

function buildStageArt(stage,index) {
  const sky = artLayer();
  const skyCtx = sky.getContext("2d");
  const gradient = skyCtx.createLinearGradient(0,10,0,150);
  stage.sky.forEach((color,i)=>gradient.addColorStop(i,color));
  skyCtx.fillStyle=gradient;
  skyCtx.fillRect(0,0,runnerWidth,runnerHeight);
  for (let y=-22;y<=22;y++) {
    const half = Math.floor(Math.sqrt(22**2-y**2));
    rect(skyCtx,292-half,46+y,half*2+1,1,y>13 ? "#f0d290" : "#f8e4ab");
  }
  for (let i=0;i<10;i++) {
    const x = (i*67+18)%388;
    const y = (i*29+11)%75;
    rect(skyCtx,x,y,23+i%5*5,2,"#fbecd099");
    rect(skyCtx,x+7,y-2,14+i%4*3,2,"#fbecd068");
  }

  const hills = artLayer();
  const hr = hills.getContext("2d");
  for(let x=0;x<runnerWidth;x+=2) {
    const position=x/runnerWidth*Math.PI*2;
    const high=113+Math.sin(position*2)*11+Math.sin(position*5)*4;
    rect(hr,x,high,2,ground-high,stage.far);
  }

  const blocks = artLayer();
  const b = blocks.getContext("2d");
  for(let x=0,i=0;x<runnerWidth;x+=32,i++) {
    const height=10+(i*19+index*13)%(index===0 ? 18 : (index===1 ? 42 : 70));
    const base=ground-4;
    const top=base-height;
    const w=22+(i%3)*3;
    rect(b,x,top,w,height,stage.near);
    rect(b,x+w-3,top,3,height,"#253f4b70");
    rect(b,x-1,top-2,w+2,2,index===0 ? "#8a755d" : "#d3c49d");
    for(let y=top+5;y<base-3;y+=6) {
      for(let dx=4;dx<w-4;dx+=6) {
        rect(b,x+dx,y,2,2,(dx+y+i)%4===0 ? "#edc78d" : "#a7bbbb");
      }
    }
    if (index===0 && i%3===1) {
      rect(b,x+7,top-19,2,19,"#556963");
      rect(b,x+3,top-18,13,2,"#d3a367");
    }
    if (index===1 && i%3===0) {
      rect(b,x+10,top-16,6,17,"#567980");
      rect(b,x+9,top-17,8,2,"#bd916e");
    }
    if (index===2 && i%3===1) {
      rect(b,x+7,top-6,11,6,"#647f98");
      rect(b,x+12,top-15,1,10,"#eee0b8");
    }
    if (index===2 && i%3===0) {
      rect(b,x+29,base-10,2,12,"#6d5946");
      rect(b,x+26,base-15,8,8,"#79a480");
      rect(b,x+27,base-17,6,5,"#94b48c");
    }
  }
  return [sky,hills,blocks];
}

function freshRun() {
  return {status:"ready",stage:0,coins:0,distance:0,pace:startingPace,spawnAt:120,objects:[],pixelY:0,velocity:0,slow:0,jumps:0,slide:0,shield:false,revive:false,magnet:0,boots:0,grace:0,
    timestamp:0,elapsed:0,frame:0,flash:0,coinFlash:0,coinValue:0,noticeKey:null,noticeTime:0,hit:false,bossSeen:false,boss:null,revealTime:0};
}

function runText(index) {
  return runStages[index][language];
}

function updateClock() {
  if (mode==="level") return;
  const time=mode==="timed" ? Math.max(0,Math.ceil(timedLimit-run.elapsed)) : Math.floor(run.elapsed);
  const formatted=Math.floor(time/60)+":"+String(time%60).padStart(2,"0");
  if (clockValue.textContent!==formatted) clockValue.textContent=formatted;
}

function sceneIndex() {
  return mode==="level"?run.stage:1;
}

function updatePace() {
  const display=(run.pace/startingPace).toFixed(2)+"×";
  const value=document.querySelector("#runner-speed");
  if (value.textContent!==display) value.textContent=display;
}

function paintInventory() {
  const active=["shield","revive","magnet","boots"].filter(key=>run[key]);
  const html=active.map(key=>{
    const time=typeof run[key]==="number"?" · "+Math.ceil(run[key])+"s":"";
    return '<span style="--power:'+supplies[key].color+'">'+t(key)+time+'</span>';
  }).join("") || '<small>'+t("noSupplies")+'</small>';
  if (inventory.innerHTML!==html) inventory.innerHTML=html;
}

function renderAvatar() {
  avatarOptions.innerHTML="";
  for (const part of Object.keys(look)) {
    const group=document.createElement("fieldset");
    const label=document.createElement("legend");
    label.textContent=t(part);
    group.append(label);
    const choices=document.createElement("div");
    choices.className="avatar-choices";
    avatarNames[language][part].forEach((name,index)=>{
      const option=document.createElement("button");
      option.type="button";
      option.dataset.avatarPart=part;
      option.dataset.avatarValue=index;
      option.title=name;
      option.setAttribute("aria-label",name);
      option.setAttribute("aria-pressed",String(look[part]===index));
      const sample=document.createElement("canvas");
      sample.width=spriteSize;
      sample.height=spriteSize;
      sample.setAttribute("aria-hidden","true");
      paintPerson(sample.getContext("2d"),{...look,[part]:index});
      option.append(sample);
      const caption=document.createElement('span');
      caption.textContent=name;
      option.append(caption);
      choices.append(option);
    });
    group.append(choices);
    avatarOptions.append(group);
  }
  paintPerson(avatarPreview.getContext("2d"),look);
}

function syncRunnerHud() {
  document.querySelector("#runner-phase").textContent = mode==="level" ? t("phase")+" "+(run.stage+1)+"/"+runStages.length : t(mode==="timed"?"modeTimed":"modeEndless");
  document.querySelector("#runner-place").textContent = runText(sceneIndex()).place;
  document.querySelector("#runner-coins").textContent = mode==="level" ? (run.coins-run.stage*sceneGoal)+" / "+sceneGoal : String(run.coins);
  document.querySelector("#runner-coins-label").textContent=t(mode==="level"?"stageCoins":"coins");
  updatePace();
  inventory.hidden=mode==="level";
  paintInventory();
  clock.hidden=mode==="level";
  document.querySelector("#runner-clock-label").textContent=t(mode==="timed"?"timeLeft":"elapsed");
  updateClock();
  [...ledger.children].forEach((item,index)=>{
    const funded = run.coins >= cityGoals[index];
    item.dataset.funded = String(funded);
    item.querySelector(".ledger-status").textContent = funded ? t("funded") : t("upcoming");
    item.querySelector(".ledger-fill").style.width = Math.max(0,Math.min(100,(run.coins-index*sceneGoal) / sceneGoal * 100)) + "%";
  });
  runnerPage.dataset.stage = run.stage;
  runnerPage.dataset.scene = sceneIndex();
  runnerPage.dataset.status = run.status;
  runnerPage.dataset.mode = mode;
}

function isActive(status) {
  return status==="playing" || status==="boss-fight";
}

function renderBrief() {
  const goal={level:"briefLevel",timed:"briefTimed",endless:"briefEndless"};
  brief.hidden=run.status!=="ready";
  if (brief.hidden) return;
  brief.innerHTML='<h2 id="runner-brief-title">'+t("beforeRun")+'</h2><p>'+t(goal[mode])+
    '</p><p>'+t(mode==="level"?"briefLevelMoves":"briefMoves")+' '+t("briefDifficulty")+'</p><p class="runner-keys">'+t("briefKeys")+'</p>';
}

function renderBossPanel() {
  const status=run.status;
  const briefing=status==="boss-ready";
  const fighting=status==="boss-fight" || status==="boss-paused";
  bossControls.hidden=!(briefing || fighting);
  bossHud.hidden=!fighting;
  if (bossControls.hidden) return;
  const tiles=Object.entries(bossMoves).map(([kind,move])=>{
    const [name,category]=attackLabels[kind];
    const content='<kbd>'+move.key+'</kbd><strong>'+t(name)+'</strong><small>'+t(category)+
      (move.cost?' · '+move.cost:'')+'</small>';
    return briefing?'<li>'+content+'</li>':
      '<li><button type="button" class="secondary" data-run-action="attack-'+kind+'">'+content+'</button></li>';
  }).join("");
  bossControls.innerHTML=(briefing?'<h3 tabindex="-1">'+t("bossName")+'</h3><p>'+t("bossGuide")+'</p><p>'+t("bossDodge")+'</p>':'')+
    '<p>'+t("bossCharge")+'</p><ul class="boss-moves">'+tiles+'</ul>'+
    (briefing?'<button type="button" class="primary" data-run-action="boss-start">'+t("bossStart")+'</button>':'');
  if (!fighting) return;
  const meter=(key,label,max)=>'<label for="boss-'+key+'">'+t(label)+'<meter id="boss-'+key+'" min="0" max="'+max+'"></meter><span></span></label>';
  bossHud.innerHTML='<strong id="boss-phase" role="status"></strong><div class="boss-meters">'+meter("hp","bossName",bossHealth)+
    meter("player","bossPlayer",100)+meter("energy","bossEnergy",100)+'</div>';
  updateBossPanel();
}

function updateBossPanel() {
  const boss=run.boss;
  const phase=bossHud.querySelector("#boss-phase");
  const phaseText=t(boss.phase===1?"bossPhase":"bossRage");
  if (phase.textContent!==phaseText) phase.textContent=phaseText;
  for (const key of ["hp","player","energy"]) {
    const meter=bossHud.querySelector("#boss-"+key);
    if (meter.value!==boss[key]) meter.value=boss[key];
    const label=Math.ceil(boss[key]/meter.max*100)+"%";
    if (meter.nextElementSibling.textContent!==label) meter.nextElementSibling.textContent=label;
  }
  for (const button of bossControls.querySelectorAll("button")) {
    const move=bossMoves[button.dataset.runAction.slice(7)];
    button.setAttribute("aria-disabled",String(run.status!=="boss-fight" || boss.rage>0 || boss.recovery>0 || boss.energy<(move.cost||0)));
  }
  const attacks={ground:"bossGround",crane:"bossCrane",freight:"bossFreight"};
  const hint=boss.rage>0 ? t("bossEnraging") :
    boss.pattern && (boss.warning>0 || boss.waves.length || boss.launches.length) ? t(attacks[boss.pattern]) : "";
  if (eventNote.textContent!==hint) eventNote.textContent=hint;
}

function runnerOverlayContent() {
  const {status} = run;
  const moving = isActive(status);
  runnerOverlay.hidden = moving;
  runJump.disabled = !moving;
  runSlide.disabled = !moving;
  runPause.disabled = !moving;
  runFinish.hidden = mode!=="endless" || status!=="playing";
  renderBrief();
  renderBossPanel();
  document.querySelector("#runner-help").textContent=t(status.startsWith("boss-")?"briefKeys":mode==="endless"?"runHelpEndless":"runHelp");
  if (moving) return;
  if(status==="countdown"){
    const {title,copy}=roundIntroductions[mode];
    overlayCopy.innerHTML='<p class="eyebrow">'+t(title)+'</p><h2>'+t(copy)+'</h2>'+
      '<output class="runner-count" aria-live="polite" aria-atomic="true">'+countdownValue+'</output>';
    overlayActions.hidden=true;
    return;
  }
  const finishTitle={level:"runWin",timed:"timeUp",endless:"runEnded"};
  const result=t("resultCoins")+" · "+run.coins+(mode==="endless"?" · "+t("elapsed")+" "+scoreTime(run.elapsed):"");
  const configuration = {
    ready:["runReady","","runStart","start"],
    paused:["runPaused",t("runPausedText"),"runResume","resume"],
    intermission:["stageClear",runText(run.stage).next,"nextStage","next-stage"],
    "boss-reveal":["bossReveal",t("bossRevealText"),"skipReveal","skip-reveal"],
    "boss-ready":["bossReady",t("bossIntro")],
    "boss-paused":["bossPaused","","bossResume","boss-resume"],
    "boss-victory":["bossWin",t("bossWinText"),"bossContinue","boss-continue"],
    complete:[run.hit || run.bossLost ? "hitTitle" : finishTitle[mode], mode==="level" ? t("runWinText") :
      (run.bossLost ? t("bossLoss")+" " : run.hit ? t("hitCopy")+" " : "")+result,"runRestart","start"]
  };
  const [title,copy,label,action] = configuration[status];
  overlayCopy.innerHTML = (status==="complete" && run.newRecord?'<p class="runner-record-banner">'+t("runnerNewRecord")+'</p>':"") +
    "<h2>" + t(title) + "</h2>" + (copy?"<p>"+copy+"</p>":"");
  overlayActions.innerHTML = (action?'<button class="primary" type="button" data-run-action="' + action + '">' + t(label) + '</button>':"") +
    (status === "complete" ? [
      mode!=="level"?'<button class="secondary" type="button" data-run-action="scores">'+t("runnerScores")+'</button>':"",
      '<button class="secondary" type="button" data-run-action="explore-modes">' +t("exploreModes")+'</button>',
      '<button class="secondary" type="button" data-go="archive">'+t("backStoryMap")+'</button>',
      '<button class="secondary" type="button" data-go="home">'+t("backHome")+'</button>'
    ].join("") : "");
  overlayActions.hidden=!action;
}

function celebrateRun() {
  const colors=["#fff4bf","#f6b35f","#6ed5bd","#e4837f","#c5c7f7"];
  confetti.replaceChildren(...Array.from({length:54},(_,index)=>{
    const piece=document.createElement("span");
    piece.style.setProperty("--x",((index*29)%98+1)+"%");
    piece.style.setProperty("--y",((index*23)%79+8)+"%");
    piece.style.setProperty("--swing",((index*13)%101-50)+"px");
    piece.style.setProperty("--spin",((index*73)%1080-540)+"deg");
    piece.style.setProperty("--delay",(index%9*.065)+"s");
    piece.style.setProperty("--color",colors[index%colors.length]);
    return piece;
  }));
}

const runnerLobby=document.querySelector("#runner-lobby");
const runnerGame=document.querySelector("#runner-game");
const runnerSetup=document.querySelector("#runner-setup");
let setupStep="";
let setupStartsRun=false;
let runnerIntroduced=false;
try { runnerIntroduced=localStorage.getItem("build-shenzhen-runner-introduced")==="yes"; } catch {}

function showRunSetup(step,startsRun=false) {
  setupStep=step;
  setupStartsRun=startsRun;
  renderRunSetup();
  if(!runnerSetup.open) runnerSetup.showModal();
  document.querySelector("#runner-setup-title").focus();
}

function renderRunSetup() {
  if(!setupStep) return;
  const avatar=setupStep==="avatar";
  document.querySelector("#runner-setup-title").textContent=t(avatar?"avatar":"runnerTutorial");
  document.querySelector("#runner-setup-step").textContent=setupStartsRun?t(avatar?"runnerStep1":"runnerStep2"):"";
  document.querySelector("#runner-setup-avatar").hidden=!avatar;
  const guide=document.querySelector("#runner-setup-guide");
  guide.hidden=avatar;
  runnerSetup.querySelector(".runner-setup-next").textContent=t(avatar && setupStartsRun?"runnerGuideNext":
    setupStartsRun?"runnerStartGame":"runnerDone");
  if(avatar) return;
  const goal={level:"briefLevel",timed:"briefTimed",endless:"briefEndless"};
  const hazardsCopy=["runnerCrate","runnerCone","runnerRoadblock","runnerBeam","runnerBird"];
  guide.innerHTML='<p class="runner-guide-goal">'+t(goal[mode])+'</p>'+
    '<div class="runner-guide-moves"><article><kbd>⎵ / ↑</kbd><h3>'+t("jump")+'</h3><p>'+t("runnerLearnJump")+
    '</p></article><article><kbd>↓ / S</kbd><h3>'+t("slide")+'</h3><p>'+t("runnerLearnSlide")+'</p></article></div>'+
    '<h3>'+t("runnerHazards")+'</h3><ul class="runner-hazards">'+hazardsCopy.map((key,index)=>
      '<li><canvas aria-hidden="true" width="26" height="24" data-hazard-icon="'+index+'"></canvas><span>'+t(key)+'</span></li>').join("")+
    '</ul><p class="runner-guide-tip">'+t("runnerEasterHint")+'</p>';
  guide.querySelectorAll("[data-hazard-icon]").forEach(canvas=>{
    const ctx=canvas.getContext("2d");
    paintRunHazard((dx,y,w,h,color)=>rect(ctx,13+dx,y,w,h,color),Number(canvas.dataset.hazardIcon),19,1,0);
  });
}

const roundIntroductions={
  level:{title:"modeLevel",copy:"runnerCountdownLevel"},
  timed:{title:"modeTimed",copy:"runnerCountdownTimed"},
  endless:{title:"modeEndless",copy:"runnerCountdownEndless"}
};
let countdownValue=3;
let countdownEnds=0;

function enterRunnerCountdown() {
  confetti.replaceChildren();
  countdownValue=3;
  countdownEnds=performance.now()+3000;
  setRunState("countdown");
  gameAudio.effect("countdown");
}

function openRunnerArena() {
  runnerLobby.hidden=true;
  runnerGame.hidden=false;
  if(run.status==="ready" || run.status==="complete"){
    run=sessions[mode]=freshRun();
    showRunner();
    enterRunnerCountdown();
  }else if(run.status==="paused"){
    enterRunnerCountdown();
  }
  focusArena();
}

function openRunnerLobby() {
  leaveRunner();
  runnerLobby.hidden=false;
  runnerGame.hidden=true;
  window.scrollTo(0,0);
  document.querySelector("#runner-lobby h1").focus({preventScroll:true});
}

runnerSetup.addEventListener("close",()=>{
  if(runnerSetup.open) return;
  setupStep="";
  setupStartsRun=false;
});

function showRunner() {
  renderAvatar();
  renderRunSetup();
  modeButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.runMode===mode)));
  ledger.hidden=mode!=="level";
  manual.closest("details").hidden=mode==="level";
  manual.innerHTML=["moves",...Object.keys(supplies)].map(key=>"<div><dt>"+t(key)+"</dt><dd>"+t(key+"About")+"</dd></div>").join("");
  ledger.innerHTML = runStages.map((stage,index)=>'<li><div class="ledger-title"><strong>' + runText(index).upgrade + '</strong><span>' +
    sceneGoal + '</span></div><div class="ledger-meter" aria-hidden="true"><span class="ledger-fill"></span></div>' +
    '<div class="ledger-status"></div></li>').join("");
  syncRunnerHud();
  renderNotice();
  runnerOverlayContent();
  paintRunner();
}

function setRunState(status) {
  cancelAnimationFrame(run.frame);
  run.status = status;
  gameAudio.route("run",status==="boss-fight"?"boss":status==="playing",run.stage);
  run.timestamp = 0;
  runnerPage.dataset.status=status;
  runnerOverlayContent();
  if (isActive(status) || status==="boss-reveal" || status==="countdown") run.frame = requestAnimationFrame(tick);
  else paintRunner();
}

function resetRunnerEntrance() {
  leaveRunner();
  if(runnerSetup.open) runnerSetup.close();
  if(scoreDialog.open) scoreDialog.close();
  runnerLobby.hidden=false;
  runnerGame.hidden=true;
}

function leaveRunner() {
  if (run.status === "playing" || run.status === "countdown") setRunState("paused");
  else if (run.status === "boss-fight") setRunState("boss-paused");
  else if (run.status === "boss-reveal") setRunState("boss-ready");
}

function completeRun() {
  if(run.status==="complete") return;
  saveRunnerScore();
  run.noticeKey=null;
  renderNotice();
  setRunState("complete");
  if ((mode==="level" || run.newRecord) && !reducedMotion.matches) celebrateRun();
  gameAudio.effect(run.newRecord || mode==="level" ? "win" : run.hit || run.bossLost ? "loss" : "finish");
  runnerOverlay.querySelector("button").focus({preventScroll:true});
}

function setNotice(key, seconds, funded = null) {
  run.noticeKey=key;
  run.noticeTime=seconds;
  run.lastFunded=funded;
  renderNotice();
}

function renderNotice() {
  if (!run.noticeKey) {
    eventNote.textContent="";
    return;
  }
  const label=t(run.noticeKey);
  eventNote.textContent=run.lastFunded===null ? label : label+" · "+runText(run.lastFunded).upgrade+" — "+runText(run.lastFunded).next;
}

function jumpRunner() {
  if (isActive(run.status) && runnerJump(run)) gameAudio.effect("jump");
}

function slideRunner() {
  if (isActive(run.status) && runnerSlide(run)) gameAudio.effect("slide");
}

function enterNextDistrict() {
  run.stage++;
  Object.assign(run,{distance:0,spawnAt:120,objects:[],pixelY:0,velocity:0,jumps:0,slide:0,slow:0,grace:0,flash:.46});
  setNotice("invested",2.8,run.stage-1);
  syncRunnerHud();
  setRunState("playing");
  gameAudio.effect("shift");
}

function collectCoin(value,kind="coin") {
  run.coinValue=coinAward(run,mode,value);
  run.coinKind=kind;
  gameAudio.effect(kind==="diamond"?"diamond":"coin");
  run.coinFlash=.32;
  syncRunnerHud();
  if (mode==="endless" && !run.bossSeen && run.coins>=bossUnlock) {
    run.bossSeen=true;
    run.boss=makeBoss();
    run.noticeKey=null;
    run.coinFlash=0;
    renderNotice();
    run.revealTime=0;
    setRunState("boss-reveal");
    gameAudio.effect("bossAlert");
    runnerOverlay.querySelector("button").focus({preventScroll:true});
  }
  if (mode==="level" && run.coins===cityGoals[run.stage]) {
    if (run.stage===runStages.length-1) completeRun();
    else {
      run.noticeKey=null;
      renderNotice();
      setRunState("intermission");
      gameAudio.effect("shift");
      runnerOverlay.querySelector("button").focus({preventScroll:true});
    }
  }
}

function updateRun(delta) {
  simulateMotion(run,mode,delta);
  run.flash=Math.max(0,run.flash-delta);
  run.coinFlash=Math.max(0,run.coinFlash-delta);
  if (run.noticeTime>0) {
    run.noticeTime-=delta;
    if (run.noticeTime<=0) {
      run.noticeKey=null;
      renderNotice();
    }
  }
  while (run.spawnAt < run.distance+runnerWidth+30) run.objects.push(...buildRunSegment(run,mode));
  for (const item of run.objects) {
    if (item.used) continue;
    const dx=item.x-run.distance-runnerX;
    const dy=item.y-run.pixelY-(run.slide>0?7:12);
    if (item.type==="hazard") {
      if (!touchesHazard(run,item,runnerX)) continue;
      item.used=true;
      const outcome=absorbHazard(run,mode);
      if (!outcome) continue;
      gameAudio.effect("hit",item.kind+1);
      if (outcome==="loss") {
        run.hit=true;
        completeRun();
        break;
      }
      setNotice(outcome,1.5);
    } else if ((Math.abs(dx)<10 && Math.abs(dy)<14) ||
      (item.type==="coin" && run.magnet>0 && dx>-15 && dx<69 && Math.abs(dy)<58)) {
      item.used=true;
      if (item.type==="coin" || item.type==="diamond") collectCoin(item.type==="diamond"?diamondValue:1,item.type);
      else {
        const bonus=collectSupply(run,item.kind);
        gameAudio.effect("supply");
        if (bonus) collectCoin(bonus);
        if (run.status==="playing") setNotice(item.kind,1.45);
      }
      if (run.status!=="playing") break;
    }
  }
  run.objects=run.objects.filter(item=>!item.used && item.x-run.distance>-20);
}

function drawRunCharacter(offset=0) {
  const x=runnerX+offset;
  const movingPose=Math.floor(run.distance/8)%2===0 ? 0 : 2;
  const frame=run.status==="ready" || run.status.startsWith("boss-") || run.pixelY>1 ? 1 : movingPose;
  const sprite=spriteFrames[mode==="level" ? run.stage : 0][frame];
  runCtx.imageSmoothingEnabled=false;
  const sliding=run.slide>0;
  const size=sliding?17:31;
  if(!run.status.startsWith("boss-") && (run.shield || run.boots>0 || run.grace>0)) {
    const color=run.boots>0?"#f6ca72":run.shield?"#76b7cf":"#e3f3d4";
    rect(runCtx,x-17,ground-size-run.pixelY-2,34,2,color);
    rect(runCtx,x-18,ground-size-run.pixelY+1,2,size-4,color);
    rect(runCtx,x+16,ground-size-run.pixelY+1,2,size-4,color);
  }
  runCtx.drawImage(sprite,x-16,Math.round(ground-size+1-run.pixelY),32,size);
  if (sliding || run.boots>0) rect(runCtx,x-27,ground-3,10,2,"#f3e5b9");
}

function paintRunHazard(paint,kind,ground,phase,bottom=hazards[kind].bottom) {
  const {half,height}=hazards[kind];
  const top=ground-bottom-height;
  if (kind===3) {
    paint(0,top-21,2,14,"#324859");
    paint(-7,top-8,2,8,"#324859");
    paint(6,top-8,2,8,"#324859");
    paint(-7,top-8,15,2,"#324859");
    paint(-half,top,half*2,height,"#274052");
    paint(-half+1,top+1,half*2-2,2,"#e8b975");
    paint(-half+3,top+4,half*2-6,2,"#819aa2");
    paint(-half+1,top+7,half*2-2,2,"#b87d4d");
  } else if (kind===4) {
    const wing=Math.sin(phase)>0?-5:2;
    paint(-5,top+3,12,4,"#25394b");
    paint(-3,top+4,8,2,"#a9b8b8");
    paint(-9,top+2,5,4,"#f4eecc");
    paint(-7,top+2,1,1,"#263647");
    paint(-11,top+4,2,1,"#d28f46");
    paint(-2,top+wing+3,7,3,"#526577");
    paint(2,top+wing+1,5,2,"#354c60");
  } else if (kind===1) {
    paint(-6,ground-2,12,2,"#4d4444");
    paint(-4,ground-6,8,4,"#d97b4d");
    paint(-2,top,4,4,"#f0c981");
  } else {
    paint(-half,top,half*2,height,kind===0?"#82594a":"#3c5360");
    paint(-half+1,top+1,half*2-2,3,"#e8be7f");
    paint(-2,top+3,2,height-3,"#a5774c");
  }
}

function drawRunObject(item) {
  if (item.type==="hazard") {
    const {x,bottom}=hazardPosition(run,item);
    const paint=(dx,y,w,h,fill)=>rect(runCtx,x+dx,y,w,h,fill);
    paintRunHazard(paint,item.kind,ground,run.elapsed*17+item.phase,bottom);
    return;
  }
  const x=item.x-run.distance;
  const paint=(dx,y,w,h,fill)=>rect(runCtx,x+dx,y,w,h,fill);
  const y=ground-item.y;
  if (item.type==="supply") {
    const power=supplies[item.kind];
    paint(-8,y-8,16,15,"#f3e5bf");
    paint(-7,y-7,14,13,power.color);
    runCtx.font="bold 8px monospace";
    runCtx.fillStyle="#fff9e8";
    runCtx.textAlign="center";
    runCtx.fillText(power.symbol,Math.round(x),Math.round(y+2));
    runCtx.textAlign="start";
    return;
  }
  if (item.type==="diamond") {
    paint(-6,y-4,12,5,"#1d4563");
    paint(-4,y-6,8,2,"#1d4563");
    for (let step=0;step<6;step++) paint(-5+step,y+step,11-2*step,1,"#1d4563");
    paint(-3,y-5,6,2,"#8be9f0");
    paint(-5,y-3,10,3,"#61cddd");
    paint(-3,y,6,2,"#4a95c2");
    paint(-1,y+2,2,2,"#a7f4ed");
    paint(-2,y-4,2,4,"#f0fff0");
    return;
  }
  paint(-3,y-5,6,10,"#a76a42");paint(-5,y-3,10,6,"#a76a42");
  paint(-3,y-4,6,8,"#ffd17a");paint(-4,y-2,8,4,"#ffd17a");paint(-1,y-3,2,6,"#fff0ae");
}

function drawBossArena() {
  const boss=run.boss;
  const reveal=run.status==="boss-reveal";
  const progress=reducedMotion.matches?1:Math.min(1,Math.max(0,(run.revealTime-.45)/1.65));
  const x=bossOrigin+(reveal?150*(1-progress)**2:0);
  const color=boss.flash>0?"#fff3c3":boss.phase===2?"#d67a56":"#e6b268";
  const outline="#233749";
  rect(runCtx,0,ground-1,runnerWidth,2,"#e4c586");
  for (let tile=12;tile<runnerWidth;tile+=16) rect(runCtx,tile,ground+18,8,2,"#503e31");
  rect(runCtx,x-43,ground-13,86,13,outline);
  rect(runCtx,x-35,ground-10,70,7,"#687a83");
  for (let t=-32;t<36;t+=12) rect(runCtx,x+t,ground-10,5,7,"#364c5a");
  rect(runCtx,x-29,ground-56,56,44,outline);
  rect(runCtx,x-25,ground-52,48,36,color);
  rect(runCtx,x-25,ground-27,48,10,"#9a634e");
  rect(runCtx,x-16,ground-72,43,27,outline);
  rect(runCtx,x-12,ground-68,35,14,"#456372");
  rect(runCtx,x-7,ground-64,22,4,boss.phase===2?"#ff9a7b":"#c6ebe1");
  rect(runCtx,x+23,ground-45,20,12,outline);
  rect(runCtx,x+29,ground-46,11,5,color);
  rect(runCtx,x+36,ground-75,5,33,outline);
  rect(runCtx,x+11,ground-78,30,5,outline);
  rect(runCtx,x+12,ground-77,24,3,color);
  rect(runCtx,x+11,ground-73,2,12,outline);
  rect(runCtx,x+8,ground-63,7,3,color);
  for (let i=-19;i<20;i+=11) rect(runCtx,x+i,ground-23,5,5,"#273d4f");

  if (boss.warning>0) {
    const high=boss.pattern==="crane";
    rect(runCtx,runnerX+17,ground-(high?25:6),x-runnerX-40,2,"#ffdd9b");
    if (boss.pattern==="freight") rect(runCtx,runnerX+17,ground-25,x-runnerX-40,2,"#ffdd9b");
    rect(runCtx,x-30,ground-90,54,4,"#314656");
    rect(runCtx,x-30,ground-90,54*(boss.warning/(boss.phase===1?.9:.57)),4,"#ffdb8d");
  }
  for (const wave of boss.waves) {
    const y=ground-(wave.high?25:9);
    rect(runCtx,wave.x-10,y,21,8,outline);
    rect(runCtx,wave.x-12,y+2,22,4,wave.high?"#dc855e":"#fec870");
    rect(runCtx,wave.x-7,y,6,2,"#fff0be");
  }
  for (const launch of boss.launches) {
    if (!launch.high) continue;
    rect(runCtx,x-40,ground-25,16,2,"#ffd484");
  }
  const move=bossMoves[boss.move];
  const motion=boss.moveTime>0 && move;
  const lunge=bossLunge(boss);
  drawRunCharacter(lunge);
  if (reveal) {
    rect(runCtx,0,0,runnerWidth,12,"#172b3b");
    rect(runCtx,0,runnerHeight-12,runnerWidth,12,"#172b3b");
    for (let index=0;index<7;index++) {
      const offset=progress*50;
      const dot=x-45-index*4-offset;
      rect(runCtx,dot,ground-4-index%3*3,3+index%3,2,"#edc889");
    }
  }
  if (motion) {
    const progress=1-boss.moveTime/(move.recovery*.82);
    const position=runnerX+lunge;
    const fly=runnerX+22+(x-runnerX-26)*Math.min(1,progress*1.6);
    const y=ground-25-run.pixelY;
    if (move.reach) {
      rect(runCtx,position+10,y-8,23,5,move.color);
      rect(runCtx,position+25,y-15,6,15,move.color);
    } else if (boss.move==="blueprint") {
      const height=24+progress*76;
      rect(runCtx,x-58,ground-height,112,2,move.color);
      rect(runCtx,x-58,ground-height,2,height,move.color);
      rect(runCtx,x+52,ground-height,2,height,move.color);
      rect(runCtx,x-83,ground-height*.72,154,2,move.color);
    } else {
      rect(runCtx,fly-11,y,20,3,move.color);
      if (boss.move==="drones") {
        rect(runCtx,fly-24,y-10,19,3,move.color);
        rect(runCtx,fly-14,y+8,16,3,move.color);
      }
    }
  }
}

function finishReveal() {
  const focused=runnerOverlay.contains(document.activeElement);
  setRunState("boss-ready");
  if (focused) bossControls.querySelector("h3").focus();
}

function startBoss() {
  Object.assign(run,{slide:0,pixelY:0,velocity:0,jumps:0,flash:.3});
  setRunState("boss-fight");
  gameAudio.effect("start");
  focusArena();
}

function useBossMove(kind) {
  if (run.status!=="boss-fight") return;
  const phase=run.boss.phase;
  if (!attackBoss(run.boss,kind)) return;
  gameAudio.effect(phase!==run.boss.phase?"bossRage":kind);
  if (run.boss.hp===0) {
    eventNote.textContent="";
    setRunState("boss-victory");
    gameAudio.effect("win");
    runnerOverlay.querySelector("button").focus({preventScroll:true});
  } else updateBossPanel();
}

function continueEndless() {
  Object.assign(run,{spawnAt:run.distance+120,objects:[],slide:0,pixelY:0,velocity:0,jumps:0,grace:2.1,flash:.42});
  setRunState("playing");
  gameAudio.effect("start");
  focusArena();
}

function focusArena() {
  const field=runnerPage.querySelector(".runner-frame");
  field.focus({preventScroll:true});
  if (field.getBoundingClientRect().top<0 || field.querySelector("canvas").getBoundingClientRect().bottom>innerHeight) {
    field.scrollIntoView({block:"start"});
  }
}

function paintRunner() {
  const stage = runStages[sceneIndex()];
  const [sky,hills,blocks]=stageArt[sceneIndex()];
  runCtx.drawImage(sky,0,0);
  [[hills,.15],[blocks,.5]].forEach(([layer,pace])=>{
    const offset=Math.round(run.distance*pace)%runnerWidth;
    runCtx.drawImage(layer,-offset,0);
    runCtx.drawImage(layer,runnerWidth-offset,0);
  });
  rect(runCtx,0,ground,runnerWidth,40,stage.ground);
  rect(runCtx,0,ground+3,runnerWidth,22,stage.road);
  for(let x=-(Math.round(run.distance)%29);x<runnerWidth;x+=29) {
    rect(runCtx,x,ground+16,13,2,stage.lane);
    rect(runCtx,x+7,ground+28,8,2,"#1c304426");
  }
  if (run.status.startsWith("boss-")) drawBossArena();
  else {
    run.objects.forEach(drawRunObject);
    drawRunCharacter();
  }
  if (run.coinFlash>0) {
    runCtx.font="bold 10px monospace";
    runCtx.fillStyle=run.coinKind==="diamond"?"#175e7b":"#20354a";
    runCtx.fillText("+"+run.coinValue,runnerX+13,ground-33-run.pixelY);
  }
  if(run.flash>0 && !reducedMotion.matches) {
    rect(runCtx,0,0,runnerWidth,runnerHeight,"rgba(255,235,174,"+(run.flash*.34)+")");
  }
}

function tick(timestamp) {
  if(run.status==="countdown"){
    const remaining=Math.ceil((countdownEnds-timestamp)/1000);
    if(remaining<=0){
      setRunState("playing");
      gameAudio.effect("start");
      return;
    }
    if(remaining!==countdownValue){
      countdownValue=remaining;
      runnerOverlay.querySelector(".runner-count").textContent=remaining;
      gameAudio.effect("countdown");
    }
    run.frame=requestAnimationFrame(tick);
    return;
  }
  if (!isActive(run.status) && run.status!=="boss-reveal") return;
  const realTime=run.timestamp ? Math.max(0,(timestamp-run.timestamp)/1000) : 0;
  const remaining=mode==="timed"?timedLimit-run.elapsed:Infinity;
  let elapsed=Math.min(.3,realTime,remaining);
  run.timestamp=timestamp;
  if (run.status==="boss-reveal") {
    run.revealTime+=elapsed;
    if (run.revealTime>=revealDuration) finishReveal();
    else {
      paintRunner();
      run.frame=requestAnimationFrame(tick);
    }
    return;
  }
  if (run.status==="boss-fight") {
    while (elapsed>0) {
      const delta=Math.min(.025,elapsed);
      if (updateBoss(run.boss,run,delta,runnerX)) gameAudio.effect("hit");
      if (!run.boss.player) {
        run.bossLost=true;
        completeRun();
        return;
      }
      elapsed-=delta;
    }
    run.flash=Math.max(0,run.flash-realTime);
    updateBossPanel();
    paintRunner();
    run.frame=requestAnimationFrame(tick);
    return;
  }
  run.elapsed+=Math.min(realTime,remaining);
  while (elapsed>0 && run.status==="playing") {
    const delta=Math.min(.025,elapsed);
    updateRun(delta);
    elapsed-=delta;
  }
  if (run.status==="playing") {
    updateClock();
    paintInventory();
    updatePace();
    if (mode==="timed" && run.elapsed>=timedLimit) completeRun();
    else run.frame=requestAnimationFrame(tick);
  }
  paintRunner();
}

avatarOptions.addEventListener("click",event=>{
  const option=event.target.closest("[data-avatar-part]");
  if (!option) return;
  const part=option.dataset.avatarPart;
  look[part]=Number(option.dataset.avatarValue);
  try { localStorage.setItem("build-shenzhen-runner-look",JSON.stringify(look)); } catch {}
  spriteFrames=makeRunnerSprites(look);
  renderAvatar();
  avatarOptions.querySelector('[data-avatar-part="'+part+'"][data-avatar-value="'+look[part]+'"]').focus({preventScroll:true});
  paintRunner();
});

runnerPage.addEventListener("click",event=>{
  const option=event.target.closest("[data-run-mode]");
  if (option) {
    const selected=option.dataset.runMode;
    if (selected!==mode) {
      leaveRunner();
      mode=selected;
      run=sessions[mode];
      showRunner();
    }
    return;
  }
  const button=event.target.closest("[data-run-action]");
  if (!button) return;
  const action=button.dataset.runAction;
  if(action==="lobby-start"){
    if(runnerIntroduced) openRunnerArena();
    else showRunSetup("avatar",true);
  }else if(action==="scores"){
    renderRunnerScores();
    if(!scoreDialog.open) scoreDialog.showModal();
  }else if(action==="scores-close"){
    scoreDialog.close();
  }else if(action==="avatar" || action==="tutorial"){
    showRunSetup(action);
  }else if(action==="setup-close"){
    runnerSetup.close();
  }else if(action==="setup-next"){
    if(setupStep==="avatar" && setupStartsRun) showRunSetup("tutorial",true);
    else{
      const start=setupStartsRun;
      runnerSetup.close();
      if(start){
        runnerIntroduced=true;
        try { localStorage.setItem("build-shenzhen-runner-introduced","yes"); } catch {}
        openRunnerArena();
      }
    }
  }else if (action.startsWith("attack-")) {
    useBossMove(action.slice(7));
  } else if (action==="skip-reveal") {
    finishReveal();
  } else if (action==="explore-modes") {
    openRunnerLobby();
    gameAudio.effect("click");
  } else if (action==="boss-start") {
    startBoss();
  } else if (action==="boss-resume") {
    setRunState("boss-fight");
    focusArena();
  } else if (action==="boss-continue") {
    continueEndless();
  } else if (action==="jump") {
    jumpRunner();
  } else if (action==="slide") {
    slideRunner();
  } else if (action==="next-stage") {
    enterNextDistrict();
    focusArena();
  } else if (action==="finish") {
    completeRun();
  } else if (action==="pause") {
    leaveRunner();
    gameAudio.effect("pause");
    runnerOverlay.querySelector("button").focus({preventScroll:true});
  } else if (action==="start") {
    openRunnerArena();
  } else if (action==="resume") {
    enterRunnerCountdown();
    focusArena();
  }
});

document.addEventListener("keydown",event=>{
  if (runnerPage.hidden || !isActive(run.status) || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
  if (run.status==="boss-fight") {
    const attack=Object.keys(bossMoves).find(kind=>bossMoves[kind].key===event.key.toUpperCase());
    if (attack) {
      event.preventDefault();
      useBossMove(attack);
      return;
    }
  }
  const sliding=event.key==="ArrowDown" || event.key.toLowerCase()==="s";
  if (!sliding && event.key!==" " && event.key!=="ArrowUp") return;
  if (event.key===" " && event.target.closest("a,button")) return;
  event.preventDefault();
  if (sliding) slideRunner();
  else jumpRunner();
});

document.addEventListener("visibilitychange",()=>{
  if (document.hidden) leaveRunner();
});

const scoreDialog=document.querySelector("#runner-scores");
const scoreStorageKey="build-shenzhen-runner-scores";
const runnerScores={timed:[],endless:[]};
try {
  const stored=JSON.parse(localStorage.getItem(scoreStorageKey));
  for(const key of Object.keys(runnerScores)){
    if(Array.isArray(stored?.[key])) runnerScores[key]=stored[key].filter(score=>
      score && Number.isFinite(score.coins) && Number.isFinite(score.seconds) && score.coins>=0 && score.seconds>=0);
  }
} catch {}

function scoreTime(seconds) {
  const tenths=Math.floor(seconds*10);
  return Math.floor(tenths/600)+":"+String(Math.floor(tenths/10)%60).padStart(2,"0")+"."+tenths%10;
}

function compareRunnerScores(key,a,b) {
  return b.coins-a.coins || (key==="endless"?b.seconds-a.seconds:0);
}

function saveRunnerScore() {
  if(mode==="level") return;
  const scores=runnerScores[mode];
  const score={coins:run.coins,seconds:Math.floor(run.elapsed*10)/10};
  const previous=scores[0];
  run.newRecord=Boolean(previous && compareRunnerScores(mode,score,previous)<0);
  scores.push(score);
  scores.sort((a,b)=>compareRunnerScores(mode,a,b));
  try { localStorage.setItem(scoreStorageKey,JSON.stringify(runnerScores)); } catch {}
}

function renderRunnerScores() {
  document.querySelector("#runner-score-tables").innerHTML=["timed","endless"].map(key=>{
    const time=key==="endless";
    const scores=runnerScores[key];
    return '<section><h3>'+t(time?"modeEndless":"modeTimed")+'</h3>'+
      (scores.length?'<table><thead><tr><th scope="col">'+t("runnerScoreRank")+'</th><th scope="col">'+t("coins")+
      '</th>'+(time?'<th scope="col">'+t("elapsed")+'</th>':"")+'</tr></thead><tbody>'+
      scores.map((score,index)=>'<tr><th scope="row">'+(index+1)+'</th><td>'+score.coins+'</td>'+
        (time?'<td>'+scoreTime(score.seconds)+'</td>':"")+'</tr>').join("")+'</tbody></table>':
      '<p>'+t("runnerScoreEmpty")+'</p>')+'</section>';
  }).join("");
}
