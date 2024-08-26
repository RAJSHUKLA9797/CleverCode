import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import ProblemCard from "./problemcard";
import { useParams } from "react-router-dom";

// Configure axios-retry
axiosRetry(axios, { retries: 3 });

const Problems = () => {
  const { username, tag } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblemsByTag = async () => {
      try {
        // Fetch user submissions
        const response = await axios.get(
          `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
        );
        console.log("API Response:", response.data);

        // Extract problem details
        const problemsData = response.data.result
          .filter(
            (submission) =>
              submission.verdict === "OK" &&
              submission.problem.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
          )
          .map((problemdata) => ({
            name: problemdata.problem.name,
            contestId: problemdata.problem.contestId,
            index: problemdata.problem.index,
            url: `https://codeforces.com/problemset/problem/${problemdata.problem.contestId}/${problemdata.problem.index}`
          }));

        // Remove duplicate problems based on contestId and index
        const uniqueProblems = Array.from(
          new Map(
            problemsData.map(problem => [problem.contestId + problem.index, problem])
          ).values()
        );

        // Fetch problem details to get difficulty
        const problemDetailsPromises = uniqueProblems.map(async (problem) => {
          try {
            const detailsResponse = await axios.get(
              `https://codeforces.com/api/problemset.problem?contestId=${problem.contestId}&index=${problem.index}`
            );
            const problemDetail = detailsResponse.data.result;
            return {
              ...problem,
              difficulty: problemDetail.rating || "Not Rated"
            };
          } catch (err) {
            console.error("Error fetching problem details:", err);
            return { ...problem, difficulty: "Not Rated" };
          }
        });

        const detailedProblems = await Promise.all(problemDetailsPromises);

        // Sort problems by difficulty (ascending)
        detailedProblems.sort((a, b) => {
          const diffA = a.difficulty === "Not Rated" ? Infinity : a.difficulty;
          const diffB = b.difficulty === "Not Rated" ? Infinity : b.difficulty;
          return diffA - diffB;
        });

        setProblems(detailedProblems);
      } catch (error) {
        setError("Error fetching problems");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemsByTag();
  }, [username, tag]);

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
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-4 text-center">Solved Problems - {tag}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {problems.length > 0 ? (
          problems.map((problem, index) => (
            <ProblemCard
              key={index}
              name={problem.name}
              difficulty={problem.difficulty}
              url={problem.url}
            />
          ))
        ) : (
          <p>No problems found for the selected tag.</p>
        )}
      </div>
    </div>
  );
};

export default Problems;
