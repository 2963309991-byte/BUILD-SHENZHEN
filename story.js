"use strict";

const story = document.querySelector("#archive");
const mapArt = document.querySelector("#map-art");
const mapMotion = document.querySelector("#map-motion").getContext("2d");
const reduceStoryMotion = matchMedia("(prefers-reduced-motion: reduce)");
const replayButton = document.querySelector("#timeline-play");
const storyLine = pair => pair[language === "zh" ? 1 : 0];
let storyPlayback = 0;
let storyFrame = 0;
let mapLayer = "transfer";
let activeCase = 0;
let bookSpread = 0;
let comparisonTopic = 0;
const researchStorage = "build-shenzhen-research-v1";
const researchModules = ["atlas","transfer","compare","budget"];
const exploredResearch = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(researchStorage));
  if (Array.isArray(saved)) saved.filter(value => researchModules.includes(value)).forEach(value => exploredResearch.add(value));
} catch {}
const allocations = [0, 0, 0];
const developmentProjects = [
  {label:["Road connections","道路连接"], cost:40, result:["Connect industrial sites to markets.","让工业用地更容易连接市场。"]},
  {label:["Water and power","供水与供电"], cost:35, result:["Prepare sites for building and production.","为建设和生产提供基本配套。"]},
  {label:["School and public space","学校与公共空间"], cost:40, result:["Give residents access to public services and shared space.","让居民获得公共服务与共享空间。"]}
];

function storyRef(key) {
  const [title, url] = localizedSource(key);
  return link(title, url);
}

function storyRecordEvidence(item) {
  return '<details class="evidence-notes"><summary>' + t("storyEvidence") + '</summary><p>' +
    storyLine(evidenceNotes[item.id]) + '</p></details><ul class="story-refs">' +
    item.refs.map(key => '<li>' + storyRef(key) + '</li>').join("") + '</ul>';
}

function chooseStoryRecord(index) {
  setAtlasMode(true);
  selectRecord(index, true);
  history.replaceState(null, "", "#archive/" + records[index].id);
  const entry = timeline.children[index];
  const track = timeline.getBoundingClientRect();
  const bounds = entry.getBoundingClientRect();
  if (bounds.left < track.left || bounds.right > track.right) {
    timeline.scrollLeft += bounds.left - track.left - 12;
  }
}

function stopStoryPlayback() {
  clearInterval(storyPlayback);
  storyPlayback = 0;
  replayButton.textContent = t("storyReplay");
  replayButton.setAttribute("aria-pressed", "false");
}

replayButton.addEventListener("click", () => {
  if (storyPlayback) {
    stopStoryPlayback();
    return;
  }
  if (atlasSection.dataset.atlasMode==="full" || currentRecord === records.length - 1) chooseStoryRecord(0);
  replayButton.textContent = t("storyPause");
  replayButton.setAttribute("aria-pressed", "true");
  storyPlayback = setInterval(() => {
    chooseStoryRecord(currentRecord + 1);
    if (currentRecord === records.length - 1) stopStoryPlayback();
  }, 5500);
});

function mapPosition(index) {
  const {x,y} = records[index];
  return [x * mapArt.width / 100, y * mapArt.height / 100];
}

