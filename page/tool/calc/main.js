import ChunkPos from "./type/ChunkPos.js"
import NetherPos from "./type/NetherPos.js"
import Color from "./type/Color.js"

const tools = {
   'Chunk Pos': ChunkPos,
   'Nether-Overworld Pos': NetherPos,
   'Color': Color
}

const MENU = document.getElementById("CALC_MENU")
const VIEW = document.getElementById("CALC_VIEW")

function load(name) {
   if (!tools[name]) name = Object.keys(tools)[0]

   VIEW.innerHTML = ""
   VIEW.appendChild(tools[name]())
   history.pushState({}, "", `?tool=${name}`)
   setActive(name)
}

function setActive(name) {
   document.querySelectorAll(".TOOL_ITEM").forEach(t => {
      t.classList.toggle("active", t.dataset.tool === name)
   })
}

Object.keys(tools).forEach(name => {
   const CALC_ITEM = document.createElement("div")

   CALC_ITEM.textContent = name
   CALC_ITEM.className = "TOOL_ITEM"
   CALC_ITEM.dataset.tool = name
   CALC_ITEM.onclick = () => load(name)

   MENU.appendChild(CALC_ITEM)
})

const START = new URLSearchParams(location.search).get('tool') || Object.keys(tools)[0]
load(START)

window.onpopstate=()=>{
   const TOOL = new URLSearchParams(location.search).get('tool') || Object.keys(tools)[0]
   load(TOOL)
}