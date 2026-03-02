export default function ChunkPos() {
   const div = document.createElement('div')
   div.className = 'TOOL_BODY'
   div.innerHTML = `
      <h2>청크 좌표 계산기</h2>
      <table class="CALC_TABLE">
         <tr>
            <th>블록 위치</th>
            <td>
               X <input class="INPUT" id="bx" type="number" placeholder="0"/>
               Y <input class="INPUT" id="by" type="number" placeholder="0"/>
               Z <input class="INPUT" id="bz" type="number" placeholder="0"/>
            </td>
         </tr>
         <tr>
            <th>청크 좌표</th>
            <td>
               X <input class="INPUT" id="cx" type="number" placeholder="0"/>
               Z <input class="INPUT" id="cz" type="number" placeholder="0"/>
            </td>
         </tr>
         <tr>
            <th>청크 내 위치</th>
            <td>
               X <span class="OUTPUT" id="cbx">0</span>
               Z <span class="OUTPUT" id="cbz">0</span>
            </td>
         </tr>
         <tr>
            <th>리전 파일</th>
            <td>
               r.<span class="OUTPUT" id="rx">0</span>.<span class="OUTPUT" id="rz">0</span>.mca
            </td>
         </tr>
      </table>
   `

   /** block -> chunk */
   function blockToChunk() {
      const bx = parseInt(div.querySelector('#bx').value) || 0
      const bz = parseInt(div.querySelector('#bz').value) || 0

      const cx = Math.floor(bx / 16)
      const cz = Math.floor(bz / 16)

      div.querySelector('#cx').value = cx
      div.querySelector('#cz').value = cz
      updateRegion(cx, cz)
      updateLocal(bx, bz)
   }

   /** chunk -> block */
   function chunkToBlock() {
      const cx = parseInt(div.querySelector('#cx').value) || 0
      const cz = parseInt(div.querySelector('#cz').value) || 0

      div.querySelector('#bx').value = cx * 16
      div.querySelector('#bz').value = cz * 16
      updateRegion(cx, cz)
      updateLocal(cx * 16, cz * 16)
   }

   function updateRegion(cx, cz) {
      div.querySelector('#rx').textContent = Math.floor(cx / 32)
      div.querySelector('#rz').textContent = Math.floor(cz / 32)
   }

   function updateLocal(bx, bz) {
      div.querySelector('#cbx').textContent = ((bx % 16) + 16) % 16
      div.querySelector('#cbz').textContent = ((bz % 16) + 16) % 16
   }

   div.querySelector('#bx').addEventListener('input', blockToChunk)
   div.querySelector('#by').addEventListener('input', blockToChunk)
   div.querySelector('#bz').addEventListener('input', blockToChunk)
   div.querySelector('#cx').addEventListener('input', chunkToBlock)
   div.querySelector('#cz').addEventListener('input', chunkToBlock)

   return div
}