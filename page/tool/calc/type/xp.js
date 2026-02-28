import { createTool } from "../ui/template.js";

export default function XP(){

  return createTool({
    title:"XP 계산기",
    content:`
      <input id="lvl" type="number" placeholder="레벨">
      <button id="calc">계산</button>
      <p id="out"></p>
    `,
    onInit(el){
      el.querySelector("#calc").onclick = ()=>{
        const lvl = +el.querySelector("#lvl").value;
        const xp = lvl*lvl + 6*lvl;
        el.querySelector("#out").textContent = `XP: ${xp}`;
      };
    }
  });

}