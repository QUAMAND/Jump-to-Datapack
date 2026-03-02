import datFile from './type/datFile.js'
import Viewer from './Viewer.js'

const tools = {
   'dat': () => datFile('dat'),
   'nbt': () => datFile('nbt'),
   'viewer': () => {
      const v = Viewer()
      const VIEW = document.getElementById('EDIT_VIEW')
      VIEW.classList.remove('scroll')
      return v
   }
}

const MENU = document.getElementById('SIDEBAR')
const VIEW = document.getElementById('EDIT_VIEW')

function load(name, isPopState = false) {
   if (!tools[name]) name = 'dat'

   VIEW.innerHTML = ""
   if (name !== 'viewer') VIEW.classList.add('scroll')
   
   const content = tools[name]()
   if (content) VIEW.appendChild(content)

   const newUrl = `?edit=${name}`
   if (!isPopState && window.location.search !== newUrl) {
      history.pushState({ tool: name }, "", newUrl)
   }
   
   setActive(name)
}

function setActive(name) {
   MENU.querySelectorAll(".TOOL_ITEM").forEach(t => {
      t.classList.toggle("active", t.dataset.tool === name)
   })
}

MENU.innerHTML = ""
Object.keys(tools).forEach(name => {
   const item = document.createElement("div")
   const label = name === 'viewer' ? '.nbt 3D Viewer' : `.${name} Editor`
   
   item.textContent = label
   item.className = "TOOL_ITEM"
   item.dataset.tool = name
   item.onclick = () => load(name)

   MENU.appendChild(item)
})

const params = new URLSearchParams(location.search)
const START = params.get('edit') || 'dat'
load(START)

window.onpopstate = (event) => {
   const name = (event.state && event.state.tool) 
      ? event.state.tool 
      : new URLSearchParams(location.search).get('edit') || 'dat'
   load(name, true)
}