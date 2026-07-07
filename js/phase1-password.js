/* ============================================
   PHASE 1 — ENTRY SCREEN LOGIC
   ============================================ */

(function () {
  const CORRECT_VALUE = "all";

  const options = document.querySelectorAll(".entry-option");
  const feedback = document.getElementById("entry-feedback");
  const unlockBtn = document.getElementById("unlock-btn");
  const phase1El = document.getElementById("phase1");

  let unlocked = false;

  function clearOptionStates() {
    options.forEach((btn) => {
      btn.classList.remove("is-wrong", "is-correct");
    });
  }

  function handleAnswer(btn) {
    if (unlocked) return;

    const isCorrect = btn.dataset.answer === CORRECT_VALUE;
    clearOptionStates();

    feedback.classList.remove("is-visible", "is-correct");
    // force reflow so the fade-in transition retriggers on repeat wrong guesses
    void feedback.offsetWidth;

    if (isCorrect) {
      btn.classList.add("is-correct");
      feedback.textContent = "Correct ❤️ How could I ever choose just one?";
      feedback.classList.add("is-visible", "is-correct");
      unlocked = true;

      options.forEach((b) => {
        if (b !== btn) b.style.opacity = "0.4";
        b.disabled = true;
      });

      unlockBtn.classList.add("is-visible");
    } else {
      btn.classList.add("is-wrong");
      feedback.textContent =
        "That's a good guess... but I could never choose just one ❤️";
      feedback.classList.add("is-visible");
    }
  }

  options.forEach((btn) => {
    btn.addEventListener("click", () => handleAnswer(btn));
  });

  unlockBtn.addEventListener("click", () => {
    // Cinematic exit — Phase 2 (cinematic intro) hooks in here.
    phase1El.classList.add("is-leaving");

    phase1El.addEventListener(
      "animationend",
      () => {
        phase1El.style.display = "none";
        // TODO(Phase 2): reveal #phase2 cinematic intro sequence here.
        document.dispatchEvent(new CustomEvent("phase1:complete"));
      },
      { once: true }
    );
  });
})();
