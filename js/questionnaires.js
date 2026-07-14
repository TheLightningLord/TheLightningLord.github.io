/* ============================================================
   OLYMPIAN HEALTH SOLUTIONS — Questionnaire library
   ------------------------------------------------------------
   Carefully crafted, science-informed client questionnaires.
   The CONTENT lives here (in code) so it can be versioned and
   refined; the client's ANSWERS live in Supabase (form_responses)
   and are autosaved per-answer for a "synchronized" experience.

   These instruments are ORIGINAL questions informed by validated
   frameworks — they are screening/coaching aids, not diagnostic
   tools and not the proprietary instruments themselves:
     • Health screen  → informed by PAR-Q+ (readiness for activity)
     • Goals/readiness → Transtheoretical "Stages of Change" + SMART
                         + self-determination (autonomy/competence)
     • Nutrition       → food-frequency method + hunger/fullness
                         (intuitive-eating) awareness
     • Movement prefs  → exercise-enjoyment (PACES-style) + BREQ-style
                         motivation regulation

   Question types the renderer understands:
     single   – pick one   (options)
     multi    – pick many  (options)   → answer is an array
     scale    – 1..N slider/likert     (scale:{min,max,minLabel,maxLabel})
     grid     – rate several rows on a shared scale/options
                (rows + scale|options) → answer is { rowId: value }
     number   – numeric input          (unit, min, max)
     short    – single-line text
     long     – multi-line text
     info     – no answer; an informational card (used for the
                "brief intro to each type of exercise" section)
   ============================================================ */

