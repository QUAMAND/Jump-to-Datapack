const RENDER = new marked.Renderer()

RENDER.paragraph = function(text) {
   const TYPES = ['info','warning', 'tip']

   for (const type of TYPES) {
      const regex = new RegExp(`^:::${type}\\s*(.*):::`, 's')
      const match = text.match(regex)

      if (match) {
         const content = match[1].trim()
         return `<div class="BOX BOX_${type}">
            <img src="assets/img/box/${type}.png" class="BOX_ICON">
            <div class="BOX_TEXT">${content}</div>
         </div>
         `
      }
   }
   return `<p>${text}</p>`
}

RENDER.code = function(code, lang) {
   if (lang === 'mermaid') {
      return `<div class="mermaid">${code}</div>`
   }
   const HIGHLIGHT = (lang && hljs.getLanguage(lang))
      ? hljs.highlight(code, { language: lang }).value
      : code
   return `<pre><code class="language-${lang || ''}">${HIGHLIGHT}</code></pre>`
}

marked.setOptions({ renderer: RENDER })