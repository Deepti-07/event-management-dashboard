import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddEventForm({ onEventAdded, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !date || !location) {
      setError('All fields are required.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, date, location }),
      });
      if (!response.ok) throw new Error('Failed to create event.');
      const newEvent = await response.json();
      onEventAdded(newEvent);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";
  const labelStyle = "block text-sm font-medium text-slate-700";

  return (
    <div className="bg-[#F5F3FF] p-8 rounded-xl shadow-lg border border-slate-200 mb-8 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
        <X className="h-6 w-6" />
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-slate-800 mb-6">Create a New Event</h3>
        {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelStyle}>Event Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} />
          </div>
          <div>
            <label htmlFor="location" className={labelStyle}>Location</label>
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputStyle} />
          </div>
        </div>
        <div>
          <label htmlFor="description" className={labelStyle}>Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={inputStyle} rows="3" />
        </div>
        <div>
          <label htmlFor="date" className={labelStyle}>Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputStyle} />
        </div>
        <button type="submit" disabled={submitting} className="w-full bg-[#6f276f] hover:bg-[#8f4e8f] text-white font-bold py-3 px-4 rounded-lg disabled:bg-[#8f4e8f] disabled:cursor-not-allowed transition-colors">
          {submitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}