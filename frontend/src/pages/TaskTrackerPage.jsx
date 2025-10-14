import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader, CheckCircle, Circle, ListChecks } from 'lucide-react';
import AddTaskForm from '../components/AddTaskForm';
import ProgressBar from '../components/ProgressBar';
import { socket } from '../socket';

export default function TaskTrackerPage() {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const onTaskUpdate = (updatedTask) => {
      if (updatedTask.event === selectedEventId) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === updatedTask._id ? updatedTask : task
          )
        );
      }
    };

    socket.on('taskUpdated', onTaskUpdate);

    return () => {
      socket.off('taskUpdated', onTaskUpdate);
    };
  }, [selectedEventId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [eventsRes, attendeesRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/attendees'),
        ]);
        if (!eventsRes.ok || !attendeesRes.ok) throw new Error('Failed to fetch initial data.');
        const eventsData = await eventsRes.json();
        const attendeesData = await attendeesRes.json();
        setEvents(eventsData.sort((a, b) => new Date(a.date) - new Date(b.date)));
        setAttendees(attendeesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      setTasks([]);
      return;
    }
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const response = await fetch(`/api/events/${selectedEventId}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks.');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [selectedEventId]);

  useEffect(() => {
    if (tasks.length === 0) {
      setProgress(0);
      return;
    }
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    setProgress((completedTasks / tasks.length) * 100);
  }, [tasks]);

  const handleTaskAdded = (newTask) => {
    if (newTask.event === selectedEventId) {
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    setShowAddForm(false);
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status.');
    } catch (err) {
      alert(err.message);
    }
  };

  const selectedEvent = events.find(e => e._id === selectedEventId);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-800">Task Tracker</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center bg-[#6f276f] hover:bg-[#8f4e8f] text-white font-bold py-2 px-4 rounded-lg shadow-sm"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          {showAddForm ? 'Close Form' : 'New Task'}
        </button>
      </div>

      {showAddForm ? (
        <AddTaskForm events={events} attendees={attendees} onTaskAdded={handleTaskAdded} onClose={() => setShowAddForm(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4 text-slate-700">Events</h2>
            {loading ? <Loader className="animate-spin" /> : (
              <ul className="space-y-2">
                {events.map(event => (
                  <li key={event._id}>
                    <button
                      onClick={() => setSelectedEventId(event._id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${selectedEventId === event._id ? 'bg-[#6f276f] text-white shadow' : 'hover:bg-slate-100'}`}
                    >
                      <p className="font-semibold">{event.name}</p>
                      <p className={`text-sm ${selectedEventId === event._id ? 'text-sky-100' : 'text-slate-500'}`}>
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            {selectedEvent ? (
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-slate-700">{selectedEvent.name} Tasks</h2>
                <div className="mb-6"><ProgressBar percentage={progress} /></div>
                {loadingTasks ? <Loader className="animate-spin" /> : (
                  <ul className="space-y-3">
                    {tasks.length > 0 ? tasks.map(task => (
                      <li key={task._id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <button onClick={() => handleStatusChange(task._id, task.status)} className="mr-4">
                            {task.status === 'Completed' ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-slate-400" />}
                          </button>
                          <div>
                            <p className={`font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.name}</p>
                            <p className="text-sm text-slate-500">
                              Assigned: {task.assignedAttendee ? task.assignedAttendee.name : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                           <p>Due: {new Date(task.deadline).toLocaleDateString()}</p>
                        </div>
                      </li>
                    )) : <p className="text-slate-500 text-center py-4">No tasks for this event yet.</p>}
                  </ul>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ListChecks className="h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-xl font-semibold text-slate-700">Select an Event</h3>
                <p className="mt-1 text-slate-500">Choose an event from the left panel to view its tasks.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}