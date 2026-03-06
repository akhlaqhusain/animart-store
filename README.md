# ⛩️ Animart — Posters Store

> A modern, fully responsive e-commerce storefront for premium anime and car posters, built with React and deployed on Vercel.

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## 🌐 Live Demo

**[animart-store.vercel.app](https://animart-store.vercel.app/)**

---

## 📸 Overview

Animart is a single-page poster store that lets customers browse two curated categories — **Anime** and **Cars** — add items to a cart, review their order summary, and place an order directly via **Telegram** (`@AnimartStore`). No payment gateway, no account creation — just browse, cart, and message.

---

## ✨ Features

- **Two product sections** — Anime & Cars, each with its own accent colour and emoji branding
- **Smooth scroll navigation** — clicking a section in the navbar scrolls directly to it; the active link highlights as you scroll
- **Dark / Light mode** — theme toggle with persistent in-session state; all colours switch instantly
- **Smart cart drawer** — slide-in panel from the right with live item count badge on the navbar
  - Add / remove items, adjust quantity (1–10 per item)
  - Real-time bill summary (subtotal + ₹49 delivery + total)
  - One-tap **Telegram ordering** — pre-fills the cart as a formatted message to `@AnimartStore`
- **Responsive design** — full desktop layout; collapses to a hamburger menu on mobile (< 640 px)
- **Bulk image loading** — entire asset folders loaded via `require.context` with zero manual imports
- **Animated cards** — hover lift, border glow, image zoom, staggered fade-up on page load
- **Cinzel serif typography** — premium, elegant feel throughout

---

## 🗂️ Project Structure

```
src/
├── assets/
│   ├── anime/          # Drop anime poster images here (JPEG/PNG/WebP)
│   └── cars/           # Drop car poster images here
├── App.jsx             # Root component — catalogue data, layout, providers
├── AnimeCard.jsx       # Product card with quantity selector
├── Navbar.jsx          # Sticky navbar with section links + hamburger
├── HeroBanner.jsx      # Hero section with headline, chips, stats
├── CartDrawer.jsx      # Slide-in cart + Telegram order panel
└── theme.js            # Design tokens (dark/light), shared contexts
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 (functional components + hooks) |
| State Management | React Context API (`ThemeCtx`, `CartCtx`) |
| Styling | Inline styles with dynamic theme tokens |
| Font | [Cinzel](https://fonts.google.com/specimen/Cinzel) via Google Fonts |
| Image Bundling | `require.context` (CRA) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/akhlaqhusain/Animart.git
cd Animart

# Install dependencies
npm install

# Start the development server
npm start
```

The app will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

The optimised output lands in the `build/` folder, ready to deploy.

---

## 🖼️ Adding New Posters

### Anime posters

1. Drop the image file into `src/assets/anime/`
2. Open `App.jsx` and add one line to the `anime` items array:

```js
{ id: 25, title: "Chainsaw Man", price: 59, image: AnimeImg("chainsaw.jpeg") }
```

### Car posters

Same process — drop into `src/assets/cars/` and reference with `CarImg("filename.jpeg")`.

> **Note:** File names are case-sensitive on Linux/Mac. Match the exact name on disk.

---

## 🛒 How Ordering Works

Animart uses a **Telegram-based order flow** instead of a traditional checkout:

1. Customer adds items to cart
2. Cart shows itemised bill with delivery charge
3. Clicking **ORDER VIA TELEGRAM** opens `t.me/AnimartStore` with the full order pre-typed as a message
4. Store owner receives the order and confirms manually

**Telegram:** [@AnimartStore](https://t.me/AnimartStore)

---

## 🎨 Theming

All design tokens live in `theme.js`. To change any colour across the entire app, edit just that one file:

```js
// src/theme.js
export const THEMES = {
  dark: {
    accent: "#e8a838",   // gold — change this to retheme the whole dark mode
    ...
  },
  light: {
    accent: "#c8871e",
    ...
  },
};
```

---

## 📦 Deployment (Vercel)

The project is deployed on Vercel with zero configuration.

**To deploy your own fork:**

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Vercel auto-detects Create React App — click **Deploy**

**To update:** push a commit to `main` — Vercel redeploys automatically.

---
## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feature/your-feature-name
```

---

## 📄 License

MIT © [Akhlaq Husain](https://github.com/akhlaqhusain)

---
