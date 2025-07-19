import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProblemCard from "../components/problemcard"; // Adjust the import path as necessary 
import { use } from "react";

const SmartRecommendations = () => {
  const { handle } = useParams();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(1200);
  const [difficultyRange, setDifficultyRange] = useState([]);
  const [suggestedCount, setSuggestedCount] = useState([10]); // remove array
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const userRes = await axios.get(
          `https://codeforces.com/api/user.info?handles=${handle}`
        );
        const rating = userRes.data.result[0].rating || 1200;
        const mul = Math.floor(rating / 100);
        const nrating = 100 * mul;

        setUserRating(nrating);
        setDifficultyRange([
          Math.max(nrating - 200, 800),
          Math.min(nrating + 200, 4500),
        ]);
      } catch (error) {
        console.error("Failed to fetch user rating:", error);
        setUserRating(1200);
        setDifficultyRange([1000, 1400]); // fallback range
      }
    };

    if (handle) {
      fetchUserRating();
    }
  }, [handle]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, probRes] = await Promise.all([
          axios.get(
            `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=11000`
          ),
          axios.get(`https://codeforces.com/api/problemset.problems`),
        ]);
        const submissions = subRes.data.result; // Extract submissions
        // console.log(submissions);

        const problems = probRes.data.result.problems;
        // console.log(problems);

        const problemMeta = {};

        problems.forEach((problem) => {
          const id = `${problem.contestId}-${problem.index}`;
          problemMeta[id] = {
            tags: problem.tags || [],
            rating: problem.rating || 0,
          };
        });
        // console.log(problemMeta);

        // tags - array of tags for each problem
        // rating - rating of the problem
        const solvedSet = new Set();
        const tagStats = {};
        //  solved set and tag stats

        submissions.forEach((sub) => {
          const id = `${sub.problem.contestId}-${sub.problem.index}`;

          const meta = problemMeta[id];
          if (!meta) return;

          const tags = meta.tags;
          tags.forEach((tag) => {
            if (!tagStats[tag]) tagStats[tag] = { attempted: 0, solved: 0 };
            tagStats[tag].attempted += 1;
            if (sub.verdict === "OK") tagStats[tag].solved += 1;
          });

          if (sub.verdict === "OK") {
            solvedSet.add(id);
          }
        });

        // Find weak tags
        const weakTags = Object.entries(tagStats)
          .filter(
            ([_, data]) => data.solved / data.attempted < 0.36 || data.solved < 5
          )
          .map(([tag]) => tag);
        //   {
        //     console.log(weakTags);

        //   }

        // Filter problems
        const [minDiff, maxDiff] = difficultyRange;
        const [problemCount] = suggestedCount;
        const recs = problems
          .filter((p) => {
            const id = `${p.contestId}-${p.index}`;

            const matchesWeakTag = (p.tags || []).some((tag) =>
              weakTags.includes(tag)
            );
            const inDifficulty = p.rating >= minDiff && p.rating <= maxDiff;
            const matchesSelected =
              selectedTags.length === 0 ||
              (p.tags || []).some((tag) => selectedTags.includes(tag));
            return (
              matchesWeakTag &&
              !solvedSet.has(id) &&
              inDifficulty &&
              matchesSelected
            );
          })

          .slice(0, problemCount); // limit to 10 recommendations
        setRecommended(recs);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [handle, difficultyRange, suggestedCount, selectedTags]);

  return (
    <div className=" mx-auto p-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-6">
        <label className="text-base font-medium text-gray-700">
          Difficulty Range:
        </label>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="800"
            max="4500"
            step={100}
            value={difficultyRange[0]}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                // Don't update state; allow user to keep typing
                setDifficultyRange(["", difficultyRange[1]]);
              } else {
                const num = +value;
                setDifficultyRange([num, difficultyRange[1]]);
              }
            }}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <span className="text-xl">–</span>
          <input
            type="number"
            min="800"
            max="4500"
            step={100}
            value={difficultyRange[1]}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setDifficultyRange([difficultyRange[0], ""]);
              } else {
                setDifficultyRange([difficultyRange[0], +value]);
              }
            }}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {!loading && !error && recommended.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Weak Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(
              recommended.reduce((acc, p) => {
                (p.tags || []).forEach((tag) => acc.add(tag));
                return acc;
              }, new Set())
            ).map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-blue-100 text-blue-700 border-blue-300"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Problem Recommendations
      </h2>
      <div className="flex items-center gap-2">
        <label className="text-base font-medium text-gray-700">
          Problem Count:
        </label>
        <input
          type="number"
          min="1"
          max="100"
          step={1}
          value={suggestedCount[0]}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              setSuggestedCount(["", suggestedCount[1]]);
            } else {
              setSuggestedCount([+e.target.value, suggestedCount[0]]);
            }
          }}
          className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {loading && <p className="text-gray-600">Loading recommendations...</p>}

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!loading && !error && recommended.length === 0 && (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-600">
          No recommendations found in this range. Try to adjust the difficulty
          or solve more problems to generate weak tags.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {recommended.map((problem) => (
          <ProblemCard
            key={`${problem.contestId}-${problem.index}`}
            name={problem.name}
            difficulty={problem.rating}
            url={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
            isSolvedByMe={false} // Assuming we don't have solved status here
          />
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendations;
