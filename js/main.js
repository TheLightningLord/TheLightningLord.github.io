/* ============================================================
   OLYMPIAN HEALTH SOLUTIONS — main.js
   Preloader · nav · Olympus scene (stars, parallax, dust) ·
   reveals · counters · slider · tilt · misc
   ============================================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("done"), 450);
  });
  // Safety net in case the load event already fired or assets hang
  setTimeout(() => preloader.classList.add("done"), 2500);

  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  /* ---------- Hero: parallax + content fade (scroll + mouse) ---------- */
  const pLayers = [
    { el: document.getElementById("heroBlueprint"), sy: 0.06, mx: 14 },
    { el: document.getElementById("heroEcg"), sy: 0.12, mx: 26 },
  ].filter((l) => l.el);

  let mouseX = 0; // -0.5 .. 0.5
  let parallaxQueued = false;

  const applyParallax = () => {
    parallaxQueued = false;
    const y = window.scrollY;
    if (y > window.innerHeight * 1.2) return; // hero off-screen
    pLayers.forEach((l) => {
      l.el.style.transform =
        "translate(" + (mouseX * l.mx).toFixed(1) + "px, " + (y * l.sy).toFixed(1) + "px)";
    });
    if (heroContent) {
      heroContent.style.transform = "translateY(" + y * 0.28 + "px)";
      heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.9));
    }
  };
  const queueParallax = () => {
    if (!parallaxQueued) {
      parallaxQueued = true;
      requestAnimationFrame(applyParallax);
    }
  };
  if (!prefersReduced && pLayers.length) {
    window.addEventListener("scroll", queueParallax, { passive: true });
    if (canHover && hero) {
      hero.addEventListener("mousemove", (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        queueParallax();
      });
    }
  }

  /* ---------- Hero: motion-capture node mesh ---------- */
  const meshCanvas = document.getElementById("heroMesh");
  if (meshCanvas && !prefersReduced) {
    const ctx = meshCanvas.getContext("2d");
    let w, h, nodes, dpr;
    let running = false;
    let rafId = null;
    const pointer = { x: -9999, y: -9999, active: false };
    const LINK_DIST = 132;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      meshCanvas.width = w * dpr;
      meshCanvas.height = h * dpr;
      meshCanvas.style.width = w + "px";
      meshCanvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = () => {
      // Scale node count to area, capped for performance
      const count = Math.min(58, Math.round((w * h) / 19000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: Math.random() * 1.6 + 1.0,
      }));
    };
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Links between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.32;
            ctx.strokeStyle = "rgba(212, 175, 55, " + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Links to the pointer (interactive "tracking")
        if (pointer.active) {
          const dx = a.x - pointer.x, dy = a.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST * 1.5) {
            const alpha = (1 - dist / (LINK_DIST * 1.5)) * 0.5;
            ctx.strokeStyle = "rgba(245, 208, 97, " + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      // Nodes (motion-capture markers)
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245, 224, 160, 0.85)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.22)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    spawn();
    window.addEventListener("resize", () => { resize(); spawn(); });
    if (canHover) {
      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.active = true;
      });
      hero.addEventListener("mouseleave", () => { pointer.active = false; });
    }

    // Only animate while the hero is on screen
    new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; tick(); }
      else if (!visible && running) { running = false; cancelAnimationFrame(rafId); }
    }, { threshold: 0.02 }).observe(hero);
  }

  /* ---------- Sticky nav ---------- */
  const nav = document.getElementById("nav");
  const stickyCta = document.getElementById("stickyCta");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    if (stickyCta) {
      // Show floating CTA once past the hero, hide near the contact form
      const contact = document.getElementById("contact");
      const pastHero = window.scrollY > window.innerHeight * 0.7;
      const beforeContact =
        contact.getBoundingClientRect().top > window.innerHeight * 0.5;
      stickyCta.classList.toggle("show", pastHero && beforeContact);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  // Close the menu when a link is tapped
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = Math.round(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".counter").forEach((el) => counterObserver.observe(el));

  /* ---------- 3D tilt on program cards ---------- */
  if (canHover && !prefersReduced) {
    document.querySelectorAll(".program-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateY(" + (x * 6).toFixed(2) + "deg) rotateX(" +
          (-y * 6).toFixed(2) + "deg) translateY(-10px)";
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById("sliderTrack");
  if (track) {
    const slides = track.children.length;
    const dotsWrap = document.getElementById("sliderDots");
    let index = 0;
    let timer;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Testimonial " + (i + 1));
      dot.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    }
    const dots = Array.from(dotsWrap.children);

    const goTo = (i) => {
      index = (i + slides) % slides;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach((d, j) => d.classList.toggle("active", j === index));
    };
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), 6000);
    };

    // Swipe support for touch devices
    let startX = null;
    track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    track.addEventListener(
      "touchend",
      (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) {
          goTo(index + (dx < 0 ? 1 : -1));
          restart();
        }
        startX = null;
      },
      { passive: true }
    );

    goTo(0);
    restart();
  }

  /* ---------- FAQ: close others when one opens ---------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Lead form: friendly handling ---------- */
  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      // If Formspree isn't configured yet, keep the demo graceful
      if (form.action.includes("YOUR_FORM_ID")) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = "⚡ Almost! Connect Formspree (see README)";
        setTimeout(() => (btn.textContent = "⚡ Send My Request"), 3500);
      }
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById("scrollProgress");
  const toTop = document.getElementById("toTop");
  const onProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 620);
  };
  window.addEventListener("scroll", onProgress, { passive: true });
  onProgress();
  if (toTop) {
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
    );
  }

  /* ---------- Before / After slider ---------- */
  const baRange = document.getElementById("baRange");
  if (baRange) {
    const baBefore = document.getElementById("baBefore");
    const baHandle = document.getElementById("baHandle");
    const setBA = (v) => {
      baBefore.style.width = v + "%";
      baHandle.style.left = v + "%";
    };
    baRange.addEventListener("input", (e) => setBA(e.target.value));
    setBA(baRange.value);
  }

  /* ---------- Intro video: load embed on play ---------- */
  const videoPlay = document.getElementById("videoPlay");
  if (videoPlay) {
    videoPlay.addEventListener("click", () => {
      const url = videoPlay.dataset.embed;
      const frame = document.getElementById("videoFrame");
      if (!url) {
        // Not configured yet — give a gentle nudge instead of a broken player
        const poster = frame.querySelector(".video-poster p");
        if (poster) {
          const original = poster.textContent;
          poster.textContent = "Add your video link in index.html (see README)";
          setTimeout(() => (poster.textContent = original), 3000);
        }
        return;
      }
      const sep = url.indexOf("?") === -1 ? "?" : "&";
      frame.innerHTML =
        '<iframe src="' + url + sep + 'autoplay=1" title="Intro video by Zeuse Valentine" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen></iframe>';
    });
  }

  /* ---------- Calorie & Macro calculator ---------- */
  const calcForm = document.getElementById("calcForm");
  if (calcForm) {
    let unit = "imperial";
    const $ = (id) => document.getElementById(id);

    // Unit toggle
    document.querySelectorAll(".unit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        unit = btn.dataset.unit;
        document.querySelectorAll(".unit-btn").forEach((b) => b.classList.toggle("active", b === btn));
        const imp = unit === "imperial";
        document.querySelector(".calc-imp").hidden = !imp;
        document.querySelector(".calc-met").hidden = imp;
        document.querySelector(".wt-unit").textContent = imp ? "lb" : "kg";
        // sensible default weight when switching
        $("calcWeight").value = imp ? 175 : 79;
      });
    });

    // Sex segmented control
    let sex = "male";
    document.querySelectorAll("#calcSex button").forEach((btn) => {
      btn.addEventListener("click", () => {
        sex = btn.dataset.v;
        document.querySelectorAll("#calcSex button").forEach((b) => b.classList.toggle("active", b === btn));
      });
    });

    const fmt = (n) => Math.round(n / 10) * 10;

    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const age = parseFloat($("calcAge").value) || 30;
      let kg, cm;
      if (unit === "imperial") {
        const ft = parseFloat($("calcFt").value) || 0;
        const inch = parseFloat($("calcIn").value) || 0;
        cm = (ft * 12 + inch) * 2.54;
        kg = (parseFloat($("calcWeight").value) || 0) * 0.453592;
      } else {
        cm = parseFloat($("calcCm").value) || 0;
        kg = parseFloat($("calcWeight").value) || 0;
      }
      if (!kg || !cm) return;

      // Mifflin–St Jeor
      const bmr = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
      const tdee = bmr * parseFloat($("calcActivity").value);
      const proteinG = Math.round(kg * 1.8); // ~0.8 g/lb

      $("crMaintain").textContent = fmt(tdee).toLocaleString();
      $("crCut").textContent = fmt(tdee * 0.8).toLocaleString();
      $("crBulk").textContent = fmt(tdee * 1.1).toLocaleString();
      $("crProtein").textContent = proteinG + " g";
      $("crBmr").textContent = Math.round(bmr).toLocaleString();
      $("crTdee").textContent = Math.round(tdee).toLocaleString();

      const results = $("calcResults");
      results.hidden = false;
      results.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
    });
  }

  /* ---------- Book signup form: friendly handling ---------- */
  const bookForm = document.getElementById("bookForm");
  if (bookForm) {
    bookForm.addEventListener("submit", (e) => {
      if (bookForm.action.includes("YOUR_LIST_ID")) {
        e.preventDefault();
        const btn = bookForm.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = "Connect your email list (see README)";
        setTimeout(() => (btn.textContent = original), 3500);
      }
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
