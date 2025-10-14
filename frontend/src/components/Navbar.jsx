import React, { useState } from 'react';
import { LogOut, UserCircle } from 'lucide-react';

export default function Navbar({ navItems, activePage, onNavigate }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav 
      className={`h-screen flex flex-col bg-white border-r border-slate-200 shadow-md transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      
      <div className="flex items-center p-4 border-b border-slate-200 h-[6.25rem]">
        <img src="/logo.png" alt="Event Dashboard Logo" className="h-12 w-12 flex-shrink-0" />
        <h1 
          className={`ml-3 text-2xl font-dancing italic font-bold text-slate-800 overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
        >
          Eventure
        </h1>
      </div>

 
      <div className="flex-1 p-4">
        <ul>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center px-4 py-3 my-1 rounded-lg text-left font-medium transition-colors duration-200
                    ${isActive
                      ? 'bg-[#6f276f] text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <item.icon className={`h-6 w-6 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span 
                    className={`ml-4 overflow-hidden whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center">
          <UserCircle className="h-10 w-10 text-slate-500 flex-shrink-0" />
          <div 
            className={`ml-3 overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
          >
            <p className="font-semibold text-slate-700">Admin User</p>
            <p className="text-sm text-slate-500">admin@example.com</p>
          </div>
        </div>
        <button 
          className="w-full flex items-center mt-4 px-4  rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
        </button>
      </div>
    </nav>
  );
}

