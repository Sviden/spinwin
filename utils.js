import { colorTextAnimation } from "./animation.js";

const scoreEl = document.getElementById("score");
let score = 0;

export function updateScore(amount) {
  score += amount;
  scoreEl.textContent = score;
  colorTextAnimation(scoreEl);
}

export function areAdjacent(id1, id2, width) {
  const difference = Math.abs(id1 - id2);
  return (
    (difference === 1 && Math.floor(id1 / width) === Math.floor(id2 / width)) ||
    difference === width
  );
}

export function checkWinCondition(candies) {
  return candies.every((candy) => candy.classList.contains("matched"));
}
