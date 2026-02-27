const TOOLTIP = document.createElement('div')
TOOLTIP.textContent = "휠 클릭으로 전체 코드를 복사합니다."
Object.assign(TOOLTIP.style,{
   position:"fixed",
   background:"var(--background)",
   color:"var(--title)",
   padding:"4px 10px",
   borderRadius:"8px",
   fontSize:"15px",
   opacity:"0",
   transition:"opacity .2s ease",
   zIndex:"9999",
   whiteSpace:"nowrap"
})
document.body.appendChild(TOOLTIP)

let PRE = null

document.addEventListener('mousemove', m => {
   const pre = m.target.closest('#ARTICLE pre')

   if (pre) {
      PRE = pre
      TOOLTIP.style.opacity = "1"
      TOOLTIP.style.left = m.clientX + 18 + "px"
      TOOLTIP.style.top  = m.clientY + 14 + "px"
   } else {
      PRE = null
      TOOLTIP.style.opacity = "0"
   }
})


/** 코드 블록 복사
 * 코드 블록 내의 모든 코드를 휠클릭 시 복사합니다.
 */
let TIMER = null
document.addEventListener('auxclick', async c => {
   const pre = c.target.closest('#ARTICLE pre')

   if (TIMER) clearTimeout(TIMER)

   if (pre) {
      await navigator.clipboard.writeText(pre.innerText)

      TOOLTIP.textContent = "Copied!"
      setTimeout(() => {TOOLTIP.textContent = "휠 클릭으로 전체 코드를 복사합니다."}, 1400)
   }
})