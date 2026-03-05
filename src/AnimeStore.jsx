import { useState, useContext, createContext, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   THEME  — all design tokens live here
═══════════════════════════════════════════════════════════════ */
const THEMES = {
  dark: {
    bg:          "#0e0e0e",
    surface:     "#161616",
    surfaceHigh: "#1e1e1e",
    border:      "#2a2a2a",
    text:        "#f0f0f0",
    textSub:     "#777777",
    accent:      "#e8a838",
    accentSoft:  "rgba(232,168,56,0.12)",
    btnBg:       "#e8a838",
    btnText:     "#0e0e0e",
    success:     "#4caf7d",
    danger:      "#e05c5c",
    shadow:      "rgba(0,0,0,0.55)",
    overlay:     "rgba(0,0,0,0.72)",
    cardGlow:    "rgba(232,168,56,0.14)",
  },
  light: {
    bg:          "#f7f5f2",
    surface:     "#ffffff",
    surfaceHigh: "#f0ede8",
    border:      "#e0dbd4",
    text:        "#1a1a1a",
    textSub:     "#888888",
    accent:      "#c8871e",
    accentSoft:  "rgba(200,135,30,0.10)",
    btnBg:       "#c8871e",
    btnText:     "#ffffff",
    success:     "#2e9e5e",
    danger:      "#d44040",
    shadow:      "rgba(0,0,0,0.10)",
    overlay:     "rgba(0,0,0,0.38)",
    cardGlow:    "rgba(200,135,30,0.10)",
  },
};

/* ═══════════════════════════════════════════════════════════════
   CONTEXT
═══════════════════════════════════════════════════════════════ */
const ThemeCtx = createContext(THEMES.dark);
const CartCtx  = createContext(null);

/* ═══════════════════════════════════════════════════════════════
   PRODUCT DATA  — only title & price needed per card
   (image is optional; if omitted the card generates a stylised
    placeholder automatically)
═══════════════════════════════════════════════════════════════ */
const PRODUCTS = [
  { id: 1,  title: "Demon Slayer — Tanjiro",   price: 49  },
  { id: 2,  title: "Attack on Titan",           price: 49  },
  { id: 3,  title: "Jujutsu Kaisen — Gojo",     price: 49 },
  { id: 4,  title: "My Hero Academia",          price: 49  },
  { id: 5,  title: "Naruto — Uzumaki",          price: 49  },
  { id: 6,  title: "One Piece — Luffy",         price: 49  },
  { id: 7,  title: "Fullmetal Alchemist",       price: 49  },
  { id: 8,  title: "Tokyo Revengers",           price: 49  },
  { id: 9,  title: "Bleach — Ichigo",           price: 49  },
  { id: 10, title: "Sword Art Online",          price: 49  },
  { id: 11, title: "Dragon Ball Z — Goku",      price: 49  },
  { id: 12, title: "Death Note — Light",        price: 49  },
];

/* prettier poster images keyed by id */
const POSTER_URLS = {
  1:  "https://upload.wikimedia.org/wikipedia/en/5/50/Demon_Slayer_-_Mugen_Train_arc_poster.jpg",
  2:  "https://upload.wikimedia.org/wikipedia/en/d/d7/Attack_on_titan.jpg",
  3:  "https://upload.wikimedia.org/wikipedia/en/0/09/Jujutsu_kaisen.jpg",
  4:  "https://upload.wikimedia.org/wikipedia/en/5/5b/My_Hero_Academia_Volume_1.png",
  5:  "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
  6:  "https://upload.wikimedia.org/wikipedia/en/5/5a/One_piece_film_z_poster.png",
  7:  "https://upload.wikimedia.org/wikipedia/en/8/86/Fullmetal_Alchemist_anime_poster.jpg",
  8:  "https://upload.wikimedia.org/wikipedia/en/1/17/Tokyo_Revengers_Anime_Key_Visual_2.jpg",
  9:  "https://upload.wikimedia.org/wikipedia/en/b/be/Bleach_anime.jpg",
  10: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Sword_Art_Online_anime_logo.png/220px-Sword_Art_Online_anime_logo.png",
  11: "https://upload.wikimedia.org/wikipedia/en/a/a7/Dbz_logo.png",
  12: "https://upload.wikimedia.org/wikipedia/en/4/4c/Death_Note_anime_poster.jpg",
};

const PLACEHOLDER_EMOJI = ["⛩️","🗡️","⚡","🔥","💫","🌊","⚔️","🌸","🏯","🎋","🐉","📓"];

const DELIVERY = 49;

/* ═══════════════════════════════════════════════════════════════
   ░░  COMPONENT: AnimeCard
   Props:  title (string)  — required
           price (number)  — required
           id    (number)  — used internally for image lookup
   All other visual details are handled inside the component.
═══════════════════════════════════════════════════════════════ */
function AnimeCard({ title, price, id }) {
  const t                       = useContext(ThemeCtx);
  const { addToCart }           = useContext(CartCtx);
  const [showQty, setShowQty]   = useState(false);
  const [qty,     setQty]       = useState(1);
  const [done,    setDone]      = useState(false);
  const [imgErr,  setImgErr]    = useState(false);
  const [hovered, setHovered]   = useState(false);

  const imgSrc = POSTER_URLS[id];
  const emoji  = PLACEHOLDER_EMOJI[(id - 1) % PLACEHOLDER_EMOJI.length];

  const handleBtn = () => {
    if (!showQty) { setShowQty(true); return; }
    addToCart({ id, title, price, image: imgSrc }, qty);
    setDone(true);
    setTimeout(() => { setDone(false); setShowQty(false); setQty(1); }, 1500);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    t.surface,
        border:        `1.5px solid ${hovered ? t.accent : t.border}`,
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
      {/* ── Poster area ── */}
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: t.surfaceHigh }}>
        {(!imgSrc || imgErr) ? (
          /* Stylised placeholder */
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 10,
            background: `linear-gradient(145deg, ${t.surfaceHigh}, ${t.surface})`,
          }}>
            <span style={{ fontSize: "3.2rem", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>{emoji}</span>
            <span style={{
              color: t.accent, fontFamily: "'Cinzel', serif",
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", opacity: 0.7,
            }}>Anime Print</span>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={title}
            onError={() => setImgErr(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transition: "transform 0.45s ease",
              transform: hovered ? "scale(1.07)" : "scale(1)",
            }}
          />
        )}

        {/* Gold shine overlay on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${t.accentSoft} 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }} />

        {/* Price badge top-right */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: t.btnBg, color: t.btnText,
          fontFamily: "'Cinzel', serif", fontWeight: 700,
          fontSize: "0.72rem", padding: "3px 9px",
          borderRadius: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          letterSpacing: "0.03em",
        }}>₹{price.toLocaleString()}</div>
      </div>

      {/* ── Info area ── */}
      <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <p style={{
          fontFamily:  "'Cinzel', serif",
          fontWeight:  600,
          fontSize:    "0.82rem",
          color:       t.text,
          margin:      0,
          lineHeight:  1.45,
          letterSpacing: "0.01em",
        }}>{title}</p>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${t.accent}55, transparent)` }} />

        {/* Qty row — appears after first click */}
        {showQty && !done && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
              width: 28, height: 28, borderRadius: 7,
              border: `1.5px solid ${t.border}`,
              background: t.surfaceHigh, color: t.text,
              cursor: "pointer", fontSize: "1.1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "inherit",
            }}>−</button>
            <span style={{
              color: t.accent, fontFamily: "'Cinzel', serif",
              fontWeight: 700, fontSize: "1rem", minWidth: 20, textAlign: "center",
            }}>{qty}</span>
            <button onClick={() => setQty(q => Math.min(10,q+1))} style={{
              width: 28, height: 28, borderRadius: 7,
              border: `1.5px solid ${t.border}`,
              background: t.surfaceHigh, color: t.text,
              cursor: "pointer", fontSize: "1.1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "inherit",
            }}>+</button>
          </div>
        )}

        {/* CTA Button */}
        <button onClick={handleBtn} style={{
          marginTop:   "auto",
          background:  done ? t.success : showQty ? t.btnBg : "transparent",
          color:       done || showQty ? t.btnText : t.accent,
          border:      `1.5px solid ${done ? t.success : t.btnBg}`,
          borderRadius: 9,
          padding:     "9px 0",
          fontFamily:  "'Cinzel', serif",
          fontWeight:  700,
          fontSize:    "0.74rem",
          letterSpacing: "0.07em",
          cursor:      "pointer",
          transition:  "all 0.2s ease",
          width:       "100%",
        }}>
          {done ? "✓  ADDED TO CART" : showQty ? `ADD ${qty}  →` : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ░░  COMPONENT: Navbar
═══════════════════════════════════════════════════════════════ */
function Navbar({ dark, setDark }) {
  const t                        = useContext(ThemeCtx);
  const { cart, setCartOpen }    = useContext(CartCtx);
  const totalItems               = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <nav style={{
      position:      "sticky", top: 0, zIndex: 100,
      background:    t.surface,
      borderBottom:  `1px solid ${t.border}`,
      padding:       "0 clamp(18px,5vw,64px)",
      display:       "flex", alignItems: "center", justifyContent: "space-between",
      height:        64,
      backdropFilter:"blur(10px)",
      transition:    "background 0.3s",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>⛩️</span>
        <span style={{
          fontFamily:    "'Cinzel', serif",
          fontWeight:    900,
          fontSize:      "1.25rem",
          color:         t.accent,
          letterSpacing: "0.06em",
        }}>ANIMART</span>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize:   "0.58rem", fontWeight: 600,
          color:      t.textSub, letterSpacing: "0.15em",
          paddingBottom: 2,
        }}>OFFICIAL STORE</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Theme toggle */}
        <button
          onClick={() => setDark(d => !d)}
          title="Toggle theme"
          style={{
            position:     "relative",
            width:        52, height: 26,
            borderRadius: 26,
            background:   dark ? "#2a2a2a" : "#e8e0d5",
            border:       `1.5px solid ${t.border}`,
            cursor:       "pointer",
            transition:   "background 0.3s",
            flexShrink:   0,
          }}
        >
          <div style={{
            position:   "absolute",
            top:        3,
            left:       dark ? 27 : 3,
            width:      18, height: 18,
            borderRadius: "50%",
            background: t.accent,
            display:    "flex", alignItems: "center", justifyContent: "center",
            fontSize:   "0.58rem",
            transition: "left 0.24s cubic-bezier(.4,0,.2,1)",
            boxShadow:  "0 1px 4px rgba(0,0,0,0.3)",
          }}>{dark ? "🌙" : "☀️"}</div>
        </button>

        {/* Cart pill */}
        <button
          onClick={() => setCartOpen(true)}
          style={{
            display:     "flex", alignItems: "center", gap: 8,
            background:  t.accentSoft,
            border:      `1.5px solid ${t.accent}55`,
            borderRadius: 30,
            padding:     "7px 18px",
            cursor:      "pointer",
            position:    "relative",
            transition:  "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = t.accentSoft; e.currentTarget.style.borderColor = t.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.accent}55`; }}
        >
          <span style={{ fontSize: "1rem" }}>🛒</span>
          <span style={{
            fontFamily: "'Cinzel', serif", fontWeight: 700,
            fontSize: "0.78rem", color: t.accent, letterSpacing: "0.04em",
          }}>Cart</span>
          {totalItems > 0 && (
            <span style={{
              background: t.btnBg, color: t.btnText,
              borderRadius: "50%", width: 20, height: 20,
              fontSize: "0.65rem", fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Cinzel', serif",
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}>{totalItems}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ░░  COMPONENT: HeroBanner
═══════════════════════════════════════════════════════════════ */
function HeroBanner() {
  const t = useContext(ThemeCtx);
  return (
    <div style={{
      padding:      "56px clamp(18px,5vw,64px) 48px",
      background:   t.surface,
      borderBottom: `1px solid ${t.border}`,
      position:     "relative",
      overflow:     "hidden",
    }}>
      {/* decorative circle blobs */}
      {[
        { size: 320, top: -100, right: -60, opacity: 0.07 },
        { size: 180, bottom: -60, left: 80,  opacity: 0.05 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute",
          width:    b.size, height: b.size,
          top:      b.top, right: b.right, bottom: b.bottom, left: b.left,
          borderRadius: "50%",
          background: t.accent,
          opacity:   b.opacity,
          pointerEvents: "none",
        }} />
      ))}

      <p style={{
        fontFamily: "'Cinzel', serif", fontWeight: 700,
        fontSize: "0.68rem", letterSpacing: "0.22em",
        color: t.accent, marginBottom: 14,
        textTransform: "uppercase",
      }}>✦ Official Merchandise</p>

      <h1 style={{
        fontFamily: "'Cinzel', serif", fontWeight: 900,
        fontSize:   "clamp(2rem, 5vw, 3.4rem)",
        color:      t.text,
        lineHeight: 1.1,
        marginBottom: 16,
        letterSpacing: "0.02em",
      }}>
        Bring Your<br />
        <span style={{ color: t.accent }}>Favourite Anime</span><br />
        To Life
      </h1>

      <p style={{
        color:      t.textSub,
        fontFamily: "'Cinzel', serif",
        fontSize:   "0.82rem",
        letterSpacing: "0.04em",
        lineHeight: 1.8,
      }}>
        Premium art prints · Pan-India delivery · Easy returns
      </p>

      {/* stats row */}
      <div style={{ display: "flex", gap: 32, marginTop: 32, flexWrap: "wrap" }}>
        {[["12+", "Titles"], ["₹49", "Delivery"], ["5★", "Rated"]].map(([num, lbl]) => (
          <div key={lbl}>
            <p style={{ fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: "1.3rem", color: t.accent, margin: 0 }}>{num}</p>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", color: t.textSub, letterSpacing: "0.1em", margin: "2px 0 0", textTransform: "uppercase" }}>{lbl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ░░  COMPONENT: CartDrawer
═══════════════════════════════════════════════════════════════ */
function CartDrawer() {
  const t                                        = useContext(ThemeCtx);
  const { cart, cartOpen, setCartOpen,
          removeFromCart, updateQty,
          clearCart }                            = useContext(CartCtx);

  const [step,    setStep]  = useState("cart");
  const [addr,    setAddr]  = useState({ name:"", phone:"", street:"", city:"", state:"", pincode:"" });
  const [upiId,   setUpiId] = useState("");
  const [paying,  setPay]   = useState(false);

  const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total     = subtotal > 0 ? subtotal + DELIVERY : 0;
  const steps     = ["cart","address","payment"];
  const stepIdx   = steps.indexOf(step);
  const addrOk    = addr.name && addr.phone && addr.street && addr.city && addr.pincode;

  const handlePay = () => {
    setPay(true);
    setTimeout(() => { setPay(false); clearCart(); setStep("success"); }, 2400);
  };

  const handleClose = () => {
    setCartOpen(false);
    // Reset state after slide-out
    setTimeout(() => { setStep("cart"); setAddr({ name:"", phone:"", street:"", city:"", state:"", pincode:"" }); setUpiId(""); }, 300);
  };

  const inp = {
    width: "100%", boxSizing: "border-box",
    background: t.surfaceHigh, border: `1px solid ${t.border}`,
    borderRadius: 8, padding: "9px 12px",
    color: t.text, fontSize: "0.85rem",
    fontFamily: "'Cinzel', serif", outline: "none",
    transition: "border-color 0.15s",
  };

  const labelSt = {
    color: t.textSub, fontSize: "0.66rem", fontWeight: 700,
    display: "block", marginBottom: 5,
    textTransform: "uppercase", letterSpacing: "0.1em",
    fontFamily: "'Cinzel', serif",
  };

  if (!cartOpen) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: t.overlay, backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end" }}
    >
      <div style={{
        width:      "min(420px, 100vw)",
        background: t.surface,
        borderLeft: `1px solid ${t.border}`,
        height:     "100%",
        display:    "flex", flexDirection: "column",
        animation:  "slideIn 0.26s cubic-bezier(.4,0,.2,1)",
        fontFamily: "'Cinzel', serif",
      }}>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: `1px solid ${t.border}` }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "1rem", color: t.text, margin: 0, letterSpacing: "0.06em" }}>
              {step === "cart" ? "YOUR CART" : step === "address" ? "DELIVERY ADDRESS" : step === "payment" ? "PAYMENT" : ""}
            </h2>
            {step === "cart" && cart.length > 0 && (
              <p style={{ color: t.textSub, fontSize: "0.68rem", margin: "3px 0 0", letterSpacing: "0.08em" }}>{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
            )}
          </div>
          <button onClick={handleClose} style={{ background: t.surfaceHigh, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* step dots */}
        {step !== "success" && (
          <div style={{ display: "flex", alignItems: "center", padding: "12px 20px 6px", gap: 4 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", fontSize: "0.6rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: i < stepIdx ? t.success : i === stepIdx ? t.btnBg : t.surfaceHigh,
                  color: i <= stepIdx ? (i < stepIdx ? "#fff" : t.btnText) : t.textSub,
                  flexShrink: 0, transition: "background 0.25s",
                  fontFamily: "'Cinzel', serif",
                }}>{i < stepIdx ? "✓" : i + 1}</div>
                {i < 2 && <div style={{ flex: 1, height: 1.5, background: i < stepIdx ? t.success : t.border, margin: "0 4px", transition: "background 0.3s" }} />}
              </div>
            ))}
          </div>
        )}

        {/* body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 20px" }}>

          {/* SUCCESS */}
          {step === "success" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "3.5rem" }}>🎉</div>
              <h2 style={{ fontWeight: 900, fontSize: "1.3rem", color: t.success, margin: 0, letterSpacing: "0.06em" }}>ORDER PLACED!</h2>
              <p style={{ color: t.textSub, fontSize: "0.8rem", lineHeight: 1.8, margin: 0 }}>Your anime posters are on their way.<br />Estimated delivery: 3–5 business days.</p>
              <div style={{ background: t.surfaceHigh, border: `1px solid ${t.border}`, borderRadius: 10, padding: "12px 24px", marginTop: 4 }}>
                <p style={{ color: t.accent, fontWeight: 700, margin: 0, fontSize: "0.9rem" }}>Total Paid: ₹{total.toLocaleString()}</p>
              </div>
              <button onClick={handleClose} style={{ background: t.btnBg, color: t.btnText, border: "none", borderRadius: 9, padding: "10px 28px", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", marginTop: 8, fontFamily: "'Cinzel', serif", letterSpacing: "0.08em" }}>
                CONTINUE SHOPPING
              </button>
            </div>
          )}

          {/* CART */}
          {step === "cart" && (
            cart.length === 0
              ? <div style={{ textAlign: "center", paddingTop: 64, color: t.textSub }}>
                  <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🛒</div>
                  <p style={{ fontSize: "0.8rem", letterSpacing: "0.06em" }}>Your cart is empty.</p>
                </div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: "flex", gap: 11, background: t.surfaceHigh, borderRadius: 11, padding: "10px 12px", border: `1px solid ${t.border}` }}>
                      <div style={{ width: 50, height: 66, borderRadius: 7, overflow: "hidden", flexShrink: 0, background: t.border }}>
                        <img src={item.image} alt={item.title} onError={e => e.target.style.display = "none"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: t.text, fontWeight: 600, fontSize: "0.78rem", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.01em" }}>{item.title}</p>
                        <p style={{ color: t.accent, fontWeight: 700, fontSize: "0.82rem", margin: "0 0 7px" }}>₹{item.price.toLocaleString()}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit" }}>−</button>
                          <span style={{ color: t.text, fontWeight: 700, fontSize: "0.84rem" }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit" }}>+</button>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: "transparent", border: "none", color: t.danger, cursor: "pointer", fontSize: "0.85rem" }}>🗑</button>
                        <span style={{ color: t.text, fontWeight: 700, fontSize: "0.82rem" }}>₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}

                  {/* Bill */}
                  <div style={{ background: t.surfaceHigh, borderRadius: 11, padding: "13px 14px", border: `1px solid ${t.border}`, marginTop: 6 }}>
                    {[["Subtotal", `₹${subtotal.toLocaleString()}`], ["Delivery", `₹${DELIVERY}`]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={{ color: t.textSub, fontSize: "0.8rem" }}>{k}</span>
                        <span style={{ color: t.text, fontWeight: 600, fontSize: "0.8rem" }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: t.text, fontWeight: 700, fontSize: "0.88rem" }}>Total</span>
                      <span style={{ color: t.accent, fontWeight: 900, fontSize: "1rem" }}>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
          )}

          {/* ADDRESS */}
          {step === "address" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Full Name",     key: "name",    ph: "e.g. Naruto Uzumaki" },
                { label: "Phone",         key: "phone",   ph: "10-digit number" },
                { label: "Street / Area", key: "street",  ph: "House no., street, area" },
                { label: "City",          key: "city",    ph: "City" },
                { label: "State",         key: "state",   ph: "State" },
                { label: "Pincode",       key: "pincode", ph: "6-digit pincode" },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelSt}>{f.label}</label>
                  <input value={addr[f.key]} onChange={e => setAddr(a => ({ ...a, [f.key]: e.target.value }))} placeholder={f.ph} style={inp}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = t.border} />
                </div>
              ))}
            </div>
          )}

          {/* PAYMENT */}
          {step === "payment" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: t.accentSoft, border: `1.5px solid ${t.accent}44`, borderRadius: 11, padding: "16px", textAlign: "center" }}>
                <p style={{ color: t.textSub, fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>Amount to Pay</p>
                <p style={{ color: t.accent, fontWeight: 900, fontSize: "1.8rem", margin: 0, fontFamily: "'Cinzel', serif" }}>₹{total.toLocaleString()}</p>
              </div>

              <div style={{ background: t.surfaceHigh, border: `1px solid ${t.border}`, borderRadius: 11, padding: "18px", textAlign: "center" }}>
                <p style={{ color: t.text, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.06em", margin: "0 0 14px" }}>SCAN & PAY VIA UPI</p>
                <div style={{ background: "#ffffff", width: 90, height: 90, borderRadius: 10, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.4rem" }}>⬛</div>
                <p style={{ color: t.textSub, fontSize: "0.7rem", letterSpacing: "0.06em", margin: "0 0 10px" }}>OR ENTER UPI ID</p>
                <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ ...inp, textAlign: "center" }}
                  onFocus={e => e.target.style.borderColor = t.accent}
                  onBlur={e => e.target.style.borderColor = t.border} />
              </div>

              <div style={{ background: t.surfaceHigh, border: `1px solid ${t.border}`, borderRadius: 11, padding: "12px 14px" }}>
                <p style={{ color: t.textSub, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Delivering to</p>
                <p style={{ color: t.text, fontSize: "0.8rem", lineHeight: 1.7, margin: 0 }}>
                  {addr.name} · {addr.phone}<br />{addr.street}, {addr.city} – {addr.pincode}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* footer CTA */}
        {cart.length > 0 && step !== "success" && (
          <div style={{ padding: "12px 20px 20px", borderTop: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", gap: 8 }}>
              {stepIdx > 0 && (
                <button onClick={() => setStep(steps[stepIdx - 1])} style={{ flex: 1, background: t.surfaceHigh, color: t.textSub, border: `1px solid ${t.border}`, borderRadius: 9, padding: "11px 0", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer", fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>← BACK</button>
              )}
              {step === "cart" && (
                <button onClick={() => setStep("address")} style={{ flex: 1, background: t.btnBg, color: t.btnText, border: "none", borderRadius: 9, padding: "11px 0", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>CHECKOUT →</button>
              )}
              {step === "address" && (
                <button onClick={() => addrOk && setStep("payment")} style={{ flex: 2, background: addrOk ? t.btnBg : t.surfaceHigh, color: addrOk ? t.btnText : t.textSub, border: "none", borderRadius: 9, padding: "11px 0", fontWeight: 700, fontSize: "0.78rem", cursor: addrOk ? "pointer" : "default", fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
                  CONTINUE TO PAYMENT →
                </button>
              )}
              {step === "payment" && (
                <button onClick={handlePay} disabled={paying} style={{ flex: 2, background: paying ? t.surfaceHigh : t.success, color: paying ? t.textSub : "#fff", border: "none", borderRadius: 9, padding: "11px 0", fontWeight: 700, fontSize: "0.78rem", cursor: paying ? "default" : "pointer", fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
                  {paying ? "PROCESSING…" : `PAY ₹${total.toLocaleString()}`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ░░  ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [dark,     setDark]     = useState(true);
  const [cart,     setCart]     = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const t = dark ? THEMES.dark : THEMES.light;

  const addToCart = useCallback((product, qty) =>
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    }), []);

  const removeFromCart = useCallback(id => setCart(prev => prev.filter(i => i.id !== id)), []);
  const updateQty      = useCallback((id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, [removeFromCart]);
  const clearCart = useCallback(() => setCart([]), []);

  return (
    <ThemeCtx.Provider value={t}>
      <CartCtx.Provider value={{ cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${t.bg}; font-family: 'Cinzel', serif; transition: background 0.3s; min-height: 100vh; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
          @keyframes slideIn { from { transform: translateX(110%); } to { transform: translateX(0); } }
          @keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        <Navbar dark={dark} setDark={setDark} />
        <HeroBanner />

        <main style={{ padding: "36px clamp(18px,5vw,64px) 80px", background: t.bg, transition: "background 0.3s" }}>
          {/* section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${t.accent}55, transparent)` }} />
            <p style={{ color: t.textSub, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {PRODUCTS.length} Posters Available
            </p>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(270deg, ${t.accent}55, transparent)` }} />
          </div>

          {/*
            ═══════════════════════════════════════════
            PRODUCT GRID
            To add / change a card, just edit PRODUCTS
            at the top of the file — only title & price
            are required per entry.
            ═══════════════════════════════════════════
          */}
          <div style={{
            display:               "grid",
            gridTemplateColumns:   "repeat(auto-fill, minmax(190px, 1fr))",
            gap:                   20,
          }}>
            {PRODUCTS.map((product, i) => (
              <div key={product.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}>
                {/* ↓ AnimeCard only needs title and price — everything else is internal */}
                <AnimeCard
                  title={product.title}
                  price={product.price}
                  id={product.id}
                />
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer style={{ background: t.surface, borderTop: `1px solid ${t.border}`, padding: "28px clamp(18px,5vw,64px)", textAlign: "center" }}>
          <p style={{ color: t.textSub, fontSize: "0.65rem", letterSpacing: "0.12em" }}>
            ⛩️ &nbsp;ANIMART OFFICIAL STORE &nbsp;·&nbsp; Premium Anime Merchandise &nbsp;·&nbsp; Made with ♥ in India
          </p>
        </footer>

        <CartDrawer />
      </CartCtx.Provider>
    </ThemeCtx.Provider>
  );
}
