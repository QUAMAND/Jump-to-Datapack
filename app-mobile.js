const MENU_BTN = document.getElementById('MENU_BTN')

/** 모바일 사이드바
 * 사이드바를 열고 닫습니다.
 */
MENU_BTN.addEventListener('click', c => {
   c.stopPropagation()
   MENU_BTN.classList.toggle('open')
   SIDEBARS.classList.toggle('open')
})

document.addEventListener('click', c => {
   if (!MENU_BTN.contains(c.target) && MENU_BTN.classList.contains('open') && !SEARCH.contains(c.target)) {
      MENU_BTN.classList.remove('open')
      SIDEBARS.classList.remove('open')
   }
})