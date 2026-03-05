import { useState, useContext } from "react";
import { ThemeCtx, CartCtx } from "./theme.js";

// Emoji shown when no image is available
const PLACEHOLDER_EMOJI = ["⛩️","🗡️","⚡","🔥","💫","🌊","⚔️","🌸","🏯","🎋","🐉","📓"];

const MAX_QTY = 10;

/**
 * AnimeCard
 * ─────────────────────────────────────────────────────────────
 * Required props:
 *   title  {string}  — poster title shown below the image
 *   price  {number}  — price in INR (e.g. 849)
 *
 * Optional props:
 *   id     {number}  — used for the emoji placeholder fallback
 *   image  {string}  — URL of the poster image
 *                      if omitted, a styled emoji placeholder is shown
 * ─────────────────────────────────────────────────────────────
 * Usage examples:
 *
 *   // With image URL
 *   <AnimeCard title="Naruto" price={699} id={1} image="https://..." />
 *
 *   // Without image — shows emoji placeholder automatically
 *   <AnimeCard title="My Anime" price={799} id={2} />
 */
export default function AnimeCard({ title, price, id, image }) {
  const t             = useContext(ThemeCtx);
  const { addToCart } = useContext(CartCtx);

  const [showQty, setShowQty] = useState(false);
  const [qty,     setQty]     = useState(1);
  const [done,    setDone]    = useState(false);
  const [imgErr,  setImgErr]  = useState(false);
  const [hovered, setHovered] = useState(false);

  // Resolve which image to display
  const imgSrc = image || null;
  const emoji  = PLACEHOLDER_EMOJI[((id ?? 1) - 1) % PLACEHOLDER_EMOJI.length];

  // ── Quantity handlers ────────────────────────────────────────
  const decreaseQty = () => {
    if (qty <= 1) {
      // pressing − at qty=1 collapses the qty row and resets the card
      setShowQty(false);
      setQty(1);
    } else {
      setQty(q => q - 1);
    }
  };

  const increaseQty = () => setQty(q => Math.min(MAX_QTY, q + 1));

  // ── Main button handler ──────────────────────────────────────
  const handleBtn = () => {
    if (!showQty) {
      // First click — show quantity selector
      setShowQty(true);
      return;
    }
    // Second click — confirm add to cart
    addToCart({ id, title, price, image: imgSrc }, qty);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setShowQty(false);
      setQty(1);
    }, 1500);
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    t.surface,
        border:        `2px solid ${hovered ? t.accent : t.border}`,
        // border:         `1.5px solid ${t.accent}`,
        borderRadius:  16,
        overflow:      "hidden",
        display:       "flex",
        flexDirection: "column",
        cursor:        "default",
        transition:    "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.2s",
        transform:     hovered ? "translateY(-6px)" : "none",
        boxShadow:     hovered
          ? `0 16px 40px ${t.shadow}, 0 0 0 1px ${t.accent}22`
          : `0 2px 8px ${t.shadow}`,
      }}
    >
      {/* ── Poster image ─────────────────────────────────────── */}
      <div style={{
        position:   "relative",
        aspectRatio:"3/4",
        overflow:   "hidden",
        background: t.surfaceHigh,
      }}>
        {(!imgSrc || imgErr) ? (
          // Styled emoji placeholder
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 10,
            background: `linear-gradient(145deg, ${t.surfaceHigh}, ${t.surface})`,
          }}>
            <span style={{
              fontSize: "3.2rem",
              filter:   "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
            }}>{emoji}</span>
            <span style={{
              color:         t.accent,
              fontFamily:    "'Cinzel', serif",
              fontSize:      "0.62rem",
              fontWeight:    700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity:       0.7,
            }}>Anime Print</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={title}
            onError={() => setImgErr(true)}
            style={{
              width:      "100%",
              height:     "100%",
              objectFit:  "cover",
              display:    "block",
              transition: "transform 0.45s ease",
              transform:  hovered ? "scale(1.07)" : "scale(1)",
            }}
          />
        )}

        {/* Gold shimmer overlay on hover */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: `linear-gradient(135deg, ${t.accentSoft} 0%, transparent 60%)`,
          opacity:    hovered ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }} />

        {/* Price badge */}
        <div style={{
          position:      "absolute",
          top:           10,
          right:         10,
          background:    t.btnBg,
          color:         t.btnText,
          fontFamily:    "'Cinzel', serif",
          fontWeight:    700,
          fontSize:      "0.72rem",
          padding:       "3px 9px",
          borderRadius:  20,
          boxShadow:     "0 2px 8px rgba(0,0,0,0.25)",
          letterSpacing: "0.03em",
        }}>₹{price.toLocaleString()}</div>
      </div>

      {/* ── Info & controls ───────────────────────────────────── */}
      <div style={{
        padding:       "14px 14px 16px",
        display:       "flex",
        flexDirection: "column",
        gap:           10,
        flex:          1,
      }}>
        {/* Title */}
        <p style={{
          fontFamily:    "'Cinzel', serif",
          fontWeight:    600,
          fontSize:      "0.82rem",
          color:         t.text,
          margin:        0,
          lineHeight:    1.45,
          letterSpacing: "0.01em",
        }}>{title}</p>

        {/* Decorative divider */}
        <div style={{
          height:     1,
          background: `linear-gradient(90deg, ${t.accent}55, transparent)`,
        }} />

        {/* Quantity selector — visible after first "Add to Cart" click */}
        {showQty && !done && (
          <div style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            4,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
              {/* Decrease / cancel button */}
              <button
                onClick={decreaseQty}
                style={{
                  width:          28,
                  height:         28,
                  borderRadius:   7,
                  border:         `1.5px solid ${qty === 1 ? t.danger : t.border}`,
                  background:     t.surfaceHigh,
                  color:          qty === 1 ? t.danger : t.text,
                  cursor:         "pointer",
                  fontSize:       "1.1rem",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontFamily:     "inherit",
                }}
              >−</button>

              {/* Current quantity */}
              <span style={{
                color:         t.accent,
                fontFamily:    "'Cinzel', serif",
                fontWeight:    700,
                fontSize:      "1rem",
                minWidth:      20,
                textAlign:     "center",
              }}>{qty}</span>

              {/* Increase button */}
              <button
                onClick={increaseQty}
                style={{
                  width:          28,
                  height:         28,
                  borderRadius:   7,
                  border:         `1.5px solid ${t.border}`,
                  background:     t.surfaceHigh,
                  color:          qty >= MAX_QTY ? t.textSub : t.text,
                  cursor:         qty >= MAX_QTY ? "not-allowed" : "pointer",
                  fontSize:       "1.1rem",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontFamily:     "inherit",
                }}
              >+</button>
            </div>

            {/* Max qty hint */}
            {qty >= MAX_QTY && (
              <span style={{
                color:         t.textSub,
                fontSize:      "0.6rem",
                letterSpacing: "0.06em",
              }}>MAX 10</span>
            )}
          </div>
        )}

        {/* Add to Cart button */}
        <button
          onClick={handleBtn}
          style={{
            marginTop:     "auto",
            background:    done ? t.success : showQty ? t.btnBg : "transparent",
            color:         done || showQty ? t.btnText : t.accent,
            border:        `1.5px solid ${done ? t.success : t.btnBg}`,
            borderRadius:  9,
            padding:       "9px 0",
            fontFamily:    "'Cinzel', serif",
            fontWeight:    700,
            fontSize:      "0.74rem",
            letterSpacing: "0.07em",
            cursor:        "pointer",
            transition:    "all 0.2s ease",
            width:         "100%",
          }}
        >
          {done ? "✓  ADDED TO CART" : showQty ? `ADD ${qty}  →` : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
