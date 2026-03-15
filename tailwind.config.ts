import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#6C4CF1",
          hover: "#5A3FE0",
        },
        lavender: {
          DEFAULT: "#E6E1FD",
          light: "#F5F3FF",
        }
      },
      backgroundImage: {
        'gradient-lavender': 'linear-gradient(135deg, #E6E1FD 0%, #FFFFFF 100%)',
        'gradient-radial-lavender': 'radial-gradient(circle, #E6E1FD 0%, #FFFFFF 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
