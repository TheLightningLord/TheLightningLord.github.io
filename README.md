# ⚡ Olympian Health Solutions

Personal training website for **Zeuse Valentine** — built as a pure static site (HTML/CSS/JS, no build step) so it deploys to GitHub Pages with zero configuration. Domain: **olympiansolutions.org**.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `OHSite` — or name it `<username>.github.io` to get the root URL).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "Launch Olympian Health Solutions site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Make the lead form work (important — this is your money-maker)

GitHub Pages can't process forms by itself, so the contact form uses **Formspree** (free tier: 50 submissions/month):

1. Sign up free at [formspree.io](https://formspree.io) and create a new form.
2. Copy your form ID (looks like `xkndqyzw`).
3. In `index.html`, find this line and replace `YOUR_FORM_ID`:
   ```html
   <form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" id="leadForm">
   ```
4. Every consultation request now lands in your email inbox.

Alternative: if you use Calendly, you can replace the form with a Calendly embed so people book straight onto your calendar.

## Personalize it

- **Your photo** — drop a portrait at `img/zeuse.jpg` and in `index.html` replace the `.portrait-placeholder` div with `<img src="img/zeuse.jpg" alt="Zeuse Valentine">`. A 4:5 portrait (e.g. 1000×1250px) looks best in the arched frame.
- **Social links** — in the contact section, replace the `#` hrefs on the Instagram / TikTok / YouTube pills with your real profile URLs. These matter: your business cards and social posts should all point here, and visitors will want to verify you're real.
- **Pricing** — the tiers ($199 / $349 / $90 per session) are starting suggestions. Edit them in the `#pricing` section.
- **Testimonials** — the three quotes in the `#results` section are placeholders. Swap in real client quotes as soon as you have them (real names + photos convert dramatically better).
- **Stats** — the numbers in the stats band (`data-target` attributes) are editable in `index.html`.

## SEO — making "Zeuse Valentine" surface this site

The site ships with advanced **on-page SEO** already wired in. Here's what's done, what you must finish, and the off-site work that actually earns a Google Knowledge Panel.

### ✅ Already built in
- **Rich structured data (JSON-LD)** at the bottom of `index.html`: a `Person` entity for Zeuse Valentine (job title, both universities as `alumniOf`, degrees as credentials, `knowsAbout` skills, `areaServed`), a `LocalBusiness` for Olympian Health Solutions (services, three priced `Offer`s, geo, area served), a `WebSite` entity, and a `FAQPage` mirroring your visible FAQ. The FAQ markup can win **expandable FAQ snippets** directly in Google results.
- **Full meta stack**: SEO title leading with your name, a front-loaded 150-char description, keywords, canonical URL, robots directives, **geo tags** (Battle Ground / Clark County, WA), **Open Graph** (Facebook/LinkedIn/iMessage previews) and **Twitter cards**.
- **`sitemap.xml`**, **`robots.txt`** (also explicitly allows AI answer engines like GPTBot/PerplexityBot/ClaudeBot so you show up in AI answers), **`site.webmanifest`**, a branded **`404.html`**, and a **`CNAME`** set to `olympiansolutions.org`.
- **`rel="me"`** on the social links — a signal that ties those profiles to your identity.

### 🔧 You must finish these (high impact)
1. **Fill in every `sameAs` and `rel="me"` link.** Search `REPLACE_WITH_YOUR_HANDLE` in `index.html` (in the JSON-LD) and the `href="#"` on the social pills. **This is the single biggest lever for a Knowledge Panel** — Google builds your entity by confirming the same person across Instagram, TikTok, YouTube, LinkedIn, Facebook, etc. List every profile you own.
2. **Add the images the meta tags reference** (currently they 404, so link previews won't show an image): create `img/og-cover.jpg` (1200×630, your photo + logo + name — this is what shows when the link is shared), `img/zeuse.jpg` (your portrait), `img/apple-touch-icon.png` (180×180), and `img/icon-192.png` / `img/icon-512.png`.
3. **Point the domain.** At your registrar, add GitHub Pages DNS: four `A` records for the apex (`185.199.108–111.153`) and a `CNAME` for `www` → `<username>.github.io`. Then in repo **Settings → Pages**, set the custom domain to `olympiansolutions.org` and enable **Enforce HTTPS**.

### 🚀 Off-site work that earns the "incredible amount of info" (do these after launch)
On-page SEO makes you *eligible* for rich results — but a full Knowledge Panel and dominating a name search come from **off-site entity signals**:
- **Create a free [Google Business Profile](https://business.google.com)** for Olympian Health Solutions (service-area business, Clark County WA). This alone often produces a map panel and is the fastest win for local + name searches.
- **Submit the site to [Google Search Console](https://search.google.com/search-console)** and **[Bing Webmaster Tools](https://www.bing.com/webmasters)**, then submit `sitemap.xml`. This gets you indexed in days, not weeks.
- **Keep your name + business identical everywhere** (Instagram, TikTok, YouTube, LinkedIn, Yelp, Apple Maps). Consistency is how Google merges them into one entity.
- **Create a [Wikidata](https://www.wikidata.org) item** for yourself once you have a few citations — Wikidata directly feeds Google's Knowledge Graph.
- **Earn a few backlinks/mentions**: your university programs, local gyms, podcasts, press, or directories linking to `olympiansolutions.org` build authority fast.
- **Validate your markup** at [search.google.com/test/rich-results](https://search.google.com/test/rich-results) and preview link cards at [opengraph.xyz](https://www.opengraph.xyz) after you add the OG image.

> Honest expectation: with the steps above, you'll rank #1 for "Zeuse Valentine" + "Olympian Health Solutions" and likely earn FAQ-rich snippets and a Business Profile panel within a few weeks. A full celebrity-style Knowledge Panel depends on sustained external coverage — the scaffolding here makes you fully eligible for it.

## Your real details (live as of v4)

These are now wired into the site:
- **Positioning (v7 — global rebrand):** **global personal training** is the lead — train live from anywhere in the world, **in your own language via real-time translation**, with a **free FitPack shipped nationwide**. **Portable in-home sessions across Clark County, WA** stay featured as the local in-person track (based in Battle Ground, no travel fee). Zeuse remains the solo face of the brand. *Note: per brand direction, the site never uses the phrase "AI-powered" — real-time translation is presented as a benefit ("train in your language"), and it's the only AI feature surfaced.*
- **Pricing:** *Global online (monthly):* **Essentials $99 / Pro $199 / Elite $349** per month, free FitPack with every plan, cancel anytime. *Clark County in-home (per session):* Senior Strength **$40 / 25-min** · 1-on-1 Portable **$90 / 60-min** · Session Packs (save on 8+). Edit all of these in the `#pricing` section of `index.html`.
- **Booking:** your live **Calendly** (`calendly.com/zeustrength/30min`) is embedded in the contact section.
- **Email:** `OHS@OlympianSolutions.org` is wired into the contact buttons, footer, and structured data.
- **Your story** is now the heart of the About section (90 lbs → 70 lbs of muscle, the shoulder injury, ProActive, caring for your grandpa, your "why").

**Still placeholder — send me these and I'll drop them in:**
- **Phone number** (for the "Call or text" button — currently a placeholder)
- **Instagram / social URLs** (for the DM button, social pills, and the `sameAs` SEO links)
- **Your photos** (`img/zeuse.jpg`, before/after shots, `img/og-cover.jpg`)
- **Formspree form ID** (so the written contact form delivers to your inbox — the Calendly handles bookings either way)

## Research-backed articles (v6)

All four blog articles are now written with **inline citations** to real, landmark peer-reviewed research, plus a formatted **References** list and `citation` metadata in each article's structured data (great for the "research" brand and for SEO). Sources include Cochrane reviews, JAMA, The Lancet, BJSM, NEJM, ACSM position stands, and WHO guidelines.

> ⚠️ **Verify before you publish.** These citations were drafted without live database access, so confirm each one on [PubMed](https://pubmed.ncbi.nlm.nih.gov) or Google Scholar (author, title, journal, year are all searchable) and add exact volume/page/DOI if you want full formal citations. Research is your brand's cornerstone — a quick fact-check protects it. Each claim is tied to a specific reference number so verification is fast.

## Author brand & content hub (v5)

You're now positioned as a **coach *and* author** — a major authority and sales boost.

- **Books / Author section** (`#books`) showcases four books with CSS-rendered covers (no image files needed): **Strong for Life** (free lead-magnet guide), plus three "Coming Soon" titles matching your topics — **The Ageless Body** (senior fitness/healthy aging), **Back to Strong** (injury recovery/post-PT), and **The 20-Minute Body** (busy-schedule fitness). Edit titles/blurbs in `index.html`; swap a CSS cover for real cover art later by dropping an `<img>` into the `.book-cover`.
- **Email-capture / waitlist** under the books — captures emails for the free guide + book launches (the #1 way to recover not-ready-yet leads). **To make it collect emails:** create a free [Mailchimp](https://mailchimp.com) or [ConvertKit](https://kit.com) form (better for a real mailing list), or a [Formspree](https://formspree.io) form, and replace `YOUR_LIST_ID` in the `#book-signup` form action. Right up until then it shows a friendly "connect your list" nudge.
- **Blog content hub** at **`blog/index.html`** ("The Olympian Journal") — organizes every article into SEO topic clusters: *Senior Fitness & Healthy Aging, Injury Recovery & Post-PT, Training Around a Busy Life, Understanding Pain*. This pillar/cluster structure is exactly what Google rewards. Linked from the homepage ("Browse All Articles") and the footer.
- **New article:** *The 20-Minute Workout for Busy People* (`blog/20-minute-workout-busy-schedule.html`), covering the busy-schedule topic and feeding *The 20-Minute Body* book.
- **SEO:** your `Person` schema now lists **Author** as an occupation; the free guide has **`Book`** structured data; the blog hub carries **`Blog`** + **`BreadcrumbList`** schema. Each book topic ↔ blog category ↔ article reinforces the next.

> **Adding a new article:** copy any file in `blog/`, write your content, then (1) add a card in the matching category on `blog/index.html`, (2) optionally feature it on the homepage `#blog` section, and (3) add a `<url>` to `sitemap.xml`. Bump the `?v=` number on the CSS/JS links when you change shared files.

## Brand & sales features

The site is positioned around your niche: **the science-based coach for pain, senior fitness, and post-physical-therapy ("rehab → strong") training.**

- **"Bridge: From Rehab to Strong"** section (`#bridge`) — your signature post-PT program, the differentiator most trainers can't offer.
- **Intro video** section (`#video`) — polished placeholder. **To add your video:** in `index.html`, find the `videoPlay` button and set `data-embed="https://www.youtube.com/embed/YOUR_VIDEO_ID"` (or your Vimeo embed URL). It loads on click.
- **Booking hub** in the contact section — three ways to start (you chose all three):
  - **Book a time** → scrolls to a **Calendly embed** placeholder. Create a free event at [calendly.com](https://calendly.com), then replace the `.schedule-placeholder` block (instructions are in the HTML comment right above it) with your Calendly inline-widget snippet.
  - **Call or text** → replace the placeholder number in the `tel:+15035550100` link with your real number.
  - **DM me** → replace the `#` href and `@olympianhealth` text with your Instagram.
- **Blog / Insights hub** (`#blog`) with **three full SEO-optimized articles** in `blog/` (post-PT training, strength after 60, exercise for chronic pain). Each is research-informed, carries a medical disclaimer, has `Article` structured data, and funnels to a free consult. Add more by copying any file in `blog/` and linking a new card in the `#blog` section + a `<url>` in `sitemap.xml`.
- **"My Method"** 3-step block in the About section reinforces the clinical, assessment-first approach.

> ⚠️ **Fill-in checklist** (search `TODO` in `index.html`): phone number, Instagram/social URLs, Calendly link, intro-video link, and your real photos in `img/`. Everything works with placeholders until you do.

## Interactive features (engagement + conversion)

- **Vitality Assessment quiz** (`#quiz`) — see the quiz notes elsewhere in this file.
- **Calorie & Macro Calculator** (`#tools`) — a science-based tool using the **Mifflin–St Jeor equation** (clinical standard). Visitors enter sex/age/height/weight/activity (imperial or metric) and instantly get maintain / fat-loss / muscle-gain calories, a protein target, and BMR/TDEE — then a CTA to "Build My Custom Plan." This showcases your DPT/Kinesiology expertise and captures high-intent leads. Logic lives in `js/main.js`; tweak the protein multiplier (`kg * 1.8`) or deficit/surplus percentages there.
- **Real Results section** (`#results`) — four metric "result cards" plus an interactive **before/after drag slider**. The cards are easy to edit in `index.html`; **replace the before/after placeholders with real client photos** by dropping two `<img>`s into the `.ba-after` / `.ba-before` panes (add the images to `img/`). Real transformation photos are the single biggest conversion driver in fitness — prioritize getting these.
- **"Olympian Difference" comparison table** (`#why`) — positions you against big-box trainers and generic apps to justify your pricing, placed right before the pricing section.
- **UX upgrades** — a gold **scroll-progress bar**, a **back-to-top button**, and a **skip-to-content link** (accessibility). All respect reduced-motion preferences.

> **Note on caching:** CSS/JS are loaded with a `?v=2` version query. **Whenever you edit `style.css`, `main.js`, or `quiz.js`, bump that number** (`?v=3`, etc.) in `index.html` so returning visitors get the new version instead of a stale cached copy.

## File structure

```
index.html        — the whole site (single page, conversion funnel) + JSON-LD structured data
css/style.css     — design system: dark marble + gold, animations, responsive, print styles
js/main.js        — hero animation, reveals, counters, slider, nav, calculator,
                    before/after slider, scroll progress, back-to-top
js/quiz.js        — the Vitality Assessment quiz + report engine
blog/             — content hub: index.html (category landing) + article pages
                    (post-PT, senior strength, chronic pain, busy-schedule)
404.html          — branded "not found" page
CNAME             — custom domain (olympiansolutions.org) for GitHub Pages
robots.txt        — crawler rules + sitemap reference
sitemap.xml       — tells search engines what to index
site.webmanifest  — PWA / install metadata
img/              — (add your photos & icons here — see SEO section)
```

## Marketing tips baked into the design

- **One goal per visitor:** every CTA funnels to the free consultation form.
- **Credentials up front:** your OSU Kinesiology degree and HPU DPT program appear in the hero, about section, and FAQ — that's your differentiator vs. weekend-cert trainers.
- **Scarcity:** "limited roster" messaging increases urgency without being sleazy.
- **Mobile-first leads:** since traffic comes from social/business cards (phones), there's a sticky "Book Free Consult" button on mobile.
- **Local service area:** a scrolling top banner promotes portable, in-home sessions across **Clark County, WA**, with **free travel for Battle Ground residents** — great for converting nearby leads. The hero, pricing ("Demigod"), and footer all reflect the WA service area; online coaching stays worldwide. To change the area, edit the `.topbar` in `index.html` and the location lines in the hero kicker, the Demigod pricing card, and the footer.
- **Clinical brand:** the hero uses a "movement-science" background — an interactive motion-capture node mesh plus a live ECG monitor line — and the slogan "Precision Training. Measurable Results." to signal an evidence-based, clinical approach rather than a generic gym vibe.
- **Vitality Assessment quiz (lead magnet):** the `#quiz` section is an 18-question, multi-step assessment (movement, nutrition, recovery, mindset, health) that generates a personalized, **printable Vitality Report** pairing the visitor's answers with high-quality research on how exercise improves each area. It computes a Vitality Score + five pillar scores, surfaces the most relevant research insights, ends with a strong "Book My Free Consultation" CTA, and **auto-fills the contact form's goal** to match their quiz answer. No email is required to see results (lower friction = more completions); you can later gate the report behind an email via Formspree if you prefer.
  - Everything lives in `js/quiz.js`. To edit questions, change the `QUESTIONS` array. To edit the research claims/cards, change the `INSIGHTS` object — each has a `stat`, `title`, `body`, and `src` (citation).
  - **About the claims:** the statistics are real, population-level findings from peer-reviewed research and major bodies (WHO, AHA, BJSM/Singh 2023, Lancet, JAMA, Cochrane, ACSM, Johns Hopkins). They're framed as ranges and the report carries a medical disclaimer ("educational, not medical advice"). Keep that disclaimer — it protects you and keeps the claims honest.
  - The report prints cleanly: the **Print / Save Report** button opens the browser print dialog (visitors can "Save as PDF"), and a dedicated `@media print` block hides the rest of the page so only the branded report prints.
