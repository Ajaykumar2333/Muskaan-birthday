/* ============================================
   PHASE 0 — COUNTDOWN GATE
   Runs before everything else. Locks the site until UNLOCK_DATE,
   then unlocks automatically (no refresh needed). "Skip For Now"
   bypasses it early for testing while the site is still in progress.
   ============================================ */

(function() {
    const gate = document.getElementById("phase0-gate");
    if (!gate) return;

    const daysEl = document.getElementById("gate-days");
    const hoursEl = document.getElementById("gate-hours");
    const minsEl = document.getElementById("gate-minutes");
    const secsEl = document.getElementById("gate-seconds");
    const messageEl = document.getElementById("gate-message");
    const skipBtn = document.getElementById("gate-skip-btn");

    // Easy to edit — the exact moment the site should unlock.
    const UNLOCK_DATE = new Date("2026-07-08T00:00:00");

    // Cycles forever while the countdown runs.
    const MESSAGES = [
        "Advance Happy Birthday, Muskaan ❤️",
        "Something Special Is Waiting For You...",
        "Just A Little Longer...",
        "Get Ready For Something Beautiful ❤️",
        "Almost Time ❤️",
    ];

    let msgIndex = 0;
    let countdownInterval = null;
    let messageInterval = null;

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    function updateCountdown() {
        const diff = UNLOCK_DATE - new Date();

        if (diff <= 0) {
            unlockSite();
            return;
        }

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        daysEl.textContent = days;
        hoursEl.textContent = pad(hours);
        minsEl.textContent = pad(minutes);
        secsEl.textContent = pad(seconds);
    }

    function cycleMessage() {
        messageEl.style.opacity = 0;
        setTimeout(() => {
            msgIndex = (msgIndex + 1) % MESSAGES.length;
            messageEl.textContent = MESSAGES[msgIndex];
            messageEl.style.opacity = 1;
        }, 400);
    }

    function unlockSite() {
        clearInterval(countdownInterval);
        clearInterval(messageInterval);
        gate.classList.add("is-leaving");
        gate.addEventListener(
            "animationend",
            () => {
                gate.style.display = "none";
            }, { once: true }
        );
    }

    if (skipBtn) {
        skipBtn.addEventListener("click", unlockSite);
    }

    // Already past the unlock moment (e.g. she opens it after the 8th)?
    // Skip the gate entirely, no flash of the countdown.
    if (UNLOCK_DATE - new Date() <= 0) {
        gate.style.display = "none";
        return;
    }

    messageEl.textContent = MESSAGES[0];
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
    messageInterval = setInterval(cycleMessage, 3000);
})();