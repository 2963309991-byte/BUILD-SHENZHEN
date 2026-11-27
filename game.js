"use strict";

const sources = {
  ...storySources,
  reform: ["Reforming the Investment Climate · World Bank", "https://documents.worldbank.org/curated/en/881491468161666917/pdf/370940Reformin1ent0Climate01PUBLIC1.pdf", "Box 2 traces the first land-use charges and the role of special economic zones in China’s land reform."],
  exchange: ["Shenzhen Special Economic Zone as a Policy Reform Incubator · Shen & Xu, World Bank", "https://documents.worldbank.org/curated/en/622661468339570756/pdf/690730PUB0Publ067902B09780821389706.pdf#page=121", "The chapter documents Shenzhen’s 1986 task force, Hong Kong study tour and preparation for the auction."],
  auction: ["China’s First Public Land-Use Rights Auction · Shenzhen Government", "https://www.sz.gov.cn/szstory/202301/content/post_10371168.html", "The municipal archive records the auction date, parcel size, original term and winning bid."],
  lease: ["1990 Interim Regulations on Urban State-Owned Land · State Council", "https://xxgk.jl.gov.cn/PDFfile/201812/5677186.pdf", "The regulations set out how use rights to state-owned urban land could be granted and transferred."],
  legal: ["Governing Green Urbanism: The Case of Shenzhen, China · Journal of Urban Affairs", "https://www.tandfonline.com/doi/full/10.1080/07352166.2016.1271623", "The authors connect the land reforms to changes in urban development and planning, and discuss the environmental trade-offs."],
  planning: ["1998 Shenzhen Urban Planning Ordinance · Shenzhen Government Gazette", "https://www.sz.gov.cn/zfgb/1998/gb145/content/post_10124185.html", "The original ordinance sets out how statutory plans, development controls and public participation fit into the planning system."]
};

const imageCredits = {
  shekou: ["People’s Political Consultative Conference Daily", "https://www.rmzxw.com.cn/c/2021-08-26/2941889.shtml?n2m=1"],
  luohu: ["Shenzhen Government via Our China Story", "https://www.ourchinastory.com/cn/14395/%E6%B7%B1%E5%9C%B3%E7%89%B9%E5%8C%BA45%E5%B9%B4%EF%BD%9C%E5%9B%BE%E8%AF%B4%E6%B7%B1%E5%9C%B3%E6%94%B9%E9%9D%A9%E5%BC%80%E6%94%BE%E5%8F%B2-%E4%BB%8E%E8%BE%B9%E9%99%B2%E5%86%9C%E4%B8%9A%E5%8E%BF%E5%88%B0%E5%9B%BD%E9%99%85%E5%A4%A7%E9%83%BD%E5%B8%82"],
  hk: ["Ion Tichy, Wikimedia Commons", "https://commons.wikimedia.org/wiki/File:Hongkong_1980_(View_from_Peak).jpg"],
  auction: ["Our China Story", "https://www.ourchinastory.com/zh/2389/%E6%94%B9%E9%9D%A9%E9%96%8B%E6%94%BE%EF%BD%9C%E6%B7%B1%E5%9C%B3%E7%AC%AC%E4%B8%80%E6%AC%A1%E8%B3%A3%E5%9C%B0-%E5%8F%83%E8%80%83%E9%A6%99%E6%B8%AF%E6%94%BF%E7%AD%96%E5%A2%9E%E6%94%B6%E5%85%A5"]
};

