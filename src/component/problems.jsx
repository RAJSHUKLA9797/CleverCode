import React, { useEffect, useState } from "react";
import axios from "axios";
import ProblemCard from "./problemcard";
import { useParams } from "react-router-dom";
import Loader from "./loader";
import Navbar from "./navbar";

const Problems = () => {
  const { username, tag } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mySolvedProblems, setMySolvedProblems] = useState([]);

  useEffect(() => {
    const fetchProblemsByTag = async () => {
      try {
        // Fetch user submissions
        const submissionsResponse = await axios.get(
          `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
        );

        // Extract problem details from submissions
        const problemsData = submissionsResponse.data.result
          .filter(
            (submission) =>
              submission.verdict === "OK" &&
              submission.problem.tags
                .map((t) => t.toLowerCase())
                .includes(tag.toLowerCase())
          )
          .map((problemdata) => ({
            name: problemdata.problem.name,
            contestId: problemdata.problem.contestId,
            index: problemdata.problem.index,
            url: `https://codeforces.com/problemset/problem/${problemdata.problem.contestId}/${problemdata.problem.index}`,
          }));

        // Remove duplicate problems based on contestId and index
        const uniqueProblems = Array.from(
          new Map(
            problemsData.map((problem) => [
              problem.contestId + problem.index,
              problem,
            ])
          ).values()
        );

        // Fetch all problems to get difficulty
        const problemDetailsResponse = await axios.get(
          `https://codeforces.com/api/problemset.problems`
        );
        const problemsList = problemDetailsResponse.data.result.problems;

        // Map the fetched problems to their details
        const detailedProblems = uniqueProblems.map((problem) => {
          const problemDetail = problemsList.find(
            (p) =>
              p.contestId === problem.contestId && p.index === problem.index
          );
          return {
            ...problem,
            difficulty: problemDetail
              ? problemDetail.rating || "Not Rated"
              : "Not Rated",
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

  const handleCompare = async (myUsername) => {
    try {
      const mySubmissionsResponse = await axios.get(
        `https://codeforces.com/api/user.status?handle=${myUsername}&from=1&count=10000`
      );

      const mySolved = mySubmissionsResponse.data.result
        .filter((submission) => submission.verdict === "OK")
        .map((submission) => `${submission.problem.contestId}-${submission.problem.index}`);

      setMySolvedProblems(mySolved);
    } catch (error) {
      console.error("Error fetching your solved problems:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <Navbar username={username} onCompare={handleCompare} />
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4 text-center">
          Solved Problems - {tag}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {problems.length > 0 ? (
            problems.map((problem, index) => (
              <ProblemCard
                key={index}
                name={problem.name}
                difficulty={problem.difficulty}
                url={problem.url}
                isSolvedByMe={mySolvedProblems.includes(`${problem.contestId}-${problem.index}`)}
              />
            ))
          ) : (
            <p>No problems found for the selected tag.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
