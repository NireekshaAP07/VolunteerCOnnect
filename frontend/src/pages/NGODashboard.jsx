import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, CheckCircle, TrendingUp, AlertCircle, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const NGODashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, regsRes] = await Promise.all([
          api.get(`/api/events?ngo_id=${user.uid}`),
          api.get('/api/registrations'),
        ]);
        setEvents(eventsRes.data);
        setRegistrations(regsRes.data);
      } catch {
        setError('Could not load data. Is the backend running on port 5000?');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalVolunteers = registrations.length;
  const completedEvents = events.filter(e => new Date(e.date_time) <= new Date()).length;
  const impactScore = events.length > 0
    ? Math.min(10, totalVolunteers / (events.length * 5 + 1) * 10 + events.length * 0.3).toFixed(1)
    : '0.0';

  const stats = [
    { label: 'Total Events',  value: events.length,       icon: <Calendar className="text-blue-500" /> },
    { label: 'Volunteers',    value: totalVolunteers,      icon: <Users className="text-emerald-500" /> },
    { label: 'Completed',     value: completedEvents,      icon: <CheckCircle className="text-purple-500" /> },
    { label: 'Impact Score',  value: impactScore,          icon: <TrendingUp className="text-orange-500" /> },
  ];

  const handleVerify = async (reg) => {
    try {
      const res = await api.post('/api/attendance/verify', { user_id: reg.user_id, event_id: reg.event_id });
      alert(`✅ ${res.data.points_awarded} points awarded!`);
    } catch (err) {
      alert(err.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <div className="animate-fade-in pb-20 container mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">NGO Dashboard 🏢</h2>
          <p className="text-text-secondary">Manage your events and impact.</p>
        </div>
        <button onClick={() => navigate('/create-event')}
          className="bg-emerald-500 p-3 rounded-full text-white shadow-lg shadow-emerald-500/30">
          <Plus size={24} />
        </button>
      </header>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm max-w-4xl">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }} className="card p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              {stat.icon}
              <span className="text-lg font-bold">{loading ? '—' : stat.value}</span>
            </div>
            <span className="text-xs text-text-secondary font-semibold">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Events list */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Your Events</h3>
        <button onClick={() => navigate('/create-event')} className="text-emerald-500 text-sm font-bold">+ New</button>
      </div>

      {loading ? (
        <div className="grid-cols-responsive">
          {[1, 2].map(i => <div key={i} className="card h-20 animate-pulse bg-secondary mb-4" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="card text-center py-12 max-w-4xl mx-auto">
          <p className="text-text-secondary mb-4">No events yet.</p>
          <button onClick={() => navigate('/create-event')} className="btn btn-primary px-6 py-3">
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid-cols-responsive">
          {events.map(event => {
            const upcoming = new Date(event.date_time) > new Date();
            return (
              <div key={event.id} className="card flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-bold">{event.title}</h4>
                  <p className="text-xs text-text-secondary">
                    {new Date(event.date_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' • '}{event.volunteers_joined}/{event.volunteers_required} volunteers
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${upcoming ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {upcoming ? 'Upcoming' : 'Completed'}
                  </div>
                  <button onClick={() => navigate(`/edit-event/${event.id}`)} className="text-blue-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" title="Edit Event">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Registrations */}
      {registrations.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold mb-4">Recent Registrations</h3>
          <div className="card max-w-4xl">
            <div className="flex flex-col gap-4">
              {registrations.slice(0, 5).map((reg, i) => (
                <div key={reg.id} className="flex items-center gap-3 border-b border-border-color last:border-0 pb-3 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    V{i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Volunteer</p>
                    <p className="text-[10px] text-text-secondary">
                      Event #{reg.event_id} • {new Date(reg.registered_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => handleVerify(reg)} className="text-emerald-500 font-bold text-xs">
                    Verify
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODashboard;
