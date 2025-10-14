import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './Dashboard'; 

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
     
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out
          ${showDashboard ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <LandingPage onEnter={() => setShowDashboard(true)} />
      </div>
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out
          ${showDashboard ? 'translate-x-0' : 'translate-x-full'}`}
      >
       
        {showDashboard && <Dashboard />}
      </div>
    </div>
  );
}