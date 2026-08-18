import React, { useState } from 'react';
import { Volume2, VolumeX, Home, Settings, Layers, LogOut, Copy, Check, Gamepad2, Users, Sparkles } from 'lucide-react';
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
    <header className="w-full h-14 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-6 flex items-center justify-between z-50 select-none shadow-md">
      {/* Brand Title / Logo */}
      <div 
        onClick={() => onNavigate('home')} 
        className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <span className="text-2xl filter drop-shadow">🎲</span>
        <div className="flex flex-col">
          <span className="text-sm sm:text-base font-black font-gold tracking-wide leading-tight">
            مونوبولي العربية
          </span>
          <span className="text-[9px] text-amber-300/60 font-mono leading-none">
            Richup Arabic
          </span>
        </div>
      </div>

      {/* Center Navigation Pills */}
      <nav className="flex items-center gap-1 bg-slate-900/95 p-1 rounded-xl border border-slate-800 shadow-inner">
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
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Room Code Badge */}
        {room && (
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-amber-500/30 text-xs font-mono transition-colors"
            title="نسخ كود الغرفة"
          >
            <span className="text-[10px] text-amber-400 font-bold">كود:</span>
            <span className="text-white font-bold tracking-wider">{room.id}</span>
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-slate-400" />}
          </button>
        )}

        {/* 3D / 2D Perspective Button */}
        {gameState && currentPage === 'game' && (
          <button
            onClick={() => setIs3D(!is3D)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
              is3D 
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="تبديل المنظور ثلاثي الأبعاد"
          >
            <Layers size={14} />
            <span>{is3D ? '3D' : '2D'}</span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-emerald-400" />}
        </button>

        {/* Leave Game Button */}
        {room && (
          <button
            onClick={() => {
              leaveRoom();
              onNavigate('home');
            }}
            className="flex items-center gap-1 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
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
