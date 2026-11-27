"use strict";

const gameAudio = (() => {
  // Original sixteen-note phrases over four-bar progressions.
  const tracks = {
    home: {bpm:87, lead:"triangle", roots:[48,45,41,43], chords:[[60,64,67],[57,60,64],[57,60,65],[59,62,67]],
      melody:[[72,76,79,76,74,72,null,67],[69,72,76,72,71,69,null,64],[65,69,72,76,77,76,72,69],[67,71,74,79,77,74,71,null]]},
    play: {bpm:74, lead:"sine", roots:[50,46,53,48], chords:[[62,65,69],[58,62,65],[57,60,65],[60,64,67]],
      melody:[[69,null,74,72,69,null,65,67],[65,null,62,65,70,null,69,null],[72,69,65,null,69,72,77,null],[76,null,74,72,67,null,64,null]]},
    archive: {bpm:80, lead:"sine", roots:[45,48,43,41], chords:[[57,60,64],[60,64,67],[55,59,62],[57,60,65]],
      melody:[[76,null,72,null,69,72,null,76],[79,null,76,74,72,null,67,null],[74,null,71,null,67,71,null,74],[77,null,76,72,69,null,65,null]]},
    boss: {bpm:146,lead:"square",roots:[40,41,43,47],chords:[[52,55,59],[53,57,60],[55,58,62],[54,59,63]],
      melody:[[71,67,64,67,71,74,71,67],[72,69,65,69,72,76,72,69],[74,70,67,70,74,77,74,70],[75,71,66,71,75,78,75,71]]},
    run: {bpm:132, lead:"square", roots:[45,41,48,43], chords:[[57,60,64],[57,60,65],[60,64,67],[55,59,62]],
      melody:[[76,76,72,76,79,76,72,69],[77,77,72,77,81,77,72,69],[79,79,76,79,84,81,79,76],[74,74,71,74,79,77,74,71]]},
  };

  // Each cue has its own contour so it is recognizable while the music plays.
  const cues = {
    openingMagic:[[61,0,1.52,.045,"sine",81],[68,.13,1.30,.036,"sine",87],[81,.09,.58,.065,"sine"],
      [85,.23,.49,.055,"triangle"],[92,.38,.59,.048,"sine"],[88,.53,.69,.052,"sine"],
      [96,.72,.61,.051,"sine"],[100,.94,.47,.044,"sine"],[104,1.15,.62,.042,"sine"]],
    openingMagicBurst:[[47,0,.46,.13,"sine",33],[79,.015,.52,.083,"triangle"],
      [88,.035,.69,.077,"sine"],[91,.06,.76,.059,"sine"],[95,.20,.77,.041,"sine"],[100,.30,.69,.028,"sine"]],
    openingTurn:[[60,0,.42,.048,"sine",81],[80,.04,.27,.046,"triangle",58]],
    openingLine:[[57,0,.86,.09,"sine",77],[76,.16,.49,.058,"triangle",86]],
    openingRise:[[43,0,.72,.076,"sine",55],[64,.13,.53,.069,"triangle",74],[80,.25,.61,.041,"sine"]],
    openingWater:[[48,.02,1.13,.07,"sine",38],[74,.19,.54,.033,"triangle",64]],
    meteorFlight:[[63,0,.61,.11,"sine",84],[80,.25,.51,.11,"triangle",65],[91,.50,.57,.062,"sine",46]],
    click: [[76,0,.054,.085,"triangle"],[81,.03,.04,.055,"square"]],
    pin: [[69,0,.073,.11,"triangle"],[76,.055,.105,.10,"triangle"]],
    choice: [[67,0,.08,.10,"triangle"],[71,.06,.09,.09,"triangle"],[76,.115,.14,.075,"sine"]],
    countdown:[[74,0,.13,.093,"triangle"]],
    start: [[55,0,.09,.13,"triangle"],[62,.075,.09,.12,"square"],[67,.15,.18,.11,"triangle"]],
    pause: [[67,0,.10,.09,"triangle"],[62,.08,.13,.095,"triangle"]],
    slide: [[65,0,.14,.10,"triangle",44]],
    supply: [[66,0,.11,.095,"triangle"],[73,.08,.13,.1,"sine"],[81,.16,.20,.092,"triangle"]],
    jump: [[57,0,.115,.105,"triangle",72]],
    shift: [[60,0,.105,.14,"triangle"],[65,.07,.10,.13,"triangle"],[69,.14,.125,.13,"square"],[77,.23,.29,.125,"triangle"]],
    hit: [[47,0,.15,.20,"triangle",30],[39,.026,.13,.08,"square",29]],
    loss: [[62,.12,.15,.105,"triangle"],[57,.245,.18,.11,"triangle"],[50,.36,.31,.135,"sine"]],
    win: [[60,0,.13,.13,"square"],[64,.09,.12,.11,"triangle"],[67,.18,.14,.12,"square"],[72,.28,.30,.12,"triangle"],[64,.30,.28,.07,"sine"]],
    diamond:[[79,0,.15,.12,"triangle"],[86,.06,.18,.105,"sine"],[91,.13,.22,.095,"triangle"]],
    bossAlert:[[40,0,.28,.17,"square"],[47,.16,.33,.13,"triangle"],[40,.37,.3,.12,"square"]],
    bossRage:[[45,0,.36,.17,"square",29],[56,.18,.32,.12,"triangle",69]],
    wrench:[[58,0,.14,.14,"triangle",39]], survey:[[61,0,.21,.12,"triangle",78]],
    ram:[[39,0,.27,.17,"square",24],[47,.10,.15,.10,"triangle"]],
    drones:[[71,0,.09,.13,"triangle"],[76,.08,.13,.13,"triangle"],[81,.17,.18,.11,"triangle"]],
    blueprint:[[60,0,.33,.14,"square"],[67,.08,.33,.13,"triangle"],[76,.18,.44,.115,"triangle"]],
    finish: [[69,0,.12,.115,"triangle"],[65,.105,.13,.11,"triangle"],[67,.20,.24,.13,"sine"]],
  };
  const buttons=[...document.querySelectorAll("[data-audio-channel]")];
  const audioMenu=document.querySelector("#sound-settings");
  const audioStatus=document.querySelector("#audio-status");
  const options={music:true, effects:true};
  const key="build-shenzhen-audio";
  try {
    const saved=JSON.parse(localStorage.getItem(key));
    for (const channel of Object.keys(options)) {
      if (typeof saved?.[channel]==="boolean") options[channel]=saved[channel];
    }
  } catch {}
  const AudioEngine=window.AudioContext ?? window.webkitAudioContext;
  let context, musicBus, effectsBus, musicVoice, timer;
  let unlocked=false;
  let opening=false;
  const metalSamples=new Map();
  let song=null;
  let wanted="home";
  let stage=0;
  let nextBeat=0;
  let beat=0;

  function setLevel(node, volume, timeConstant=.04) {
    node.gain.cancelScheduledValues(context.currentTime);
    node.gain.setTargetAtTime(volume,context.currentTime,timeConstant);
  }

  function syncControls() {
    for (const button of buttons) {
      button.setAttribute("aria-pressed",String(options[button.dataset.audioChannel]));
    }
    audioMenu.dataset.muted=String(!options.music && !options.effects);
    audioStatus.textContent=t(!AudioEngine?"audioUnsupported":unlocked?"audioAdjust":"audioUnlock");
    if (!AudioEngine) buttons.forEach(button=>{button.disabled=true;});
  }

  function makeContext() {
    context=new AudioEngine();
    context.addEventListener("statechange",syncPlaybackState);
    musicBus=context.createGain();
    effectsBus=context.createGain();
    const master=context.createGain();
    master.gain.value=.72;
    musicBus.gain.value=options.music ? .46 : 0;
    effectsBus.gain.value=options.effects ? .58 : 0;
    const filter=context.createBiquadFilter();
    filter.type="lowpass";
    filter.frequency.value=3000;
    musicBus.connect(filter).connect(master);
    effectsBus.connect(master);
    const limiter=context.createDynamicsCompressor();
    limiter.threshold.value=-13;
    master.connect(limiter).connect(context.destination);
  }

  function enablePlayback() {
    if (!AudioEngine || unlocked || (!options.music && !options.effects)) return;
    try {
      if (!context) makeContext();
      if (context.state==="running") syncPlaybackState();
      else context.resume().then(syncPlaybackState).catch(()=>{});
    } catch {}
  }

  function syncPlaybackState() {
    const running=context?.state==="running";
    if (running===unlocked) return;
    unlocked=running;
    syncControls();
    syncTrack();
  }

  function unlock(event) {
    if (event?.isTrusted!==false) enablePlayback();
  }

  function setOpening(active) {
    if (opening===active) return;
    opening=active;
    if (active) enablePlayback();
    syncTrack();
  }

  function note(dest,midi,time,duration,volume,wave="triangle",end) {
    const oscillator=context.createOscillator();
    const envelope=context.createGain();
    const frequency=pitch=>440*2**((pitch-69)/12);
    oscillator.type=wave;
    oscillator.frequency.setValueAtTime(frequency(midi),time);
    if (end!==undefined) oscillator.frequency.exponentialRampToValueAtTime(frequency(end),time+duration*.82);
    envelope.gain.setValueAtTime(.0001,time);
    envelope.gain.linearRampToValueAtTime(volume,time+.012);
    envelope.gain.exponentialRampToValueAtTime(.0001,time+duration);
    oscillator.connect(envelope).connect(dest);
    oscillator.start(time);
    oscillator.stop(time+duration+.018);
  }

  function schedule() {
    if (!musicVoice || !song) return;
    const track=tracks[song];
    const now=context.currentTime;
    if (nextBeat<now-.22) nextBeat=now+.01;
    while (nextBeat<now+.115) {
      const eighth=30/(track.bpm+(song==="run"?stage*12:0));
      const bar=Math.floor(beat/8)%track.roots.length;
      const pos=beat%8;
      const playingRun=song==="run" || song==="boss";
      const lead=track.melody[bar][pos];
      if (lead!==null) note(musicVoice,lead,nextBeat,eighth*(playingRun ? .74 : 1.36),playingRun ? .046 : .073,track.lead);
      if (pos===0 || pos===4 || (playingRun && pos%2===0)) {
        note(musicVoice,track.roots[bar]-(playingRun && pos===4 ? 12 : 0),nextBeat,eighth*1.55,playingRun ? .105 : .09);
      }
      if (pos%2===1 || (!playingRun && pos===2)) {
        const chord=track.chords[bar];
        note(musicVoice,chord[Math.floor(pos/2)%3],nextBeat,eighth*1.32,.044,"sine");
      }
      if (playingRun && (pos%2===0 || stage>0)) {
        note(musicVoice,pos%4===0?43:83,nextBeat,.066,pos%4===0 ? .075 : .024,pos%4===0?"sine":"triangle",pos%4===0?27:56);
      }
      beat++;
      nextBeat+=eighth;
    }
  }

  function syncTrack() {
    if (!unlocked) return;
    const next=options.music && !document.hidden && !(opening && wanted==="home") ? wanted : null;
    if (song===next) return;
    if (timer!==undefined) clearInterval(timer);
    if (musicVoice) {
      const previous=musicVoice;
      setLevel(previous,0);
      window.setTimeout(()=>previous.disconnect(),230);
    }
    song=next;
    musicVoice=null;
    if (!song) return;
    musicVoice=context.createGain();
    musicVoice.gain.value=0;
    musicVoice.connect(musicBus);
    setLevel(musicVoice,1,.09);
    beat=0;
    nextBeat=context.currentTime+.055;
    timer=window.setInterval(schedule,42);
    schedule();
  }

  function route(screen, running=false, currentStage=0) {
    wanted=screen==="run" ? (running==="boss"?"boss":running?"run":null) : screen==="play" ? "play" : screen==="archive" ? "archive" : "home";
    stage=currentStage;
    syncTrack();
  }

  function air(dest,time,duration,level,from,to) {
    const sample=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate);
    const channel=sample.getChannelData(0);
    for(let i=0;i<channel.length;i++) channel[i]=(Math.random()-.5)*2;
    const source=context.createBufferSource();
    const filter=context.createBiquadFilter();
    const gain=context.createGain();
    filter.type="bandpass";
    filter.Q.value=.8;
    filter.frequency.setValueAtTime(from,time);
    filter.frequency.exponentialRampToValueAtTime(to,time+duration);
    gain.gain.setValueAtTime(.0001,time);
    gain.gain.linearRampToValueAtTime(level,time+duration*.24);
    gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
    source.buffer=sample;
    source.connect(filter).connect(gain).connect(dest);
    source.start(time);
  }

  // A short contact click excites several inharmonic modes in the metal.
  function metalImpact(name,time) {
    if (!metalSamples.has(name)) {
      const bounce=name==="openingTick";
      const soft=name==="openingFlip";
      const rate=context.sampleRate;
      const duration=bounce?.22:soft?.39:.44;
      const sample=context.createBuffer(1,Math.ceil(rate*duration),rate);
      const data=sample.getChannelData(0);
      const modes=soft
        ? [[2670,.28,15],[3581,.25,21],[4512,.13,31],[6217,.09,52],[7890,.05,67]]
        : [[1634,.13,22],[2824,.28,14],[3856,.26,24],[5291,.11,38],[7012,.07,59]];
      let smoothNoise=0;
      for(let i=0;i<data.length;i++){
        const t=i/rate;
        const attack=Math.min(1,t*2100);
        let ring=0;
        for(const [frequency,level,decay] of modes){
          if (frequency>=rate*.46) continue;
          ring+=level*Math.exp(-t*decay)*Math.sin(2*Math.PI*frequency*t);
        }
        const noise=Math.random()*2-1;
        smoothNoise=.72*smoothNoise+.28*noise;
        const transient=(noise-smoothNoise)*Math.exp(-t*(soft?660:405))*.44;
        const wood=soft||bounce?0:Math.sin(2*Math.PI*219*t)*Math.exp(-t*62)*.22;
        data[i]=(ring+transient+wood)*attack*Math.min(1,(duration-t)*125);
      }
      metalSamples.set(name,sample);
    }
    const strike=context.createBufferSource();
    const level=context.createGain();
    strike.buffer=metalSamples.get(name);
    strike.playbackRate.value=name==="openingTick"?1.09+Math.random()*.17:1;
    level.gain.value=name==="openingTick"?.38:.78;
    strike.connect(level).connect(effectsBus);
    strike.start(time);
  }

  function deskFoley(name,time) {
    switch (name) {
      case "desk:atlas":
        // Two creases open, then the sheet settles flat against the desk.
        air(effectsBus,time,.17,.32,2100,730);
        air(effectsBus,time+.17,.23,.37,1250,3250);
        air(effectsBus,time+.31,.12,.26,3050,1200);
        air(effectsBus,time+.53,.13,.28,620,190);
        return true;
      case "desk:transfer":
      case "bookPage":
        if (name==="desk:transfer") air(effectsBus,time,.1,.35,560,185);
        air(effectsBus,time+.04,.27,.38,1350,3100);
        air(effectsBus,time+.14,.16,.25,2300,1550);
        air(effectsBus,time+.24,.095,.25,2800,690);
        return true;
      case "desk:compare":
        air(effectsBus,time,.23,.28,760,1920);
        air(effectsBus,time+.1,.055,.3,3900,1450);
        note(effectsBus,95,time+.1,.12,.08,"sine");
        note(effectsBus,102,time+.103,.085,.04,"sine");
        return true;
      case "desk:budget": {
        metalImpact("openingTick",time+.035);
        metalImpact("openingTick",time+.125);
        // The switch and CRT hum begin as the scan line appears.
        const powerOn=time+.35;
        air(effectsBus,powerOn,.055,.43,2700,460);
        air(effectsBus,powerOn+.02,.39,.28,3400,910);
        note(effectsBus,35,powerOn,.3,.23,"triangle",31);
        note(effectsBus,84,powerOn+.03,.26,.065,"sine",106);
        return true;
      }
      case "mapTap":
      case "mapPin":
        air(effectsBus,time,.042,name==="mapPin"?.40:.29,3600,960);
        note(effectsBus,name==="mapPin"?55:47,time,.065,.12,"triangle",42);
        return true;
      default:
        return false;
    }
  }

  function effect(name, detail=1) {
    if (!unlocked || !options.effects || document.hidden) return;
    const now=context.currentTime+.012;
    if (deskFoley(name,now)) return;
    if (name==="openingFlip" || name==="openingLand" || name==="openingTick" || name==="harborCoin") {
      metalImpact(name==="harborCoin"?"openingFlip":name,now);
      if (name==="harborCoin") air(effectsBus,context.currentTime+.04,.65,.14,620,2190);
      return;
    }
    const sequence=name==="coin"
      ? [[72+(detail-1)*2,0,.085,.15,"square"],[84+(detail-1)*2,.045,.135,.115,"triangle"]]
      : cues[name];
    if (!sequence) return;
    if (name==="meteorFlight") air(effectsBus,now,.95,.23,520,2580);
    if (name==="openingWater") air(effectsBus,now,1.32,.25,840,279);
    if (name==="openingMagic") air(effectsBus,now,1.57,.18,575,3120);
    if (name==="openingMagicBurst") air(effectsBus,now,.74,.20,2530,440);
    if (name==="openingTurn") air(effectsBus,now,.42,.11,1560,520);
    sequence.forEach(([pitch,delay,length,volume,type,end])=>{
      const shift=name==="hit"?detail-1:0;
      note(effectsBus,pitch+shift,now+delay,length,volume,type,end===undefined?undefined:end+shift);
    });
  }

  buttons.forEach(button=>button.addEventListener("click",event=>{
    const channel=button.dataset.audioChannel;
    options[channel]=!options[channel];
    try { localStorage.setItem(key,JSON.stringify(options)); } catch {}
    unlock(event);
    if (context) setLevel(channel==="music"?musicBus:effectsBus,options[channel]?(channel==="music" ? .46 : .58):0);
    syncControls();
    syncTrack();
    if (channel==="effects" && options.effects) effect("click");
  }));

  document.addEventListener("pointerdown",unlock,{capture:true,passive:true});
  document.addEventListener("pointerup",unlock,{capture:true,passive:true});
  document.addEventListener("click",event=>{
    unlock(event);
    if (audioMenu.open && !audioMenu.contains(event.target)) audioMenu.open=false;
    const button=event.target.closest("button:not(:disabled), a.brand, summary");
    if (!button || button.closest("#sound-settings") || button.matches("[data-run-action], [data-record], [data-choice], [data-origin-choice], [data-book-turn], .desk-object, .harbor-coin")) return;
    effect("click");
  },true);
  document.addEventListener("keydown",event=>{
    if (event.key==="Enter" || event.key===" " || event.key==="ArrowUp") unlock(event);
    if (event.key==="Escape" && audioMenu.open) {
      audioMenu.open=false;
      audioMenu.querySelector("summary").focus();
    }
  },true);
  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden && opening) enablePlayback();
    syncTrack();
  });
  syncControls();
  return {route,effect,setOpening,refreshLabels:syncControls};
})();
