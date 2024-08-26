import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tags({ username }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  const handleApply = () => {
    if (selectedTag) {
      navigate(`/problems/${username}/${selectedTag}`);
    }
  };

  return (
    <Menu as="div" className="w-full p-4">
      <MenuButton className="w-full text-left p-4 bg-gray-100 border-t border-gray-200">
        {selectedTag ? selectedTag : 'Select Question Type'}
      </MenuButton>
      <MenuItems className="w-full bg-white shadow-md">
        <MenuItem>
          <button
            className="block w-full px-4 py-2 hover:bg-blue-100"
            onClick={() => setSelectedTag('DP')}
          >
            Dynamic Programming
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="block w-full px-4 py-2 hover:bg-blue-100"
            onClick={() => setSelectedTag('Graphs')}
          >
            Graphs
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="block w-full px-4 py-2 hover:bg-blue-100"
            onClick={() => setSelectedTag('Greedy')}
          >
            Greedy
          </button>
        </MenuItem>
        {/* Add more tags as needed */}
      </MenuItems>
      <button
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        onClick={handleApply}
        disabled={!selectedTag}
      >
        Apply
      </button>
    </Menu>
  );
}
