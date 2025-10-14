import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import CustomToolbar from '../components/CustomToolbar';
import { Loader } from 'lucide-react';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventStyleGetter = (event) => {
  const style = {
    backgroundColor: '#6f276f',
    borderRadius: '5px',
    opacity: 0.8,
    color: 'white',
    border: '0px',
    display: 'block',
  };
  return { style };
};

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [date, setDate] = useState(new Date());
  const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events.');
        const data = await response.json();
        
        const formattedEvents = data.map(event => ({
          title: event.name,
          start: new Date(event.date),
          end: new Date(event.date),
          resource: event,
        }));
        setEvents(formattedEvents);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader className="h-8 w-8 animate-spin text-[#6f276f]" /></div>;
  if (error) return <p className="text-red-500 font-semibold text-center">{error}</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-slate-800">Event Calendar</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200" style={{ height: '75vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
          }}
          date={date}
          onNavigate={handleNavigate}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}