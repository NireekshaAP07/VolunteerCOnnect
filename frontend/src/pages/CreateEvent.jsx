import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Sparkles, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', date: '', time: '',
    volunteersNeeded: '', skills: '', perks: '', food: false,
    customAppreciation: ''
  });

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/events', {
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
      setError(err.response?.data?.error || 'Failed to create event. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Event Published!</h2>
          <p className="text-text-secondary text-sm">Gemini AI has enhanced your description.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto pb-12">
      <header className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-xl font-bold">New Opportunity</h1>
        <div className="w-10" />
      </header>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-500" /> Basic Details
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-text-secondary mb-1 block">EVENT TITLE</label>
              <input type="text" className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none"
                placeholder="e.g. Slum Education Drive" required value={formData.title}
                onChange={e => set('title', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary mb-1 block">DESCRIPTION</label>
              <textarea className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none min-h-[100px]"
                placeholder="Describe the cause and tasks..." required value={formData.description}
                onChange={e => set('description', e.target.value)} />
              <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                <Sparkles size={10} /> Gemini AI will enhance this description on submit.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-blue-500" /> Logistics
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-text-secondary mb-1 block">LOCATION</label>
              <input type="text" className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none"
                placeholder="e.g. Marine Drive, Mumbai" required value={formData.location}
                onChange={e => set('location', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-text-secondary mb-1 block">DATE</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                  <input type="date" className="w-full pl-10 pr-3 py-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none text-sm"
                    required value={formData.date} onChange={e => set('date', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary mb-1 block">TIME</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                  <input type="time" className="w-full pl-10 pr-3 py-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none text-sm"
                    required value={formData.time} onChange={e => set('time', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Users size={18} className="text-purple-500" /> Requirements & Perks
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-text-secondary mb-1 block">VOLUNTEERS NEEDED</label>
              <input type="number" min="1" className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none"
                placeholder="e.g. 10" required value={formData.volunteersNeeded}
                onChange={e => set('volunteersNeeded', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary mb-1 block">SKILLS (OPTIONAL)</label>
              <input type="text" className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none"
                placeholder="e.g. Teaching, Communication" value={formData.skills}
                onChange={e => set('skills', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary mb-1 block">PERKS (OPTIONAL)</label>
              <input type="text" className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none"
                placeholder="e.g. Certificate, Lunch" value={formData.perks}
                onChange={e => set('perks', e.target.value)} />
            </div>
            <div className="flex items-center justify-between p-3 border border-border-color rounded-xl">
              <span className="text-sm font-semibold">Food Provided?</span>
              <input type="checkbox" className="w-6 h-6 accent-emerald-500" checked={formData.food}
                onChange={e => set('food', e.target.checked)} />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary mb-1 block">CUSTOM CERTIFICATE MESSAGE (OPTIONAL)</label>
              <textarea className="w-full p-3 rounded-xl border border-border-color bg-primary focus:border-emerald-500 outline-none min-h-[80px]"
                placeholder="e.g. For your incredible help managing the crowd during the marathon." value={formData.customAppreciation}
                onChange={e => set('customAppreciation', e.target.value)} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
          {loading ? 'Publishing…' : <><Send size={20} /> Publish Opportunity</>}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
