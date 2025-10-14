import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader, AlertTriangle } from 'lucide-react';
import AddEventForm from '../components/AddEventForm';
import EditEventModal from '../components/EditEventModal';
import EventCard from '../components/EventCard';

export default function EventPage({ onEventClick }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events.');
        const data = await response.json();
        setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventAdded = (newEvent) => {
    setEvents((prev) => [...prev, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setShowAddForm(false);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents((prev) => prev.map((event) => (event._id === updatedEvent._id ? updatedEvent : event)));
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete event.');
        setEvents((prev) => prev.filter((event) => event._id !== eventId));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-[#8f4e8f]" /></div>;
    }
    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-3" />
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      );
    }
    if (events.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-white rounded-xl shadow-lg border border-slate-200">
          <h3 className="text-2xl font-semibold text-slate-700">No Events Found</h3>
          <p className="text-slate-500 mt-2 mb-6">Get started by creating your first event!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center mx-auto bg-[#6f276f] hover:bg-[#8f4e8f] text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-transform transform hover:scale-105"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard 
            key={event._id} 
            event={event} 
            onEdit={openEditModal} 
            onDelete={handleDelete} 
            onCardClick={onEventClick} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-800">Events</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center bg-[#6f276f] hover:bg-[#8f4e8f] text-white font-bold py-2 px-4 rounded-lg shadow-amber-900  transition-transform transform hover:scale-105"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          {showAddForm ? 'Close Form' : 'New Event'}
        </button>
      </div>
      {showAddForm ? (
        <AddEventForm onEventAdded={handleEventAdded} onClose={() => setShowAddForm(false)} />
      ) : (
        renderContent()
      )}
      
      <EditEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={currentEvent} onEventUpdated={handleEventUpdated} />
    </div>
  );
}