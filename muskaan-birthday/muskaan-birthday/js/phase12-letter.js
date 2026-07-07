/* ============================================
   PHASE 12 — FINAL LETTER
   Fires on "phase11:complete". Ends by dispatching "phase12:complete".
   ============================================ */

(function() {
    const phase12El = document.getElementById("phase12");
    const letterBody = document.getElementById("p12-letter-body");
    const finalLine = document.getElementById("p12-final-line");
    const continueBtn = document.getElementById("p12-continue-btn");

    // Easy to edit — the letter itself. ^number = pause (ms) at that point.
    const LETTER_HTML = [
        "Dear Muskaan,^500",
        "<br><br>Happy Birthday to the most beautiful girl who unexpectedly became one of the most special people in my life.^500",
        "<br><br>I never thought someone could change my life just by being in it, but you did.^500",
        "<br><br>Thank you for every smile, every conversation, every laugh, and every memory we created together.^500",
        "<br><br>Whenever I'm with you, even ordinary moments become special.^500",
        "<br><br>You may not realize it, but you brought happiness into my life in ways I can't explain.^500",
        "<br><br>On your birthday, I don't wish for anything for myself.^400",
        "<br>I only pray that you always stay happy, healthy, and smiling.^500",
        "<br><br>No matter where life takes us, I will always be grateful that our paths crossed.^500",
        "<br>Meeting you is one of the best things that has ever happened to me.^500",
        "<br><br>If this little website made you smile even for a few minutes, then every second I spent making it was worth it.^600",
        "<br><br>Thank you for being you.^300",
        "<br>Thank you for being part of my life.^300",
        "<br>And thank you for giving me memories that I'll always treasure.^500",
        "<br><br>Happy Birthday once again, Muskaan. ❤️^500",
        "<br><br>Take care of yourself.^300",
        "<br>Keep smiling.^300",
        "<br>Because your smile will always be my favorite.^600",
        "<br><br>With lots of love,^400",
        "<br>Ajay Kumar ❤️",
    ].join("");

    // Easy to edit — the line that types itself in after the letter finishes.
    const FINAL_LINE_TEXT =
        '"No matter what happens tomorrow... thank you for making my today so beautiful." ❤️';

    let letterTyped = null;
    let finalTyped = null;

    function runFinalLine() {
        if (typeof Typed === "undefined") {
            finalLine.textContent = FINAL_LINE_TEXT;
            continueBtn.classList.add("is-visible");
            return;
        }

        finalTyped = new Typed(finalLine, {
            strings: [FINAL_LINE_TEXT],
            typeSpeed: 32,
            showCursor: true,
            cursorChar: "|",
            onComplete: () => {
                continueBtn.classList.add("is-visible");
            },
        });
    }

    function runLetter() {
        if (typeof Typed === "undefined") {
            letterBody.innerHTML = LETTER_HTML.replace(/\^\d+/g, "");
            runFinalLine();
            return;
        }

        letterTyped = new Typed(letterBody, {
            strings: [LETTER_HTML],
            typeSpeed: 32,
            showCursor: true,
            cursorChar: "|",
            contentType: "html",
            onComplete: () => {
                setTimeout(runFinalLine, 900);
            },
        });
    }

    continueBtn.addEventListener("click", () => {
        phase12El.classList.add("is-leaving");
        phase12El.addEventListener(
            "animationend",
            () => {
                phase12El.classList.remove("is-active", "is-leaving");
                if (letterTyped) letterTyped.destroy();
                if (finalTyped) finalTyped.destroy();
                // Final Question hooks in here.
                document.dispatchEvent(new CustomEvent("phase12:complete"));
            }, { once: true }
        );
    });

    document.addEventListener("phase11:complete", () => {
        phase12El.classList.add("is-active");
        runLetter();
    });
})();