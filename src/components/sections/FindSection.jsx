// src/components/FindSection.jsx
import React, { useState, useEffect } from 'react';
import { Card } from './../ui/Card';
import { Button } from './../ui/Button';
import { RecipeModal } from './../RecipeModal';
import { backEndBaseURL } from './../../config';
import { BeatLoader } from 'react-spinners';

export default function FindSection({ user, setUser, onNavigate }) {           
  const greetingList =["Howdy!","Aloha!","Bonjour!","Hey There!","What's cookin'?","Greetings!","Salutations!","Yo, yo, yo!","How's it hangin'?","What's shakin'?","Ahoy!","Howdy-doo!","Cheers!","Top of the morning to ya!","Hello!","Hiya!","What's the buzz?","Salute, amigo!"];
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState(greetingList[Math.floor(Math.random() * greetingList.length)]);

  const [selected, setSelected] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  // Whenever page or user.favoriteRecipes changes, reload/mark favorites
  useEffect(() => {
    loadRecipes();
  }, [page]);

  async function loadRecipes() {
    setGreeting(greetingList[Math.floor(Math.random() * greetingList.length)]);
    setLoading(true);
    try {
      const res = await fetch(`${backEndBaseURL}/api/recipes?page=${page}&limit=10`);
      const data = await res.json();
      if (data.success) {
        // annotate each recipe with its favorite state
        const withFav = data.results.map(r => ({
          ...r,
          isFav: user.favoriteRecipes.includes(r.recipeId),
        }));
        setRecipes(prev => page === 1 ? withFav : [...prev, ...withFav]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Toggle favorite (same endpoint for add/remove)
  async function handleToggleFav(recipeId) {
    setFavLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${backEndBaseURL}/api/user/favorites/${recipeId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to toggle');

      // Update local recipe array
      setRecipes(rs =>
        rs.map(r =>
          r.recipeId === recipeId ? { ...r, isFav: !r.isFav } : r
        )
      );
      // Update global user.favoriteRecipes
      const wasFav = user.favoriteRecipes.includes(recipeId);
      const favs = wasFav
        ? user.favoriteRecipes.filter(id => id !== recipeId)
        : [...user.favoriteRecipes, recipeId];
      setUser({ ...user, favoriteRecipes: favs });

      // If modal open, sync it too
      if (selected?.recipeId === recipeId) {
        setSelected(sel => ({ ...sel, isFav: !sel.isFav }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  }
  // Counts for widgets
  const counts = {
    Favorites: user.favoriteRecipes.length,
    Groceries: user.groceryList.length,
    Custom: user.customRecipeListId ? /* you may track count separately */ 0 : 0,
    AIUsesLeft: 5,  // placeholder
  };

  return (
    <>
      {/* Top 2×2 grid of widgets */}
      <div className='text-xl p-4'>
        <span className='text-3xl '>{greeting} </span><br/>
        {user.fullName}
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <Card
          className="cursor-pointer hover:bg-gray-700 flex flex-col items-center justify-center space-y-2"
          onClick={() => onNavigate('Saved')}
        >
          <div className="text-2xl">❤️</div>
          <div className="text-lg">{counts.Favorites}</div>
          <div className="text-sm text-gray-400">My Favorites</div>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-700 flex flex-col items-center justify-center space-y-2"
          onClick={() => onNavigate('Groceries')}
        >
          <div className="text-2xl">🛒</div>
          <div className="text-lg">{counts.Groceries}</div>
          <div className="text-sm text-gray-400">Groceries</div>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-700 flex flex-col items-center justify-center space-y-2"
          onClick={() => onNavigate('Saved')}
        >
          <div className="text-2xl">📋</div>
          <div className="text-lg">{counts.Custom}</div>
          <div className="text-sm text-gray-400">My Recipes</div>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-700 flex flex-col items-center justify-center space-y-2"
          onClick={() => onNavigate('Suggest')}
        >
          <div className="text-2xl">🤖</div>
          <div className="text-lg">{counts.AIUsesLeft}</div>
          <div className="text-sm text-gray-400">AI Uses Left</div>
        </Card>
      </div>


      <div className="space-y-4 p-4">
        <h1 className='text-xl'>Browse Recipes</h1>
        {recipes.map(r => (
          <Card
            key={r.recipeId}
            className="grid grid-cols-2 gap-4 cursor-pointer hover:bg-gray-700"
            onClick={() => setSelected(r)}
          >
            <div>
              <h3 className="text-lg font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-300">{r.description}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <div className="text-lg font-bold">{r.totalTime} min</div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleToggleFav(r.recipeId);
                }}
                className="text-xl"
                disabled={favLoading}
              >
              {r.isFav ? '❤️' : '🤍'}
              </button>
            </div>
          </Card>
        ))}

        {recipes && (
          <div className="text-center">
            <Button onClick={() => setPage(p => p + 1)} disabled={loading}>
              {loading 
                ? <BeatLoader loading={loading} size={8} color="#fff" /> 
                : 'Load more'}
            </Button>
          </div>
        )}
      </div>
      <RecipeModal
        open={!!selected}
        onClose={() => setSelected(null)}
        recipe={selected}
        onToggleFav={() => handleToggleFav(selected.recipeId)}
        favLoading={favLoading}
        showFavoriteButton={true}
        showSource={true}
      />
      
    </>
  );
}

