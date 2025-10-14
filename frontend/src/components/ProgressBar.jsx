import React from 'react';

export default function ProgressBar({ percentage }) {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div>
      <span className="text-sm font-semibold text-gray-600">
        {Math.round(safePercentage)}% Complete
      </span>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div
          className="bg-[#6f276f] h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${safePercentage}%` }}
        ></div>
      </div>
    </div>
  );
}