import ChunkPos from "./type/ChunkPos.js"
import NetherPos from "./type/NetherPos.js"
import Color from "./type/Color.js"
import EntityInFOV from "./type/EntityInFOV.js"

const tools = {
   'Chunk Pos': ChunkPos,
   'Nether-Overworld Pos': NetherPos,
   'Color': Color,
   'Entity Look-at Detector': EntityInFOV
}

const MENU = document.getElementById("SIDEBAR")
const VIEW = document.getElementById("CALC_VIEW")

function load(name) {
   if (!tools[name]) name = Object.keys(tools)[0]

   VIEW.innerHTML = ""
   VIEW.appendChild(tools[name]())

   const newUrl = `?calc=${name}`
   if (location.search !== newUrl) {
      history.pushState({}, "", newUrl)
   }
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

const START = new URLSearchParams(location.search).get('calc') || Object.keys(tools)[0]
load(START)

window.onpopstate = () => {
   const TOOL = new URLSearchParams(location.search).get('calc') || Object.keys(tools)[0]
   load(TOOL)
}