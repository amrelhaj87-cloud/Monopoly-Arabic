import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useGame } from './context/GameContext';
import { TopBar, AppPage } from './components/common/TopBar';
import { HomePage } from './components/pages/HomePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { GamePage } from './components/pages/GamePage';
import { RoomLobby } from './components/lobby/RoomLobby';

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { room, gameState } = useGame();

  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [is3D, setIs3D] = useState<boolean>(true);

  // Automatically switch to 'game' page when a game match starts
  useEffect(() => {
    if (gameState) {
      setCurrentPage('game');
    } else if (!room && currentPage === 'game') {
      setCurrentPage('home');
    }
  }, [gameState, room]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="text-6xl animate-bounce mb-3">🎲</div>
        <h2 className="text-2xl font-black font-gold">مونوبولي العربية</h2>
        <span className="text-xs text-slate-400 mt-1">جاري تجهيز لوحة اللعب...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-950/40">
      {/* Top Navigation Bar with clear Page Tabs */}
      <TopBar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        is3D={is3D}
        setIs3D={setIs3D}
      />

      {/* Main Pages Router */}
      <main className="flex-1 flex flex-col p-2 sm:p-4 w-full max-w-7xl mx-auto">
        {/* 1. SETTINGS PAGE */}
        {currentPage === 'settings' && (
          <SettingsPage
            is3D={is3D}
            setIs3D={setIs3D}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}

        {/* 2. IN-GAME ARENA PAGE */}
        {currentPage === 'game' && gameState && (
          <GamePage is3D={is3D} />
        )}

        {/* 3. HOME / LOBBY PAGE */}
        {currentPage === 'home' && (
          <>
            {/* If in Room waiting lobby */}
            {room && !gameState ? (
              <RoomLobby />
            ) : (
              /* If in Home Main Menu / Welcome */
              <HomePage onNavigateToSettings={() => setCurrentPage('settings')} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
