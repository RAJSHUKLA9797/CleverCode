// src/components/ThemeToggle.jsx
import React from "react";
import useTheme from "../context/Theme.jsx";

export default function ThemeToggle() {
  const { themeMode, lightTheme, darkTheme } = useTheme();

  const toggleTheme = () => {
    themeMode === "light" ? darkTheme() : lightTheme();
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 z-50 px-3 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-full shadow-md hover:scale-105 transition-transform"
    >
      {themeMode === "light" ? "Dark" : "Light"}
    </button>
  );
}
