import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Emojis for each error type
const emojiMap = {
  "Edge Case Missed": "🧪",
  "Off-by-one Error": "➕➖",
  "Overflow / Precision Error": "💥",
  "Logic Issue": "🧠",
  "Inefficient Algorithm": "🐢",
  "Runtime Error (null/zero/invalid access)": "⚠️",
  "Memory Limit Exceeded": "💾",
  Other: "❓",
  Unknown: "❓",
};
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const getLabelWithEmoji = (label) => {
    return `🔍 ${label}`;
  };

  return (
    <div className="bg-white border border-gray-300 p-3 rounded-lg shadow-md text-sm dark:text-gray-200 dark:bg-gray-800">
      <p className="font-bold text-indigo-600 dark:text-indigo-400">{getLabelWithEmoji(label)}</p>
      {payload.map((entry, index) => (
        <p key={`item-${index}`} className=" m-0">
          ❌ {entry.value} times <span >({entry.name})</span>
        </p>
      ))}
    </div>
  );
  return null;
};

const getLabelWithEmoji = (label) => `${emojiMap[label] || ""} ${label}`;

const classifyError = (submission) => {
  const { verdict, problem, passedTestCount = 0 } = submission;

  if (!problem || !problem.tags) return "Unknown";

  if (verdict === "WRONG_ANSWER") {
    if (passedTestCount <= 2) return "Edge Case Missed";
    if (problem.tags.includes("implementation")) return "Off-by-one Error";
    if (problem.tags.includes("math") || problem.tags.includes("number theory"))
      return "Overflow / Precision Error";
    return "Logic Issue";
  }

  if (verdict === "TIME_LIMIT_EXCEEDED") return "Inefficient Algorithm";
  if (verdict === "MEMORY_LIMIT_EXCEEDED") return "Memory Limit Exceeded";
  if (verdict === "RUNTIME_ERROR")
    return "Runtime Error (null/zero/invalid access)";
  return "Other";
};

const getBarColor = (count) => {
  if (count >= 100) return "#ef4444"; // Red
  if (count >= 80) return "#f97316"; // Orange
  if (count >= 40) return "#facc15"; // Yellow
  if (count >= 20) return "#3b82f6"; // Blue
  return "#22c55e"; // Green
};

const ErrorPatternDetector = ({ handle }) => {
  const [errorStats, setErrorStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`
        );
        const submissions = res.data.result.filter(
          (sub) => sub.verdict !== "OK"
        );

        const errorCount = {};

        submissions.forEach((sub) => {
          const reason = classifyError(sub);
          errorCount[reason] = (errorCount[reason] || 0) + 1;
        });

        const data = Object.entries(errorCount).map(([type, count]) => ({
          type,
          count,
        }));

        setErrorStats(data.sort((a, b) => b.count - a.count));
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [handle]);

  return (
    <div className="p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-2xl mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700 dark:text-indigo-400">
        ❌ Error Pattern Detection <span className="text-black dark:text-white">{handle}</span>
      </h2>

      {loading ? (
        <p className="text-gray-600 dark:text-white text-lg">Loading...</p>
      ) : errorStats.length === 0 ? (
        <p className="text-green-600 dark:text-green-400 text-lg">
          No errors detected. Great job! 🎉
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={errorStats}
            margin={{ top: 10, right: 30, left: 20, bottom: 100 }}
            barCategoryGap={10}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="type"
              type="category"
              tick={{ fill: "#f97316", fontSize: 14 }}
              tickFormatter={getLabelWithEmoji}
              angle={-30}
              textAnchor="end"
              height={80}
            />
            <YAxis
              type="number"
              stroke="#f97316"
              tick={{ fill: "#f97316", fontSize: 14 }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
            >
              {errorStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ErrorPatternDetector;


// #3b82f6