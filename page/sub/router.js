const routes = {
   'jar': {
      title: 'JAR_downloads',
      icon: 'assets/img/page/jar.png',
      module: './type/jar.mjs'
   },
   'base64': {
      title: 'Base_64',
      icon: 'assets/img/page/base64.png',
      module: './type/base64.mjs'
   },
   'uuid': {
      title: 'UUID',
      icon: 'assets/img/page/uuid.png',
      module: './type/uuid.mjs'
   }
}

async function render() {
   const params = new URLSearchParams(window.location.search)
   const pageKey = params.get('page') || 'jar'

   const newUrl = `?page=${pageKey}`
   if (location.search !== newUrl) {
      history.pushState({page: pageKey}, "", newUrl)
   }

   const current = routes[pageKey]

   if (current) {
      /** 제목과 아이콘 */
      document.getElementById('DYNAMIC_TITLE').textContent = current.title
      document.getElementById('HOME_TITLE').textContent = current.title
      document.getElementById('DYNAMIC_ICON').href = current.icon

      /** 능동 모듈 */
      const { default: createPage } = await import(current.module)

      const root = document.getElementById('ROUTER')
      root.innerHTML = ""
      root.appendChild(createPage())
   }
}

/**
 * 앞/뒤로 가기
 */
window.onpopstate = (event) => {
   const page = event.state ? event.state.page : 'jar'
   render(page)
}

render()