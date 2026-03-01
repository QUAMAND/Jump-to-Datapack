import { createTool } from "../ui/template.js"

export default function EntityInFOV() {
   const container = document.createElement('div');
   container.className = 'TOOL_BODY';
   
   container.innerHTML = `
      <h2 style="color:var(--title); margin-bottom:8px;">시야각 판정 계산기</h2>
      <p style="color:var(--content); font-size:0.9em; margin-bottom:20px;">
         개체(Entity)가 화면 안에 들어오는지 확인하는 명령어를 생성합니다.
      </p>

      <table class="CALC_TABLE">
         <tr>
            <th>감지 각도</th>
            <td>
               <input type="number" id="FOV_DEGREE" class="INPUT" value="60" step="1" min="1" max="180">
            </td>
         </tr>
         <tr>
            <th>개체 태그</th>
            <td>
               <input type="text" id="TARGET_TAG" class="INPUT" value="target">
            </td>
         </tr>
         <tr>
            <th>계산된 거리</th>
            <td>
               <span id="CALC_DIST" class="OUTPUT">1.0000</span>
               <span class="CALC_WARN">※ distance=..d 값으로 사용됩니다.</span>
            </td>
         </tr>
      </table>

      <div style="margin-top:24px;">
         <div style="color:var(--subtitle); font-size:0.85em; margin-bottom:8px;">인게임 명령어</div>
         <textarea id="RESULT_COMMAND" class="INPUT" style="height:100px; font-family:'D2Coding'; font-size:0.85em; resize:none;" readonly></textarea>
      </div>

      <div class="CALC_TIP" style="margin-top:20px; line-height:1.5;">
         💡: d = 2 * sin(각도 / 2) <br>
      </div>
   `;

   const inputDeg = container.querySelector('#FOV_DEGREE');
   const inputTag = container.querySelector('#TARGET_TAG');
   const resDist = container.querySelector('#CALC_DIST');
   const resCmd = container.querySelector('#RESULT_COMMAND');
   const btnCopy = container.querySelector('#BTN_COPY');

   function update() {
      const deg = parseFloat(inputDeg.value) || 0;
      const tag = inputTag.value || 'target';

      // 공식: d = 2 * sin(theta / 2)
      const rad = (deg / 2) * (Math.PI / 180);
      const dist = 2 * Math.sin(rad);

      const finalDist = dist.toFixed(4);
      resDist.textContent = finalDist;

      const cmd = `execute positioned as @s facing entity @e[tag=${tag},limit=1] eyes positioned ^ ^ ^-1 rotated as @e[tag=${tag},limit=1] positioned ^ ^ ^-1 if entity @s[distance=..${finalDist}] run`;
      resCmd.value = cmd;
   }

   inputDeg.oninput = update;
   inputTag.oninput = update;

   update();

   return container;
}