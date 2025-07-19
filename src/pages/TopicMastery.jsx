import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomButton from "../components/CustomButton";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";



const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 p-3 rounded-lg shadow-md text-sm">
        <p className="font-bold text-indigo-600">{label}</p>
        <p>✅ Solved: {data.solved}</p>
        <p>📝 Attempted: {data.attempted}</p>
        <p>🎯 Accuracy: {data.accuracy}%</p>
      </div>
    );
  }
  return null;
};

const getBarColor = (accuracy) => {
  if (accuracy >= 80) return "#22c55e"; // Green
  if (accuracy >= 60) return "#3b82f6"; // Blue
  if (accuracy >= 40) return "#facc15"; // Yellow
  if (accuracy >= 20) return "#f97316"; // Orange
  return "#ef4444"; // Red
};

const TopicMastery = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [tagStats, setTagStats] = useState([]);
  const isMobile = window.innerWidth < 768;
  const [problemAttempted, setProblemAttempted] = useState(0);
  const [totalSolvedProblems, setTotalSolvedProblems] = useState(0);
    // const handleYearWrapped = () => {
    //   navigate("/wrapped", { state: { handle } });
    // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, probRes] = await Promise.all([
          axios.get(
            `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
          ),
          axios.get("https://codeforces.com/api/problemset.problems"),
        ]);

        const submissions = subRes.data.result;
        const problems = probRes.data.result.problems;

        const problemMeta = {};
        problems.forEach((p) => {
          problemMeta[`${p.contestId}-${p.index}`] = { tags: p.tags || [] };
        });
        setProblemAttempted(submissions.length);
        
        const tagMap = {};
        const solvedSet = new Set();
        submissions.forEach((sub) => {
          const id = `${sub.problem.contestId}-${sub.problem.index}`;
          const meta = problemMeta[id];
          if (!meta) return;
          
          meta.tags.forEach((tag) => {
            if (!tagMap[tag]) tagMap[tag] = { attempted: 0, solved: 0 };
            tagMap[tag].attempted++;
            if (sub.verdict === "OK") {
              tagMap[tag].solved++
              solvedSet.add(id);
            };
          });
        });
        setTotalSolvedProblems(solvedSet.size);
        // console.log(problemAttempted);
        // console.log(totalSolvedProblems);
        const statsArray = Object.entries(tagMap).map(([tag, stats]) => ({
          tag,
          solved: stats.solved,
          attempted: stats.attempted,
          accuracy:
            stats.attempted > 0
              ? Number(((stats.solved / stats.attempted) * 100).toFixed(2))
              : 0,
        }));

        statsArray.sort((a, b) => b.solved - a.solved);
        setTagStats(statsArray.slice(0, isMobile ? 10 : 32));
      } catch (err) {
        console.error("Fetching error", err);
      }
    };

    fetchData();
  }, [handle,isMobile]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
        <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold">{totalSolvedProblems}</div>
          <div className="text-lg">Problems Solved</div>
        </div>
        <div className="bg-blue-100 border border-blue-400 text-blue-800 px-6 py-4 rounded-lg shadow text-center">
          <div className="text-3xl font-bold">{problemAttempted}</div>
          <div className="text-lg">Problems Attempted</div>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <CustomButton
          label="Recommended Problems"
          onClick={() => navigate(`/user/${handle}/recommendations`)}
          className="px-4 py-2 m-2 hover:bg-customGreen bg-blue-600 text-white rounded"
        />
        <CustomButton
          label="Year Wrapped"
          onClick={() => navigate(`/user/${handle}/wrapped`)}
          className="px-4 py-2 m-2 hover:bg-customGreen bg-blue-600 text-white rounded"
        />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
        📊 Topic Mastery Chart for <span className="text-black">{handle}</span>
      </h2>

      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={tagStats}
          margin={{ top: 10, right: 30, left: 10, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="tag"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
            tick={{ fontSize: 12 }}
          />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="accuracy"
            name="Accuracy (%)"
            stroke="#4f46e5"
            radius={[6, 6, 0, 0]}
          >
            {tagStats.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.accuracy)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopicMastery;
