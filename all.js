const MORE_BTN = document.getElementById('MORE_BTN')
const MORE_LIST = document.getElementById('MORE_LIST')
const HOME_BTN = document.getElementById('HOME_BTN')

/** MORE_BTN
 * 추가 옵션을 표시하는 버튼을 설정합니다.
 */
MORE_BTN.addEventListener('click', c => {
   c.stopPropagation()
   MORE_BTN.classList.toggle('open')
   MORE_LIST.classList.toggle('open')
})

document.addEventListener('click', c => {
   if (!MORE_BTN.contains(c.target) && !MORE_LIST.contains(c.target)) {
      MORE_BTN.classList.remove('open')
      MORE_LIST.classList.remove('open')
   }
})

/** HOME_BTN
 * 메인 페이지로 이동합니다. #1
 */
if (HOME_BTN) {
   HOME_BTN.addEventListener('click', c => {
      location.href = "/Jump-to-Datapack/"
   })
}