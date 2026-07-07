/* ============================================
   PHASE 14 — ENDING
   Fires on "phase13:complete". This is the final destination —
   nothing dispatches after it, and the scene runs forever.
   ============================================ */

(function () {
  const phase14El = document.getElementById("phase14");
  const cosmosCanvas = document.getElementById("p14-cosmos-canvas");
  const heartsLayer = document.getElementById("p14-hearts");

  const HEARTS = ["❤️", "💛", "💜"];

  function spawnHeart() {
    const heart = document.createElement("span");
    heart.className = "p14-heart";
    heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.setProperty("--drift", (Math.random() - 0.5) * 120 + "px");
    heart.style.animationDuration = 9 + Math.random() * 6 + "s";
    heartsLayer.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }

  document.addEventListener("phase13:complete", () => {
    phase14El.classList.add("is-active");

    Cosmos.init(cosmosCanvas, 140);
    Cosmos.setMode("idle");
    Cosmos.start();

    // Gentle, endless drift of hearts — this screen is the forever-ending.
    setInterval(spawnHeart, 900);
    for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 400);
  });
})();
