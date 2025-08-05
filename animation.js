import { emojiPool, emojiPoolLose, emojis, width } from "./constants.js";
import { nextLevel } from "./nextLevel.js";
gsap.registerPlugin(SplitText);

export function explodeEmojiAt(element, emoji) {
  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div");
    particle.textContent = emoji;
    particle.classList.add("particle");

    document.body.appendChild(particle);

    particle.style.position = "absolute";
    particle.style.left = rect.left + rect.width / 2 + "px";
    particle.style.top = rect.top + rect.height / 2 + "px";
    particle.style.pointerEvents = "none";

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 20;

    //convert angle and distance to x - horizonatl / y-vertical movement
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    gsap.to(particle, {
      x: dx,
      y: dy,
      opacity: 0.9,
      scale: 1.5,
      duration: 1.2,
      ease: "power1.inOut",
      onComplete: () => particle.remove(),
    });
  }
}

export function noMovesAlert(onComplete) {
  const alert = document.createElement("div");
  alert.textContent = "No more possible moves! Refreshing candies...";
  alert.classList.add("noMovesAlert");
  document.body.appendChild(alert);

  gsap.to(alert, {
    opacity: 0,
    duration: 3,
    ease: "power2.inOut",
    onComplete: () => {
      alert.remove();
      if (onComplete) onComplete();
    },
  });
}

export function reshuffleCandiesWithAnimation(candies, onComplete) {
  const tl = gsap.timeline();

  tl.to(candies, {
    scale: 0.8,
    rotation: 360,
    duration: 0.8,
    ease: "power2.inOut",
    stagger: {
      amount: 1,
      from: "random",
    },
  });

  //function in timeline that runs exactly at this point in animation
  tl.call(() => {
    const newEmojis = [];

    for (let i = 0; i < candies.length; i++) {
      if (candies[i].textContent !== "") {
        newEmojis.push(candies[i].textContent);
      }
    }

    //  Fisher-Yates shuffle algorithm.
    for (let i = newEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); //random index generator
      [newEmojis[i], newEmojis[j]] = [newEmojis[j], newEmojis[i]]; //swap
    }

    for (let i = 0; i < candies.length; i++) {
      candies[i].textContent = newEmojis[i] || "";
    }
  });

  // here bounce back to normal size
  tl.to(candies, {
    scale: 1,
    rotation: 0,
    duration: 0.8,
    ease: "bounce.out",
    stagger: {
      amount: 0.4,
      from: "random",
    },
  });

  // small bounce at the end of animation
  tl.to(candies, {
    scale: 1.05,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  });

  // fn to run all checks again (match, possibleSwitch)
  tl.call(() => {
    if (onComplete) onComplete();
  });

  return tl;
}

export function showWinMessage() {
  const message = document.createElement("div");
  message.classList.add("winMessage");

  const text = document.createElement("div");
  text.textContent = "🎉 Congratulations! 🎉";

  const nextLevelBtn = document.createElement("button");
  nextLevelBtn.textContent = "Next level";
  nextLevelBtn.classList.add("restartBtn");

  nextLevelBtn.addEventListener("click", () => {
    if (nextLevel() === true) {
      message.remove();
      location.reload();
    }
  });

  message.appendChild(text);
  message.appendChild(nextLevelBtn);
  document.body.appendChild(message);

  // Animate message
  gsap.fromTo(
    message,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1.5, duration: 3, ease: "sine.in" }
  );

  gsap.fromTo(
    nextLevelBtn,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 3, ease: "bounce.out", delay: 3 }
  );

  emojiRain(true);
}

