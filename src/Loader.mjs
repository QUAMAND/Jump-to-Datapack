import { DOM } from "./DOM.mjs"
import { STATE } from "./STATE.mjs"
import { SIDEBAR_RENDER } from "./Sidebar.mjs"
import { LOAD_PAGE } from "./Page.mjs"

/**
 * 사이트 불러오기
 */
export async function SITE_LOAD() {
   DOM.PARROT.style.display = 'flex' // 앵무새

   const f = await fetch(STATE.path)
   STATE.pages = await f.json()

   /** 사이드 바 표시 */
   SIDEBAR_RENDER(STATE.pages)

   /** 페이지 불러오기 */
   const slug = location.hash.replace('#','') || STATE.pages[0]?.slug
   if (slug) {
      LOAD_PAGE(slug)
   }

   DOM.PARROT.style.display = 'none' // 앵무새 없앰
}