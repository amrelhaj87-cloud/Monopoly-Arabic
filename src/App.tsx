import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useGame } from './context/GameContext';
import { TopBar } from './components/common/TopBar';
import { RulesModal } from './components/common/RulesModal';
import { FirebaseConfigModal } from './components/common/FirebaseConfigModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/auth/ProfileModal';
import { MainMenu } from './components/lobby/MainMenu';
import { CreateRoomModal } from './components/lobby/CreateRoomModal';
import { JoinRoomModal } from './components/lobby/JoinRoomModal';
import { RoomLobby } from './components/lobby/RoomLobby';
import { BoardView } from './components/board/BoardView';
import { PlayerListHUD } from './components/hud/PlayerListHUD';
import { GameLogDrawer } from './components/hud/GameLogDrawer';
import { GameChatDrawer } from './components/hud/GameChatDrawer';
import { PropertyBuyModal } from './components/modals/PropertyBuyModal';
import { AuctionModal } from './components/modals/AuctionModal';
import { ChanceCardModal } from './components/modals/ChanceCardModal';
import { TradeModal } from './components/modals/TradeModal';
import { ManagePropertiesModal } from './components/modals/ManagePropertiesModal';
import { PropertyDetailModal } from './components/modals/PropertyDetailModal';
import { WinnerModal } from './components/modals/WinnerModal';

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { room, gameState } = useGame();

  // View & Modals States
  const [is3D, setIs3D] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [showFirebaseConfig, setShowFirebaseConfig] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showManageProps, setShowManageProps] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="text-5xl animate-bounce mb-3">🎲</div>
        <h2 className="text-xl font-bold font-gold">مونوبولي العربية</h2>
        <span className="text-xs text-slate-400 mt-1">جاري تحميل لوحة اللعب...</span>
      </div>
    );
  }

  // If not logged in and no guest profile chosen yet, show AuthModal
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AuthModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-950/40">
      {/* Top Header Bar */}
      <TopBar
        is3D={is3D}
        setIs3D={setIs3D}
        onOpenRules={() => setShowRules(true)}
        onOpenFirebaseConfig={() => setShowFirebaseConfig(true)}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col p-2 sm:p-4 w-full max-w-7xl mx-auto">
        {!room && !gameState && (
          /* 1. Main Menu Screen */
          <MainMenu
            onOpenCreateRoom={() => setShowCreateRoom(true)}
            onOpenJoinRoom={() => setShowJoinRoom(true)}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {room && !gameState && (
          /* 2. Room Lobby Waiting Room */
          <RoomLobby />
        )}

        {gameState && (
          /* 3. In-Game Active Match Screen */
          <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full">
            {/* Left: Players Dashboard & Live History */}
            <div className="w-full lg:w-80 flex flex-col gap-3 order-2 lg:order-1">
              <PlayerListHUD />
              <GameLogDrawer />
              <GameChatDrawer />
            </div>

            {/* Center/Right: 40-Tile Monopoly Board */}
            <div className="flex-1 flex items-center justify-center order-1 lg:order-2 w-full">
              <BoardView
                is3D={is3D}
                onOpenManage={() => setShowManageProps(true)}
                onOpenTrade={() => setShowTradeModal(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Global & Game Modals */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <FirebaseConfigModal isOpen={showFirebaseConfig} onClose={() => setShowFirebaseConfig(false)} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <CreateRoomModal isOpen={showCreateRoom} onClose={() => setShowCreateRoom(false)} />
      <JoinRoomModal isOpen={showJoinRoom} onClose={() => setShowJoinRoom(false)} />

      {/* In-Game Action Modals */}
      <PropertyBuyModal />
      <AuctionModal />
      <ChanceCardModal />
      <TradeModal isOpen={showTradeModal} onClose={() => setShowTradeModal(false)} />
      <ManagePropertiesModal isOpen={showManageProps} onClose={() => setShowManageProps(false)} />
      <PropertyDetailModal />
      <WinnerModal />
    </div>
  );
};

export default App;
