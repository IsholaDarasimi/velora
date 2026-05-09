import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   VELORA SKIN — Luxury Brand Experience
   A cinematic single-scroll brand presentation. No commerce. No buttons.
   Pure storytelling.
───────────────────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Jost:wght@200;300;400;500&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream:    #F5EFE8;
  --parchment:#EDE4D8;
  --sand:     #D9CABА;
  --taupe:    #C4A882;
  --gold:     #B8955A;
  --umber:    #7A5C3A;
  --charcoal: #2A2420;
  --ink:      #1A1612;
  --mist:     rgba(245,239,232,0.06);
  --glow:     rgba(184,149,90,0.18);
}

html { scroll-behavior: smooth; }
body {
  background: var(--cream);
  color: var(--charcoal);
  font-family: 'Jost', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
  cursor: none;
}
::selection { background: var(--taupe); color: var(--cream); }

/* ── Custom cursor ── */
#cur-a {
  position: fixed; width: 6px; height: 6px;
  background: var(--gold); border-radius: 50%;
  pointer-events: none; z-index: 9999;
  transform: translate(-50%,-50%);
}
#cur-b {
  position: fixed; width: 36px; height: 36px;
  border: 1px solid rgba(184,149,90,0.5); border-radius: 50%;
  pointer-events: none; z-index: 9998;
  transform: translate(-50%,-50%);
  transition: width .35s ease, height .35s ease, border-color .35s ease;
}
#cur-b.expand { width: 60px; height: 60px; border-color: var(--taupe); }

/* ── Scroll bar ── */
#spb {
  position: fixed; top: 0; left: 0; height: 1px;
  background: var(--gold); z-index: 9997;
  transition: width .05s linear;
}

/* ── Typography ── */
.serif { font-family: 'Cormorant Garamond', serif; }
.eb    { font-family: 'EB Garamond', serif; }
.sans  { font-family: 'Jost', sans-serif; }
.label {
  font-family: 'Jost', sans-serif;
  font-size: .65rem; letter-spacing: .28em;
  text-transform: uppercase; font-weight: 400;
  color: var(--taupe);
}

/* ── Scroll reveal ── */
.sr {
  opacity: 0; transform: translateY(36px);
  transition: opacity 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1);
}
.sr.up   { opacity: 1; transform: translateY(0); }
.sr-l {
  opacity: 0; transform: translateX(-40px);
  transition: opacity 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1);
}
.sr-l.up { opacity: 1; transform: translateX(0); }
.sr-r {
  opacity: 0; transform: translateX(40px);
  transition: opacity 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1);
}
.sr-r.up { opacity: 1; transform: translateX(0); }
.sr-s {
  opacity: 0; transform: scale(.97);
  transition: opacity 1.3s cubic-bezier(.16,1,.3,1), transform 1.3s cubic-bezier(.16,1,.3,1);
}
.sr-s.up { opacity: 1; transform: scale(1); }

