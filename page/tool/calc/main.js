import XP from "./type/xp.js";
import Distance from "./type/distance.js";

const tools = {
  xp: XP,
  distance: Distance
};

const menu = document.getElementById("menu");
const view = document.getElementById("view");

function load(name){
  if(!tools[name]) name = "xp"; // fallback

  view.innerHTML="";
  view.appendChild(tools[name]());
  history.pushState({}, "", `/tools/${name}`);
  setActive(name);
}

function setActive(name){
  document.querySelectorAll(".TOOL_BTN")
    .forEach(b=>b.classList.toggle("active", b.dataset.tool===name));
}

Object.keys(tools).forEach(name=>{
  const btn=document.createElement("div");
  btn.textContent=name;
  btn.className="TOOL_BTN";
  btn.dataset.tool=name;
  btn.onclick=()=>load(name);
  menu.appendChild(btn);
});

const start = location.pathname.split("/")[2] || "xp";
load(start);

window.onpopstate=()=>{
  const tool = location.pathname.split("/")[2] || "xp";
  load(tool);
};