function mapSegment(ctx, points) {
  ctx.beginPath();
  points.forEach(([x,y], index) => index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
}

function storyRoutes() {
  if (mapLayer === "economy") {
    return [{points:[[72,133],[123,106],[184,101],[237,88],[291,91],[345,67]], year:0, color:"#e8c58f"},
      {points:[[191,101],[185,78],[201,63],[259,62],[287,48]], year:1, color:"#b9ecda"},
      {points:[[229,104],[252,116],[276,103],[282,78],[303,68]], year:3, color:"#f0c2a0"}];
  }
  const hk = mapPosition(2);
  return [
    {points:[hk,[307,195],[306,152],[322,122],[321,88],mapPosition(3)], year:2, color:"#ffde9c"},
    {points:[hk,[282,219],[254,184],[225,151],[188,122],mapPosition(5)], year:5, color:"#b9ecda"},
    {points:[mapPosition(5),[191,102],mapPosition(6),[248,79],mapPosition(7)], year:6, color:"#b9ecda"},
    {points:[mapPosition(3),[304,53],[270,45],[238,49],mapPosition(4)], year:4, color:"#f0c2a0"}
  ];
}

function traceMapRoute(route, seconds) {
  const {points, year, color} = route;
  const overview = atlasSection.dataset.atlasMode==="full";
  const active = overview || currentRecord >= year;
  const ctx = mapMotion;
  ctx.globalAlpha = overview ? .77 : active ? 1 : .23;
  ctx.lineJoin = "round";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#172d3b";
  ctx.setLineDash([]);
  mapSegment(ctx, points);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.setLineDash([5,4]);
  ctx.lineDashOffset = -seconds * 15;
  ctx.strokeStyle = color;
  ctx.stroke();
  if (mapLayer === "transfer" && active) {
    const [a,b] = points.slice(-2);
    const angle = Math.atan2(b[1]-a[1],b[0]-a[0]);
    const end = [b[0]-Math.cos(angle)*13,b[1]-Math.sin(angle)*13];
    const flank = side => [end[0]-Math.cos(angle+side*.58)*9,end[1]-Math.sin(angle+side*.58)*9];
    ctx.setLineDash([]);
    mapSegment(ctx,[flank(-1),end,flank(1)]);
    ctx.stroke();
  }
}

function drawStoryRoutes(time) {
  const ctx = mapMotion;
  ctx.clearRect(0,0,mapArt.width,mapArt.height);
  storyRoutes().forEach(route => traceMapRoute(route,reduceStoryMotion.matches ? 0 : time/1000));
  ctx.globalAlpha = 1;
  if (!story.hidden && !atlasSection.hidden && !document.hidden && !reduceStoryMotion.matches) storyFrame = requestAnimationFrame(drawStoryRoutes);
}

function updateStoryMap() {
  cancelAnimationFrame(storyFrame);
  if (story.hidden || atlasSection.hidden) return;
  const captions = mapLayer === "transfer"
    ? ["Gold: land leasing · Mint: statutory planning · Peach: wider adoption", "金色：土地批租 · 薄荷绿：法定规划 · 桃色：制度推广"]
    : ["Gold: connections · Mint: serviced sites · Peach: public facilities", "金色：交通连接 · 薄荷绿：用地配套 · 桃色：公共设施"];
  document.querySelector("#map-legend").textContent = storyLine(captions);
  pixelMap(mapArt, atlasSection.dataset.atlasMode==="full" ? records.length-1 : currentRecord, mapLayer);
  drawStoryRoutes(performance.now());
}

document.querySelector("#map-layers").addEventListener("click", event => {
  const control = event.target.closest("[data-layer]");
  if (!control) return;
  mapLayer = control.dataset.layer;
  setPressed("#map-layers", "layer", mapLayer);
  updateStoryMap();
});
reduceStoryMotion.addEventListener("change", updateStoryMap);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopStoryPlayback();
  updateStoryMap();
});

function setPressed(group, key, value) {
  document.querySelectorAll(group + " button").forEach(control => {
    control.setAttribute("aria-pressed", String(control.dataset[key] === String(value)));
  });
}

function switchButtons(items, key) {
  return items.map((item,index) => '<button type="button" data-' + key + '="' + index + '">' +
    storyLine(item.name) + '</button>').join("");
}

