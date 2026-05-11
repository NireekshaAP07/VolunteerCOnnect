import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PointsBadge from '../components/PointsBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import CertificateGenerator from '../components/CertificateGenerator';
import { Mail, User, Clock, CheckCircle, Share2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function Profile() {
  const { currentUser, role } = useAuth();
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.uid) {
      Promise.all([
        api.get(`/api/users/${currentUser.uid}`),
        api.get(`/api/attendance?user_id=${currentUser.uid}`)
      ])
        .then(([userRes, attendanceRes]) => {
          setUserData(userRes.data);
          setHistory(Array.isArray(attendanceRes.data) ? attendanceRes.data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching profile data:", err);
          setLoading(false);
        });
    } else {
        setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) return <div className="p-8 text-center text-[var(--text-secondary)]">Please log in to view your profile.</div>;
  if (loading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in pb-24 sm:pb-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center text-4xl mb-4 font-bold border-4 border-emerald-50 dark:border-slate-800 shadow-sm">
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{userData?.name || "User"}</h2>
            <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-semibold mt-1 flex items-center gap-1">
              <User className="w-3 h-3" /> {role || userData?.role || "Volunteer"}
            </p>
            <div className="w-full h-px bg-gray-200 dark:bg-slate-700 my-4"></div>
            <p className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2 w-full truncate">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{userData?.email || currentUser.email}</span>
            </p>
            <button 
              onClick={() => {
                const url = `${window.location.origin}/portfolio/${currentUser.uid}`;
                navigator.clipboard.writeText(url);
                alert("Portfolio link copied to clipboard!");
              }}
              className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              <Share2 size={16} /> Share Portfolio
            </button>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <PointsBadge points={userData?.points || 0} />
          
          <div className="card">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Activity History</h3>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((record) => (
                  <div key={record.id} className="p-4 border border-[var(--border-color)] rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)]">{record.event_details?.title || `Event #${record.event_id}`}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">{record.event_details?.ngo_name || 'VolunteerConnect'}</p>
                      </div>
                      {(record.check_out || record.verified_at) && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-[var(--text-secondary)] mt-3">
                      {record.check_in && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>In: {new Date(record.check_in).toLocaleString()}</span>
                        </div>
                      )}
                      {(record.check_out || record.verified_at) && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Out: {new Date(record.check_out || record.verified_at).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {(record.check_out || record.verified_at) && (
                      <CertificateGenerator 
                        attendance={record} 
                        volunteerName={userData?.name || "Volunteer"} 
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                <p className="text-[var(--text-secondary)]">Your recent volunteer history will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
