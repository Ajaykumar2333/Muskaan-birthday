/* ============================================
   PHASE 3 — SPIN THE WHEEL (v2, premium redesign)
   Fires on "phase2:complete". Ends by dispatching "phase3:complete".
   ============================================ */

(function () {
  const phase3El = document.getElementById("phase3");
  const wheelDisc = document.getElementById("p3-wheel-disc");
  const wheelGroup = document.getElementById("p3-wheel-group");
  const labelsLayer = document.getElementById("p3-labels");
  const hub = document.getElementById("p3-hub");
  const cosmosCanvas = document.getElementById("p3-cosmos-canvas");

  const resultOverlay = document.getElementById("p3-result-overlay");
  const resultBody = document.getElementById("p3-result-body");
  const resultEmoji = document.getElementById("p3-result-emoji");
  const resultTitle = document.getElementById("p3-result-title");
  const resultDesc = document.getElementById("p3-result-desc");
  const claimBtn = document.getElementById("p3-claim-btn");
  const claimedBlock = document.getElementById("p3-claimed-block");
  const continueBtn = document.getElementById("p3-continue-btn");

  // Easy to edit — each reward has a short wheel label plus its own
  // popup title + heartfelt description.
  const REWARDS = [
    {
      icon: "💋",
      label: "20 Kisses",
      title: "20 Sweet Kisses",
      desc: "Redeemable anytime, anywhere — 20 sweet kisses are yours ❤️",
    },
    {
      icon: "🤗",
      label: "50 Hugs",
      title: "50 Cozy Hugs",
      desc: "50 warm hugs, waiting for whenever you need one ❤️",
    },
    {
      icon: "🧸",
      label: "Teddy",
      title: "A Cuddly Teddy",
      desc: "A soft teddy bear is on its way to keep you company ❤️",
    },
    {
      icon: "🎉",
      label: "Surprise",
      title: "Birthday Surprise Party",
      desc: "Get ready — a little birthday surprise is coming your way ❤️",
    },
    {
      icon: "🍫",
      label: "Chocolate",
      title: "Your Favorite Chocolates",
      desc: "Your favorite chocolates are already on their way ❤️",
    },
    {
      icon: "💐",
      label: "Bouquet",
      title: "Luxury Flower Bouquet",
      desc: "A beautiful bouquet, as lovely as you are ❤️",
    },
    {
      icon: "🌹",
      label: "A Rose",
      title: "A Rose Just For You",
      desc: "One rose, picked especially for the birthday girl ❤️",
    },
    {
      icon: "👑",
      label: "Princess",
      title: "Princess Privilege",
      desc: "Today is your special day. You get one special wish — Ajay Kumar will do his best to make it come true ❤️",
    },
    {
      icon: "🌸",
      label: "Perfume",
      title: "Your Favorite Perfume",
      desc: "Your favorite perfume is waiting for you ❤️",
    },
    {
      icon: "💄",
      label: "Lipstick",
      title: "Lipstick Of Your Choice",
      desc: "Pick any lipstick you love — it's already yours ❤️",
    },
  ];

  const SEGMENT_ANGLE = 360 / REWARDS.length;
  const NAVY_FILLS = ["url(#p3NavyA)", "url(#p3NavyB)"];

  let currentRotation = 0;
  let spinning = false;
  let idleTween = null;
  let labelPositionsBase = [];
  let liveLoopId = null;

  function polar(cx, cy, r, deg) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  /* ---------------------------------------------
     Build the wedges (SVG) + gold ring
  --------------------------------------------- */
  function buildWedges() {
    const svgNS = "http://www.w3.org/2000/svg";
    const CX = 300, CY = 300, R = 296;

    REWARDS.forEach((_, i) => {
      const start = i * SEGMENT_ANGLE;
      const end = start + SEGMENT_ANGLE;
      const p1 = polar(CX, CY, R, start);
      const p2 = polar(CX, CY, R, end);

      const path = document.createElementNS(svgNS, "path");
      const d = `M ${CX} ${CY} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${R} ${R} 0 0 1 ${p2.x.toFixed(
        2
      )} ${p2.y.toFixed(2)} Z`;
      path.setAttribute("d", d);
      path.setAttribute("fill", NAVY_FILLS[i % NAVY_FILLS.length]);
      path.setAttribute("stroke", "rgba(217,180,95,0.55)");
      path.setAttribute("stroke-width", "2");
      wheelGroup.appendChild(path);
    });

    // Outer gold ring for a finished, jewelled edge
    const ring = document.createElementNS(svgNS, "circle");
    ring.setAttribute("cx", CX);
    ring.setAttribute("cy", CY);
    ring.setAttribute("r", R - 2);
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", "url(#p3GoldRing)");
    ring.setAttribute("stroke-width", "5");
    wheelGroup.appendChild(ring);
  }

  /* ---------------------------------------------
     Build the labels (HTML, positioned every frame)
  --------------------------------------------- */
  function buildLabels() {
    REWARDS.forEach((reward, i) => {
      const baseAngle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      labelPositionsBase.push(baseAngle);

      const el = document.createElement("div");
      el.className = "p3-label";
      el.innerHTML = `
        <span class="p3-label-emoji">${reward.icon}</span>
        <span class="p3-label-text">${reward.label}</span>
      `;
      labelsLayer.appendChild(el);
    });
  }

  /** Reads the disc's live rotation and repositions every label so the
      emoji/label orbit with the wheel while the text itself stays flat. */
  function updateLabelPositions() {
    const rotation = gsap.getProperty(wheelDisc, "rotation") || 0;
    const labelEls = labelsLayer.children;
    const radiusPercent = 35; // distance from center, as % of wrap size

    for (let i = 0; i < labelEls.length; i++) {
      const angle = labelPositionsBase[i] + rotation;
      const rad = ((angle - 90) * Math.PI) / 180;
      const x = 50 + radiusPercent * Math.cos(rad);
      const y = 50 + radiusPercent * Math.sin(rad);
      labelEls[i].style.left = x + "%";
      labelEls[i].style.top = y + "%";
    }

    liveLoopId = requestAnimationFrame(updateLabelPositions);
  }

  /* ---------------------------------------------
     Idle motion: wheel drifts gently left/right
  --------------------------------------------- */
  function startIdle() {
    idleTween = gsap.to(wheelDisc, {
      rotation: "+=4",
      duration: 3.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  function stopIdle() {
    if (idleTween) {
      idleTween.kill();
      idleTween = null;
    }
  }

  /* ---------------------------------------------
     Spin
  --------------------------------------------- */
  function spin() {
    if (spinning) return;
    spinning = true;
    hub.classList.add("is-disabled");
    stopIdle();

    const liveRotation = gsap.getProperty(wheelDisc, "rotation") || 0;
    const winnerIndex = Math.floor(Math.random() * REWARDS.length);
    const segmentCenter = winnerIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const fullSpins = 6 + Math.floor(Math.random() * 3); // 6-8 rotations

    const jitter = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.5);
    const delta =
      fullSpins * 360 +
      (((360 - segmentCenter + jitter - (liveRotation % 360)) % 360) + 360) % 360;

    currentRotation = liveRotation + delta;

    gsap.to(wheelDisc, {
      rotation: currentRotation,
      duration: 5.2,
      ease: "power4.out",
      onComplete: () => {
        spinning = false;
        revealResult(REWARDS[winnerIndex]);
      },
    });
  }

  /* ---------------------------------------------
     Result popup + claim flow
  --------------------------------------------- */
  function revealResult(reward) {
    resultEmoji.textContent = reward.icon;
    resultTitle.textContent = reward.title;
    resultDesc.textContent = reward.desc;

    resultBody.classList.remove("is-hidden");
    claimedBlock.classList.remove("is-visible");
    resultOverlay.classList.add("is-visible");
  }

  claimBtn.addEventListener("click", () => {
    confetti({
      particleCount: 130,
      spread: 90,
      startVelocity: 42,
      origin: { y: 0.55 },
      colors: ["#9d7ce8", "#f0a8c9", "#d9b45f", "#ffffff"],
      zIndex: 40,
    });

    resultBody.classList.add("is-hidden");
    claimedBlock.classList.add("is-visible");
  });

  continueBtn.addEventListener("click", () => {
    resultOverlay.classList.remove("is-visible");

    phase3El.classList.add("is-leaving");
    phase3El.addEventListener(
      "animationend",
      () => {
        phase3El.classList.remove("is-active", "is-leaving");
        if (liveLoopId) cancelAnimationFrame(liveLoopId);
        Cosmos.stop();
        // Phase 4 (Birthday Cake) hooks in here.
        document.dispatchEvent(new CustomEvent("phase3:complete"));
      },
      { once: true }
    );
  });

  hub.addEventListener("click", spin);

  document.addEventListener("phase2:complete", () => {
    phase3El.classList.add("is-active");
    Cosmos.init(cosmosCanvas, 60);
    Cosmos.setMode("idle");
    Cosmos.start();
    startIdle();
  });

  buildWedges();
  buildLabels();
  updateLabelPositions();
})();