/* ── Nav ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 900;
  padding: 28px 56px;
  display: flex; align-items: center; justify-content: space-between;
  transition: padding .6s ease, background .6s ease, border-color .6s ease;
  border-bottom: 1px solid transparent;
}
nav.scrolled {
  padding: 18px 56px;
  background: rgba(245,239,232,0.88);
  backdrop-filter: blur(18px);
  border-bottom-color: rgba(184,149,90,0.18);
}
.wordmark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem; font-weight: 500;
  letter-spacing: .32em; text-transform: uppercase;
  color: var(--ink);
}
.nav-items { display: flex; gap: 40px; }
.nav-lnk {
  font-size: .62rem; letter-spacing: .22em; text-transform: uppercase;
  color: var(--charcoal); opacity: .7; text-decoration: none;
  transition: opacity .3s, color .3s;
  font-weight: 400;
}
.nav-lnk:hover { opacity: 1; color: var(--gold); }

/* ── Hero ── */
#hero {
  position: relative; min-height: 100dvh;
  display: flex; flex-direction: column; justify-content: flex-end;
  overflow: hidden;
  background: var(--ink);
}
#hero-img {
  position: absolute; inset: 0;
  background: url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&q=90') center/cover no-repeat;
  opacity: .72;
  transform-origin: center;
}
#hero-veil {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(26,22,18,.88) 0%, rgba(26,22,18,.28) 45%, transparent 70%);
}
#hero-content {
  position: relative; z-index: 2;
  padding: 0 56px 80px;
}
.hero-tag { color: rgba(184,149,90,.8); margin-bottom: 28px; }
.hero-h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.8rem, 8vw, 8rem);
  line-height: .95; font-weight: 300;
  color: var(--cream); letter-spacing: -.01em;
}
.hero-h1 em { font-style: italic; color: rgba(245,239,232,.7); }
.hero-sub {
  font-family: 'Jost', sans-serif; font-weight: 200;
  font-size: clamp(.9rem, 1.4vw, 1.1rem);
  color: rgba(245,239,232,.55); letter-spacing: .12em;
  max-width: 480px; margin-top: 24px; line-height: 1.8;
}
.hero-scroll {
  position: absolute; bottom: 80px; right: 56px;
  display: flex; flex-direction: column; align-items: center; gap: 12px; z-index: 2;
  animation: fadeUp 1s 2.4s both;
}
.hero-scroll span {
  font-size: .55rem; letter-spacing: .3em; text-transform: uppercase;
  color: rgba(184,149,90,.6); writing-mode: vertical-lr;
}
.scroll-line {
  width: 1px; height: 60px;
  background: linear-gradient(to bottom, rgba(184,149,90,.6), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

/* ── Section ── */
section { position: relative; overflow: hidden; }

/* ── Story ── */
#story { background: var(--cream); padding: 160px 56px; }
.story-grid {
  display: grid; grid-template-columns: 1fr 1.6fr; gap: 100px;
  align-items: start; max-width: 1240px; margin: 0 auto;
}
.story-label { margin-bottom: 48px; }
.story-h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.6rem, 4.5vw, 4.4rem);
  line-height: 1.08; font-weight: 400;
  color: var(--ink); max-width: 280px;
}
.story-h2 em { font-style: italic; color: var(--taupe); }
.story-img-wrap { position: relative; }
.story-img {
  width: 100%; aspect-ratio: 4/5; object-fit: cover;
  display: block;
}
.story-fig-caption {
  position: absolute; bottom: -28px; right: -28px;
  width: 140px; height: 140px;
  background: var(--parchment);
  border: 1px solid rgba(184,149,90,0.2);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.story-fig-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem; font-weight: 300; color: var(--ink);
}
.story-para {
  font-size: clamp(.9rem, 1.15vw, 1.05rem);
  line-height: 2; color: rgba(42,36,32,.75);
  margin-bottom: 28px; font-weight: 300;
}
.story-quote {
  font-family: 'EB Garamond', serif;
  font-size: clamp(1.3rem, 2.2vw, 1.9rem);
  font-style: italic; color: var(--ink);
  line-height: 1.55; margin: 48px 0;
  padding-left: 28px;
  border-left: 1px solid var(--taupe);
}
.story-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 48px; }
.story-col-h {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem; font-weight: 500; color: var(--ink);
  margin-bottom: 14px; letter-spacing: .04em;
}

/* ── Science ── */
#science {
  background: var(--ink);
  padding: 160px 56px;
}
.science-inner { max-width: 1240px; margin: 0 auto; }
.science-top {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 100px; flex-wrap: wrap; gap: 40px;
}
.science-h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.8rem, 5vw, 5rem);
  line-height: 1; font-weight: 300; color: var(--cream);
}
.science-h2 em { font-style: italic; color: var(--taupe); }
.science-intro {
  max-width: 360px; font-size: .9rem; line-height: 1.9;
  color: rgba(245,239,232,.45); font-weight: 200;
}
.science-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: rgba(184,149,90,.12);
  border: 1px solid rgba(184,149,90,.12);
}
.sci-cell {
  background: var(--ink); padding: 52px 40px;
  transition: background .5s ease;
}
.sci-cell:hover { background: #201C18; }
.sci-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3.6rem; font-weight: 300; color: rgba(184,149,90,.25);
  line-height: 1; margin-bottom: 28px;
}
.sci-h {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem; font-weight: 400; color: var(--cream);
  margin-bottom: 16px; letter-spacing: .02em;
}
.sci-p { font-size: .82rem; line-height: 1.9; color: rgba(245,239,232,.4); font-weight: 200; }
.sci-bar-wrap { margin-top: 36px; }
.sci-bar-label {
  display: flex; justify-content: space-between;
  font-size: .6rem; letter-spacing: .16em; text-transform: uppercase;
  color: rgba(184,149,90,.5); margin-bottom: 8px;
}
.sci-bar-track {
  height: 1px; background: rgba(184,149,90,.15); position: relative;
}
.sci-bar-fill {
  height: 1px; background: linear-gradient(to right, var(--taupe), var(--gold));
  width: 0; transition: width 1.6s cubic-bezier(.16,1,.3,1);
  position: absolute; top: 0; left: 0;
}

