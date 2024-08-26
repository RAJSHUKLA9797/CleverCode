// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const UserDetails = () => {
//   const { username } = useParams();
//   const [userDetails, setUserDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const getSolvedProblems = async (handle) => {
//     try{
//       const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`);
//       const problemsData = response.data.result.map((problemdata) => problemdata.problem.name);
//       problems = [...problems, ...problemsData]
//       console.log(response);
//     }

//     catch(error){
//       console.log(error);
//     }
//   }
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await fetch(
//           `https://codeforces.com/api/user.info?handles=${username}`
//         );
//         const data = await response.json();
//         if (data.status === "OK") {
//           setUserDetails(data.result[0]);
//         } else {
//           setError("User not found");
//           setTimeout(() => {
//             navigate("/user");
//           }, 2000); // Delay for 2 seconds before navigating back
//         }
//       } catch (err) {
//         setError("An error occurred while fetching user details");
//         setTimeout(() => {
//           navigate("/user"); // Navigate back after displaying the error
//         }, 2000); // Delay for 2 seconds before navigating back
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, [username, navigate]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-red-500">
//         {error} - Redirecting...
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           {userDetails.firstName + " " + (userDetails.lastName != "undifined")}
//         </h2>
//         {/* Profile Image */}
//         <div className="flex items-center justify-center mb-4">
//           <img
//             src={userDetails.avatar}
//             alt="Profile"
//             className="w-36 h-36 rounded-full object-cover"
//           />
//         </div>
//         {getSolvedProblems(username)}
//         {/* User Information */}
//         {console.log(userDetails)}
//         <p className="mb-2">
//           <strong>Username:</strong> {userDetails.handle}
//         </p>
//         <p className="mb-2">
//           <strong>Rank:</strong> {userDetails.rank}
//         </p>
//         <p className="mb-2">
//           <strong>Rating:</strong> {userDetails.rating}
//         </p>
//         <p className="mb-2">
//           <strong>Max Rating:</strong> {userDetails.maxRating}
//         </p>
//         <p className="mb-2">
//           <strong>Contribution:</strong> {userDetails.contribution}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDetails = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);
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
          navigate("/user");
        }, 2000); // Delay for 2 seconds before navigating back
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [username, navigate]);

  useEffect(() => {
    const getSolvedProblems = async (handle) => {
      try {
        const response = await axios.get(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
        );
        console.log(response);

        const problemsData = response.data.result
          .filter((submission) => submission.verdict === "OK")
          .map((problemdata) => problemdata.problem.name);

        // Create a Set to keep only unique problem names
        const uniqueProblems = [...new Set(problemsData)];

        setSolvedProblems(uniqueProblems);
        console.log(uniqueProblems);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    if (userDetails) {
      getSolvedProblems(username);
    }
  }, [username, userDetails]);

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

  const fullName = `${userDetails.firstName || ""} ${
    userDetails.lastName || ""
  }`.trim();

  return (
    <div className=" max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden m-20">
      {/* Rectangular Image */}
      <img
        src="https://repository-images.githubusercontent.com/390296311/0f6c1240-462e-47ff-870d-e2d0ebb181f1"
        alt="Rectangular Image"
        className="w-full h-24 object-cover"
      />

      {/* Gap between images */}
      <div className="mt-6 flex justify-center">
        {/* Circular Image */}
        <img
          src={userDetails.avatar}
          alt="Circular Image"
          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between text-center">
          {/* First Section */}
          <div>
            <h3 className="text-lg font-medium">Rating</h3>
            <p className="text-gray-600">{userDetails.rating}</p>
          </div>
          {/* Second Section */}
          <div>
            <h3 className="text-lg font-medium">Max Rating</h3>
            <p className="text-gray-600">{userDetails.maxRating}</p>
          </div>
          {/* {console.log(userDetails)} */}
          <div>
            <h3 className="text-lg font-medium">Problems</h3>
            <p className="text-gray-600">{solvedProblems.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
