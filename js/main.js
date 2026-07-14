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

  /* ---------- Hero: biomechanical motion field ----------
     Kinetic "movement" streams flowing along an evolving field, plus
     motion-capture marker nodes that track & link — a premium sports-
     medicine / biomechanics motif (replaces the old heart-rate line). */
  const meshCanvas = document.getElementById("heroMesh");
  if (meshCanvas && !prefersReduced) {
    const ctx = meshCanvas.getContext("2d");
    let w, h, dpr, streams, markers;
    let running = false, rafId = null, t = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    const TAU = Math.PI * 2;
    const TRAIL = 11;

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

    // Smooth, slowly-evolving flow field — gives the sense of motion
    const flow = (x, y) =>
      (Math.sin(x * 0.0019 + t * 0.6) +
        Math.cos(y * 0.0021 - t * 0.5) +
        Math.sin((x + y) * 0.0013 + t * 0.35)) * Math.PI;

    const reseed = (p) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.speed = 0.6 + Math.random() * 1.5;
      p.life = 70 + Math.random() * 150;
      p.age = 0;
      p.gold = Math.random() < 0.16;
      p.trail = [{ x: p.x, y: p.y }];
      return p;
    };

    const spawn = () => {
      const count = Math.min(90, Math.round((w * h) / 11000));
      streams = Array.from({ length: count }, () => {
        const p = reseed({});
        p.age = Math.random() * p.life; // desync
        return p;
      });
      const mCount = Math.min(9, Math.max(5, Math.round(w / 230)));
      markers = Array.from({ length: mCount }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        speed: 0.22 + Math.random() * 0.3,
      }));
    };

    const drawTrail = (tr, width, color) => {
      if (tr.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(tr[0].x, tr[0].y);
      for (let i = 1; i < tr.length; i++) ctx.lineTo(tr[i].x, tr[i].y);
      ctx.stroke();
    };

    const tick = () => {
      if (!running) return;
      t += 0.0025;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Flowing motion streams
      for (const p of streams) {
        let ang = flow(p.x, p.y);
        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 30000) ang += (1 - d2 / 30000) * 2.6; // swirl around cursor
        }
        p.x += Math.cos(ang) * p.speed;
        p.y += Math.sin(ang) * p.speed;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL) p.trail.shift();
        p.age++;

        if (p.age > p.life || p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) {
          reseed(p); continue;
        }
        const fade = Math.min(1, (p.life - p.age) / 26) * Math.min(1, p.age / 10);
        const a = 0.5 * fade;
        if (p.gold) {
          drawTrail(p.trail, 3, "rgba(240, 196, 132, " + (a * 0.45).toFixed(3) + ")");
          drawTrail(p.trail, 1.2, "rgba(250, 224, 176, " + a.toFixed(3) + ")");
        } else {
          drawTrail(p.trail, 3, "rgba(110, 158, 240, " + (a * 0.45).toFixed(3) + ")");
          drawTrail(p.trail, 1.2, "rgba(176, 206, 255, " + a.toFixed(3) + ")");
        }
      }

      // Motion-capture markers drift along the same field
      for (const m of markers) {
        const ang = flow(m.x, m.y);
        m.x += Math.cos(ang) * m.speed;
        m.y += Math.sin(ang) * m.speed;
        if (m.x < 0) m.x += w; else if (m.x > w) m.x -= w;
        if (m.y < 0) m.y += h; else if (m.y > h) m.y -= h;
      }
      // Kinematic links between markers + tracking lines to cursor
      for (let i = 0; i < markers.length; i++) {
        const a = markers[i];
        for (let j = i + 1; j < markers.length; j++) {
          const b = markers[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 260) {
            ctx.strokeStyle = "rgba(91, 147, 240, " + ((1 - d / 260) * 0.22).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (pointer.active) {
          const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (d < 240) {
            ctx.strokeStyle = "rgba(150, 190, 255, " + ((1 - d / 240) * 0.45).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
          }
        }
      }
      // Marker dots with tracking rings, drawn on top
      for (const m of markers) {
        ctx.beginPath(); ctx.arc(m.x, m.y, 2.6, 0, TAU);
        ctx.fillStyle = "rgba(196, 219, 255, 0.95)"; ctx.fill();
        ctx.beginPath(); ctx.arc(m.x, m.y, 6.5, 0, TAU);
        ctx.strokeStyle = "rgba(91, 147, 240, 0.3)"; ctx.lineWidth = 1; ctx.stroke();
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

  /* ---------- Path cards: expand pricing + mouse-follow shine ---------- */
  document.querySelectorAll(".path-card").forEach((card) => {
    const toggle = card.querySelector(".path-toggle");
    const detail = card.querySelector(".path-detail");
    if (toggle && detail) {
      const label = toggle.querySelector(".path-toggle-txt");
      toggle.addEventListener("click", () => {
        const open = card.classList.toggle("path-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          detail.hidden = false;
        } else {
          // wait for the collapse transition before hiding
          detail.addEventListener("transitionend", function hide(e) {
            if (e.propertyName === "max-height" && !card.classList.contains("path-open")) {
              detail.hidden = true;
              detail.removeEventListener("transitionend", hide);
            }
          });
        }
        if (label) label.textContent = open ? "Hide pricing" : "See full pricing";
      });
    }

    if (canHover) {
      const shine = card.querySelector(".path-shine");
      if (shine) {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", (e.clientX - r.left) + "px");
          card.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
      }
    }
  });

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

  /* ---------- Mobile dock: scroll-spy + hide over contact ---------- */
  const dock = document.getElementById("mobileDock");
  if (dock) {
    const contact = document.getElementById("contact");
    if (contact) {
      new IntersectionObserver(
        (entries) => entries.forEach((e) => dock.classList.toggle("dock-hidden", e.isIntersecting)),
        { threshold: 0.18 }
      ).observe(contact);
    }
    // Highlight the dock item for whichever section is in view
    const spyItems = dock.querySelectorAll(".dock-item[data-spy]");
    spyItems.forEach((item) => {
      const sec = document.getElementById(item.dataset.spy);
      if (!sec) return;
      new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              spyItems.forEach((i) => i.classList.remove("active"));
              item.classList.add("active");
            }
          }),
        { threshold: 0.5 }
      ).observe(sec);
    });
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