/* ── Ritual ── */
#ritual { background: var(--parchment); padding: 160px 56px; }
.ritual-inner { max-width: 1000px; margin: 0 auto; }
.ritual-h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.6rem, 4.5vw, 4.2rem);
  line-height: 1.08; font-weight: 300; color: var(--ink);
  margin-bottom: 100px;
}
.ritual-h2 em { font-style: italic; }
.ritual-step {
  display: grid; grid-template-columns: 80px 1fr auto;
  align-items: start; gap: 48px;
  padding: 52px 0;
  border-top: 1px solid rgba(122,92,58,.15);
  transition: all .5s ease;
}
.ritual-step:last-child { border-bottom: 1px solid rgba(122,92,58,.15); }
.ritual-n {
  font-family: 'Cormorant Garamond', serif;
  font-size: .75rem; font-weight: 400; color: var(--taupe);
  letter-spacing: .2em; text-transform: uppercase; padding-top: 6px;
}
.ritual-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 3.2vw, 2.8rem);
  font-weight: 300; color: var(--ink); margin-bottom: 20px;
  line-height: 1;
}
.ritual-body { font-size: .88rem; line-height: 1.95; color: rgba(42,36,32,.6); max-width: 480px; font-weight: 300; }
.ritual-note {
  font-family: 'EB Garamond', serif; font-style: italic;
  font-size: .92rem; color: var(--umber); margin-top: 20px;
  opacity: .8;
}
.ritual-img {
  width: 160px; height: 200px; object-fit: cover;
  opacity: .7; transition: opacity .5s ease;
  flex-shrink: 0;
}
.ritual-step:hover .ritual-img { opacity: 1; }

/* ── Showcase ── */
#showcase { background: var(--cream); }
.showcase-full {
  height: 100dvh; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.showcase-img {
  position: absolute; inset: -40px;
  object-fit: cover; width: calc(100% + 80px); height: calc(100% + 80px);
  opacity: .75;
  will-change: transform;
}
.showcase-caption {
  position: relative; z-index: 2; text-align: center;
  background: rgba(26,22,18,.42);
  backdrop-filter: blur(1px);
  padding: 48px 64px;
  border: 1px solid rgba(245,239,232,.08);
}
.showcase-cap-h {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 3vw, 3rem);
  font-weight: 300; color: var(--cream); font-style: italic;
}
.showcase-cap-sub {
  margin-top: 12px; font-size: .65rem; letter-spacing: .28em;
  text-transform: uppercase; color: rgba(184,149,90,.7);
}
.two-col-shots {
  display: grid; grid-template-columns: 1fr 1fr;
}
.shot-cell {
  position: relative; overflow: hidden;
  aspect-ratio: 4/5;
}
.shot-img {
  width: 100%; height: 100%; object-fit: cover;
  opacity: .8; transition: opacity .6s ease, transform .8s cubic-bezier(.16,1,.3,1);
}
.shot-cell:hover .shot-img { opacity: 1; transform: scale(1.03); }
.shot-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(26,22,18,.55), transparent);
  display: flex; align-items: flex-end; padding: 36px 32px;
}
.shot-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem; font-style: italic;
  color: var(--cream); font-weight: 300;
}

/* ── Testimonials ── */
#testimonials { background: var(--ink); padding: 180px 56px; }
.testi-inner { max-width: 900px; margin: 0 auto; }
.testi-label { margin-bottom: 72px; }
.testi-item {
  padding: 80px 0;
  border-top: 1px solid rgba(184,149,90,.12);
}
.testi-item:last-child { border-bottom: 1px solid rgba(184,149,90,.12); }
.testi-q {
  font-family: 'EB Garamond', serif; font-style: italic;
  font-size: clamp(1.5rem, 2.8vw, 2.4rem);
  color: var(--cream); line-height: 1.48; font-weight: 400;
  margin-bottom: 36px;
}
.testi-by {
  display: flex; align-items: center; gap: 20px;
}
.testi-line { flex: 1; height: 1px; background: rgba(184,149,90,.15); }
.testi-name { font-size: .62rem; letter-spacing: .22em; text-transform: uppercase; color: var(--taupe); }
.testi-loc { font-size: .58rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(184,149,90,.4); margin-top: 4px; }

