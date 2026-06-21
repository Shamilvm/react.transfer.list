import { componentStyles } from "./componentStyles";

let injected = false;

export function injectStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;

  const style = document.createElement("style");
  style.setAttribute("data-stl", "transfer-list");
  style.textContent = componentStyles;
  document.head.appendChild(style);
}
