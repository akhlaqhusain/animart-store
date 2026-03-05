import { useContext } from "react";
import { ThemeCtx, CartCtx, DELIVERY } from "./theme.js";

const CONTACT_NUMBER = "+916202473645"; // WhatsApp / call number

export default function CartDrawer() {
  const t = useContext(ThemeCtx);
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQty,
  } = useContext(CartCtx);

  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total      = subtotal > 0 ? subtotal + DELIVERY : 0;
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const handleClose = () => setCartOpen(false);

  // Build a WhatsApp message pre-filled with cart contents
  const buildWhatsAppMsg = () => {
    const lines = cart.map(i => `• ID : ${i.id} ${i.title} x${i.qty} — ₹${(i.price * i.qty).toLocaleString()}`).join("\n");
    const msg   = `Hi! I'd like to place an order:\n\n${lines}\n\nSubtotal: ₹${subtotal.toLocaleString()}\nDelivery: ₹${DELIVERY}\nTotal: ₹${total.toLocaleString()}\n\n`;
    return `https://wa.me/${CONTACT_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  if (!cartOpen) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         200,
        background:     t.overlay,
        backdropFilter: "blur(4px)",
        display:        "flex",
        justifyContent: "flex-end",
      }}
    >
      <div style={{
        width:         "min(420px, 100vw)",
        background:    t.surface,
        borderLeft:    `1px solid ${t.border}`,
        height:        "100%",
        display:       "flex",
        flexDirection: "column",
        animation:     "slideIn 0.26s cubic-bezier(.4,0,.2,1)",
        fontFamily:    "'Cinzel', serif",
      }}>

        {/* ── Header ──────────────────────────────────────────── */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "18px 20px 14px",
          borderBottom:   `1px solid ${t.border}`,
        }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "1rem", color: t.text, margin: 0, letterSpacing: "0.06em" }}>
              YOUR CART
            </h2>
            {cart.length > 0 && (
              <p style={{ color: t.textSub, fontSize: "0.68rem", margin: "3px 0 0", letterSpacing: "0.08em" }}>
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              background:     t.surfaceHigh,
              border:         `1px solid ${t.border}`,
              color:          t.textSub,
              borderRadius:   8,
              width:          32,
              height:         32,
              cursor:         "pointer",
              fontSize:       "0.9rem",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* ── Scrollable body ─────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 20px" }}>

          {/* Empty state */}
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 64, color: t.textSub }}>
              <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🛒</div>
              <p style={{ fontSize: "0.8rem", letterSpacing: "0.06em" }}>Your cart is empty.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* ── Cart items ──────────────────────────────── */}
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display:      "flex",
                    gap:          11,
                    background:   t.surfaceHigh,
                    borderRadius: 11,
                    padding:      "10px 12px",
                    border:       `1px solid ${t.border}`,
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: 50, height: 66, borderRadius: 7, overflow: "hidden", flexShrink: 0, background: t.border }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={e => e.target.style.display = "none"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Title + price + qty controls */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color:         t.text,
                      fontWeight:    600,
                      fontSize:      "0.78rem",
                      margin:        "0 0 3px",
                      overflow:      "hidden",
                      textOverflow:  "ellipsis",
                      whiteSpace:    "nowrap",
                      letterSpacing: "0.01em",
                    }}>{item.title}</p>
                    <p style={{ color: t.accent, fontWeight: 700, fontSize: "0.82rem", margin: "0 0 7px" }}>
                      ₹{item.price.toLocaleString()}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit" }}
                      >−</button>
                      <span style={{ color: t.text, fontWeight: 700, fontSize: "0.84rem" }}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, Math.min(10, item.qty + 1))}
                        style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${t.border}`, background: t.surface, color: t.text, cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit" }}
                      >+</button>
                    </div>
                  </div>

                  {/* Line total + remove */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: "transparent", border: "none", color: t.danger, cursor: "pointer", fontSize: "0.85rem" }}
                    >🗑</button>
                    <span style={{ color: t.text, fontWeight: 700, fontSize: "0.82rem" }}>
                      ₹{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              {/* ── Bill summary ────────────────────────────── */}
              <div style={{
                background:   t.surfaceHigh,
                borderRadius: 11,
                padding:      "13px 14px",
                border:       `1px solid ${t.border}`,
                marginTop:    6,
              }}>
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

              {/* ── Contact to order panel ──────────────────── */}
              <div style={{
                background:   t.surfaceHigh,
                border:       `1.5px solid ${t.accent}44`,
                borderRadius: 12,
                padding:      "16px",
                marginTop:    4,
                display:      "flex",
                flexDirection:"column",
                gap:          10,
                textAlign:    "center",
              }}>
                <p style={{
                  color:         t.textSub,
                  fontFamily:    "'Cinzel', serif",
                  fontSize:      "0.62rem",
                  fontWeight:    700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  margin:        0,
                }}>To Place Your Order</p>

                <p style={{
                  color:         t.text,
                  fontFamily:    "'Cinzel', serif",
                  fontSize:      "0.78rem",
                  lineHeight:    1.7,
                  margin:        0,
                }}>
                  Contact us on WhatsApp or call with your cart details and we'll confirm your order.
                </p>

                {/* Phone number display */}
                <div style={{
                  background:    t.accentSoft,
                  border:        `1px solid ${t.accent}55`,
                  borderRadius:  8,
                  padding:       "10px 14px",
                  display:       "flex",
                  alignItems:    "center",
                  justifyContent:"center",
                  gap:           8,
                }}>
                  <span style={{ fontSize: "1.1rem" }}>📞</span>
                  <span style={{
                    color:         t.accent,
                    fontFamily:    "'Cinzel', serif",
                    fontWeight:    800,
                    fontSize:      "1rem",
                    letterSpacing: "0.06em",
                  }}>+91 62024 73645</span>
                </div>

                {/* WhatsApp button — pre-fills cart as message */}
                <a
                  href={buildWhatsAppMsg()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            8,
                    background:     "#25D366",
                    color:          "#fff",
                    border:         "none",
                    borderRadius:   9,
                    padding:        "11px 0",
                    fontWeight:     700,
                    fontSize:       "0.78rem",
                    fontFamily:     "'Cinzel', serif",
                    letterSpacing:  "0.06em",
                    cursor:         "pointer",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>💬</span>
                  ORDER VIA WHATSAPP
                </a>

                {/* Plain call link */}
                <a
                  href={`tel:${CONTACT_NUMBER}`}
                  style={{
                    color:         t.textSub,
                    fontFamily:    "'Cinzel', serif",
                    fontSize:      "0.65rem",
                    letterSpacing: "0.08em",
                    textDecoration:"none",
                  }}
                >or tap to call</a>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
