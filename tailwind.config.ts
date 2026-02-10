import type { Config } from "tailwindcss";

const config: Config & { safelist: string[] } = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "ring-1",
    "bg-blue-100","text-blue-800","ring-blue-200",
    "bg-amber-100","text-amber-800","ring-amber-200",
    "bg-red-100","text-red-800","ring-red-200",
    "bg-slate-200","text-slate-700","text-slate-600",
  ],
  theme: {
    extend: {
      colors: {
        morpeth: {
          navy: "#0D1F61",
          mid: "#5889D6",
          light: "#D2E2FC",
          offwhite: "#F7F8FC",
        },
      },
      fontFamily: {
        heading: ['"Futura PT"', "Futura", "system-ui", "sans-serif"],
        body: ['"Calibri"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 35px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;