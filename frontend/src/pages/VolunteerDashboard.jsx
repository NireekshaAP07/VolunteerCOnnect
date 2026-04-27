import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, Clock, Star, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LEVEL_THRESHOLDS = [
  { min: 0,   max: 99,  label: 'Newcomer',    next: 'Helper',      color: 'bg-slate-400' },
  { min: 100, max: 249, label: 'Helper',       next: 'Contributor', color: 'bg-blue-400' },
  { min: 250, max: 499, label: 'Contributor',  next: 'Changemaker', color: 'bg-emerald-500' },
  { min: 500, max: 999, label: 'Changemaker',  next: 'Champion',    color: 'bg-purple-500' },
  { min: 1000,max: Infinity, label: 'Champion',next: null,          color: 'bg-yellow-500' },
];

const getLevel = (pts) => LEVEL_THRESHOLDS.find(l => pts >= l.min && pts <= l.max) || LEVEL_THRESHOLDS[0];

const VolunteerDashboard = () => {
  const { user, points } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const level = getLevel(points);
  const progress = level.max === Infinity ? 100 : Math.round(((points - level.min) / (level.max - level.min)) * 100);
  const remaining = level.max === Infinity ? 0 : level.max - points + 1;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/api/events');
        setEvents(data);
        setFiltered(data);
      } catch {
        setError('Could not load events. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(events);
    } else {
      const q = search.toLowerCase();
      setFiltered(events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location_name?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q)
      ));
    }
  }, [search, events]);

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-8">
        <h2 className="text-2xl font-bold">Hello, Volunteer! 👋</h2>
        <p className="text-text-secondary">Explore events and make an impact.</p>
      </header>

      {/* Points Card */}
      <div className={`card mb-8 ${level.color} text-white border-none relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-white/70 text-sm">Your Points</p>
              <h3 className="text-4xl font-bold">{points}</h3>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm">Level</p>
              <h3 className="text-xl font-bold">{level.label}</h3>
            </div>
          </div>
          <div className="bg-black/20 h-2 rounded-full mb-2">
            <div className="bg-white h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-white/70">
            {level.next ? `${remaining} more points to reach '${level.next}'` : '🏆 Max level reached!'}
          </p>
        </div>
        <div className="absolute -right-8 -top-8 text-white/10">
          <Trophy size={160} />
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-border-color bg-secondary outline-none focus:border-emerald-500"
          />
        </div>
        <button className="p-3 rounded-xl border border-border-color bg-secondary">
          <Filter size={20} />
        </button>
      </div>

      {/* Events */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Available Events</h3>
        <span className="text-text-secondary text-xs">{filtered.length} found</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-0 h-48 animate-pulse bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.length === 0 && !error && (
            <p className="text-center text-text-secondary py-12">No events found.</p>
          )}
          {filtered.map(event => (
            <motion.div
              key={event.id}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/event/${event.id}`)}
              className="card p-0 overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="h-40 overflow-hidden relative">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-emerald-600 font-bold text-xs">
                  +{event.points} pts
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-600">
                  {event.category}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{event.title}</h4>
                  <div className="flex items-center text-yellow-500 gap-1">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold">4.8</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mb-3">{event.ngo_name}</p>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <MapPin size={14} />
                    <span>{event.location_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <Calendar size={14} />
                    <span>{new Date(event.date_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <Clock size={14} className="ml-2" />
                    <span>{new Date(event.date_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {event.food_provided && (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">Food Provided</span>
                  )}
                  {event.skills_required && event.skills_required !== 'None required' && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">{event.skills_required.split(',')[0]}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    {event.volunteers_joined}/{event.volunteers_required} volunteers
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/event/${event.id}`); }}
                    className="btn btn-primary py-2 px-4 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const Trophy = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default VolunteerDashboard;
