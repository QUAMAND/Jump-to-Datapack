export default function JarPage() {
   const container = document.createElement('div')
   container.className = 'CONTENT'

   container.innerHTML = `
         <div class="SUB_WRAPPER">
            <h2>JAR 다운로드</h2>

            <div class="BOX BOX_info">
               <div class="BOX_TEXT">마인크래프트 공식 클라이언트 및 서버 .jar 파일을 다운로드합니다.</div>
            </div>

            <br/>
            <div id="JAR_FORM">
               <label>JAR 유형</label>
               <select id="JAR_TYPE_SELECT" class="JQL_INPUT">
                  <option value="client">Client</option>
                  <option value="server">Server</option>
                  <option value="both">Both</option>
               </select>

               <label>마인크래프트 버전</label>
               <div style="position: relative;">
                  <input type="text" id="VERSION_INPUT" class="JQL_INPUT" placeholder="버전을 선택하거나 입력하세요." autocomplete="off">
                  <ul id="VERSION_LIST"></ul>
               </div>

               <div id="DOWNLOAD_EXEC_BTN" class="SUB_BTN ACCENT" style="margin-top: 20px;">
                  다운로드
               </div>
            </div>
         </div>
   `

   const TYPE_SELECT = container.querySelector('#JAR_TYPE_SELECT')
   const VERSION_INPUT = container.querySelector('#VERSION_INPUT')
   const VERSION_LIST = container.querySelector('#VERSION_LIST')
   const DOWNLOAD_BTN = container.querySelector('#DOWNLOAD_EXEC_BTN')

   const VERSION_SHOW = () => { VERSION_LIST.style.display = 'block' }
   const VERSION_HIDE = () => { VERSION_LIST.style.display = 'none' }

   let versions = []

   fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")
      .then(r => r.json())
      .then(data => {
         versions = data.versions.map(v => v.id)
         RENDER_VERSION_LIST()
      })
   
   /** 버전 리스트 생성 */
   function RENDER_VERSION_LIST() {
      VERSION_LIST.innerHTML = ''
      versions.slice(0, versions.length - 61).forEach(v => {
         const li = document.createElement('li')
         li.textContent = v
         li.addEventListener('click', () => {
            VERSION_INPUT.value = v
            VERSION_HIDE()
         })
         VERSION_LIST.appendChild(li)
      })
   }

   /** 버전 검색 필터 */
   VERSION_INPUT.addEventListener('input', () => {
      const query = VERSION_INPUT.value.toLowerCase()
      let shownCount = 0

      VERSION_LIST.querySelectorAll('li').forEach(li => {
         if (li.textContent.toLowerCase().includes(query) && shownCount < 15) {
            li.style.display = ''
            shownCount++
         } else {
            li.style.display = 'none'
         }
      })
      VERSION_SHOW()
   })

   /** 다운로드 */
   DOWNLOAD_BTN.addEventListener('click', async () => {
      const ver = VERSION_INPUT.value
      const type = TYPE_SELECT.value

      if (!versions.includes(ver)) {
         alert("유효한 버전이 아닙니다: " + ver)
         return
      }

      try {
         const manifest = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then(r => r.json())
         const versionData = manifest.versions.find(v => v.id === ver)
         
         if (versionData) {
            const detail = await fetch(versionData.url).then(r => r.json())
            const downloadUrls = []

            if (type === 'client' || type === 'both') downloadUrls.push(detail.downloads.client.url)
            if (type === 'server' || type === 'both') downloadUrls.push(detail.downloads.server.url)

            downloadUrls.forEach(url => {
               const a = document.createElement('a')
               a.href = url
               a.target = '_blank'
               container.appendChild(a)
               a.click()
               container.removeChild(a)
            })
         }
      } catch (e) {alert("정보가 없습니다: " + e)}
   })

   /** 기타 이벤트 */
   const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== VERSION_INPUT) {
         e.preventDefault()
         VERSION_INPUT.focus()
      }
   }

   const handleClickOutside = (e) => {
      if (!VERSION_INPUT.contains(e.target) && !VERSION_LIST.contains(e.target)) {
         VERSION_HIDE()
      }
   }

   VERSION_INPUT.addEventListener('click', VERSION_SHOW)
   document.addEventListener('keydown', handleKeyDown)
   document.addEventListener('click', handleClickOutside)

   return container
}