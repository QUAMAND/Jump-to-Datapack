import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import { DOM } from "./DOM.mjs"
import { STATE } from "./STATE.mjs"
import { PAGE_FIND } from "./Page.mjs"

/** mermaid 색상 */
if (typeof mermaid !== 'undefined') {
   mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
         background: "#0b1220",
         primaryColor: "#111a2e",
         primaryBorderColor: "#7c6cff",
         primaryTextColor: "#e6eef8",
         secondaryColor: "#0f1724",
         tertiaryColor: "#1e2a47",
         textColor: "#e6eef8",
         nodeTextColor: "#e6eef8",
         lineColor: "#cfd8ff",
         arrowheadColor: "#a88cff",
         clusterBkg: "rgba(255,255,255,0.03)",
         clusterBorder: "rgba(124,108,255,0.4)",
         edgeLabelBackground: "#0b1220",
         noteBkgColor: "rgba(30,42,71,0.7)",
         noteTextColor: "#d0d8ff",
         noteBorderColor: "#7c6cff",
         activationBorderColor: "rgba(168,140,255,0.6)",
         activationBkgColor: "rgba(124,108,255,0.25)",
         mainBkg: "#111a2e",
         secondBkg: "#0f1724",
         tertiaryBkg: "#1e2a47",
         fontFamily: "Pyeongchang, GmarketSans, sans-serif",
         fontSize: "15px"
      }
   })
}

/**
 * 링크 프리뷰 박스
 */
const PREVIEW_BOX = document.createElement('div')
PREVIEW_BOX.id = 'LINK_PREVIEW'
document.body.appendChild(PREVIEW_BOX)

