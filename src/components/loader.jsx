import React from 'react'

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-customYellow animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-customBlue animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-customRed animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
}
