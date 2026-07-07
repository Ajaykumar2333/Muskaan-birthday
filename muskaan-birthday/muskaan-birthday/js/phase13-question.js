/* ============================================
   PHASE 13 — FINAL QUESTION
   Fires on "phase12:complete". Ends by dispatching "phase13:complete".
   ============================================ */

(function () {
  const phase13El = document.getElementById("phase13");
  const field = document.getElementById("p13-button-field");
  const yesBtn = document.getElementById("p13-yes-btn");
  const noBtn = document.getElementById("p13-no-btn");
  const reaction = document.getElementById("p13-reaction");

  function dodgeNo() {
    const fieldRect = field.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = Math.max(0, fieldRect.width - btnRect.width);
    const maxY = Math.max(0, fieldRect.height - btnRect.height);

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
    noBtn.style.transform = "translate(0, 0)";
  }

  // Desktop: dodge the moment the cursor gets close.
  noBtn.addEventListener("mouseenter", dodgeNo);
  // Touch: dodge on first touch instead of registering a tap.
  noBtn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      dodgeNo();
    },
    { passive: false }
  );
  // Fallback so it can never actually be "clicked" through.
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dodgeNo();
  });

  function celebrateYes() {
    const burst = () =>
      confetti({
        particleCount: 160,
        spread: 130,
        startVelocity: 50,
        origin: { y: 0.55 },
        colors: ["#9d7ce8", "#f0a8c9", "#d9b45f", "#ffffff"],
        zIndex: 30,
      });

    burst();
    setTimeout(burst, 300);
    setTimeout(burst, 600);
  }

  yesBtn.addEventListener("click", () => {
    celebrateYes();
    reaction.classList.add("is-visible");
    yesBtn.disabled = true;
    noBtn.style.pointerEvents = "none";

    setTimeout(() => {
      phase13El.classList.add("is-leaving");
      phase13El.addEventListener(
        "animationend",
        () => {
          phase13El.classList.remove("is-active", "is-leaving");
          // The final Ending screen hooks in here.
          document.dispatchEvent(new CustomEvent("phase13:complete"));
        },
        { once: true }
      );
    }, 2200);
  });

  document.addEventListener("phase12:complete", () => {
    phase13El.classList.add("is-active");
  });
})();