if (typeof hljs !== 'undefined') {
   hljs.registerLanguage('mcfunction', () => ({
      contains: [
         { className: 'comment', begin: /^#.*/, relevance: 0 },
         { className: 'string', begin: /"/, end: /"/ },
         { className: 'number', begin: /\b-?\d+(\.\d+)?\b/ },
         { className: 'selector', begin: /@[paresn]/ },
         { className: 'keyword', begin: /\b(?:advancement|attribute|clear|clone|damage|data|datapack|effect|enchant|execute|experience|fill|function|gamemode|gamerule|give|item|kill|locate|loot|particle|place|playsound|recipe|reload|return|ride|say|schedule|scoreboard|setblock|summon|tag|team|teleport|tell|tellraw|time|title|tp|trigger|weather|worldborder|xp)\b/ },
         { className: 'namespace', begin: /minecraft:[a-z0-9_\/]+/ },
         { className: 'bracket', begin: /[\[\]]/ },
      ]
   }))
}

/**
 * 마크다운 렌더러 설정
 */
export function CONFIGURE_MARKDOWN() {
   const RENDER = new marked.Renderer()

   /** 박스 */
   RENDER.paragraph = function(token) {
      let rawText = ""
      
      if (token.tokens) {
         rawText = this.parser.parseInline(token.tokens)
      } else {
         rawText = token.text || ""
      }

      const TYPES = ['info', 'warning', 'tip']
      
      for (const type of TYPES) {
         const regex = new RegExp(`^:::${type}\\s*([\\s\\S]*?):::`, 'i')
         const match = rawText.match(regex)

         if (match) {
            const content = match[1].trim()
            return `<div class="BOX BOX_${type}">
                  <img src="assets/img/box/${type}.png" class="BOX_ICON">
                  <div class="BOX_TEXT">${content}</div>
               </div>`
         }
      }

      return `<p>${rawText}</p>`
   }

   /** 코드 블록(mermaid 처리도 같이 함) */
   RENDER.code = function(token) {
      const code = token.text
      const lang = token.lang

      if (lang === 'mermaid') {
         return `<div class="mermaid">${code}</div>`
      }

      const HIGHLIGHT = (lang && typeof hljs !== 'undefined' && hljs.getLanguage(lang))
         ? hljs.highlight(code, { language: lang }).value
         : code

      return `<pre><code class="language-${lang || ''}">${HIGHLIGHT}</code></pre>`
   }

   marked.setOptions({ renderer: RENDER })
}

export const POST_PROCESS = {
   /** 컨트롤 + 클릭 복사 */
   INIT_COPY_EVENT() {
      const TOOLTIP = document.getElementById('CODE_TOOLTIP') || document.createElement('div')
      TOOLTIP.id = "CODE_TOOLTIP"
      TOOLTIP.textContent = "Ctrl + 클릭으로 전체 코드를 복사합니다."
      
      Object.assign(TOOLTIP.style, {
         position: "fixed", opacity: "0", pointerEvents: "none", zIndex: "9999",
         background: "var(--background)", color: "var(--title)", padding: "4px 10px",
         borderRadius: "8px", fontSize: "15px", transition: "opacity .2s ease",
         border: "2px outset var(--accent)"
      })
      
      if (!document.getElementById('CODE_TOOLTIP')) document.body.appendChild(TOOLTIP)

      /** tooltip 마우스 위 */
      document.addEventListener('mousemove', e => {
         const pre = e.target.closest('#ARTICLE pre')
         if (pre) {
            TOOLTIP.style.opacity = "1"
            TOOLTIP.style.left = e.clientX + 18 + "px"
            TOOLTIP.style.top = e.clientY + 14 + "px"
         } else {
            TOOLTIP.style.opacity = "0"
         }
      })

      /** 클릭 처리 */
      document.addEventListener('click', async e => {
         const pre = e.target.closest('#ARTICLE pre')

         /** ctrl + click */
         if (pre && e.ctrlKey) {
            e.preventDefault()
            
            try {
               await navigator.clipboard.writeText(pre.innerText)

               TOOLTIP.textContent = "Copied!"
               setTimeout(() => { 
                  TOOLTIP.textContent = "Ctrl + 클릭으로 전체 코드를 복사합니다." 
               }, 1400)
            } catch (e) {console.error("복사 실패:", e)}
         }
      })
   },

   /** 링크 미리 보기 */
   APPLY_LINK_PREVIEW() {
      const LINKS = DOM.ARTICLE.querySelectorAll('a')

      LINKS.forEach(link => {
         const href = link.getAttribute('href') || ''
         const text = link.textContent.trim()

         let IN_LINK = false
         let slug = null

         if (href.startsWith('#')) {
            slug = href.replace('#','')
            IN_LINK = true
         } else if (href.endsWith('.html')) {
            slug = href.replace('.html','')
            IN_LINK = true
         }

         if (!IN_LINK) {
            link.setAttribute('target', '_blank')
            link.setAttribute("rel", "noopener noreferrer")
         }

         link.addEventListener('mouseover', m => {
            if (href) {
               if (IN_LINK) {
                  const p = PAGE_FIND(STATE.pages, slug)
                  PREVIEW_BOX.innerHTML = `
                     <img src="assets/img/emoji/compass.png" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;">
                     <strong style="font-size:16px; color: var(--title)">${p.title}</strong><br>
                     <span style="margin-left: 30px; font-size:12px; color: var(--subtitle)">${p.summary}</span>
                  `
               } else {
                  try {
                     const domain = new URL(href).hostname

                     PREVIEW_BOX.innerHTML = `
                     <img src="assets/img/emoji/compass.png" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;">
                     <strong style="font-size:16px; color: var(--title)">${text}</strong><br>
                     <span style="margin-left: 30px; font-size:12px; color: var(--subtitle)">${domain}</span>
                     `
                  } catch {
                     PREVIEW_BOX.innerHTML = `<strong style="color: var(--subtitle)">${text}</strong>`
                  }
               }

               const rect = link.getBoundingClientRect()

               const x = rect.left + (rect.width / 2) - (PREVIEW_BOX.offsetWidth / 2)
               const y = rect.top - PREVIEW_BOX.offsetHeight - 4

               PREVIEW_BOX.style.left = `${Math.max(4, x + window.scrollX)}px`
               PREVIEW_BOX.style.top = `${Math.max(4, y + window.scrollY)}px`

               PREVIEW_BOX.style.display = 'block'
               PREVIEW_BOX.classList.add('show')
            }
         })

         link.addEventListener('mouseleave', m => {
            PREVIEW_BOX.classList.remove('show')
            PREVIEW_BOX.style.display = 'none'
         })

         link.addEventListener('click', () => {
            PREVIEW_BOX.classList.remove('show')
            PREVIEW_BOX.style.display = 'none'
         })
      })
   },

   /** 이모지(:minecraft:) */
   APPLY_EMOJI() {
      const path = 'assets/img/emoji'
      DOM.ARTICLE.innerHTML = DOM.ARTICLE.innerHTML.replace(/:([a-zA-Z0-9_]+):/g, (m, name) => {
         return `<img src="${path}/${name}.png" class="EMOJI">`
      })
   },

   /** 어노테이션(@blah) */
   APPLY_ANNOTATION() {
      const TATIONS = ["DEPRECATED", "TODO", "NOTE"]
      DOM.ARTICLE.querySelectorAll("p").forEach(p => {
         const match = p.textContent.trim().match(/^@([A-Za-z]+)\s*(.*)$/)
         if (!match || !TATIONS.includes(match[1].toUpperCase())) {
            return
         }
         const type = match[1].toUpperCase()
         const div = document.createElement("div")
         div.className = `ANNOTATION ${type}`
         div.innerHTML = `<span class="ANNOTATION_TEXT">@${type}</span> ${match[2]}`
         p.replaceWith(div)
      });
   }
};