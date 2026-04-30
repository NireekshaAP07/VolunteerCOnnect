import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Leaderboard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/api/auth/leaderboard');
        setVolunteers(data.volunteers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <LoadingSpinner text="Calculating impact rankings..." />;

  const topThree = volunteers.slice(0, 3);
  const others = volunteers.slice(3);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in pb-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 flex items-center justify-center gap-3">
          <Trophy className="text-yellow-500 w-8 h-8" /> Impact Leaders
        </h1>
        <p className="text-[var(--text-secondary)]">Celebrating our most dedicated community members</p>
      </div>

      {/* Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-12 items-end pt-10 px-2">
          {/* 2nd Place */}
          {topThree[1] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate(`/portfolio/${topThree[1].id}`)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-slate-300 dark:border-slate-600 shadow-lg">
                  <span className="text-xl font-bold text-slate-600 dark:text-slate-300">{topThree[1].name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-2 -right-1 bg-slate-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[var(--bg-primary)]">
                  2
                </div>
              </div>
              <p className="text-sm font-bold text-center truncate w-full px-1">{topThree[1].name.split(' ')[0]}</p>
              <p className="text-xs text-emerald-500 font-bold">{topThree[1].points} pts</p>
              <div className="w-full h-24 bg-slate-100 dark:bg-slate-800/50 rounded-t-xl mt-4 border-x border-t border-slate-200 dark:border-slate-700"></div>
            </motion.div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/portfolio/${topThree[0].id}`)}
              className="flex flex-col items-center z-10 cursor-pointer"
            >
              <div className="relative mb-4">
                <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-500 w-8 h-8 animate-bounce" />
                <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center border-4 border-yellow-400 shadow-xl shadow-yellow-500/10">
                  <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{topThree[0].name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-2 -right-1 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-[var(--bg-primary)]">
                  1
                </div>
              </div>
              <p className="text-base font-bold text-center truncate w-full px-1">{topThree[0].name.split(' ')[0]}</p>
              <p className="text-sm text-emerald-500 font-bold">{topThree[0].points} pts</p>
              <div className="w-full h-32 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-t-xl mt-4 border-x border-t border-yellow-200/50 dark:border-yellow-900/30"></div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate(`/portfolio/${topThree[2].id}`)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border-4 border-orange-200 dark:border-orange-800 shadow-lg">
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">{topThree[2].name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-2 -right-1 bg-orange-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[var(--bg-primary)]">
                  3
                </div>
              </div>
              <p className="text-sm font-bold text-center truncate w-full px-1">{topThree[2].name.split(' ')[0]}</p>
              <p className="text-xs text-emerald-500 font-bold">{topThree[2].points} pts</p>
              <div className="w-full h-16 bg-orange-50/30 dark:bg-orange-900/10 rounded-t-xl mt-4 border-x border-t border-orange-200/30 dark:border-orange-900/20"></div>
            </motion.div>
          )}
        </div>
      )}

      {/* Others List */}
      <div className="space-y-3">
        {others.map((v, idx) => (
          <motion.div 
            key={v.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            onClick={() => navigate(`/portfolio/${v.id}`)}
            className="card flex items-center justify-between p-4 hover:border-emerald-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <span className="w-6 text-sm font-bold text-[var(--text-secondary)]">{idx + 4}</span>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">
                {v.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">{v.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">Member since {new Date(v.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-500">{v.points}</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-tighter">Points</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
