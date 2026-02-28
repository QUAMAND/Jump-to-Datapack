import { createTool } from "../ui/template.js"

export default function NetherPos() {
   const div = document.createElement('div')
   div.className = 'TOOL_BODY'
   div.innerHTML = `
      <h2>지옥 - 오버월드 좌표 계산기</h2>
      <table class="CALC_TABLE">
         <tr>
            <th>오버월드</th>
            <td>
               X <input class="INPUT" id="ox" type="number" placeholder="0"/>
               Y <input class="INPUT" id="oy" type="number" placeholder="0"/>
               Z <input class="INPUT" id="oz" type="number" placeholder="0"/>
            </td>
         </tr>
         <tr>
            <th>지옥</th>
            <td>
               X <input class="INPUT" id="nx" type="number" placeholder="0"/>
               Y <input class="INPUT" id="ny" type="number" placeholder="0"/>
               Z <input class="INPUT" id="nz" type="number" placeholder="0"/>
            </td>
         </tr>
      </table>
      <p class="CALC_NOTE">지옥 좌표(x, z) × 8 = 오버월드 좌표(x, z)</p>

      <br></br>

      <h2>사용자 지정 차원 - 오버월드 좌표 계산기</h2>
      <table class="CALC_TABLE">
         <tr>
            <th>coordinate_scale</th>
            <td>
               <input class="INPUT" id="scale" type="number"
                  value="1" min="0.00001" max="30000000" step="any" placeholder="1"/>
            </td>
         </tr>
         <tr>
            <th>오버월드</th>
            <td>
               X <input class="INPUT" id="cox" type="number" placeholder="0"/>
               Y <input class="INPUT" id="coy" type="number" placeholder="0"/>
               Z <input class="INPUT" id="coz" type="number" placeholder="0"/>
            </td>
         </tr>
         <tr>
            <th>사용자 지정 차원</th>
            <td>
               X <input class="INPUT" id="cx" type="number" placeholder="0"/>
               Y <input class="INPUT" id="cy" type="number" placeholder="0"/>
               Z <input class="INPUT" id="cz" type="number" placeholder="0"/>
            </td>
         </tr>
      </table>
      <p class="CALC_NOTE" id="custom_note">사용자 지정 차원 좌표(x, z) x coordinate_scale = 오버월드 좌표(x, z)</p>
      <p class="CALC_WARN" id="custom_warn" style="display:none"><span>⚠</span> coordinate_scale은 0.00001 ~ 30000000 사이여야 합니다.</p>
   `

   // 네더 계산기
   const ox = div.querySelector('#ox')
   const oy = div.querySelector('#oy')
   const oz = div.querySelector('#oz')
   const nx = div.querySelector('#nx')
   const ny = div.querySelector('#ny')
   const nz = div.querySelector('#nz')

   function overToNether() {
      nx.value = parseFloat(ox.value) / 8 || ''
      ny.value = oy.value
      nz.value = parseFloat(oz.value) / 8 || ''
   }
   function netherToOver() {
      ox.value = parseFloat(nx.value) * 8 || ''
      oy.value = ny.value
      oz.value = parseFloat(nz.value) * 8 || ''
   }

   ox.addEventListener('input', overToNether)
   oy.addEventListener('input', overToNether)
   oz.addEventListener('input', overToNether)
   nx.addEventListener('input', netherToOver)
   ny.addEventListener('input', netherToOver)
   nz.addEventListener('input', netherToOver)

   // 커스텀 차원 계산기
   const scale  = div.querySelector('#scale')
   const cox = div.querySelector('#cox')
   const coy = div.querySelector('#coy')
   const coz = div.querySelector('#coz')
   const cx  = div.querySelector('#cx')
   const cy  = div.querySelector('#cy')
   const cz  = div.querySelector('#cz')
   const customNote = div.querySelector('#custom_note')
   const customWarn = div.querySelector('#custom_warn')

   function getScale() {
      const v = parseFloat(scale.value)
      if (isNaN(v) || v < 0.00001 || v > 30000000) return null
      return v
   }

   function overToCustom() {
      const s = getScale()
      if (!s) return
      cx.value = parseFloat(cox.value) / s || ''
      cy.value = coy.value
      cz.value = parseFloat(coz.value) / s || ''
   }
   function customToOver() {
      const s = getScale()
      if (!s) return
      cox.value = parseFloat(cx.value) * s || ''
      coy.value = cy.value
      coz.value = parseFloat(cz.value) * s || ''
   }

   scale.addEventListener('input', () => {
      const s = getScale()
      if (!s) { customWarn.style.display = 'block'; return }
      customWarn.style.display = 'none'
      customNote.textContent = `사용자 지정 차원 좌표(x, z) × ${s} = 오버월드 좌표(x, z)`
      overToCustom()
   })

   cox.addEventListener('input', overToCustom)
   coy.addEventListener('input', overToCustom)
   coz.addEventListener('input', overToCustom)
   cx.addEventListener('input', customToOver)
   cy.addEventListener('input', customToOver)
   cz.addEventListener('input', customToOver)

   return div
}