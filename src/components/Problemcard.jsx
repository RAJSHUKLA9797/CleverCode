import React from "react";

const ProblemCard = ({ name, difficulty, url, isSolvedByMe }) => {
  return (
    <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl max-w-sm">
      <div className="p-6">
        <h5 className="block mb-2 font-sans text-3xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {name}
        </h5>
        <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          Rating: {difficulty}
        </p>
        {isSolvedByMe && (
          <span className="absolute top-2 right-2 bg-customGreen text-white text-xs font-bold p-1 rounded-full">
            ✓
          </span>
        )}
      </div>
      <div className="p-6 pt-0 flex flex-col h-full">
        <div className="mt-auto">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none py-3 px-6 text-xs rounded-lg shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none ${
              isSolvedByMe ? "bg-customGreen" : "bg-blue-600"
            } text-white`}
          >
            {isSolvedByMe ? "Solve Again" : "View Problem"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;
