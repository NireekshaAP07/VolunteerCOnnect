import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Sparkles, Send, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', date: '', time: '',
    volunteersNeeded: '', skills: '', perks: '', food: false,
    customAppreciation: ''
  });

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/api/events/${id}`);
        // ensure this user is the owner
        if (data.ngo_id !== user.uid) {
          setError("You do not have permission to edit this event.");
          setFetching(false);
          return;
        }

        const eventDate = new Date(data.date_time);
        const yyyy = eventDate.getFullYear();
        const mm = String(eventDate.getMonth() + 1).padStart(2, '0');
        const dd = String(eventDate.getDate()).padStart(2, '0');
        const hh = String(eventDate.getHours()).padStart(2, '0');
        const min = String(eventDate.getMinutes()).padStart(2, '0');

        setFormData({
          title: data.title,
          description: data.description,
          location: data.location_name,
          date: `${yyyy}-${mm}-${dd}`,
          time: `${hh}:${min}`,
          volunteersNeeded: data.volunteers_required,
          skills: data.skills_required || '',
          perks: data.perks || '',
          food: data.food_provided,
          customAppreciation: data.custom_appreciation || ''
        });
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setFetching(false);
      }
    };
    if (user) {
      fetchEvent();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/api/events/${id}`, {
        title: formData.title,
        description: formData.description,
        location_name: formData.location,
        date_time: `${formData.date}T${formData.time}:00`,
        volunteers_required: parseInt(formData.volunteersNeeded),
        skills_required: formData.skills,
        perks: formData.perks,
        food_provided: formData.food,
        contact_details: profile?.email || user.email,
        ngo_id: user.uid,
        custom_appreciation: formData.customAppreciation || null
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading event..." />;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Event Updated!</h2>
          <p className="text-[var(--text-secondary)] text-sm">Your changes have been saved.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto pb-12">
      <header className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--text-secondary)]">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Edit Event</h1>
        <div className="w-10" />
      </header>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* The rest of the form is identical to CreateEvent */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Details */}
        <div className="card">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Sparkles size={18} className="text-emerald-500" /> Basic Details
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">EVENT TITLE</label>
              <input type="text" className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                placeholder="e.g. Slum Education Drive" required value={formData.title}
                onChange={e => set('title', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">DESCRIPTION</label>
              <textarea className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none min-h-[100px]"
                placeholder="Describe the cause and tasks..." required value={formData.description}
                onChange={e => set('description', e.target.value)} />
              <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                <Sparkles size={10} /> Gemini AI will enhance this if changed.
              </p>
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div className="card">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <MapPin size={18} className="text-blue-500" /> Logistics
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">LOCATION</label>
              <input type="text" className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                placeholder="e.g. Marine Drive, Mumbai" required value={formData.location}
                onChange={e => set('location', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">DATE</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                  <input type="date" className="w-full pl-10 pr-3 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none text-sm"
                    required value={formData.date} onChange={e => set('date', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">TIME</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                  <input type="time" className="w-full pl-10 pr-3 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none text-sm"
                    required value={formData.time} onChange={e => set('time', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="card">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Users size={18} className="text-purple-500" /> Requirements & Perks
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">VOLUNTEERS NEEDED</label>
              <input type="number" min="1" className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                placeholder="e.g. 10" required value={formData.volunteersNeeded}
                onChange={e => set('volunteersNeeded', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">SKILLS (OPTIONAL)</label>
              <input type="text" className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                placeholder="e.g. Teaching, Communication" value={formData.skills}
                onChange={e => set('skills', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">PERKS (OPTIONAL)</label>
              <input type="text" className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                placeholder="e.g. Certificate, Lunch" value={formData.perks}
                onChange={e => set('perks', e.target.value)} />
            </div>
            <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-xl text-[var(--text-primary)]">
              <span className="text-sm font-semibold">Food Provided?</span>
              <input type="checkbox" className="w-6 h-6 accent-emerald-500" checked={formData.food}
                onChange={e => set('food', e.target.checked)} />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">CUSTOM CERTIFICATE MESSAGE (OPTIONAL)</label>
              <textarea className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-emerald-500 outline-none min-h-[80px]"
                placeholder="e.g. For your incredible help managing the crowd during the marathon." value={formData.customAppreciation}
                onChange={e => set('customAppreciation', e.target.value)} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading || error === "You do not have permission to edit this event."}
          className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
          {loading ? 'Saving…' : <><Save size={20} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
