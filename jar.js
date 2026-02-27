const TYPE = document.getElementById('JAR_TYPE')
const VERSION = document.getElementById('VERSION')
const VERSION_LIST = document.getElementById('VERSION_LIST')
const DOWNLOADS = document.getElementById('DOWNLOADS')

let versions = []

fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")
   .then(r => r.json())
   .then(data => {
      versions = data.versions.map(v => v.id)
      VERSION_RENDER()
   })

function VERSION_RENDER() {
   VERSION_LIST.innerHTML = ''

   versions.slice(0, versions.length - 61).forEach(v => {
      const li = document.createElement('li')

      li.textContent = v
      li.addEventListener('click', c => {
         VERSION.value = v
         VERSION_HIDE()
      })
      VERSION_LIST.appendChild(li)
   })
}

function VERSION_SHOW() {VERSION_LIST.style.display = 'block'}
function VERSION_HIDE() {VERSION_LIST.style.display = 'none'}

VERSION.addEventListener('input', i => {
   const q = VERSION.value.toLowerCase()

   let shown = 0

   VERSION_LIST.querySelectorAll('li').forEach(li => {
      if (li.textContent.toLowerCase().includes(q) && shown < 10) {
         li.style.display = ''
         shown++
      } else {
         li.style.display = 'none'
      }
   })
   VERSION_SHOW()
})

DOWNLOADS.addEventListener('click', async a => {
   const ver = VERSION.value
   const t = TYPE.value.toLowerCase()

   if (!versions.includes(ver)) {
      alert("일치하는 버전이 없습니다.")
      return
   }

   try {
      const manifest = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then(r => r.json())
      const object = manifest.versions.find(v => v.id === ver)
      if (object) {
         const jar = await fetch(object.url).then(r => r.json())
         const files = []

         if (t === 'client') {
            files.push(jar.downloads.client.url)
         } else if (t === 'server') {
            files.push(jar.downloads.server.url)
         } else if (t === 'both') {
            files.push(jar.downloads.client.url)
            files.push(jar.downloads.server.url)
         }

         if (files.length) {
            files.forEach(u => {
               console.log('download')
               const a = document.createElement('a')
               a.href = u
               a.download = ''
               a.target = '_blank'
               document.body.appendChild(a)
               a.click()
               document.body.removeChild(a)
            })
         }
      }
   } catch {}
})

/** 버전 입력 단축키
 * 슬래시(/) 키를 입력 시에 버전 입력 창으로 이동합니다.
 */
document.addEventListener('keydown', k => {
   if (k.key === '/' && document.activeElement !== VERSION) {
      k.preventDefault()
      VERSION.focus()
   }
})

/** 클릭 시 버전 표시
 * 버전 클릭 시, 버전을 표시합니다.
 */
VERSION.addEventListener('click', c => {
   VERSION.classList.add('open')
   VERSION_LIST.classList.add('open')
   VERSION_LIST.style.display = 'block'
})
document.addEventListener('click', c => {
   if (!VERSION.contains(c.target) && !VERSION_LIST.contains(c.target)) {
      VERSION.classList.remove('open')
      VERSION_LIST.classList.remove('open')
      VERSION_LIST.style.display = 'none'
   }
})