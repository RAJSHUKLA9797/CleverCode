import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md w-96"
        style={{ borderRadius: "3%" }}
      >
        <img
          className="w-full h-12 object-cover "
          src="https://repository-images.githubusercontent.com/390296311/0f6c1240-462e-47ff-870d-e2d0ebb181f1"
          alt="Sunset in the mountains"
          style={{ borderRadius: "10% 10% 0 0" }}
        />
        <div className="px-1">
          <hr className="border-t border-gray-300 w-full" />
        </div>
        <h1 className="text-center mb-3 text-2xl font-extrabold font-lato">
          {"<< "} “CleverCode” {" >>"}{" "}
        </h1>
        <h2 className="text-xl font-bold mb-4 text-center">
          Enter Codeforces Username
        </h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-customGreen hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      {/* <QuestionCard/> */}
    </div>
  );
};

export default UsernameForm;
