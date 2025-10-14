import React from 'react';
import { Edit, Trash2, MapPin } from 'lucide-react';

export default function EventCard({ event, onEdit, onDelete, onCardClick }) {
  const cardDate = new Date(event.date);
  const month = cardDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = cardDate.getDate();

 
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      onClick={() => onCardClick(event._id)} 
      className="cursor-pointer group"
    >
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform group-hover:-translate-y-1 transition-transform duration-300">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-center bg-[#6f276f] text-white rounded-lg p-3 w-20">
                <p className="text-xl font-bold">{month}</p>
                <p className="text-4xl font-extrabold">{day}</p>
              </div>
              <div className="ml-5">
                <h3 className="text-xl font-bold text-slate-800">{event.name}</h3>
                <div className="flex items-center text-slate-500 mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => handleActionClick(e, () => onEdit(event))} 
                className="p-2 text-slate-500 hover:text-[#8f4e8f] transition-colors"
                aria-label="Edit event"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button 
                onClick={(e) => handleActionClick(e, () => onDelete(event._id))} 
                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                aria-label="Delete event"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-slate-600 mt-4 pl-1">{event.description}</p>
        </div>
      </div>
    </div>
  );
}