import React, { useState } from 'react';

export default function AssignAttendeeModal({ isOpen, onClose, attendee, events }) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      setError('Please select an event.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/events/${selectedEventId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendeeId: attendee._id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign attendee.');
      }
      
      setSuccess(data.message);
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setSelectedEventId('');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = "block text-sm font-medium text-slate-700 text-left";
  const selectStyle = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#F5F3FF] p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Assign {attendee?.name}</h2>
        {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center bg-green-100 p-2 rounded mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="event-select" className={labelStyle}>Select Event to Assign</label>
            <select
              id="event-select"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className={selectStyle}
            >
              <option value="">-- Choose an event --</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>{event.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
              Close
            </button>
            <button type="submit" disabled={submitting || success} className="bg-[#6f276f] hover:bg-[#6f276f] text-white font-bold py-2 px-4 rounded disabled:bg-[#8f4e8f]">
              {submitting ? 'Assigning...' : 'Assign Attendee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}