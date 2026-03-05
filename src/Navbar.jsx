import { useContext } from "react";
import { ThemeCtx, CartCtx } from "./theme.js";

/**
 * Navbar
 * ─────────────────────────────────────────────────────────────
 * Props:
 *   dark    {boolean}             — current theme state
 *   setDark {(boolean) => void}   — toggles dark / light mode
 * ─────────────────────────────────────────────────────────────
 */
export default function Navbar({ dark, setDark }) {
  const t                     = useContext(ThemeCtx);
  const { cart, setCartOpen } = useContext(CartCtx);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav style={{
      position:      "sticky",
      top:           0,
      zIndex:        100,
      background:    t.surface,
      borderBottom:  `1px solid ${t.border}`,
      padding:       "0 clamp(18px, 5vw, 64px)",
      display:       "flex",
      alignItems:    "center",
      justifyContent:"space-between",
      height:        64,
      backdropFilter:"blur(10px)",
      transition:    "background 0.3s",
    }}>

      {/* ── Logo ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>⛩️</span>
        <span style={{
          fontFamily:    "'Cinzel', serif",
          fontWeight:    900,
          fontSize:      "1.25rem",
          color:         t.accent,
          letterSpacing: "0.06em",
        }}>ANIMART</span>
      </div>

      {/* ── Right controls ────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {/* Dark / Light toggle pill */}
        <button
          onClick={() => setDark(d => !d)}
          title="Toggle theme"
          style={{
            position:     "relative",
            width:        52,
            height:       26,
            borderRadius: 26,
            background:   dark ? "#2a2a2a" : "#e8e0d5",
            border:       `1.5px solid ${t.border}`,
            cursor:       "pointer",
            transition:   "background 0.3s",
            flexShrink:   0,
          }}
        >
          <div style={{
            position:      "absolute",
            top:           3,
            left:          dark ? 27 : 3,
            width:         18,
            height:        18,
            borderRadius:  "50%",
            background:    t.accent,
            display:       "flex",
            alignItems:    "center",
            justifyContent:"center",
            fontSize:      "0.58rem",
            transition:    "left 0.24s cubic-bezier(.4,0,.2,1)",
            boxShadow:     "0 1px 4px rgba(0,0,0,0.3)",
          }}>
            {dark ? "🌙" : "☀️"}
          </div>
        </button>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(true)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.accent}55`; }}
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           8,
            background:    t.accentSoft,
            border:        `1.5px solid ${t.accent}55`,
            borderRadius:  30,
            padding:       "7px 18px",
            cursor:        "pointer",
            position:      "relative",
            transition:    "border-color 0.2s",
          }}
        >
          <span style={{ fontSize: "1rem" }}>🛒</span>
          <span style={{
            fontFamily:    "'Cinzel', serif",
            fontWeight:    700,
            fontSize:      "0.78rem",
            color:         t.accent,
            letterSpacing: "0.04em",
          }}>Cart</span>

          {/* Item count badge */}
          {totalItems > 0 && (
            <span style={{
              background:    t.btnBg,
              color:         t.btnText,
              borderRadius:  "50%",
              width:         20,
              height:        20,
              fontSize:      "0.65rem",
              fontWeight:    800,
              display:       "flex",
              alignItems:    "center",
              justifyContent:"center",
              fontFamily:    "'Cinzel', serif",
              boxShadow:     "0 2px 6px rgba(0,0,0,0.25)",
            }}>{totalItems}</span>
          )}
        </button>
      </div>
    </nav>
  );
}