const records = [
  {id:"sez", date:"1980", title:"The Special Economic Zone", place:"Shenzhen · Shekou as regional context", x:19,y:45,
    image:["shekou.jpg","A cyclist passes the Time Is Money, Efficiency Is Life sign in Shekou","Early reform-era Shekou", "shekou"],
    history:"In August 1980, Shenzhen became one of China’s first special economic zones. Demand for industrial sites, housing and infrastructure grew as investors arrived. Existing administrative land allocation offered local authorities limited ways to recover the cost of preparing sites.",
    meaning:"The SEZ created room to test new arrangements for infrastructure and investment. It also gave Shenzhen officials a reason to study how nearby Hong Kong allocated and financed development land.",
    refs:["shekouHistory","reform","exchange"]},
  {id:"fees",date:"1981",title:"Early Land-Use Fees",place:"Shenzhen SEZ · Luohu as regional context",x:70,y:35,
    image:["luohu.jpg","Two panoramic archive photos showing Luohu in 1984 and 2020","Luohu in 1984 and 2020. These photographs show later development and provide context for the 1981 rules.", "luohu"],
    history:"The SEZ’s 1981 land-use rules established charges for using land. In the following year, Shenzhen began collecting fees from foreign investors and joint ventures. The fees gave officials a way to recover part of the cost of preparing and servicing land.",
    meaning:"Paid use was an early step toward treating land use as a distinct economic right. Competitive public auction came later, after further local experimentation.",
    refs:["reform","exchange"]},
  {id:"exchange",date:"1986",title:"Learning from Hong Kong",place:"Hong Kong · Study tour",x:72,y:72,
    image:["hong-kong.jpg","Hong Kong and Victoria Harbour seen from Victoria Peak in 1980","Hong Kong from Victoria Peak, August 1980", "hk"],
    history:"In 1986, Shenzhen set up a land-reform task force. It studied Shenzhen’s market, invited Hong Kong real-estate specialists to share their experience and sent an official team to Hong Kong on a study tour.",
    meaning:"The transferable idea was that a government could grant a time-limited right to develop land and allocate that right competitively. Shenzhen officials still had to decide how the mechanism would work under mainland law.",
    refs:["exchange","hkTenure"]},
  {id:"auction",date:"1987",title:"The First Public Auction",place:"Luohu · Auction parcel near Shenzhen Reservoir",x:82,y:23,
    image:["auction.jpg","Photograph of the audience and bidders at Shenzhen’s 1987 land-use rights auction","Public auction at Shenzhen Municipal Hall, 1 December 1987", "auction"],
    history:"On 1 December 1987, Shenzhen auctioned the right to use an 8,588 m² residential parcel near Shenzhen Reservoir. The original term was 50 years. The winning bid was RMB 5.25 million.",
    meaning:"Competing bids established a price for a defined use right while the state retained ownership. The government could use land revenue to help pay for urban construction, and developers gained a new route to secure sites.",
    refs:["auction","exchange","finance"]},
  {id:"law",date:"1988–1990",title:"From Pilot to National Rules",place:"Shenzhen SEZ · Reform later adopted nationally",x:37,y:12,
    image:["land-regulation.jpg","First page of the State Council’s 1990 interim regulations on urban state-owned land","1990 State Council regulations, first page"],
    history:"The 1988 constitutional amendment permitted land-use rights to be transferred in accordance with law. In 1990, the State Council specified how urban state-owned land-use rights could be granted and transferred.",
    meaning:"A technique tested in Shenzhen became part of a national legal framework. The distinction between ownership and use made the local experiment easier to apply in other cities.",
    refs:["constitution","lease"]},
  {id:"futian",date:"1996",title:"Planning a New City Centre",place:"Futian · Central business district",x:34,y:34,
    documentRef:"planningTransfer",
    history:"Shenzhen set up a construction and development office for its central business district in Futian in 1996. In the same year, a draft ordinance proposed binding statutory plans and a formal approval role for the planning commission. This work took place alongside mid-1990s professional visits to Hong Kong and Singapore to study planning and market coordination.",
    meaning:"Municipal planners studied Hong Kong’s plan hierarchy and board-based approvals while trying to protect long-term development conditions in priority areas such as Futian.",
    refs:["planningTransfer","hkPlans","planningVisits","planningStandards"]},
  {id:"planning",date:"1998",title:"Putting Planning into Law",place:"Shenzhen · Citywide planning",x:53,y:40,
    document:true,
    history:"Shenzhen’s 1998 Urban Planning Ordinance gave statutory plans a formal role in development control. The ordinance addressed permitted uses, development intensity, public facilities and the consultation process for draft statutory plans.",
    meaning:"Land markets changed how sites were allocated and financed. Statutory planning gave the city tools to shape what could be built and to reserve space for public needs as development accelerated.",
    refs:["planning","planningTransfer","planningCurrent"]},
  {id:"integration",date:"1999–2021",title:"A System That Endured",place:"Shenzhen · Planning Commission",x:56,y:19,
    documentRef:"planningCurrent",
    history:"Shenzhen appointed the new Planning Commission in 1999. The ordinance has since been amended several times. In the consolidated text through 2021, the commission and statutory plans still have their own chapters.",
    meaning:"The reform endured in the way Shenzhen governs development permissions. Its strongest constraints apply where statutory plans have been adopted.",
    refs:["planningCurrent","planningTransfer"]}
];

const pages = Object.fromEntries([...document.querySelectorAll(".screen")].map(el => [el.id,el]));
const timeline = document.querySelector("#timeline");
const pins = document.querySelector("#pins");
const record = document.querySelector("#record");
let currentRecord = 0;
let page = "home";

function link(title,url) {
  return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + title + '</a>';
}

