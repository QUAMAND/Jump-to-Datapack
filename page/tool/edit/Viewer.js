import * as NBT from 'https://cdn.jsdelivr.net/npm/nbtify@2.1.0/+esm'
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0'

const COLORS = {
   nature:  0x8b5e3c,
   stone:   0x888888,
   plant:   0x5a9e3a,
   other:   0x5577cc,
}

const NATURE_BLOCKS = ['dirt','grass_block','sand','gravel','soul_sand','mycelium','podzol','mud','clay','farmland','path','rooted_dirt','chorus_flower','chorus_plant','spore_blossom','dead_bush','sea_pickle','glow_lichen','sugar_cane','kelp_plant','hanging_roots','cactus','lily_pad','brown_mushroom','red_mushroom','saplings','small_flowers','tall_flowers','coral_plants','crops','flowers','leaves','short_grass','tall_grass','seagrass','tall_seagrass','fern','large_fern','vine','cave_vines','big_dripleaf','big_dripleaf_stem','small_dripleaf','bamboo','bamboo_sapling','coral_blocks','dead_brain_coral_block','dead_bubble_coral_block','dead_fire_coral_block','dead_horn_coral_block','dead_tube_coral_block','corals','brain_coral_fan','bubble_coral_fan','fire_coral_fan','horn_coral_fan','tube_coral_fan','dead_brain_coral','dead_bubble_coral','dead_fire_coral','dead_horn_coral','dead_tube_coral','dead_brain_coral_fan','dead_bubble_coral_fan','dead_fire_coral_fan','dead_horn_coral_fan','dead_tube_coral_fan','dead_brain_coral_wall_fan','dead_bubble_coral_wall_fan','dead_fire_coral_wall_fan','dead_horn_coral_wall_fan','dead_tube_coral_wall_fan','nether_wart','crimson_fungus','warped_fungus','nether_sprouts','crimson_roots','warped_roots','weeping_vines','weeping_vines_plant','twisting_vines']
const STONE_BLOCKS  = ['stone','cobblestone','granite','diorite','andesite','deepslate','tuff','calcite','obsidian','bedrock','netherrack','basalt','blackstone','sandstone','smooth_stone','stone_bricks','cobbled_deepslate','end_stone','magma_block','coal_ore','iron_ore','gold_ore','diamond_ore','end_stone','emerald_ore','lapis_ore','redstone_ore','copper_ore','quartz_ore','bricks','brick']
const PLANT_BLOCKS  = ['oak_leaves','birch_leaves','spruce_leaves','jungle_leaves','acacia_leaves','dark_oak_leaves','mangrove_leaves','azalea_leaves','oak_log','birch_log','spruce_log','jungle_log','acacia_log','dark_oak_log','oak_planks','birch_planks','spruce_planks','jungle_planks','grass','tall_grass','fern','flower','rose','dandelion','poppy','vine','lily_pad']
const AIR_BLOCKS    = ['air','cave_air','void_air']

function getBlockColor(name) {
   const id = name.replace('minecraft:', '')
   if (AIR_BLOCKS.includes(id)) return null
   if (NATURE_BLOCKS.some(b => id.includes(b))) return COLORS.nature
   if (STONE_BLOCKS.some(b => id.includes(b)))  return COLORS.stone
   if (PLANT_BLOCKS.some(b => id.includes(b)))  return COLORS.plant
   return COLORS.other
}

