"use strict";

const mapView = document.querySelector("#map-view");
const mapWorld = document.querySelector("#map-world");
const mapScale = document.querySelector("#map-scale");
const mapButtons = Object.fromEntries([...mapView.querySelectorAll("[data-map-action]")].map(button => [button.dataset.mapAction,button]));
const pointers = new Map();
const minScale = 1;
const maxScale = 3;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let dragged = false;

const clamp = (number, low, high) => Math.max(low,Math.min(high,number));

function renderMapView() {
  const width = mapWorld.offsetWidth;
  const height = mapWorld.offsetHeight;
  if (!width || !height) return;
  offsetX = clamp(offsetX, width * (1 - scale), 0);
  offsetY = clamp(offsetY, height * (1 - scale), 0);
  mapWorld.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px) scale(' + scale + ')';
  mapWorld.style.setProperty("--label-scale", 1 / scale);
  mapView.dataset.zoomed = String(scale > minScale);
  const label = Math.round(scale * 100) + "%";
  if (mapScale.value !== label) mapScale.value = label;
  mapButtons.out.disabled = scale <= minScale;
  mapButtons.in.disabled = scale >= maxScale;
}

function zoomMap(nextScale, anchorX = mapWorld.offsetWidth / 2, anchorY = mapWorld.offsetHeight / 2) {
  const previous = scale;
  scale = clamp(nextScale,minScale,maxScale);
  offsetX = anchorX - (anchorX - offsetX) * (scale / previous);
  offsetY = anchorY - (anchorY - offsetY) * (scale / previous);
  renderMapView();
}

function mapPoint(event) {
  const bounds = mapView.getBoundingClientRect();
  return {x:event.clientX - bounds.left - mapView.clientLeft,y:event.clientY - bounds.top - mapView.clientTop};
}

function mapMovement() {
  const [first,second] = [...pointers.values()];
  return second
    ? {x:(first.x + second.x)/2,y:(first.y + second.y)/2,distance:Math.hypot(first.x - second.x,first.y - second.y)}
    : {x:first.x,y:first.y,distance:0};
}

mapView.addEventListener("pointerdown", event => {
  if (event.button !== 0 || event.target.closest(".map-controls")) return;
  if (!pointers.size) dragged = false;
  if (pointers.size >= 2) return;
  pointers.set(event.pointerId,mapPoint(event));
  if (pointers.size === 2) {
    dragged = true;
    pointers.forEach((_,id) => mapView.setPointerCapture(id));
  }
});

mapView.addEventListener("pointermove", event => {
  if (!pointers.has(event.pointerId)) return;
  const current = mapPoint(event);
  const previousPoint = pointers.get(event.pointerId);
  if (!dragged && Math.hypot(current.x - previousPoint.x,current.y - previousPoint.y) < 5) return;
  if (pointers.size === 1 && scale === minScale) return;
  if (!dragged) mapView.setPointerCapture(event.pointerId);
  dragged = true;
  mapView.classList.add("dragging");
  const previous = mapMovement();
  pointers.set(event.pointerId,current);
  const next = mapMovement();
  offsetX += next.x - previous.x;
  offsetY += next.y - previous.y;
  if (previous.distance > 0 && next.distance > 0) {
    zoomMap(scale * next.distance / previous.distance,next.x,next.y);
  } else {
    renderMapView();
  }
});

function endMapPointer(event) {
  pointers.delete(event.pointerId);
  if (!pointers.size) mapView.classList.remove("dragging");
}
["pointerup","pointercancel","lostpointercapture"].forEach(type=>mapView.addEventListener(type,endMapPointer));
mapView.addEventListener("pointerleave",event=>{
  if (!mapView.hasPointerCapture(event.pointerId)) endMapPointer(event);
});

mapView.addEventListener("click", event => {
  if (dragged && event.detail > 0 && !event.target.closest(".map-controls")) {
    event.preventDefault();
    event.stopPropagation();
  }
},true);

mapView.addEventListener("click", event => {
  const button = event.target.closest("[data-map-action]");
  if (!button) {
    if (!event.target.closest("button, a")) gameAudio.effect("mapTap");
    return;
  }
  const action = button.dataset.mapAction;
  if (action === "reset") zoomMap(minScale);
  else zoomMap(scale * (action === "in" ? 1.3 : 1/1.3));
});

mapView.addEventListener("wheel", event => {
  if (!event.ctrlKey && document.activeElement !== mapView) return;
  event.preventDefault();
  const anchor = mapPoint(event);
  zoomMap(scale * (event.deltaY < 0 ? 1.16 : 1/1.16),anchor.x,anchor.y);
},{passive:false});

mapView.addEventListener("keydown", event => {
  if (event.target !== mapView) return;
  const movement = {ArrowLeft:[45,0],ArrowRight:[-45,0],ArrowUp:[0,45],ArrowDown:[0,-45]};
  if (event.key === "+" || event.key === "=") zoomMap(scale*1.3);
  else if (event.key === "-") zoomMap(scale/1.3);
  else if (event.key === "0") zoomMap(minScale);
  else if (Object.hasOwn(movement,event.key) && scale > minScale) {
    offsetX += movement[event.key][0];
    offsetY += movement[event.key][1];
    renderMapView();
  } else return;
  event.preventDefault();
});

new ResizeObserver(renderMapView).observe(mapView);

function animateMapSelection(index) {
  const pin = document.querySelector('#pins [data-record="' + index + '"]');
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pin.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    pin.querySelector(".pin-face").animate([
      {transform:"translateY(0)"},{transform:"translateY(-9px)"},{transform:"translateY(0)"}
    ],{duration:320,easing:"ease-out"});
    pin.querySelector(".pin-ring").animate([
      {opacity:.95,transform:"scale(.75)"},{opacity:0,transform:"scale(1.85)"}
    ],{duration:460,easing:"ease-out"});
  }
}
