import { useState, useEffect, useRef } from "react";

// ─── Keyframe CSS ──────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #F7F2EE;
    --bg2:      #E8D9CE;
    --accent:   #B68D74;
    --dark:     #1E1B18;
    --glow:     rgba(182,141,116,0.35);
    --charcoal: #2D2926;
    --muted:    #7A6A60;
    --cream:    #FAF6F2;
    --gold:     #C9A882;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--charcoal);
    cursor: none;
    overflow-x: hidden;
  }

  ::selection { background: var(--accent); color: #fff; }

  /* ── Custom cursor ── */
  .cursor-dot {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%,-50%);
    transition: transform .1s;
  }
  .cursor-ring {
    width: 40px; height: 40px;
    border: 1px solid var(--accent);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%,-50%);
    transition: transform .25s cubic-bezier(.23,1,.32,1), width .3s, height .3s, background .3s;
  }
  .cursor-ring.hovering {
    width: 64px; height: 64px;
    background: var(--glow);
  }

  /* ── Scroll progress ── */
  .scroll-bar {
    position: fixed; top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--gold));
    z-index: 9997;
    transition: width .1s;
  }

  /* ── Animations ── */
  @keyframes floatY {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-18px); }
  }
  @keyframes floatX {
    0%,100% { transform: translateX(0); }
    50%      { transform: translateX(12px); }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 24px var(--glow); }
    50%      { box-shadow: 0 0 56px rgba(182,141,116,0.6); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes reveal-up {
    from { opacity:0; transform: translateY(60px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes reveal-left {
    from { opacity:0; transform: translateX(-60px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes count-up {
    from { opacity:0; transform: scale(.7); }
    to   { opacity:1; transform: scale(1); }
  }
  @keyframes bar-fill { from { width:0; } }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
  }
  @keyframes particle-float {
    0%   { transform: translateY(0) rotate(0deg); opacity:.6; }
    100% { transform: translateY(-100vh) rotate(720deg); opacity:0; }
  }
  @keyframes line-draw {
    from { stroke-dashoffset: 400; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes fade-in {
    from { opacity:0; } to { opacity:1; }
  }

  .float-y  { animation: floatY 6s ease-in-out infinite; }
  .float-x  { animation: floatX 5s ease-in-out infinite; }
  .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
  .spin-slow  { animation: spin-slow 20s linear infinite; }

  /* ── Glass ── */
  .glass {
    background: rgba(247,242,238,0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(182,141,116,0.2);
  }
  .glass-dark {
    background: rgba(30,27,24,0.55);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(182,141,116,0.25);
  }

  /* ── Gradient text ── */
  .gradient-text {
    background: linear-gradient(135deg, var(--accent) 0%, var(--gold) 50%, #D4A97A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .shimmer-text {
    background: linear-gradient(90deg, var(--accent) 0%, #E5C49A 40%, var(--accent) 80%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  /* ── Section reveals ── */
  .reveal { opacity:0; transform: translateY(50px); transition: opacity .9s cubic-bezier(.23,1,.32,1), transform .9s cubic-bezier(.23,1,.32,1); }
  .reveal.visible { opacity:1; transform: translateY(0); }
  .reveal-left { opacity:0; transform: translateX(-50px); transition: opacity .9s cubic-bezier(.23,1,.32,1), transform .9s cubic-bezier(.23,1,.32,1); }
  .reveal-left.visible { opacity:1; transform: translateX(0); }
  .reveal-right { opacity:0; transform: translateX(50px); transition: opacity .9s cubic-bezier(.23,1,.32,1), transform .9s cubic-bezier(.23,1,.32,1); }
  .reveal-right.visible { opacity:1; transform: translateX(0); }

  /* ── Tilt card ── */
  .tilt-card { transition: transform .4s cubic-bezier(.23,1,.32,1), box-shadow .4s; }
  .tilt-card:hover { transform: perspective(600px) rotateY(-6deg) rotateX(3deg) scale(1.03); }

  /* ── Magnetic btn ── */
  .mag-btn {
    display: inline-flex; align-items: center; justify-content: center;
    transition: transform .3s cubic-bezier(.23,1,.32,1), box-shadow .3s;
  }
  .mag-btn:hover { box-shadow: 0 12px 48px var(--glow); }

  /* ── Nav ── */
  .nav-link {
    position: relative; font-size: .78rem; letter-spacing: .12em; text-transform: uppercase;
    color: var(--charcoal); text-decoration: none; font-weight: 500;
    padding-bottom: 2px;
  }
  .nav-link::after {
    content:''; position:absolute; bottom:0; left:0; width:0; height:1px;
    background: var(--accent);
    transition: width .4s cubic-bezier(.23,1,.32,1);
  }
  .nav-link:hover::after { width:100%; }

  /* ── Glow ring on cards ── */
  .card-glow { position:relative; }
  .card-glow::before {
    content:''; position:absolute; inset:-1px; border-radius:inherit;
    background: linear-gradient(135deg,rgba(182,141,116,0),rgba(182,141,116,.45),rgba(182,141,116,0));
    opacity:0; transition: opacity .4s;
    pointer-events:none;
  }
  .card-glow:hover::before { opacity:1; }

  /* ── Routine step ── */
  .routine-step { transition: all .5s cubic-bezier(.23,1,.32,1); }
  .routine-step:hover .step-detail { max-height: 200px; opacity:1; }
  .step-detail { max-height:0; opacity:0; overflow:hidden; transition: max-height .5s cubic-bezier(.23,1,.32,1), opacity .4s; }

  /* ── Carousel ── */
  .carousel-track { display:flex; transition: transform .7s cubic-bezier(.23,1,.32,1); }

  /* ── Particle ── */
  .particle {
    position:absolute; border-radius:50%;
    background: var(--accent);
    animation: particle-float linear infinite;
    pointer-events:none;
  }

  /* ── Stat bar ── */
  .stat-bar { height:3px; border-radius:2px; background: var(--bg2); overflow:hidden; }
  .stat-fill { height:100%; background: linear-gradient(90deg,var(--accent),var(--gold)); border-radius:2px; width:0; transition: width 1.5s cubic-bezier(.23,1,.32,1); }

  /* ── Noise overlay ── */
  .noise::after {
    content:''; position:absolute; inset:0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
    pointer-events:none; opacity:.4;
  }

  /* ── Hero gradient orbs ── */
  .orb {
    border-radius:50%;
    filter: blur(80px);
    position:absolute;
    pointer-events:none;
  }

  /* ── Mobile ── */
  @media(max-width:768px) {
    .hide-mobile { display:none !important; }
    .hero-title  { font-size: clamp(2.8rem, 10vw, 5rem) !important; }
  }
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: "Velvet Cleanser",
    tag: "Deep Purifying",
    price: "$48",
    desc: "Whipped cream formula with kaolin clay & oat extract. Melts away impurities without stripping melanin-rich skin.",
    ingredients: ["Kaolin Clay", "Oat Extract", "Ceramide Complex"],
    color: "#E8D9CE",
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
  },
  {
    name: "Glow Repair Serum",
    tag: "Brightening",
    price: "$92",
    desc: "20% Vitamin C + Niacinamide powerhouse. Fades hyperpigmentation, restores radiance.",
    ingredients: ["Vitamin C 20%", "Niacinamide", "Tranexamic Acid"],
    color: "#F2E4D8",
    img: "https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?w=400&q=80",
  },
  {
    name: "Hydra Silk Moisturizer",
    tag: "Barrier Restore",
    price: "$76",
    desc: "Triple hyaluronic acid complex delivers 72-hour hydration. Satin-finish, no white cast.",
    ingredients: ["Hyaluronic Acid", "Shea Butter", "Squalane"],
    color: "#EEDFD3",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
  },
  {
    name: "Midnight Renewal Oil",
    tag: "Overnight Repair",
    price: "$110",
    desc: "Rare Marula & Bakuchiol blend accelerates cell renewal while you sleep.",
    ingredients: ["Marula Oil", "Bakuchiol", "Sea Buckthorn"],
    color: "#DDD0C8",
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80",
  },
  {
    name: "SPF 50 Veil Cream",
    tag: "Invisible Protection",
    price: "$58",
    desc: "Mineral UV filters in a featherlight formula. Zero white cast on all skin tones.",
    ingredients: ["Zinc Oxide", "Titanium Dioxide", "Niacinamide"],
    color: "#F0E6DC",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  },
];

const TESTIMONIALS = [
  {
    name: "Amara J.",
    role: "Creative Director, Lagos",
    text: "The Glow Repair Serum eliminated my hyperpigmentation in 6 weeks. I've never felt more confident in my skin. VELORA truly understands melanin.",
    rating: 5,
    before: "Uneven tone",
    after: "Radiant clarity",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80",
  },
  {
    name: "Zuri M.",
    role: "Dermatology Nurse, Nairobi",
    text: "As someone who knows ingredients, the formulations are exceptional — bioavailable actives at clinical concentrations. And the skin feel? Absolute silk.",
    rating: 5,
    before: "Dull & dehydrated",
    after: "Plump & luminous",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&q=80",
  },
  {
    name: "Nadia F.",
    role: "Fashion Editor, Paris",
    text: "I've used La Mer, Tatcha, Augustinus Bader. VELORA belongs in that conversation — and it actually works for my melanated skin unlike those others.",
    rating: 5,
    before: "Textured skin",
    after: "Glass skin",
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&q=80",
  },
];

const ROUTINE = [
  {
    step: "01",
    title: "Cleanse",
    product: "Velvet Cleanser",
    time: "AM + PM",
    desc: "Begin with a ritual, not a chore. Our whipped cleanser dissolves impurities while reinforcing your skin barrier.",
    tip: "Massage in circular motions for 60 seconds.",
    color: "#B68D74",
  },
  {
    step: "02",
    title: "Repair",
    product: "Glow Repair Serum",
    time: "AM",
    desc: "The workhorse of your routine. Clinically concentrated actives target hyperpigmentation and restore luminosity.",
    tip: "Apply to slightly damp skin for deeper absorption.",
    color: "#C9A882",
  },
  {
    step: "03",
    title: "Hydrate",
    product: "Hydra Silk Moisturizer",
    time: "AM + PM",
    desc: "Lock in actives and restore your moisture barrier with triple-molecular hyaluronic acid.",
    tip: "Layer over Midnight Oil for a moisture sandwich.",
    color: "#D4B99A",
  },
  {
    step: "04",
    title: "Protect",
    product: "SPF 50 Veil Cream",
    time: "AM",
    desc: "The most important step. Our invisible mineral SPF guards against UV-induced hyperpigmentation.",
    tip: "Reapply every 2 hours outdoors.",
    color: "#BFA38C",
  },
];

const SKIN_METRICS = [
  { label: "Hydration Level",       pct: 87, unit: "%" },
  { label: "Melanin Distribution",  pct: 72, unit: "%" },
  { label: "Barrier Integrity",     pct: 91, unit: "%" },
  { label: "Glow Index",            pct: 78, unit: "%" },
  { label: "UV Defense Readiness",  pct: 64, unit: "%" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal,.reveal-left,.reveal-right");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onEnter = () => ring.current?.classList.add("hovering");
    const onLeave = () => ring.current?.classList.remove("hovering");
    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,.mag-btn,.tilt-card").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    let raf;
    const animate = () => {
      if (dot.current)  { dot.current.style.left  = mx + "px"; dot.current.style.top  = my + "px"; }
      rx += (mx - rx) * .12; ry += (my - ry) * .12;
      if (ring.current) { ring.current.style.left = rx + "px"; ring.current.style.top  = ry + "px"; }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);
  return (<>
    <div className="cursor-dot"  ref={dot}  />
    <div className="cursor-ring" ref={ring} />
  </>);
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const s = document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (s / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-bar" style={{ width: pct + "%" }} />;
}

function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 8 + 8,
    opacity: Math.random() * 0.5 + 0.1,
  }));
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {particles.map((p) => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size,
          left: p.left + "%", bottom: "-10px",
          opacity: p.opacity,
          animationDuration: p.duration + "s",
          animationDelay: p.delay + "s",
        }} />
      ))}
    </div>
  );
}

function Navbar({ scrollY }) {
  const scrolled = scrollY > 60;
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:999,
      padding: scrolled ? "14px 48px" : "28px 48px",
      background: scrolled ? "rgba(247,242,238,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(182,141,116,0.18)" : "none",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      transition:"all .5s cubic-bezier(.23,1,.32,1)",
    }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.35rem", fontWeight:700, letterSpacing:".08em", color:"var(--dark)" }}>
        VELORA <span className="gradient-text">SKIN</span>
      </div>
      <div className="hide-mobile" style={{ display:"flex", gap:"36px" }}>
        {["Collections","Ritual","Science","About","Stories"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
        <button className="mag-btn" style={{
          padding:"11px 28px", borderRadius:"100px",
          background:"var(--dark)", color:"#F7F2EE",
          border:"none", cursor:"none", fontSize:".78rem", letterSpacing:".1em",
          fontFamily:"Inter,sans-serif", fontWeight:500, textTransform:"uppercase",
        }}>Shop Now</button>
      </div>
    </nav>
  );
}

function Hero() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section id="hero" style={{
      minHeight:"100vh", position:"relative", display:"flex", alignItems:"center",
      overflow:"hidden", background: "linear-gradient(160deg, #F7F2EE 0%, #EDE2D8 50%, #E0CFC2 100%)",
    }}>
      {/* Orbs */}
      <div className="orb" style={{ width:600, height:600, background:"rgba(182,141,116,0.18)", top:-100, right:-80, transform:`translateY(${offset*.15}px)` }} />
      <div className="orb" style={{ width:400, height:400, background:"rgba(201,168,130,0.22)", bottom:-100, left:-60, transform:`translateY(${-offset*.08}px)` }} />
      <div className="orb" style={{ width:250, height:250, background:"rgba(212,185,154,0.28)", top:"40%", left:"38%", transform:`translateY(${offset*.1}px)` }} />

      <Particles />

      {/* Left content */}
      <div style={{ position:"relative", zIndex:2, maxWidth:720, padding:"0 48px", marginTop:80 }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:10, padding:"7px 18px",
          borderRadius:"100px", background:"rgba(182,141,116,0.15)", border:"1px solid rgba(182,141,116,0.35)",
          marginBottom:32,
          animation: "reveal-up .8s cubic-bezier(.23,1,.32,1) both",
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--accent)", display:"inline-block", animation:"pulse-glow 2s infinite" }} />
          <span style={{ fontSize:".72rem", letterSpacing:".15em", textTransform:"uppercase", color:"var(--accent)", fontWeight:500 }}>Melanin-first skincare</span>
        </div>

        <h1 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(3.2rem,6.5vw,6rem)",
          lineHeight:1.06, fontWeight:800, color:"var(--dark)",
          marginBottom:28,
          animation:"reveal-up .9s .1s cubic-bezier(.23,1,.32,1) both",
        }}>
          Your Skin<br/>Deserves<br/><span className="gradient-text">Better Than</span><br/><em>Basic.</em>
        </h1>

        <p style={{
          fontFamily:"'Cormorant Garamond',serif", fontSize:"1.25rem", fontWeight:300,
          color:"var(--muted)", lineHeight:1.7, maxWidth:480, marginBottom:40,
          animation:"reveal-up .9s .2s cubic-bezier(.23,1,.32,1) both",
        }}>
          Science-backed skincare for deep hydration, glow restoration, and unshakeable confidence.
        </p>

        <div style={{ display:"flex", gap:16, flexWrap:"wrap", animation:"reveal-up .9s .3s cubic-bezier(.23,1,.32,1) both" }}>
          <button className="mag-btn" style={{
            padding:"16px 40px", borderRadius:"100px",
            background:"var(--dark)", color:"#F7F2EE",
            border:"none", cursor:"none", fontSize:".82rem", letterSpacing:".12em",
            fontFamily:"Inter,sans-serif", fontWeight:500, textTransform:"uppercase",
          }}>Shop Collection</button>
          <button className="mag-btn" style={{
            padding:"16px 40px", borderRadius:"100px",
            background:"transparent", color:"var(--dark)",
            border:"1.5px solid var(--accent)", cursor:"none", fontSize:".82rem",
            letterSpacing:".12em", fontFamily:"Inter,sans-serif", fontWeight:500, textTransform:"uppercase",
          }}>Discover Routine</button>
        </div>

        {/* Stats row */}
        <div style={{ display:"flex", gap:40, marginTop:64, animation:"reveal-up .9s .4s cubic-bezier(.23,1,.32,1) both" }}>
          {[["50K+","Radiant customers"],["98%","Efficacy rating"],["Clean","23 actives, 0 toxins"]].map(([n,l]) => (
            <div key={n}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:700, color:"var(--dark)" }}>{n}</div>
              <div style={{ fontSize:".73rem", color:"var(--muted)", letterSpacing:".08em", textTransform:"uppercase", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating product cards */}
      <div className="hide-mobile" style={{ position:"absolute", right:60, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:20, zIndex:3 }}>
        {[
          { name:"Glow Repair Serum", price:"$92", img:"https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?w=160&q=80", delay:"0s" },
          { name:"Hydra Silk", price:"$76", img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=160&q=80", delay:"1.5s" },
        ].map((p) => (
          <div key={p.name} className="tilt-card card-glow glass" style={{
            borderRadius:20, padding:16, display:"flex", alignItems:"center", gap:14,
            minWidth:230,
            animation:`floatY 6s ${p.delay} ease-in-out infinite`,
            boxShadow:"0 24px 60px rgba(30,27,24,0.1)",
          }}>
            <img src={p.img} alt={p.name} style={{ width:56, height:56, borderRadius:12, objectFit:"cover" }} />
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:".9rem", fontWeight:600, color:"var(--dark)" }}>{p.name}</div>
              <div style={{ fontSize:".75rem", color:"var(--muted)", marginTop:2 }}>Best Seller</div>
              <div style={{ fontSize:".85rem", fontWeight:600, color:"var(--accent)", marginTop:4 }}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero model image */}
      <div style={{
        position:"absolute", right:280, top:0, bottom:0, width:380,
        overflow:"hidden", transform:`translateY(${offset*.06}px)`,
      }} className="hide-mobile">
        <img
          src="https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&q=85"
          alt="Luxury skincare model"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", opacity:.88 }}
        />
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to right, #F7F2EE 0%, transparent 25%, transparent 75%, #F7F2EE 100%)",
        }} />
      </div>

      {/* Scroll indicator */}
      <div style={{
        position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:8, zIndex:4,
        animation:"fade-in 1s 1s both",
      }}>
        <span style={{ fontSize:".65rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted)" }}>Scroll</span>
        <div style={{ width:1, height:40, background:"linear-gradient(to bottom, var(--accent), transparent)" }} />
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="collections" style={{ padding:"120px 48px", background:"var(--bg)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="reveal" style={{ marginBottom:80, display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:24 }}>
          <div>
            <p style={{ fontSize:".72rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--accent)", marginBottom:16 }}>The Collection</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.8rem)", fontWeight:700, color:"var(--dark)", lineHeight:1.1 }}>
              Formulated for<br/><em>Melanin Magic.</em>
            </h2>
          </div>
          <p style={{ maxWidth:360, color:"var(--muted)", lineHeight:1.7, fontSize:".95rem" }}>
            Every formula developed with melanin-rich skin as the primary focus — not an afterthought.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:28 }}>
          {PRODUCTS.map((p, i) => (
            <div key={p.name} className="tilt-card card-glow reveal" style={{
              borderRadius:24, overflow:"hidden",
              background: p.color,
              boxShadow:"0 8px 40px rgba(30,27,24,0.08)",
              transitionDelay: `${i * .07}s`,
            }}>
              <div style={{ position:"relative", overflow:"hidden", height:240 }}>
                <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .6s cubic-bezier(.23,1,.32,1)" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{
                  position:"absolute", top:16, right:16, padding:"6px 14px", borderRadius:"100px",
                  background:"rgba(247,242,238,0.8)", backdropFilter:"blur(8px)",
                  fontSize:".65rem", letterSpacing:".12em", textTransform:"uppercase", color:"var(--accent)", fontWeight:600,
                }}>
                  {p.tag}
                </div>
              </div>
              <div style={{ padding:"24px 22px" }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:600, color:"var(--dark)", marginBottom:8 }}>{p.name}</h3>
                <p style={{ fontSize:".8rem", color:"var(--muted)", lineHeight:1.6, marginBottom:16 }}>{p.desc}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
                  {p.ingredients.map((ing) => (
                    <span key={ing} style={{
                      padding:"4px 10px", borderRadius:"100px",
                      background:"rgba(182,141,116,0.12)", border:"1px solid rgba(182,141,116,0.25)",
                      fontSize:".65rem", color:"var(--accent)", letterSpacing:".06em",
                    }}>{ing}</span>
                  ))}
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.25rem", fontWeight:700, color:"var(--dark)" }}>{p.price}</span>
                  <button className="mag-btn" style={{
                    padding:"9px 22px", borderRadius:"100px",
                    background:"var(--dark)", color:"#F7F2EE",
                    border:"none", cursor:"none", fontSize:".72rem", letterSpacing:".1em",
                    fontFamily:"Inter,sans-serif", fontWeight:500, textTransform:"uppercase",
                  }}>Add to Bag</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkinAnalysis() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold:.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="science" ref={ref} style={{
      padding:"120px 48px",
      background:"linear-gradient(160deg, var(--dark) 0%, #2E2620 100%)",
      position:"relative", overflow:"hidden",
    }}>
      {/* bg orbs */}
      <div className="orb" style={{ width:500, height:500, background:"rgba(182,141,116,0.08)", top:-80, right:-80 }} />
      <div className="orb" style={{ width:300, height:300, background:"rgba(182,141,116,0.12)", bottom:-40, left:100 }} />
      <Particles />

      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative", zIndex:2 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          {/* Left */}
          <div>
            <p className="reveal" style={{ fontSize:".72rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--accent)", marginBottom:16 }}>AI Skin Analysis</p>
            <h2 className="reveal" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.5rem)", fontWeight:700, color:"#F7F2EE", lineHeight:1.12, marginBottom:24 }}>
              Understand<br/><em className="gradient-text">Your Skin.</em>
            </h2>
            <p className="reveal" style={{ color:"#9A8A80", lineHeight:1.7, marginBottom:48, maxWidth:400 }}>
              Our AI-powered diagnostic maps your skin's unique biology — hydration depth, melanin distribution, barrier health — to build a ritual that's truly yours.
            </p>

            {/* Metrics */}
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {SKIN_METRICS.map((m, i) => (
                <div key={m.label} className="reveal" style={{ transitionDelay: `${i * .09}s` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:".8rem", color:"#C4B4AC", letterSpacing:".06em" }}>{m.label}</span>
                    <span style={{ fontSize:".8rem", color:"var(--accent)", fontWeight:600 }}>{animated ? m.pct : 0}{m.unit}</span>
                  </div>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: animated ? m.pct + "%" : "0%", transitionDelay: `${i * .15}s` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — face scan UI */}
          <div style={{ position:"relative", display:"flex", justifyContent:"center", alignItems:"center", minHeight:440 }}>
            {/* Outer ring */}
            <div className="spin-slow" style={{
              width:320, height:320, borderRadius:"50%",
              border:"1px dashed rgba(182,141,116,0.3)",
              position:"absolute",
            }} />
            {/* Orbit dots */}
            {[0,1,2].map((i) => (
              <div key={i} style={{
                position:"absolute", width:320, height:320,
                animation:`orbit ${4 + i}s ${i * 1.2}s linear infinite`,
              }}>
                <div style={{
                  width:10, height:10, borderRadius:"50%", background:"var(--accent)",
                  boxShadow:"0 0 12px var(--glow)",
                }} />
              </div>
            ))}

            {/* Face circle */}
            <div style={{
              width:200, height:200, borderRadius:"50%",
              background:"rgba(182,141,116,0.08)",
              border:"1.5px solid rgba(182,141,116,0.4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative", zIndex:2,
              boxShadow:"0 0 60px rgba(182,141,116,0.2)",
            }}>
              <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80"
                alt="Skin analysis"
                style={{ width:160, height:160, borderRadius:"50%", objectFit:"cover", objectPosition:"top" }}
              />
              {/* Scan lines */}
              <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 200 200">
                <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(182,141,116,0.4)" strokeWidth=".5"
                  style={{ animation: animated ? "line-draw 2s ease forwards" : "none", strokeDasharray:400, strokeDashoffset: animated ? 0 : 400 }} />
                <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(182,141,116,0.4)" strokeWidth=".5"
                  style={{ animation: animated ? "line-draw 2s .5s ease forwards" : "none", strokeDasharray:400, strokeDashoffset: animated ? 0 : 400 }} />
              </svg>
            </div>

            {/* Floating metric badges */}
            {[
              { label:"Hydration", val:"87%", x:-140, y:-60 },
              { label:"Glow Score", val:"9.2", x:100, y:-80 },
              { label:"Barrier",   val:"Optimal", x:-120, y:80 },
            ].map((b) => (
              <div key={b.label} className="glass-dark" style={{
                position:"absolute", padding:"10px 16px", borderRadius:14,
                transform:`translate(${b.x}px,${b.y}px)`,
                animation:`floatY ${5 + Math.random()*2}s ease-in-out infinite`,
              }}>
                <div style={{ fontSize:".62rem", color:"#9A8A80", letterSpacing:".1em", textTransform:"uppercase" }}>{b.label}</div>
                <div style={{ fontSize:"1rem", fontWeight:700, color:"var(--accent)", fontFamily:"'Playfair Display',serif" }}>{b.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal" style={{ textAlign:"center", marginTop:80 }}>
          <button className="mag-btn" style={{
            padding:"18px 52px", borderRadius:"100px",
            background:"linear-gradient(135deg,var(--accent),var(--gold))",
            color:"#fff", border:"none", cursor:"none",
            fontSize:".82rem", letterSpacing:".14em", fontFamily:"Inter,sans-serif",
            fontWeight:500, textTransform:"uppercase", boxShadow:"0 12px 48px rgba(182,141,116,0.4)",
          }}>Start Your Skin Analysis →</button>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{ padding:"120px 48px", background:"var(--cream)", position:"relative", overflow:"hidden" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
          {/* Images */}
          <div className="reveal-left" style={{ position:"relative", height:560 }}>
            <img src="https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=85" alt="About"
              style={{ width:"72%", height:"80%", objectFit:"cover", borderRadius:24, position:"absolute", top:0, left:0, boxShadow:"0 32px 80px rgba(30,27,24,0.14)" }} />
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=360&q=80" alt="Products"
              style={{ width:"55%", height:"55%", objectFit:"cover", borderRadius:20, position:"absolute", bottom:0, right:0, boxShadow:"0 24px 60px rgba(30,27,24,0.12)" }} />
            {/* Stat badge */}
            <div className="glass pulse-glow" style={{
              position:"absolute", top:"42%", left:"54%", padding:"18px 24px", borderRadius:18,
              textAlign:"center", boxShadow:"0 16px 40px var(--glow)",
            }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", fontWeight:800, color:"var(--dark)" }}>2019</div>
              <div style={{ fontSize:".7rem", letterSpacing:".1em", textTransform:"uppercase", color:"var(--muted)" }}>Founded</div>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="reveal" style={{ fontSize:".72rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--accent)", marginBottom:16 }}>Our Story</p>
            <h2 className="reveal" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,3.5vw,3.2rem)", fontWeight:700, color:"var(--dark)", lineHeight:1.12, marginBottom:28 }}>
              Born from<br/>Science &<br/><em>Sacrifice.</em>
            </h2>
            <p className="reveal" style={{ color:"var(--muted)", lineHeight:1.9, marginBottom:24, fontSize:".95rem" }}>
              VELORA SKIN was created to merge clinical skincare science with luxurious self-care experiences for melanin-rich skin — because we were tired of being an afterthought.
            </p>
            <p className="reveal" style={{ color:"var(--muted)", lineHeight:1.9, marginBottom:40, fontSize:".95rem" }}>
              Our formulations are developed by dermatologists specializing in melanin-rich skin, with clinical trials conducted on diverse skin tones. Clean actives. Proven results. Unapologetic luxury.
            </p>

            {/* Counter stats */}
            <div className="reveal" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
              {[["23","Actives"],["0","Toxins"],["6yrs","Research"]].map(([n,l]) => (
                <div key={l} style={{
                  padding:"20px 16px", borderRadius:16, background:"rgba(182,141,116,0.08)",
                  border:"1px solid rgba(182,141,116,0.2)", textAlign:"center",
                }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:800, color:"var(--dark)" }}>{n}</div>
                  <div style={{ fontSize:".7rem", letterSpacing:".1em", textTransform:"uppercase", color:"var(--muted)", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="stories" style={{ padding:"120px 48px", background:"var(--bg2)", position:"relative", overflow:"hidden" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:72 }}>
          <p style={{ fontSize:".72rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--accent)", marginBottom:16 }}>Real Results</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.5rem)", fontWeight:700, color:"var(--dark)" }}>
            The Glow <em>Speaks.</em>
          </h2>
        </div>

        <div style={{ overflow:"hidden", position:"relative" }}>
          <div className="carousel-track" style={{ transform:`translateX(-${active * 100}%)` }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ minWidth:"100%", padding:"0 12px" }}>
                <div className="glass" style={{
                  borderRadius:28, padding:"48px 56px",
                  boxShadow:"0 24px 80px rgba(30,27,24,0.07)",
                  display:"grid", gridTemplateColumns:"1fr auto", gap:48, alignItems:"start",
                }}>
                  <div>
                    {/* Stars */}
                    <div style={{ display:"flex", gap:4, marginBottom:28 }}>
                      {Array(t.rating).fill(0).map((_, j) => (
                        <span key={j} style={{ color:"var(--accent)", fontSize:"1.1rem" }}>★</span>
                      ))}
                    </div>
                    <blockquote style={{
                      fontFamily:"'Cormorant Garamond',serif",
                      fontSize:"clamp(1.3rem,2.2vw,1.9rem)", fontWeight:400, lineHeight:1.5,
                      color:"var(--dark)", fontStyle:"italic", marginBottom:32,
                    }}>
                      "{t.text}"
                    </blockquote>
                    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                      <img src={t.img} alt={t.name} style={{ width:48, height:48, borderRadius:"50%", objectFit:"cover" }} />
                      <div>
                        <div style={{ fontWeight:600, color:"var(--dark)", fontSize:".9rem" }}>{t.name}</div>
                        <div style={{ fontSize:".75rem", color:"var(--muted)", marginTop:2 }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                  {/* Before/After */}
                  <div className="hide-mobile" style={{
                    padding:"24px 28px", borderRadius:20,
                    background:"rgba(182,141,116,0.08)", border:"1px solid rgba(182,141,116,0.2)",
                    textAlign:"center", minWidth:180,
                  }}>
                    <div style={{ fontSize:".65rem", letterSpacing:".12em", textTransform:"uppercase", color:"var(--muted)", marginBottom:12 }}>Transformation</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:".95rem", color:"var(--muted)", marginBottom:6 }}>{t.before}</div>
                    <div style={{ fontSize:"1.2rem", color:"var(--accent)" }}>↓</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontWeight:600, color:"var(--dark)", marginTop:6 }}>{t.after}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:36 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: i === active ? 28 : 8, height:8, borderRadius:4,
                background: i === active ? "var(--accent)" : "rgba(182,141,116,0.3)",
                border:"none", cursor:"none",
                transition:"all .4s cubic-bezier(.23,1,.32,1)",
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Routine() {
  return (
    <section id="ritual" style={{ padding:"120px 48px", background:"var(--bg)" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:80 }}>
          <p style={{ fontSize:".72rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--accent)", marginBottom:16 }}>The System</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.5rem)", fontWeight:700, color:"var(--dark)" }}>
            Your 4-Step<br/><em>Ritual.</em>
          </h2>
        </div>

        <div style={{ position:"relative" }}>
          {/* Connecting line */}
          <div style={{
            position:"absolute", left:32, top:48, bottom:48, width:1,
            background:"linear-gradient(to bottom, var(--accent), transparent)",
          }} />

          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {ROUTINE.map((s, i) => (
              <div key={s.step} className="routine-step reveal" style={{
                display:"flex", gap:32, alignItems:"flex-start", padding:"28px 0",
                borderBottom: i < ROUTINE.length - 1 ? "1px solid rgba(182,141,116,0.12)" : "none",
                transitionDelay: `${i * .1}s`,
              }}>
                {/* Step number */}
                <div style={{
                  width:64, height:64, borderRadius:"50%", flexShrink:0,
                  background:`rgba(182,141,116,0.1)`, border:`1.5px solid ${s.color}40`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontSize:".8rem", fontWeight:700, color:s.color,
                  transition:"all .4s",
                  zIndex:1, position:"relative",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `rgba(182,141,116,0.1)`; e.currentTarget.style.color = s.color; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {s.step}
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:8 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", fontWeight:700, color:"var(--dark)" }}>{s.title}</h3>
                    <span style={{
                      padding:"4px 12px", borderRadius:"100px",
                      background:"rgba(182,141,116,0.1)", fontSize:".65rem", color:"var(--accent)",
                      letterSpacing:".1em", textTransform:"uppercase",
                    }}>{s.time}</span>
                  </div>
                  <p style={{ color:"var(--muted)", marginBottom:10, lineHeight:1.7, fontSize:".9rem" }}>{s.desc}</p>
                  <div className="step-detail">
                    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px", borderRadius:12, background:"rgba(182,141,116,0.08)" }}>
                      <span style={{ color:"var(--accent)", fontSize:".9rem" }}>✦</span>
                      <span style={{ fontSize:".82rem", color:"var(--muted)", fontStyle:"italic" }}>{s.tip}</span>
                    </div>
                    <div style={{ marginTop:12, fontSize:".78rem", color:"var(--accent)", letterSpacing:".06em" }}>Use: <strong style={{ color:"var(--dark)" }}>{s.product}</strong></div>
                  </div>
                </div>

                <div style={{
                  fontSize:"1.4rem", color:"rgba(182,141,116,0.2)",
                  fontFamily:"'Playfair Display',serif", fontWeight:700,
                  flexShrink:0, alignSelf:"center",
                }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section style={{
      padding:"120px 48px", position:"relative", overflow:"hidden",
      background:"linear-gradient(150deg, #1E1B18 0%, #2D2017 50%, #1E1B18 100%)",
    }}>
      {/* Orbs */}
      <div className="orb" style={{ width:500, height:500, background:"rgba(182,141,116,0.08)", top:-120, right:-100, animation:"floatY 10s ease-in-out infinite" }} />
      <div className="orb" style={{ width:300, height:300, background:"rgba(182,141,116,0.12)", bottom:-60, left:80, animation:"floatY 8s 2s ease-in-out infinite" }} />
      <Particles />

      <div style={{ maxWidth:700, margin:"0 auto", position:"relative", zIndex:2, textAlign:"center" }}>
        <div className="reveal">
          <p style={{ fontSize:".72rem", letterSpacing:".2em", textTransform:"uppercase", color:"var(--accent)", marginBottom:20 }}>The Velora Edit</p>
          <h2 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(3rem,7vw,5.5rem)",
            fontWeight:800, color:"#F7F2EE", lineHeight:1.05, marginBottom:20,
          }}>
            Glow Starts<br/><em className="gradient-text">Here.</em>
          </h2>
          <p style={{ color:"#9A8A80", fontSize:"1rem", lineHeight:1.7, marginBottom:48, maxWidth:460, margin:"0 auto 48px" }}>
            Join 50,000+ women who receive exclusive formulation insights, early access, and rituals for radiant skin.
          </p>
        </div>

        <div className="reveal" style={{ display:"flex", gap:0, maxWidth:480, margin:"0 auto" }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              flex:1, padding:"18px 24px", borderRadius:"100px 0 0 100px",
              border:"1px solid rgba(182,141,116,0.3)", borderRight:"none",
              background:"rgba(247,242,238,0.05)", color:"#F7F2EE",
              fontSize:".88rem", outline:"none",
              fontFamily:"Inter,sans-serif",
            }}
          />
          <button
            className="mag-btn"
            onClick={() => { setSent(true); setEmail(""); }}
            style={{
              padding:"18px 28px", borderRadius:"0 100px 100px 0",
              background:"linear-gradient(135deg,var(--accent),var(--gold))",
              color:"#fff", border:"none", cursor:"none",
              fontSize:".78rem", letterSpacing:".12em", fontFamily:"Inter,sans-serif",
              fontWeight:600, textTransform:"uppercase",
            }}
          >
            {sent ? "✓ Joined" : "Subscribe →"}
          </button>
        </div>
        {sent && <p style={{ color:"var(--accent)", fontSize:".8rem", marginTop:16, animation:"fade-in .5s" }}>Welcome to the ritual. ✦</p>}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding:"64px 48px 40px", background:"var(--dark)", position:"relative", overflow:"hidden" }}>
      {/* Glow line */}
      <div style={{ height:1, background:"linear-gradient(90deg,transparent,var(--accent),transparent)", marginBottom:56 }} />

      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:56 }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:700, color:"#F7F2EE", marginBottom:16 }}>
              VELORA <span className="gradient-text">SKIN</span>
            </div>
            <p style={{ color:"#6B5D55", lineHeight:1.8, fontSize:".88rem", maxWidth:280 }}>
              Luxury skincare engineered for melanin-rich skin. Clean science. Unapologetic glow.
            </p>
            {/* Socials */}
            <div style={{ display:"flex", gap:12, marginTop:28 }}>
              {["IG","TK","PT","YT"].map((s) => (
                <div key={s} style={{
                  width:36, height:36, borderRadius:"50%",
                  border:"1px solid rgba(182,141,116,0.3)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"none", transition:"all .3s",
                  color:"#9A8A80", fontSize:".65rem", fontWeight:600, letterSpacing:".05em",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(182,141,116,0.3)"; e.currentTarget.style.color = "#9A8A80"; }}
                >{s}</div>
              ))}
            </div>
          </div>
          {[
            ["Collections", ["Serums","Moisturizers","Cleansers","SPF","Oils"]],
            ["Company",     ["Our Story","Science Lab","Careers","Press","Stockists"]],
            ["Support",     ["Track Order","Returns","Skin Quiz","FAQ","Contact"]],
          ].map(([head, links]) => (
            <div key={head}>
              <div style={{ fontSize:".7rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--accent)", marginBottom:20 }}>{head}</div>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:12 }}>
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" style={{ color:"#6B5D55", fontSize:".85rem", textDecoration:"none", transition:"color .3s" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#C4B4AC"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#6B5D55"}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop:"1px solid rgba(182,141,116,0.1)", paddingTop:28, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <p style={{ fontSize:".72rem", color:"#4A3D38", letterSpacing:".06em" }}>© 2024 VELORA SKIN. All rights reserved. Formulated with intention.</p>
          <div style={{ display:"flex", gap:24 }}>
            {["Privacy","Terms","Cookie Policy"].map((l) => (
              <a key={l} href="#" style={{ fontSize:".72rem", color:"#4A3D38", textDecoration:"none", letterSpacing:".06em" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function VeloraSkin() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useScrollReveal();

  return (
    <>
      <style>{globalStyles}</style>
      <Cursor />
      <ScrollProgress />
      <Navbar scrollY={scrollY} />
      <main>
        <Hero />
        <Products />
        <SkinAnalysis />
        <About />
        <Testimonials />
        <Routine />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}


