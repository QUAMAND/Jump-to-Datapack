function ANNOTATION_IN() {
   const TATIONS = ["DEPRECATED", "TODO", "NOTE"];

   ARTICLE.querySelectorAll("p").forEach(p => {
      const match = p.textContent.trim().match(/^@([A-Za-z]+)\s*(.*)$/);
      if (!match || !TATIONS.includes(match[1].toUpperCase())) return;

      p.replaceWith(Object.assign(document.createElement("div"), {
         className: `ANNOTATION ${match[1].toUpperCase()}`,
         innerHTML: `<span class="ANNOTATION_TEXT">@${match[1]}</span>`
      }));
   });
}