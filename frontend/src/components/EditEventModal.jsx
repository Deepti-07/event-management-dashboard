import React, { useState, useEffect } from 'react';

export default function EditEventModal({ event, isOpen, onClose, onEventUpdated }) {
  const [formData, setFormData] = useState({ name: '', description: '', date: '', location: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
      });
    }
  }, [event]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/events/${event._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update event.');
      const updatedEvent = await response.json();
      onEventUpdated(updatedEvent);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";
  const labelStyle = "block text-sm font-medium text-slate-700 text-left";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
              <label htmlFor="name" className={labelStyle}>Event Name</label>
              <input id="name" type="text" value={formData.name} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
              <label htmlFor="description" className={labelStyle}>Description</label>
              <textarea id="description" value={formData.description} onChange={handleChange} className={inputStyle} rows="3" />
          </div>
          <div>
              <label htmlFor="date" className={labelStyle}>Date</label>
              <input id="date" type="date" value={formData.date} onChange={handleChange} className={inputStyle} />
          </div>
          <div>
              <label htmlFor="location" className={labelStyle}>Location</label>
              <input id="location" type="text" value={formData.location} onChange={handleChange} className={inputStyle} />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="bg-[#6f276f] hover:bg-[#6f276f] text-white font-bold py-2 px-4 rounded disabled:bg-[#8f4e8f]">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}