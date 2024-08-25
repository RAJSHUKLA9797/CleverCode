import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/user");
  };

  return (
    <div className="grid grid-cols-1 divide-y">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-lg rounded overflow-hidden shadow-lg bg-white">
          <img
            className="w-full h-24 object-cover"
            src="https://repository-images.githubusercontent.com/390296311/0f6c1240-462e-47ff-870d-e2d0ebb181f1"
            alt="Sunset in the mountains"
          />

          <div className="px-6">
            <hr className="border-t border-gray-300 w-full" />
          </div>

          <div className="px-5 py-3">
            <h1 className="text-center mb-3 text-2xl font-bold font-lato">
              {"<< "} “CleverCode” {" >>"}{" "}
            </h1>
            <h1 className="text-center mb-3 text-xl font-bold">
              --- About CleverCode ---
            </h1>
            <p className="text-gray-700 text-sm text-center font-semibold font-lato">
              CleverCode is an indispensable tool developed to assist fellow
              coders who want to be better at competitive programming, have
              their Codeforces account set up and ready to use but don't have a
              structured way to practice problems.
            </p>
          </div>

          <div className="px-6">
            <hr className="border-t border-gray-300 w-full" />
          </div>
          <div className="px-5 py-3">
            <h1 className="text-center mb-3 text-xl font-bold">
              --- Steps to use ---
            </h1>
            <ul className="text-gray-700 text-sm text-left list-disc pl-4 font-lato font-semibold">
              <li className="mb-1">
                Enter the Codeforces handle/username of the person you want to
                view the solved problems of.
              </li>
              <li className="mb-1">
                On the next page, select the problem tag you want to view the
                solved problems of.
              </li>
              <li className="mb-1">
                The Problems page displays that particular person's solved
                problems of the selected tag sorted by their rating and the
                Codeforces link to the original problem. Here, you can enter
                your handle to check your progress.
              </li>
              <li className="mb-1">
                On the Progress page, the problems you have solved appear as
                green cards.
              </li>
            </ul>
          </div>

          <div className="px-5 pb-3 text-center">
            <button
              className="bg-customGreen hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleButtonClick}
            >
              Proceed &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
