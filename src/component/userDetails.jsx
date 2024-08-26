import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Tags from "./tags";

const UserDetails = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvedCount, setSolvedCount] = useState(0);  // New state for problem count

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        const userData = await userResponse.json();

        if (userData.status === "OK") {
          setUserDetails(userData.result[0]);

          // Fetch the user's submissions to count solved problems
          const submissionsResponse = await axios.get(
            `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
          );
          const solvedProblems = submissionsResponse.data.result
            .filter(submission => submission.verdict === 'OK')
            .map(submission => submission.problem.name);
          
          // Set the count of unique solved problems
          setSolvedCount([...new Set(solvedProblems)].length);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching user details");
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
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

  const fullName = `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim();

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden m-20">
      <img
        src="https://repository-images.githubusercontent.com/390296311/0f6c1240-462e-47ff-870d-e2d0ebb181f1"
        alt="Rectangular Image"
        className="w-full h-24 object-cover"
      />

      <div className="mt-6 flex justify-center">
        <img
          src={userDetails.avatar}
          alt="Circular Image"
          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between text-center">
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
            <p className="text-gray-600">{solvedCount}</p> {/* Display solved problems count */}
          </div>
        </div>
      </div>

      <Tags username={username} />
    </div>
  );
};

export default UserDetails;
