import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, ListChecks, Loader, CheckCircle, Circle, ClipboardList } from 'lucide-react';
import Countdown from '../components/Countdown';
import ProgressBar from '../components/ProgressBar';

export default function EventDetailPage({ eventId, onBack }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error('Could not fetch event details.');
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  if (loading) return <div className="flex justify-center p-10"><Loader className="h-8 w-8 animate-spin text-purple-700" /></div>;
  if (error) return <p className="text-red-500 font-semibold text-center">{error}</p>;
  if (!details) return null;

  const { event, tasks } = details;

 
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center text-purple-700 font-semibold hover:text-purple-800 transition-colors">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to All Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
       
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800">{event.name}</h1>
            <div className="flex flex-wrap items-center divide-x divide-slate-200 text-slate-500 mt-4">
              <div className="flex items-center pr-4"><Calendar className="h-5 w-5 mr-2" /><span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div className="flex items-center pl-4"><MapPin className="h-5 w-5 mr-2" /><span>{event.location}</span></div>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed mt-6 pt-6 border-t border-slate-200">{event.description}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4 text-slate-700 flex items-center"><ListChecks className="h-6 w-6 mr-3 text-purple-700" />Tasks</h2>
            {tasks.length > 0 ? (
              <ul className="space-y-4">
                {tasks.map(task => (
                  <li key={task._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      {task.status === 'Completed' ? <CheckCircle className="h-6 w-6 text-green-500 mr-3" /> : <Circle className="h-6 w-6 text-orange-500 mr-3" />}
                      <div>
                        <p className="font-semibold text-slate-800">{task.name}</p>
                        <p className="text-sm text-slate-500">Assigned to: {task.assignedAttendee ? task.assignedAttendee.name : 'Unassigned'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-slate-500">No tasks for this event.</p>}
          </div>
        </div>

        
        <div className="lg:col-span-1 space-y-8">
          <Countdown targetDate={event.date} />

       
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4 text-slate-700 flex items-center">
              <ClipboardList className="h-6 w-6 mr-3 text-purple-700" />
              Task Progress
            </h2>
            {totalTasks > 0 ? (
              <div>
                <ProgressBar percentage={progressPercentage} />
                <p className="text-center text-slate-500 mt-3 font-semibold">
                  {completedTasks} / {totalTasks} tasks completed
                </p>
              </div>
            ) : (
              <p className="text-slate-500">No tasks to track for this event.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

