import { width, emojis } from "./constants.js";
import { checkForMatches } from "./matchChecker.js";
import { runInitialMatchLoop } from "./script.js";
import { decrementMoves, isGameOver } from "./movesLeft.js";
import { showLoseMessage } from "./animation.js";

export function swapCandies(id1, id2, candies) {
  const candy1 = candies[id1];
  const candy2 = candies[id2];

  const temp = candy1.textContent;
  candy1.textContent = candy2.textContent;
  candy2.textContent = temp;

  gsap.fromTo(
    [candy1, candy2],
    { scale: 1 },
    { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }
  );

  setTimeout(() => {
    const matched = checkForMatches(candies);

    if (!matched) {
      // No match → revert swap
      const revert = candy1.textContent;
      candy1.textContent = candy2.textContent;
      candy2.textContent = revert;

      gsap.fromTo(
        [candy1, candy2],
        { scale: 1 },
        {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        }
      );
    } else {
      // Decrement moves using centralized management
      decrementMoves();

      // Check if game is over
      if (isGameOver()) {
        showLoseMessage();
        return;
      }

      // If matched, keep running loop until no more matches
      runInitialMatchLoop();
    }
  }, 300);
}

export function gravityAndRefill(candies) {
  // 1. Drop existing candies down
  for (let i = 0; i < width; i++) {
    // Iterate through each column
    let emptyRowIndex = (width - 1) * width + i; // Start pointer at bottom of column

    // Iterate from the bottom to the top of the current column
    for (let j = width - 1; j >= 0; j--) {
      const currentIndex = j * width + i;

      // If the current spot has a candy, move it to the lowest available empty spot
      if (candies[currentIndex].textContent !== "") {
        candies[emptyRowIndex].textContent = candies[currentIndex].textContent;
        // If we moved the candy, clear its original spot
        if (emptyRowIndex !== currentIndex) {
          candies[currentIndex].textContent = "";
        }
        emptyRowIndex -= width; // Move the empty spot pointer up by one row
      }
    }
  }

  // 2. Refill any remaining empty spots from the top
  for (let i = 0; i < width * width; i++) {
    if (candies[i].textContent === "") {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      candies[i].textContent = randomEmoji;
    }
  }
}
