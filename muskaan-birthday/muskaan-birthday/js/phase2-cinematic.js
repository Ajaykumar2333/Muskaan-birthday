/* ============================================
   PHASE 2 — CINEMATIC INTRO ORCHESTRATION
   Fires when Phase 1 dispatches "phase1:complete".
   Ends by dispatching "phase2:complete" (Spin The Wheel hooks in there).
   ============================================ */

(function () {
  const phase2El = document.getElementById("phase2");
  const veil = document.getElementById("p2-black-veil");
  const canvasEl = document.getElementById("cosmos-canvas");

  const presents = document.getElementById("p2-presents");
  const storyLines = document.querySelectorAll(".p2-story-line");
  const nameEl = document.getElementById("p2-name");

  const loading = document.getElementById("p2-loading");
  const loadingTitle = document.getElementById("p2-loading-title");
  const loadingMsg = document.getElementById("p2-loading-msg");
  const barFill = document.getElementById("p2-bar-fill");
  const barPct = document.getElementById("p2-loading-pct");

  const heartLine = document.getElementById("p2-heart-line");
  const countdownEl = document.getElementById("p2-countdown");
  const celebration = document.getElementById("p2-celebration");
  const balloonLayer = document.getElementById("p2-balloons");

  const LOADING_MESSAGES = [
    "Collecting Smiles...",
    "Finding Happy Moments...",
    "Loading Laughter...",
    "Counting Beautiful Days...",
    "Preparing Birthday Surprise...",
    "Almost Ready...",
  ];

  const BALLOON_COLORS = [
    "linear-gradient(180deg, #9d7ce8, #4c3480)",
    "linear-gradient(180deg, #f0a8c9, #b45f82)",
    "linear-gradient(180deg, #f2cf82, #d9b45f)",
    "linear-gradient(180deg, #f5f5f7, #a8a8b3)",
  ];

  let cosmosStarted = false;

  function spawnBalloons(count) {
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "p2-balloon";
      b.style.left = Math.random() * 96 + "%";
      b.style.background =
        BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
      balloonLayer.appendChild(b);

      gsap.to(b, {
        y: -(window.innerHeight + 220),
        x: (Math.random() - 0.5) * 120,
        duration: 6 + Math.random() * 3,
        delay: Math.random() * 1.5,
        ease: "power1.out",
        onComplete: () => b.remove(),
      });

      gsap.to(b, {
        rotation: (Math.random() - 0.5) * 20,
        duration: 2 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }

  /** Fireworks built from layered canvas-confetti bursts at random origins */
  function fireworksBurst() {
    const colors = ["#9d7ce8", "#f0a8c9", "#d9b45f", "#ffffff"];
    confetti({
      particleCount: 70,
      startVelocity: 35,
      spread: 360,
      ticks: 90,
      origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.4 + 0.1 },
      colors,
      scalar: 0.9,
      zIndex: 25,
    });
  }

  function runFireworksFor(durationMs) {
    const interval = setInterval(fireworksBurst, 450);
    setTimeout(() => clearInterval(interval), durationMs);
  }

  function buildTimeline() {
    const tl = gsap.timeline();

    // ---- STEP 1: fade current view to black, hold, music begins ----
    tl.set(phase2El, { className: "phase2 is-active" })
      .call(() => {
        document.dispatchEvent(new CustomEvent("phase2:music-start"));
      })
      .to(veil, { opacity: 1, duration: 1.5, ease: "power2.inOut" })
      .to({}, { duration: 1 }); // hold black for 1s

    // ---- STEP 2: stars gently appear as the veil lifts ----
    tl.call(() => {
      if (!cosmosStarted) {
        Cosmos.init(canvasEl, 120);
        Cosmos.setMode("idle");
        Cosmos.start();
        cosmosStarted = true;
      }
    })
      .to(veil, { opacity: 0, duration: 2.5, ease: "sine.inOut" }, "<");

    // ---- STEP 3: AJAY KUMAR PRESENTS ----
    tl.to(presents, { opacity: 1, y: -10, duration: 1.2, ease: "power2.out" })
      .to({}, { duration: 3 })
      .to(presents, { opacity: 0, y: -24, duration: 1, ease: "power2.in" });

    // ---- STEP 4: A Story Made / For One Person ----
    tl.to(storyLines[0], { opacity: 1, y: -10, duration: 1, ease: "power2.out" })
      .to(
        storyLines[1],
        { opacity: 1, y: -10, duration: 1, ease: "power2.out" },
        "-=0.5"
      )
      .to({}, { duration: 2 })
      .to(storyLines, { opacity: 0, y: -20, duration: 0.9, ease: "power2.in" });

    // ---- STEP 5: her name, glowing, with a slow pulse ----
    tl.to(nameEl, { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" })
      .to(nameEl, {
        filter: "drop-shadow(0 0 55px rgba(217,180,95,0.75))",
        duration: 1.6,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      })
      .to({}, { duration: 1 })
      .to(nameEl, { opacity: 0, scale: 1.04, duration: 1, ease: "power2.in" });

    // ---- STEP 6: cinematic loading sequence ----
    tl.set(loadingTitle, { textContent: "Access Granted..." })
      .to(loading, { opacity: 1, duration: 0.8 })
      .to({}, { duration: 1 })
      .to(loadingTitle, { opacity: 0, duration: 0.4 })
      .set(loadingTitle, { textContent: "Loading Beautiful Memories..." })
      .to(loadingTitle, { opacity: 1, duration: 0.4 })
      .call(() => runLoadingBar(tl));

    // runLoadingBar appends its own tweens synchronously below via a label
    tl.addLabel("loadingDone")
      .to({}, { duration: 6.2 }) // matches runLoadingBar's total duration
      .call(() => {
        loadingTitle.textContent = "Ready ❤️";
        gsap.fromTo(
          loadingTitle,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 }
        );
      })
      .to({}, { duration: 1 })
      .to(loading, { opacity: 0, duration: 0.8 });

    // ---- STEP 7: loading dissolves into a dense starry night ----
    tl.call(() => Cosmos.setMode("dense", { upscale: true, count: 240 }))
      .to({}, { duration: 2.5 });

    // ---- STEP 8: stars form a glowing heart, then pulse ----
    tl.call(() => Cosmos.setMode("heart"))
      .to({}, { duration: 4.5 }); // formation + a couple of pulses

    // ---- STEP 9: heartfelt line beneath the heart ----
    tl.to(heartLine, { opacity: 1, duration: 1.2, ease: "power2.out" })
      .to({}, { duration: 4 })
      .to(heartLine, { opacity: 0, duration: 1, ease: "power2.in" });

    // ---- STEP 10: heart breaks into stardust, floats up, brightens ----
    tl.call(() => Cosmos.setMode("explode"))
      .to(canvasEl, { filter: "brightness(1.35)", duration: 2, ease: "sine.out" })
      .to({}, { duration: 1.5 });

    // ---- STEP 11: countdown 3, 2, 1 ----
    [3, 2, 1].forEach((n) => {
      tl.call(() => {
        countdownEl.textContent = n;
      })
        .fromTo(
          countdownEl,
          { opacity: 0, scale: 0.6, filter: "drop-shadow(0 0 0 rgba(240,168,201,0))" },
          {
            opacity: 1,
            scale: 1,
            filter: "drop-shadow(0 0 50px rgba(240,168,201,0.8))",
            duration: 0.45,
            ease: "back.out(2)",
          }
        )
        .to(countdownEl, { opacity: 0, scale: 1.15, duration: 0.35, ease: "power2.in" }, "+=0.35");
    });

    // ---- STEP 12: explode into celebration ----
    tl.call(() => {
      confetti({
        particleCount: 220,
        spread: 130,
        startVelocity: 55,
        origin: { y: 0.5 },
        colors: ["#9d7ce8", "#f0a8c9", "#d9b45f", "#ffffff"],
        zIndex: 25,
      });
      spawnBalloons(14);
      runFireworksFor(5000);
    })
      .to(celebration, { opacity: 1, duration: 0.2 })
      .fromTo(
        celebration.querySelector(".p2-emoji"),
        { scale: 0, rotation: -15 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.5)" }
      )
      .fromTo(
        celebration.querySelector(".p2-happy-birthday"),
        { opacity: 0, y: 20, letterSpacing: "0.3em" },
        { opacity: 1, y: 0, letterSpacing: "0.04em", duration: 0.9, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        celebration.querySelector(".p2-muskaan-name"),
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)" },
        "-=0.5"
      );

    // ---- STEP 13: hold, then transition to Spin The Wheel ----
    tl.to({}, { duration: 5 })
      .to([celebration, canvasEl], { opacity: 0, duration: 1.2, ease: "power2.in" })
      .to(veil, { opacity: 1, duration: 1.2, ease: "power2.inOut" }, "<")
      .call(() => {
        Cosmos.stop();
        phase2El.classList.remove("is-active");
        // Phase 3 (Spin The Wheel) hooks in here.
        document.dispatchEvent(new CustomEvent("phase2:complete"));
      });

    return tl;
  }

  /** Animated loading bar + cycling status messages, ~6.2s total */
  function runLoadingBar() {
    const messageDuration = 6200 / LOADING_MESSAGES.length;

    gsap.to(barFill, {
      width: "100%",
      duration: 6.2,
      ease: "power1.inOut",
      onUpdate: function () {
        const pct = Math.round(gsap.getProperty(barFill, "width", "%"));
        barPct.textContent = pct + "%";
      },
    });

    LOADING_MESSAGES.forEach((msg, i) => {
      gsap.delayedCall((i * messageDuration) / 1000, () => {
        gsap.fromTo(
          loadingMsg,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            onStart: () => (loadingMsg.textContent = msg),
          }
        );
      });
    });
  }

  document.addEventListener("phase1:complete", () => {
    buildTimeline();
  });
})();
