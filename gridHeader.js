import { width } from "./constants.js";

export function createGridHeader() {
  const gridHeader = document.querySelector(".gridHeader");
  const gridHeaderItem = document.createElement("div");
  gridHeaderItem.classList.add("gridHeaderItem");
  gridHeaderItem.textContent = "🍩";

  for (let i = 0; i < width; i++) {
    gridHeader.appendChild(gridHeaderItem.cloneNode(true));
  }
}
