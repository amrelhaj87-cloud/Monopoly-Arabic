import React, { useState } from 'react';
import { Volume2, VolumeX, Home, Settings, Layers, LogOut, Copy, Check, Gamepad2, Users, Sparkles, HelpCircle, MessageSquarePlus } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { PlayerBlob } from './PlayerBlob';
import { KofiButton } from './KofiButton';

export type AppPage = 'home' | 'game' | 'settings' | 'rooms';

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
    <header className="w-full bg-[#0a101d]/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 sm:px-6 sm:py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 z-50 sticky top-0 shadow-lg select-none">
      {/* Row 1 on Mobile / Left Section on Desktop: Brand Logo + Quick Actions */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
        {/* Brand Title / Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 flex items-center justify-center text-slate-950 font-black shadow-md border border-amber-300/60 group-hover:scale-105 transition-transform text-lg">
            🎲
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-wide leading-tight text-slate-100 flex items-center gap-1.5">
              <span>أملاك</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-bold text-xs sm:text-sm font-gold">وعقارات</span>
            </span>
            <span className="text-[9px] text-amber-200/80 font-medium leading-none">
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
              className="p-1 rounded-lg bg-[#0f172a] border border-slate-700 hover:border-amber-500/60 transition-all cursor-pointer"
              title={user.displayName}
            >
              <PlayerBlob color={user.color || '#f59e0b'} size="sm" />
            </button>
          )}

          {/* Audio */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-[#0f172a] border border-slate-700 hover:bg-slate-800 text-slate-300"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-amber-400" />}
          </button>

          {/* Help */}
          <button
            onClick={onOpenRules}
            className="p-1.5 rounded-lg bg-[#0f172a] border border-slate-700 hover:bg-slate-800 text-amber-400 cursor-pointer"
            title="قواعد اللعبة"
          >
            <HelpCircle size={14} />
          </button>

          {/* Ko-fi Button */}
          <KofiButton username="zerocold" />
        </div>
      </div>

      {/* Center Navigation Pills (Row 2 on Mobile / Center on Desktop) */}
      <nav className="flex items-center justify-center gap-1.5 bg-[#0f172a]/90 p-1 rounded-xl border border-slate-800 w-full sm:w-auto max-w-sm sm:max-w-none">
        <button
          onClick={() => onNavigate('home')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentPage === 'home'
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home size={14} />
          <span>الرئيسية</span>
        </button>

        {gameState && (
          <button
            onClick={() => onNavigate('game')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentPage === 'game'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 size={14} />
            <span>المباراة</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('settings')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentPage === 'settings'
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings size={14} />
          <span>الإعدادات</span>
        </button>

        {/* Room Code on Mobile inline with nav */}
        {room && (
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1 bg-[#0b1222]/80 px-2 py-1.5 rounded-lg text-[10px] font-mono sm:hidden border border-slate-800"
            title="نسخ كود الغرفة"
          >
            <span className="text-amber-400 font-bold">الغرفة:</span>
            <span className="text-white font-bold">{room.id}</span>
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} className="text-slate-400" />}
          </button>
        )}
      </nav>

      {/* Desktop Action Controls (Hidden on Mobile, Shown on sm:) */}
      <div className="hidden sm:flex items-center gap-1.5">
        {/* Room Code Badge */}
        {room && (
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1.5 bg-[#0b1222]/80 hover:bg-[#0f172a] border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
            title="نسخ كود الغرفة"
          >
            <span className="text-[10px] text-amber-400 font-bold">الغرفة:</span>
            <span className="text-white font-bold tracking-wider">{room.id}</span>
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-slate-400" />}
          </button>
        )}

        {/* User Profile Mini Badge */}
        {user && (
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-1.5 bg-[#0f172a] border border-slate-700 hover:border-amber-500/60 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
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
          className="p-1.5 rounded-lg bg-[#0f172a] border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-amber-400" />}
        </button>

        {/* How to Play / Rules */}
        <button
          onClick={onOpenRules}
          className="p-1.5 rounded-lg bg-[#0f172a] border border-slate-700 hover:bg-slate-800 text-amber-400 cursor-pointer"
          title="كيف تلعب (قواعد اللعبة)"
        >
          <HelpCircle size={15} />
        </button>

        {/* Contact Developer Button */}
        <button
          onClick={onOpenContactDev}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-slate-700 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-all cursor-pointer"
          title="تواصل مع المطور (اقتراح / استفسار / مشكلة)"
        >
          <MessageSquarePlus size={14} />
          <span className="hidden md:inline">مراسلة المطور</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-300 hover:bg-rose-900 hover:text-rose-100 text-xs font-bold transition-colors cursor-pointer"
            title="مغادرة المباراة"
          >
            <span>خروج</span>
            <LogOut size={13} className="rotate-180" />
          </button>
        )}
      </div>
    </header>
  );
};
