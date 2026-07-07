/* ============================================
   PHASE 4 — BIRTHDAY CAKE
   Fires on "phase3:complete". Ends by dispatching "phase4:complete".
   ============================================ */

(function () {
  const phase4El = document.getElementById("phase4");
  const candles = document.querySelectorAll(".candle");
  const progressEl = document.getElementById("p4-progress");
  const celebrate = document.getElementById("p4-celebrate");
  const continueBtn = document.getElementById("p4-continue-btn");
  const audio = document.getElementById("p4-audio");

  let litCount = candles.length;

  function updateProgress() {
    if (!progressEl) return;
    const blown = candles.length - litCount;
    progressEl.textContent =
      litCount === 0
        ? "All candles out ✨"
        : `${blown} of ${candles.length} candles out`;
  }

  function blowOut(candle) {
    if (candle.classList.contains("is-out")) return;

    candle.classList.add("is-out");
    litCount -= 1;
    updateProgress();

    // Little puff of smoke where the flame was
    const puff = document.createElement("span");
    puff.className = "smoke-puff";
    candle.appendChild(puff);
    puff.addEventListener("animationend", () => puff.remove());

    if (litCount === 0) {
      setTimeout(triggerCelebration, 700);
    }
  }

  function triggerCelebration() {
    // Music — swap assets/audio/happy-birthday.mp3 with your own track.
    audio.currentTime = 0;
    audio.play().catch(() => {
      /* Autoplay may be blocked until a user gesture; the candle
         click that got us here counts as one, but we stay silent
         gracefully if the browser still declines. */
    });

    const burst = () =>
      confetti({
        particleCount: 120,
        spread: 100,
        startVelocity: 40,
        origin: { y: 0.6 },
        colors: ["#9d7ce8", "#f0a8c9", "#d9b45f", "#ffffff"],
        zIndex: 35,
      });

    burst();
    setTimeout(burst, 350);
    setTimeout(burst, 700);

    celebrate.classList.add("is-visible");
  }

  candles.forEach((candle, i) => {
    candle.style.setProperty("--i", i);
    candle.addEventListener("click", () => blowOut(candle));
  });

  continueBtn.addEventListener("click", () => {
    phase4El.classList.add("is-leaving");
    phase4El.addEventListener(
      "animationend",
      () => {
        phase4El.classList.remove("is-active", "is-leaving");
        celebrate.classList.remove("is-visible");
        audio.pause();
        // Phase 5 (Interactive Flip Book) hooks in here.
        document.dispatchEvent(new CustomEvent("phase4:complete"));
      },
      { once: true }
    );
  });

  document.addEventListener("phase3:complete", () => {
    phase4El.classList.add("is-active");
  });

  updateProgress();
})();
