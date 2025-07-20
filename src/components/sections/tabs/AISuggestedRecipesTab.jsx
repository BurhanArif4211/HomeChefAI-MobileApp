import React, { useState, useEffect } from 'react';
import { Card } from './../../ui/Card';
import { Button } from '../../ui/Button';
import { RecipeModal } from './../../RecipeModal';
import { backEndBaseURL } from './../../../config';
import { BeatLoader } from 'react-spinners';

export default function AISuggestedRecipesTab({ user, setUser }) {
    const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadFavs();
  }, [user.favoriteRecipes.join(',')]);

  async function loadFavs() {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${backEndBaseURL}/api/custom-recipes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setRecipes(data.recipes);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="text-center">
      <BeatLoader loading={loading} size={8} color="#fff" />
    </div>
  )
  if (!recipes.length) return <p className="p-4 text-center">No favorites yet.</p>;

  return (
    <div className="space-y-4 p-4">
      {recipes.map(r => (

        (r.source == 'gemini-generated' || r.source == 'ai-generated')?
        <Card 
        onClick={() => setSelected(r)}
        key={r.recipeId}>
          <h3 className="text-lg font-semibold">{r.title}</h3>
          <p className="text-sm text-gray-300">{r.description}</p>
        </Card>:""

      ))}
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