import { useState, useContext } from "react";
import { ThemeCtx, CartCtx, DELIVERY } from "./theme.js";

/**
 * CartDrawer
 * ─────────────────────────────────────────────────────────────
 * No props required — reads cart state and theme from context.
 *
 * Renders a slide-in panel from the right with three steps:
 *   1. Cart     — list of items + bill summary
 *   2. Address  — delivery details form
 *   3. Payment  — UPI QR + ID input
 *   → Success   — confirmation screen, cart is cleared
 * ─────────────────────────────────────────────────────────────
 */
export default function CartDrawer() {
  const t = useContext(ThemeCtx);
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQty,
    clearCart,
  } = useContext(CartCtx);

  const [step,      setStep]     = useState("cart");
  const [addr,      setAddr]     = useState({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [upiId,     setUpiId]    = useState("");
  const [paying,    setPay]      = useState(false);
  const [paidTotal, setPaidTotal] = useState(0); // snapshot before cart is cleared

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = subtotal > 0 ? subtotal + DELIVERY : 0;
  const steps    = ["cart", "address", "payment"];
  const stepIdx  = steps.indexOf(step);
  const addrOk   = addr.name && addr.phone && addr.street && addr.city && addr.pincode;

  const handlePay = () => {
    const finalTotal = subtotal + DELIVERY; // capture before clearCart zeroes it
    setPay(true);
    setTimeout(() => {
      setPay(false);
      setPaidTotal(finalTotal); // store snapshot
      clearCart();
      setStep("success");
    }, 2400);
  };

  const handleClose = () => {
    setCartOpen(false);
    // Reset internal state after the drawer slides out
    setTimeout(() => {
      setStep("cart");
      setAddr({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
      setUpiId("");
    }, 300);
  };

  // Shared input style
  const inp = {
    width:          "100%",
    boxSizing:      "border-box",
    background:     t.surfaceHigh,
    border:         `1px solid ${t.border}`,
    borderRadius:   8,
    padding:        "9px 12px",
    color:          t.text,
    fontSize:       "0.85rem",
    fontFamily:     "'Cinzel', serif",
    outline:        "none",
    transition:     "border-color 0.15s",
  };

  // Shared field label style
  const labelSt = {
    color:          t.textSub,
    fontSize:       "0.66rem",
    fontWeight:     700,
    display:        "block",
    marginBottom:   5,
    textTransform:  "uppercase",
    letterSpacing:  "0.1em",
    fontFamily:     "'Cinzel', serif",
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

        {/* ── Header ────────────────────────────────────────── */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "18px 20px 14px",
          borderBottom:   `1px solid ${t.border}`,
        }}>
          <div>
            <h2 style={{ fontWeight: 900, fontSize: "1rem", color: t.text, margin: 0, letterSpacing: "0.06em" }}>
              {step === "cart"    ? "YOUR CART"
                : step === "address"  ? "DELIVERY ADDRESS"
                : step === "payment"  ? "PAYMENT"
                : ""}
            </h2>
            {step === "cart" && cart.length > 0 && (
              <p style={{ color: t.textSub, fontSize: "0.68rem", margin: "3px 0 0", letterSpacing: "0.08em" }}>
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              background:    t.surfaceHigh,
              border:        `1px solid ${t.border}`,
              color:         t.textSub,
              borderRadius:  8,
              width:         32,
              height:        32,
              cursor:        "pointer",
              fontSize:      "0.9rem",
              display:       "flex",
              alignItems:    "center",
              justifyContent:"center",
            }}
          >✕</button>
        </div>

        {/* ── Step indicator ────────────────────────────────── */}
        {step !== "success" && (
          <div style={{ display: "flex", alignItems: "center", padding: "12px 20px 6px", gap: 4 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{
                  width:          22,
                  height:         22,
                  borderRadius:   "50%",
                  fontSize:       "0.6rem",
                  fontWeight:     700,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  background:     i < stepIdx ? t.success
                    : i === stepIdx ? t.btnBg
                    : t.surfaceHigh,
                  color:     i < stepIdx ? "#fff"
                    : i === stepIdx ? t.btnText
                    : t.textSub,
                  flexShrink: 0,
                  transition: "background 0.25s",
                  fontFamily: "'Cinzel', serif",
                }}>
                  {i < stepIdx ? "✓" : i + 1}
                </div>
                {i < 2 && (
                  <div style={{
                    flex:       1,
                    height:     1.5,
                    background: i < stepIdx ? t.success : t.border,
                    margin:     "0 4px",
                    transition: "background 0.3s",
                  }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Scrollable body ───────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 20px" }}>

          {/* SUCCESS */}
          {step === "success" && (
            <div style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              height:         "100%",
              gap:            16,
              textAlign:      "center",
              padding:        "20px 0",
            }}>
              <div style={{ fontSize: "3.5rem" }}>🎉</div>
              <h2 style={{ fontWeight: 900, fontSize: "1.3rem", color: t.success, margin: 0, letterSpacing: "0.06em" }}>
                ORDER PLACED!
              </h2>
              <p style={{ color: t.textSub, fontSize: "0.8rem", lineHeight: 1.8, margin: 0 }}>
                Your anime posters are on their way.<br />
                Estimated delivery: 3–5 business days.
              </p>
              <div style={{
                background:   t.surfaceHigh,
                border:       `1px solid ${t.border}`,
                borderRadius: 10,
                padding:      "12px 24px",
                marginTop:    4,
              }}>
                <p style={{ color: t.accent, fontWeight: 700, margin: 0, fontSize: "0.9rem" }}>
                  Total Paid: ₹{paidTotal.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background:    t.btnBg,
                  color:         t.btnText,
                  border:        "none",
                  borderRadius:  9,
                  padding:       "10px 28px",
                  fontWeight:    700,
                  fontSize:      "0.78rem",
                  cursor:        "pointer",
                  marginTop:     8,
                  fontFamily:    "'Cinzel', serif",
                  letterSpacing: "0.08em",
                }}
              >CONTINUE SHOPPING</button>
            </div>
          )}

          {/* STEP 1 — CART */}
          {step === "cart" && (
            cart.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 64, color: t.textSub }}>
                <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🛒</div>
                <p style={{ fontSize: "0.8rem", letterSpacing: "0.06em" }}>Your cart is empty.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Cart items */}
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

                {/* Bill summary */}
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
              </div>
            )
          )}

          {/* STEP 2 — ADDRESS */}
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
                  <input
                    value={addr[f.key]}
                    onChange={e => setAddr(a => ({ ...a, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    style={inp}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = t.border}
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 3 — PAYMENT */}
          {step === "payment" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Amount */}
              <div style={{
                background:   t.accentSoft,
                border:       `1.5px solid ${t.accent}44`,
                borderRadius: 11,
                padding:      "16px",
                textAlign:    "center",
              }}>
                <p style={{ color: t.textSub, fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
                  Amount to Pay
                </p>
                <p style={{ color: t.accent, fontWeight: 900, fontSize: "1.8rem", margin: 0 }}>
                  ₹{total.toLocaleString()}
                </p>
              </div>

              {/* QR + UPI input */}
              <div style={{
                background:   t.surfaceHigh,
                border:       `1px solid ${t.border}`,
                borderRadius: 11,
                padding:      "18px",
                textAlign:    "center",
              }}>
                <p style={{ color: t.text, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.06em", margin: "0 0 14px" }}>
                  SCAN & PAY VIA UPI
                </p>
                <div style={{
                  background:    "#ffffff",
                  width:         90,
                  height:        90,
                  borderRadius:  10,
                  margin:        "0 auto 14px",
                  display:       "flex",
                  alignItems:    "center",
                  justifyContent:"center",
                  fontSize:      "2.4rem",
                }}>⬛</div>
                <p style={{ color: t.textSub, fontSize: "0.7rem", letterSpacing: "0.06em", margin: "0 0 10px" }}>
                  OR ENTER UPI ID
                </p>
                <input
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  style={{ ...inp, textAlign: "center" }}
                  onFocus={e => e.target.style.borderColor = t.accent}
                  onBlur={e => e.target.style.borderColor = t.border}
                />
              </div>

              {/* Delivery summary */}
              <div style={{
                background:   t.surfaceHigh,
                border:       `1px solid ${t.border}`,
                borderRadius: 11,
                padding:      "12px 14px",
              }}>
                <p style={{ color: t.textSub, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
                  Delivering to
                </p>
                <p style={{ color: t.text, fontSize: "0.8rem", lineHeight: 1.7, margin: 0 }}>
                  {addr.name} · {addr.phone}<br />
                  {addr.street}, {addr.city} – {addr.pincode}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer CTA ────────────────────────────────────── */}
        {cart.length > 0 && step !== "success" && (
          <div style={{ padding: "12px 20px 20px", borderTop: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", gap: 8 }}>
              {/* Back button */}
              {stepIdx > 0 && (
                <button
                  onClick={() => setStep(steps[stepIdx - 1])}
                  style={{
                    flex:          1,
                    background:    t.surfaceHigh,
                    color:         t.textSub,
                    border:        `1px solid ${t.border}`,
                    borderRadius:  9,
                    padding:       "11px 0",
                    fontWeight:    700,
                    fontSize:      "0.74rem",
                    cursor:        "pointer",
                    fontFamily:    "'Cinzel', serif",
                    letterSpacing: "0.05em",
                  }}
                >← BACK</button>
              )}

              {step === "cart" && (
                <button
                  onClick={() => setStep("address")}
                  style={{
                    flex:          1,
                    background:    t.btnBg,
                    color:         t.btnText,
                    border:        "none",
                    borderRadius:  9,
                    padding:       "11px 0",
                    fontWeight:    700,
                    fontSize:      "0.78rem",
                    cursor:        "pointer",
                    fontFamily:    "'Cinzel', serif",
                    letterSpacing: "0.06em",
                  }}
                >CHECKOUT →</button>
              )}

              {step === "address" && (
                <button
                  onClick={() => addrOk && setStep("payment")}
                  style={{
                    flex:          2,
                    background:    addrOk ? t.btnBg : t.surfaceHigh,
                    color:         addrOk ? t.btnText : t.textSub,
                    border:        "none",
                    borderRadius:  9,
                    padding:       "11px 0",
                    fontWeight:    700,
                    fontSize:      "0.78rem",
                    cursor:        addrOk ? "pointer" : "default",
                    fontFamily:    "'Cinzel', serif",
                    letterSpacing: "0.06em",
                  }}
                >CONTINUE TO PAYMENT →</button>
              )}

              {step === "payment" && (
                <button
                  onClick={handlePay}
                  disabled={paying}
                  style={{
                    flex:          2,
                    background:    paying ? t.surfaceHigh : t.success,
                    color:         paying ? t.textSub : "#fff",
                    border:        "none",
                    borderRadius:  9,
                    padding:       "11px 0",
                    fontWeight:    700,
                    fontSize:      "0.78rem",
                    cursor:        paying ? "default" : "pointer",
                    fontFamily:    "'Cinzel', serif",
                    letterSpacing: "0.06em",
                  }}
                >
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
