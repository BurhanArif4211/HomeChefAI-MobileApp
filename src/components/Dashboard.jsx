import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { cn } from './../lib/utils';
import { Search, Zap, Star, ShoppingCart, User } from 'lucide-react';
import ProfileForm from './ProfileForm';
import FindSection from './sections/FindSection';
import MyRecipeSection from './sections/MyRecipeSection'
import GrocerySection from './sections/GrocerySection'
import SuggestSection from './sections/SuggestSection'
import { backEndBaseURL } from './../config';

export default function Dashboard({ user: initialUser, onLogout }) {
  const navItems = [
    { key: 'Find', label: 'Find', icon: Search },
    { key: 'Suggest', label: 'Suggest', icon: Zap },
    { key: 'Saved', label: 'Saved', icon: Star },
    { key: 'Groceries', label: 'Groceries', icon: ShoppingCart },
    { key: 'Profile', label: 'Profile', icon: User },
  ];

  const [screen, setScreen] = useState('Find');
  const [user, setUser] = useState(initialUser);

  // central data
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteRecipesData, setFavoriteRecipesData] = useState([]);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);

  // initial fetch on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    async function loadAll() {
      try {
        // parallel fetches
        const [userRes, favRes, custRes, recRes] = await Promise.all([
          fetch(`${backEndBaseURL}/api/user/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${backEndBaseURL}/api/user/favorites/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${backEndBaseURL}/api/custom-recipes/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${backEndBaseURL}/api/recipes?page=1&limit=10`)
        ]);

        const userData = await userRes.json();
        const favData = await favRes.json();
        const custData = await custRes.json();
        const recData = await recRes.json();

        if (userData.success) {
          setUser(userData.result);
          setFavorites(userData.result.favoriteRecipes || []);
        }
        if (favData.success) setFavoriteRecipesData(favData.results);
        if (custData.success) setCustomRecipes(custData.recipes);
        if (recData.success) {
          setRecipes(recData.results);
          setTotalRecipes(recData.total);
        }
      } catch (err) {
        console.error('Dashboard data load failed', err);
      }
    }
    loadAll();
  }, []);

  // load more recipes
  const loadMoreRecipes = async () => {
    const token = localStorage.getItem('authToken');
    const next = page + 1;
    const res = await fetch(`${backEndBaseURL}/api/recipes?page=${next}&limit=10`);
    const data = await res.json();
    if (data.success) {
      setRecipes(r => [...r, ...data.results]);
      setPage(next);
      setTotalRecipes(data.total);
    }
  };

  const sharedProps = { user, setUser };

  const renderSection = () => {
    switch (screen) {
      case 'Find':
        return <FindSection
          recipes={recipes}
          setRecipes={setRecipes}
          favoriteRecipesData={favoriteRecipesData}
          setFavoriteRecipesData={setFavoriteRecipesData}
          totalRecipes={totalRecipes}
          loadMoreRecipes={loadMoreRecipes}
          favorites={favorites}
          setFavorites={setFavorites}
          onNavigate={setScreen}
          {...sharedProps}
        />;

      case 'Suggest':
        return <SuggestSection
          customRecipes={customRecipes}
          setCustomRecipes={setCustomRecipes}
          {...sharedProps} />;
      case 'Saved':
        return <MyRecipeSection
          favoriteRecipesData={favoriteRecipesData}
          setFavoriteRecipesData={setFavoriteRecipesData}
          favorites={favorites}
          setFavorites={setFavorites}
          customRecipes={customRecipes}
          setCustomRecipes={setCustomRecipes}
          {...sharedProps}
        />;
      case 'Groceries':
        return <GrocerySection {...sharedProps} />;
      case 'Profile':
        return (
          <div className="space-y-2 p-4">
            <p><strong>Full Name:</strong> {user.fullName || 'N/A'}</p>
            <p><strong>City:</strong> {user.city || 'N/A'}</p>
            <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
            <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
            <Button
              variant="outline"
              className="sm mx-2"
              onClick={() => setScreen('ProfileEdit')}   // new screen
            >
              Edit Profile
            </Button>
          </div>
        )
      case 'ProfileEdit':
        return (
          <ProfileForm
            initial={user}
            submitLabel="Save Changes"
            onSubmit={updatedUser => {
              let temp = { ...user }
              temp.fullName = updatedUser.fullName;
              temp.city = updatedUser.city;
              temp.gender = updatedUser.gender;
              setUser(temp);
              setScreen('Profile');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <div className="flex justify-between items-center p-4 bg-gray-800 sticky top-0">
        <h2 className="text-lg font-semibold">{screen}</h2>
        <div className="font-thin">Credits Left: 15</div>
      </div>

      <div className="flex-1 overflow-auto">
        {renderSection()}
      </div>

      <nav className="flex justify-around bg-gray-800 p-2 sticky bottom-0">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = screen === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setScreen(item.key)}
              className="flex flex-col items-center"
            >
              <Icon
                className={cn(
                  'w-6 h-6',
                  isActive ? 'bg-gradient-to-tr from-purple-700 to-pink-500 rounded-full' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-xs mt-1',
                  isActive ? 'text-gray-100 bg-gradient-to-tr from-purple-700 to-pink-500 bg-clip-text text-transparent' : 'text-gray-400'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

