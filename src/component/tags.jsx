import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tags({ username }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  const handleApply = () => {
    if (selectedTag) {
      navigate(`/problems/${username}/${selectedTag}`);
    }
  };

  const alltags = [
    "*combine tags by OR",
    "2-sat",
    "binary search",
    "bitmasks",
    "brute force",
    "chinese remainder theorem",
    "combinatorics",
    "constructive algorithms",
    "data structures",
    "dfs and similar",
    "divide and conquer",
    "dp",
    "dsu",
    "expression parsing",
    "fft",
    "flows",
    "games",
    "geometry",
    "graph matchings",
    "graphs",
    "greedy",
    "hashing",
    "implementation",
    "interactive",
    "math",
    "matrices",
    "meet-in-the-middle",
    "number theory",
    "probabilities",
    "shortest paths",
    "sortings",
    "*special",
    "string suffix structures",
    "strings",
    "ternary search",
    "trees",
    "two pointers",
  ];

  return (
    <Menu as="div" className="w-full p-4">
      <MenuButton className="w-full text-left p-3 bg-gray-100 border-t border-gray-200 shadow-md rounded-md" >
        {selectedTag ? selectedTag : `Select Question Tag `}
      </MenuButton>
      <MenuItems className="w-full bg-white shadow-md max-h-60 overflow-y-auto pb-10">
        {alltags.map((tag, index) => (
          <MenuItem key={index}>
            <button
              className="block w-full px-4 py-2 text-left hover:bg-blue-200 font-light"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
      <button
        className="mt-4 w-full hover:bg-customGreen text-white p-2 rounded bg-blue-600"
        onClick={handleApply}
        disabled={!selectedTag}
      >
        Apply
      </button>
    </Menu>
  );
}
