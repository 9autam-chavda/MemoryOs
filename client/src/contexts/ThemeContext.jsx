import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const STORAGE_KEY = "memoryos-theme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    const apply = (t) => {
      const root = document.documentElement;

      if (t === "system") {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("light", !prefersDark);
        root.classList.toggle("dark", prefersDark);
        root.dataset.theme = prefersDark ? "dark" : "light";
      } else if (t === "dark") {
        root.classList.remove("light");
        root.classList.add("dark");
        root.dataset.theme = "dark";
      } else {
        root.classList.remove("dark");
        root.classList.add("light");
        root.dataset.theme = "light";
      }
    };

    apply(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const prefersDark = mq.matches;
        const root = document.documentElement;
        root.classList.toggle("light", !prefersDark);
        root.classList.toggle("dark", prefersDark);
        root.dataset.theme = prefersDark ? "dark" : "light";
      }
    };

    if (mq && mq.addEventListener) mq.addEventListener("change", handler);
    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener("change", handler);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
