
// src/main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

function waitForCordova() {
  return new Promise(resolve => {
    if (window.CORDOVA_READY) return resolve();
    document.addEventListener('deviceready', resolve, false);
  });
}

waitForCordova().then(() => {
  const container = document.getElementById('app');
  const root = createRoot(container);
  root.render(
      <App />
  );
});