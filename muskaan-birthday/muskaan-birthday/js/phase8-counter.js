/* ============================================
   PHASE 8 — LIVE LOVE COUNTER
   Fires on "phase7:complete". Ends by dispatching "phase8:complete".
   ============================================ */

(function () {
  const phase8El = document.getElementById("phase8");
  const continueBtn = document.getElementById("p8-continue-btn");

  const daysEl = document.getElementById("p8-days");
  const hoursEl = document.getElementById("p8-hours");
  const minsEl = document.getElementById("p8-minutes");
  const secsEl = document.getElementById("p8-seconds");

  // Easy to edit — the day "us" officially began.
  const START_DATE = new Date("2025-04-01T00:00:00");

  let tickInterval = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    let diff = Math.max(0, now - START_DATE);

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(minutes);
    secsEl.textContent = pad(seconds);
  }

  continueBtn.addEventListener("click", () => {
    phase8El.classList.add("is-leaving");
    phase8El.addEventListener(
      "animationend",
      () => {
        phase8El.classList.remove("is-active", "is-leaving");
        clearInterval(tickInterval);
        // Phase 9 (How Much I Love You) hooks in here.
        document.dispatchEvent(new CustomEvent("phase8:complete"));
      },
      { once: true }
    );
  });

  document.addEventListener("phase7:complete", () => {
    phase8El.classList.add("is-active");
    tick();
    tickInterval = setInterval(tick, 1000);
  });
})();
