import * as NBT from 'https://cdn.jsdelivr.net/npm/nbtify@2.1.0/+esm'

export default function datFile(type = 'nbt') {
   const container = document.createElement('div')
   container.style.height = "100%"
   container.innerHTML = `
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
      </div>`

   const DROP_ZONE = container.querySelector('#DROP_ZONE')
   const FILE_INPUT = container.querySelector('#FILE_INPUT')
   const EDITOR = container.querySelector('#NBT_EDITOR')
   const TREE = container.querySelector('#NBT_TREE')
   const FILE_NAME = container.querySelector('#NBT_FILENAME')

   let currentNBT = null
   let currentFile = null

   // 이벤트 바인딩
   DROP_ZONE.onclick = () => FILE_INPUT.click()
   DROP_ZONE.ondragover = e => { e.preventDefault(); DROP_ZONE.classList.add('drag') }
   DROP_ZONE.ondragleave = () => DROP_ZONE.classList.remove('drag')
   DROP_ZONE.ondrop = e => {
      e.preventDefault()
      DROP_ZONE.classList.remove('drag')
      if (e.dataTransfer.files[0]) handleLoadFile(e.dataTransfer.files[0])
   }
   FILE_INPUT.onchange = () => {
      if (FILE_INPUT.files[0]) handleLoadFile(FILE_INPUT.files[0])
   }

   container.querySelector('#BTN_OPEN').onclick = () => FILE_INPUT.click()
   container.querySelector('#BTN_EXPAND').onclick = () => toggleAll(true)
   container.querySelector('#BTN_COLLAPSE').onclick = () => toggleAll(false)
   container.querySelector('#BTN_SAVE').onclick = handleSaveFile

   async function handleLoadFile(file) {
      currentFile = file
      try {
         const buffer = await file.arrayBuffer()
         currentNBT = await NBT.read(buffer)
         FILE_NAME.textContent = file.name
         DROP_ZONE.style.display = 'none'
         EDITOR.style.display = 'flex'
         renderNBTTree(currentNBT.data, TREE, 0)
      } catch(e) { alert('파일 로드 실패: ' + e.message) }
   }

   async function handleSaveFile() {
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
      } catch(e) { alert('저장 실패: ' + e.message) }
   }

   function toggleAll(open) {
      TREE.querySelectorAll('.NBT_CHILDREN').forEach(c => {
         c.style.display = open ? 'block' : 'none'
         const arrow = c.previousElementSibling?.querySelector('.NBT_ARROW')
         if (arrow) arrow.textContent = open ? '▼' : '▶'
      })
   }

   function renderNBTTree(obj, target, depth) {
      target.innerHTML = ''
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
               <span class="NBT_COUNT">${isArr ? `[${value.length}]` : `{${Object.keys(value).length}}`}</span>`
            
            const children = document.createElement('div')
            children.className = 'NBT_CHILDREN'
            children.style.display = 'none'

            renderNBTTree(isArr ? {...value} : value, children, depth + 1)

            header.onclick = () => {
               const isOpen = children.style.display !== 'none'
               children.style.display = isOpen ? 'none' : 'block'
               header.querySelector('.NBT_ARROW').textContent = isOpen ? '▶' : '▼'
            }

            row.appendChild(header)
            row.appendChild(children)
         } else {
            row.classList.add('NBT_LEAF')
            row.innerHTML = `
               <span class="NBT_ICON" style="color:var(--accent-cyan)">${getIcon(type)}</span>
               <span class="NBT_KEY">${key}</span>
               <span class="NBT_TYPE">${type}</span>`
            
            const input = createInput(type, value, (val) => { obj[key] = val })
            row.appendChild(input)
         }
         target.appendChild(row)
      }
   }

   function getNBTtype(v) {
      if (v === null) return 'null'
      if (Array.isArray(v)) return 'array'
      if (v instanceof Int8Array) return 'byte[]'
      if (v instanceof Int32Array) return 'int[]'
      if (v instanceof BigInt64Array) return 'long[]'
      if (typeof v === 'object') return 'object'
      if (typeof v === 'bigint') return 'long'
      if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float'
      if (typeof v === 'string') return 'string'
      return typeof v
   }

   function getIcon(t) {
      const i = { string:'S', int:'I', float:'F', long:'L', byte:'B' }
      return i[t] || 'P'
   }

   function createInput(t, v, cb) {
      const i = document.createElement('input')
      i.className = 'INPUT NBT_INPUT'
      if (t === 'byte') {
         i.type = 'checkbox'
         i.checked = !!v
         i.onchange = () => cb(i.checked ? 1 : 0)
      } else {
         i.type = (t === 'string') ? 'text' : 'number'
         i.value = v?.toString() ?? ''
         i.onchange = () => cb(t === 'string' ? i.value : (t === 'long' ? BigInt(i.value) : Number(i.value)))
      }
      return i
   }

   return container
}