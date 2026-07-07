/* ============================================
   PHASE 5 — INTERACTIVE FLIP BOOK
   Fires on "phase4:complete". Ends by dispatching "phase5:complete".
   ============================================ */

(function() {
    const phase5El = document.getElementById("phase5");
    const bookEl = document.getElementById("p5-flipbook");
    const prevBtn = document.getElementById("p5-prev");
    const nextBtn = document.getElementById("p5-next");
    const cosmosCanvas = document.getElementById("p5-cosmos-canvas");
    const finalBtn = document.getElementById("p5-final-btn");
    const flipSound = document.getElementById("p5-flip-sound");

    let pageFlip = null;
    let pageCount = 0;

    function updateNavState(currentIndex) {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === pageCount - 1;
    }

    function playFlipSound() {
        if (!flipSound) return;
        flipSound.currentTime = 0;
        flipSound.play().catch(() => {
            /* No sound file supplied yet — the flip just stays silent. */
        });
    }

    function initBook() {
        if (pageFlip || typeof St === "undefined") return;

        // Fixed portrait page shape (like a real hardcover), scaled
        // responsively between the min/max bounds. On wide enough screens
        // the wrapper (see CSS) is roughly double width, so the library
        // automatically renders two pages side by side — a real open book —
        // instead of one page at a time.
        pageFlip = new St.PageFlip(bookEl, {
            width: 360,
            height: 520,
            size: "stretch",
            minWidth: 260,
            maxWidth: 400,
            minHeight: 420,
            maxHeight: 600,
            maxShadowOpacity: 0.6,
            showCover: true,
            mobileScrollSupport: false,
            useMouseEvents: true,
            flippingTime: 800,
        });

        pageFlip.loadFromHTML(bookEl.querySelectorAll(".p5-page"));
        pageCount = pageFlip.getPageCount();
        updateNavState(0);

        pageFlip.on("flip", (e) => {
            updateNavState(e.data);
            playFlipSound();
        });

        prevBtn.addEventListener("click", () => pageFlip.flipPrev());
        nextBtn.addEventListener("click", () => pageFlip.flipNext());
    }

    // Any <img> in the book that fails to load (no photo supplied yet)
    // falls back to a tasteful placeholder instead of a broken icon.
    function wireImageFallbacks() {
        bookEl.querySelectorAll(".p5-photo-frame img").forEach((img) => {
            img.addEventListener("error", () => {
                const frame = img.closest(".p5-photo-frame");
                img.remove();
                const placeholder = document.createElement("div");
                placeholder.className = "p5-photo-placeholder";
                placeholder.innerHTML = `<span class="icon">📸</span><span>Replace with this photo</span>`;
                frame.appendChild(placeholder);
            });
        });
    }

    finalBtn.addEventListener("click", () => {
        phase5El.classList.add("is-leaving");
        phase5El.addEventListener(
            "animationend",
            () => {
                phase5El.classList.remove("is-active", "is-leaving");
                Cosmos.stop();
                // Phase 6 (Photo Gallery) hooks in here.
                document.dispatchEvent(new CustomEvent("phase5:complete"));
            }, { once: true }
        );
    });

    document.addEventListener("phase4:complete", () => {
        phase5El.classList.add("is-active");
        Cosmos.init(cosmosCanvas, 70);
        Cosmos.setMode("idle");
        Cosmos.start();
        wireImageFallbacks();
        initBook();
    });
})();