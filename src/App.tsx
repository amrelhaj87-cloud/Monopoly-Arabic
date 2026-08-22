import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { useGame } from './context/GameContext';
import { TopBar, AppPage } from './components/common/TopBar';
import { HomePage } from './components/pages/HomePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { GamePage } from './components/pages/GamePage';
import { RoomLobby } from './components/lobby/RoomLobby';
import { RulesModal } from './components/common/RulesModal';
import { ContactDevModal } from './components/modals/ContactDevModal';

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { room, gameState, joinRoom } = useGame();

  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [is3D, setIs3D] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showContactDev, setShowContactDev] = useState<boolean>(false);
  const initialRoomAttempted = useRef<boolean>(false);

  // Helper to extract room code from URL (path /room/ABC123, hash #/room/ABC123, or ?room=ABC123)
  const getRoomCodeFromUrl = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;

    // 1. Check path e.g. /room/654321
    const pathMatch = window.location.pathname.match(/\/room\/([A-Za-z0-9]+)/i);
    if (pathMatch && pathMatch[1]) return pathMatch[1].toUpperCase();

    // 2. Check hash e.g. #/room/654321
    const hashMatch = window.location.hash.match(/#\/?room\/([A-Za-z0-9]+)/i);
    if (hashMatch && hashMatch[1]) return hashMatch[1].toUpperCase();

    // 3. Check query param e.g. ?room=654321
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) return roomParam.trim().toUpperCase();

    return null;
  }, []);

  // Handle URL deep link joining once user profile is ready
  useEffect(() => {
    if (isLoading || !user || initialRoomAttempted.current || room) return;

    const code = getRoomCodeFromUrl();
    if (code) {
      initialRoomAttempted.current = true;
      joinRoom(code).catch((err) => {
        console.warn('Auto join room from URL failed:', err);
      });
    }
  }, [user, isLoading, room, joinRoom, getRoomCodeFromUrl]);

  // Sync active room ID to URL (pushState / replaceState)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (room?.id) {
      const targetPath = `/room/${room.id}`;
      if (window.location.pathname !== targetPath && !window.location.hash.includes(room.id)) {
        window.history.replaceState(null, '', targetPath);
      }
    } else if (!room && window.location.pathname.startsWith('/room')) {
      window.history.replaceState(null, '', '/');
    }
  }, [room?.id]);

  const lastStartedRoomId = useRef<string | null>(null);

  // Automatically switch to 'game' page when a NEW game match starts
  useEffect(() => {
    if (gameState && gameState.roomId !== lastStartedRoomId.current) {
      lastStartedRoomId.current = gameState.roomId;
      setCurrentPage('game');
    } else if (!gameState) {
      lastStartedRoomId.current = null;
      if (currentPage === 'game') {
        setCurrentPage('home');
      }
    }
  }, [gameState, currentPage]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="text-6xl animate-bounce mb-3">🎲</div>
        <h2 className="text-3xl font-black font-gold tracking-tight">
          أملاك <span className="text-amber-300/90 font-semibold text-xl">وعقارات</span>
        </h2>
        <span className="text-xs text-slate-400 mt-2">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-950/40">
      {/* Top Navigation Bar with clear Page Tabs */}
      <TopBar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenRules={() => setShowRules(true)}
        onOpenContactDev={() => setShowContactDev(true)}
        is3D={is3D}
        setIs3D={setIs3D}
      />

      {/* Main Pages Router */}
      <main className="flex-1 flex flex-col items-center justify-start p-1 sm:p-2 md:p-3 w-full max-w-[1680px] mx-auto overflow-x-hidden">
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
              <HomePage 
                onNavigateToSettings={() => setCurrentPage('settings')} 
              />
            )}
          </>
        )}
      </main>
      
      {/* Global Modals */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <ContactDevModal isOpen={showContactDev} onClose={() => setShowContactDev(false)} />
    </div>
  );
};

export default App;
