import JarPage from "./type/jar.mjs"
import Base64Page from "./type/base64.mjs"
import UUIDPage from "./type/uuid.mjs"

const pages = {
    'jar': JarPage,
    'base64': Base64Page,
    'uuid': UUIDPage
}

const VIEW = document.getElementById("SUB_VIEW")

function init() {
    const params = new URLSearchParams(window.location.search)
    const type = params.get('page') || 'jar'

    if (pages[type]) {
        VIEW.innerHTML = ""
        VIEW.appendChild(pages[type]())
    }
}

window.onpopstate = init
init()