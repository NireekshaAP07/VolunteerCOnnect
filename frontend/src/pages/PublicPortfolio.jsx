import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Calendar, CheckCircle, ExternalLink, ShieldCheck, Heart, MapPin, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const PublicPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/api/auth/public-profile/${id}`);
        setData(res.data);
      } catch (err) {
        setError("Portfolio not found or private.");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  if (loading) return <LoadingSpinner text="Retrieving impact records..." />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <p className="text-[var(--text-secondary)] mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary px-6 py-2">Go Home</button>
      </div>
    </div>
  );

  const stats = [
    { label: 'Impact Points', value: data.points, icon: <Award className="text-yellow-500" />, bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
    { label: 'Events Completed', value: data.impact_history.length, icon: <CheckCircle className="text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-24 sm:pb-12 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white pt-16 pb-32 px-4 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block mb-6"
        >
          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-2xl mx-auto">
            {data.name.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg border-2 border-emerald-600">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
        <div className="flex items-center justify-center gap-2 opacity-90 text-sm font-medium">
          <Heart className="w-4 h-4 fill-white" /> Verified Community Volunteer
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-20">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`card ${stat.bg} border-none shadow-xl flex flex-col items-center justify-center py-6 gap-2`}
            >
              <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-1">
                {stat.icon}
              </div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</span>
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="card shadow-xl border-none mb-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Calendar className="text-emerald-500 w-5 h-5" /> Impact History
          </h2>
          
          {data.impact_history.length > 0 ? (
            <div className="space-y-6">
              {data.impact_history.map((record, idx) => (
                <div key={idx} className="flex gap-4 border-l-2 border-emerald-500/30 pl-4 relative">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[var(--bg-primary)]"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-[var(--text-primary)]">{record.event_details.title}</h3>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded-md">
                        {new Date(record.check_out).getFullYear()}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">{record.event_details.ngo_name}</p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-[var(--border-color)]">
                      {record.event_details.custom_appreciation || record.event_details.description.substring(0, 100) + "..."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              No public impact records found yet.
            </div>
          )}
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
          >
            Want to start your own impact journey? <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple ArrowRight component if lucide icon fails or wasn't imported properly
const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default PublicPortfolio;
