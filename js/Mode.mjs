import { STATE } from "./STATE.mjs"

export function MODE_TOGGLE() {
   const next = STATE.modeN === 1 ? 2 : 1
   location.hash = next
}