import { colorTextAnimation } from "./animation.js";

const movesEl = document.createElement("h4");
movesEl.className = "movesLeft";

let currentMoves = 10;

export function setInitialMoves() {
  //   currentMoves = initialMoves;
  updateMovesUI();

  if (!document.querySelector(".movesLeft .movesLeft")) {
    document.querySelector(".movesLeft").appendChild(movesEl);
  }

  const difficultySelect = document.getElementById("difficulty");

  const newSelect = difficultySelect.cloneNode(true);
  difficultySelect.parentNode.replaceChild(newSelect, difficultySelect);

  newSelect.addEventListener("change", () => {
    const value = newSelect.value;
    if (value === "easy") currentMoves = 100;
    else if (value === "medium") currentMoves = 50;
    else if (value === "hard") currentMoves = 10;
    updateMovesUI();
  });
}

export function decrementMoves() {
  currentMoves--;
  updateMovesUI();
  colorTextAnimation(movesEl);
  return currentMoves;
}

export function isGameOver() {
  return currentMoves <= 0;
}

export function updateMovesUI() {
  movesEl.textContent = `Moves Left: ${currentMoves}`;
}
