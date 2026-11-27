"use strict";

const originsPage=document.querySelector("#play");
const originText=pair=>pair[language==="zh"?1:0];
const originLabels={
  opening:["Your assignment","你的任务"],fiction:["Fictional dialogue","虚构人物对话"], decision:["Hypothetical decision","假设情境 · 玩家选择"],
  reaction:["Character reaction","角色回应"], reveal:["Historical reveal","历史揭晓"], analysis:["Analytical interpretation","分析解读"],
  begin:["Open the planning file","打开规划档案"], next:["Continue","继续"], back:["Previous","上一段"],
  retry:["Replay chapter","重玩本章"], skip:["Skip read dialogue","跳过已读对话"], nextChapter:["Next chapter","下一章"],
  evidence:["Check the evidence","查阅史料"], archive:["View in Story Map","在故事地图查看"],
  end:["Your next stop: the research desk","下一站：研究书桌"], endNote:["You have explored how Shenzhen selected and adapted external planning practices. Now visit the research desk to uncover the historical evidence, compare the planning systems, and explore their economic effects.","你已经探索了深圳如何选择并改造外部城市规划经验。现在前往研究书桌，通过历史档案、制度比较与经济模拟，进一步理解这段文明互鉴的历程。"],
  simulation:["Educational simulation · schematic blocks","教学模拟 · 概念地块"], compare:["Compare the three plans","对照三个规划方案"],
  replay:["Play from the beginning","从头重玩"], decisionChoice:["Your choice","你的选择"]
};
const originLabel=id=>originText(originLabels[id]);
const originsState={chapter:-1,cursor:0,answers:Array(5).fill(null),read:Array(5).fill(-1),reached:0};
const originsArchive=new Set();

const originsPlans=[
  {name:["High-value sites","高价值优先"], uses:["industry","homes","shops","shops","industry","homes","shops","empty","homes","shops","industry","homes"],
    roads:[[0,50,88,50],[88,50,88,91],[88,50,181,50],[225,0,225,50],[225,50,352,50]],
    summary:["The riverfront fills with high-value projects. Freight and housing share a corridor. The plan leaves no designated school or park site.","滨水地段集中建设高价值项目。货运与住宅共用一条通道。图上未预留学校或公园。"]},
  {name:["Coordinated plan","统筹规划"],uses:["industry","industry","shops","homes","park","shops","school","homes","park","shops","homes","homes"],
    roads:[[0,50,352,50],[0,100,352,100],[88,0,88,147],[176,0,176,147],[264,0,264,147]],
    summary:["A connected network serves the districts. Industry has access from the west. The school and park sit near homes, with shop sites along the main road.","连续道路连接各区，工业区可从西侧进出。学校、公园靠近住房，商铺沿主路布置。"]},
  {name:["Project by project","逐项目审批"],uses:["industry","shops","homes","industry","homes","empty","shops","homes","industry","homes","empty","shops"],
    roads:[[0,50,88,50],[88,50,88,82],[176,32,176,91],[218,100,293,100],[264,105,264,145],[307,50,352,50]],
    summary:["Some projects get access roads quickly. Several roads stop at plot boundaries and no connected site is reserved for a school or park.","部分项目很快有了进出道路，但多条路在地块边界中断，也没有为学校和公园预留连通的用地。"]}
];
const planUses={
  industry:[["Industry","工业"],"#8f6757","▥"],homes:[["Housing","住宅"],"#496b8b","⌂"],shops:[["Commerce","商业"],"#8b6a3c","▤"],
  school:[["School","学校"],"#406e72","✚"],park:[["Park","公园"],"#54784e","✿"],empty:[["Unallocated","未分配"],"#686d69","·"]
};

