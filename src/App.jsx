import { useState, useCallback } from "react";

import { THEMES, ThemeCtx, CartCtx } from "./theme.js";
import Navbar     from "./Navbar.jsx";
import HeroBanner from "./HeroBanner.jsx";
import AnimeCard  from "./AnimeCard.jsx";
import CartDrawer from "./CartDrawer.jsx";

const poster_price = 59;
const car_price = 59;

/*
  ── Auto-import every image from src/assets/anime/ ────────────
  Vite's import.meta.glob loads all matching files eagerly.
  The result is a map of path → resolved URL, e.g.:
    { "/src/assets/anime/itachi.jpeg": "/assets/itachi.abc123.jpeg" }

  Use img("filename.ext") to get the URL for any file in that folder.
  File names are case-sensitive — match the exact name on disk.
*/
const animeContext = require.context(
  "./assets/anime",   // path relative to this file
  false,              // don't search subfolders
  /\.(jpe?g|png|gif|webp|svg)$/i
);
const carContext = require.context(
  "./assets/cars",   // path relative to this file
  false,              // don't search subfolders
  /\.(jpe?g|png|gif|webp|svg)$/i
);

const CarImg = (filename) => {
  try{return carContext(`./${filename}`);}
  catch{return null;}
};

const AnimeImg = (filename) => {
  try { return animeContext(`./${filename}`); }
  catch { return null; }
};
/* ═══════════════════════════════════════════════════════════════
   CATALOGUE
   Each category has: key, label, emoji, accent colour, products.
   To add a product just append to any `items` array.
   Required per item: id (unique across ALL categories), title, price
   Optional per item: image (URL string)
═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   CATALOGUE
   To add a new anime poster: drop the image into src/assets/anime/
   then add one line below using img("your-filename.ext")

   For cars or other sections, use a full https:// URL as usual.
═══════════════════════════════════════════════════════════════ */
const CATALOGUE = [
  {
    key:   "anime",
    label: "Anime",
    emoji: "⛩️",
    color: "#e8a838",
    items: [
      { id: 1, title: "Demon Slayer",     price: poster_price, image: AnimeImg("1.jpeg")       },
      { id: 2, title: "Naruto: Shippuden",     price: poster_price, image: AnimeImg("2.jpeg")      },
      { id: 3, title: "Naruto: Shippuden",     price: poster_price, image: AnimeImg("3.jpeg")      },
      { id: 4, title: "Naruto: Shippuden",      price: poster_price, image: AnimeImg("4.jpeg")       },
      { id: 5, title: "Demon Slayer",   price: poster_price, image: AnimeImg("5.jpeg")        },
      { id: 6, title: "One Piece", price: poster_price, image: AnimeImg("6.jpeg")       },
      { id: 7, title: "One Piece",    price: poster_price, image: AnimeImg("7.jpeg")      },
      { id: 8, title: "One Piece",    price: poster_price, image: AnimeImg("8.jpeg")      },
      { id: 9, title: "One Piece",    price: poster_price, image: AnimeImg("9.jpeg")      },
      { id: 10, title: "Naruto: Shippuden",    price: poster_price, image: AnimeImg("10.jpeg")      },
      { id: 11, title: "Naruto: Shippuden",    price: poster_price, image: AnimeImg("11.jpeg")      },
      { id: 12, title: "Naruto: Shippuden",    price: poster_price, image: AnimeImg("12.jpeg")      },
      { id: 13, title: "Demon Slayer",    price: poster_price, image: AnimeImg("13.jpeg")      },
      { id: 14, title: "Demon Slayer",    price: poster_price, image: AnimeImg("14.jpeg")      },
      { id: 15, title: "Demon Slayer",    price: poster_price, image: AnimeImg("15.jpeg")      },
      { id: 16, title: "Spider-Man",    price: poster_price, image: AnimeImg("16.jpeg")      },
      { id: 17, title: "Spider-Man",    price: poster_price, image: AnimeImg("17.jpeg")      },
      { id: 18, title: "Jujutsu Kaisen",    price: poster_price, image: AnimeImg("18.jpeg")      },
      { id: 19, title: "Demon Slayer",    price: poster_price, image: AnimeImg("19.jpeg")      },
      { id: 20, title: "Demon Slayer",    price: poster_price, image: AnimeImg("20.jpeg")      },
      { id: 21, title: "Demon Slayer",    price: poster_price, image: AnimeImg("21.jpeg")      },
      { id: 22, title: "Demon Slayer",    price: poster_price, image: AnimeImg("22.jpeg")      },
      { id: 23, title: "Jujutsu Kaisen",    price: poster_price, image: AnimeImg("23.jpeg")      },
      { id: 24, title: "One Piece",    price: poster_price, image: AnimeImg("24.jpeg")      },
      { id: 25, title: "Demon Slayer",    price: poster_price, image: AnimeImg("25.jpeg")      },
      { id: 26, title: "Naruto: Shippuden",    price: poster_price, image: AnimeImg("26.jpeg")      },
      { id: 27, title: "cristiano ronaldo",    price: poster_price, image: AnimeImg("27.jpeg")      },
      { id: 28, title: "Spider-Man",    price: poster_price, image: AnimeImg("28.jpeg")      },
      { id: 29, title: "One Piece",    price: poster_price, image: AnimeImg("29.jpeg")      },
    ],
  },
  {
    key:     "cars",
    label:   "Cars",
    emoji:   "🏎️",
    color:   "#e05c3a",           // vivid red-orange
    items: [
      { id: 1, title: "feel it!!",    price: car_price, image: CarImg("1.jpeg")      },
      { id: 2, title: "feel it!!",    price: car_price, image: CarImg("2.jpeg")      },
      { id: 3, title: "feel it!!",    price: car_price, image: CarImg("3.jpeg")      },
      { id: 4, title: "feel it!!",    price: car_price, image: CarImg("4.jpeg")      },
      { id: 5, title: "feel it!!",    price: car_price, image: CarImg("5.jpeg")      },
      { id: 6, title: "feel it!!",    price: car_price, image: CarImg("6.jpeg")      },
      { id: 7, title: "feel it!!",    price: car_price, image: CarImg("7.jpeg")      },
      { id: 8, title: "feel it!!",    price: car_price, image: CarImg("8.jpeg")      },
      { id: 9, title: "feel it!!",    price: car_price, image: CarImg("9.jpeg")      },
      { id: 10, title: "feel it!!",    price: car_price, image: CarImg("10.jpeg")      },
      { id: 11, title: "feel it!!",    price: car_price, image: CarImg("11.jpeg")      },
      { id: 12, title: "feel it!!",    price: car_price, image: CarImg("12.jpeg")      },
      { id: 13, title: "feel it!!",    price: car_price, image: CarImg("13.jpeg")      },
      { id: 14, title: "feel it!!",    price: car_price, image: CarImg("14.jpeg")      },
    ],
  },
];

