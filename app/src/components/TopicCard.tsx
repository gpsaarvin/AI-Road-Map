"use client";
import { useState } from 'react';

export function TopicCard({ title, hours, completed: initialCompleted = false }: { title: string; hours: number; completed?: boolean }) {
  const [completed, setCompleted] = useState(initialCompleted);
  
  return (
    <div className={`glass rounded-xl p-5 transition-all ${completed ? 'border-2 border-green-500 bg-green-50/50 dark:bg-green-950/20' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-md transition-all ${
              completed 
                ? 'bg-green-500 text-white scale-110' 
                : 'bg-gradient-brand text-white'
            }`}>
              {completed ? '✓' : '📖'}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${completed ? 'line-through text-gray-500' : ''}`}>{title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{hours}h estimated</span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setCompleted(!completed)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            completed 
              ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg' 
              : 'bg-gray-200 dark:bg-neutral-800 hover:bg-gradient-brand hover:text-white'
          }`}
        >
          {completed ? '✓ Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
}