export const QUESTIONNAIRES = [

  /* ========================================================
     1. HEALTH & READINESS SCREEN  (PAR-Q+ informed)
     ======================================================== */
  {
    key: "readiness",
    title: "Health & Readiness Screen",
    icon: "🩺",
    category: "goals",
    estMinutes: 4,
    selfServe: true,
    tagline: "A quick safety check before we load you up.",
    intro:
      "This mirrors the questions every good trainer asks on day one. It keeps your program safe and tells me where to be careful. If anything here is a 'yes', it doesn't mean you can't train — it means we train smart. Nothing here is medical advice; if in doubt, check with your doctor.",
    sections: [
      {
        title: "The basics",
        questions: [
          { id: "age", type: "number", label: "Your age", unit: "years", min: 12, max: 100, required: true },
          {
            id: "activity_now",
            type: "single",
            label: "How active are you right now, honestly?",
            required: true,
            options: [
              { value: "sedentary", label: "Mostly sedentary", desc: "Little planned exercise most weeks" },
              { value: "light", label: "Lightly active", desc: "A walk or session here and there" },
              { value: "moderate", label: "Moderately active", desc: "2–3 real sessions most weeks" },
              { value: "high", label: "Very active", desc: "4+ structured sessions a week" },
            ],
          },
        ],
      },
      {
        title: "Heart, breathing & dizziness",
        help: "Answer yes if a doctor has ever told you this, or if you've experienced it.",
        questions: [
          {
            id: "flags_cardio",
            type: "multi",
            label: "Do any of these apply to you?",
            help: "Tick everything that's true. Leave blank if none.",
            options: [
              { value: "heart", label: "Heart condition", desc: "Or a doctor said to only exercise under supervision" },
              { value: "chest_pain", label: "Chest pain with activity", desc: "During physical effort or exertion" },
              { value: "chest_pain_rest", label: "Chest pain at rest", desc: "In the last month, while not exerting" },
              { value: "dizzy", label: "Dizziness / loss of balance", desc: "Or have lost consciousness" },
              { value: "bp", label: "High or uncontrolled blood pressure" },
              { value: "none_cardio", label: "None of these apply to me" },
            ],
          },
        ],
      },
      {
        title: "Joints, injuries & conditions",
        questions: [
          {
            id: "flags_msk",
            type: "multi",
            label: "Any of these on the joint / injury side?",
            options: [
              { value: "joint", label: "Bone or joint problem", desc: "Back, knee, shoulder, hip — made worse by activity" },
              { value: "recent_injury", label: "An injury in the last 6 months", desc: "That still limits you" },
              { value: "surgery", label: "Surgery in the last 12 months" },
              { value: "pregnant", label: "Pregnant or recently postpartum" },
              { value: "chronic", label: "A chronic condition", desc: "Diabetes, asthma, arthritis, thyroid, etc." },
              { value: "none_msk", label: "None of these apply to me" },
            ],
          },
          {
            id: "injury_detail",
            type: "long",
            label: "If you ticked anything above, tell me about it.",
            help: "Where, how bad, what makes it worse or better. The more detail, the safer your program.",
            placeholder: "e.g. Left knee aches on deep squats since a run injury in March…",
          },
          {
            id: "meds",
            type: "long",
            label: "Any medications or supplements I should know about?",
            help: "Especially anything affecting heart rate, blood pressure, blood sugar, or balance. Optional.",
            placeholder: "Optional — list anything relevant, or write 'none'.",
          },
        ],
      },
      {
        title: "Clearance",
        questions: [
          {
            id: "doctor_cleared",
            type: "single",
            label: "Has a doctor ever told you NOT to exercise, or only under supervision?",
            required: true,
            options: [
              { value: "no", label: "No — I've been cleared / never told to stop" },
              { value: "yes", label: "Yes — there are restrictions" },
              { value: "unsure", label: "I'm not sure" },
            ],
          },
        ],
      },
    ],
  },

  /* ========================================================
     2. GOALS, MOTIVATION & READINESS  (Stages of Change + SMART)
     ======================================================== */
  {
    key: "goals",
    title: "Goals, Motivation & Readiness",
    icon: "🎯",
    category: "goals",
    estMinutes: 8,
    selfServe: true,
    tagline: "What you want, why it matters, and how ready you are.",
    intro:
      "The clients who win are the ones with a clear 'why' and a realistic runway. This uses the same model sport psychologists use for behavior change — your 'stage of change' — plus the SMART goal framework, so we build a plan you'll actually stick to.",
    sections: [
      {
        title: "Your headline goal",
        questions: [
          {
            id: "primary_goal",
            type: "single",
            label: "If we nail ONE thing in the next few months, what is it?",
            required: true,
            options: [
              { value: "strength", label: "Get noticeably stronger" },
              { value: "muscle", label: "Build muscle / change my shape" },
              { value: "fatloss", label: "Lose fat & lean out" },
              { value: "health", label: "Improve my health markers", desc: "Blood pressure, blood sugar, energy" },
              { value: "mobility", label: "Move better / get out of pain" },
              { value: "performance", label: "Perform in a sport or event" },
              { value: "longevity", label: "Stay strong & independent as I age" },
            ],
          },
          {
            id: "goal_specific",
            type: "long",
            label: "Now make it specific and measurable.",
            help: "A vague goal is a wish. What exactly, by roughly when, and how will we KNOW you hit it?",
            placeholder: "e.g. Deadlift my bodyweight for 5 reps by October, and climb the stairs at work without getting winded.",
            required: true,
          },
          {
            id: "goal_why",
            type: "long",
            label: "Why does this matter to you — really?",
            help: "Dig past the surface. 'To be around and active for my kids' beats 'to look good' when motivation dips.",
            placeholder: "The deeper reason under the goal…",
            required: true,
          },
        ],
      },
      {
        title: "Where you're starting from",
        questions: [
          {
            id: "stage",
            type: "single",
            label: "Which of these sounds most like you right now?",
            help: "There's no wrong answer — this just tells me how to coach you.",
            required: true,
            options: [
              { value: "precontemplation", label: "I'm here but not sure I'll really change", desc: "Testing the waters" },
              { value: "contemplation", label: "I want to change, but I keep putting it off", desc: "Ready-ish, not started" },
              { value: "preparation", label: "I'm ready and about to start", desc: "Getting set up now" },
              { value: "action", label: "I've recently started making changes", desc: "Under 6 months in" },
              { value: "maintenance", label: "I've been consistent for a while", desc: "6+ months — keeping it going" },
            ],
          },
          {
            id: "confidence",
            type: "scale",
            label: "How confident are you that you'll follow through?",
            scale: { min: 1, max: 10, minLabel: "Not confident", maxLabel: "Totally confident" },
            required: true,
          },
          {
            id: "importance",
            type: "scale",
            label: "How important is reaching this goal to you?",
            scale: { min: 1, max: 10, minLabel: "Nice to have", maxLabel: "Non-negotiable" },
            required: true,
          },
        ],
      },
      {
        title: "What drives you",
        help: "Be honest — the mix of reasons matters more than the 'right' answer.",
        questions: [
          {
            id: "motivation",
            type: "grid",
            label: "How true is each of these for you?",
            scale: { min: 1, max: 5, minLabel: "Not me", maxLabel: "Very me" },
            rows: [
              { id: "enjoy", label: "I train because I genuinely enjoy it" },
              { id: "value", label: "I train because it's important to who I want to be" },
              { id: "guilt", label: "I train mostly because I'd feel guilty if I didn't" },
              { id: "others", label: "I train because others expect it of me" },
              { id: "results", label: "I train for a specific result (look, number, event)" },
            ],
          },
        ],
      },
      {
        title: "Life & logistics",
        questions: [
          {
            id: "days_available",
            type: "single",
            label: "Realistically, how many days a week can you train?",
            required: true,
            options: [
              { value: "1-2", label: "1–2 days" },
              { value: "3", label: "3 days" },
              { value: "4", label: "4 days" },
              { value: "5+", label: "5+ days" },
            ],
          },
          {
            id: "session_length",
            type: "single",
            label: "How long is a realistic session for you?",
            options: [
              { value: "20", label: "~20 minutes" },
              { value: "30-45", label: "30–45 minutes" },
              { value: "60", label: "About an hour" },
              { value: "60+", label: "60+ minutes" },
            ],
          },
          {
            id: "barriers",
            type: "multi",
            label: "What's most likely to get in the way?",
            help: "Naming the obstacle is the first step to planning around it.",
            options: [
              { value: "time", label: "Time / busy schedule" },
              { value: "energy", label: "Energy & fatigue" },
              { value: "motivation", label: "Staying motivated" },
              { value: "knowledge", label: "Not knowing what to do" },
              { value: "pain", label: "Pain or old injuries" },
              { value: "consistency", label: "Consistency / falling off" },
              { value: "travel", label: "Travel / unpredictable weeks" },
              { value: "confidence", label: "Feeling self-conscious in the gym" },
            ],
          },
          {
            id: "past_experience",
            type: "long",
            label: "What's worked (or flopped) for you before?",
            help: "Knowing your history saves us from repeating what didn't stick.",
            placeholder: "e.g. Loved lifting for a year until an injury; group classes never held my attention…",
          },
        ],
      },
    ],
  },

  /* ========================================================
     3. NUTRITION INTAKE & HABITS  (food-frequency + awareness)
     ======================================================== */
  {
    key: "nutrition",
    title: "Nutrition Intake & Habits",
    icon: "🥗",
    category: "nutrition",
    estMinutes: 12,
    selfServe: true,
    tagline: "The honest picture of how you eat — no judgment, just a baseline.",
    intro:
      "Nutrition drives most of the results people want, yet it's the part most programs hand-wave. This is a structured intake built the way registered dietitians build one: a food-frequency snapshot, your real-world patterns, and how in-tune you are with hunger and fullness. Answer for a TYPICAL week, not your best or worst one. Total honesty here is worth more than a perfect-looking answer.",
    sections: [
      {
        title: "Starting point",
        questions: [
          {
            id: "self_rating",
            type: "scale",
            label: "How would you rate your nutrition right now?",
            scale: { min: 1, max: 10, minLabel: "A mess", maxLabel: "Dialed in" },
            required: true,
          },
          {
            id: "goal_link",
            type: "single",
            label: "What do you want nutrition to do for you?",
            required: true,
            options: [
              { value: "fatloss", label: "Lose fat" },
              { value: "muscle", label: "Build muscle / fuel training" },
              { value: "energy", label: "More steady energy" },
              { value: "health", label: "Improve health markers" },
              { value: "performance", label: "Perform better in training/sport" },
              { value: "relationship", label: "A healthier relationship with food" },
            ],
          },
          {
            id: "diet_style",
            type: "single",
            label: "Do you follow any particular way of eating?",
            options: [
              { value: "none", label: "Nothing specific" },
              { value: "vegetarian", label: "Vegetarian" },
              { value: "vegan", label: "Vegan" },
              { value: "pescatarian", label: "Pescatarian" },
              { value: "lowcarb", label: "Low-carb / keto" },
              { value: "mediterranean", label: "Mediterranean-ish" },
              { value: "religious", label: "Religious / cultural pattern" },
              { value: "other", label: "Other" },
            ],
          },
          {
            id: "restrictions",
            type: "long",
            label: "Any allergies, intolerances, or foods that are off the table?",
            help: "Medical, ethical, or just 'I will never eat that'. All count.",
            placeholder: "e.g. Lactose intolerant, allergic to shellfish, hate cilantro…",
          },
        ],
      },
      {
        title: "Food-frequency snapshot",
        help: "In a typical week, how often do you eat each of these? Go with your gut — precision isn't the point, the pattern is.",
        questions: [
          {
            id: "freq",
            type: "grid",
            label: "How often do you eat…",
            options: [
              { value: "never", label: "Never" },
              { value: "rarely", label: "Rarely" },
              { value: "weekly", label: "1–2×/wk" },
              { value: "most", label: "Most days" },
              { value: "daily", label: "Daily+" },
            ],
            rows: [
              { id: "veg", label: "Vegetables", desc: "Any non-starchy veg" },
              { id: "fruit", label: "Fruit" },
              { id: "protein", label: "A clear protein source", desc: "Meat, fish, eggs, dairy, beans, tofu" },
              { id: "wholegrain", label: "Whole grains", desc: "Oats, brown rice, whole-wheat" },
              { id: "fastfood", label: "Fast food / takeout" },
              { id: "sugary", label: "Sugary snacks or desserts" },
              { id: "soda", label: "Soda / sugary drinks" },
              { id: "friedsalty", label: "Fried or salty snacks", desc: "Chips, fries" },
              { id: "alcohol", label: "Alcohol" },
            ],
          },
        ],
      },
      {
        title: "Your daily pattern",
        questions: [
          {
            id: "meals_per_day",
            type: "single",
            label: "How many times a day do you usually eat?",
            help: "Count meals and real snacks.",
            required: true,
            options: [
              { value: "1", label: "Once" },
              { value: "2", label: "Twice" },
              { value: "3", label: "3 times" },
              { value: "4-5", label: "4–5 times" },
              { value: "grazing", label: "I graze all day" },
            ],
          },
          {
            id: "breakfast",
            type: "single",
            label: "Do you eat breakfast?",
            options: [
              { value: "always", label: "Almost always" },
              { value: "sometimes", label: "Sometimes" },
              { value: "rarely", label: "Rarely / skip it" },
            ],
          },
          {
            id: "cooking",
            type: "single",
            label: "How often do you cook at home vs eat out?",
            options: [
              { value: "mostly_home", label: "Mostly cook at home" },
              { value: "mix", label: "A mix of both" },
              { value: "mostly_out", label: "Mostly eat out / takeout" },
            ],
          },
          {
            id: "water",
            type: "single",
            label: "Roughly how much water do you drink a day?",
            options: [
              { value: "low", label: "Less than 4 cups" },
              { value: "mid", label: "4–8 cups" },
              { value: "high", label: "8+ cups" },
              { value: "unsure", label: "Honestly no idea" },
            ],
          },
          {
            id: "protein_aware",
            type: "single",
            label: "Do you get protein at most meals?",
            help: "Protein is the single most useful lever for body composition — so I always check.",
            options: [
              { value: "yes", label: "Yes, most meals have protein" },
              { value: "some", label: "Some meals do" },
              { value: "no", label: "Rarely think about it" },
            ],
          },
        ],
      },
      {
        title: "Hunger, fullness & triggers",
        help: "This is about awareness, not willpower. Rate how true each feels lately.",
        questions: [
          {
            id: "awareness",
            type: "grid",
            label: "How true is each of these?",
            scale: { min: 1, max: 5, minLabel: "Not true", maxLabel: "Very true" },
            rows: [
              { id: "hunger_cues", label: "I can tell real hunger from boredom or stress" },
              { id: "stop_full", label: "I stop eating when I'm comfortably full" },
              { id: "emotional", label: "I eat when I'm stressed, bored, or emotional" },
              { id: "fast_eat", label: "I tend to eat quickly / on the go" },
              { id: "night", label: "Most of my snacking happens at night" },
              { id: "guilt", label: "I feel guilt or 'all-or-nothing' about food" },
            ],
          },
          {
            id: "cravings",
            type: "multi",
            label: "When cravings hit, what are they usually?",
            options: [
              { value: "sweet", label: "Sweet" },
              { value: "salty", label: "Salty / crunchy" },
              { value: "carby", label: "Bread / pasta / carbs" },
              { value: "fatty", label: "Rich / fatty foods" },
              { value: "caffeine", label: "Caffeine" },
              { value: "none", label: "I don't get strong cravings" },
            ],
          },
        ],
      },
      {
        title: "Sleep, stress & the real picture",
        questions: [
          {
            id: "sleep",
            type: "single",
            label: "How's your sleep on a normal week?",
            help: "Sleep quietly runs your appetite hormones — it belongs in a nutrition check.",
            options: [
              { value: "good", label: "Solid — 7+ hours, wake up rested" },
              { value: "ok", label: "Okay — 6–7 hours, a bit patchy" },
              { value: "poor", label: "Rough — under 6 hours or broken sleep" },
            ],
          },
          {
            id: "stress",
            type: "scale",
            label: "How stressed do you feel on a typical week?",
            scale: { min: 1, max: 10, minLabel: "Very calm", maxLabel: "Maxed out" },
          },
          {
            id: "biggest_obstacle",
            type: "long",
            label: "What's the single biggest thing standing between you and eating the way you'd like?",
            required: true,
            placeholder: "Be specific — this is usually where we get the fastest win.",
          },
          {
            id: "typical_day",
            type: "long",
            label: "Walk me through a typical day of eating.",
            help: "Morning to night, meals and snacks and drinks. Don't clean it up for me — the real version is the useful one.",
            placeholder: "Breakfast: … / Lunch: … / Dinner: … / Snacks & drinks: …",
            required: true,
          },
        ],
      },
    ],
  },

  /* ========================================================
     4. MOVEMENT PREFERENCES & EXERCISE DISCOVERY
        (for people unsure what they'll enjoy)
        Enjoyment (PACES-style) + brief intros to each modality
     ======================================================== */
  {
    key: "workout-prefs",
    title: "Movement Preferences & Discovery",
    icon: "🧭",
    category: "training",
    estMinutes: 10,
    selfServe: true,
    tagline: "Not sure what kind of training you'll love? Let's find out.",
    intro:
      "The best workout is the one you'll actually look forward to. This walks you through the main styles of training — with a quick, honest intro to each — and asks what sparks your interest. There are no wrong answers. Even 'that sounds awful' is gold: it tells me what to avoid so you stay consistent.",
    sections: [
      {
        title: "Your history with movement",
        questions: [
          {
            id: "sports_played",
            type: "multi",
            label: "Which sports or activities have you spent real time on?",
            help: "Ever — school, casual, competitive. This tells me what your body already knows.",
            options: [
              { value: "team", label: "Team sports", desc: "Soccer, basketball, football, volleyball…" },
              { value: "racket", label: "Racket sports", desc: "Tennis, pickleball, badminton, squash" },
              { value: "endurance", label: "Running / cycling / endurance" },
              { value: "swimming", label: "Swimming / water sports" },
              { value: "combat", label: "Martial arts / boxing / wrestling" },
              { value: "lifting", label: "Weight lifting / gym" },
              { value: "yoga", label: "Yoga / pilates / dance" },
              { value: "outdoors", label: "Hiking / climbing / outdoor" },
              { value: "gymnastics", label: "Gymnastics / cheer / calisthenics" },
              { value: "none", label: "Honestly, not much" },
            ],
          },
          {
            id: "best_sport_memory",
            type: "long",
            label: "Think of a time you enjoyed being active. What was it, and what made it fun?",
            help: "Competition? Being outside? A team? Learning a skill? The 'why' is what we'll recreate.",
            placeholder: "e.g. Pickup basketball on Fridays — loved the competition and the crew…",
          },
          {
            id: "current_fitness",
            type: "single",
            label: "Where would you put your current fitness?",
            required: true,
            options: [
              { value: "beginner", label: "Starting out / starting over" },
              { value: "returning", label: "Coming back after a break" },
              { value: "intermediate", label: "Reasonably fit, train sometimes" },
              { value: "advanced", label: "Fit and experienced" },
            ],
          },
        ],
      },
      {
        title: "The styles of training — a quick tour",
        help: "Here's the honest version of each. As you read, rate how much each one appeals to you right now. Gut reaction is fine.",
        questions: [
          {
            id: "intro_strength",
            type: "info",
            icon: "🏋️",
            label: "Strength training",
            body:
              "Lifting challenging weights for lower reps to get strong. Think barbells, dumbbells, and the big movements — squats, presses, deadlifts. Very few things change your body and confidence faster. Slower-paced and focused, not sweaty-chaos.",
          },
          {
            id: "interest_strength",
            type: "scale",
            label: "How much does strength training appeal to you?",
            scale: { min: 1, max: 5, minLabel: "Not for me", maxLabel: "Love the idea" },
          },
          {
            id: "intro_hypertrophy",
            type: "info",
            icon: "💪",
            label: "Muscle-building (bodybuilding style)",
            body:
              "Moderate weights, more reps, chasing the 'pump' and building muscle shape. More variety of machines and exercises, a bit more of a burn. Great if you care about how your body looks and feels.",
          },
          {
            id: "interest_hypertrophy",
            type: "scale",
            label: "How much does muscle-building appeal to you?",
            scale: { min: 1, max: 5, minLabel: "Not for me", maxLabel: "Love the idea" },
          },
          {
            id: "intro_hiit",
            type: "info",
            icon: "🔥",
            label: "HIIT / conditioning",
            body:
              "Short, intense bursts — circuits, intervals, kettlebells, sled pushes. Gets your heart pounding and torches calories in a hurry. Fun if you like intensity and being done fast; brutal if you don't.",
          },
          {
            id: "interest_hiit",
            type: "scale",
            label: "How much does HIIT / conditioning appeal to you?",
            scale: { min: 1, max: 5, minLabel: "Not for me", maxLabel: "Love the idea" },
          },
          {
            id: "intro_cardio",
            type: "info",
            icon: "🏃",
            label: "Endurance / cardio",
            body:
              "Steady running, cycling, rowing, brisk walking — building a heart and lungs that don't quit. Meditative for some, boring for others. Unbeatable for health markers and stamina.",
          },
          {
            id: "interest_cardio",
            type: "scale",
            label: "How much does endurance / cardio appeal to you?",
            scale: { min: 1, max: 5, minLabel: "Not for me", maxLabel: "Love the idea" },
          },
          {
            id: "intro_mobility",
            type: "info",
            icon: "🧘",
            label: "Mobility, yoga & flow",
            body:
              "Slower, controlled movement to feel loose, balanced, and pain-free. Stretching, yoga, controlled bodyweight flows. The 'oil change' for your body — quietly one of the most valuable things you can do, especially as you age.",
          },
          {
            id: "interest_mobility",
            type: "scale",
            label: "How much does mobility / yoga appeal to you?",
            scale: { min: 1, max: 5, minLabel: "Not for me", maxLabel: "Love the idea" },
          },
          {
            id: "intro_calisthenics",
            type: "info",
            icon: "🤸",
            label: "Calisthenics / bodyweight",
            body:
              "Mastering your own bodyweight — push-ups, pull-ups, and skills that look impressive and build real control. Minimal equipment, do-it-anywhere, and genuinely fun to progress toward a first pull-up or handstand.",
          },
          {
            id: "interest_calisthenics",
            type: "scale",
            label: "How much does calisthenics appeal to you?",
            scale: { min: 1, max: 5, minLabel: "Not for me", maxLabel: "Love the idea" },
          },
          {
            id: "intro_sport",
            type: "info",
            icon: "⚽",
            label: "Sport & play",
            body:
              "Training that feels like a game — agility, athletic drills, or prepping for a sport or event. Barely feels like 'working out.' Perfect if you're motivated by competition or a goal on the calendar.",
          },
          {
            id: "interest_sport",
            type: "scale",
            label: "How much does sport / athletic training appeal to you?",
            scale: { min: 1, max: 5, minLabel: "Not for me", maxLabel: "Love the idea" },
          },
        ],
      },
      {
        title: "How you like to train",
        questions: [
          {
            id: "enjoyment",
            type: "grid",
            label: "When you picture a workout you'd actually enjoy, how true is each?",
            scale: { min: 1, max: 5, minLabel: "Not me", maxLabel: "So me" },
            rows: [
              { id: "alone", label: "I'd rather train alone / with just my coach" },
              { id: "social", label: "I'm more motivated with other people around" },
              { id: "outdoors", label: "I love being outdoors when I move" },
              { id: "structure", label: "I want a clear plan told to me — no guessing" },
              { id: "variety", label: "I get bored doing the same thing twice" },
              { id: "intensity", label: "I want to feel wrecked (in a good way) after" },
              { id: "skill", label: "I love learning and mastering a skill" },
              { id: "compete", label: "A little competition brings out my best" },
            ],
          },
          {
            id: "environment",
            type: "single",
            label: "Where would you most like to train?",
            options: [
              { value: "gym", label: "A gym with real equipment" },
              { value: "home", label: "At home / minimal equipment" },
              { value: "outdoors", label: "Outdoors / parks / trails" },
              { value: "mix", label: "A mix — keep it varied" },
              { value: "unsure", label: "Not sure — you tell me" },
            ],
          },
          {
            id: "music_vibe",
            type: "single",
            label: "What kind of session energy fits you?",
            options: [
              { value: "hype", label: "Loud, high-energy, push me" },
              { value: "focused", label: "Calm and focused" },
              { value: "fun", label: "Light and fun, lots of chat" },
              { value: "varies", label: "Depends on the day" },
            ],
          },
          {
            id: "dealbreakers",
            type: "long",
            label: "Anything you already KNOW you hate or want to avoid?",
            help: "Running? Burpees? Crowded gyms? 6am starts? Telling me now keeps you consistent later.",
            placeholder: "e.g. I will not run. Mornings are impossible. Hate feeling watched…",
          },
        ],
      },
    ],
  },
];

/* ---------- Lookup + counting helpers ---------- */

export function getQuestionnaire(key) {
  return QUESTIONNAIRES.find((q) => q.key === key) || null;
}

export function listByCategory(category) {
  return QUESTIONNAIRES.filter((q) => q.category === category);
}

/* Every question that expects an answer (info blocks don't count). */
export function answerableQuestions(form) {
  const out = [];
  (form.sections || []).forEach((s) =>
    (s.questions || []).forEach((q) => { if (q.type !== "info") out.push(q); })
  );
  return out;
}

/* Is a single answer "filled"? Handles arrays (multi) and grids (objects). */
export function isAnswered(value) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

/* 0..1 completion of a form given an answers object. */
export function completionRatio(form, answers = {}) {
  const qs = answerableQuestions(form);
  if (!qs.length) return 0;
  const done = qs.filter((q) => isAnswered(answers[q.id])).length;
  return done / qs.length;
}

/* Are all REQUIRED questions answered? */
export function requiredComplete(form, answers = {}) {
  return answerableQuestions(form)
    .filter((q) => q.required)
    .every((q) => isAnswered(answers[q.id]));
}