function originsPlan(index) {
  const plan=originsPlans[index];
  return '<figure class="origins-plan"><figcaption><strong>'+originLabel("simulation")+'</strong><span>'+originLabel("compare")+'</span></figcaption>'+
    '<div class="origins-plan-tabs">'+originsPlans.map((p,i)=>'<button type="button" data-origin-plan="'+i+'" aria-pressed="'+(i===index)+'">'+originText(p.name)+'</button>').join("")+'</div>'+
    '<div class="origins-plan-view" role="img" aria-label="'+originText(plan.summary)+'">'+
    '<div class="origins-zones" aria-hidden="true">'+plan.uses.map(key=>{
      const [name,color,icon]=planUses[key];
      return '<span style="--zone:'+color+'"><b>'+icon+'</b>'+originText(name)+'</span>';
    }).join("")+'</div>'+
    '<svg viewBox="0 0 352 150" preserveAspectRatio="none" aria-hidden="true">'+plan.roads.map(([x,y,x2,y2])=>'<path d="M'+x+' '+y+'L'+x2+' '+y2+'"/>').join("")+'</svg>'+
    '</div><p>'+originText(plan.summary)+'</p></figure>';
}

function originsBeats(chapter,index) {
  return chapter.callbacks
    ? [chapter.callbacks[originsState.answers[index-1] ?? 1],...chapter.beats]
    : chapter.beats;
}

function originsSteps(chapter,index) {
  const steps=originsBeats(chapter,index).map(line=>({kind:"fiction",line}));
  if(chapter.choices) steps.push({kind:"decision"},{kind:"reaction"});
  if(chapter.reveal) steps.push({kind:"reveal"},{kind:"fiction",line:chapter.hook,hook:true});
  else steps.push({kind:"analysis"},{kind:"end"});
  return steps;
}

function originsArchiveLinks(chapter) {
  return chapter.recordIds.map(id=>{
    const index=records.findIndex(record=>record.id===id);
    return '<button type="button" class="secondary" data-go="archive" data-open-record="'+id+'">'+originLabel("archive")+' · '+localizedRecord(index).date+'</button>';
  }).join("");
}