function renderTransfer() {
  setPressed("#transfer-cases", "case", activeCase);
  const item = storyCases[activeCase];
  document.querySelector("#transfer-flow").innerHTML =
    '<li class="transfer-origin"><span class="eyebrow">' + t("hongKong") + '</span><h3>' +
    storyLine(item.origin) + '</h3><p>' + storyLine(item.idea) + '</p><div class="flow-links">' +
    item.originRefs.map(storyRef).join("") + '</div></li>' + item.stages.map(stage =>
      '<li><span class="eyebrow">' + t("shenzhen") + '</span><h3>' + storyLine(stage.name) +
      '</h3><p>' + storyLine(stage.text) + '</p><div class="flow-links">' + stage.refs.map(storyRef).join("") +
      '</div><button class="text-action" type="button" data-atlas-record="' + stage.record + '">' +
      t("storyArchive") + '</button></li>').join("");
  document.querySelectorAll("#transfer-flow li").forEach((leaf,index)=>{
    leaf.hidden=Math.floor(index/2)!==bookSpread;
    const folio=document.createElement("small");
    folio.className="book-folio";
    folio.textContent=String(index+1).padStart(2,"0");
    leaf.append(folio);
  });
  document.querySelector("[data-book-turn='-1']").disabled=bookSpread===0;
  document.querySelector("[data-book-turn='1']").disabled=bookSpread===1;
  document.querySelector("#book-page").textContent=(bookSpread+1)+" / 2";
  document.querySelector("#transfer-verdict").hidden=bookSpread===0;
  const [economyEn,economyZh,refs] = transferEconomics[activeCase];
  document.querySelector("#transfer-verdict").innerHTML = '<section><h3>' +
    storyLine(["Economic effects","经济影响"]) + '</h3><p>' + storyLine([economyEn,economyZh]) + '</p><div class="flow-links">' +
    refs.map(storyRef).join("") + '</div></section><section><h3>' +
    storyLine(["Mutual learning verdict","文明互鉴判断"]) + '</h3><p>' + storyLine(item.verdict) + '</p></section>';
}

function renderComparison() {
  setPressed("#compare-topics", "topic", comparisonTopic);
  const {hk, sz, point} = storyComparisons[comparisonTopic];
  document.querySelector("#comparison").innerHTML = '<div class="compare-grid">' +
    [hk,sz].map(([en,zh,enBody,zhBody,ref],index) => '<article><p class="eyebrow">' +
      t(index ? "shenzhen" : "hongKong") + '</p><h3>' + storyLine([en,zh]) +
      '</h3><p>' + storyLine([enBody,zhBody]) + '</p><div class="flow-links">' +
      storyRef(ref) + '</div></article>').join("") + '</div><p class="compare-insight">' + storyLine(point) + '</p>' +
    '<dl class="research-steps">' + comparisonMechanisms[comparisonTopic].map((text,index) =>
      '<div><dt>' + storyLine([["Borrowed practice","借鉴做法"],["Local modification","本土改造"],["Economic significance","经济意义"]][index]) +
      '</dt><dd>' + storyLine(text) + '</dd></div>').join("") + '</dl>';
}

function renderBudget() {
  document.querySelector("#budget-model").innerHTML = '<div class="budget-baseline"><span>' +
    storyLine(["1987 winning bid","1987 年拍卖成交价"]) + '</span><strong>' + t("auctionValue") +
    '</strong>' + storyRef("auction") + '</div><div class="budget-workbench"><div><div class="budget-treasury"><output id="budget-left" aria-live="polite"></output>' +
    '<button class="secondary" id="budget-reset" type="button">' + t("reset") + '</button></div><div id="budget-projects">' +
    developmentProjects.map((project,index) => '<div class="budget-project"><h3>' +
      storyLine(project.label) + '</h3><p class="budget-cost" data-cost="' + index + '"></p>' +
      '<div role="group" aria-label="' + storyLine(project.label) + '"><button type="button" data-project="' + index +
      '" data-amount="-5" aria-label="' + storyLine(["Remove 5 from ","减少 5 点："]) + storyLine(project.label) +
      '">−</button><button type="button" data-project="' + index + '" data-amount="5" aria-label="' +
      storyLine(["Add 5 to ","增加 5 点："]) + storyLine(project.label) + '">+</button></div></div>').join("") +
    '</div></div><div class="budget-preview"><canvas width="192" height="92" id="budget-art" aria-hidden="true"></canvas>' +
    '<ul id="budget-outcomes" aria-live="polite"></ul></div></div><p class="budget-note">' +
    storyLine(["Teaching simulation. Credits, costs and outcomes are hypothetical. The auction figure above is historical. This model does not show how its proceeds were spent.",
      "教学模拟。预算点数、成本和结果均为假设。上方成交价是史实，本模型不重现这笔收入的实际用途。"] ) +
    '</p><details class="budget-debrief"><summary>' + t("budgetDebrief") + '</summary><div id="budget-analysis"></div></details>';
  refreshBudget();
}

