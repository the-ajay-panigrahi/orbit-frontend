import { useState, useEffect } from "react";
import { ALL_THEMES } from "../utils/constants";

/**
 * Manages runtime DaisyUI theme switching and persistence via localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("orbit-theme") || "bumblebee";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("orbit-theme", theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    themes: ALL_THEMES,
  };
}