function renderGame(moveFocus=false) {
  const {chapter:index,cursor}=originsState;
  if(index<0) {
    originsPage.innerHTML='<section class="origins-brief"><canvas class="origins-backdrop" width="480" height="240" aria-hidden="true"></canvas>'+
      '<div class="origins-brief-copy"><p class="origins-kicker">'+originLabel("opening")+'</p>'+
      '<h1 tabindex="-1">'+originText(originsBrief.title)+'</h1><p>'+originText(originsBrief.body)+'</p>'+
      '<p class="origins-brief-note">'+originText(originsBrief.note)+'</p><button class="primary" data-origin="next">'+originLabel("begin")+'</button></div>'+
      '<canvas class="origins-brief-portrait" width="128" height="165" aria-hidden="true"></canvas></section>';
    paintOriginsScene(originsPage.querySelector(".origins-backdrop"),0);
    paintOriginsPortrait(originsPage.querySelector(".origins-brief-portrait"),0);
    if(moveFocus) originsPage.querySelector("h1").focus();
    return;
  }

  const chapter=originsChapters[index];
  const steps=originsSteps(chapter,index);
  const step=steps[cursor];
  const {kind}=step;
  const answer=originsState.answers[index];
  originsState.read[index]=Math.max(originsState.read[index],cursor);
  if(kind==="reveal") chapter.recordIds.forEach(id=>originsArchive.add(id));
  const line=step.line ?? (kind==="reaction"?chapter.reactions[answer]:null);
  const speaker=line?.[0] ?? chapter.decisionSpeaker ?? chapter.cast[0];
  const dialogue=kind==="fiction" || kind==="reaction";
  let body;
  if(dialogue) {
    body='<p class="origins-line">'+originText([line[1],line[2]])+'</p>';
    if(kind==="reaction"){
      body+='<p class="origins-choice-made">'+originLabel("decisionChoice")+' · '+originText(chapter.choices[answer])+'</p>';
      if(index===3) body+=originsPlan(answer);
    }
  } else if(kind==="decision") {
    body='<p class="origins-line">'+originText(chapter.question)+'</p><div class="origins-options">'+chapter.choices.map((choice,i)=>
      '<button type="button" data-origin-choice="'+i+'"><b aria-hidden="true">'+String.fromCharCode(65+i)+'</b><span>'+originText(choice)+'</span></button>'
    ).join("")+'</div>';
  } else if(kind==="reveal") {
    body='<p class="origins-line">'+originText(chapter.reveal)+'</p><ul class="origins-sources">'+chapter.refs.map(key=>{
      const [title,url]=localizedSource(key);
      return '<li>'+link(title,url)+'</li>';
    }).join("")+'</ul><div class="origins-evidence">'+originsArchiveLinks(chapter)+'</div>';
  } else if(kind==="analysis") {
    const standards=[
      ["Active Selection","主动选择","Selective study gave Shenzhen concrete tools to test.","带着问题考察，深圳得以选取具体做法进行试验。"],
      ["Adaptation","本土适应","Time-limited use rights worked alongside state ownership.","有期限的使用权与国家所有权并存。"],
      ["Lasting Integration","持续融入","Land rules and statutory plans guided development beyond individual transactions.","土地规则与法定图则持续引导开发，作用超出单笔交易。"]
    ];
    body='<dl class="origins-standards">'+standards.map(([en,zh,desc,cn])=>'<div><dt>'+originText([en,zh])+'</dt><dd>'+originText([desc,cn])+'</dd></div>').join("")+'</dl>'+
      '<p class="origins-line">'+originText(["Shenzhen selected and adapted practices that reached it through Hong Kong, including institutions with a different legal and administrative history. Reworking those practices changed how land was allocated, how infrastructure was financed and where firms, homes and services could develop. The evidence here mainly traces Hong Kong → Shenzhen and cannot establish equal two-way exchange.","深圳通过香港接触到制度渊源不同的规划实践，并在自身制度下选择、改造这些经验。这些改造改变了供地、基础设施筹资，以及企业、住房与服务的空间布局。现有证据主要追踪香港向深圳的传播，无法证明双方存在对等的双向交流。"])+'</p>';
  } else {
    body='<p class="origins-line">'+originLabel("endNote")+'</p><div class="origins-evidence"><button type="button" class="primary" data-go="archive">'+t("goDesk")+'</button><button type="button" class="secondary" data-origin="reset">'+originLabel("replay")+'</button></div>';
  }

  const cast=chapter.cast.length===4?chapter.cast:chapter.cast.filter(member=>
    member===speaker || member===(chapter.cast.find(other=>other!==speaker))
  );
  originsPage.innerHTML='<section class="origins-shell"><header class="origins-heading"><div><p class="origins-kicker">'+chapter.date+' · '+originText(chapter.place)+'</p><h1 tabindex="-1">'+originText(chapter.title)+'</h1></div>'+
    '<nav class="origins-chapters" aria-label="'+originText(["Chapters","章节"])+'">'+originsChapters.map((entry,i)=>
      '<button type="button" title="'+originText(entry.title)+'" aria-label="'+originText(entry.title)+'" data-origin-chapter="'+i+'"'+(i>originsState.reached?' disabled':'')+(i===index?' aria-current="step"':'')+'>'+originText([["Prologue","I","II","III","Epilogue"][i],["序章","一","二","三","尾声"][i]])+'</button>'
    ).join("")+'</nav></header>'+
    '<div class="origins-stage" data-origin-scene="'+index+'"><canvas class="origins-backdrop" width="480" height="240" aria-hidden="true"></canvas><div class="origins-place" aria-hidden="true">'+(chapter.stage?originText(chapter.stage):chapter.date)+'</div><i class="origins-scene-motion" aria-hidden="true"></i>'+
    '<div class="origins-cast" data-size="'+cast.length+'">'+cast.map(member=>{
      const expression=member===speaker
        ? line?.[3] ?? (kind==="decision"?"thoughtful":kind==="end"?"encouraging":originDefaultExpressions[member])
        : originDefaultExpressions[member];
      return '<canvas width="128" height="165" data-origin-portrait="'+member+'" data-expression="'+expression+'" class="'+
        (member===speaker?'speaking':'waiting')+'" aria-hidden="true"></canvas>';
    }).join("")+'</div></div>'+
    '<article class="origins-box" data-kind="'+kind+'" aria-labelledby="origins-beat-title">'+
    '<header><h2 id="origins-beat-title" tabindex="-1">'+(dialogue?originText(originsCast[speaker].name):originLabel(kind))+'</h2>'+
    '<span>'+(dialogue?originText(originsCast[speaker].role)+' · ':'')+(dialogue?originLabel(kind):chapter.date)+'</span></header>'+
    '<div class="origins-body">'+body+'</div>'+
    '<footer><div class="origins-nav"><button type="button" data-origin="back">'+originLabel("back")+'</button>'+
    '<button type="button" data-origin="replay">'+originLabel("retry")+'</button>'+
    (canSkipOrigins(steps)?'<button type="button" data-origin="skip">'+originLabel("skip")+'</button>':'')+'</div>'+
    '<div class="origins-nav"><span class="origins-counter">'+(cursor+1)+' / '+steps.length+'</span>'+
    (kind!=="decision"&&kind!=="end"?'<button type="button" class="primary" data-origin="next">'+originLabel(cursor===steps.length-1?"nextChapter":"next")+'</button>':'')+'</div></footer></article></section>';
  paintOriginsScene(originsPage.querySelector(".origins-backdrop"),index);
  originsPage.querySelectorAll("[data-origin-portrait]").forEach(canvas=>paintOriginsPortrait(canvas,Number(canvas.dataset.originPortrait),canvas.dataset.expression));
  if(moveFocus) {
    const heading=originsPage.querySelector("#origins-beat-title");
    heading.focus({preventScroll:true});
    heading.scrollIntoView({block:"nearest"});
  }
}

