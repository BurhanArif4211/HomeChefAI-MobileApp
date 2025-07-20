// src/components/CustomRecipesTab.jsx
import React, { useState, useEffect } from 'react';
import { Card } from './../../ui/Card';
import { Button } from '../../ui/Button';
import { RecipeModal } from '../../RecipeModal';
import CustomRecipeForm from './../../CustomRecipeForm';
import { backEndBaseURL } from './../../../config';

export default function CustomRecipesTab({
    customRecipes=[], setCustomRecipes, user
  }) {
      const [recipes, setRecipes] = useState(customRecipes);
      const [loading, setLoading] = useState(false);
      const [selected, setSelected] = useState(null);
      const maxCustom = 20;
  
      // Sync local recipes state whenever prop changes
      useEffect(() => {
        setRecipes(customRecipes);
      }, [customRecipes]);

  const handleAdded = (newRecipe) => {
    setCustomRecipes(prev => [newRecipe, ...prev]);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Show form if under max */}
      {recipes.length < maxCustom ? (
        <CustomRecipeForm userId={user.userId} onAdded={handleAdded} />
      ) : (
        <p className="text-center text-gray-400">
          You’ve reached the maximum of {maxCustom} custom recipes.
        </p>
      )}

      {/* List existing custom recipes */}
      {loading ? (
        <p className="text-center text-gray-400">Loading…</p>
      ) : recipes.length ? (
        recipes.map(r => (
          <Card
            onClick={() => setSelected(r)}
            key={r.recipeId}>
            <h3 className="text-lg font-semibold">{r.title}</h3>
            <p className="text-sm text-gray-300">{r.description}</p>
            <div className="mt-2 flex text-sm text-gray-400">
              <span className="mr-4">⏱ {r.totalTime} min</span>
              <span>🍽 {r.servings} servings</span>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-400">No custom recipes yet.</p>
      )}
     <RecipeModal
       open={!!selected}
       onClose={() => setSelected(null)}
       recipe={selected}
       showFavoriteButton={false}
       showSource={true}
     />

    </div>
  );
}
