const PREVIEW_BOX = document.createElement('div')
PREVIEW_BOX.id = 'LINK_PREVIEW'
document.body.appendChild(PREVIEW_BOX)

function LINK_IN() {
   const LINKS = ARTICLE.querySelectorAll('a')

   LINKS.forEach(link => {
      const href = link.getAttribute('href')
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
               const p = PAGE_FIND(pages, slug)
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

            PREVIEW_BOX.style.display = 'block';
            PREVIEW_BOX.classList.add('show');
         }
      })

      link.addEventListener('mouseleave', m => {
         PREVIEW_BOX.classList.remove('show')
         PREVIEW_BOX.style.display = 'none'
      })
   })
}