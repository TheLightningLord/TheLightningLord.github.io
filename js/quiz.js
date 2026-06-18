/* ============================================================
   OLYMPIAN HEALTH SOLUTIONS — quiz.js
   Personalized Vitality Assessment + research-backed report
   ============================================================
   NOTE ON CLAIMS: Statistics below reflect population-level
   findings from peer-reviewed research and major health bodies
   (WHO, AHA, BJSM, Lancet, JAMA, Cochrane, ACSM, Johns Hopkins).
   They are presented as educational ranges, not guarantees, and
   the report carries a medical disclaimer. Individual results vary.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Questions ---------- */
  const QUESTIONS = [
    { id: "move_day", cat: "Movement", pillar: "move",
      q: "On a typical day, how much are you moving?",
      options: [
        { label: "Mostly seated — desk, car, couch", s: 0, flags: ["sedentary"] },
        { label: "Some walking, but mostly sitting", s: 1, flags: ["sedentary"] },
        { label: "On my feet a fair amount", s: 2 },
        { label: "Active and moving most of the day", s: 3 },
      ] },
    { id: "move_days", cat: "Movement", pillar: "move",
      q: "How many days per week do you do intentional exercise?",
      options: [
        { label: "None right now", s: 0, flags: ["sedentary"] },
        { label: "1–2 days", s: 1 },
        { label: "3–4 days", s: 2 },
        { label: "5 or more days", s: 3 },
      ] },
    { id: "strength", cat: "Movement", pillar: "move",
      q: "Do you do any strength or resistance training?",
      options: [
        { label: "Never", s: 0, flags: ["no_strength"] },
        { label: "Once in a while", s: 1, flags: ["no_strength"] },
        { label: "1–2 times a week", s: 2 },
        { label: "3+ times a week", s: 3 },
      ] },
    { id: "stairs", cat: "Movement", pillar: "move",
      q: "Could you climb 3 flights of stairs without stopping to rest?",
      options: [
        { label: "No — I'd be out of breath", s: 0, flags: ["low_fitness"] },
        { label: "Maybe, with effort", s: 1, flags: ["low_fitness"] },
        { label: "Yes, fairly easily", s: 2 },
        { label: "Easily", s: 3 },
      ] },
    { id: "veg", cat: "Nutrition", pillar: "nutrition",
      q: "How many servings of fruit & vegetables on a typical day?",
      options: [
        { label: "0–1", s: 0, flags: ["poor_nutrition"] },
        { label: "2–3", s: 1 },
        { label: "4–5", s: 2 },
        { label: "6 or more", s: 3 },
      ] },
    { id: "processed", cat: "Nutrition", pillar: "nutrition",
      q: "How often do you eat fast food or highly processed meals?",
      options: [
        { label: "Most days", s: 0, flags: ["poor_nutrition"] },
        { label: "A few times a week", s: 1 },
        { label: "Occasionally", s: 2 },
        { label: "Rarely", s: 3 },
      ] },
    { id: "protein", cat: "Nutrition", pillar: "nutrition",
      q: "How dialed-in are your protein and hydration?",
      options: [
        { label: "I don't really track either", s: 0 },
        { label: "Inconsistent", s: 1 },
        { label: "Usually pretty good", s: 2 },
        { label: "Very consistent", s: 3 },
      ] },
    { id: "sleep_hrs", cat: "Recovery", pillar: "recovery",
      q: "How many hours do you sleep on a typical night?",
      options: [
        { label: "Less than 6", s: 0, flags: ["poor_sleep"] },
        { label: "6–7", s: 1, flags: ["poor_sleep"] },
        { label: "7–8", s: 2 },
        { label: "More than 8", s: 3 },
      ] },
    { id: "rested", cat: "Recovery", pillar: "recovery",
      q: "How do you feel when you wake up?",
      options: [
        { label: "Exhausted", s: 0, flags: ["poor_sleep"] },
        { label: "Groggy", s: 1 },
        { label: "Okay", s: 2 },
        { label: "Refreshed", s: 3 },
      ] },
    { id: "energy", cat: "Recovery", pillar: "recovery",
      q: "How is your energy through the day?",
      options: [
        { label: "Constantly drained", s: 0, flags: ["low_energy"] },
        { label: "Afternoon crashes", s: 1, flags: ["low_energy"] },
        { label: "Generally steady", s: 2 },
        { label: "Energized", s: 3 },
      ] },
    { id: "stress", cat: "Mindset", pillar: "mind",
      q: "How often do you feel stressed or overwhelmed?",
      options: [
        { label: "Almost always", s: 0, flags: ["high_stress"] },
        { label: "Often", s: 1, flags: ["high_stress"] },
        { label: "Sometimes", s: 2 },
        { label: "Rarely", s: 3 },
      ] },
    { id: "mood", cat: "Mindset", pillar: "mind",
      q: "In the last 2 weeks, how often have you felt low, flat, or unmotivated?",
      options: [
        { label: "Most days", s: 0, flags: ["low_mood"] },
        { label: "Several days", s: 1, flags: ["low_mood"] },
        { label: "A few days", s: 2 },
        { label: "Almost never", s: 3 },
      ] },
    { id: "focus", cat: "Mindset", pillar: "mind",
      q: "How is your focus and mental clarity?",
      options: [
        { label: "Foggy and scattered", s: 0, flags: ["poor_focus"] },
        { label: "Hit or miss", s: 1, flags: ["poor_focus"] },
        { label: "Usually sharp", s: 2 },
        { label: "Very sharp", s: 3 },
      ] },
    { id: "confidence", cat: "Mindset", pillar: "mind",
      q: "How confident do you feel in your body right now?",
      options: [
        { label: "Not at all", s: 0, flags: ["low_confidence"] },
        { label: "Could be a lot better", s: 1, flags: ["low_confidence"] },
        { label: "Fairly confident", s: 2 },
        { label: "Very confident", s: 3 },
      ] },
    { id: "concerns", cat: "Health", pillar: "health", type: "multi",
      q: "Do any of these currently apply to you? (select all that apply)",
      options: [
        { label: "Carrying extra weight", flags: ["weight"] },
        { label: "High blood pressure", flags: ["blood_pressure"] },
        { label: "High blood sugar / pre-diabetes", flags: ["blood_sugar"] },
        { label: "Joint pain or stiffness", flags: ["joint_pain"] },
        { label: "Recurring back pain", flags: ["back_pain"] },
        { label: "None of these", flags: [], none: true },
      ] },
    { id: "goal", cat: "Your Goal", pillar: null,
      q: "What's your single biggest goal right now?",
      options: [
        { label: "Lose fat & change my body", goal: "weight" },
        { label: "Build strength & muscle", goal: "strength" },
        { label: "Move & live pain-free", goal: "pain" },
        { label: "More energy & a better mood", goal: "energy" },
        { label: "Age strong & stay independent", goal: "longevity" },
      ] },
    { id: "barrier", cat: "Your Goal", pillar: null,
      q: "What's held you back before?",
      options: [
        { label: "I'm not sure what to actually do", barrier: "knowledge" },
        { label: "No accountability or motivation", barrier: "accountability" },
        { label: "A past injury or pain", barrier: "pain" },
        { label: "Not enough time", barrier: "time" },
        { label: "Tried before — it didn't stick", barrier: "consistency" },
      ] },
    { id: "age", cat: "Your Goal", pillar: null,
      q: "Last one — your age range?",
      options: [
        { label: "Under 30", age: "u30" },
        { label: "30–44", age: "30s" },
        { label: "45–59", age: "45s" },
        { label: "60+", age: "60+", flags: ["age_60"] },
      ] },
  ];

  /* ---------- Research-backed insight library ---------- */
  const INSIGHTS = {
    sedentary: { tag: "Movement", stat: "Up to 31% lower risk of early death", title: "Your body is built to move",
      body: "Going from inactive to meeting basic activity guidelines (about 150 minutes a week) is linked to roughly a 31% lower risk of dying early. You don't need to become an athlete — consistent, structured training is one of the most powerful interventions in all of medicine.",
      src: "Meta-analyses · WHO Physical Activity Guidelines" },
    no_strength: { tag: "Strength", stat: "10–20% lower mortality", title: "Muscle is your longevity insurance",
      body: "Just 30–60 minutes of strength training per week is associated with a 10–20% lower risk of death and of heart disease, cancer, and diabetes. Grip and leg strength are among the strongest known predictors of how well you age.",
      src: "Br J Sports Medicine, 2022 meta-analysis" },
    low_fitness: { tag: "Fitness", stat: "Bigger risk than smoking", title: "Cardio fitness is a vital sign",
      body: "Low cardiorespiratory fitness carries a higher mortality risk than smoking, diabetes, or high blood pressure. The good news: it's one of the most trainable things about you — and it climbs quickly with the right plan.",
      src: "JAMA Network Open, 2018" },
    poor_nutrition: { tag: "Nutrition", stat: "Training amplifies nutrition", title: "Food + training are a team",
      body: "Pairing a few simple nutrition habits with resistance training preserves lean muscle while you lose fat, steadies energy, and makes healthy eating feel automatic. We build habits around your real life — not a crash diet.",
      src: "ACSM Position Stand on Weight Management" },
    poor_sleep: { tag: "Recovery", stat: "Fall asleep faster, sleep deeper", title: "Better sleep starts with movement",
      body: "People who exercise regularly fall asleep faster and report markedly better sleep quality — without medication. Even moderate activity helps regulate the systems that drive deep, restorative sleep.",
      src: "Johns Hopkins Medicine · sleep research" },
    low_energy: { tag: "Energy", stat: "~65% less fatigue", title: "Trade fatigue for energy",
      body: "It feels backwards, but spending energy creates it. Sedentary adults who begin regular low-to-moderate exercise report up to a 65% drop in fatigue and a 20% rise in energy as their bodies build new mitochondria.",
      src: "University of Georgia · Psychotherapy & Psychosomatics" },
    high_stress: { tag: "Mind", stat: "~1.5× more effective than meds alone", title: "Exercise is a proven stress buffer",
      body: "A 2023 review of 97 studies found physical activity was about 1.5 times more effective at easing stress, anxiety, and mild-to-moderate depression than medication or counseling on their own. Movement is one of the most underused mental-health tools there is.",
      src: "Singh et al., Br J Sports Medicine, 2023" },
    low_mood: { tag: "Mood", stat: "Significantly lower depression risk", title: "Movement lifts mood — measurably",
      body: "Regular exercise reliably reduces symptoms of depression and guards against future low mood by releasing endorphins and BDNF, your brain's natural 'fertilizer.' Many people feel the shift within the first few weeks.",
      src: "Singh et al., BJSM 2023 · Harvard Health" },
    poor_focus: { tag: "Brain", stat: "Up to ~30% lower dementia risk", title: "A sharper mind, a younger brain",
      body: "Exercise boosts BDNF and blood flow to the brain, improving memory, focus, and decision-making today — and is associated with up to a 28–30% lower risk of dementia as you age.",
      src: "Lancet Commission on Dementia Prevention" },
    low_confidence: { tag: "Confidence", stat: "Higher self-esteem in weeks", title: "Confidence is built, rep by rep",
      body: "Exercise improves body image, self-efficacy, and self-esteem — often well before major physical changes show up in the mirror. Every session is a promise kept to yourself.",
      src: "Sports Medicine · systematic reviews" },
    weight: { tag: "Body Comp", stat: "Keep fat off for good", title: "Reshape your body, not just the scale",
      body: "Strength training plus smart nutrition builds metabolically active muscle, so you burn more at rest and keep fat off long-term. It's the difference between losing weight and transforming your body.",
      src: "ACSM · National Weight Control Registry" },
    blood_pressure: { tag: "Heart", stat: "Up to ~35% lower CVD risk", title: "A stronger heart, naturally",
      body: "Consistent exercise lowers resting blood pressure and can cut cardiovascular disease risk by up to a third — rivaling first-line medication for mild hypertension, with only good side effects.",
      src: "American Heart Association · JAMA" },
    blood_sugar: { tag: "Metabolic", stat: "30–50% lower diabetes risk", title: "Muscle is your blood-sugar sponge",
      body: "Working muscle pulls glucose out of your blood with far less insulin. Combined aerobic and resistance training can cut the risk of developing type 2 diabetes by 30–50%, and sharply improves control if you already have it.",
      src: "Diabetes Prevention Program · Lancet" },
    joint_pain: { tag: "Joints", stat: "As effective as NSAIDs for knee OA", title: "Strength is the best painkiller for joints",
      body: "Targeted strengthening reduces chronic joint pain and stiffness and improves function — for knee osteoarthritis it can work as well as anti-inflammatory medication, without the side effects.",
      src: "Cochrane Reviews · ACSM" },
    back_pain: { tag: "Back", stat: "The #1 recommended treatment", title: "Build a back that doesn't quit",
      body: "For recurring low-back pain, structured exercise is the most strongly recommended, evidence-based treatment — more effective long-term than rest, medication, or passive care. We strengthen the system that protects your spine.",
      src: "Lancet Low Back Pain Series, 2018" },
    age_60: { tag: "Longevity", stat: "~23% fewer falls", title: "Strong, steady & independent",
      body: "For adults 60+, strength and balance training reduces falls by around 23% and protects the muscle and bone that keep you independent. It's never too late to start — meaningful gains happen at every age.",
      src: "Cochrane · Br J Sports Medicine" },
  };

  // Priority order when choosing which insights to feature
  const PRIORITY = ["high_stress", "low_mood", "sedentary", "no_strength", "blood_sugar",
    "blood_pressure", "back_pain", "joint_pain", "poor_sleep", "low_energy", "weight",
    "poor_focus", "low_fitness", "low_confidence", "poor_nutrition", "age_60"];

  const GOAL_HEADLINE = {
    weight: "here's how training turns fat loss into a lasting transformation.",
    strength: "here's your blueprint to real, lasting strength.",
    pain: "here's how the right training helps you move pain-free.",
    energy: "here's how training rebuilds your energy and mood.",
    longevity: "here's how training keeps you strong for decades.",
  };
  const BARRIER_LINE = {
    knowledge: "You said you're not sure what to actually do — that's exactly what a professionally-built, personalized program removes.",
    accountability: "You said accountability is the gap — that's the entire point of having a coach in your corner every single week.",
    pain: "You mentioned a past injury — my doctoral-level physical-therapy training means we build around it intelligently, not ignore it.",
    time: "You said time is tight — efficient, personalized programming squeezes more results out of fewer minutes.",
    consistency: "You've tried before and it didn't stick — a plan built around your real life, with weekly accountability, is what finally makes it last.",
  };
  const PILLARS = [
    { key: "move", label: "Movement" },
    { key: "nutrition", label: "Nutrition" },
    { key: "recovery", label: "Recovery & Sleep" },
    { key: "mind", label: "Mind & Mood" },
    { key: "health", label: "Health Resilience" },
  ];

  /* ---------- Elements ---------- */
  const els = {
    intro: document.getElementById("quizIntro"),
    questions: document.getElementById("quizQuestions"),
    loading: document.getElementById("quizLoading"),
    reportView: document.getElementById("quizReportView"),
    report: document.getElementById("quizReport"),
    q: document.getElementById("quizQ"),
    cat: document.getElementById("quizCat"),
    count: document.getElementById("quizCount"),
    bar: document.getElementById("quizBarFill"),
    back: document.getElementById("quizBack"),
    next: document.getElementById("quizNext"),
    name: document.getElementById("quizName"),
    shell: document.getElementById("quizShell"),
  };
  if (!els.shell) return; // quiz not on page

  /* ---------- State ---------- */
  let idx = 0;
  const answers = {}; // id -> { optionIndexes:[], }
  let name = "";

  const total = QUESTIONS.length;

  /* ---------- View switching ---------- */
  function show(view) {
    [els.intro, els.questions, els.loading, els.reportView].forEach((v) => (v.hidden = true));
    view.hidden = false;
  }

  /* ---------- Render a question ---------- */
  function renderQuestion() {
    const Q = QUESTIONS[idx];
    const isMulti = Q.type === "multi";
    els.cat.textContent = Q.cat;
    els.count.textContent = (idx + 1) + " / " + total;
    els.bar.style.width = ((idx) / total) * 100 + "%";
    els.back.hidden = idx === 0;
    els.next.hidden = !isMulti;

    const sel = answers[Q.id] ? answers[Q.id].sel : [];

    let html = '<h3>' + Q.q + "</h3><div class='quiz-options'>";
    Q.options.forEach((opt, i) => {
      const key = String.fromCharCode(65 + i); // A, B, C…
      const on = sel.indexOf(i) !== -1 ? " selected" : "";
      html += "<button type='button' class='quiz-opt" + (isMulti ? " multi" : "") + on +
        "' data-i='" + i + "'><span class='opt-key'>" + (on ? "✓" : key) +
        "</span><span>" + opt.label + "</span></button>";
    });
    html += "</div>";
    els.q.innerHTML = html;

    els.q.querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.addEventListener("click", () => choose(parseInt(btn.dataset.i, 10)));
    });
  }

  /* ---------- Choose an option ---------- */
  function choose(i) {
    const Q = QUESTIONS[idx];
    const isMulti = Q.type === "multi";
    if (!answers[Q.id]) answers[Q.id] = { sel: [] };
    const sel = answers[Q.id].sel;

    if (isMulti) {
      const opt = Q.options[i];
      if (opt.none) {
        answers[Q.id].sel = [i]; // exclusive
      } else {
        const noneIdx = Q.options.findIndex((o) => o.none);
        const pos = sel.indexOf(i);
        if (pos === -1) sel.push(i); else sel.splice(pos, 1);
        const np = sel.indexOf(noneIdx);
        if (np !== -1) sel.splice(np, 1); // clear "none" when a real option picked
      }
      renderQuestion();
    } else {
      answers[Q.id].sel = [i];
      renderQuestion();
      setTimeout(next, 260);
    }
  }

  function next() {
    const Q = QUESTIONS[idx];
    if (!answers[Q.id] || answers[Q.id].sel.length === 0) return;
    if (idx < total - 1) {
      idx++;
      renderQuestion();
    } else {
      finish();
    }
  }
  function back() {
    if (idx > 0) { idx--; renderQuestion(); }
  }

  /* ---------- Scoring ---------- */
  function compute() {
    const flags = new Set();
    const meta = { goal: null, barrier: null, age: null };
    const pillarSum = {}; const pillarMax = {};
    PILLARS.forEach((p) => { pillarSum[p.key] = 0; pillarMax[p.key] = 0; });

    QUESTIONS.forEach((Q) => {
      const a = answers[Q.id]; if (!a) return;
      a.sel.forEach((i) => {
        const opt = Q.options[i];
        (opt.flags || []).forEach((f) => flags.add(f));
        if (opt.goal) meta.goal = opt.goal;
        if (opt.barrier) meta.barrier = opt.barrier;
        if (opt.age) meta.age = opt.age;
      });
      if (Q.pillar && Q.pillar !== "health" && typeof Q.options[a.sel[0]].s === "number") {
        pillarSum[Q.pillar] += Q.options[a.sel[0]].s;
        pillarMax[Q.pillar] += 3;
      }
    });

    // Health pillar derived from the concerns multi-select
    const conc = answers["concerns"];
    let healthPct = 85;
    if (conc) {
      const picked = conc.sel.map((i) => QUESTIONS.find((q) => q.id === "concerns").options[i]);
      const hasNone = picked.some((o) => o.none);
      const realCount = picked.filter((o) => !o.none).length;
      healthPct = hasNone ? 100 : Math.max(15, 100 - realCount * 18);
    }

    const pillars = PILLARS.map((p) => {
      let pct;
      if (p.key === "health") pct = healthPct;
      else pct = pillarMax[p.key] ? Math.round((pillarSum[p.key] / pillarMax[p.key]) * 100) : 0;
      return { key: p.key, label: p.label, pct: pct };
    });

    const vitality = Math.round(pillars.reduce((s, p) => s + p.pct, 0) / pillars.length);
    return { flags, meta, pillars, vitality };
  }

  /* ---------- Build the report ---------- */
  function buildReport(data) {
    const cap = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
    const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

    // Choose insights
    let keys = PRIORITY.filter((k) => data.flags.has(k));
    if (keys.length < 3) {
      ["no_strength", "sedentary", "low_energy", "high_stress", "weight"].forEach((k) => {
        if (keys.indexOf(k) === -1 && keys.length < 4) keys.push(k);
      });
    }
    keys = keys.slice(0, 6);

    const band =
      data.vitality >= 80 ? "You've built a strong foundation — now it's about optimizing and protecting it for the long haul." :
      data.vitality >= 60 ? "You're doing a lot right, with a few clear, high-impact areas where the right training could level you up fast." :
      data.vitality >= 40 ? "There's enormous untapped potential here — small, structured changes could pay off dramatically." :
      "This is a powerful starting point. The research below shows just how much is possible — and how quickly the change can begin.";

    const goalLine = data.meta.goal ? GOAL_HEADLINE[data.meta.goal] : "here's how the right training could change your life.";
    const headline = (cap ? cap + ", " : "") + goalLine;

    const lowest = data.pillars.reduce((a, b) => (b.pct < a.pct ? b : a));
    const oppText = {
      move: "building consistent, structured movement into your week",
      nutrition: "tightening up a few simple, sustainable nutrition habits",
      recovery: "improving your sleep and recovery so your body can rebuild",
      mind: "using training as a tool for stress, mood, and mental clarity",
      health: "training intelligently around your health markers to get ahead of them",
    }[lowest.key];
    const barrierLine = data.meta.barrier ? BARRIER_LINE[data.meta.barrier] : "";

    let html = "";
    html += "<div class='report-head'>" +
      "<div class='report-brand'>⚡ Olympian Health Solutions</div>" +
      "<div class='report-meta'>" + (cap ? cap + "'s " : "") + "Vitality Report · " + date + "</div></div>";

    html += "<div class='report-score'>" +
      "<div class='score-ring' id='scoreRing' style='--p:0'><span id='scoreNum'>0</span><small>Vitality</small></div>" +
      "<div class='report-score-copy'><h3>" + headline + "</h3><p>" + band + "</p></div></div>";

    html += "<div class='report-pillars'>";
    data.pillars.forEach((p) => {
      html += "<div class='pillar'><span class='pillar-label'>" + p.label + "</span>" +
        "<span class='pillar-bar'><span class='pillar-fill' style='width:0' data-pct='" + p.pct + "'></span></span>" +
        "<span class='pillar-pct'>" + p.pct + "%</span></div>";
    });
    html += "</div>";

    html += "<h4 class='report-sub'>What the research says exercise could do for you</h4>";
    html += "<div class='report-insights'>";
    keys.forEach((k) => {
      const ins = INSIGHTS[k];
      html += "<div class='insight'><div class='insight-tag'>" + ins.tag + "</div>" +
        "<div class='insight-stat'>" + ins.stat + "</div>" +
        "<h5>" + ins.title + "</h5><p>" + ins.body + "</p>" +
        "<div class='insight-src'>" + ins.src + "</div></div>";
    });
    html += "</div>";

    html += "<div class='report-opportunity'><strong>Your biggest opportunity:</strong> " +
      oppText + ". " + barrierLine + "</div>";

    html += "<p class='report-cta-note'>Imagine these benefits compounding over the next 90 days — that's exactly what a personalized plan with Zeuse is built to deliver.</p>";

    html += "<p class='report-disclaimer'>This assessment is educational and research-informed — not medical advice or a diagnosis. The statistics shown reflect population-level findings from peer-reviewed research and major health organizations; individual results vary. Always consult your physician before beginning a new exercise program.</p>";

    els.report.innerHTML = html;

    // Animate score ring + numbers
    requestAnimationFrame(() => {
      const ring = document.getElementById("scoreRing");
      const num = document.getElementById("scoreNum");
      if (ring) ring.style.setProperty("--p", data.vitality);
      animateNum(num, data.vitality, 1400);
      els.report.querySelectorAll(".pillar-fill").forEach((f) => {
        f.style.width = f.dataset.pct + "%";
      });
    });

    // Prefill the contact form's goal to match
    try {
      const map = { weight: "Lose fat", strength: "Build muscle & strength", pain: "Train around pain / injury",
        energy: "Overall health & longevity", longevity: "Senior fitness, balance & independence" };
      const want = map[data.meta.goal];
      const goalSel = document.getElementById("goal");
      if (want && goalSel) {
        Array.from(goalSel.options).forEach((o) => { if (o.text.indexOf(want) !== -1) goalSel.value = o.value; });
      }
    } catch (e) { /* no-op */ }
  }

  function animateNum(el, target, dur) {
    if (!el) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Finish flow ---------- */
  function finish() {
    els.bar.style.width = "100%";
    show(els.loading);
    const data = compute();
    const msgs = ["Analyzing your answers…", "Cross-referencing the research…", "Building your Vitality Report…"];
    let m = 0;
    const lt = document.getElementById("quizLoadingText");
    const interval = setInterval(() => { m++; if (lt && msgs[m]) lt.textContent = msgs[m]; }, 620);
    setTimeout(() => {
      clearInterval(interval);
      buildReport(data);
      show(els.reportView);
      els.shell.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1900);
  }

  /* ---------- Wire up ---------- */
  document.getElementById("quizStart").addEventListener("click", () => {
    name = (els.name.value || "").trim().slice(0, 24);
    idx = 0;
    show(els.questions);
    renderQuestion();
  });
  els.next.addEventListener("click", next);
  els.back.addEventListener("click", back);

  document.getElementById("quizRetake").addEventListener("click", () => {
    Object.keys(answers).forEach((k) => delete answers[k]);
    idx = 0;
    show(els.intro);
  });
  document.getElementById("quizPrint").addEventListener("click", () => window.print());
  document.getElementById("quizBook").addEventListener("click", () => {
    const c = document.getElementById("contact");
    if (c) c.scrollIntoView({ behavior: "smooth" });
  });

  // Keyboard: number keys select options
  document.addEventListener("keydown", (e) => {
    if (els.questions.hidden) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) {
      const btn = els.q.querySelector(".quiz-opt[data-i='" + (n - 1) + "']");
      if (btn) btn.click();
    } else if (e.key === "Enter" && !els.next.hidden) {
      next();
    }
  });
})();
