import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserDetails = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `https://codeforces.com/api/user.info?handles=${username}`
        );
        const data = await response.json();
        if (data.status === "OK") {
          setUserDetails(data.result[0]);
        } else {
          setError("User not found");
          setTimeout(() => {
            navigate("/user"); 
          }, 2000); // Delay for 2 seconds before navigating back
        }
      } catch (err) {
        setError("An error occurred while fetching user details");
        setTimeout(() => {
          navigate("/user"); // Navigate back after displaying the error
        }, 2000); // Delay for 2 seconds before navigating back
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">User Details</h2>
        <p className="mb-2">
          <strong>Username:</strong> {userDetails.handle}
        </p>
        <p className="mb-2">
          <strong>Rank:</strong> {userDetails.rank}
        </p>
        <p className="mb-2">
          <strong>Rating:</strong> {userDetails.rating}
        </p>
        <p className="mb-2">
          <strong>Max Rating:</strong> {userDetails.maxRating}
        </p>
        <p className="mb-2">
          <strong>Contribution:</strong> {userDetails.contribution}
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
