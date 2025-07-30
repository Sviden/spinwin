import { emojiPool } from "./constants.js";

export function explodeEmojiAt(element, emoji) {
  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div");
    particle.textContent = emoji;
    particle.classList.add("particle");

    document.body.appendChild(particle);

    // Set position absolute based on the original element
    particle.style.position = "absolute";
    particle.style.left = rect.left + rect.width / 2 + "px";
    particle.style.top = rect.top + rect.height / 2 + "px";
    particle.style.pointerEvents = "none";

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 20;

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
    duration: 4,
    ease: "power2.inOut",
    onComplete: () => {
      alert.remove();
      if (onComplete) onComplete();
    },
  });

  gsap.fromTo(
    alert,
    { y: -100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 3,
      ease: "power3.out",
      onComplete: () => {
        alert.remove();
        if (onComplete) onComplete();
      },
    }
  );
}

export function reshuffleCandiesWithAnimation(candies, emojis, onComplete) {
  const tl = gsap.timeline();

  // Step 1: Animate all candies scaling down and rotating
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

  // Step 2: Shuffle the candies while they're small (invisible moment)
  tl.call(() => {
    const newEmojis = [];

    // Gather current emojis
    for (let i = 0; i < candies.length; i++) {
      if (candies[i].textContent !== "") {
        newEmojis.push(candies[i].textContent);
      }
    }

    // Shuffle using Fisher-Yates algorithm
    for (let i = newEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newEmojis[i], newEmojis[j]] = [newEmojis[j], newEmojis[i]];
    }

    // Reassign shuffled emojis
    for (let i = 0; i < candies.length; i++) {
      candies[i].textContent = newEmojis[i] || "";
    }
  });

  // Step 3: Animate candies scaling back up with a bounce effect
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

  // Step 4: Add a subtle "settling" animation
  tl.to(candies, {
    scale: 1.05,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  });

  // Step 5: Call the completion callback
  tl.call(() => {
    if (onComplete) onComplete();
  });

  return tl;
}

const split = new SplitText("#title", { type: "chars" });

// Animate the characters in typewriter style
gsap.from(split.chars, {
  duration: 0.5,
  opacity: 0,
  y: 10,
  stagger: 0.05,
  ease: "power2.out",
});

export function showWinMessage() {
  const message = document.createElement("div");
  message.classList.add("winMessage");

  const text = document.createElement("div");
  text.textContent = "🎉 Congratulations! 🎉";

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart";
  restartBtn.classList.add("restartBtn");

  restartBtn.addEventListener("click", () => {
    location.reload();
  });

  message.appendChild(text);
  message.appendChild(restartBtn);
  document.body.appendChild(message);

  // Animate message
  gsap.fromTo(
    message,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1.5, duration: 3, ease: "sine.in" }
  );

  gsap.fromTo(
    restartBtn,
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 3, ease: "bounce.out", delay: 3 }
  );

  // Emoji rain logic in bursts
  let total = 0;
  const max = 300; // Total emojis to drop
  const batchSize = 10; // Emojis per wave
  const interval = 150; // Time between waves in ms

  const dropWave = setInterval(() => {
    for (let i = 0; i < batchSize; i++) {
      const particle = document.createElement("div");

      const randomEmoji =
        emojiPool[Math.floor(Math.random() * emojiPool.length)];
      particle.textContent = randomEmoji;
      particle.classList.add("emojiRain");

      const size = Math.random() * 20 + 20; // 20–40px
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
        // onComplete: () => particle.remove(),
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
}
