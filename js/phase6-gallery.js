/* ============================================
   PHASE 6 — PHOTO GALLERY (clothesline)
   Fires on "phase5:complete". Ends by dispatching "phase6:complete".

   A few threads strung across the scene, photos clipped onto them at
   scattered spots along the line — slightly different heights, sizes,
   and tilts, like they were actually pinned up by hand. Each one drops
   into place and gently sways forever after.
   ============================================ */

(function() {
    const phase6El = document.getElementById("phase6");
    const clothesline = document.getElementById("p6-clothesline");
    const continueBtn = document.getElementById("p6-continue-btn");

    const lightbox = document.getElementById("p6-lightbox");
    const lightboxImg = document.getElementById("p6-lightbox-photo");
    const lightboxClose = document.getElementById("p6-lightbox-close");

    // Easy to edit — just filenames. Drop matching files into
    // assets/images/ and these slots fill themselves automatically.
    const PHOTOS = [
        "assets/images/first.jpeg",
        "assets/images/second.jpeg",
        "assets/images/third.jpeg",
        "assets/images/fourth.jpeg",
        "assets/images/fifth.jpeg",
        "assets/images/sixth.jpeg",
        "assets/images/seventh.jpeg",
        "assets/images/eighth.jpeg",
        "assets/images/nine.jpeg",
        "assets/images/ten.jpeg",
        "assets/images/eleven.jpeg",
        "assets/images/twelve.jpeg",
        "assets/images/thirteen.jpeg",
    ];

    let built = false;

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function buildClothesline() {
        clothesline.innerHTML = "";

        const containerWidth = clothesline.clientWidth || window.innerWidth;
        const isMobile = containerWidth < 640;

        // Fewer, bigger photos per row on phones; a wider spread on desktop.
        const perRow = isMobile ? 2 : 4;
        const rows = Math.ceil(PHOTOS.length / perRow);

        // Desktop photos are noticeably bigger now; mobile photos scale to
        // whatever width two of them can share comfortably.
        const baseSize = isMobile ?
            Math.min(190, containerWidth / perRow - 28) :
            190;
        const rowHeight = baseSize + (isMobile ? 90 : 110);

        clothesline.style.height = rows * rowHeight + 40 + "px";

        let photoIndex = 0;

        for (let r = 0; r < rows; r++) {
            const rowCount = Math.min(perRow, PHOTOS.length - photoIndex);
            const rowTop = r * rowHeight + 26;

            const string = document.createElement("div");
            string.className = "p6-string";
            string.style.top = rowTop + "px";
            string.style.transform = `rotate(${rand(-1.8, 1.8)}deg)`;
            clothesline.appendChild(string);

            for (let k = 0; k < rowCount; k++) {
                const src = PHOTOS[photoIndex];
                const size = isMobile ? baseSize + rand(-8, 8) : baseSize + rand(-25, 30);
                const xPercent = ((k + 1) / (rowCount + 1)) * 100 + rand(-3, 3);
                const dangle = rand(16, Math.max(20, rowHeight - size - 50));
                const tilt = rand(-6, 6);

                const item = document.createElement("figure");
                item.className = "p6-photo-item";
                item.style.width = size + "px";
                item.style.left = `calc(${xPercent}% - ${size / 2}px)`;
                item.style.top = rowTop + dangle + "px";
                item.style.setProperty("--rot", tilt.toFixed(1) + "deg");

                item.innerHTML = `
          <div class="p6-clip"></div>
          <div class="p6-photo-inner">
            <img src="${src}" alt="A memory of us" loading="lazy" />
          </div>
        `;

                const img = item.querySelector("img");
                img.addEventListener("error", () => {
                    img.remove();
                    const placeholder = document.createElement("div");
                    placeholder.className = "p6-photo-placeholder";
                    placeholder.innerHTML = `<span class="icon">📷</span><span>Add this photo</span>`;
                    item.querySelector(".p6-photo-inner").appendChild(placeholder);
                });

                item.addEventListener("click", () => openLightbox(src));

                clothesline.appendChild(item);
                photoIndex++;
            }
        }
    }

    /** Each photo drops down from above into its clipped spot, one after
        another, then settles into a slow endless sway. */
    function playEntrance() {
        const items = clothesline.querySelectorAll(".p6-photo-item");
        const strings = clothesline.querySelectorAll(".p6-string");

        gsap.set(strings, { opacity: 0 });
        gsap.to(strings, { opacity: 1, duration: 0.8, ease: "power1.out" });

        items.forEach((item, i) => {
            const restRotate = parseFloat(item.style.getPropertyValue("--rot")) || 0;

            gsap.set(item, {
                y: -220,
                rotate: restRotate * 3,
                opacity: 0,
            });

            gsap.to(item, {
                y: 0,
                rotate: restRotate,
                opacity: 1,
                duration: 0.9,
                delay: 0.3 + i * 0.09,
                ease: "back.out(1.4)",
                onComplete: () => {
                    const duration = rand(3.5, 5.5);
                    const delay = rand(0, 1.5);
                    item.style.animation = `p6-sway ${duration}s ease-in-out ${delay}s infinite`;
                },
            });
        });
    }

    function openLightbox(src) {
        lightboxImg.src = src;
        lightboxImg.alt = "A memory of us";
        lightbox.classList.add("is-visible");
    }

    function closeLightbox() {
        lightbox.classList.remove("is-visible");
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });

    continueBtn.addEventListener("click", () => {
        phase6El.classList.add("is-leaving");
        phase6El.addEventListener(
            "animationend",
            () => {
                phase6El.classList.remove("is-active", "is-leaving");
                // Phase 7 (Video Message) hooks in here.
                document.dispatchEvent(new CustomEvent("phase6:complete"));
            }, { once: true }
        );
    });

    document.addEventListener("phase5:complete", () => {
        phase6El.classList.add("is-active");

        if (!built) {
            buildClothesline();
            built = true;
        }

        playEntrance();
    });
})();