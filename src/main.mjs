import { DOM } from "./DOM.mjs"
import { STATE } from "./STATE.mjs"
import { SITE_LOAD } from "./Loader.mjs"
import { SEARCH } from "./Search.mjs"

/**
 * 구성 및 환경 설정
 */
const App = {
   /** page/가 아니면 Main임 */
   isMain: !window.location.pathname.includes('page/'),

   init() {
      this.UI()
      if (this.isMain) {
         this.IN()
      }
   },

   /**
    * 초기 로드 로직
    */
   IN() {
      /** 아무 것도 없으면 #1 */
      if (!location.hash) {
         location.hash = "1"
         return
      }

      /** 주소가 변경되면 */
      window.addEventListener("hashchange", () => {
         if (this.isMain) {this.handleMain()}
      })

      /** 첫 로드 */
      if (this.isMain) {this.handleMain()}

      if (typeof SEARCH === 'function') SEARCH()
   },

   /** 메인 페이지 */
   handleMain() {
      this.applyMode()
      SITE_LOAD()
      return
   },

   /** 모드 적용 */
   applyMode() {
      const n = parseInt(location.hash.replace("#", ""))
      if (!isNaN(n)) {
         STATE.modeN = n
         STATE.mode = STATE.modes[n]
         STATE.path = `docs/${n}/pages.json`

         DOM.TOP_TITLE.textContent = STATE.modes_name[n]
      }
   },

   /**
    * UI 초기화
    */
   UI() {
      /** 홈 글자 누르면, 메인 페이지로 이동 */
      if (!this.isMain) {
         DOM.HOME_TITLE.onclick = () => { location.href = "#1" }
      } else {
         DOM.TOP_TITLE.onclick = () => {
            location.hash = (STATE.modeN === 1) ? "2" : "1"
         }
      }

      /** Menu, More 버튼 */
      this.ListToggle(DOM.MENU_BTN, DOM.SIDEBARS)
      this.ListToggle(DOM.MORE_BTN, DOM.MORE_LIST)

      /* 다른 곳 클릭, 닫기 */
      document.addEventListener('click', (e) => {
         this.ListClose(e, DOM.MENU_BTN, DOM.SIDEBARS)
         this.ListClose(e, DOM.MORE_BTN, DOM.MORE_LIST)
      })
   },

   /**
    * 버튼 기능
    */
   ListToggle(btn, target) {
      if (!btn || !target) return

      btn.addEventListener('click', (e) => {
         e.stopPropagation()
         btn.classList.toggle('open')
         target.classList.toggle('open')
      })
   },

   /**
    * 다른 곳 클릭 닫기
    */
   ListClose(e, btn, target) {
      if (!btn || !target) return

      if (!btn.contains(e.target) && !target.contains(e.target)) {
         btn.classList.remove('open')
         target.classList.remove('open')
      }
   }
}

/**
 * 최초
 */
window.addEventListener('DOMContentLoaded', () => App.init())

/**
 * 로딩 화면
 */
window.onload = function() {DOM.PARROT.style.display = 'none'}