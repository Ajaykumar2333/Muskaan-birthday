/* ============================================
   PHASE 11 — FINALE
   Fires on "phase10:complete". Ends by dispatching "phase11:complete".
   ============================================ */

(function () {
  const phase11El = document.getElementById("phase11");
  const cosmosCanvas = document.getElementById("p11-cosmos-canvas");
  const heartsLayer = document.getElementById("p11-hearts");
  const continueBtn = document.getElementById("p11-continue-btn");

  const eyebrow = document.getElementById("p11-eyebrow");
  const title = document.getElementById("p11-title");
  const subtitle = document.getElementById("p11-subtitle");

  const HEART_EMOJIS = ["❤️", "💛", "💜", "💗"];
  let heartInterval = null;

  function spawnHeart() {
    const heart = document.createElement("span");
    heart.className = "p11-heart";
    heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.setProperty("--drift", (Math.random() - 0.5) * 160 + "px");
    heart.style.animationDuration = 6 + Math.random() * 4 + "s";
    heart.style.fontSize = 1 + Math.random() * 1.4 + "rem";
    heartsLayer.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }

  function fireworksBurst() {
    confetti({
      particleCount: 90,
      startVelocity: 40,
      spread: 360,
      ticks: 100,
      origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.4 + 0.1 },
      colors: ["#9d7ce8", "#f0a8c9", "#d9b45f", "#ffffff"],
      scalar: 1,
      zIndex: 25,
    });
  }

  function runFinale() {
    Cosmos.init(cosmosCanvas, 90);
    Cosmos.setMode("idle");
    Cosmos.start();

    heartInterval = setInterval(spawnHeart, 260);
    for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 120);

    const fwInterval = setInterval(fireworksBurst, 400);
    setTimeout(() => clearInterval(fwInterval), 4000);

    confetti({
      particleCount: 200,
      spread: 140,
      startVelocity: 55,
      origin: { y: 0.5 },
      colors: ["#9d7ce8", "#f0a8c9", "#d9b45f", "#ffffff"],
      zIndex: 25,
    });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(eyebrow, { opacity: 1, duration: 0.8 })
      .to(title, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.4")
      .to(subtitle, { opacity: 1, duration: 0.8 }, "-=0.3")
      .to(continueBtn, { opacity: 1, duration: 0.8 }, "-=0.2");
  }

  continueBtn.addEventListener("click", () => {
    phase11El.classList.add("is-leaving");
    phase11El.addEventListener(
      "animationend",
      () => {
        phase11El.classList.remove("is-active", "is-leaving");
        clearInterval(heartInterval);
        Cosmos.stop();
        // Final Letter hooks in here.
        document.dispatchEvent(new CustomEvent("phase11:complete"));
      },
      { once: true }
    );
  });

  document.addEventListener("phase10:complete", () => {
    phase11El.classList.add("is-active");
    runFinale();
  });
})();
