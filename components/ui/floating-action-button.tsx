"use client";

import React from "react";

interface FloatingActionButtonProps {
  onClick: () => void;
  label: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-32 right-8 bg-blue-600 hover:bg-blue-700 
                 text-white rounded-full w-14 h-14 flex items-center justify-center 
                 shadow-lg hover:shadow-xl transition-all duration-200 transform 
                 hover:scale-105 z-50"
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default FloatingActionButton;