/* ── Statement ── */
#statement {
  background: var(--ink);
  padding: 200px 56px;
  text-align: center; position: relative; overflow: hidden;
}
.statement-orb {
  position: absolute; width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(184,149,90,.06) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  pointer-events: none;
}
.statement-h {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 5.5vw, 5.5rem);
  line-height: 1.1; font-weight: 300; color: var(--cream);
  max-width: 900px; margin: 0 auto 40px;
  position: relative; z-index: 1;
}
.statement-h em { font-style: italic; color: var(--taupe); }
.statement-rule {
  width: 60px; height: 1px; background: var(--taupe);
  margin: 0 auto; position: relative; z-index: 1;
}

/* ── Footer ── */
footer {
  background: var(--ink);
  padding: 64px 56px 48px;
  border-top: 1px solid rgba(184,149,90,.1);
}
.footer-inner {
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: 32px; max-width: 1240px; margin: 0 auto;
}
.footer-mark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 300; letter-spacing: .3em;
  text-transform: uppercase; color: rgba(245,239,232,.35);
}
.footer-links { display: flex; gap: 32px; }
.footer-lnk {
  font-size: .56rem; letter-spacing: .22em; text-transform: uppercase;
  color: rgba(245,239,232,.2); text-decoration: none;
  transition: color .3s;
}
.footer-lnk:hover { color: var(--taupe); }
.footer-legal { font-size: .6rem; color: rgba(245,239,232,.18); letter-spacing: .08em; margin-top: 40px; text-align: center; max-width: 1240px; margin-left: auto; margin-right: auto; }

