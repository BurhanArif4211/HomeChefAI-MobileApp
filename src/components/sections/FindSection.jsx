// src/components/FindSection.jsx
import React, { useState, useEffect } from 'react';
import { Card } from './../ui/Card';
import { Button } from './../ui/Button';
import { RecipeModal } from './../RecipeModal';
import { BeatLoader } from 'react-spinners';
import { backEndBaseURL } from './../../config';

export default function FindSection({
  recipes,
  setFavoriteRecipesData,
  favoriteRecipes,
  loadMoreRecipes,
  favorites,
  setFavorites,
  user,
  setUser,
  onNavigate
}) {
  const greetingList = ["Howdy!", "Aloha!", "Bonjour!", "Hey There!", "What's cookin'?", "Greetings!", "Salutations!", "Yo, yo, yo!", "How's it hangin'?", "What's shakin'?", "Ahoy!", "Howdy-doo!", "Cheers!", "Top of the morning to ya!", "Hello!", "Hiya!", "What's the buzz?", "Salute, amigo!"];
  const greeting = useState(greetingList[Math.floor(Math.random() * greetingList.length)]);



  const [selected, setSelected] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  useEffect(() => {
    setFavoriteRecipesData(
      recipes.filter(r => favorites.includes(r.recipeId))
    );
  }, [recipes, favorites]);

  async function handleToggleFav(recipeId) {
    setFavLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(
        `${backEndBaseURL}/api/user/favorites/${recipeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Server Error (${res.status})`);
      const data = await res.json();
      // data.favoriteRecipes is the new ID array
      setFavorites(data.favoriteRecipes);

    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavLoading(false);
    }
  }


  const counts = {
    Favorites: user.favoriteRecipes.length,
    Groceries: user.groceryList.length,
    Custom: user.customRecipeListId ? 0 : 0,
    AIUsesLeft: 5,
  };

  return (
    <>
      {/* Top 2×2 grid of widgets */}
      <div className='text-xl p-4'>
        <span className='text-3xl '>{greeting} </span><br />
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
                {favLoading ? (
                  <BeatLoader loading={favLoading} size={8} color="#fff" />
                ) : (
                  favorites.includes(r.recipeId) ? '❤️' : '🤍'
                )}

              </button>
            </div>
          </Card>
        ))}

        {recipes && (
          <div className="text-center">
            <Button onClick={loadMoreRecipes} disabled={favLoading}>
              {favLoading
                ? <BeatLoader loading={favLoading} size={8} color="#fff" />
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