function localizedSource(key) {
  const [title,url,summary] = sources[key];
  const translated = language === "zh" ? (storySourcesZh[key] ?? chineseSources[key]) : [title,summary];
  return [translated[0],url,translated[1]];
}

function localizedRecord(index) {
  const item = records[index];
  return language === "zh" ? {...item,...chineseRecords[index]} : item;
}

const moduleHeader = document.querySelector(".top");
const moduleComet = document.querySelector(".header-comet");
const cometContext = moduleComet.getContext("2d");
let cometFrame=0;

function finishModuleComet() {
  cancelAnimationFrame(cometFrame);
  moduleHeader.classList.remove("top-arrival");
}

function launchModuleComet(origin) {
  gameAudio.effect("meteorFlight");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  finishModuleComet();
  const width=window.innerWidth;
  const height=window.innerHeight;
  const ratio=Math.min(2,window.devicePixelRatio || 1);
  moduleComet.width=Math.round(width*ratio);
  moduleComet.height=Math.round(height*ratio);
  cometContext.setTransform(ratio,0,0,ratio,0,0);
  const headerY=Math.round(moduleHeader.offsetHeight*.44) || 26;
  moduleHeader.style.setProperty("--header-front","-48px");
  moduleHeader.classList.add("top-arrival");
  const start=performance.now();
  const takeoff=710;
  const traverse=1230;
  function point(time) {
    if(time>=takeoff) return [17+(width+92)*(time-takeoff)/traverse,headerY];
    const u=Math.max(0,time/takeoff);
    const v=1-u;
    return [
      v*v*v*origin.x + 3*v*v*u*(origin.x+90) + 3*v*u*u*(-88) + u*u*u*17,
      v*v*v*origin.y + 3*v*v*u*(origin.y-92) + (3*v*u*u+u*u*u)*headerY
    ];
  }
  function draw(now) {
    const elapsed=now-start;
    if(elapsed>=takeoff+traverse+210) {
      finishModuleComet();
      return;
    }
    const ctx=cometContext;
    ctx.clearRect(0,0,width,height);
    const [x,y]=point(elapsed);
    if(elapsed>=takeoff) moduleHeader.style.setProperty("--header-front",Math.max(-48,x-78)+"px");
    const fade=1-Math.max(0,(elapsed-takeoff-traverse)/210);
    for(let index=22;index>=1;index--) {
      const time=elapsed-index*15;
      if(time<0) continue;
      const [a,b]=point(time),[c,d]=point(time+16);
      const intensity=(1-index/24)*fade;
      ctx.globalAlpha=intensity*.69;
      ctx.lineWidth=Math.max(1,17-index*.63);
      ctx.strokeStyle=index<7?"#ffdf85":index<15?"#e8bd72":"#779a9d";
      ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();
      ctx.globalAlpha=intensity*.86;
      ctx.fillStyle="#ffe39b";
      ctx.fillRect(Math.round(a+(index%3-1)*9),Math.round(b+(index%2?1:-1)*(4+index*.62)),index<9?4:2,2);
    }
    ctx.globalAlpha=fade;
    const glow=ctx.createRadialGradient(x,y,6,x,y,42);
    glow.addColorStop(0,"#ffdb86e2");
    glow.addColorStop(1,"#f9c16d00");
    ctx.fillStyle=glow;
    ctx.fillRect(x-42,y-42,84,84);
    ctx.fillStyle="#fff5bf";
    ctx.fillRect(x-3,y-19,6,38);ctx.fillRect(x-19,y-3,38,6);
    ctx.fillRect(x-10,y-7,20,14);ctx.fillRect(x-7,y-10,14,20);
    ctx.fillStyle="#fffefa";
    ctx.fillRect(x-4,y-6,8,12);ctx.fillRect(x-6,y-4,12,8);
    ctx.globalAlpha=1;
    cometFrame=requestAnimationFrame(draw);
  }
  draw(start);
}

function show(target, focus = true) {
  if (target === "home") finishModuleComet();
  if (page === "run" && target !== "run") resetRunnerEntrance();
  if (page === "archive" && target !== "archive"){
    stopStoryPlayback();
    cancelDeskTransition();
  }
  page = target;
  document.body.dataset.screen = target;
  gameAudio.route(target, target === "run" && run.status === "playing", target === "run" ? run.stage : 0);
  Object.entries(pages).forEach(([id,section]) => { section.hidden = id !== target; });
  document.querySelectorAll("nav button").forEach(button => {
    if (button.dataset.go === target) button.setAttribute("aria-current","page");
    else button.removeAttribute("aria-current");
  });
  setHomeSceneVisible(target === "home");
  if (target === "play") renderGame();
  if (target === "run") showRunner();
  if (target === "archive" && currentDeskView === "atlas") {
    renderArchiveControls();
    selectRecord(currentRecord);
    renderMapView();
  }
  if (focus) {
    window.scrollTo(0,0);
    (target==="archive"?deskFocusTarget():target==="run" && !runnerGame.hidden?runnerGame.querySelector(".runner-frame"):pages[target].querySelector("h1")).focus({preventScroll:true});
  }
}

