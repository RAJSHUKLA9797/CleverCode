import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import ProblemCard from "./problemcard";
import Loader from "./loader";
import Navbar from "./navbar";

const Wrapped = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [userInfo, setUserInfo] = useState(null);
  const [problemStats, setProblemStats] = useState(null);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!username) {
      setError("Username not provided. Redirecting...");
      setTimeout(() => navigate("/user"), 2000);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch User Info
        const userResponse = await fetch(
          `https://codeforces.com/api/user.info?handles=${username}`
        );
        const userData = await userResponse.json();

        if (userData.status === "OK") {
          setUserInfo(userData.result[0]);
        } else {
          throw new Error("Failed to fetch user info");
        }

        const problemResponse = await fetch(
          `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
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
  }, [username, year, navigate]);

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
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  if (!userInfo || !problemStats) {
    return <Loader />;
  }

  // Calculate start year for dropdown
  const startYear = new Date(
    userInfo.registrationTimeSeconds * 1000
  ).getFullYear();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          {`${username}'s ${year} Wrapped`}
        </h1>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <label htmlFor="year-select" style={{ marginRight: "10px" }}>
            Select Year:
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#f5f5f5",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h2 className="text-lg font-bold" style={{ marginBottom: "20px" }}>
              User Info
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "15px",
              }}
            >
              <img
                src={userInfo.avatar}
                alt="Profile"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
            <div
              className="flex justify-between text-center px-4"
              style={{ marginBottom: "10px" }}
            >
              <div>
                <h3 className="text-lg font-bold">Handle:</h3>
                <p className="text-gray-600">{userInfo.handle}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold">Rank:</h3>
                <p className="text-gray-600">{userInfo.rank}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold">Rating:</h3>
                <p className="text-gray-600">{userInfo.rating}</p>
              </div>
            </div>
            <p>
              <strong>Max Rating:</strong> {userInfo.maxRating} (
              {userInfo.maxRank})
            </p>
            <p>
              <strong>Total Problems Solved This Year:</strong>{" "}
              {problemStats.totalSolved}
            </p>
          </div>

          <div>
            <h2>Top Tags This Year</h2>
            <canvas id="topTagsChart" />
          </div>
        </div>

        <h2 style={{ textAlign: "center", marginTop: "30px" }}>
          Top Rated Problems Solved
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {problemStats.topProblems.map((problem, index) => (
            <ProblemCard
              key={index}
              name={problem.name}
              difficulty={problem.difficulty || "Unrated"}
              tags={problem.tags}
              url={problem.url}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Wrapped;
