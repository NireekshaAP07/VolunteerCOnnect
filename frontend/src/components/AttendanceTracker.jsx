import React, { useState } from 'react';
import { useToast } from './ToastNotifications';
import { CheckCircle2, Clock, LogOut } from 'lucide-react';
import api from '../services/api';

export default function AttendanceTracker({ eventId, userId, checkedInAt, checkedOutAt, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await api.post(`/api/attendance/${action}?user_id=${userId}`, { event_id: eventId });
      addToast(`Successfully ${action === 'checkin' ? 'checked in' : 'checked out'}!`, 'success');
      if (onUpdate) onUpdate();
    } catch (err) {
      addToast(err.response?.data?.detail || err.response?.data?.error || "Network error. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  if (checkedOutAt) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center shadow-sm">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <p className="text-emerald-700 dark:text-emerald-400 font-bold text-lg">Attendance Complete</p>
        <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-1">Points have been awarded to your account</p>
      </div>
    );
  }

  if (checkedInAt) {
    return (
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
        <div className="flex items-center justify-center gap-2 text-sm text-blue-700 dark:text-blue-400 mb-1 font-semibold">
          <Clock className="w-4 h-4" />
          Checked In at {new Date(checkedInAt).toLocaleTimeString()}
        </div>
        <button 
          onClick={() => handleAction('checkout')}
          disabled={loading}
          className="btn bg-orange-500 hover:bg-orange-600 text-white w-full py-3 text-base shadow-lg shadow-orange-500/30 disabled:opacity-50 transition-transform active:scale-95"
        >
          {loading ? 'Processing...' : (
            <>
              <LogOut className="w-5 h-5 mr-1" />
              Check Out & Claim Points
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => handleAction('checkin')}
      disabled={loading}
      className="btn btn-primary w-full py-3 text-base shadow-lg shadow-emerald-500/30 disabled:opacity-50 transition-transform active:scale-95"
    >
      {loading ? 'Processing...' : 'Check In to Event'}
    </button>
  );
}