export default function Viewer() {
   const div = document.createElement('div')
   div.className = 'VIEWER_WRAP'
   div.innerHTML = `
      <div id="NBT3D_DROP">
         <div id="NBT3D_INNER">
            <img src="assets/img/page/edit.png" width="64"/>
            <p>.nbt 파일을 드래그하거나 직접 열 수 있습니다.</p>
            <input type="file" id="NBT3D_INPUT" accept=".nbt"/>
         </div>
      </div>
      <div id="NBT3D_WRAP">
         <div id="NBT3D_TOPBAR">
            <span id="NBT3D_INFO"></span>
            <div id="NBT3D_LEGEND">
               <span style="color:#8b5e3c">■</span> 흙/자연
               <span style="color:#888888">■</span> 돌/광석
               <span style="color:#5a9e3a">■</span> 식물
               <span style="color:#5577cc">■</span> 기타
            </div>
            <div id="NBT3D_BTNS">
               <button class="EDIT_BTN" id="NBT3D_OPEN">📂 다른 파일</button>
               <button class="EDIT_BTN" id="NBT3D_RESET">🔄 시점 초기화</button>
            </div>
         </div>
         <div id="NBT3D_CANVAS">
            <div id="NBT3D_TOOLTIP"></div>
         </div>
      </div>
   `

   const dropZone = div.querySelector('#NBT3D_DROP')
   const fileInput = div.querySelector('#NBT3D_INPUT')
   const wrap = div.querySelector('#NBT3D_WRAP')
   const canvasWrap = div.querySelector('#NBT3D_CANVAS')
   const info = div.querySelector('#NBT3D_INFO')
   const tooltip = div.querySelector('#NBT3D_TOOLTIP')

   dropZone.addEventListener('click', () => fileInput.click())
   dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag') })
   dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag'))
   dropZone.addEventListener('drop', e => {
      e.preventDefault()
      dropZone.classList.remove('drag')
      if (e.dataTransfer.files[0]) loadNBT(e.dataTransfer.files[0])
   })
   fileInput.addEventListener('change', () => { if (fileInput.files[0]) loadNBT(fileInput.files[0]) })
   div.querySelector('#NBT3D_OPEN').addEventListener('click', () => fileInput.click())

   let renderer, scene, camera, animId
   let isDragging = false, prevMouse = { x: 0, y: 0 }
   let spherical = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 30 }
   let target = new THREE.Vector3()

   async function loadNBT(file) {
      try {
         const buffer = await file.arrayBuffer()
         const nbt = await NBT.read(buffer)

         let data = nbt.data
         const keys = Object.keys(data)
         if (keys.length === 1 && keys[0] === '') data = data['']

         const size = data.size
         const palette = data.palette
         const blocks = data.blocks

         if (!size || !palette || !blocks) {
            alert('.nbt 구조물 파일이 아닙니다.')
            return
         }

         const [sx, sy, sz] = size
         info.textContent = `${file.name}  |  ${sx} × ${sy} × ${sz}  |  ${blocks.length}개 블록`

         dropZone.style.display = 'none'
         wrap.style.display = 'flex'

         initThree(sx, sy, sz)
         buildBlocks(palette, blocks)
      } catch(e) {
         alert('파일 읽기 실패: ' + e.message)
      }
   }

   function initThree(sx, sy, sz) {
      if (renderer) { renderer.dispose(); canvasWrap.querySelector('canvas')?.remove() }
      if (animId) cancelAnimationFrame(animId)

      const w = canvasWrap.clientWidth || 800
      const h = canvasWrap.clientHeight || 500

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(w, h)
      renderer.setPixelRatio(window.devicePixelRatio)
      canvasWrap.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a2030)
      scene.fog = new THREE.Fog(0x1a2030, 80, 200)

      camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 500)
      target.set(sx / 2, sy / 2, sz / 2)
      spherical.radius = Math.max(sx, sy, sz) * 1.8
      updateCamera()

      scene.add(new THREE.AmbientLight(0xffffff, 0.6))
      const dir = new THREE.DirectionalLight(0xffffff, 0.8)
      dir.position.set(sx + 10, sy + 20, sz + 10)
      scene.add(dir)

      const grid = new THREE.GridHelper(Math.max(sx, sz) + 4, Math.max(sx, sz) + 4, 0x334455, 0x223344)
      grid.position.set(sx / 2, -0.5, sz / 2)
      scene.add(grid)

      const canvas = renderer.domElement
      canvas.addEventListener('mousedown', e => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY } })
      window.addEventListener('mouseup', () => { isDragging = false })
      canvas.addEventListener('mousemove', e => {
         if (!isDragging) return
         spherical.theta -= (e.clientX - prevMouse.x) * 0.01
         spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - (e.clientY - prevMouse.y) * 0.01))
         prevMouse = { x: e.clientX, y: e.clientY }
         updateCamera()
      })
      canvas.addEventListener('wheel', e => {
         spherical.radius = Math.max(2, Math.min(200, spherical.radius + e.deltaY * 0.05))
         updateCamera()
      })
      canvas.addEventListener('click', e => {
         const rect = canvas.getBoundingClientRect()
         const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
         )
         const ray = new THREE.Raycaster()
         ray.setFromCamera(mouse, camera)
         const hit = ray.intersectObjects(scene.children).find(h => h.object.userData.blockName)
         if (hit) {
            const { blockName, blockPos, blockProps } = hit.object.userData
            tooltip.classList.add('visible')
            tooltip.innerHTML = `<b>${blockName}</b><br/>pos: ${blockPos.join(', ')}` +
               (blockProps ? '<br/>' + Object.entries(blockProps).map(([k,v]) => `${k}: ${v}`).join('<br/>') : '')
         } else {
            tooltip.classList.remove('visible')
         }
      })

      new ResizeObserver(() => {
         const w = canvasWrap.clientWidth, h = canvasWrap.clientHeight
         renderer.setSize(w, h)
         camera.aspect = w / h
         camera.updateProjectionMatrix()
      }).observe(canvasWrap)

      div.querySelector('#NBT3D_RESET').onclick = () => {
         spherical = { theta: Math.PI / 4, phi: Math.PI / 3, radius: Math.max(sx, sy, sz) * 1.8 }
         updateCamera()
      }

      function animate() { animId = requestAnimationFrame(animate); renderer.render(scene, camera) }
      animate()
   }

   function updateCamera() {
      const { theta, phi, radius } = spherical
      camera.position.set(
         target.x + radius * Math.sin(phi) * Math.sin(theta),
         target.y + radius * Math.cos(phi),
         target.z + radius * Math.sin(phi) * Math.cos(theta)
      )
      camera.lookAt(target)
   }

   function buildBlocks(palette, blocks) {
      const geo = new THREE.BoxGeometry(1, 1, 1)
      const edgeGeo = new THREE.EdgesGeometry(geo)
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })
      const matCache = {}

      for (const block of blocks) {
         const palEntry = palette[block.state]
         if (!palEntry) continue
         const name = palEntry.Name
         const color = getBlockColor(name)
         if (color === null) continue

         if (!matCache[color]) matCache[color] = new THREE.MeshLambertMaterial({ color })

         const mesh = new THREE.Mesh(geo, matCache[color])
         mesh.position.set(...block.pos)
         mesh.userData = { blockName: name, blockPos: block.pos, blockProps: palEntry.Properties }
         scene.add(mesh)

         const edge = new THREE.LineSegments(edgeGeo, edgeMat)
         edge.position.set(...block.pos)
         scene.add(edge)
      }
   }
   return div
}