import React, { useState, useEffect } from 'react';//px-2 py-1 bg-gray-700 rounded-lg
import { Input } from './Input';
import { cn } from './../../lib/utils';
import { Trash2 } from 'lucide-react';

export function ListEditor({
  items: initial = [],
  onChange,
  placeholder = 'Enter item...',
  className,
}) {
  const [items, setItems] = useState([...initial, '']);

  // Whenever items change, report only non‑empty entries
  useEffect(() => {
    const nonEmpty = items.filter(i => i.trim() !== '');
    onChange(nonEmpty);
  }, [items]);

  // Always keep exactly one empty field at end
  useEffect(() => {
    if (items.length === 0 || items[items.length - 1].trim() !== '') {
      setItems(prev => [...prev, '']);
    }
  }, [items]);

  // Update the value at index
  const updateAt = (idx, value) => {
    setItems(prev => prev.map((i, j) => (j === idx ? value : i)));
  };

  // Remove the field at index
  const removeAt = (idx) => {
    setItems(prev => prev.filter((_, j) => j !== idx));
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((val, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center space-x-2">
            <Input
              
              value={val}
              placeholder={placeholder}
              onChange={e => updateAt(idx, e.target.value)}
              onBlur={e => {
                if (!isLast && !e.target.value.trim()) {
                  removeAt(idx);
                }
              }}
              className="flex-1 px-2 py-1 bg-gray-700 rounded-lg"
            />
            {!isLast && (
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className={cn('p-1 rounded hover:bg-gray-700')}
              >
                <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-400" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}