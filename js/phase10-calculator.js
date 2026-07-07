/* ============================================
   PHASE 10 — LOVE CALCULATOR
   Fires on "phase9:complete". Ends by dispatching "phase10:complete".
   ============================================ */

(function () {
  const phase10El = document.getElementById("phase10");
  const calcBtn = document.getElementById("p10-calc-btn");
  const loading = document.getElementById("p10-loading");
  const loadingText = document.getElementById("p10-loading-text");
  const result = document.getElementById("p10-result");
  const continueBtn = document.getElementById("p10-continue-btn");

  const LOADING_STEPS = [
    "Reading heartbeats...",
    "Comparing smiles...",
    "Measuring devotion...",
    "Numbers not big enough...",
  ];

  function runCalculation() {
    calcBtn.disabled = true;
    loading.classList.add("is-visible");
    result.classList.remove("is-visible");

    let i = 0;
    loadingText.textContent = LOADING_STEPS[0];
    const stepInterval = setInterval(() => {
      i = (i + 1) % LOADING_STEPS.length;
      loadingText.textContent = LOADING_STEPS[i];
    }, 500);

    setTimeout(() => {
      clearInterval(stepInterval);
      loading.classList.remove("is-visible");
      result.classList.add("is-visible");
      confetti({
        particleCount: 150,
        spread: 110,
        startVelocity: 45,
        origin: { y: 0.5 },
        colors: ["#9d7ce8", "#f0a8c9", "#d9b45f", "#ffffff"],
        zIndex: 30,
      });
    }, 2200);
  }

  calcBtn.addEventListener("click", runCalculation);

  continueBtn.addEventListener("click", () => {
    phase10El.classList.add("is-leaving");
    phase10El.addEventListener(
      "animationend",
      () => {
        phase10El.classList.remove("is-active", "is-leaving");
        // Finale hooks in here next.
        document.dispatchEvent(new CustomEvent("phase10:complete"));
      },
      { once: true }
    );
  });

  document.addEventListener("phase9:complete", () => {
    phase10El.classList.add("is-active");
  });
})();
