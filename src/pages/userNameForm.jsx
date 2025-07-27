import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";

const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      navigate(`/user/${username}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 shadow-md w-96 text-gray-900 dark:text-white"
        style={{ borderRadius: "3%" }}
      >
        <img
          className="w-full h-12 object-contain"
          src="https://user-images.githubusercontent.com/49322948/159158565-ded8dc03-6676-496d-8496-1f9d05f3fb58.png"
          alt="CleverCode banner"
          style={{ borderRadius: "10% 10% 0 0" }}
        />

        <div className="px-1">
          <hr className="border-t border-gray-300 dark:border-gray-600 w-full" />
        </div>

        <h1 className="text-center mb-3 text-2xl font-extrabold font-lato">
          {"<< "} “CleverCode” {" >>"}
        </h1>
        <h2 className="text-xl font-bold mb-4 text-center">
          Enter Codeforces Username
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <CustomButton
          label="Submit"
          onClick={handleSubmit}
          className="w-full hover:bg-customGreen bg-blue-600 text-white font-bold py-2 px-4 rounded"
        />
      </form>
    </div>
  );
};

export default UsernameForm;