function canSkipOrigins(steps) {
  const {chapter,cursor,read}=originsState;
  return cursor<read[chapter] && steps[cursor].kind==="fiction";
}

originsPage.addEventListener("click",event=>{
  const button=event.target.closest("[data-origin],[data-origin-choice],[data-origin-plan],[data-origin-chapter]");
  if(!button || button.disabled) return;
  const state=originsState;
  if(button.dataset.originPlan!==undefined){
    const current=button.closest(".origins-plan");
    const plan=Number(button.dataset.originPlan);
    current.outerHTML=originsPlan(plan);
    originsPage.querySelector('[data-origin-plan="'+plan+'"]').focus();
    return;
  }
  const {chapter:index,cursor}=state;
  const steps=index<0?[]:originsSteps(originsChapters[index],index);
  if(button.dataset.originChoice!==undefined){
    if(steps[cursor].kind!=="decision") return;
    state.answers[index]=Number(button.dataset.originChoice);
    state.cursor++;
    gameAudio.effect("choice");
  } else if(button.dataset.originChapter!==undefined){
    state.chapter=Number(button.dataset.originChapter);
    state.cursor=0;
  } else switch(button.dataset.origin){
    case "next":
      if(cursor+1<steps.length) state.cursor++;
      else {
        state.chapter++;
        state.reached=Math.max(state.chapter,state.reached);
        state.cursor=0;
      }
      break;
    case "back":
      if(cursor>0) state.cursor--;
      else if(index>0){
        state.chapter--;
        state.cursor=originsSteps(originsChapters[state.chapter],state.chapter).length-1;
      } else state.chapter=-1;
      break;
    case "skip":
      if(!canSkipOrigins(steps)) return;
      do {state.cursor++;} while(state.cursor<state.read[index] && steps[state.cursor].kind==="fiction");
      break;
    case "replay":
      state.cursor=0;
      break;
    case "reset":
      state.chapter=-1;
      state.cursor=0;
      state.answers.fill(null);
      state.read.fill(-1);
      state.reached=0;
      originsArchive.clear();
      break;
  }
  renderGame(true);
});
