// src/components/ui/Input.jsx
import React from 'react';
import { cn } from './../../lib/utils';

export function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 text-sm text-gray-300">{label}</label>}
      <input
        className={cn(
          'px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary',
          error && 'border border-red-500'
        )}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-red-400">{error}</span>}
    </div>
  );
}