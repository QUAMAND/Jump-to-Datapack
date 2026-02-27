function EMOJI_IN() {
   const path = 'assets/img/emoji'
   ARTICLE.innerHTML = ARTICLE.innerHTML.replace(/:([a-zA-Z0-9_]+):/g, (m, name) => {
      return `<img src="${path}/${name}.png" class="EMOJI">`
   })
}