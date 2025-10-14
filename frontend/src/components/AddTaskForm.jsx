import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddTaskForm({ events, attendees, onTaskAdded, onClose }) {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [assignedAttendee, setAssignedAttendee] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !deadline || !selectedEvent) {
      setError('Task name, deadline, and event are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          deadline,
          event: selectedEvent,
          assignedAttendee: assignedAttendee || null,
        }),
      });
      if (!response.ok) throw new Error('Failed to create task.');
      const newTask = await response.json();
      onTaskAdded(newTask);
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
        <h3 className="text-2xl font-bold text-center text-[#312331] mb-6">Add New Task</h3>
        {error && <p className="text-red-500 text-center bg-red-100 p-2 rounded">{error}</p>}
        <div>
          <label htmlFor="task-name" className={labelStyle}>Task Name</label>
          <input id="task-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="event-select" className={labelStyle}>For Event</label>
          <select id="event-select" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className={inputStyle}>
            <option value="">Select an Event</option>
            {events.map(event => <option key={event._id} value={event._id}>{event.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="deadline" className={labelStyle}>Deadline</label>
          <input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="attendee-select" className={labelStyle}>Assign To (Optional)</label>
          <select id="attendee-select" value={assignedAttendee} onChange={(e) => setAssignedAttendee(e.target.value)} className={inputStyle}>
            <option value="">Unassigned</option>
            {attendees.map(attendee => <option key={attendee._id} value={attendee._id}>{attendee.name}</option>)}
          </select>
        </div>
        <button type="submit" disabled={submitting} className="w-full bg-[#6f276f] hover:bg-[#8f4e8f] text-white font-bold py-3 px-4 rounded-lg">
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}