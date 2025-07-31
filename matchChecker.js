import { explodeEmojiAt } from "./animation.js";
import { updateScore } from "./utils.js";
import { gravityAndRefill } from "./swappAndGravity.js";
import { width } from "./constants.js";
import { checkWinCondition } from "./utils.js";
import { showWinMessage } from "./animation.js";

export function checkForMatches(candies) {
  const matched = checkRowMatches(candies) || checkColumnMatches(candies);
  matched && gravityAndRefill(candies);
  if (!matched) {
    hasPossibleMoves(candies);
  }
  if (checkWinCondition(candies)) {
    showWinMessage();
    return;
  }
  return matched;
}

export function checkRowMatches(candies) {
  let found = false;

  for (let i = 0; i < width * width; i += width) {
    let currentEmoji = candies[i].textContent;
    let matchingEmojies = [];

    for (let j = 0; j < width; j++) {
      const cellIndex = i + j;
      if (
        candies[cellIndex].textContent === currentEmoji &&
        currentEmoji !== ""
      ) {
        matchingEmojies.push(cellIndex);
      } else {
        found = handleMatches(candies, matchingEmojies, currentEmoji, found);

        currentEmoji = candies[cellIndex].textContent;
        matchingEmojies = currentEmoji !== "" ? [cellIndex] : [];
      }
    }

    found = handleMatches(candies, matchingEmojies, currentEmoji, found);
  }

  return found;
}

export function checkColumnMatches(candies) {
  let found = false;

  for (let i = 0; i < width; i++) {
    let currentEmoji = candies[i].textContent;
    let matchingEmojies = [];

    for (let j = 0; j < width; j++) {
      const cellIndex = j * width + i;
      if (
        candies[cellIndex].textContent === currentEmoji &&
        currentEmoji !== ""
      ) {
        matchingEmojies.push(cellIndex);
      } else {
        found = handleMatches(candies, matchingEmojies, currentEmoji, found);

        currentEmoji = candies[cellIndex].textContent;
        matchingEmojies = currentEmoji !== "" ? [cellIndex] : [];
      }
    }

    found = handleMatches(candies, matchingEmojies, currentEmoji, found);
  }

  return found;
}

function handleMatches(candies, matchingEmojies, currentEmoji, found) {
  let currentFound = found;
  if (matchingEmojies.length >= 3) {
    matchingEmojies.forEach((index) => {
      explodeEmojiAt(candies[index], currentEmoji);
      updateScore(1);
      candies[index].textContent = "";
      candies[index].classList.add("matched");
      currentFound = true;
    });
  }
  return currentFound;
}

export function hasPossibleMoves(candies) {
  for (let i = 0; i < width * width; i++) {
    if (i % width < width - 1) {
      const rightIndex = i + 1;
      swapText(i, rightIndex, candies);

      if (createsMatch(i, candies) || createsMatch(rightIndex, candies)) {
        swapText(i, rightIndex, candies);
        return true;
      }

      swapText(i, rightIndex, candies);
    }

    if (i + width < width * width) {
      const bottomIndex = i + width;
      swapText(i, bottomIndex, candies);

      if (createsMatch(i, candies) || createsMatch(bottomIndex, candies)) {
        swapText(i, bottomIndex, candies);
        return true;
      }

      swapText(i, bottomIndex, candies);
    }
  }

  return false;
}

function createsMatch(index, candies) {
  const row = Math.floor(index / width);
  const col = index % width;
  const emoji = candies[index].textContent;

  if (emoji === "") return false;

  let matchCount = 1;
  for (let offset = 1; col + offset < width; offset++) {
    if (candies[index + offset].textContent === emoji) matchCount++;
    else break;
  }
  for (let offset = 1; col - offset >= 0; offset++) {
    if (candies[index - offset].textContent === emoji) matchCount++;
    else break;
  }
  if (matchCount >= 3) return true;

  matchCount = 1;
  for (let offset = 1; row + offset < width; offset++) {
    if (candies[index + offset * width].textContent === emoji) matchCount++;
    else break;
  }
  for (let offset = 1; row - offset >= 0; offset++) {
    if (candies[index - offset * width].textContent === emoji) matchCount++;
    else break;
  }
  return matchCount >= 3;
}

function swapText(id1, id2, candies) {
  const temp = candies[id1].textContent;
  candies[id1].textContent = candies[id2].textContent;
  candies[id2].textContent = temp;
}