function emojiRain(isWin) {
  let total = 0;
  const max = 300;
  const batchSize = 10;
  const interval = 150;

  const dropWave = setInterval(() => {
    for (let i = 0; i < batchSize; i++) {
      const particle = document.createElement("div");

      const emojisArray = isWin ? emojiPool : emojiPoolLose;

      const randomEmoji =
        emojisArray[Math.floor(Math.random() * emojisArray.length)];
      particle.textContent = randomEmoji;
      particle.classList.add("emojiRain");

      const size = Math.random() * 20 + 20;
      particle.style.fontSize = `${size}px`;
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.top = "-70px";

      document.body.appendChild(particle);

      gsap.to(particle, {
        y: "110vh",
        x: `+=${Math.random() * 100 - 50}`,
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 4,
        ease: "power1.out",
      });

      total++;
      if (total >= max) {
        clearInterval(dropWave);
        break;
      }
    }
  }, interval);
}

export function showLoseMessage() {
  const message = document.createElement("div");
  message.classList.add("loseMessage");
  message.textContent = "You Lose 😢  Try Again !";

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart";
  restartBtn.classList.add("restartBtn");

  restartBtn.addEventListener("click", () => location.reload());

  message.appendChild(restartBtn);
  document.body.appendChild(message);

  gsap.fromTo(
    message,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1.2, duration: 2, ease: "elastic.out(1, 0.5)" }
  );
  emojiRain(false);
}

export function startFloatingBackground() {
  for (let i = 0; i < 20; i++) {
    const emoji = document.createElement("div");

    emoji.classList.add("backgroundEmoji");
    emoji.textContent = emojiPool[Math.floor(Math.random() * emojiPool.length)];

    // Random position
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.top = Math.random() * 100 + "vh";
    emoji.style.fontSize = Math.random() * 30 + 30 + "px";

    document.body.appendChild(emoji);

    // Floating animation loop
    floatEmoji(emoji);
  }
}

function floatEmoji(emoji) {
  const duration = 5 + Math.random() * 5;
  const deltaY = 20 + Math.random() * 30;

  gsap.to(emoji, {
    y: `-=${deltaY}`,
    duration: duration,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}

//Text animation

export function textAnimation(text) {
  SplitText.create(text, {
    type: "chars",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.chars, {
        delay: 0.7,
        duration: 1,
        y: -50,
        autoAlpha: 0,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
  });
}

export function colorTextAnimation(text) {
  const split = SplitText.create(text, {
    type: "chars",
    autoSplit: true,
  });

  split.chars.forEach((char, i) => {
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`;
    gsap.fromTo(
      char,
      {
        color: randomColor,
        y: -1,
        stagger: 0.05,
        ease: "power2.out",
        scale: 1.3,
      },
      {
        color: "white",
        duration: 2,
        delay: i * 0.08,
        ease: "power2.out",
        transformOrigin: "center center",
        scale: 1.2,
      }
    );
  });
}

export const refillAnimation = (movedCandies, candies) => {
  animateGridHeader();
  movedCandies.forEach((candy) => {
    const distance = (candy.toRow - candy.fromRow) * 50; // assuming 50px per cell
    gsap.fromTo(
      candy.element,
      { y: -distance },
      { y: 0, duration: 0.7, ease: "power2.out", delay: 0.05 }
    );
  });

  // 🔁 Refill top with new emojis
  for (let i = 0; i < width * width; i++) {
    if (candies[i].textContent === "") {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      candies[i].textContent = randomEmoji;

      // ✅ Animate new emoji drop from above
      const yOffset = -(Math.floor(i / width) + 1);
      gsap.fromTo(
        candies[i],
        { y: yOffset },
        { y: 0, duration: 0.7, ease: "bounce.out", delay: 0.05 }
      );
    }
  }
};

export function animateGridHeader() {
  const gridHeader = document.querySelector(".gridHeader");
  const gridHeaderItems = gridHeader.querySelectorAll(".gridHeaderItem");

  // Reset rotation to 0 before animating, so it can be called multiple times
  gsap.set(gridHeaderItems, { rotation: 0 });

  gsap.to(gridHeaderItems, {
    duration: 2,
    rotation: 360,
    ease: "power2.out",
    // stagger: 0.1, // Add stagger for a more dynamic effect
  });
}
