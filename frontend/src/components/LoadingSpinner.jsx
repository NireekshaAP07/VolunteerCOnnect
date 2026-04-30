import React from 'react';

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4 w-full h-full min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p className="text-[var(--text-secondary)] font-medium">{text}</p>
    </div>
  );
}