/* ── Section header component ───────────────────────────────── */
function SectionHeader({ emoji, label, color, count, t }) {
  return (
    <div style={{
      display:       "flex",
      alignItems:    "center",
      gap:           14,
      marginBottom:  24,
      paddingBottom: 14,
      borderBottom:  `1.5px solid ${color}33`,
    }}>
      {/* Coloured side bar */}
      <div style={{ width: 4, height: 36, borderRadius: 4, background: color, flexShrink: 0 }} />

      <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{emoji}</span>

      <div>
        <h2 style={{
          fontFamily:    "'Cinzel', serif",
          fontWeight:    900,
          fontSize:      "1.1rem",
          color:         t.text,
          margin:        0,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>{label}</h2>
        <p style={{
          fontFamily:    "'Cinzel', serif",
          fontSize:      "0.62rem",
          color:         t.textSub,
          margin:        "2px 0 0",
          letterSpacing: "0.12em",
        }}>{count} posters</p>
      </div>

      {/* Fading rule line */}
      <div style={{
        flex:       1,
        height:     1,
        background: `linear-gradient(90deg, ${color}44, transparent)`,
        marginLeft: 8,
      }} />
    </div>
  );
}

/* ── Root App ────────────────────────────────────────────────── */
export default function App() {
  const [dark,     setDark]     = useState(true);
  const [cart,     setCart]     = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const t = dark ? THEMES.dark : THEMES.light;

  // ── Cart actions ─────────────────────────────────────────────
  const addToCart = useCallback((product, qty) =>
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: Math.min(10, i.qty + qty) } : i
        );
      }
      return [...prev, { ...product, qty }];
    }), []);

  const removeFromCart = useCallback(
    id => setCart(prev => prev.filter(i => i.id !== id)), []
  );

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.min(10, qty) } : i));
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

        {/* Navbar — section links scroll the page, no filter state needed */}
        <Navbar dark={dark} setDark={setDark} />
        <HeroBanner />

        {/* ── Main content ──────────────────────────────────────── */}
        <main style={{
          padding:       "40px clamp(18px, 5vw, 64px) 80px",
          background:    t.bg,
          transition:    "background 0.3s",
          display:       "flex",
          flexDirection: "column",
          gap:           56,
        }}>
          {CATALOGUE.map((section) => (
            /* id matches the key used in Navbar scrollTo() */
            <section key={section.key} id={section.key}>
              <SectionHeader
                emoji={section.emoji}
                label={section.label}
                color={section.color}
                count={section.items.length}
                t={t}
              />
              <div style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap:                 20,
              }}>
                {section.items.map((product, i) => (
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
            </section>
          ))}
        </main>

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer style={{
          background:  t.surface,
          borderTop:   `1px solid ${t.border}`,
          padding:     "28px clamp(18px, 5vw, 64px)",
          textAlign:   "center",
          transition:  "background 0.3s",
        }}>
          <p style={{ color: t.textSub, fontSize: "0.75rem", letterSpacing: "0.12em" }}>
            ⛩️ &nbsp;ANIMART POSTERS STORE &nbsp;·&nbsp; Anime · Cars &nbsp;·&nbsp; Made with ♥ in India
          </p>
        </footer>

        <CartDrawer />
      </CartCtx.Provider>
    </ThemeCtx.Provider>
  );
}
