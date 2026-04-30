import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function EventCard({ event }) {
  const dateObj = new Date(event.date_time);
  
  return (
    <div className="card flex flex-col h-full relative group">
      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2 flex-wrap justify-end">
        {event.food_provided && (
          <span className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-orange-200 dark:border-orange-800">
            🥘 Food
          </span>
        )}
        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
          {event.category || 'General'}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] pr-24 group-hover:text-emerald-500 transition-colors">{event.title}</h3>
      
      <p className="text-[var(--text-secondary)] text-sm mb-5 flex-grow line-clamp-3">
        {event.description}
      </p>
      
      <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)] mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 font-medium">
          <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="truncate">{event.location_name}</span>
        </div>
        <div className="flex items-center gap-2.5 font-medium">
          <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
          {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
        <div className="flex items-center gap-2.5 font-medium">
          <Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
          {event.volunteers_required} Volunteers Needed
        </div>
      </div>
      
      <Link to={`/events/${event.id}`} className="btn btn-primary w-full mt-auto py-2.5 shadow-md shadow-emerald-500/20">
        View Details
      </Link>
    </div>
  );
}
