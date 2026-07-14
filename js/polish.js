/* ============================================================
   OLYMPIAN HEALTH SOLUTIONS — polish.js
   Final-polish motion layer · loads after main.js
   Hero word cascade · magnetic CTAs · card spotlights ·
   aurora parallax — all gated on capability & reduced motion
   ============================================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Hero headline: word-by-word cascade ---------- */
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle && !prefersReduced) {
    let wordIndex = 0;
    heroTitle.querySelectorAll("span.reveal").forEach((line) => {
      // Neutralize the old line-level reveal so the two systems don't stack
      line.classList.add("visible");
      if (line.classList.contains("hero-hl")) {
        // Gradient-clipped text can't hold per-word filters (the clip breaks),
        // so the highlight line cascades as one block
        line.classList.add("ht-word", "ht-line");
        line.style.setProperty("--wd", (0.12 + wordIndex * 0.11).toFixed(2) + "s");
        wordIndex += 2;
        return;
      }
      const words = line.textContent.trim().split(/\s+/);
      line.textContent = "";
      words.forEach((word, i) => {
        const w = document.createElement("span");
        w.className = "ht-word";
        w.style.setProperty("--wd", (0.12 + wordIndex * 0.11).toFixed(2) + "s");
        w.textContent = word;
        line.appendChild(w);
        if (i < words.length - 1) line.appendChild(document.createTextNode(" "));
        wordIndex++;
      });
    });
    // Fire the cascade once the preloader curtain lifts
    const start = () => document.querySelector(".hero").classList.add("hero-cascade");
    const preloader = document.getElementById("preloader");
    if (preloader && !preloader.classList.contains("done")) {
      new MutationObserver((muts, obs) => {
        if (preloader.classList.contains("done")) { start(); obs.disconnect(); }
      }).observe(preloader, { attributes: true, attributeFilter: ["class"] });
      // Safety net if the preloader never reports done
      setTimeout(start, 3000);
    } else {
      requestAnimationFrame(start);
    }
  }

  /* ---------- Magnetic CTAs (desktop only) ---------- */
  if (finePointer && !prefersReduced) {
    const strength = 0.22;
    document.querySelectorAll(".hero-cta .btn, .pp-cta, .contact-form .btn-gold").forEach((btn) => {
      let raf = null;
      btn.addEventListener("mousemove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width / 2) * strength;
          const dy = (e.clientY - r.top - r.height / 2) * strength;
          btn.style.transform =
            "translate(" + dx.toFixed(1) + "px, " + (dy - 2).toFixed(1) + "px)";
        });
      });
      btn.addEventListener("mouseleave", () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Pointer-tracked card spotlights ---------- */
  const spotSelectors =
    ".price-card, .lab-card, .result-card, .senior-card, .tw-card, " +
    ".book-card, .refer-benefit, .bridge-point, .plan-step, .pa-item";
  if (finePointer) {
    document.querySelectorAll(spotSelectors).forEach((card) => {
      card.classList.add("card-spot");
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Pause decorative animations when offscreen ---------- */
  const pauseWatch = (targets, watched) => {
    if (!targets.length) return;
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        targets.forEach((el) =>
          el.classList.toggle("anim-paused", !entry.isIntersecting)
        );
      });
    }, { rootMargin: "80px" }).observe(watched);
  };
  const heroEl = document.querySelector(".hero");
  if (heroEl) {
    pauseWatch(
      Array.from(heroEl.querySelectorAll(
        ".hero-aurora, .hero-halo, .hero-floor, .hero-scanline, .hero-ekg, .hero-cta .btn-gold"
      )),
      heroEl
    );
  }
  document.querySelectorAll(".price-featured, .pricing-promise, .footer, .sticky-cta")
    .forEach((el) => pauseWatch([el], el));
  // Immersive specialty sections: pause their aurora orbs when scrolled away
  document.querySelectorAll(".seniors-immersive, .bridge-immersive")
    .forEach((el) => pauseWatch([el], el));

  /* ---------- Aurora layers drift with scroll ---------- */
  const auroras = document.querySelectorAll(".hero-aurora");
  if (auroras.length && !prefersReduced) {
    let queued = false;
    const drift = () => {
      queued = false;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.3) return;
      auroras.forEach((a, i) => {
        a.style.marginTop = (y * (i ? -0.06 : 0.1)).toFixed(1) + "px";
      });
    };
    window.addEventListener("scroll", () => {
      if (!queued) { queued = true; requestAnimationFrame(drift); }
    }, { passive: true });
  }
})();
