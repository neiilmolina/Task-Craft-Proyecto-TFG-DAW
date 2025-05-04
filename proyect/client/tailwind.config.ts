import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        greyDark: "#979797",
        grey: "#F5F5F5",
        secondary: "#91CEFA",
        primary: "#1A659E",
        error: "#F89797",
        warning: "#E0C600",
        correct: "#A8F578",
      },
    },
  },
  plugins: [],
};

export default config;
