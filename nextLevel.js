import { width, emojis, level } from "./constants.js";

export const nextLevel = () => {
  if (!level || !width) {
    localStorage.setItem("level", "1");
    localStorage.setItem("width", width.toString());
  }

  const nextLevelNum = level ? level + 1 : 2;
  const nextWidth = width ? width + 1 : width + 1;

  localStorage.setItem("level", nextLevelNum.toString());
  if (nextWidth <= 8) {
    localStorage.setItem("width", nextWidth.toString());
  } else {
  }

  return true;
};
