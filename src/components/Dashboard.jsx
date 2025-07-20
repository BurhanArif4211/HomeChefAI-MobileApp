import React, { useState } from 'react';
import { Button } from './ui/Button';
import { cn } from './../lib/utils';
import { Search, Zap, Star, ShoppingCart, User } from 'lucide-react';
import ProfileForm from './ProfileForm';
import FindSection from './sections/FindSection';
import MyRecipeSection from './sections/MyRecipeSection'
import GrocerySection from './sections/GrocerySection'
import SuggestSection from './sections/SuggestSection'
const navItems = [
  { key: 'Find', label: 'Find', icon: Search },
  { key: 'Suggest', label: 'Suggest', icon: Zap },
  { key: 'Saved', label: 'Saved', icon: Star },
  { key: 'Groceries', label: 'Groceries', icon: ShoppingCart },
  { key: 'Profile', label: 'Profile', icon: User },
];

export default function Dashboard({ user,setUser, onLogout }) {  
  const [active, setActive] = useState('Find');

  const renderSection = () => {
    switch (active) {
      case 'Find':
        return <FindSection user={user} setUser={setUser} onNavigate={key => setActive(key)}/>;
      case 'Suggest':
        return  <SuggestSection user={user} />;
      case 'Saved':
        return <MyRecipeSection user={user} setUser={setUser} />;
      case 'Groceries':
        return <GrocerySection user={user} setUser={setUser} />;
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
                  onClick={() => setActive('ProfileEdit')}   // new screen
                >
                  Edit Profile
                </Button>
          </div>
        );
      case 'ProfileEdit':
        return (
          <ProfileForm
            initial={user}
            submitLabel="Save Changes"
            onSubmit={updatedUser => {
              setActive('Profile');
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
        <h2 className="text-lg font-semibold">{active}</h2>
        <div className="font-thin">Credits Left: 15</div>
      </div>

      <div className="flex-1 overflow-auto">
        {renderSection()}
      </div>

      <nav className="flex justify-around bg-gray-800 p-2 sticky bottom-0">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className="flex flex-col items-center"
            >
              <Icon
                className={cn(
                  'w-6 h-6',
                  isActive ? 'text-gray-100' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-xs mt-1',
                  isActive ? 'text-gray-100' : 'text-gray-400'
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
