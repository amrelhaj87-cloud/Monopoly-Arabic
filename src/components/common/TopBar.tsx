import React, { useState } from 'react';
import { Volume2, VolumeX, Home, Settings, Layers, LogOut, Copy, Check, Gamepad2, Users, Sparkles, HelpCircle } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { PlayerBlob } from './PlayerBlob';

export type AppPage = 'home' | 'settings' | 'game';

interface TopBarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenRules: () => void;
  is3D: boolean;
  setIs3D: (val: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onNavigate,
  onOpenRules,
  is3D,
  setIs3D
}) => {
  const { user } = useAuth();
  const { room, gameState, leaveRoom } = useGame();
  const [isMuted, setIsMuted] = useState(audioService.getMuted());
  const [copied, setCopied] = useState(false);

  const handleToggleSound = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const handleCopyRoomCode = () => {
    if (room?.id) {
      navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header 
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '56px',
        padding: '0 16px',
        backgroundColor: 'rgba(4, 7, 15, 0.95)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
        zIndex: 50,
        boxSizing: 'border-box'
      }}
      className="backdrop-blur-md select-none shadow-md"
    >
      {/* Brand Title / Logo */}
      <div 
        onClick={() => onNavigate('home')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        className="hover:opacity-90 transition-opacity"
      >
        <span className="text-2xl filter drop-shadow">🎲</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-sm sm:text-base font-black font-gold tracking-wide leading-tight">
            مونوبولي العربية
          </span>
          <span className="text-[9px] text-amber-300/80 font-medium leading-none">
            لعبة التجارة والاستثمار
          </span>
        </div>
      </div>

      {/* Center Navigation Pills */}
      <nav 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          padding: '4px 6px',
          borderRadius: '12px',
          border: '1px solid rgba(51, 65, 85, 0.8)'
        }}
      >
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentPage === 'home'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home size={14} />
          <span>الرئيسية</span>
        </button>

        {gameState && (
          <button
            onClick={() => onNavigate('game')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentPage === 'game'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 size={14} />
            <span>المباراة</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentPage === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings size={14} />
          <span>الإعدادات</span>
        </button>
      </nav>

      {/* Action Controls & Room Code */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Room Code Badge */}
        {room && (
          <button
            onClick={handleCopyRoomCode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0f172a',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}
            className="hover:bg-slate-800 text-xs font-mono transition-colors"
            title="نسخ كود الغرفة"
          >
            <span className="text-[10px] text-amber-400 font-bold">كود:</span>
            <span className="text-white font-bold tracking-wider">{room.id}</span>
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-slate-400" />}
          </button>
        )}



        {/* User Profile Mini Badge */}
        {user && (
          <button
            onClick={() => onNavigate('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0f172a',
              padding: '3px 8px',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}
            className="hover:border-amber-500/60 transition-all cursor-pointer"
            title="الملف الشخصي والإعدادات"
          >
            <PlayerBlob color={user.color || '#f59e0b'} size="sm" />
            <span className="text-xs font-bold text-slate-200 hidden sm:inline truncate max-w-[90px]">
              {user.displayName}
            </span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={handleToggleSound}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '8px',
            backgroundColor: '#0f172a',
            border: '1px solid #334155'
          }}
          className="hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-emerald-400" />}
        </button>

        {/* How to Play / Rules */}
        <button
          onClick={onOpenRules}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '8px',
            backgroundColor: '#0f172a',
            border: '1px solid #334155'
          }}
          className="hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors"
          title="كيف تلعب (قواعد اللعبة)"
        >
          <HelpCircle size={15} />
        </button>

        {/* Leave Game Button */}
        {room && (
          <button
            onClick={() => {
              leaveRoom();
              onNavigate('home');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(225, 29, 72, 0.2)',
              border: '1px solid rgba(244, 63, 94, 0.5)',
              color: '#fecdd3'
            }}
            className="hover:bg-rose-600 hover:text-white text-xs font-bold transition-colors"
            title="مغادرة المباراة"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">خروج</span>
          </button>
        )}
      </div>
    </header>
  );
};
