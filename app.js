const SIDEBARS = document.getElementById('SIDEBAR')
const SEARCH = document.getElementById('SEARCH')
const PAGES = document.getElementById('PAGES')
const ARTICLE = document.getElementById('ARTICLE')
const TITLE = document.getElementById('TITLE')
const SUBTITLE = document.getElementById('SUBTITLE')
const TOP_TITLE = document.getElementById('TOP_TITLE')

/** 진행 바
 * 스크롤 시 표시될 진행 바입니다.
 */
const CONTENT = document.querySelector('.CONTENT')
CONTENT.addEventListener('scroll', c => {
   const Top = CONTENT.scrollTop
   const ContentHeight = CONTENT.scrollHeight - CONTENT.clientHeight
   const progress = ContentHeight <= 0 ? 0 : (Top / ContentHeight) * 100

   document.getElementById("PROGRESS").style.width = progress + "%"
})

/** 앵무새
 * 로딩 중일 때, 표시되는 앵무새입니다.
 */
const PARROT = document.getElementById('LOADING')

/** 검색 창 단축키
 * 슬래시(/) 키를 입력 시에 검색 창으로 이동합니다.
 */
document.addEventListener('keydown', k => {
   if (k.key === '/' && document.activeElement !== SEARCH) {
      k.preventDefault()
      SEARCH.focus()
   }
})


/** PRELOAD
 * 모든 페이지의 내용을 미리 로드합니다.
 */
async function PRELOAD(list) {
   for (const p of list) {
      if (p.file && p.slug !== 'null') {
         try {
            p.content = await (await fetch(p.file)).text()
         } catch {}
      }
      if (p.children) await PRELOAD(p.children)
   }
}
/** LOADING
 * 초기 로딩입니다.
 */
let pages = []
let path = 'docs/1/pages.json'
async function LOADING() {
   PARROT.style.display = 'flex'
      const f = await fetch(path)
      pages = await (f.json())
      await PRELOAD(pages)
      SIDEBAR(pages)
      const slug = location.hash.replace('#','') || pages[0]?.slug
      if (slug) {
         LOAD_PAGE(slug)
      }
   PARROT.style.display = 'none'
}

/** SIDEBAR
 * 사이드 바를 렌더링합니다.
 */
function SIDEBAR(list, depth = 0, search = '') {
   if (depth === 0) {
      PAGES.innerHTML = ''
   }

   list.forEach(p => {
      if (!p.title || p.slug === 'null') {
         const space = document.createElement('div')
         space.className = 'SIDE_SPACER'
         space.style.height = '14px'
         PAGES.appendChild(space)
         return
      }

      const a = document.createElement('a')
      if (depth === 0) {
         a.style.fontSize = "22px"
      }
      a.className = 'SIDE_ITEM'
      a.textContent = p.title
      a.dataset.slug = p.slug
      a.style.paddingLeft = `${12 + depth * 10}px`
      a.href = '#' + p.slug

      a.addEventListener('click', e => {
         e.preventDefault()
         const s = a.dataset.slug
         history.pushState({slug: s}, '', '#' + s)
         LOAD_PAGE(s)
      })
      PAGES.appendChild(a)

      if (p.children && Array.isArray(p.children)) {
         SIDEBAR(p.children, depth + 1, search)
      }
   });
}

/** PAGE
 * 실제 페이지를 로딩합니다.
 */
