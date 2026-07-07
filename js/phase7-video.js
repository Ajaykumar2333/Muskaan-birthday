/* ============================================
   PHASE 7 — VIDEO MESSAGE (Google Drive embed)
   Fires on "phase6:complete". Ends by dispatching "phase7:complete".

   Drive's embedded player is a cross-origin iframe, so we can't detect
   play/pause/end from it directly. Instead:
   - The moment she first interacts with the video, we duck the
     background music (a transparent overlay catches that first click,
     then gets out of the way so every native control still works).
   - Background music resumes — right where it paused — when she taps
     Continue, which is also given a strong pulsing hint since it's
     easy to miss.
   ============================================ */

(function () {
  const phase7El = document.getElementById("phase7");
  const clickCatcher = document.getElementById("p7-click-catcher");
  const continueBtn = document.getElementById("p7-continue-btn");

  let advanced = false;

  function duckMusicOnce() {
    if (window.SiteAudio) window.SiteAudio.pause();
    clickCatcher.classList.add("is-gone");
  }

  clickCatcher.addEventListener("click", duckMusicOnce, { once: true });

  function goNext() {
    if (advanced) return;
    advanced = true;

    if (window.SiteAudio) window.SiteAudio.resume();

    phase7El.classList.add("is-leaving");
    phase7El.addEventListener(
      "animationend",
      () => {
        phase7El.classList.remove("is-active", "is-leaving");
        // Phase 8 (Live Love Counter) hooks in here.
        document.dispatchEvent(new CustomEvent("phase7:complete"));
      },
      { once: true }
    );
  }

  continueBtn.addEventListener("click", goNext);

  document.addEventListener("phase6:complete", () => {
    phase7El.classList.add("is-active");
  });
})();
