// src/App.jsx
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import { BeatLoader } from 'react-spinners'
import { backEndBaseURL } from './config';

async function CheckAuth(idToken) {
  if (!idToken) return false;

  try {
    const res = await fetch(`${backEndBaseURL}/api/user/`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const userData = await res.json();
      return userData;
    }
  } catch (e) {
    console.error("Auth check failed:", e);
  }
  return false;
}


export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('welcome');
  const [loading, setLoading] = useState(true);

  // On mount: check token
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const auth = await CheckAuth(token);
        if (auth && auth.success) {
          setUser(auth.result);
          setScreen('dashboard');
        }
      }
      setLoading(false);
    })();
  }, []);

  // After logging in
  const handleLoginSuccess = async (token , hasSetUpProfile) => {
    localStorage.setItem('authToken', token);
    const auth = await CheckAuth(token);
    if (auth && auth.success) {
      setUser(auth.result);
      setScreen(hasSetUpProfile ? 'dashboard' : 'setup');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900"> 
      <BeatLoader
        color="#fff"
        loading={loading}
        size={50}
      /></div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {screen === 'welcome' && (
        <WelcomeScreen onLogin={() => setScreen('login')} onSignup={() => setScreen('signup')} />
      )}
      {screen === 'login' && <LoginForm onBack={() => setScreen('welcome')} onSuccess={handleLoginSuccess} />}
      {screen === 'signup' && <SignupForm onBack={() => setScreen('welcome')} onSuccess={() => setScreen('login')} />}
      {screen === 'setup' && <ProfileSetup
        user={user}
        onSetupComplete={updatedUser => {
          let temp = {...user}
          temp.fullName = updatedUser.fullName;
          temp.city = updatedUser.city;
          temp.gender = updatedUser.gender;
          setUser(temp);
          setScreen('dashboard');
        }}
      />}

      {screen === 'dashboard' && <Dashboard
        user={user}
        setUser={setUser}
        onLogout={() => {
          localStorage.removeItem('authToken');
          setUser(null);
          setScreen('welcome');
        }}
      />}
    </div>
  );
}