async function LOAD_PAGE(slug) {
   if (window.innerWidth <= 768) {
      MENU_BTN.classList.remove('open')
      SIDEBARS.classList.remove('open')
   }

   // 선택한 SIDE_ITEM 효과
   document.querySelectorAll('.SIDE_ITEM').forEach(a => {
      a.classList.toggle('active', a.dataset.slug === slug)
   })

   const p = PAGE_FIND(pages, slug)
   if (!p) {
      ARTICLE.innerHTML = ''
      TITLE.textContent = ''
      SUBTITLE.innerHTML = ''
      return
   }

   TITLE.textContent = p.title
   SUBTITLE.textContent = p.summary

   try {
      if (!p.content) {
         p.content = await (await fetch(p.file)).text()
      }
      ARTICLE.innerHTML = marked.parse(p.content)
      const MERMAID = ARTICLE.querySelectorAll('.mermaid')
      if (MERMAID.length > 0 && window.mermaid) {
         setTimeout(async () => {
            try {
               await mermaid.run({ nodes: ARTICLE.querySelectorAll('.mermaid') })
            } catch (e) {}
         }, 50)
      }

      EMOJI_IN()
      ANNOTATION_IN()
      const q = SEARCH.value.trim().toLowerCase()
      if (q) HIGHLIGHT(q)
   } catch (e) {
      ARTICLE.textContent = '로딩 실패: ' + e
   }
}
/** PAGE_FIND
 * 표시할 페이지를 일차적으로 검색합니다.
 */
function PAGE_FIND(list, slug) {
   for (const p of list) {
      if (p.slug === slug) {
         return p;
      } else if (p.children) {
         const children = Array.isArray(p.children) ? p.children : [p.children]
         const found = PAGE_FIND(children, slug)
         if (found) {
            return found
         }
      }
   }
   return null
}

/** SEARCH
 * 검색어에 맞는 항목을 사이드바에서 선택합니다.
 */
SEARCH.addEventListener('input', i => {

   const q = SEARCH.value.trim().toLowerCase()

   if (q === '') {
      SIDEBAR(pages)
      const slug = location.hash.replace('#','')
      if (slug) LOAD_PAGE(slug)
      return
   }

   const result = SEARCH_PAGES(pages, q)
   SIDEBAR(result)

   if (result.length > 0) {
      LOAD_PAGE(result[0].slug)
   } else {
      TITLE.textContent = '검색 결과 없음'
      SUBTITLE.textContent = `"${q}"에 해당하는 내용이 없습니다.`
      ARTICLE.innerHTML = ''
   }
})
/** SEARCH_PAGES
 * 검색어가 포함된 페이지를 재귀로 찾습니다.
 */
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
/** HIGHLIGHT
 * ARTICLE 내 검색어에 효과를 부여합니다.
 */
function HIGHLIGHT(q) {
   if (!q) return
   const walker = document.createTreeWalker(ARTICLE, NodeFilter.SHOW_TEXT)
   const nodes = []

   while (walker.nextNode()) nodes.push(walker.currentNode)

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


/** MODE_CHANGE
 * 가장 위 타이틀 클릭 시, Jump to Datapack과 Dive to Datapack을 서로 변경합니다.
 */
const MODES = ['menu','jump', 'dive']
const MODES_ID = ['Menu', 'Jump to Datapack', 'Dive to Datapack']

let mode = 'jump' // 현재 모드
let modeN = 1 // 바뀔 모드 인덱스

TOP_TITLE.addEventListener('click', c => {
   modeN += 1
   if (modeN > 2) modeN = 1
   mode = MODES[modeN-1]
   location.hash = modeN
   TOP_TITLE.textContent = MODES_ID[modeN-1]
})

window.addEventListener('hashchange', MODE_CHANGE)
MODE_CHANGE()

function MODE_CHANGE() {
   const hash = location.hash.replace('#','')

   modeN = parseInt(hash) || modeN
   mode = MODES[modeN]
   path = "docs/" + modeN + "/pages.json"
   TOP_TITLE.textContent = MODES_ID[modeN]
   LOADING()
}

/** 뒤/앞으로 가기 수정
 * 이전과 이후 화면을 동기화 합니다.
 */
window.addEventListener('popstate', p => {
   const slug = location.hash.replace('#','').charAt(0)
   if (slug !== modeN.toString()) {
      modeN = parseInt(slug)
      mode = MODES[modeN-1]
      MODE_CHANGE()
   } else if (slug) {
      MODE_CHANGE()
      LOAD_PAGE(slug)
   }
})

/** LOADING START
 * 초기 로딩 시작입니다.
 */
if (!location.hash) {
   location.hash = '1'
}

LOADING()