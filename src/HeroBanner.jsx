import { useContext } from "react";
import { ThemeCtx } from "./theme.js";

/**
 * HeroBanner
 * ─────────────────────────────────────────────────────────────
 * No props required — reads theme from context automatically.
 * ─────────────────────────────────────────────────────────────
 */
export default function HeroBanner() {
  const t = useContext(ThemeCtx);

  const blobs = [
    { size: 320, top: -100, right: -60, left: undefined, bottom: undefined, opacity: 0.07 },
    { size: 180, top: undefined, right: undefined, bottom: -60, left: 80,   opacity: 0.05 },
  ];

  return (
    <div style={{
      padding:      "56px clamp(18px, 5vw, 64px) 48px",
      background:   t.surface,
      borderBottom: `1px solid ${t.border}`,
      position:     "relative",
      overflow:     "hidden",
      boxShadow: "2px -6px 12px 6px",
      transition:   "background 0.3s",
    }}>

      {/* Decorative accent blobs */}
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position:     "absolute",
            width:        b.size,
            height:       b.size,
            top:          b.top,
            right:        b.right,
            bottom:       b.bottom,
            left:         b.left,
            borderRadius: "50%",
            background:   t.accent,
            opacity:      b.opacity,
            pointerEvents:"none",
          }}
        />
      ))}

      {/* Headline */}
      <h1 style={{
        fontFamily:    "'Cinzel', serif",
        fontWeight:    900,
        fontSize:      "clamp(2rem, 5vw, 3.4rem)",
        color:         t.text,
        lineHeight:    1.1,
        marginBottom:  16,
        letterSpacing: "0.02em",
      }}>
        Posters For Every<br />
        <span style={{ color: t.accent }}>Passion You Love</span>
      </h1>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {[["⛩️", "Anime", "#e8a838"], ["🏎️", "Cars", "#e05c3a"]].map(([icon, lbl, col]) => (
          <span key={lbl} style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           5,
            background:    `${col}18`,
            border:        `1px solid ${col}44`,
            borderRadius:  20,
            padding:       "4px 12px",
            fontFamily:    "'Cinzel', serif",
            fontSize:      "0.68rem",
            fontWeight:    600,
            color:         col,
            letterSpacing: "0.06em",
          }}>{icon} {lbl}</span>
        ))}
      </div>

      {/* Tagline */}
      <p style={{
        color:         t.textSub,
        fontFamily:    "'Cinzel', serif",
        fontSize:      "0.82rem",
        letterSpacing: "0.04em",
        lineHeight:    1.8,
      }}>
        Premium quality posters · Affordable Pricing · Fast delivery
      </p>

      {/* Stats row */}
      <div style={{
        display:   "flex",
        gap:       32,
        marginTop: 32,
        flexWrap:  "wrap",
      }}>
        {[["30+", "Posters"], ["₹49", "Delivery"], ["5★", "Rated"]].map(([num, label]) => (
          <div key={label}>
            <p style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 900,
              fontSize:   "1.3rem",
              color:      t.accent,
              margin:     0,
            }}>{num}</p>
            <p style={{
              fontFamily:    "'Cinzel', serif",
              fontSize:      "0.65rem",
              color:         t.textSub,
              letterSpacing: "0.1em",
              margin:        "2px 0 0",
              textTransform: "uppercase",
            }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
