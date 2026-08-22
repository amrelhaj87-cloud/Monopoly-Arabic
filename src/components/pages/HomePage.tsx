import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { AuthModal } from '../auth/AuthModal';
import { MainMenu } from '../lobby/MainMenu';
import { CreateRoomModal } from '../lobby/CreateRoomModal';
import { JoinRoomModal } from '../lobby/JoinRoomModal';
import { RulesModal } from '../common/RulesModal';
import { ar } from '../../locales/ar';

interface HomePageProps {
  onNavigateToSettings: () => void;
  onNavigateToAdTest: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToSettings, onNavigateToAdTest }) => {
  const { user } = useAuth();
  const [showCreateRoom, setShowCreateRoom] = React.useState(false);
  const [showJoinRoom, setShowJoinRoom] = React.useState(false);
  const [showRules, setShowRules] = React.useState(false);

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full py-4 animate-fadeIn">
      {!user ? (
        /* Player Initial Setup Card */
        <AuthModal isOpen={true} />
      ) : (
        /* Logged In Player Mode Hub */
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <MainMenu
            onOpenCreateRoom={() => setShowCreateRoom(true)}
            onOpenJoinRoom={() => setShowJoinRoom(true)}
            onOpenRules={() => setShowRules(true)}
          />
          
          <button
            onClick={onNavigateToAdTest}
            className="w-full max-w-xs px-4 py-3 bg-amber-600/20 hover:bg-amber-600/40 text-amber-200 border border-amber-600/50 rounded-xl font-bold transition-colors"
          >
            اختبار الإعلانات (Test Page)
          </button>
        </div>
      )}

      {/* Action Modals */}
      <CreateRoomModal isOpen={showCreateRoom} onClose={() => setShowCreateRoom(false)} />
      <JoinRoomModal isOpen={showJoinRoom} onClose={() => setShowJoinRoom(false)} />
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none flex flex-col gap-0.5">
        <p className="text-[10px] text-slate-500/60 font-medium">جميع الحقوق محفوظة ©</p>
        <p className="text-[10px] text-slate-500/60 font-medium">zerocold 2026</p>
      </div>
    </div>
  );
};