/* ── Animations ── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:none;} }
@keyframes fadeIn   { from { opacity:0;} to { opacity:1;} }
@keyframes scrollPulse {
  0%,100% { opacity:.6; transform: scaleY(1); }
  50%      { opacity:1;  transform: scaleY(1.15); }
}
@keyframes heroReveal {
  from { opacity:0; transform: translateY(40px); }
  to   { opacity:1; transform: none; }
}

.hero-tag  { animation: heroReveal 1s .8s  cubic-bezier(.16,1,.3,1) both; }
.hero-h1   { animation: heroReveal 1.1s 1s  cubic-bezier(.16,1,.3,1) both; }
.hero-sub  { animation: heroReveal 1.1s 1.3s cubic-bezier(.16,1,.3,1) both; }

/* ── Responsive ── */
@media (max-width: 900px) {
  nav { padding: 22px 28px; }
  nav.scrolled { padding: 14px 28px; }
  #hero-content { padding: 0 28px 60px; }
  .hero-scroll { right: 28px; }
  #story { padding: 100px 28px; }
  .story-grid { grid-template-columns: 1fr; gap: 60px; }
  .story-img-wrap { display: none; }
  #science { padding: 100px 28px; }
  .science-grid { grid-template-columns: 1fr; }
  #ritual { padding: 100px 28px; }
  .ritual-step { grid-template-columns: 40px 1fr; }
  .ritual-img { display: none; }
  #testimonials { padding: 100px 28px; }
  #statement { padding: 120px 28px; }
  footer { padding: 48px 28px 36px; }
  .footer-inner { flex-direction: column; align-items: flex-start; }
  .two-col-shots { grid-template-columns: 1fr; }
}
`;

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const SCIENCE_CELLS = [
  {
    n: "01",
    title: "Melanin Dynamics",
    body: "Melanin-rich skin contains denser, more dispersed melanosomes — a natural shield that demands actives formulated to work with, not against, this biology.",
    bar: { label: "Melanosome Density", pct: 82 },
  },
  {
    n: "02",
    title: "Hydration Architecture",
    body: "Trans-epidermal water loss behaves differently across skin tones. Our formulations target the ceramide-lipid matrix to restore barrier integrity at the cellular level.",
    bar: { label: "Barrier Restoration Rate", pct: 91 },
  },
  {
    n: "03",
    title: "Glow Intelligence",
    body: "Luminosity is not whitening. It is light-scattering efficiency — the result of an optimised stratum corneum, even melanin distribution, and deep internal hydration.",
    bar: { label: "Light Scatter Index", pct: 76 },
  },
];

const RITUAL_STEPS = [
  {
    n: "I",
    title: "Cleanse",
    body: "Every ritual begins with release. A gentle, pH-calibrated emulsion dissolves the residue of the day without stripping the skin's acid mantle — the delicate film that protects everything underneath.",
    note: "60 seconds. Circular. Unhurried.",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
  },
  {
    n: "II",
    title: "Repair",
    body: "Tranexamic acid, 15% Vitamin C, and stabilised niacinamide work in concert. Post-inflammatory hyperpigmentation — the ghost of every blemish — begins to fade over weeks, not seasons.",
    note: "Applied to damp skin. Absorbed before the next layer.",
    img: "https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?w=400&q=80",
  },
  {
    n: "III",
    title: "Hydrate",
    body: "Triple-molecular hyaluronic acid descends through all three skin layers simultaneously. Shea, squalane, and ceramide NP complete the lock — sealing every active beneath a weightless silk finish.",
    note: "No white cast. No heaviness. No compromise.",
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
  },
  {
    n: "IV",
    title: "Protect",
    body: "UV exposure is the primary driver of hyperpigmentation in melanin-rich skin. Our mineral-hybrid SPF 50 is invisible, breathable, and formulated to sit beneath any complexion without a trace.",
    note: "The most important step. Without exception.",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  },
];

const TESTIMONIALS = [
  {
    quote: "I have spent fifteen years in dermatology. I have seen formulations come and go. VELORA is the first time a brand has approached melanin-rich skin with the rigour it deserves — and the results are exactly what the science predicts.",
    name: "Dr. Amara Osei",
    loc: "Consultant Dermatologist — Accra & London",
  },
  {
    quote: "There is a particular confidence that comes when your skin simply works. No concealment. No correction. Just your face — luminous and at peace. VELORA gave me that, after years of searching.",
    name: "Nadia F.",
    loc: "Fashion Editor — Paris",
  },
  {
    quote: "I tested the serum against three clinical benchmarks. The hyperpigmentation reduction at week six exceeded the control group by 34%. I have since recommended it to every patient with post-inflammatory pigmentation.",
    name: "Dr. Zuri Mensah",
    loc: "Research Dermatologist — Nairobi",
  },
];

/* ─── Custom Cursor ──────────────────────────────────────────────────────────── */
function Cursor() {
  const a = useRef(null);
  const b = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, af;
    const mv = (e) => { mx = e.clientX; my = e.clientY; };
    const expand = () => b.current?.classList.add("expand");
    const shrink = () => b.current?.classList.remove("expand");
    window.addEventListener("mousemove", mv);
    document.querySelectorAll("a, button, .ritual-step, .sci-cell, .shot-cell").forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });
    const tick = () => {
      if (a.current) { a.current.style.left = mx + "px"; a.current.style.top = my + "px"; }
      rx += (mx - rx) * .11; ry += (my - ry) * .11;
      if (b.current) { b.current.style.left = rx + "px"; b.current.style.top = ry + "px"; }
      af = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(af); window.removeEventListener("mousemove", mv); };
  }, []);
  return (<><div id="cur-a" ref={a} /><div id="cur-b" ref={b} /></>);
}

/* ─── Scroll Progress ────────────────────────────────────────────────────────── */
function ScrollBar() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const fn = () => {
      const s = document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setW(h > 0 ? (s / h) * 100 : 0);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div id="spb" style={{ width: w + "%" }} />;
}

/* ─── Navbar ─────────────────────────────────────────────────────────────────── */
function Nav({ scrollY }) {
  const s = scrollY > 60;
  return (
    <nav className={s ? "scrolled" : ""}>
      <div className="wordmark">Velora Skin</div>
      <div className="nav-items">
        {[["Story","#story"],["Science","#science"],["Ritual","#ritual"],["Vision","#statement"]].map(([l,h]) => (
          <a key={l} href={h} className="nav-lnk">{l}</a>
        ))}
      </div>
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function Hero() {
  const imgRef = useRef(null);
  useEffect(() => {
    const fn = () => {
      if (imgRef.current) imgRef.current.style.transform = `scale(1.04) translateY(${window.scrollY * .15}px)`;
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <section id="hero">
      <div id="hero-img" ref={imgRef} />
      <div id="hero-veil" />
      <div id="hero-content">
        <p className="label hero-tag">Melanin-first skincare — est. 2019</p>
        <h1 className="hero-h1">
          Velora<br /><em>Skin</em>
        </h1>
        <p className="hero-sub">
          Luxury skincare for skin that deserves<br />precision, not products.
        </p>
      </div>
      <div className="hero-scroll">
        <span>Scroll to begin</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

/* ─── Brand Story ────────────────────────────────────────────────────────────── */
function Story() {
  return (
    <section id="story">
      <div className="story-grid">
        {/* Left: image + label column */}
        <div>
          <p className="label story-label sr">The Origin</p>
          <div className="story-img-wrap sr-l" style={{ transitionDelay: ".1s" }}>
            <img
              className="story-img"
              src="https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=700&q=85"
              alt="VELORA brand story"
            />
            <div className="story-fig-caption">
              <span className="story-fig-num">6</span>
              <span className="label" style={{ marginTop: 4 }}>Years</span>
              <span className="label" style={{ marginTop: 0 }}>in Research</span>
            </div>
          </div>
        </div>

        {/* Right: text */}
        <div>
          <h2 className="story-h2 sr" style={{ transitionDelay: ".05s" }}>
            Science<br />without<br /><em>compromise.</em>
          </h2>

          <div style={{ marginTop: 60 }}>
            <p className="story-para sr" style={{ transitionDelay: ".1s" }}>
              VELORA SKIN was built from a single, radical premise: that melanin-rich skin is not a variation to accommodate — it is the standard to design for. Every formula in our collection begins with this truth.
            </p>
            <blockquote className="story-quote sr" style={{ transitionDelay: ".15s" }}>
              "We do not adjust our formulations for dark skin. We formulate for dark skin — and adjust everything else."
            </blockquote>
            <p className="story-para sr" style={{ transitionDelay: ".2s" }}>
              Our laboratory is led by dermatologists and cosmetic chemists who have spent careers studying the specific biology of melanin-rich skin — its unique hydration dynamics, its post-inflammatory response, its relationship to UV radiation.
            </p>
            <div className="story-cols">
              <div className="sr" style={{ transitionDelay: ".22s" }}>
                <p className="story-col-h">Clean Chemistry</p>
                <p className="story-para" style={{ marginBottom: 0 }}>
                  Zero parabens, mineral oils, artificial fragrance, or optical brighteners. Every ingredient is in the formula because science demands it.
                </p>
              </div>
              <div className="sr" style={{ transitionDelay: ".28s" }}>
                <p className="story-col-h">Clinical Precision</p>
                <p className="story-para" style={{ marginBottom: 0 }}>
                  All efficacy claims are substantiated by randomised, double-blind clinical trials conducted exclusively on melanin-rich skin, Fitzpatrick IV–VI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Skin Science ───────────────────────────────────────────────────────────── */
function Science() {
  const barRefs = useRef([]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated) setAnimated(true);
    }, { threshold: .3 });
    const el = document.getElementById("science");
    if (el) io.observe(el);
    return () => io.disconnect();
  }, [animated]);

  useEffect(() => {
    if (!animated) return;
    barRefs.current.forEach((el, i) => {
      if (el) {
        setTimeout(() => { el.style.width = SCIENCE_CELLS[i].bar.pct + "%"; }, i * 180);
      }
    });
  }, [animated]);

  return (
    <section id="science">
      <div className="science-inner">
        <div className="science-top">
          <div>
            <p className="label sr" style={{ color: "rgba(184,149,90,.5)", marginBottom: 24 }}>The Biology</p>
            <h2 className="science-h2 sr" style={{ transitionDelay: ".05s" }}>
              Skin science<br /><em>reimagined.</em>
            </h2>
          </div>
          <p className="science-intro sr" style={{ transitionDelay: ".1s" }}>
            Three pillars underpin every VELORA formulation. Understanding them is understanding why the results are different — not incrementally, but categorically.
          </p>
        </div>

        <div className="science-grid sr" style={{ transitionDelay: ".12s" }}>
          {SCIENCE_CELLS.map((c, i) => (
            <div className="sci-cell" key={c.n}>
              <div className="sci-num">{c.n}</div>
              <h3 className="sci-h">{c.title}</h3>
              <p className="sci-p">{c.body}</p>
              <div className="sci-bar-wrap">
                <div className="sci-bar-label">
                  <span>{c.bar.label}</span>
                  <span>{animated ? c.bar.pct : 0}%</span>
                </div>
                <div className="sci-bar-track">
                  <div
                    className="sci-bar-fill"
                    ref={(el) => { barRefs.current[i] = el; }}
                    style={{ transitionDelay: `${i * .18}s` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Ritual ─────────────────────────────────────────────────────────────────── */
function Ritual() {
  return (
    <section id="ritual">
      <div className="ritual-inner">
        <div className="sr">
          <p className="label" style={{ marginBottom: 20 }}>The System</p>
          <h2 className="ritual-h2">
            A ritual in<br /><em>four movements.</em>
          </h2>
        </div>
        {RITUAL_STEPS.map((s, i) => (
          <div className="ritual-step sr" key={s.n} style={{ transitionDelay: `${i * .07}s` }}>
            <p className="ritual-n">{s.n}</p>
            <div>
              <h3 className="ritual-title">{s.title}</h3>
              <p className="ritual-body">{s.body}</p>
              <p className="ritual-note">{s.note}</p>
            </div>
            <img className="ritual-img" src={s.img} alt={s.title} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Visual Showcase ────────────────────────────────────────────────────────── */
function Showcase() {
  const imgs = [
    { ref: useRef(null), src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1400&q=90", cap: "The skin you were born into deserves the science it was never given." },
  ];

  useEffect(() => {
    const fns = imgs.map(({ ref }) => {
      const fn = () => {
        if (!ref.current) return;
        const rect = ref.current.closest(".showcase-full").getBoundingClientRect();
        const offset = rect.top * .18;
        ref.current.style.transform = `translateY(${offset}px)`;
      };
      window.addEventListener("scroll", fn);
      return fn;
    });
    return () => fns.forEach((fn) => window.removeEventListener("scroll", fn));
  }, []);

  return (
    <section id="showcase">
      <div className="showcase-full">
        <img
          ref={imgs[0].ref}
          className="showcase-img"
          src={imgs[0].src}
          alt="VELORA visual"
        />
        <div style={{ position:"absolute", inset:0, background:"rgba(26,22,18,.38)" }} />
        <div className="showcase-caption sr-s">
          <p className="showcase-cap-h">"{imgs[0].cap}"</p>
          <p className="showcase-cap-sub">Velora Skin — 2024</p>
        </div>
      </div>

      <div className="two-col-shots">
        {[
          { src:"https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=85", label:"Formulated for clarity" },
          { src:"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=85", label:"Engineered for glow" },
        ].map(({ src, label }) => (
          <div className="shot-cell" key={label}>
            <img className="shot-img" src={src} alt={label} />
            <div className="shot-overlay">
              <p className="shot-label">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────────────────── */
function Testimonials() {
  return (
    <section id="testimonials">
      <div className="testi-inner">
        <div className="testi-label sr">
          <p className="label" style={{ color: "rgba(184,149,90,.5)" }}>In Their Words</p>
        </div>
        {TESTIMONIALS.map((t, i) => (
          <div className="testi-item sr" key={i} style={{ transitionDelay: `${i * .1}s` }}>
            <blockquote className="testi-q">"{t.quote}"</blockquote>
            <div className="testi-by">
              <div className="testi-line" />
              <div>
                <p className="testi-name">{t.name}</p>
                <p className="testi-loc">{t.loc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Brand Statement ────────────────────────────────────────────────────────── */
function Statement() {
  return (
    <section id="statement">
      <div className="statement-orb" />
      <h2 className="statement-h sr">
        VELORA is not skincare.<br />
        It is <em>precision</em><br />
        for the skin you live in.
      </h2>
      <div className="statement-rule sr" style={{ transitionDelay: ".15s" }} />
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <p className="footer-mark">Velora Skin</p>
        <div className="footer-links">
          {["Instagram","Journal","Sustainability","Privacy"].map((l) => (
            <a key={l} href="#" className="footer-lnk">{l}</a>
          ))}
        </div>
      </div>
      <p className="footer-legal">
        © 2024 Velora Skin. All rights reserved. Formulated with intention for the skin that deserves it most.
      </p>
    </footer>
  );
}

/* ─── Scroll Reveal Hook ─────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sr,.sr-l,.sr-r,.sr-s");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("up"); }),
      { threshold: .1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─── App ────────────────────────────────────────────────────────────────────── */
export default function VeloraBrand() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useReveal();

  return (
    <>
      <style>{CSS}</style>
      <Cursor />
      <ScrollBar />
      <Nav scrollY={scrollY} />
      <Hero />
      <Story />
      <Science />
      <Ritual />
      <Showcase />
      <Testimonials />
      <Statement />
      <Footer />
    </>
  );
}