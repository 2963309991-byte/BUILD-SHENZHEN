"use strict";

const tour = document.querySelector("#tour");
const tourCard = document.querySelector("#tour-card");
const tourSpotlight = document.querySelector("#tour-spotlight");
const tourTitle = document.querySelector("#tour-title");
const tourNext = document.querySelector("#tour-next");
const tourBack = document.querySelector("#tour-back");
const cat = document.querySelector("#guide-cat").getContext("2d");
const tourMotion = matchMedia("(prefers-reduced-motion: reduce)");
const tourStorage = "build-shenzhen-guide-v3";
const tourStops = [
  ["play","play","Psst! Meet the pixel planning team and make a few choices. They’ll show you why Shenzhen looked to Hong Kong for ideas and what had to change to make them work here.","喵！来和像素规划团队聊聊，做几次选择，看看深圳为什么向香港学习，又怎样把学来的做法改成适合本地的制度。"],
  ["archive","map","My favorite stop! At the research desk, open the historical atlas first to follow the evidence. Then try the book, magnifier and coins for knowledge transfer, city comparisons and budget choices.","这是我最推荐的一站，也是作品的核心！到研究书桌先打开历史地图查证据，再用书本、放大镜和钱币探索知识传播、深港对比和预算取舍。"],
  ["run","homeRun","Time to stretch those paws. Collect coins in the pixel city and build new facilities. Your coins are game points; the historical evidence is back at the desk.","该活动活动爪子啦！在像素城市里收集金币、建造设施。金币是游戏积分，真实的历史证据可以回书桌查阅。"],
  ["sources","sources","Found a clue you want to check? The sources page brings together the historical records, research and photo credits used at the desk.","想核查刚找到的线索？史料来源页汇集了研究书桌使用的历史档案、研究和图片出处。"]
];
let tourSeen = false;
let tourIndex = 0;
let tourTrigger = null;
let tourFirstVisit = false;
let tourScroll = 0;
let catFrame = 0;
let catStarted = 0;
try { tourSeen = localStorage.getItem(tourStorage) === "seen"; } catch {}

function guideUnseen() {
  return !tourSeen;
}

function positionTour() {
  if (!tour.open) return;
  const target = document.querySelector('.top nav [data-go="'+tourStops[tourIndex][0]+'"]');
  const bounds = target.getBoundingClientRect();
  const width = tour.clientWidth;
  const pad = width <= 480 ? 3 : 5;
  const center = bounds.left + bounds.width / 2;
  const left = Math.min(width-tourCard.offsetWidth-12,Math.max(12,center-tourCard.offsetWidth/2));
  const top = bounds.bottom + (width <= 480 ? 52 : 59);
  Object.assign(tourSpotlight.style,{
    left:bounds.left-pad+"px",top:bounds.top-pad+"px",
    width:bounds.width+pad*2+"px",height:bounds.height+pad*2+"px"
  });
  tourCard.style.setProperty("--guide-left",left+"px");
  tourCard.style.setProperty("--guide-top",top+"px");
  tourCard.style.setProperty("--guide-pointer",Math.max(10,Math.min(tourCard.offsetWidth-25,center-left-7))+"px");
  tourCard.style.maxHeight=Math.max(78,tour.clientHeight-top-12)+"px";
}

function animateGuideCat(now) {
  drawGuideCat(cat,tourIndex,now-catStarted);
  catFrame = requestAnimationFrame(animateGuideCat);
}

function renderTour(focus = true) {
  const [route,label,en,zh] = tourStops[tourIndex];
  tourCard.dataset.stop = route;
  document.querySelector("#tour-step").textContent = (language==="zh" ? "档案猫" : "Archive Cat") + " · " + (tourIndex + 1) + " / " + tourStops.length;
  tourTitle.textContent = t(label);
  document.querySelector("#tour-copy").textContent = language==="zh" ? zh : en;
  tourBack.disabled = tourIndex === 0;
  tourNext.textContent = t(tourIndex === tourStops.length-1 ? "guideDone" : "guideNext");
  catStarted = performance.now();
  drawGuideCat(cat,tourIndex,0);
  positionTour();
  if (focus) tourTitle.focus({preventScroll:true});
  tourCard.getBoundingClientRect();
  tour.classList.add("guide-placed");
}

function startTour(trigger, firstVisit = false) {
  tourTrigger = trigger;
  tourFirstVisit = firstVisit;
  tourIndex = 0;
  tourScroll = window.scrollY;
  window.scrollTo(0,0);
  finishModuleComet();
  tour.showModal();
  renderTour();
  if (!tourMotion.matches) catFrame = requestAnimationFrame(animateGuideCat);
}

function closeTour(remember = true) {
  cancelAnimationFrame(catFrame);
  if (remember) {
    tourSeen = true;
    try { localStorage.setItem(tourStorage,"seen"); } catch {}
  }
  tour.close();
  tour.classList.remove("guide-placed");
  if (remember && tourTrigger?.isConnected) {
    if (!tourFirstVisit) window.scrollTo(0,tourScroll);
    tourTrigger.focus({preventScroll:true});
  }
  tourTrigger = null;
}

document.querySelectorAll("[data-guide-open]").forEach(button => {
  button.addEventListener("click",() => startTour(button));
});
document.querySelector("#tour-skip").addEventListener("click",() => closeTour());
tourBack.addEventListener("click",() => {
  tourIndex--;
  renderTour();
});
tourNext.addEventListener("click",() => {
  if (tourIndex === tourStops.length-1) closeTour();
  else {
    tourIndex++;
    renderTour();
  }
});
tour.addEventListener("cancel",event => {
  event.preventDefault();
  closeTour();
});
window.addEventListener("resize",positionTour);
window.addEventListener("popstate",() => { if (tour.open) closeTour(false); });
