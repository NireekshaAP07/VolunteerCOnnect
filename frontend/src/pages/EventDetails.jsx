import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Heart, Share2, Info, CheckCircle2, Phone, Mail, AlertCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const [eventRes, regsRes] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get(`/api/registrations?user_id=${user.uid}`),
        ]);
        setEvent(eventRes.data);
        setRegistered(regsRes.data.some(r => r.event_id === id));
      } catch {
        setError('Event not found or backend is not running.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    setRegistering(true);
    setRegError('');
    try {
      await api.post('/api/registrations', { user_id: user.uid, event_id: id });
      setRegistered(true);
      setEvent(prev => ({ ...prev, volunteers_joined: (prev.volunteers_joined || 0) + 1 }));
    } catch (err) {
      setRegError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-text-secondary text-center">{error}</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary px-6 py-3">Go Back</button>
      </div>
    );
  }

  const eventDate = new Date(event.date_time);

  return (
    <div className="min-h-screen bg-primary pb-24 container mx-auto">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start pt-6">
        {/* Hero Image */}
        <div className="h-64 lg:h-[500px] relative rounded-3xl overflow-hidden shadow-xl mb-6 lg:mb-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute top-6 left-6 flex gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg">
              <ArrowLeft size={20} />
            </button>
          </div>
          <div className="absolute top-6 right-6 flex gap-2">
            <button className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg">
              <Share2 size={20} />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-red-500">
              <Heart size={20} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary to-transparent" />
        </div>

        <div className="lg:pt-0">
          {/* Title + Points */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1 tracking-tight">{event.title}</h1>
              <p className="text-emerald-500 font-bold text-base">{event.ngo_name}</p>
            </div>
            <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-center ml-4 shadow-sm border border-emerald-200">
              <p className="text-[10px] font-bold uppercase tracking-wider">Points</p>
              <p className="text-2xl font-bold">+{event.points}</p>
            </div>
          </div>

          {/* Date / Time / Volunteers */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Calendar size={20} /></div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold">DATE</p>
                <p className="text-sm font-bold">{eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Clock size={20} /></div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold">TIME</p>
                <p className="text-sm font-bold">{eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Users size={20} /></div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold">SPOTS</p>
                <p className="text-sm font-bold">{event.volunteers_joined}/{event.volunteers_required}</p>
              </div>
            </div>
          </div>

          {/* Category badge */}
          {event.category && (
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-8 border border-emerald-100">
              {event.category}
            </span>
          )}

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Info size={20} className="text-emerald-500" /> About Event
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <MapPin size={20} className="text-red-500" /> Location
            </h3>
            <div className="card bg-slate-50 border-dashed py-6 flex items-center justify-center">
              <p className="text-sm font-semibold">{event.location_name}</p>
            </div>
          </div>

          {/* Perks */}
          {(event.perks || event.food_provided) && (
            <div className="card mb-8 bg-emerald-50 border-emerald-100">
              <h3 className="font-bold mb-4 text-emerald-800">Perks & Details</h3>
              <ul className="flex flex-col gap-3">
                {event.perks && (
                  <li className="flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 size={16} /> {event.perks}
                  </li>
                )}
                {event.food_provided && (
                  <li className="flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 size={16} /> Food & refreshments provided
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Contact */}
          {event.contact_details && (
            <div className="mb-8 p-4 bg-secondary border border-border-color rounded-2xl flex items-center gap-4">
              <div className="p-2 bg-slate-100 rounded-lg"><Mail size={20} className="text-text-secondary" /></div>
              <div>
                <p className="text-[10px] text-text-secondary font-bold uppercase">Contact NGO</p>
                <p className="text-sm font-semibold">{event.contact_details}</p>
              </div>
            </div>
          )}

          {regError && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl mb-4 text-sm font-medium">
              <AlertCircle size={18} /> {regError}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Register Button */}
      <div className="fixed bottom-[70px] lg:bottom-0 left-0 right-0 p-6 bg-primary/90 backdrop-blur-lg border-t border-border-color z-40">
        {registered ? (
          <div className="btn bg-emerald-100 text-emerald-700 w-full py-4 font-bold flex items-center justify-center gap-2 cursor-default">
            <CheckCircle2 size={20} /> You are Registered!
          </div>
        ) : (
          <button
            onClick={handleRegister}
            disabled={registering}
            className="btn btn-primary w-full py-4 text-lg font-bold"
          >
            {registering ? 'Registering…' : 'Register Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
