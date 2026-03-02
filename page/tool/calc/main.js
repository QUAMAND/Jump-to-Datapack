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

/**
 * 도구 로드
 * @param {string} name 도구 이름
 * @param {boolean} isPopState 앞/뒤 실행 여부
 */

function load(name, isPopState = false) {
   if (!tools[name]) name = Object.keys(tools)[0]

   VIEW.innerHTML = ""
   VIEW.appendChild(tools[name]())

   const newUrl = `?calc=${encodeURIComponent(name)}`
   if (!isPopState && location.search !== newUrl) {
      history.pushState({tool: name}, "", newUrl)
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

/**
 * 브라우저 앞/뒤로 가기 이벤트
 */
window.onpopstate = (event) => {
   const TOOL = (event.state && event.state.tool) 
      ? event.state.tool 
      : new URLSearchParams(location.search).get('calc') || Object.keys(tools)[0]
   load(TOOL, true)
}