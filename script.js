import { checkForMatches, hasPossibleMoves } from "./matchChecker.js";
import { gravityAndRefill, swapCandies } from "./swappAndGravity.js";
import { areAdjacent, checkWinCondition } from "./utils.js";
import { createBoard } from "./board.js";
import { width, emojis } from "./constants.js";
import {
  noMovesAlert,
  reshuffleCandiesWithAnimation,
  showWinMessage,
} from "./animation.js";
import { setInitialMoves } from "./movesLeft.js";

const candies = [];
let dragStartId = null;

createBoard(candies);
setInitialMoves(100);
runInitialMatchLoop();

// Drag start
candies.forEach((candy) => {
  candy.addEventListener("mousedown", () => {
    dragStartId = parseInt(candy.getAttribute("data-id"));
    // candy.style.outline = "2px solid gold";
  });

  candy.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains("candy")) {
      dragStartId = parseInt(target.getAttribute("data-id"));
    }
  });
});

// Drop - Desktop
document.addEventListener("mouseup", (e) => {
  if (dragStartId === null) return;

  const target = e.target;
  if (target && target.classList.contains("candy")) {
    const dragEndId = parseInt(target.getAttribute("data-id"));

    if (
      dragStartId !== dragEndId &&
      areAdjacent(dragStartId, dragEndId, width)
    ) {
      swapCandies(dragStartId, dragEndId, candies);
    }
  }

  dragStartId = null;
});

// Drop - Mobile
document.addEventListener("touchend", (e) => {
  if (dragStartId === null) return;

  const touch = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  if (target && target.classList.contains("candy")) {
    const dragEndId = parseInt(target.getAttribute("data-id"));

    if (
      dragStartId !== dragEndId &&
      areAdjacent(dragStartId, dragEndId, width)
    ) {
      swapCandies(dragStartId, dragEndId, candies);
    }
  }

  dragStartId = null;
});

export function runInitialMatchLoop() {
  const loop = () => {
    const matched = checkForMatches(candies);

    if (matched) {
      if (checkWinCondition(candies)) {
        showWinMessage();
        return;
      }
      setTimeout(() => {
        gravityAndRefill(candies);
        // Keep checking for new matches after refill
        setTimeout(loop, 300);
      }, 500); // Wait for explosion animation to finish
    } else {
      if (!hasPossibleMoves(candies)) {
        noMovesAlert(() => {
          reshuffleCandiesWithAnimation(candies, emojis, () => {
            runInitialMatchLoop();
          });
        });
      }
    }
  };

  loop();
}
