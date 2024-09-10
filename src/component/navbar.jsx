import React, { useState } from "react";

const Navbar = ({ username, onCompare }) => {
  const [myUsername, setMyUsername] = useState("");

  const handleCompare = () => {
    if (myUsername.trim()) {
      onCompare(myUsername);
      // {console.log(`${username} compared with ${myUsername}`)}
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-center text-white">
      <div className="text-lg font-semibold hidden md:block">
        {username}'s Solved Problems
      </div>
      <div className="flex flex-row items-center w-full md:w-auto">
        <input
          type="text"
          value={myUsername}
          onChange={(e) => setMyUsername(e.target.value)}
          placeholder="Enter your username"
          className="p-2 rounded bg-gray-200 text-gray-800 w-3/5 md:w-auto mr-2"
        />
        
        <button
          onClick={handleCompare}
          className="p-2 bg-customgreen text-white rounded w-2/5 md:w-auto"
        >
          Compare
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
