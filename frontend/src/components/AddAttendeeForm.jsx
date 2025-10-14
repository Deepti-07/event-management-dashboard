import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddAttendeeForm({ onAttendeeAdded, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and email are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add attendee.');
      }
      const newAttendee = await response.json();
      onAttendeeAdded(newAttendee);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm";
  const labelStyle = "block text-sm font-medium text-slate-700";

  return (
    <div className="bg-[#F5F3FF] p-8 rounded-xl shadow-lg border border-slate-200 mb-8 relative">
       <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
        <X className="h-6 w-6" />
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-slate-800 mb-6">Add New Attendee</h3>
        {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded">{error}</p>}
        <div>
          <label htmlFor="attendee-name" className={labelStyle}>Full Name</label>
          <input id="attendee-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="attendee-email" className={labelStyle}>Email Address</label>
          <input id="attendee-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyle} />
        </div>
        <button type="submit" disabled={submitting} className="w-full bg-[#8f4e8f] hover:[#6f276f] text-white font-bold py-3 px-4 rounded-lg disabled:bg-[#8f4c8f]">
          {submitting ? 'Adding...' : 'Add Attendee'}
        </button>
      </form>
    </div>
  );
}