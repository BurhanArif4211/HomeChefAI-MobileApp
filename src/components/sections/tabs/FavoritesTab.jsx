import React, { useState, useEffect } from 'react';
import { Card } from './../../ui/Card';
import { Button } from '../../ui/Button';
import { RecipeModal } from './../../RecipeModal';
import { backEndBaseURL } from './../../../config';
import { BeatLoader } from 'react-spinners';

export default function FavoritesTab({ user, setUser }) {
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
      const res = await fetch(`${backEndBaseURL}/api/user/favorites/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setRecipes(data.results);
    } finally {
      setLoading(false);
    }
  }

  async function removeFav(recipeId) {
    const token = localStorage.getItem('authToken');
    await fetch(`${backEndBaseURL}/api/user/favorites/${recipeId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    // Update user & UI
    const favs = user.favoriteRecipes.filter(id => id !== recipeId);
    setUser({ ...user, favoriteRecipes: favs });
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
        <Card 
        onClick={() => setSelected(r)}
        key={r.recipeId}>
          <h3 className="text-lg font-semibold">{r.title}</h3>
          <p className="text-sm text-gray-300">{r.description}</p>
          <div className="mt-2 text-right">
            <Button variant="outline" size="sm" onClick={() => removeFav(r.recipeId)}>
              Remove
            </Button>
          </div>
        </Card>
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
