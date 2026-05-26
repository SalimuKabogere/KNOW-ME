import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from the profile image
        brand: {
          primary: "#79B2DA",
          deep: "#306C93",
          medium: "#5C98C2",
        },
        surface: {
          light: "#E9E9E9",
          ink: "#1F1A18",
          charcoal: "#443937",
        },
        neutral: {
          warm: "#A88C84",
          brown: "#7D5B4E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #79B2DA 0%, #5C98C2 50%, #306C93 100%)",
        "ink-gradient":
          "linear-gradient(180deg, #1F1A18 0%, #221C1A 50%, #1A1614 100%)",
        "glow-radial":
          "radial-gradient(circle at center, rgba(121,178,218,0.35), transparent 70%)",
        "grid-faint":
          "linear-gradient(rgba(121,178,218,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(121,178,218,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow-blue": "0 0 40px -10px rgba(121,178,218,0.45)",
        "glow-soft": "0 10px 40px -15px rgba(48,108,147,0.55)",
        card: "0 2px 10px rgba(0,0,0,0.25), 0 20px 40px -20px rgba(48,108,147,0.25)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
