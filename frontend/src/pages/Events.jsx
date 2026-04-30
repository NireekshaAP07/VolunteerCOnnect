import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/events/')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in pb-24 sm:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Explore Opportunities</h1>
        <p className="text-[var(--text-secondary)] text-lg">Find volunteer events where you can make a difference.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border border-[var(--border-color)] rounded-2xl bg-white dark:bg-slate-800">
          <p className="text-[var(--text-secondary)]">No events available right now.</p>
        </div>
      )}
    </div>
  );
}