function refreshBudget() {
  const left = 100 - allocations.reduce((sum, value) => sum + value, 0);
  document.querySelector("#budget-left").textContent = left + " / 100 " + storyLine(["credits available","点预算可用"]);
  developmentProjects.forEach((project,index) => {
    document.querySelector('[data-cost="' + index + '"]').textContent =
      allocations[index] + " / " + project.cost + " " + storyLine(["credits allocated","点已分配"]);
    document.querySelector('[data-project="' + index + '"][data-amount="-5"]').disabled = allocations[index] === 0;
    document.querySelector('[data-project="' + index + '"][data-amount="5"]').disabled = left < 5 || allocations[index] >= project.cost;
  });
  const built = developmentProjects.map((project,index) => allocations[index] >= project.cost);
  document.querySelector("#budget-outcomes").innerHTML = developmentProjects.map((project,index) =>
    '<li class="' + (built[index] ? "built" : "") + '"><strong>' + storyLine(project.label) +
    '</strong><span>' + storyLine(built[index] ? project.result : ["Waiting for funding","待拨款"]) + '</span></li>').join("");
  const opportunity = developmentProjects.filter((project,index) => !built[index] && project.cost-allocations[index]>left);
  const funded = developmentProjects.filter((_,index) => built[index]);
  const list = projects => new Intl.ListFormat(language).format(projects.map(project => storyLine(project.label)));
  const readings = [
    [["Budget constraint","预算约束"],storyLine([left+" credits remain. Together the projects cost 115, so even the full 100-credit budget cannot cover them all.","还剩 "+left+" 点预算。项目共需 115 点，即使一开始的 100 点全部用上，也无法同时建成。"])],
    [["Opportunity cost","机会成本"],opportunity.length ? storyLine([list(opportunity)+" cannot be finished with the remaining credits. To finish one, free up credits elsewhere.","仅靠剩余点数无法完成「"+list(opportunity)+"」。如果要优先建设，就得从其他项目腾出预算。"]) : storyLine(["Each credit committed to one project is unavailable for another. Try funding two projects and see which one must wait.","每投入一个项目一点预算，其他项目就少一点。试着建成两个项目，看看哪个必须等一等。"])],
    [["Resource allocation","资源配置"],funded.length ? storyLine(["Your funded priorities: "+list(funded)+". Partially funded projects still need their full cost to open.","你优先建成了「"+list(funded)+"」。部分拨款的项目仍要筹足成本才能投入使用。"]) : storyLine(["Allocate credits until a project’s funding reaches its cost. Partial allocations commit money but leave that project waiting.","试着为一个项目拨足所需点数。部分拨款会占用预算，但项目仍处于待建状态。"])],
    [["Infrastructure planning","基础设施规划"],storyLine(["Roads and utilities make sites usable for firms and households. Schools and public space meet residents’ needs. A plan also has to reserve sites and sequence these investments.","道路和水电让用地能支持企业运营和居民生活，学校与公共空间满足居民需求。规划还要预留用地，并安排这些投入的先后顺序。"])]
  ];
  document.querySelector("#budget-analysis").innerHTML = '<dl class="research-steps">' + readings.map(([title,copy]) =>
    '<div><dt>' + storyLine(title) + '</dt><dd>' + copy + '</dd></div>').join("") + '</dl>';
  drawBudgetPixels(document.querySelector("#budget-art"), built);
}

