import React, { useState } from 'react';
import { Volume2, VolumeX, Home, Settings, Layers, LogOut, Copy, Check, Gamepad2, Users } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';

export type AppPage = 'home' | 'settings' | 'game';

interface TopBarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  is3D: boolean;
  setIs3D: (val: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onNavigate,
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
    <header className="w-full flex items-center justify-between px-3 sm:px-6 py-3 glass-panel border-b border-slate-700/80 shadow-lg" style={{ borderRadius: 0 }}>
      {/* Brand Title (Click to Go Home) */}
      <div 
        onClick={() => onNavigate('home')} 
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity select-none"
      >
        <span className="text-3xl">🎲</span>
        <div>
          <h1 className="text-base sm:text-xl font-black font-gold tracking-wide leading-tight">
            مونوبولي العربية
          </h1>
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold block">
            Monopoly Arabic
          </span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => onNavigate('home')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
            currentPage === 'home'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Home size={15} />
          <span className="hidden sm:inline">الرئيسية</span>
        </button>

        {gameState && (
          <button
            onClick={() => onNavigate('game')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              currentPage === 'game'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Gamepad2 size={15} />
            <span>اللعبة</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('settings')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
            currentPage === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings size={15} />
          <span className="hidden sm:inline">الإعدادات والملف</span>
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Room Code Badge (if in active room) */}
        {room && (
          <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-xl border border-amber-500/40">
            <span className="text-[10px] text-amber-300 font-bold">كود:</span>
            <span className="text-xs font-mono font-black text-white tracking-widest">{room.id}</span>
            <button 
              onClick={handleCopyRoomCode} 
              className="p-1 hover:text-amber-400 text-slate-300 transition-colors"
              title="نسخ كود الغرفة"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>
        )}

        {/* 3D Perspective Toggle (In game only) */}
        {gameState && currentPage === 'game' && (
          <button
            onClick={() => setIs3D(!is3D)}
            className={`btn btn-sm ${is3D ? 'btn-gold' : 'btn-outline'}`}
            title="تبديل المنظور ثلاثي الأبعاد"
          >
            <Layers size={15} />
            <span className="hidden lg:inline">{is3D ? '3D' : '2D'}</span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={handleToggleSound}
          className="btn btn-outline btn-sm px-2.5"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-emerald-400" />}
        </button>

        {/* Leave Game / Room Button */}
        {room && (
          <button
            onClick={() => {
              leaveRoom();
              onNavigate('home');
            }}
            className="btn btn-ruby btn-sm px-3"
            title="مغادرة المباراة"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">خروج</span>
          </button>
        )}
      </div>
    </header>
  );
};
