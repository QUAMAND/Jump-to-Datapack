import { createTool } from "../ui/template.js";

export default function Distance(){

  return createTool({
    title:"좌표 거리 계산기",
    content:`
      <input id="x1" placeholder="x1">
      <input id="z1" placeholder="z1"><br><br>
      <input id="x2" placeholder="x2">
      <input id="z2" placeholder="z2"><br><br>
      <button id="calc">계산</button>
      <p id="out"></p>
    `,
    onInit(el){
      el.querySelector("#calc").onclick = ()=>{
        const x1=+el.querySelector("#x1").value;
        const z1=+el.querySelector("#z1").value;
        const x2=+el.querySelector("#x2").value;
        const z2=+el.querySelector("#z2").value;

        const dist = Math.hypot(x1-x2,z1-z2).toFixed(2);
        el.querySelector("#out").textContent=`거리: ${dist}`;
      };
    }
  });

}