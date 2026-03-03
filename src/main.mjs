import { DOM } from "./DOM.mjs";
import { STATE } from "./STATE.mjs";
import { SITE_LOAD } from "./Loader.mjs";
import { SEARCH } from "./Search.mjs";
import { MODE_TOGGLE } from "./Mode.mjs";

/**
 * 1. 환경 체크
 */
const path = window.location.pathname;
const isSUB = path.includes("page/sub/");
const isTOOL = path.includes("page/tool/");
const isMAIN = !isSUB && !isTOOL;

/**
 * 2. 메인 위키 전용 기능
 */
if (isMAIN) {
    /** 진행 바 */
    if (DOM.CONTENT && DOM.PROGRESS) {
        DOM.CONTENT.addEventListener("scroll", () => {
            const top = DOM.CONTENT.scrollTop;
            const height = DOM.CONTENT.scrollHeight - DOM.CONTENT.clientHeight;
            DOM.PROGRESS.style.width = (top / height) * 100 + "%";
        });
    }

    /** 검색어 창 단축키 */
    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && DOM.SEARCH && document.activeElement !== DOM.SEARCH) {
            e.preventDefault();
            DOM.SEARCH.focus();
        }
    });

    /** 모드 변경 */
    if (DOM.TOP_TITLE) {
        DOM.TOP_TITLE.onclick = MODE_TOGGLE;
    }
}

/**
 * 3. 모드 적용 함수
 */
function MODE_APPLY() {
    const n = parseInt(location.hash.replace("#", ""));
    if (isNaN(n)) return;

    STATE.modeN = n;
    STATE.mode = STATE.modes[n];
    STATE.path = `docs/${n}/pages.json`;
    if (DOM.TOP_TITLE) {
        DOM.TOP_TITLE.textContent = STATE.modes_name[n];
    }
}

/**
 * 4. 사이트 첫 진입 (초기화)
 */
function INIT() {
    INIT_UI_EVENTS();

    /** 최상위 index.html */
    if (isMAIN) {
        if (!location.hash) {
            location.hash = "1";
            return;
        }
        MODE_APPLY();
        SITE_LOAD();
        if (typeof SEARCH === "function") SEARCH();
    }
}
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", INIT);
} else INIT();

/**
 * 5. 주소 변경
 */
window.addEventListener("hashchange", () => {
    if (isMAIN) {
        MODE_APPLY();
        SITE_LOAD();
    }
});

/**
 * 6. UI 이벤트 초기화
 */
function INIT_UI_EVENTS() {
    /** 메뉴 버튼 */
    if (DOM.MENU_BTN && DOM.SIDEBARS) {
        DOM.MENU_BTN.addEventListener("click", (e) => {
            e.stopPropagation();
            DOM.MENU_BTN.classList.toggle("open");
            DOM.SIDEBARS.classList.toggle("open");
        });
    }

    /** MORE 버튼 */
    if (DOM.MORE_BTN && DOM.MORE_LIST) {
        DOM.MORE_BTN.addEventListener("click", (e) => {
            e.stopPropagation();
            DOM.MORE_BTN.classList.toggle("open");
            DOM.MORE_LIST.classList.toggle("open");
        });
    }

    /** 닫기 */
    document.addEventListener("click", (e) => {
        /** 메뉴 버튼 */
        if (DOM.MENU_BTN && DOM.SIDEBARS) {
            if (!DOM.MENU_BTN.contains(e.target) && !DOM.SIDEBARS.contains(e.target)) {
                DOM.MENU_BTN.classList.remove("open");
                DOM.SIDEBARS.classList.remove("open");
            }
        }
        /** MORE 버튼 */
        if (DOM.MORE_BTN && DOM.MORE_LIST) {
            if (!DOM.MORE_BTN.contains(e.target) && !DOM.MORE_LIST.contains(e.target)) {
                DOM.MORE_BTN.classList.remove("open");
                DOM.MORE_LIST.classList.remove("open");
            }
        }
    });

    /** 홈 버튼 */
    if (DOM.HOME_TITLE) {
        DOM.HOME_TITLE.onclick = () => {
            location.href = "#1";
        };
    }
}
