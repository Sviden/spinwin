import { explodeEmojiAt } from "./animation.js";
import { updateScore } from "./utils.js";
import { gravityAndRefill } from "./swappAndGravity.js";
import { level, width } from "./constants.js";
import { checkWinCondition } from "./utils.js";
import { showWinMessage } from "./animation.js";

export function checkForMatches(candies) {
  const matched = checkRowMatches(candies) || checkColumnMatches(candies);
  matched && gravityAndRefill(candies);
  if (checkWinCondition(candies)) {
    showWinMessage();
    return;
  }
  if (!matched) {
    hasPossibleMoves(candies);
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
  const totalCells = width * width;

  for (let i = 0; i < totalCells; i++) {
    const right = i + 1;
    const down = i + width;

    if (i % width < width - 1) {
      if (wouldCreateMatch(i, right, candies)) return true;
    }

    if (down < totalCells) {
      if (wouldCreateMatch(i, down, candies)) return true;
    }
  }

  return false;
}

function wouldCreateMatch(id1, id2, candies) {
  // Simulate swap
  swapText(id1, id2, candies);
  const match = createsMatch(id1, candies) || createsMatch(id2, candies);
  swapText(id1, id2, candies); // Revert
  return match;
}

function createsMatch(index, candies) {
  const row = Math.floor(index / width);
  const col = index % width;
  const emoji = candies[index].textContent;
  if (!emoji) return false;

  // Horizontal check
  let horizontal = 1;
  for (let offset = 1; col + offset < width; offset++) {
    if (candies[index + offset].textContent === emoji) horizontal++;
    else break;
  }
  for (let offset = 1; col - offset >= 0; offset++) {
    if (candies[index - offset].textContent === emoji) horizontal++;
    else break;
  }
  if (horizontal >= 3) return true;

  // Vertical check
  let vertical = 1;
  for (let offset = 1; row + offset < width; offset++) {
    if (candies[index + offset * width].textContent === emoji) vertical++;
    else break;
  }
  for (let offset = 1; row - offset >= 0; offset++) {
    if (candies[index - offset * width].textContent === emoji) vertical++;
    else break;
  }

  return vertical >= 3;
}

function swapText(id1, id2, candies) {
  const temp = candies[id1].textContent;
  candies[id1].textContent = candies[id2].textContent;
  candies[id2].textContent = temp;
}
