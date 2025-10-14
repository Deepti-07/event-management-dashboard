import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader, UserX, Search } from 'lucide-react';
import AddAttendeeForm from '../components/AddAttendeeForm';
import Avatar from '../components/Avatar';

export default function AttendeePage() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/attendees');
        if (!response.ok) throw new Error('Failed to fetch attendees.');
        const data = await response.json();
        setAttendees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, []);

  const handleAttendeeAdded = (newAttendee) => {
    setAttendees((prev) => [newAttendee, ...prev]);
    setShowAddForm(false);
  };

  const handleDelete = async (attendeeId) => {
    if (window.confirm('Are you sure you want to delete this attendee?')) {
      try {
        const response = await fetch(`/api/attendees/${attendeeId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete attendee.');
        setAttendees((prev) => prev.filter((attendee) => attendee._id !== attendeeId));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (loading) return <div className="flex justify-center p-10"><Loader className="h-8 w-8 animate-spin text-" /></div>;
    if (error) return <p className="text-red-500 font-semibold text-center p-4">{error}</p>;

    if (filteredAttendees.length === 0) {
      return (
        <div className="text-center py-10">
          <UserX className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-xl font-semibold text-slate-700">
            {searchTerm ? 'No attendees found' : 'No attendees yet'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchTerm ? 'Try a different search term.' : 'Add your first attendee to get started!'}
          </p>
        </div>
      );
    }

    return (
      <ul className="divide-y divide-slate-200">
        {filteredAttendees.map((attendee) => (
          <li key={attendee._id} className="py-4 px-2 flex justify-between items-center group">
            <div className="flex items-center">
              <Avatar name={attendee.name} />
              <div className="ml-4">
                <p className="text-md font-semibold text-slate-800">{attendee.name}</p>
                <p className="text-sm text-slate-500">{attendee.email}</p>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(attendee._id)} className="bg-[#6f276f] hover:bg-[#8f4e8f] text-white font-bold py-1 px-3 rounded text-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-800">Attendees</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center bg-[#6f276f] hover:bg-[#8f4e8f] text-white font-bold py-2 px-4 rounded-lg shadow-sm"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          {showAddForm ? 'Close Form' : 'New Attendee'}
        </button>
      </div>

      {showAddForm ? (
        <AddAttendeeForm onAttendeeAdded={handleAttendeeAdded} onClose={() => setShowAddForm(false)} />
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          {renderContent()}
        </div>
      )}
    </div>
  );
}
