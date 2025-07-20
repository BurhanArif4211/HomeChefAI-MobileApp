// src/components/SuggestSection.jsx
import React, { useState } from 'react';
import { cn } from './../../lib/utils';
import AISuggestTab from './tabs/AISuggestTab';

export default function SuggestSection({ user, customRecipes, setCustomRecipes }) {
  const tabs = ['AI Suggestion', 'Standard'];
  const [active, setActive] = useState('AI Suggestion');

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Header */}
      {/* <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-lg font-semibold">Suggest</h2>
      </div> */}

      {/* Tabs */}
      <nav className="flex bg-gray-800">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              'flex-1 py-2 text-center font-medium',
              active === tab
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400'
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {active === 'AI Suggestion' && <AISuggestTab
          customRecipes = {customRecipes}
          setCustomRecipes = {setCustomRecipes} 
          user={user} />}
        {active === 'Standard' && (
          <p className="p-4 text-gray-400">Standard suggest coming soon.</p>
        )}
      </div>
    </div>
  );
}
