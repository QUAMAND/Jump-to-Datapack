import * as NBT from 'https://cdn.jsdelivr.net/npm/nbtify@2.1.0/+esm'
import Viewer from './Viewer.js'  // ← 이게 있으면 HTML에 따로 안 넣어도 됨

const VIEW = document.getElementById('EDIT_VIEW')
const MENU = document.getElementById('EDIT_MENU')

// ── 사이드바 메뉴 ─────────────────────────────
MENU.innerHTML = `
   <div class="TOOL_ITEM active" data-tool="dat">📄 .dat Editor</div>
   <div class="TOOL_ITEM" data-tool="nbt">📦 .nbt Editor</div>
   <div class="TOOL_ITEM" data-tool="viewer">🧊 .nbt 3D Viewer</div>
`
MENU.querySelectorAll('.TOOL_ITEM').forEach(item => {
   item.addEventListener('click', () => {
      MENU.querySelectorAll('.TOOL_ITEM').forEach(i => i.classList.remove('active'))
      item.classList.add('active')
      if (item.dataset.tool === 'viewer') {
         VIEW.classList.remove('scroll')  // 뷰어는 스크롤 없음
         VIEW.innerHTML = ''
         VIEW.appendChild(Viewer())
      } else {
         VIEW.classList.add('scroll')     // 에디터는 스크롤 있음
         LOAD_EDITOR(item.dataset.tool)
      }
   })
})

function LOAD_EDITOR(type) {
   VIEW.innerHTML = `
      <div id="DROP_ZONE">
         <div id="DROP_INNER">
            <img src="assets/img/page/edit.png" width="64"/>
            <p>.${type} 파일을 드래그하거나 클릭해서 여세요</p>
            <input type="file" id="FILE_INPUT" accept=".${type}" style="display:none"/>
         </div>
      </div>
      <div id="NBT_EDITOR" style="display:none">
         <div id="NBT_TOPBAR">
            <span id="NBT_FILENAME"></span>
            <div id="NBT_ACTIONS">
               <button class="EDIT_BTN" id="BTN_OPEN">📂 다른 파일</button>
               <button class="EDIT_BTN" id="BTN_EXPAND">▼ 모두 열기</button>
               <button class="EDIT_BTN" id="BTN_COLLAPSE">▶ 모두 닫기</button>
               <button class="EDIT_BTN accent" id="BTN_SAVE">💾 저장</button>
            </div>
         </div>
         <div id="NBT_TREE"></div>
      </div>
   `

   const DROP_ZONE  = VIEW.querySelector('#DROP_ZONE')
   const FILE_INPUT = VIEW.querySelector('#FILE_INPUT')
   const EDITOR    = VIEW.querySelector('#NBT_EDITOR')
   const TREE      = VIEW.querySelector('#NBT_TREE')
   const FILE_NAME  = VIEW.querySelector('#NBT_FILENAME')

   let currentNBT  = null
   let currentFile = null

   // Drag & Drop
   DROP_ZONE.addEventListener('click', () => FILE_INPUT.click())
   DROP_ZONE.addEventListener('dragover', e => { e.preventDefault(); DROP_ZONE.classList.add('drag') })
   DROP_ZONE.addEventListener('dragleave', () => DROP_ZONE.classList.remove('drag'))
   DROP_ZONE.addEventListener('drop', e => {
      e.preventDefault()
      DROP_ZONE.classList.remove('drag')
      const file = e.dataTransfer.files[0]
      if (file) LOAD_FILE(file)
   })
   FILE_INPUT.addEventListener('change', () => {
      if (FILE_INPUT.files[0]) LOAD_FILE(FILE_INPUT.files[0])
   })

   VIEW.querySelector('#BTN_OPEN').addEventListener('click', () => FILE_INPUT.click())
   VIEW.querySelector('#BTN_SAVE').addEventListener('click', SAVE_FILE)
   VIEW.querySelector('#BTN_EXPAND').addEventListener('click', () => toggleAll(true))
   VIEW.querySelector('#BTN_COLLAPSE').addEventListener('click', () => toggleAll(false))

   function toggleAll(open) {
      TREE.querySelectorAll('.NBT_CHILDREN').forEach(c => {
         c.style.display = open ? 'block' : 'none'
         const arrow = c.previousElementSibling?.querySelector('.NBT_ARROW')
         if (arrow) arrow.textContent = open ? '▼' : '▶'
      })
   }

   async function LOAD_FILE(file) {
      currentFile = file
      try {
         const buffer = await file.arrayBuffer()
         currentNBT = await NBT.read(buffer)
         console.log(currentNBT)
         FILE_NAME.textContent = file.name
         DROP_ZONE.style.display = 'none'
         EDITOR.style.display = 'flex'
         RENDER_TREE(currentNBT.data, TREE, 0)
      } catch(e) {
         alert('파일을 읽을 수 없습니다: ' + e.message)
      }
   }

   async function SAVE_FILE() {
      if (!currentNBT) return
      try {
         const buffer = await NBT.write(currentNBT.data, {
            rootName: currentNBT.rootName,
            endian: currentNBT.endian,
            compression: currentNBT.compression
         })
         const blob = new Blob([buffer])
         const a = document.createElement('a')
         a.href = URL.createObjectURL(blob)
         a.download = currentFile.name
         a.click()
      } catch(e) {
         alert('저장 실패: ' + e.message)
      }
   }

   function RENDER_TREE(obj, container, depth) {
      container.innerHTML = ''
      for (const [key, value] of Object.entries(obj)) {
         const row = document.createElement('div')
         row.className = 'NBT_ROW'
         row.style.paddingLeft = `${depth * 16}px`

         const type = getNBTtype(value)

         if (type === 'object' || type === 'array') {
            const isArr = type === 'array'
            const header = document.createElement('div')
            header.className = 'NBT_HEADER'
            header.innerHTML = `
               <span class="NBT_ARROW">▶</span>
               <span class="NBT_ICON">${isArr ? '📋' : '📁'}</span>
               <span class="NBT_KEY">${key}</span>
               <span class="NBT_COUNT">${isArr ? `[${value.length}]` : `{${Object.keys(value).length}}`}</span>
            `
            const children = document.createElement('div')
            children.className = 'NBT_CHILDREN'
            children.style.display = 'none'

            RENDER_TREE(isArr ? {...value} : value, children, depth + 1)

            header.addEventListener('click', () => {
               const open = children.style.display !== 'none'
               children.style.display = open ? 'none' : 'block'
               header.querySelector('.NBT_ARROW').textContent = open ? '▶' : '▼'
            })

            row.appendChild(header)
            row.appendChild(children)
         } else {
            row.className += ' NBT_LEAF'
            row.innerHTML = `
               <span class="NBT_ICON" style="color:var(--accent-cyan); font-family: 'Minecraft-Event'">${getIcon(type)}</span>
               <span class="NBT_KEY">${key}</span>
               <span class="NBT_TYPE">${type}</span>
            `
            const input = createInput(type, value, (newVal) => { obj[key] = newVal })
            row.appendChild(input)
         }

         container.appendChild(row)
      }
   }
}

