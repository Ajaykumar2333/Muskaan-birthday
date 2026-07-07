/* ============================================
   AMBIENT PARTICLES
   Slow-drifting embers (gold / purple / pink).
   Reused across every phase as the site's ambient atmosphere.
   Respects prefers-reduced-motion.
   ============================================ */

(function () {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const COLORS = [
    "rgba(217, 180, 95, 0.8)", // gold
    "rgba(157, 124, 232, 0.7)", // purple
    "rgba(240, 168, 201, 0.6)", // pink
  ];

  let particles = [];
  let width, height, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    const count = width < 640 ? 26 : 48;
    particles = Array.from({ length: count }, () => spawnParticle(true));
  }

  function spawnParticle(randomY) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 20,
      r: Math.random() * 1.6 + 0.6,
      speed: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
    };
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.y -= p.speed;
      p.x += p.drift;
      p.twinkle += 0.02;

      const flicker = 0.6 + Math.sin(p.twinkle) * 0.4;

      if (p.y < -20) {
        Object.assign(p, spawnParticle(false));
      }

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * flicker;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  resize();
  createParticles();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  // Static single frame for reduced-motion users, otherwise animate forever
  if (prefersReducedMotion) {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else {
    requestAnimationFrame(tick);
  }
})();
