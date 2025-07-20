// src/components/WelcomeScreen.jsx
import React from 'react';
import { Button } from './ui/Button';

export default function WelcomeScreen({ onLogin, onSignup }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
      <div className="rounded-full bg-slate-700">
      <img src="assets/logo.png" alt="Logo" className="w-60 h-auto" />
      </div>
      <h1 className="text-base font-bold">Your AI powered recipe asssistant.</h1>
      <div className="w-full max-w-xs space-y-4">
        <Button variant="outline" size="lg" className="w-full" onClick={onLogin}>Login</Button>
        <Button variant="rose" size="lg" className="w-full" onClick={onSignup}>Sign Up</Button>
      </div>
      
    </div>
  );
}