LOAD_EDITOR('dat')
VIEW.classList.add('scroll')

function getNBTtype(value) {
   if (value === null) return 'null'
   if (Array.isArray(value)) return 'array'
   if (value instanceof Int8Array)     return 'byte[]'
   if (value instanceof Int32Array)    return 'int[]'
   if (value instanceof BigInt64Array) return 'long[]'
   if (typeof value === 'object')      return 'object'
   if (typeof value === 'bigint')      return 'long'
   if (typeof value === 'number')      return Number.isInteger(value) ? 'int' : 'float'
   if (typeof value === 'string')      return 'string'
   if (typeof value === 'boolean')     return 'byte'
   return typeof value
}

function getIcon(type) {
   const icons = {
      string: 'String', int: 'Int', float: 'Float', long: 'Long',
      byte: 'Byte', 'byte[]': 'Byte[]', 'int[]': 'Int[]', 'long[]': 'Long[]'
   }
   return icons[type] || '❓'
}

function createInput(type, value, onChange) {
   const input = document.createElement('input')
   input.className = 'INPUT NBT_INPUT'

   if (type === 'byte' || type === 'boolean') {
      input.type = 'checkbox'
      input.checked = !!value
      input.addEventListener('change', () => onChange(input.checked ? 1 : 0))
      return input
   }

   input.type = (type === 'string') ? 'text' : 'number'
   input.value = value?.toString() ?? ''
   if (type === 'int' || type === 'byte') input.step = '1'
   if (type === 'float') input.step = 'any'
   if (type === 'long') input.step = '1'

   input.addEventListener('change', () => {
      if (type === 'string') onChange(input.value)
      else if (type === 'long') onChange(BigInt(input.value))
      else onChange(Number(input.value))
   })

   return input
}