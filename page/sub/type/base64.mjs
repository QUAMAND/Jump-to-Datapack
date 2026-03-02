export default function Base64Page() {
   const container = document.createElement('div')
   container.className = 'CONTENT'

   container.innerHTML = `
      <div id="ARTICLE">
         <div class="TOOL_WRAPPER">
            <h2>Base64/JSON 도구</h2>
            
            <div class="BOX BOX_info">
               <div class="BOX_TEXT">Base64 디코딩 및 인코딩, JSON 파서를 위한 도구입니다.</div>
            </div>

            <label>값</label>
            <textarea id="INPUT_DATA" class="JQL_INPUT" style="height: 180px;" placeholder="문자 또는 JSON 입력."></textarea>

            <div class="BTN_GRID">
               <div id="ENCODE_BTN" class="TOOL_BTN">문자 → Base64</div>
               <div id="DECODE_BTN" class="TOOL_BTN">Base64 → 문자</div>
               <div id="MINIFY_BTN" class="TOOL_BTN">JSON 압축</div>
               <div id="JSON_TO_B64_BTN" class="TOOL_BTN">JSON → Base64</div>
            </div>

            <label>출력 결과</label>
            <textarea id="OUTPUT_DATA" class="JQL_INPUT" style="height: 180px;" readonly placeholder="결과가 여기에 표시됩니다."></textarea>
            
            <div id="COPY_BTN" class="TOOL_BTN ACCENT">복사</div>
         </div>
      </div>
   `

   const input = container.querySelector('#INPUT_DATA')
   const output = container.querySelector('#OUTPUT_DATA')

   /** 인코딩, 디코딩 */
   const safeBtoa = (str) => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)))
   const safeAtob = (str) => decodeURIComponent(Array.prototype.map.call(atob(str), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))

   /** 이벤트 */
   container.querySelector('#ENCODE_BTN').onclick = () => {
      try { output.value = safeBtoa(input.value) } catch (e) { output.textContent = "인코딩을 실패 했습니다." }
   }
   container.querySelector('#DECODE_BTN').onclick = () => {
      try { output.value = safeAtob(input.value) } catch (e) { output.textContent = "잘못된 형식입니다." }
   }
   container.querySelector('#MINIFY_BTN').onclick = () => {
      try { output.value = JSON.stringify(JSON.parse(input.value)) } catch (e) { output.textContent = "JSON 형식이 아닙니다." }
   }
   container.querySelector('#JSON_TO_B64_BTN').onclick = () => {
      try {
         const minified = JSON.stringify(JSON.parse(input.value))
         output.value = safeBtoa(minified)
      } catch (e) { output.textContent = "JSON 변환을 실패했습니다." }
   }
   container.querySelector('#COPY_BTN').onclick = () => {
      if (!output.value) return
      navigator.clipboard.writeText(output.value)
   }

   return container
}