export default function ColorConvert() {
   const div = document.createElement('div')
   div.className = 'TOOL_BODY'
   div.innerHTML = `
      <h2>색상 계산기</h2>
      <table class="CALC_TABLE">
         <tr>
            <th>색상 선택</th>
            <td>
               <input type="color" id="COLOR_PICKER" value="#000000"/>
            </td>
         </tr>
         <tr>
            <th>Decimal</th>
            <td><input class="INPUT" id="decimal" type="number" min="0" max="16777215" placeholder="0"/></td>
         </tr>
         <tr>
            <th>Hex</th>
            <td><input class="INPUT" id="hex" type="text" placeholder="0000" maxlength="7"/></td>
         </tr>
         <tr>
            <th>Float (R, G, B)</th>
            <td><input class="INPUT" id="floats" type="text" readonly placeholder="0.0, 0.0, 0.0"/></td>
         </tr>
      </table>
   `

   const picker  = div.querySelector('#COLOR_PICKER')
   const decimal = div.querySelector('#decimal')
   const hex     = div.querySelector('#hex')
   const floats  = div.querySelector('#floats')

   function hexToValues(h) {
      h = h.replace('#', '').padEnd(6, '0')
      const r = parseInt(h.slice(0,2), 16)
      const g = parseInt(h.slice(2,4), 16)
      const b = parseInt(h.slice(4,6), 16)
      return { r, g, b }
   }

   function updateAll(r, g, b) {
      const dec = (r << 16) | (g << 8) | b
      const h = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')

      picker.value  = h
      decimal.value = dec
      hex.value     = h.replace('#','').toUpperCase()
      floats.value  = `${(r/255).toFixed(4)}, ${(g/255).toFixed(4)}, ${(b/255).toFixed(4)}`
   }

   picker.addEventListener('input', () => {
      const { r, g, b } = hexToValues(picker.value)
      updateAll(r, g, b)
   })

   decimal.addEventListener('input', () => {
      const dec = Math.min(16777215, Math.max(0, parseInt(decimal.value) || 0))
      const r = (dec >> 16) & 0xFF
      const g = (dec >> 8)  & 0xFF
      const b =  dec        & 0xFF
      updateAll(r, g, b)
   })

   hex.addEventListener('input', () => {
      const raw = hex.value.replace('#','')
      if (raw.length !== 6) return
      const { r, g, b } = hexToValues(raw)
      if (isNaN(r) || isNaN(g) || isNaN(b)) return
      updateAll(r, g, b)
   })

   updateAll(0, 0, 0)

   return div
}