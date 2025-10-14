import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export default function Countdown({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Mins: Math.floor((difference / 1000 / 60) % 60),
        Secs: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) {
      return null;
    }
    return (
      <div key={interval} className="flex flex-col items-center">
        <span className="text-4xl font-bold text-slate-800 tabular-nums">{timeLeft[interval]}</span>
        <span className="text-xs uppercase text-slate-500 tracking-wider">{interval}</span>
      </div>
    );
  }).filter(Boolean);
  
  const eventHasPassed = timerComponents.length === 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full">
       <h2 className="text-2xl font-semibold mb-4 text-slate-700 flex items-center">
        <Timer className="h-6 w-6 mr-3 text-sky-500" />
        Time Remaining
      </h2>
      <div className="flex items-center justify-center h-2/3">
        {eventHasPassed ? (
            <p className="text-xl font-semibold text-slate-500">This event has passed.</p>
        ) : (
            <div className="flex justify-around w-full">
                {timerComponents}
            </div>
        )}
      </div>
    </div>
  );
}
