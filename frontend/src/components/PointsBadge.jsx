import React from 'react';

export default function PointsBadge({ points = 0 }) {
  let level = "Beginner";
  let maxPoints = 100;
  let colorClass = "bg-blue-500";
  let textClass = "text-blue-600 dark:text-blue-400";
  let bgLight = "bg-blue-50 dark:bg-blue-900/20";

  if (points >= 300) {
    level = "Changemaker";
    maxPoints = points + 200; // Visual continuation
    colorClass = "bg-purple-500";
    textClass = "text-purple-600 dark:text-purple-400";
    bgLight = "bg-purple-50 dark:bg-purple-900/20";
  } else if (points >= 100) {
    level = "Contributor";
    maxPoints = 300;
    colorClass = "bg-emerald-500";
    textClass = "text-emerald-600 dark:text-emerald-400";
    bgLight = "bg-emerald-50 dark:bg-emerald-900/20";
  }

  const progressPercent = Math.min(100, Math.max(0, (points / maxPoints) * 100));

  return (
    <div className={`rounded-2xl p-6 border border-[var(--border-color)] ${bgLight} shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Current Level</p>
          <span className={`font-bold font-outfit text-2xl tracking-tight ${textClass}`}>{level}</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Total Points</p>
          <span className={`font-semibold text-xl ${textClass}`}>{points}</span>
        </div>
      </div>
      
      <div className="w-full bg-white dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-gray-200 dark:border-slate-700">
        <div 
          className={`${colorClass} h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mt-3 text-right font-medium">
        {level === "Changemaker" ? "Max Level Reached! Keep it up!" : `${maxPoints - points} points to next level`}
      </p>
    </div>
  );
}
