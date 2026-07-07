/* ============================================
   BACKGROUND MUSIC
   Starts the moment Phase 2 begins (the "Unlock Website" click is the
   user gesture browsers require before audio can play) and loops
   quietly for the rest of the journey.
   Swap assets/audio/background-music.mp3 with your own track.
   ============================================ */

window.SiteAudio = (function () {
  const audio = document.getElementById("bg-music");
  let started = false;

  function start() {
    if (started || !audio) return;
    started = true;
    audio.volume = 0.4;
    audio.play().catch(() => {
      /* If the browser still blocks it, it'll simply stay silent —
         nothing else on the site depends on this succeeding. */
    });
  }

  // Pausing an HTML5 <audio> element keeps its currentTime, so calling
  // resume() later naturally continues from exactly where it stopped.
  function pause() {
    if (audio && !audio.paused) audio.pause();
  }

  function resume() {
    if (!started || !audio) return;
    audio.play().catch(() => {});
  }

  document.addEventListener("phase2:music-start", start);

  return { start, pause, resume };
})();
