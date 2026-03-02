export default function UUIDPage() {
   const container = document.createElement('div')
   container.className = 'CONTENT'

   container.innerHTML = `
      <div id="ARTICLE">
         <div class="SUB_WRAPPER">
            <h2>UUID/SKIN 도구</h2>
            
            <div class="BOX BOX_info">
               <div class="BOX_TEXT">닉네임으로 UUID를 조회하거나, Base64 값을 스킨 이미지로 변환합니다.</div>
            </div>

            <br/>

            <label>닉네임, UUID 또는 Base64</label>
            <input id="INPUT_DATA" class="JQL_INPUT" style="margin-bottom: 10px;" placeholder="닉네임, UUID 또는 eyJ0ZXh0dXJlcy...">

            <div class="BTN_GRID">
               <div id="GET_PROFILE_BTN" class="SUB_BTN">Name > UUID</div>
               <div id="TO_BASE64_BTN" class="SUB_BTN">Name > Base64</div>
               <div id="DECODE_BASE64_BTN" class="SUB_BTN">Base64 > Skin</div>
               <div id="TO_INT_ARRAY_BTN" class="SUB_BTN">String > Int[]</div>
               <div id="TO_STRING_BTN" class="SUB_BTN">Int[] > String</div>
            </div>

            <br/>

            <div id="SKIN_VIEWER" style="display:none; text-align: center; margin: 20px auto; width: 100%;">
               <img id="SKIN_HEAD" src="" style="width: 64px; height: 64px; image-rendering: pixelated; border: 2px solid var(--accent); display: block; margin: 0 auto;">
               <div id="PLAYER_NAME" style="font-weight: bold; margin-top: 8px;"></div>
            </div>

            <label>출력 결과</label>
            <textarea id="OUTPUT_DATA" class="JQL_INPUT" style="height: 150px;" readonly placeholder="결과가 여기에 표시됩니다."></textarea>
            
            <div id="COPY_BTN" class="SUB_BTN ACCENT">복사</div>
         </div>
      </div>
   `

   const input = container.querySelector('#INPUT_DATA')
   const output = container.querySelector('#OUTPUT_DATA')
   const skinViewer = container.querySelector('#SKIN_VIEWER')
   const skinHead = container.querySelector('#SKIN_HEAD')
   const playerName = container.querySelector('#PLAYER_NAME')

   /** UUID -> Int Array 변환 */
   const uuidToIntArray = (uuid) => {
      const cleanUuid = uuid.replace(/-/g, '')
      if (cleanUuid.length !== 32) throw new Error("UUID 길이가 유효하지 않습니다.")
      const ints = []
      for (let i = 0; i < 4; i++) {
         const hex = cleanUuid.substring(i * 8, (i + 1) * 8)
         ints.push(Int32Array.from([parseInt(hex, 16)])[0])
      }
      return `[I; ${ints.join(', ')}]`
   }

   /** Int Array -> UUID 변환 */
   const intArrayToUuid = (str) => {
      const match = str.match(/-?\d+/g)
      if (!match || match.length !== 4) throw new Error("4개의 정수가 필요합니다.")
      return match.map(n => {
         const hex = (BigInt(n) & 0xFFFFFFFFn).toString(16).padStart(8, '0')
         return hex
      }).join('').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
   }

   const handleError = (msg) => {
      input.classList.add('input-error')
      output.value = ""
      output.placeholder = msg
      skinViewer.style.display = 'none'
   }

   const clearError = () => {
      input.classList.remove('input-error')
      output.placeholder = "결과가 여기에 표시됩니다."
   }

   /** 1. Profile 버튼: 기본 정보 조회 */
   container.querySelector('#GET_PROFILE_BTN').onclick = async () => {
      clearError()
      const val = input.value.trim()
      if (!val) return

      try {
         const res = await fetch(`https://api.minetools.eu/uuid/${val}`)
         const data = await res.json()
         if (data.status === "ERR") throw new Error("유저를 찾을 수 없습니다.")

         output.value = `Name: ${data.name}\nUUID: ${data.id}\nInt Array: ${uuidToIntArray(data.id)}`
         
         skinHead.src = `https://minotar.net/helm/${data.name}/64.png`
         playerName.textContent = data.name
         skinViewer.style.display = 'block'
      } catch (e) {
         handleError("조회 실패: " + e.message)
      }
   }

   /** 2. Get Base64 버튼: 텍스처 데이터 추출 */
   container.querySelector('#TO_BASE64_BTN').onclick = async () => {
      clearError()
      const val = input.value.trim()
      if (!val) return

      try {
         output.value = "데이터를 불러오는 중..."
         const res = await fetch(`https://api.minetools.eu/uuid/${val}`)
         const uuidData = await res.json()
         if (uuidData.status === "ERR") throw new Error("유저를 찾을 수 없습니다.")

         const profileRes = await fetch(`https://api.minetools.eu/profile/${uuidData.id}`)
         const profileData = await profileRes.json()
         
         if (profileData.raw && profileData.raw.properties) {
            const textureProp = profileData.raw.properties.find(p => p.name === 'textures')
            if (textureProp) {
               output.value = textureProp.value
            } else {
               throw new Error("텍스쳐 속성을 찾을 수 없습니다.")
            }
         }
         
         skinHead.src = `https://minotar.net/helm/${uuidData.name}/64.png`
         playerName.textContent = uuidData.name
         skinViewer.style.display = 'block'
      } catch (e) {
         handleError("Base64 추출 실패")
      }
   }

   /** 3. Base64 to Skin 버튼: Base64를 해석해 이미지 표시 */
   container.querySelector('#DECODE_BASE64_BTN').onclick = () => {
      clearError()
      const val = input.value.trim()
      if (!val) return

      try {
         // Base64 디코딩 (JSON 문자열 추출)
         const decodedData = JSON.parse(atob(val))
         const skinUrl = decodedData.textures.SKIN.url
         
         output.value = `해석된 스킨 URL:\n${skinUrl}`
         
         // 이미지 뷰어 업데이트
         skinHead.src = skinUrl
         playerName.textContent = "해석된 Base64"
         skinViewer.style.display = 'block'
      } catch (e) {
         handleError("유효한 Base64 데이터가 아닙니다.")
      }
   }

   /** 4. String to Int[] 버튼 */
   container.querySelector('#TO_INT_ARRAY_BTN').onclick = () => {
      clearError()
      try {
         output.value = uuidToIntArray(input.value.trim())
      } catch (e) {
         handleError("UUID 형식이 올바르지 않습니다.")
      }
   }

   /** 5. Int[] to String 버튼 */
   container.querySelector('#TO_STRING_BTN').onclick = () => {
      clearError()
      try {
         output.value = intArrayToUuid(input.value.trim())
      } catch (e) {
         handleError("정수 배열 형식이 올바르지 않습니다.")
      }
   }

   /** 복사 버튼 */
   container.querySelector('#COPY_BTN').onclick = (e) => {
      if (!output.value) return
      navigator.clipboard.writeText(output.value)
      const originalText = e.target.textContent
      e.target.textContent = "Copied!"
      setTimeout(() => {
         e.target.textContent = originalText
      }, 1400)
   }

   return container
}