import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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

//   const { handle } = useParams();

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
    <div className="p-6 bg-white text-gray-900 rounded-2xl mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-sky-600"></h2>
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
        ❌ Error Pattern Detection <span className="text-black">{handle}</span>
      </h2>
      {loading ? (
        <p className="text-gray-600 text-lg">Loading...</p>
      ) : errorStats.length === 0 ? (
        <p className="text-green-600 text-lg">
          No errors detected. Great job! 🎉
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={errorStats}
            margin={{ top: 10, right: 30, left: 20, bottom: 100 }}
            barCategoryGap={10}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="type"
              type="category"
              tick={{ fill: "#0f172a", fontSize: 14 }}
              tickFormatter={getLabelWithEmoji}
              angle={-30}
              textAnchor="end"
              height={80}
            />
            <YAxis
              type="number"
              stroke="#334155"
              tick={{ fill: "#334155", fontSize: 14 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f1f5f9",
                border: "1px solid #cbd5e1",
                color: "#0f172a",
                fontSize: "14px",
              }}
              formatter={(value) => [`❌ ${value} times`, "Mistake Count"]}
              labelFormatter={(label) => getLabelWithEmoji(label)}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              label={{
                position: "top",
                fill: "#334155",
                fontSize: 14,
                fontWeight: 500,
              }}
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
