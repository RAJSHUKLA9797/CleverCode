import React, { useEffect, useState } from "react";
import axios from "axios";
import ProblemCard from "./problemcard";
import { useParams } from "react-router-dom";

const Problems = () => {
  const { username, tag } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblemsByTag = async () => {
      try {
        // Fetch user submissions
        const submissionsResponse = await axios.get(
          `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
        );
        console.log("Submissions Response:", submissionsResponse.data);

        // Extract problem details from submissions
        const problemsData = submissionsResponse.data.result
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

        // Fetch all problems to get difficulty
        const problemDetailsResponse = await axios.get(
          `https://codeforces.com/api/problemset.problems`
        );
        const problemsList = problemDetailsResponse.data.result.problems;

        // Map the fetched problems to their details
        const detailedProblems = uniqueProblems.map(problem => {
          const problemDetail = problemsList.find(
            p => p.contestId === problem.contestId && p.index === problem.index
          );
          return {
            ...problem,
            difficulty: problemDetail ? problemDetail.rating || "Not Rated" : "Not Rated"
          };
        });

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