function drawBudgetPixels(canvas, built) {
  const ctx = canvas.getContext("2d");
  function box(x,y,w,h,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
  }
  box(0,0,192,92,"#1c3044");
  box(0,59,192,33,"#4f8b7c");
  for (let x=0; x<192; x+=8) box(x,64+(x%24)/4,5,2,"#6ba89a");
  box(156,9,11,11,"#e8c58f");
  box(19,21,27,3,"#476677");
  box(116,32,26,3,"#476677");
  for (let i=0;i<3;i++) {
    const x = 12+i*60;
    box(x,74,48,9,"#28534f");
    if (!built[i]) {
      for (let n=0;n<6;n++) box(x+n*8,76,4,1,"#75b9a7");
      continue;
    }
    if (i === 0) {
      box(x,66,48,16,"#34495b");
      for (let n=0;n<5;n++) box(x+4+n*8,73,4,2,"#e8c58f");
      box(x+22,68,12,6,"#a8d6c2");
      box(x+25,65,7,4,"#f3e8d4");
    } else if (i === 1) {
      box(x+9,41,22,34,"#75b9a7");
      box(x+12,37,16,4,"#b6d7b7");
      box(x+32,57,14,18,"#34495b");
      box(x+34,63,10,3,"#e8c58f");
    } else {
      box(x+3,51,28,24,"#e8c58f");
      box(x,47,34,5,"#b58463");
      for (let n=0;n<3;n++) box(x+6+n*8,57,4,8,"#34495b");
      box(x+39,55,7,17,"#b9d6ab");
      box(x+41,68,3,8,"#8a6351");
    }
  }
}

story.addEventListener("click", event => {
  const control = event.target.closest("[data-case], [data-topic], [data-book-turn], [data-desk-open], [data-atlas-record], [data-project], #budget-reset");
  if (!control) return;
  const data = control.dataset;
  if (data.deskOpen) {
    openDeskObject(data.deskOpen,control);
  } else if (data.bookTurn) {
    gameAudio.effect("bookPage");
    bookSpread=Number(data.bookTurn)>0?1:0;
    renderTransfer();
    const flow=document.querySelector("#transfer-flow");
    if(!reduceStoryMotion.matches) flow.animate(
      [{opacity:.35,transform:"perspective(950px) rotateY("+(-11*Number(data.bookTurn))+"deg)"},{opacity:1,transform:"none"}],
      {duration:350,easing:"ease-out"});
    document.querySelector("[data-book-turn='"+(-Number(data.bookTurn))+"']").focus({preventScroll:true});
  } else if (data.case !== undefined) {
    activeCase = Number(data.case);
    bookSpread=0;
    renderTransfer();
  } else if (data.topic !== undefined) {
    comparisonTopic = Number(data.topic);
    renderComparison();
  } else if (data.project !== undefined) {
    const index = Number(data.project);
    const cost = developmentProjects[index].cost;
    const wasFunded = allocations[index]===cost;
    allocations[index] += Number(data.amount);
    refreshBudget();
    if (!wasFunded && allocations[index]===cost) {
      document.querySelector(".budget-debrief").open = true;
    }
  } else if (control.id === "budget-reset") {
    allocations.fill(0);
    refreshBudget();
  } else {
    event.preventDefault();
    stopStoryPlayback();
    const index=records.findIndex(item=>item.id===data.atlasRecord);
    if(index<0) return;
    go("archive",null,data.atlasRecord);
  }
});

function renderStoryTools() {
  replayButton.textContent = t(storyPlayback ? "storyPause" : "storyReplay");
  document.querySelector("#transfer-cases").innerHTML = switchButtons(storyCases,"case");
  document.querySelector("#compare-topics").innerHTML = switchButtons(storyComparisons,"topic");
  renderTransfer();
  renderComparison();
  renderBudget();
  renderResearchVerdict();
  renderResearchProgress();
}

function recordResearchVisit(view) {
  if (!researchModules.includes(view) || exploredResearch.has(view)) return;
  exploredResearch.add(view);
  try { localStorage.setItem(researchStorage,JSON.stringify([...exploredResearch])); } catch {}
}

