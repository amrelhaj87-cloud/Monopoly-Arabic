import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import './index.css';

import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { ScreenOrientation } from '@capacitor/screen-orientation';

if (Capacitor.isNativePlatform()) {
  // Enhance gaming experience on mobile
  StatusBar.hide().catch(console.warn);
  ScreenOrientation.lock({ orientation: 'landscape' }).catch(console.warn);
  SplashScreen.hide().catch(console.warn);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </AuthProvider>
  </React.StrictMode>
);
