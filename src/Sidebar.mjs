import { DOM } from "./DOM.mjs"
import { LOAD_PAGE } from "./Page.mjs"

/**
 * 사이드 바 표시
 */
export function SIDEBAR_RENDER(list, depth = 0) {
   if (depth === 0) DOM.PAGES.innerHTML = ''

   list.forEach(element => {
      /** null.md 공간 띄우기로 활용 */
      if (!element.title || element.slug === 'null') {
         const space = document.createElement('div')
         space.style.height = '14px'
         DOM.PAGES.appendChild(space)
         return
      }

      const a = document.createElement('a')
      /** 최상위 부모.md 글씨 크기 키우기 */
      if (depth === 0) a.style.fontSize = '22px'

      a.className = 'SIDE_ITEM'
      a.textContent = element.title
      a.dataset.slug = element.slug
      a.style.paddingLeft = `${12 + depth * 10}px`
      a.href = '#' + element.slug

      a.onclick = o => {
         o.preventDefault()
         history.pushState({ slug: element.slug }, '', '#' + element.slug)
         LOAD_PAGE(element.slug)
      }

      DOM.PAGES.appendChild(a)

      if (element.children) {
         SIDEBAR_RENDER(element.children, depth + 1)
      }
   })
}