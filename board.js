import { width, emojis } from "./constants.js";

export function createBoard(candies) {
  const grid = document.getElementById("grid");

  for (let i = 0; i < width * width; i++) {
    const candyDiv = document.createElement("div");
    candyDiv.classList.add("candy");

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    candyDiv.textContent = randomEmoji;

    candyDiv.setAttribute("data-id", i);
    candies.push(candyDiv);
    grid.appendChild(candyDiv);
  }
}
