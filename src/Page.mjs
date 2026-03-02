import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"

import { DOM } from "./DOM.mjs"
import { STATE } from "./STATE.mjs"
import {CONFIGURE_MARKDOWN, POST_PROCESS} from "./Renderer.mjs"

CONFIGURE_MARKDOWN()
POST_PROCESS.INIT_COPY_EVENT()

/**
 * 페이지 불러오기
 */
export async function LOAD_PAGE(slug) {
   /** 모바일 화면 시, 사이드 바 닫기 */
   if (window.innerWidth <= 768) {
      DOM.MENU_BTN.classList.remove('open')
      DOM.SIDEBARS.classList.remove('open')
   }

   /** 클릭된 사이드 바 표시 */
   document.querySelectorAll('.SIDE_ITEM').forEach(a => {
      a.classList.toggle('active', a.dataset.slug === slug)
   })

   const p = PAGE_FIND(STATE.pages, slug)
   if (!p) {
      DOM.ARTICLE.textContent = ''
      DOM.TITLE.textContent = '페이지를 찾을 수 없습니다.'
      DOM.SUBTITLE.textContent = ''
      return
   }

   DOM.TITLE.textContent = p.title
   DOM.SUBTITLE.textContent = p.summary

   try {
      if (!p.content) {
         const res = await fetch(p.file || `docs/${STATE.modeN}/${slug}.md`)
         p.content = await res.text()
      }

      DOM.ARTICLE.innerHTML = marked.parse(p.content)

      POST_PROCESS.APPLY_EMOJI()
      POST_PROCESS.APPLY_ANNOTATION()
      POST_PROCESS.APPLY_LINK_PREVIEW()

      const MERMAIDS = DOM.ARTICLE.querySelectorAll('.mermaid')
      if (MERMAIDS.length > 0 && window.mermaid) {
         setTimeout(async () => {
            try {
               await mermaid.run({ nodes: DOM.ARTICLE.querySelectorAll('.mermaid') })
            } catch (e) { console.error("Mermaid Render Error:", e) }
         }, 1)
      }
   } catch (e) {DOM.ARTICLE.textContent = 'mermaid 불러오기 실패: ' + e}
}

/**
 * 페이지 찾기
 */
export function PAGE_FIND(list, slug) {
   for (const p of list) {
      if (p.slug === slug) return p
      if (p.children) {
         const f = PAGE_FIND(p.children, slug)
         if (f) return f
      }
   }
   return null
}