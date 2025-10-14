import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


export default function CustomToolbar({ onNavigate, date, views, view, onView }) {

  const renderMonthAndYear = () => {
    return (
      <span className="text-2xl font-bold text-slate-700">
        {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between mb-6 p-2 bg-slate-100 rounded-lg">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          Today
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => onNavigate('PREV')} 
          className="p-2 rounded-full hover:bg-slate-200 transition-colors" 
          aria-label="Previous month"
        >
          <ChevronLeft className="h-6 w-6 text-slate-600" />
        </button>
        
        {renderMonthAndYear()}
        
        <button 
          onClick={() => onNavigate('NEXT')} 
          className="p-2 rounded-full hover:bg-slate-200 transition-colors" 
          aria-label="Next month"
        >
          <ChevronRight className="h-6 w-6 text-slate-600" />
        </button>
      </div>

      <div className="flex items-center space-x-1 bg-white border border-slate-300 p-1 rounded-md">
        {views.map(v => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={`px-3 py-1 text-sm font-semibold rounded ${view === v ? 'bg-[#6f276f] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}