import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Tags from "./tags";
import { UserProfileColor } from "./UserProfileColor";
import Loader from "./loader";

const UserDetails = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvedCount, setSolvedCount] = useState(0); // New state for problem count

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch(
          `https://codeforces.com/api/user.info?handles=${username}`
        );
        const userData = await userResponse.json();

        if (userData.status === "OK") {
          setUserDetails(userData.result[0]);

          // Fetch the user's submissions to count solved problems
          const submissionsResponse = await axios.get(
            `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
          );
          const solvedProblems = submissionsResponse.data.result
            .filter((submission) => submission.verdict === "OK")
            .map((submission) => submission.problem.name);

          // Set the count of unique solved problems
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
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error} - Redirecting...
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        User details not found.
      </div>
    );
  }

  const fullName = `${userDetails.firstName || ""} ${
    userDetails.lastName || ""
  }`.trim();

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden m-20">
      <img
        src="https://repository-images.githubusercontent.com/390296311/0f6c1240-462e-47ff-870d-e2d0ebb181f1"
        alt="Rectangular Image"
        className="w-full h-16 object-cover"
      />

      <div className="mt-2 flex justify-center">
        <img
          src={userDetails.avatar}
          alt="Circular Image"
          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
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
        <hr className="border-t border-gray-300 w-full" />
      </div>
      <div>
        <div className="flex justify-between text-center px-4">
          <div>
            <h3 className="text-lg font-medium">Rating</h3>
            <p className="text-gray-600">{userDetails.rating}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Max Rating</h3>
            <p className="text-gray-600">{userDetails.maxRating}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Problems</h3>
            <p className="text-gray-600">{solvedCount}</p>{" "}
            {/* Display solved problems count */}
          </div>
        </div>
      </div>

      <Tags username={username} />
    </div>
  );
};

export default UserDetails;
