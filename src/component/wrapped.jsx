import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import ProblemCard from "./problemcard";
import Loader from "./loader";

const Wrapped = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [userInfo, setUserInfo] = useState(null);
  const [problemStats, setProblemStats] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!username) {
      setError("Username not provided. Redirecting...");
      setTimeout(() => navigate("/user"), 2000);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const userResponse = await fetch(
          `https://codeforces.com/api/user.info?handles=${username}`
        );
        const userData = await userResponse.json();

        if (userData.status === "OK") {
          setUserInfo(userData.result[0]);
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user info. Please try again later.");
      }
    };

    const fetchProblemStats = async () => {
      try {
        const problemResponse = await fetch(
          `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
        );
        const problemData = await problemResponse.json();

        if (problemData.status === "OK") {
          const solvedProblems = {};
          const solvedThisYear = new Set();
          const currentYear = new Date().getFullYear();

          problemData.result.forEach((submission) => {
            if (submission.verdict === "OK") {
              solvedProblems[submission.problem.name] = {
                tags: submission.problem.tags,
                difficulty: submission.problem.rating,
                url: `https://codeforces.com/contest/${submission.contestId}/problem/${submission.problem.index}`,
              };

              // Check if the problem was solved this year
              const submissionDate = new Date(
                submission.creationTimeSeconds * 1000
              );
              if (submissionDate.getFullYear() === currentYear) {
                solvedThisYear.add(submission.problem.name);
              }
            }
          });

          const tagsCount = {};
          Object.values(solvedProblems).forEach((problem) => {
            problem.tags.forEach((tag) => {
              tagsCount[tag] = (tagsCount[tag] || 0) + 1;
            });
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
            .sort(([, a], [, b]) => {
              return (b.difficulty || 0) - (a.difficulty || 0);
            })
            .slice(0, 5)
            .map(([name, problem]) => ({
              name,
              ...problem,
            }));

          setProblemStats({
            totalSolved: Object.keys(solvedProblems).length,
            totalSolvedThisYear: solvedThisYear.size,
            topTags,
            topProblems,
          });
        } else {
          throw new Error("Failed to fetch problem stats");
        }
      } catch (err) {
        console.error("Error fetching problem stats:", err);
        setError("Failed to fetch problem stats. Please try again later.");
      }
    };

    fetchUserInfo();
    fetchProblemStats();
  }, [username, navigate]);

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

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        {`${username}'s 2024 Wrapped`}
      </h1>

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
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
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
            {problemStats.totalSolvedThisYear}
          </p>
        </div>

        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h2>Top Tags Practiced</h2>
          <canvas id="topTagsChart" />
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginTop: "30px" }}>
        Top Problems based on Rating
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
            url={problem.url}
            isSolvedByMe={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Wrapped;
