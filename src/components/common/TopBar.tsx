import React, { useState } from 'react';
import { Volume2, VolumeX, Home, Settings, Layers, LogOut, Copy, Check, Gamepad2, Users, Sparkles, HelpCircle, MessageSquarePlus } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { PlayerBlob } from './PlayerBlob';
import { KofiButton } from './KofiButton';

export type AppPage = 'home' | 'settings' | 'game';

interface TopBarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenRules: () => void;
  onOpenContactDev: () => void;
  is3D: boolean;
  setIs3D: (val: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onNavigate,
  onOpenRules,
  onOpenContactDev,
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
    <header className="w-full bg-slate-950/95 border-b border-amber-500/30 backdrop-blur-md select-none shadow-md z-50 px-3 sm:px-4 py-2 sm:py-0 sm:h-14 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 box-border">
      {/* Row 1 on Mobile / Left Section on Desktop: Brand Logo + Quick Actions */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
        {/* Brand Title / Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="text-xl sm:text-2xl filter drop-shadow">🎲</span>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black font-gold tracking-wide leading-tight">
              مونوبولي العربية
            </span>
            <span className="text-[8px] sm:text-[9px] text-amber-300/80 font-medium leading-none">
              لعبة التجارة والاستثمار
            </span>
          </div>
        </div>

        {/* Action Controls on Mobile (Right Side of Row 1) */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* User Profile Blob */}
          {user && (
            <button
              onClick={() => onNavigate('settings')}
              className="p-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500/60 transition-all cursor-pointer"
              title={user.displayName}
            >
              <PlayerBlob color={user.color || '#f59e0b'} size="sm" />
            </button>
          )}

          {/* Audio */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-emerald-400" />}
          </button>

          {/* Help */}
          <button
            onClick={onOpenRules}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-amber-400 transition-colors cursor-pointer"
            title="قواعد اللعبة"
          >
            <HelpCircle size={14} />
          </button>

          {/* Contact Dev */}
          <button
            onClick={onOpenContactDev}
            className="p-1.5 rounded-lg bg-slate-900 border border-sky-500/40 hover:bg-slate-800 text-sky-400 transition-colors cursor-pointer"
            title="تواصل مع المطور"
          >
            <MessageSquarePlus size={14} />
          </button>

          {/* Ko-fi Button */}
          <KofiButton username="zerocold" />
        </div>
      </div>

      {/* Center Navigation Pills (Row 2 on Mobile / Center on Desktop) */}
      <nav className="flex items-center justify-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 w-full sm:w-auto max-w-sm sm:max-w-none">
        <button
          onClick={() => onNavigate('home')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentPage === 'home'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home size={13} />
          <span>الرئيسية</span>
        </button>

        {gameState && (
          <button
            onClick={() => onNavigate('game')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentPage === 'game'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 size={13} />
            <span>المباراة</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('settings')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentPage === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings size={13} />
          <span>الإعدادات</span>
        </button>

        {/* Room Code on Mobile inline with nav */}
        {room && (
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold sm:hidden"
            title="نسخ كود الغرفة"
          >
            <span>{room.id}</span>
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          </button>
        )}
      </nav>

      {/* Desktop Action Controls (Hidden on Mobile, Shown on sm:) */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Room Code Badge */}
        {room && (
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-lg border border-amber-500/40 text-xs font-mono transition-colors"
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
            className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-amber-500/60 transition-all cursor-pointer"
            title="الملف الشخصي والإعدادات"
          >
            <PlayerBlob color={user.color || '#f59e0b'} size="sm" />
            <span className="text-xs font-bold text-slate-200 truncate max-w-[90px]">
              {user.displayName}
            </span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-emerald-400" />}
        </button>

        {/* How to Play / Rules */}
        <button
          onClick={onOpenRules}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          title="كيف تلعب (قواعد اللعبة)"
        >
          <HelpCircle size={15} />
        </button>

        {/* Contact Developer Button */}
        <button
          onClick={onOpenContactDev}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-sky-500/40 hover:bg-slate-800 text-sky-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          title="تواصل مع المطور (اقتراح / استفسار / مشكلة)"
        >
          <MessageSquarePlus size={14} className="text-sky-400" />
          <span className="hidden md:inline">تواصل مع المطور</span>
        </button>

        {/* Ko-fi Support Button */}
        <KofiButton username="zerocold" />

        {/* Leave Game Button */}
        {room && (
          <button
            onClick={() => {
              leaveRoom();
              onNavigate('home');
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-200 hover:bg-rose-600 hover:text-white text-xs font-bold transition-colors"
            title="مغادرة المباراة"
          >
            <LogOut size={13} />
            <span>خروج</span>
          </button>
        )}
      </div>
    </header>
  );
};
