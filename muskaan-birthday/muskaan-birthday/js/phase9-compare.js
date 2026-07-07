/* ============================================
   PHASE 9 — HOW MUCH I LOVE YOU
   Fires on "phase8:complete". Ends by dispatching "phase9:complete".
   ============================================ */

(function () {
  const phase9El = document.getElementById("phase9");
  const bars = document.querySelectorAll(".p9-bar-fill");
  const climax = document.getElementById("p9-climax");
  const continueBtn = document.getElementById("p9-continue-btn");

  function animateBars() {
    bars.forEach((bar, i) => {
      const target = bar.dataset.value;
      const pctEl = bar.parentElement.nextElementSibling;
      gsap.to(bar, {
        width: target + "%",
        duration: 1.4,
        delay: i * 0.25,
        ease: "power2.out",
        onUpdate: function () {
          if (pctEl) {
            const w = gsap.getProperty(bar, "width", "%");
            pctEl.textContent = Math.round(w) + "%";
          }
        },
      });
    });
  }

  function runClimax() {
    const lines = climax.querySelectorAll(".p9-climax-line");
    const tl = gsap.timeline({ delay: bars.length * 0.25 + 1.6 });

    lines.forEach((line, i) => {
      tl.call(() => line.classList.add("is-visible"))
        .to({}, { duration: i === lines.length - 1 ? 2.5 : 0.9 })
        .call(() => line.classList.remove("is-visible"), null, "+=0.05");
    });

    tl.call(() => {
      lines[lines.length - 1].classList.add("is-visible");
      continueBtn.classList.add("is-visible");
    });
  }

  continueBtn.addEventListener("click", () => {
    phase9El.classList.add("is-leaving");
    phase9El.addEventListener(
      "animationend",
      () => {
        phase9El.classList.remove("is-active", "is-leaving");
        // Phase 10 (Love Calculator) hooks in here.
        document.dispatchEvent(new CustomEvent("phase9:complete"));
      },
      { once: true }
    );
  });

  document.addEventListener("phase8:complete", () => {
    phase9El.classList.add("is-active");
    animateBars();
    runClimax();
  });
})();
