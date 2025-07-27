import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ onCompare }) => {
  const [myUsername, setMyUsername] = useState("");
  const navigate = useNavigate();

  const handleCompare = () => {
    if (myUsername.trim()) {
      onCompare(myUsername);
    } else {
      alert("Please enter a username to compare.");
    }
  };

  return (
    <nav
      className="bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-center text-white"
      style={{
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Header Title */}
      <div className="text-lg font-semibold hidden md:block">
        Codeforces Analyzer
      </div>

      {/* Compare Input and Button */}
      <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-2">
        <input
          type="text"
          value={myUsername}
          onChange={(e) => setMyUsername(e.target.value)}
          placeholder="Enter your username"
          className="p-2 rounded bg-gray-200 text-gray-800 w-full md:w-auto"
          style={{
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
        <button
          onClick={handleCompare}
          className="p-2 text-white rounded w-full md:w-auto"
          style={{
            backgroundColor: "#4CAF50",
            fontWeight: "bold",
          }}
        >
          Compare
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
