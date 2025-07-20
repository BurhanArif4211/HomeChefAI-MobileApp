import React from 'react';
import { motion } from 'framer-motion';

/**
 * iOS-style Switch component
 * @param {{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }} props
 */
export function Switch  ({ checked, onChange, disabled = false })  {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={
        `relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ` +
        (checked ? 'bg-purple-500' : 'bg-gray-400') +
        (disabled ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer')
      }
    >
      <motion.span
        layout
        className="inline-block h-5 w-5 bg-white rounded-full shadow transform"
        initial={false}
        animate={{ x: checked ? 22 : 1 }}
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      />
    </button>
  );
};