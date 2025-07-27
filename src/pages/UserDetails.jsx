import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Tags from "../components/Tags";
import { UserProfileColor } from "../components/UserProfileColor";
import Loader from "../components/Loader";
import CustomButton from "../components/CustomButton";

const UserDetails = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await fetch(
          `https://codeforces.com/api/user.info?handles=${username}`
        );
        const userData = await userResponse.json();

        if (userData.status === "OK") {
          setUserDetails(userData.result[0]);

          const submissionsResponse = await axios.get(
            `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
          );
          const solvedProblems = submissionsResponse.data.result
            .filter((submission) => submission.verdict === "OK")
            .map((submission) => submission.problem.name);

          setSolvedCount([...new Set(solvedProblems)].length);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching user details"
        );
        setTimeout(() => {
          navigate("/user");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [username, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 dark:text-red-400">
        {error} - Redirecting...
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 dark:text-red-400">
        User details not found.
      </div>
    );
  }

  const fullName = `${userDetails.firstName || ""} ${
    userDetails.lastName || ""
  }`.trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="max-w-sm w-full mx-auto bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg overflow-hidden m-4">
      <img
        className="w-80 h-16 object-contain mx-7"
        src="https://user-images.githubusercontent.com/49322948/159158565-ded8dc03-6676-496d-8496-1f9d05f3fb58.png"
        alt="Rectangular Header"
      />

      <div className="mt-2 flex justify-center">
        <img
          src={userDetails.avatar}
          alt="User Avatar"
          className="w-24 h-24 object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
        />
      </div>

      <div className="flex flex-col justify-center items-center">
        <h3 className="text-lg font-medium underline">{fullName}</h3>
        <h1 className={UserProfileColor(userDetails.rank)}>
          {userDetails.rank}
        </h1>
      </div>

      <div className="flex flex-col justify-center items-center mt-2">
        <h3 className="text-sm font-light">
          {userDetails.organization}, {userDetails.country}
        </h3>
      </div>

      <div className="py-4">
        <hr className="border-t border-gray-300 dark:border-gray-600 w-full" />
      </div>

      <div className="px-4">
        <div className="flex justify-between text-center">
          <div>
            <h3 className="text-lg font-medium">Rating</h3>
            <p className="text-gray-600 dark:text-gray-300">{userDetails.rating}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Max Rating</h3>
            <p className="text-gray-600 dark:text-gray-300">{userDetails.maxRating}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Problems</h3>
            <p className="text-gray-600 dark:text-gray-300">{solvedCount}</p>
          </div>
        </div>
      </div>

      <Tags username={username} />

      <div className="text-center mt-1">
        <CustomButton
          label="Performance"
          onClick={() => navigate(`/user/${username}/topic-mastery`)}
          className="px-4 py-2 m-2 hover:bg-customGreen bg-blue-600 text-white rounded dark:bg-blue-700 dark:hover:bg-green-600"
        />
      </div>

    </div>
    </div>
  );
};

export default UserDetails;