function go(target, origin, recordId) {
  const fromHome = page === "home" && target !== "home";
  const hash = "#" + target + (target === "archive" && recordId ? "/" + recordId : "");
  if (location.hash !== hash) history.pushState(null,"",hash);
  handleLocation();
  if (fromHome && origin) launchModuleComet(origin);
}

function handleLocation(focus = true) {
  const [target,id] = location.hash.slice(1).split("/");
  const index = target === "archive" ? records.findIndex(item => item.id === id) : -1;
  if (target === "archive") {
    const view=index>=0?"atlas":Object.hasOwn(deskPanels,id)?id:"desk";
    const enteringAtlas=view==="atlas" && (page!=="archive" || currentDeskView!=="atlas");
    setDeskView(view);
    if(view==="atlas"){
      if(index>=0) currentRecord=index;
      setAtlasMode(index>=0,enteringAtlas);
    }
  }
  show(Object.hasOwn(pages,target) ? target : "home",focus);
}

function media(item) {
  if (item.documentRef) {
    return '<figure class="record-media source-folio"><div><p class="eyebrow">' + t("storyEvidence") +
      '</p><strong>' + localizedSource(item.documentRef)[0] +
      '</strong></div><figcaption>' + storyRef(item.documentRef) + '</figcaption></figure>';
  }
  if (item.document) {
    return '<figure class="record-media gazette"><div class="gazette-paper" lang="zh-CN"><div>深圳市人民代表大会常务委员会公告</div><small>第六十二号 · 1998年7月15日 · 政府公报</small><strong>深圳市城市规划条例</strong><small>1998年5月15日通过 · 1998年7月1日起施行</small><i></i><span>第四章　法定图则</span></div><figcaption>' + t("gazette") + '</figcaption></figure>';
  }
  const [file,alt,caption,credit] = item.image;
  const creditName = credit && (language === "zh" ? chineseCredits[credit] : imageCredits[credit][0]);
  return '<figure class="record-media"><a class="record-image-link" href="assets/' + file + '" target="_blank" rel="noopener noreferrer"><img src="assets/' + file + '" alt="' + (item.alt ?? alt) + '"></a><figcaption>' + (item.caption ?? caption) +
    (credit ? ' · ' + link(creditName,imageCredits[credit][1]) : '') +
    (credit === "hk" ? ' · ' + link("CC BY-SA 3.0","https://creativecommons.org/licenses/by-sa/3.0/") + ' ' + t("resized") : '') +
    (item.id === "law" ? ' · ' + link(t("regulation"),"assets/land-regulation.pdf") : '') + '</figcaption></figure>';
}

function selectRecord(index, animate = false) {
  currentRecord = index;
  const item = localizedRecord(index);
  document.querySelectorAll("[data-record]").forEach(button => {
    button.setAttribute("aria-pressed",String(atlasSection.dataset.atlasMode==="detail" && Number(button.dataset.record) === index));
  });
  const economics = item.id === "auction"
    ? '<dl class="auction-facts"><div><dt>' + t("auctionRevenue") + '</dt><dd>' + t("auctionValue") +
      '</dd></div><div><dt>' + t("auctionTerm") + '</dt><dd>' + t("auctionYears") + '</dd></div></dl>'
    : "";
  record.innerHTML = media(item) + '<div class="record-body"><p class="eyebrow">' + item.date + ' · ' + item.place + '</p>' +
     '<h2 tabindex="-1">' + item.title + '</h2>' + economics + storyRecordFields(item) +
    storyRecordEvidence(item) + '</div>';
  updateStoryMap();
  if (animate) {
    animateMapSelection(index);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      record.getAnimations().forEach(animation=>animation.cancel());
      record.animate([
        {transform:"translate(-18px,12px)",opacity:0,clipPath:"inset(0 100% 0 0)"},
        {transform:"translate(0,0)",opacity:1,clipPath:"inset(0 0 0 0)"}
      ],{duration:390,easing:"cubic-bezier(.22,.7,.26,1)"});
    }
  }
}

