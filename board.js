import { width, emojis, level } from "./constants.js";
const emojisToAdd = [
  "🎈",
  "🍦",
  "🍟",
  "🍿",
  "🍹",
  "🍉",
  "🍌",
  "🫐",
  "🥥",
  "🍕",
  "🍧",
];

export function createBoard(candies) {
  const grid = document.getElementById("grid");

  for (let i = 0; i < level; i++) {
    const uniqEmoji = emojisToAdd.find((emoji) => !emojis.includes(emoji));
    emojis.push(uniqEmoji);
  }

  // Set grid layout before creating candies
  if (width === 6) {
    grid.style.gridTemplateColumns = `repeat(${width}, 50px)`;
  } else {
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
  }

  for (let i = 0; i < width * width; i++) {
    const candyDiv = document.createElement("div");
    const candyWrapper = document.createElement("div");
    candyWrapper.classList.add("candyWrapper");
    candyWrapper.appendChild(candyDiv);
    candyDiv.classList.add("candy");

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    candyDiv.textContent = randomEmoji;

    candyDiv.setAttribute("data-id", i);
    candies.push(candyDiv);
    grid.appendChild(candyWrapper);
  }
}
