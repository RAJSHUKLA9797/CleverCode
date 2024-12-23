import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ username, onCompare }) => {
  const [inputHandle, setInputHandle] = useState("");
  const [myUsername, setMyUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    if (inputHandle.trim()) {
      navigate("/wrapped", { state: { username: inputHandle.trim() } });
    } else {
      alert("Please enter a valid Codeforces handle.");
    }
  };

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
      {/* Header Title */}
      <div className="text-lg font-semibold hidden md:block">
        {location.pathname === "/wrapped" && username
          ? `${username}'s Year Wrapped`
          : "Codeforces Analyzer"}
      </div>

      {/* Input and Buttons */}
      <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-2">
        {/* Search Input */}
        <input
          type="text"
          value={inputHandle}
          onChange={(e) => setInputHandle(e.target.value)}
          placeholder="Enter Codeforces handle"
          className="p-2 rounded bg-gray-200 text-gray-800 w-full md:w-auto"
          style={{
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-customgreen text-white rounded w-full md:w-auto"
          style={{
            backgroundColor: "#4CAF50",
            fontWeight: "bold",
          }}
        >
          View Wrapped
        </button>

        {/* Compare Input */}
        {onCompare && location.pathname === "/wrapped" && (
          <>
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
              className="p-2 bg-customgreen text-white rounded w-full md:w-auto"
              style={{
                backgroundColor: "#4CAF50",
                fontWeight: "bold",
              }}
            >
              Compare
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
