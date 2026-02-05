"use client";
import { useState } from 'react';

export function MultiSelect({ 
  label, 
  options, 
  selected, 
  onChange 
}: { 
  label: string; 
  options: string[]; 
  selected: string[]; 
  onChange: (selected: string[]) => void;
}) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selected.includes(option)
                ? 'bg-brand text-white'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