function renderArchiveControls() {
  pins.replaceChildren();
  timeline.replaceChildren();
  records.forEach(({id,date,x,y},index) => {
    const {title} = localizedRecord(index);
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "pin";
    pin.dataset.record = index;
    pin.setAttribute("aria-label",date + " " + title);
    pin.title=date + " · " + title;
    pin.style.left = x + "%";
    pin.style.top = y + "%";
    pin.innerHTML = '<span class="pin-ring" aria-hidden="true"></span><span class="pin-face" aria-hidden="true">' + (index+1) + '</span>';
    pin.insertAdjacentHTML("beforeend", '<span class="pin-name" aria-hidden="true">' + storyLine(atlasPinNames[id]) + '</span>');
    pins.append(pin);
    const entry = document.createElement("button");
    entry.type = "button";
    entry.dataset.record = index;
    if (originsArchive.has(records[index].id)) entry.classList.add("origins-linked-record");
    entry.innerHTML = '<strong>' + date + '</strong><span>' + title + '</span>' + (originsArchive.has(records[index].id) ? '<small class="origins-record-mark">' + originText(["Found in Origins","剧情关联"]) + '</small>' : '');
    timeline.append(entry);
  });
}

function renderSources() {
  pages.sources.innerHTML = '<div class="section-head"><p class="eyebrow">BUILD SHENZHEN</p><h1 tabindex="-1">' + t("sources") + '</h1><p>' + t("sourcesAbout") + '</p></div><ol>' +
    Object.keys(sources).map(key=>{
      const [title,url,summary] = localizedSource(key);
      return '<li>' + link(title,url) + '<p>' + summary + '</p></li>';
    }).join("") +
    '</ol><details><summary>' + t("photos") + '</summary><p>' + t("photosAbout") + '</p></details>' +
    '<details><summary>' + t("process") + '</summary><p>' + t("processBody") + '</p></details>' +
    '<div class="actions"><button class="secondary" data-go="archive">' + t("backToMap") + '</button></div>';
}

function changeLanguage(nextLanguage) {
  if (nextLanguage === language) return;
  language = nextLanguage;
  try { localStorage.setItem("build-shenzhen-language",language); } catch {}
  updateInterfaceLanguage();
  gameAudio.refreshLabels();
  renderArchiveControls();
  renderSources();
  renderStoryTools();
  show(page,false);
  if (tour.open) renderTour(false);
}

document.addEventListener("click",event=>{
  const button=event.target.closest("button:not(:disabled), a.brand");
  if (!button) return;
  const bounds=button.getBoundingClientRect();
  const imprint=document.createElement("span");
  imprint.className="click-imprint";
  imprint.setAttribute("aria-hidden","true");
  const x=event.detail ? event.clientX : bounds.left+bounds.width/2;
  const y=event.detail ? event.clientY : bounds.top+bounds.height/2;
  Object.assign(imprint.style,{left:(x-9)+"px",top:(y-9)+"px"});
  if (!button.classList.contains("pin") && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    button.animate([
      {transform:"translateY(2px) scale(.96)", filter:"brightness(1.24)"},
      {transform:"none", filter:"none"}
    ],{duration:220,easing:"ease-out"});
  }
  document.body.append(imprint);
  window.setTimeout(()=>imprint.remove(),400);
},true);

document.addEventListener("click",event => {
  const control = event.target.closest("[data-go], [data-record], [data-lang]");
  if (!control) return;
  if (control.dataset.lang) {
    changeLanguage(control.dataset.lang);
  } else if (control.dataset.go) {
    event.preventDefault();
    const bounds=control.getBoundingClientRect();
    const origin={
      x:event.detail?event.clientX:bounds.left+bounds.width/2,
      y:event.detail?event.clientY:bounds.top+bounds.height/2
    };
    if (page === "home" && control.closest(".home-menu") && guideUnseen()) {
      go(control.dataset.go);
      startTour(pages[page].querySelector("h1"),true);
      return;
    }
    go(control.dataset.go,origin,control.dataset.openRecord);
  } else if (control.dataset.record !== undefined) {
    gameAudio.effect("mapPin");
    stopStoryPlayback();
    chooseStoryRecord(Number(control.dataset.record));
    record.querySelector("h2").focus({preventScroll:true});
    if (matchMedia("(max-width: 760px)").matches) record.scrollIntoView({block:"start"});
  }
});

window.addEventListener("popstate",()=>handleLocation());
window.addEventListener("hashchange",()=>handleLocation());
updateInterfaceLanguage();
renderArchiveControls();
renderSources();
renderStoryTools();
handleLocation(false);
