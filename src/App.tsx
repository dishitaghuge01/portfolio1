import { useState } from "react";
import type { Theme } from "./types";

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "var(--bg-base)",
      color: "var(--text-primary)"
    }}>
      <div>
        <p style={{ fontFamily: "monospace", opacity: 0.5, fontSize: 13 }}>
          portfolio-book scaffold ready
        </p>
        <button 
          onClick={toggleTheme}
          style={{ marginTop: 16, padding: "8px 16px", cursor: "pointer" }}
        >
          Toggle theme → {theme}
        </button>
      </div>
    </div>
  );
}