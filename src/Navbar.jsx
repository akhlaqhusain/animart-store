import { useState, useEffect, useContext } from "react";
import { ThemeCtx, CartCtx } from "./theme.js";

const SECTIONS = [
  { key: "anime", label: "Anime", emoji: "⛩️", color: "#e8a838" },
  { key: "cars",  label: "Cars",  emoji: "🏎️", color: "#e05c3a" },
];

/**
 * Navbar
 * ─────────────────────────────────────────────────────────────
 * Single sticky row:
 *   Logo  |  Anime · Cars · Cartoons  |  theme-toggle  cart
 *
 * Clicking a section link smoothly scrolls to the matching
 * <section id="anime"> / <section id="cars"> / <section id="cartoons">
 * in the page and highlights that link.
 *
 * On mobile (< 640 px) the section links hide behind a ☰ button
 * that opens a slide-down drawer.
 *
 * Props:
 *   dark    {boolean}  — current theme
 *   setDark {fn}       — toggle theme
 */
export default function Navbar({ dark, setDark }) {
  const t                     = useContext(ThemeCtx);
  const { cart, setCartOpen } = useContext(CartCtx);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  // ── Scroll to section ────────────────────────────────────────
  const scrollTo = (key) => {
    const el = document.getElementById(key);
    if (el) {
      // offset by navbar height so the section header isn't hidden
      const navH = document.querySelector("nav")?.offsetHeight ?? 80;
      const top  = el.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setActiveKey(key);
    setMenuOpen(false);
  };

  // ── Highlight active section on scroll ──────────────────────
  useEffect(() => {
    const onScroll = () => {
      const navH = document.querySelector("nav")?.offsetHeight ?? 80;
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.key);
        if (el && el.getBoundingClientRect().top <= navH + 40) {
          setActiveKey(s.key);
          return;
        }
      }
      setActiveKey(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Shared nav link ──────────────────────────────────────────
  const NavLink = ({ section, vertical = false }) => {
    const isActive = activeKey === section.key;
    const col      = section.color;
    return (
      <button
        onClick={() => scrollTo(section.key)}
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            6,
          padding:        vertical ? "12px 20px" : "0 16px",
          height:         vertical ? "auto" : "100%",
          background:     vertical && isActive ? `${col}12` : "transparent",
          border:         "none",
          borderBottom:   !vertical ? (isActive ? `2.5px solid ${col}` : "2.5px solid transparent") : "none",
          borderLeft:     vertical ? (isActive ? `3px solid ${col}` : "3px solid transparent") : "none",
          cursor:         "pointer",
          fontFamily:     "'Cinzel', serif",
          fontWeight:     isActive ? 700 : 500,
          fontSize:       "0.73rem",
          letterSpacing:  "0.08em",
          color:          isActive ? col : t.textSub,
          whiteSpace:     "nowrap",
          transition:     "color 0.18s, border-color 0.18s, background 0.18s",
          width:          vertical ? "100%" : "auto",
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = col; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = t.textSub; }}
      >
        <span style={{ fontSize: "1rem" }}>{section.emoji}</span>
        {section.label.toUpperCase()}
      </button>
    );
  };

  return (
    <>
      <style>{`
        .nb-links  { display: flex; align-items: stretch; }
        .nb-burger { display: none !important; }
        @media (max-width: 639px) {
          .nb-links  { display: none !important; }
          .nb-burger { display: flex !important; }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav style={{
        position:       "sticky",
        top:            0,
        zIndex:         200,
        background:     t.surface,
        borderBottom:   `1px solid ${t.border}`,
        backdropFilter: "blur(12px)",
        transition:     "background 0.3s",
      }}>

        {/* ── Single main row ────────────────────────────────── */}
        <div style={{
          display:        "flex",
          alignItems:     "stretch",
          justifyContent: "space-between",
          padding:        "0 clamp(18px, 5vw, 64px)",
          height:         60,
        }}>

          {/* Logo — click scrolls back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        8,
              flexShrink: 0,
              background: "none",
              border:     "none",
              padding:    0,
              cursor:     "pointer",
            }}
          >
            <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>⛩️</span>
            <span style={{
              fontFamily:    "'Cinzel', serif",
              fontWeight:    900,
              fontSize:      "1.2rem",
              color:         t.accent,
              letterSpacing: "0.06em",
            }}>ANIMART</span>
          </button>

          {/* ── Centre: section links (desktop) ─────────────── */}
          <div className="nb-links" style={{ gap: 0 }}>
            {SECTIONS.map(s => <NavLink key={s.key} section={s} />)}
          </div>

          {/* ── Right: controls ─────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* Theme toggle */}
            <button
              onClick={() => setDark(d => !d)}
              title="Toggle theme"
              style={{
                position:     "relative",
                width:        50, height: 25,
                borderRadius: 25,
                background:   dark ? "#2a2a2a" : "#e8e0d5",
                border:       `1.5px solid ${t.border}`,
                cursor:       "pointer",
                transition:   "background 0.3s",
                flexShrink:   0,
              }}
            >
              <div style={{
                position:       "absolute",
                top:            3,
                left:           dark ? 26 : 3,
                width:          17, height: 17,
                borderRadius:   "50%",
                background:     t.accent,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       "0.55rem",
                transition:     "left 0.24s cubic-bezier(.4,0,.2,1)",
                boxShadow:      "0 1px 4px rgba(0,0,0,0.3)",
              }}>{dark ? "🌙" : "☀️"}</div>
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${t.accent}55`}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            7,
                background:     t.accentSoft,
                border:         `1.5px solid ${t.accent}55`,
                borderRadius:   30,
                padding:        "6px 16px",
                cursor:         "pointer",
                position:       "relative",
                transition:     "border-color 0.2s",
                flexShrink:     0,
              }}
            >
              <span style={{ fontSize: "0.95rem" }}>🛒</span>
              <span style={{
                fontFamily:    "'Cinzel', serif",
                fontWeight:    700,
                fontSize:      "0.75rem",
                color:         t.accent,
                letterSpacing: "0.04em",
              }}>Cart</span>
              {totalItems > 0 && (
                <span style={{
                  background:     t.btnBg,
                  color:          t.btnText,
                  borderRadius:   "50%",
                  width:          19, height: 19,
                  fontSize:       "0.62rem",
                  fontWeight:     800,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontFamily:     "'Cinzel', serif",
                  boxShadow:      "0 2px 6px rgba(0,0,0,0.25)",
                }}>{totalItems}</span>
              )}
            </button>

            {/* ── Hamburger (mobile only) ────────────────────── */}
            <button
              className="nb-burger"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display:        "none",
                flexDirection:  "column",
                justifyContent: "center",
                alignItems:     "center",
                gap:            5,
                width:          36, height: 36,
                background:     t.surfaceHigh,
                border:         `1.5px solid ${t.border}`,
                borderRadius:   8,
                cursor:         "pointer",
                padding:        0,
                flexShrink:     0,
              }}
            >
              {menuOpen
                ? <span style={{ color: t.accent, fontSize: "1.1rem", lineHeight: 1 }}>✕</span>
                : [0,1,2].map(i => (
                    <div key={i} style={{
                      width: 20, height: 2, borderRadius: 2,
                      background: t.text, transition: "background 0.2s",
                    }} />
                  ))
              }
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ──────────────────────────────────── */}
        {menuOpen && (
          <div style={{
            position:    "absolute",
            top:         "100%",
            left:        0, right: 0,
            background:  t.surface,
            borderBottom:`1px solid ${t.border}`,
            boxShadow:   `0 8px 24px ${t.shadow}`,
            zIndex:      300,
            animation:   "fadeDown 0.2s ease",
          }}>
            {/* Section links */}
            <div style={{ padding: "8px 0" }}>
              <p style={{
                padding:       "8px 20px 4px",
                color:         t.textSub,
                fontFamily:    "'Cinzel', serif",
                fontSize:      "0.58rem",
                fontWeight:    700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}>JUMP TO</p>
              {SECTIONS.map(s => <NavLink key={s.key} section={s} vertical />)}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: t.border, margin: "4px 20px" }} />

            {/* Theme toggle */}
            <div style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "12px 20px 16px",
            }}>
              <span style={{
                fontFamily:    "'Cinzel', serif",
                fontSize:      "0.7rem",
                fontWeight:    600,
                color:         t.textSub,
                letterSpacing: "0.08em",
              }}>{dark ? "DARK MODE" : "LIGHT MODE"}</span>
              <button
                onClick={() => setDark(d => !d)}
                style={{
                  position:     "relative",
                  width:        50, height: 25,
                  borderRadius: 25,
                  background:   dark ? "#2a2a2a" : "#e8e0d5",
                  border:       `1.5px solid ${t.border}`,
                  cursor:       "pointer",
                }}
              >
                <div style={{
                  position:       "absolute",
                  top: 3,
                  left:           dark ? 26 : 3,
                  width:          17, height: 17,
                  borderRadius:   "50%",
                  background:     t.accent,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "0.55rem",
                  transition:     "left 0.24s cubic-bezier(.4,0,.2,1)",
                }}>{dark ? "🌙" : "☀️"}</div>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
