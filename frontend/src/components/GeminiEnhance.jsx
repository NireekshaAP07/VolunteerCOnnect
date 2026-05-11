import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function GeminiEnhance({ text, onEnhanced }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnhance = async () => {
    if (!text || text.length < 10) {
      setError("Please write a bit more before enhancing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/ai/enhance', { text });
      onEnhanced(data.improved_text);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 mt-2 mb-4">
      <button 
        type="button" 
        onClick={handleEnhance} 
        disabled={loading}
        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? "Enhancing..." : "Enhance Description with AI"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
