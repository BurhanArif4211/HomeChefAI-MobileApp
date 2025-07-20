// src/components/MyRecipesSection.jsx
import React, { useState } from 'react';
import { cn } from './../../lib/utils';
import FavoritesSection from './tabs/FavoritesTab';
import CustomRecipesTab from './tabs/CustomRecipeTab';
import AISuggestedRecipesTab from './tabs/AISuggestedRecipesTab'

export default function MyRecipeSection({
   favorites,
   setFavorites,
   favoriteRecipesData,
   setFavoriteRecipesData,
   customRecipes,
   setCustomRecipes,
   user,
   setUser,
 }) {
  const tabs = ['Favorites', 'AI Suggested', 'Custom'];
  const [active, setActive] = useState('AI Suggested');

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h2 className="text-lg font-semibold">My Recipes</h2>
      </div>

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

      <div className="flex-1 overflow-auto transition-all">
        {active === 'Favorites' && (
          <FavoritesSection 
          favoriteRecipesData ={favoriteRecipesData}
          favorites ={favorites}
          setFavorites ={setFavorites}
          setUser ={setUser} 
          user ={user} />
        )}
        {active === 'AI Suggested' && (
          <AISuggestedRecipesTab 
          customRecipes ={customRecipes}
           />
        )}
        {active === 'Custom' && (
          <CustomRecipesTab 
          customRecipes ={customRecipes}
          setCustomRecipes ={setCustomRecipes}
          setUser ={setUser} 
          user ={user} />
        )}
      </div>
    </div>
  );
}
