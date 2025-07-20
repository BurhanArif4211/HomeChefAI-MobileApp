// src/components/CustomRecipesTab.jsx
import React, { useState, useEffect } from 'react';
import { Card } from './../../ui/Card';
import { Button } from '../../ui/Button';
import { RecipeModal } from '../../RecipeModal';
import CustomRecipeForm from './../../CustomRecipeForm';
import { backEndBaseURL } from './../../../config';

export default function CustomRecipesTab({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const maxCustom = 20;

  useEffect(() => {
    loadCustom();
  }, []);

  async function loadCustom() {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${backEndBaseURL}/api/custom-recipes/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecipes(data.recipes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAdded = (newRecipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
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
