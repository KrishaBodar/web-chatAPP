export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(91, 141, 255, 0.35)",
        violet: "0 0 50px rgba(168, 85, 247, 0.36)",
        soft: "0 18px 45px rgba(79, 70, 229, 0.18)"
      },
      backgroundImage: {
        aurora: "radial-gradient(circle at 15% 15%, rgba(99,102,241,.34), transparent 30%), radial-gradient(circle at 82% 12%, rgba(14,165,233,.30), transparent 28%), linear-gradient(135deg, #050510 0%, #111827 45%, #20113c 100%)"
      }
    }
  },
  plugins: []
};
