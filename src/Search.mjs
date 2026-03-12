import { DOM } from "./DOM.mjs"
import { STATE } from "./STATE.mjs"
import { LOAD_PAGE } from "./Page.mjs"
import { SIDEBAR_RENDER } from "./Sidebar.mjs"

export function SEARCH() {
   if (!DOM.SEARCH) return

   DOM.SEARCH.addEventListener('input', () => {
      const q = DOM.SEARCH.value.trim().toLowerCase()

      if (q === '') {
         SIDEBAR_RENDER(STATE.pages)
         const slug = location.hash.replace('#','')
         if (slug) LOAD_PAGE(slug)
         return
      }

      const result = SEARCH_PAGES(STATE.pages, q)
      SIDEBAR_RENDER(result)

      if (result.length > 0) {
         LOAD_PAGE(result[0].slug)
      } else {
         DOM.TITLE.textContent = '검색 결과 없음'
         DOM.SUBTITLE.textContent = `"${q}"에 해당하는 내용이 없습니다.`
         DOM.ARTICLE.textContent = ''
      }

      HIGHLIGHT(q)
   })

   function SEARCH_PAGES(list, q) {
      const result = []
      for (const p of list) {
         const Mtitle = p.title?.toLowerCase().includes(q)
         const Mcontent = p.content?.toLowerCase().includes(q)
         if (Mtitle || Mcontent) result.push({...p, children: null})
         if (p.children) result.push(...SEARCH_PAGES(p.children, q))
      }
      return result
   }

   function HIGHLIGHT(q) {
      if (!q) return

      const PEN = document.createTreeWalker(DOM.ARTICLE, NodeFilter.SHOW_TEXT)
      const nodes = []

      while (PEN.nextNode()) nodes.push(PEN.currentNode)

      nodes.forEach(node => {
         const id = node.textContent.toLowerCase().indexOf(q)

         if (id === -1) return

         const span = document.createElement('span')
         span.innerHTML = node.textContent.replace(
            new RegExp(q, 'gi'),
            m => `<mark class="SEARCH_HIGHLIGHT">${m}</mark>`
         )
         node.parentNode.replaceChild(span, node)
      })
   }

   /** 검색어 창 단축키 */
   document.addEventListener('keydown', e => {
      if (e.key === '/' && DOM.SEARCH && document.activeElement !== DOM.SEARCH) {
         e.preventDefault()
         DOM.SEARCH.focus()
      }
   })
}