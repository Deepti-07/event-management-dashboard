import React, { useState } from 'react';
import Navbar from './components/Navbar';
import EventPage from './pages/EventPage';
import EventDetailPage from './pages/EventDetailPage';
import AttendeePage from './pages/AttendeePage';
import TaskTrackerPage from './pages/TaskTrackerPage';
import CalendarPage from './pages/CalendarPage';
import { Calendar, Users, ListChecks, View, Menu } from 'lucide-react';

function App() {
  const [activePage, setActivePage] = useState('events');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'calendar', label: 'Calendar View', icon: View },
    { id: 'attendees', label: 'Attendees', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: ListChecks },
  ];

  const viewEventDetails = (eventId) => {
    setSelectedEventId(eventId);
    setActivePage('eventDetail');
  };

  const showEventList = () => {
    setSelectedEventId(null);
    setActivePage('events');
  };
  
  const handleNavigate = (page) => {
    setSelectedEventId(null);
    setActivePage(page);
    setIsMobileMenuOpen(false); 
  }

  const renderPage = () => {
    if (activePage === 'eventDetail' && selectedEventId) {
      return <EventDetailPage eventId={selectedEventId} onBack={showEventList} />;
    }
    if (activePage === 'events') return <EventPage onEventClick={viewEventDetails} />;
    if (activePage === 'calendar') return <CalendarPage />;
    if (activePage === 'attendees') return <AttendeePage />;
    if (activePage === 'tasks') return <TaskTrackerPage />;
    return <EventPage onEventClick={viewEventDetails} />;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-200 to-white">
      
      <div className="hidden lg:flex">
        <Navbar 
          navItems={navItems}
          activePage={activePage} 
          onNavigate={handleNavigate} 
        />
      </div>

    
      <div 
        className={`fixed inset-0 z-40 transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Navbar 
          navItems={navItems}
          activePage={activePage} 
          onNavigate={handleNavigate}
          isMobile={true}
        />
      </div>
      
 
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
          <img src="/logo.png" alt="Logo" className="h-8 w-8 ml-4" />
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;

