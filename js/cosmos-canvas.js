/* ============================================
   COSMOS CANVAS
   One particle engine, four moods:
   idle stars -> dense starry night -> heart formation -> stardust explosion
   ============================================ */

window.Cosmos = (function () {
  let canvas, ctx, width, height, dpr;
  let particles = [];
  let mode = "idle"; // idle | dense | heart | explode
  let rafId = null;
  let heartPulseT = 0;

  const COLORS = [
    "rgba(255,255,255,0.9)",
    "rgba(217,180,95,0.9)", // gold
    "rgba(157,124,232,0.85)", // purple
    "rgba(240,168,201,0.8)", // pink
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (mode === "heart") assignHeartTargets();
  }

  function makeParticle(dense) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * (dense ? 1.4 : 1.1) + 0.4,
      baseAlpha: Math.random() * 0.6 + 0.3,
      alpha: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      // heart formation
      tx: 0,
      ty: 0,
      arrived: false,
      // explosion
      vx: 0,
      vy: 0,
    };
  }

  function init(canvasEl, count) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    resize();
    particles = Array.from({ length: count || 120 }, () => makeParticle(false));
    window.addEventListener("resize", resize);
  }

  /** Compute N points along a parametric heart curve, scaled to viewport */
  function heartPoint(t, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    return {
      x: width / 2 + x * scale,
      y: height / 2 - y * scale + height * 0.02,
    };
  }

  function assignHeartTargets() {
    const scale = Math.min(width, height) / 34;
    particles.forEach((p, i) => {
      const t = (i / particles.length) * Math.PI * 2;
      // small random jitter so the heart looks hand-scattered, not robotic
      const jitterT = t + (Math.random() - 0.5) * 0.02;
      const pt = heartPoint(jitterT, scale * (0.9 + Math.random() * 0.15));
      p.tx = pt.x;
      p.ty = pt.y;
      p.arrived = false;
    });
  }

  function setMode(next, opts) {
    opts = opts || {};
    mode = next;

    if (next === "dense" && opts.upscale) {
      const target = opts.count || 220;
      while (particles.length < target) particles.push(makeParticle(true));
    }

    if (next === "heart") {
      assignHeartTargets();
    }

    if (next === "explode") {
      particles.forEach((p) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2 + 0.6;
        p.vx = Math.cos(angle) * speed * 0.3;
        p.vy = -Math.abs(Math.sin(angle) * speed) - 0.6; // drift upward like stardust
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    if (mode === "heart") {
      heartPulseT += 0.03;
    }

    particles.forEach((p) => {
      p.twinkle += p.twinkleSpeed;
      const flicker = 0.6 + Math.sin(p.twinkle) * 0.4;

      if (mode === "idle" || mode === "dense") {
        p.alpha += (p.baseAlpha - p.alpha) * 0.02;
        p.y -= 0.05;
        if (p.y < -5) p.y = height + 5;
      } else if (mode === "heart") {
        p.x += (p.tx - p.x) * 0.045;
        p.y += (p.ty - p.y) * 0.045;
        const dist = Math.hypot(p.tx - p.x, p.ty - p.y);
        if (dist < 1.2) p.arrived = true;
        p.alpha += (0.95 - p.alpha) * 0.03;
      } else if (mode === "explode") {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += -0.01; // keep accelerating gently upward, dreamlike
        p.alpha *= 0.985;
      }

      const pulse =
        mode === "heart" && p.arrived ? 1 + Math.sin(heartPulseT) * 0.25 : 1;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(p.alpha * flicker, 0);
      ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  return { init, setMode, start, stop };
})();
