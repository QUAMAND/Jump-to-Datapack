
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
window.mermaid = mermaid;
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
});