function renderResearchProgress() {
  const label = t("progressLabel") + " " + exploredResearch.size + "/" + researchModules.length;
  const complete = exploredResearch.size === researchModules.length;
  document.querySelector("#desk-progress").textContent = label;
  document.querySelector("#verdict-progress").textContent = label;
  document.querySelector("#desk-verdict").classList.toggle("verdict-ready",complete);
  document.querySelector("#desk-verdict-arrow").hidden = !complete;
  document.querySelector("#desk-verdict-cat").hidden = !complete || currentDeskView !== "desk";
  document.querySelector("#module-verdict-cat").hidden = !complete || !researchModules.includes(currentDeskView);
}

function renderResearchVerdict() {
  const card = (entry,tag) => '<article><' + tag + '>' + storyLine(entry.title) + '</' + tag + '><p>' + storyLine(entry.body) +
    '</p><div class="flow-links">' + entry.records.map(id => {
      const archive = localizedRecord(records.findIndex(item => item.id===id));
      return '<button type="button" class="text-action" data-atlas-record="' + id + '">' + archive.date + ' · ' + archive.title + '</button>';
    }).join("") + (entry.refs ?? []).map(storyRef).join("") + '</div></article>';
  document.querySelector("#verdict-body").innerHTML = '<div class="verdict-lead"><p>' + t("storyThesis") +
    '</p><output id="verdict-progress" aria-live="polite"></output></div><div class="verdict-findings">' +
    researchVerdict.map(entry => card(entry,"h3")).join("") + '</div><h3>' + storyLine(["Was it mutual learning?","这构成文明互鉴吗？"]) +
    '</h3><p>' + storyLine(["Yes, on the receiving side under Assignment 2’s three conditions. The evidence follows knowledge mostly towards Shenzhen. It does not demonstrate equally reciprocal institutional change in Hong Kong.","按作业的三项条件判断，深圳作为接收方构成文明互鉴。现有证据主要追踪知识如何传向深圳，未能证明香港也发生了对等的制度改变。"]) +
    '</p><div class="verdict-conditions">' + verdictConditions.map(entry => card(entry,"h4")).join("") + '</div><p class="verdict-close">' +
    storyLine(["Mutual learning is more than borrowing. It means selecting, adapting and integrating knowledge into new practices.","文明互鉴超越了借用。它意味着选择、改造并融入知识，从而形成新的实践。"] ) + '</p>';
}

function storyRecordFields(item) {
  const [knowledge,adaptation,condition]=atlasRecordAnalysis[item.id];
  const fields=[
    [["What happened?","发生了什么？"], item.history],
    [["What knowledge moved?","哪些知识发生了传播？"], storyLine(knowledge)],
    [["How was it adapted?","如何在本地改造？"], storyLine(adaptation)],
    [["Why did it matter economically?","它为何具有经济意义？"], atlasEconomicReadings[item.id] ? storyLine(atlasEconomicReadings[item.id]) : item.meaning]
  ];
  return '<dl class="atlas-answers">'+fields.map(([label,body])=>'<div><dt>'+storyLine(label)+'</dt><dd>'+body+'</dd></div>').join("")+
    '</dl><div class="atlas-condition"><span>'+storyLine(["Which mutual learning condition?","对应哪项文明互鉴条件？"])+'</span><strong>'+storyLine(condition)+'</strong></div>';
}

const atlasSection=document.querySelector("#story-atlas");
const atlasReturn=document.querySelector("#atlas-return");

function setAtlasMode(detail, unfold=false) {
  const mode=detail?"detail":"full";
  const changed=atlasSection.dataset.atlasMode!==mode;
  atlasSection.dataset.atlasMode=mode;
  atlasReturn.hidden=!detail;
  record.hidden=!detail;
  if(changed) zoomMap(minScale);
  const map=atlasSection.querySelector(".atlas-map");
  if(detail) map.classList.remove("atlas-unfold");
  if(unfold && !detail){
    map.classList.remove("atlas-unfold");
    requestAnimationFrame(()=>{if(!story.hidden && atlasSection.dataset.atlasMode==="full") map.classList.add("atlas-unfold");});
  }
}

