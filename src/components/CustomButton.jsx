// components/CustomButton.jsx
import React from "react";

function CustomButton({ label, onClick, className = "", ...props }) {
  return (
      <button
        className={`${className}`}
        onClick={onClick}
        {...props}
      >
        {label}
      </button>
  );
}

export default CustomButton;
