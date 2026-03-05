import { createContext } from "react";

// ── Design tokens ─────────────────────────────────────────────
export const THEMES = {
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
  },
  light: {
    bg:          "#f7f5f2",
    surface:     "#ffffff",
    surfaceHigh: "#f0ede8",
    border:      "#e0dbd4",
    text:        "#1a1a1a",
    textSub:     "#131212",
    accent:      "#c8871e",
    accentSoft:  "rgba(200,135,30,0.10)",
    btnBg:       "#c8871e",
    btnText:     "#ffffff",
    success:     "#2e9e5e",
    danger:      "#d44040",
    shadow:      "rgba(0,0,0,0.10)",
    overlay:     "rgba(0,0,0,0.38)",
  },
};

// ── Shared React contexts ─────────────────────────────────────
export const ThemeCtx = createContext(THEMES.dark);
export const CartCtx  = createContext(null);

// ── Delivery charge (used in CartDrawer) ─────────────────────
export const DELIVERY = 49;
