import React from 'react';

export default function Avatar({ name }) {
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length > 1) {
      return words[0][0] + words[words.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#6f276f] text-white flex items-center justify-center">
      <span className="text-lg font-bold">{getInitials(name).toUpperCase()}</span>
    </div>
  );
}