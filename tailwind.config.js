/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      // Font Family
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        // If you want to add Arabic support later:
        // arabic: ['Cairo', 'sans-serif'],
      },

      // Brand Colors (matching your CSS variables)
      colors: {
        brand: {
          50: "#b1d4e0", // lightest
          100: "#2e8bc0", // light
          200: "#145da0", // medium
          500: "#0c2d48", // primary (main brand)
          600: "#145da0", // hover
          700: "#2e8bc0", // active
          800: "#0c2d48", // dark
          900: "#0c2d48", // darkest
        },
        grey: {
          0: "#fff",
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        // Status colors
        status: {
          blue: {
            light: "#e0f2fe",
            dark: "#0369a1",
          },
          green: {
            light: "#dcfce7",
            dark: "#15803d",
          },
          yellow: {
            light: "#fef9c3",
            dark: "#a16207",
          },
          red: {
            light: "#fee2e2",
            dark: "#b91c1c",
            darker: "#991b1b",
          },
        },
      },

      // Shadows (matching your CSS variables)
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.04)",
        md: "0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06)",
        lg: "0 2.4rem 3.2rem rgba(0, 0, 0, 0.12)",
      },

      // Border Radius (matching your CSS variables)
      borderRadius: {
        tiny: "3px",
        sm: "5px",
        md: "7px",
        lg: "9px",
      },

      // Spacing (additional)
      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },

      // Container
      container: {
        center: true,
        padding: {
          DEFAULT: "2rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },

      // Animation
      animation: {
        "spin-slow": "spin 3s linear infinite",
        fadeIn: "fadeIn 0.3s ease-out",
        slideIn: "slideIn 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(2rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },

      // Typography
      fontSize: {
        xs: ["1.2rem", { lineHeight: "1.6" }],
        sm: ["1.4rem", { lineHeight: "1.6" }],
        base: ["1.6rem", { lineHeight: "1.6" }],
        lg: ["1.8rem", { lineHeight: "1.6" }],
        xl: ["2rem", { lineHeight: "1.4" }],
        "2xl": ["2.4rem", { lineHeight: "1.2" }],
        "3xl": ["3rem", { lineHeight: "1.2" }],
        "4xl": ["3.6rem", { lineHeight: "1.1" }],
      },

      // Breakpoints (if you need custom ones)
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [
    // You can add plugins here later if needed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
