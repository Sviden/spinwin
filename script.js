import { checkForMatches, hasPossibleMoves } from "./matchChecker.js";
import { gravityAndRefill, swapCandies } from "./swappAndGravity.js";
import { areAdjacent, checkWinCondition } from "./utils.js";
import { createBoard } from "./board.js";
import { width, emojis } from "./constants.js";
import {
  noMovesAlert,
  reshuffleCandiesWithAnimation,
  showWinMessage,
  startFloatingBackground,
} from "./animation.js";
import { setInitialMoves } from "./movesLeft.js";

const candies = [];
let dragStartId = null;

createBoard(candies);
setInitialMoves(10);
runInitialMatchLoop();
startFloatingBackground();

// Drag start
candies.forEach((candy) => {
  candy.addEventListener("mousedown", () => {
    dragStartId = parseInt(candy.getAttribute("data-id"));
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
        setTimeout(loop, 300);
      }, 500);
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
