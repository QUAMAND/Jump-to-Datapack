export function createTool({title, content, onInit}){
   const wrapper = document.createElement("div")

   wrapper.innerHTML = `
      <h2>${title}</h2>
      <div class="TOOL_BODY">
         ${content}
      </div>
   `

   setTimeout(()=> onInit?.(wrapper),0)

   return wrapper
}