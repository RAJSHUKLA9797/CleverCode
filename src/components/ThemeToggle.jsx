import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import useTheme from "../context/Theme.jsx";

export default function ThemeToggle() {
  const { themeMode, lightTheme, darkTheme } = useTheme();

  const isDark = themeMode === "dark";

  const toggleTheme = () => {
    isDark ? lightTheme() : darkTheme();
  };

  return (
    <div className="fixed top-5 left-2 z-50">
      <button
        onClick={toggleTheme}
        className={`w-14 h-7 flex items-center rounded-full px-1 transition-colors duration-300 
          ${isDark ? "bg-gray-200" : "bg-gray-700"}`}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full shadow-md transform transition-transform duration-300
            ${isDark ? "translate-x-6 bg-yellow-400 text-white" : "translate-x-0 bg-white text-black"}`}
        >
          {isDark ? <FaSun size={14} /> : <FaMoon size={14} />}
        </div>
      </button>
    </div>
  );
}

