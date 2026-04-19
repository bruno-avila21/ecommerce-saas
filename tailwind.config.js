/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        // Map Tailwind utilities to CSS vars for white-label support
        accent: {
          DEFAULT: "var(--sf-accent)",
          light:   "var(--sf-accent-light)",
          dark:    "var(--sf-accent-dark)",
        },
        brand: {
          hero:   "var(--sf-hero-bg)",
          page:   "var(--sf-page-bg)",
          page2:  "var(--sf-page-bg-2)",
          card:   "var(--sf-card-bg)",
          border: "var(--sf-border)",
          strong: "var(--sf-border-strong)",
          text:   "var(--sf-text)",
          muted:  "var(--sf-text-muted)",
          faint:  "var(--sf-text-faint)",
          wa:     "var(--sf-whatsapp)",
        },
      },
      borderRadius: {
        sf:   "var(--sf-radius)",
        "sf-sm": "var(--sf-radius-sm)",
        "sf-lg": "var(--sf-radius-lg)",
      },
    },
  },
  plugins: [],
};
