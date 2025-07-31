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
      decrementMoves();

      if (isGameOver()) {
        showLoseMessage();
        return;
      }

      runInitialMatchLoop();
    }
  }, 300);
}

export function gravityAndRefill(candies) {
  for (let i = 0; i < width; i++) {
    let emptyRowIndex = (width - 1) * width + i;

    for (let j = width - 1; j >= 0; j--) {
      const currentIndex = j * width + i;

      if (candies[currentIndex].textContent !== "") {
        candies[emptyRowIndex].textContent = candies[currentIndex].textContent;
        if (emptyRowIndex !== currentIndex) {
          candies[currentIndex].textContent = "";
        }
        emptyRowIndex -= width;
      }
    }
  }

  for (let i = 0; i < width * width; i++) {
    if (candies[i].textContent === "") {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      candies[i].textContent = randomEmoji;
    }
  }
}
