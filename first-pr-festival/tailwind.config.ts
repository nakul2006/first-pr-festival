import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Classic Spider-Man: red, black, web-silver. Restraint on purpose. ──
        ink: {
          DEFAULT: "#08080A", // suit black
          900: "#0C0C10",
          800: "#131319",
          700: "#1B1B23",
          600: "#26262F",
        },
        web: {
          red: "#E62429", // the classic Spidey red
          scarlet: "#FF3B3B",
          crimson: "#C1121F",
          blood: "#8E0912",
          ember: "#FF1E27",
        },
        silk: {
          DEFAULT: "#E8E6E3", // web-silk white
          dim: "#9B9AA3",
          faint: "#5A5A66",
        },
        // Kept minimal and semantic only — never decorative.
        signal: {
          ok: "#3FBF6F",
          warn: "#E8A33D",
          bad: "#FF4D4D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "Haettenschweiler", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        suit: "0 0 14px rgba(230,36,41,0.55), 0 0 46px rgba(230,36,41,0.22)",
        card: "0 18px 45px -18px rgba(0,0,0,0.9)",
      },
      keyframes: {
        glitch: {
          "0%, 92%, 100%": { transform: "translate(0,0)", opacity: "1" },
          "93%": { transform: "translate(-3px, 2px)" },
          "94%": { transform: "translate(3px, -2px)" },
          "95%": { transform: "translate(-2px, -1px)", opacity: "0.85" },
          "96%": { transform: "translate(2px, 1px)" },
        },
        "glitch-top": {
          "0%, 92%, 100%": { clipPath: "inset(0 0 100% 0)", transform: "translate(0,0)" },
          "93%": { clipPath: "inset(0 0 62% 0)", transform: "translate(-5px,-2px)" },
          "95%": { clipPath: "inset(0 0 55% 0)", transform: "translate(5px,2px)" },
          "97%": { clipPath: "inset(0 0 70% 0)", transform: "translate(-3px,1px)" },
        },
        "glitch-bottom": {
          "0%, 92%, 100%": { clipPath: "inset(100% 0 0 0)", transform: "translate(0,0)" },
          "93%": { clipPath: "inset(58% 0 0 0)", transform: "translate(5px,2px)" },
          "95%": { clipPath: "inset(48% 0 0 0)", transform: "translate(-5px,-2px)" },
          "97%": { clipPath: "inset(66% 0 0 0)", transform: "translate(3px,-1px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        glitch: "glitch 4s infinite steps(1, end)",
        "glitch-top": "glitch-top 4s infinite steps(1, end)",
        "glitch-bottom": "glitch-bottom 4s infinite steps(1, end)",
        scanline: "scanline 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        marquee: "marquee 26s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
