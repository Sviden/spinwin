const movesEl = document.createElement("div");
movesEl.className = "movesLeft";

// Internal state management
let currentMoves = 0;

export function setInitialMoves(initialMoves) {
  currentMoves = initialMoves;
  updateMovesUI();

  // Append element if it doesn't exist
  if (!document.querySelector(".movesLeft .movesLeft")) {
    document.querySelector(".movesLeft").appendChild(movesEl);
  }

  const difficultySelect = document.getElementById("difficulty");

  // Remove existing listener if any
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
  return currentMoves;
}

export function getMovesLeft() {
  return currentMoves;
}

export function isGameOver() {
  return currentMoves <= 0;
}

export function updateMovesUI() {
  movesEl.textContent = `Moves Left: ${currentMoves}`;
}
