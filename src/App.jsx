import { useState, useCallback } from "react";

import { THEMES, ThemeCtx, CartCtx } from "./theme.js";
import Navbar      from "./Navbar.jsx";
import HeroBanner  from "./HeroBanner.jsx";
import AnimeCard   from "./AnimeCard.jsx";
import CartDrawer  from "./CartDrawer.jsx";
const ps = 59;

/*
  ═══════════════════════════════════════════════════════════════
  PRODUCT CATALOGUE
  ───────────────────────────────────────────────────────────────
  To add a new poster, just append an entry below.

  Required fields:
    id     {number}  — unique identifier
    title  {string}  — displayed on the card
    price  {number}  — price in INR

  Optional fields:
    image  {string}  — URL to a poster image
                       omit this field to show the emoji placeholder

  Example (with image):
    { id: 13, title: "Vinland Saga", price: 849, image: "https://..." }

  Example (no image — shows placeholder):
    { id: 14, title: "Chainsaw Man", price: 899 }
  ═══════════════════════════════════════════════════════════════
*/
const PRODUCTS = [
  { id: 1,  title: "Demon Slayer — Tanjiro",   price: ps,  image: "https://rukminim2.flixcart.com/image/480/640/xif0q/poster/u/i/3/extra-large-tanjiro-manga-collage-poster-set-2-set-of-20-210-mm-original-imahyf6vhfasuqdm.jpeg?q=90" },
  { id: 11, title: "Dragon Ball Z — Goku",      price: ps,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6lL7nYucG8R0VEpg5B7pSq01HNNx8fFBVkg&s" },
  { id: 6,  title: "One Piece — Luffy",         price: ps,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcjxz5Wr0S4nAsKEYQlFzs15tuySji2G4mFw&s" },
  { id: 3,  title: "Jujutsu Kaisen — Gojo",     price: ps, image: "https://m.media-amazon.com/images/I/81t1DH7jH+L._AC_UF894,1000_QL80_.jpg" },
  { id: 12, title: "Death Note — Light",        price: ps,  image: "https://m.media-amazon.com/images/I/71AEjh0+uLL.jpg" },
  { id: 5,  title: "Naruto — Uzumaki",          price: ps,  image: "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg" },
  { id: 2,  title: "Attack on Titan",           price: ps,  image: "https://m.media-amazon.com/images/I/61P3m77rasL._AC_UF894,1000_QL80_.jpg" },
  { id: 7,  title: "Fullmetal Alchemist",       price: ps,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX87McCyyko0nxifSP-jEhp8Q7gG1DTeI4dA&s" },
  { id: 8,  title: "Tokyo Revengers",           price: ps,  image: "https://posterwa.com/cdn/shop/files/TOKYORVGR6.jpg?v=1686080272" },
  { id: 9,  title: "Bleach — Ichigo",           price: ps,  image: "https://m.media-amazon.com/images/I/910YGzAMjQL._AC_UF1000,1000_QL80_.jpg" },
  { id: 10, title: "Sword Art Online",          price: ps,  image: "https://m.media-amazon.com/images/I/61pGPe8woIL._AC_UF1000,1000_QL80_.jpg" },
  
  { id: 4,  title: "My Hero Academia",          price: ps,  image: "https://m.media-amazon.com/images/I/710kXqplBrL._AC_UF350,350_QL50_.jpg" },
];

export default function App() {
  const [dark,     setDark]     = useState(false);
  const [cart,     setCart]     = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const t = dark ? THEMES.dark : THEMES.light;

  // ── Cart actions ─────────────────────────────────────────────
  const addToCart = useCallback((product, qty) =>
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, qty: Math.min(10, i.qty + qty) }
            : i
        );
      }
      return [...prev, { ...product, qty }];
    }), []);

  const removeFromCart = useCallback(
    id => setCart(prev => prev.filter(i => i.id !== id)),
    []
  );

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.min(10, qty) } : i));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Render ────────────────────────────────────────────────────
  return (
    <ThemeCtx.Provider value={t}>
      <CartCtx.Provider value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}>
        {/* Global styles */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background:   ${t.bg};
            font-family:  'Cinzel', serif;
            transition:   background 0.3s;
            min-height:   100vh;
          }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
          @keyframes slideIn {
            from { transform: translateX(110%); }
            to   { transform: translateX(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Layout */}
        <Navbar dark={dark} setDark={setDark} />
        <HeroBanner />

        <main style={{
          padding:    "36px clamp(18px, 5vw, 64px) 80px",
          background: t.bg,
          transition: "background 0.3s",
        }}>
          {/* Section divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${t.accent}55, transparent)` }} />
            <p style={{
              color:         t.textSub,
              fontSize:      "0.65rem",
              fontWeight:    700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              whiteSpace:    "nowrap",
            }}>
              {PRODUCTS.length} Posters Available
            </p>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(270deg, ${t.accent}55, transparent)` }} />
          </div>

          {/* Product grid */}
          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap:                 20,
          }}>
            {PRODUCTS.map((product, i) => (
              <div
                key={product.id}
                style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}
              >
                <AnimeCard
                  title={product.title}
                  price={product.price}
                  id={product.id}
                  image={product.image}
                />
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          background:  t.surface,
          borderTop:   `1px solid ${t.border}`,
          padding:     "28px clamp(18px, 5vw, 64px)",
          textAlign:   "center",
          transition:  "background 0.3s",
        }}>
          <p style={{ color: t.textSub, fontSize: "0.65rem", letterSpacing: "0.12em" }}>
            ⛩️ &nbsp;ANIMART STORE &nbsp;·&nbsp; Premium Anime Posters &nbsp;·&nbsp; Made with ♥ in India
          </p>
        </footer>

        {/* Cart drawer (renders as a portal-like overlay) */}
        <CartDrawer />
      </CartCtx.Provider>
    </ThemeCtx.Provider>
  );
}