atlasReturn.addEventListener("click",()=>{
  stopStoryPlayback();
  setAtlasMode(false,true);
  history.replaceState(null,"","#archive/atlas");
  selectRecord(currentRecord);
  const title=document.querySelector("#atlas-title");
  title.focus({preventScroll:true});
  atlasSection.scrollIntoView({block:"start"});
});

const deskStage=document.querySelector("#story-desk");
const deskBackbar=document.querySelector("#desk-backbar");
const deskPanels=Object.fromEntries([...story.querySelectorAll("[data-desk-panel]")].map(panel=>[panel.dataset.deskPanel,panel]));
let currentDeskView="desk";
let deskTransition=null;

function setDeskView(view) {
  cancelDeskTransition();
  if(currentDeskView==="atlas" && view!=="atlas") stopStoryPlayback();
  currentDeskView=view;
  deskStage.hidden=view!=="desk";
  deskBackbar.hidden=view==="desk";
  for(const [key,panel] of Object.entries(deskPanels)) panel.hidden=view!==key;
  recordResearchVisit(view);
  renderResearchProgress();
}

function cancelDeskTransition() {
  if(!deskTransition) return;
  deskTransition.remove();
  deskTransition=null;
  deskStage.removeAttribute("aria-busy");
}

function openDeskObject(view,control) {
  if(deskTransition) return;
  const original=control.querySelector(".desk-art");
  if(!original || reduceStoryMotion.matches){
    if(original) gameAudio.effect("desk:"+view);
    go("archive",null,view==="desk"?undefined:view);
    return;
  }
  const from=original.getBoundingClientRect();
  const stage=document.createElement("div");
  const object=original.cloneNode(true);
  const source=original.querySelector("canvas");
  object.querySelector("canvas").getContext("2d").drawImage(source,0,0);
  stage.className="desk-zoom";
  stage.dataset.object=view;
  stage.setAttribute("aria-hidden","true");
  const width=Math.min(innerWidth*(view==="atlas" || view==="transfer"?.48:.68),innerHeight*.57,view==="compare"?345:400);
  const height=width*source.height/source.width;
  stage.style.setProperty("--object-width",width+"px");
  stage.style.setProperty("--object-height",height+"px");
  stage.append(object);
  deskStage.setAttribute("aria-busy","true");
  document.body.append(stage);
  deskTransition=stage;

  const arrive=object.animate([
    {transform:`translate(${from.left+from.width/2-innerWidth/2}px,${from.top+from.height/2-innerHeight/2}px) scale(${from.width/width})`},
    {transform:"none"}
  ],{duration:700,easing:"cubic-bezier(.22,.82,.25,1)",fill:"both"});
  arrive.finished.then(()=>{
    if(deskTransition!==stage) return;
    stage.dataset.phase="reveal";
    gameAudio.effect("desk:"+view);
    const reveal=stage.getAnimations({subtree:true});
    return Promise.allSettled(reveal.map(animation=>animation.finished)).then(()=>{
      if(deskTransition===stage && page==="archive" && currentDeskView==="desk") go("archive",null,view);
    });
  }).catch(()=>{});
}

function deskFocusTarget() {
  return currentDeskView==="desk"?deskStage.querySelector("h1"):
    deskPanels[currentDeskView].querySelector(currentDeskView==="atlas"?"h1":"h2");
}


const verdictCatScenes = new Map();
const verdictCatObserver = new IntersectionObserver(entries => {
  for (const {target, isIntersecting} of entries) {
    const scene = verdictCatScenes.get(target);
    if (isIntersecting && !reduceStoryMotion.matches) {
      if (scene.frame) continue;
      const start = performance.now();
      const animate = now => {
        drawGuideCat(scene.context,2,now-start);
        scene.frame = requestAnimationFrame(animate);
      };
      scene.frame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(scene.frame);
      scene.frame = 0;
      drawGuideCat(scene.context,2,0);
    }
  }
});
document.querySelectorAll(".verdict-cat canvas").forEach(canvas => {
  const context = canvas.getContext("2d");
  drawGuideCat(context,2,0);
  verdictCatScenes.set(canvas,{context,frame:0});
  verdictCatObserver.observe(canvas);
});
