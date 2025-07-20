import React from 'react';
import { cn } from './../../lib/utils';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn('bg-gray-800 text-white rounded-lg shadow-md p-6', className)}
      {...props}>
      {children}
    </div>
  );
}
