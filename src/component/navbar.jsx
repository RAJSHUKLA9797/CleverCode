import React, { useState } from "react";

const Navbar = ({ username, onCompare }) => {
  const [myUsername, setMyUsername] = useState("");

  const handleCompare = () => {
    onCompare(myUsername);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <div className="text-lg font-semibold">{username}'s Solved Problems</div>
      <div className="flex items-center">
        <input
          type="text"
          value={myUsername}
          onChange={(e) => setMyUsername(e.target.value)}
          placeholder="Enter your username"
          className="mr-2 p-2 rounded bg-gray-200 text-gray-800"
        />
        <button
          onClick={handleCompare}
          className="p-2 bg-customgreen text-white rounded"
        >
          Compare
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
