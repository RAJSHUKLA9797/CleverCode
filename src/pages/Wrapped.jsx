import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Chart from "chart.js/auto";
import ProblemCard from "../components/Problemcard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

const Wrapped = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handle } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [problemStats, setProblemStats] = useState(null);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!handle) {
      setError("handle not provided. Redirecting...");
      setTimeout(() => navigate("/user"), 2000);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(
          `https://codeforces.com/api/user.info?handles=${handle}`
        );
        const userData = await userResponse.json();

        if (userData.status === "OK") {
          setUserInfo(userData.result[0]);
        } else {
          throw new Error("Failed to fetch user info");
        }

        const problemResponse = await fetch(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
        );
        const problemData = await problemResponse.json();

        if (problemData.status === "OK") {
          const solvedProblems = {};
          const tagsCount = {};

          problemData.result.forEach((submission) => {
            const submissionDate = new Date(
              submission.creationTimeSeconds * 1000
            );

            if (
              submission.verdict === "OK" &&
              submissionDate.getFullYear() === year
            ) {
              solvedProblems[submission.problem.name] = {
                tags: submission.problem.tags,
                difficulty: submission.problem.rating,
                url: `https://codeforces.com/contest/${submission.contestId}/problem/${submission.problem.index}`,
              };

              submission.problem.tags.forEach((tag) => {
                tagsCount[tag] = (tagsCount[tag] || 0) + 1;
              });
            }
          });

          const topTags = Object.entries(tagsCount)
            .map(([tag, count]) => ({ name: tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          const topProblems = Object.entries(solvedProblems)
            .filter(([, problem]) =>
              problem.tags.some((tag) =>
                topTags.map((t) => t.name).includes(tag)
              )
            )
            .sort(([, a], [, b]) => (b.difficulty || 0) - (a.difficulty || 0))
            .slice(0, 5)
            .map(([name, problem]) => ({
              name,
              ...problem,
            }));

          setProblemStats({
            totalSolved: Object.keys(solvedProblems).length,
            topTags,
            topProblems,
          });
        } else {
          throw new Error("Failed to fetch problem stats");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchUserData();
  }, [handle, year, navigate]);

  useEffect(() => {
    let chartInstance = null;

    if (problemStats) {
      const canvas = document.getElementById("topTagsChart");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: problemStats.topTags.map((tag) => tag.name),
            datasets: [
              {
                label: "Problems Solved",
                data: problemStats.topTags.map((tag) => tag.count),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [problemStats]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!userInfo || !problemStats) {
    return <Loader />;
  }

  const startYear = new Date(userInfo.registrationTimeSeconds * 1000).getFullYear();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
        <h1 className="text-3xl text-center mb-6">
          {`${handle}'s ${year} Wrapped`}
        </h1>

        <div className="text-center mb-6">
          <label htmlFor="year-select" className="mr-2 font-semibold">
            Select Year:
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded"
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <div className="flex justify-center mb-4">
              <img
                src={userInfo.avatar}
                alt="Profile"
                className="w-48 h-48 object-cover rounded-lg shadow"
              />
            </div>
            <div className="flex justify-between text-center mb-4 px-4">
              <div>
                <h3 className="font-bold">Handle:</h3>
                <p className="text-gray-700 dark:text-gray-300">{userInfo.handle}</p>
              </div>
              <div>
                <h3 className="font-bold">Rank:</h3>
                <p className="text-gray-700 dark:text-gray-300">{userInfo.rank}</p>
              </div>
              <div>
                <h3 className="font-bold">Rating:</h3>
                <p className="text-gray-700 dark:text-gray-300">{userInfo.rating}</p>
              </div>
            </div>
            <p className="mb-1">
              <strong>Max Rating:</strong> {userInfo.maxRating} ({userInfo.maxRank})
            </p>
            <p>
              <strong>Total Problems Solved This Year:</strong>{" "}
              {problemStats.totalSolved}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Top Tags This Year</h2>
            <canvas id="topTagsChart" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mt-10 mb-4">
          Top Rated Problems Solved
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problemStats.topProblems.map((problem, index) => (
            <ProblemCard
              key={index}
              name={problem.name}
              difficulty={problem.difficulty || "Unrated"}
              tags={problem.tags}
              url={problem.url}
              isSolvedByMe={true}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Wrapped;
