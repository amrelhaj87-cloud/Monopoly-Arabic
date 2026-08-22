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
    <header className="w-full bg-[#0a0f1c] select-none z-50 px-3 sm:px-4 py-2 sm:py-0 sm:h-14 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 box-border border-b border-white/5 shadow-md">
      {/* Row 1 on Mobile / Left Section on Desktop: Brand Logo + Quick Actions */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
        {/* Brand Title / Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center shadow-md">
            <span className="text-xl filter drop-shadow leading-none">🎲</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-white tracking-wide leading-tight">
              أملاك <span className="text-amber-400 font-semibold text-xs sm:text-sm">وعقارات</span>
            </span>
            <span className="text-[8px] sm:text-[9px] text-amber-400/80 font-medium leading-none">
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
              className="p-1 rounded-lg bg-[#1a233a] hover:bg-[#23304c] transition-all cursor-pointer"
              title={user.displayName}
            >
              <PlayerBlob color={user.color || '#f59e0b'} size="sm" />
            </button>
          )}

          {/* Audio */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-[#1a233a] hover:bg-[#23304c] text-amber-400 transition-colors"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} />}
          </button>

          {/* Help */}
          <button
            onClick={onOpenRules}
            className="p-1.5 rounded-lg bg-[#1a233a] hover:bg-[#23304c] text-amber-400 transition-colors cursor-pointer"
            title="قواعد اللعبة"
          >
            <HelpCircle size={14} />
          </button>

          {/* Contact Dev */}
          <button
            onClick={onOpenContactDev}
            className="p-1.5 rounded-lg bg-[#1a233a] hover:bg-[#23304c] text-amber-400 transition-colors cursor-pointer"
            title="تواصل مع المطور"
          >
            <MessageSquarePlus size={14} />
          </button>

          {/* Ko-fi Button */}
          <KofiButton username="zerocold" />
        </div>
      </div>

      {/* Center Navigation Pills (Row 2 on Mobile / Center on Desktop) */}
      <nav className="flex items-center justify-center gap-2 w-full sm:w-auto max-w-sm sm:max-w-none">
        <button
          onClick={() => onNavigate('home')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            currentPage === 'home'
              ? 'bg-[#f59e0b] text-[#0f172a] shadow-md'
              : 'bg-[#1a233a] text-slate-300 hover:text-white hover:bg-[#23304c]'
          }`}
        >
          <Home size={13} />
          <span>الرئيسية</span>
        </button>

        {gameState && (
          <button
            onClick={() => onNavigate('game')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentPage === 'game'
                ? 'bg-[#f59e0b] text-[#0f172a] shadow-md'
                : 'bg-[#1a233a] text-slate-300 hover:text-white hover:bg-[#23304c]'
            }`}
          >
            <Gamepad2 size={13} />
            <span>المباراة</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('settings')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            currentPage === 'settings'
              ? 'bg-[#f59e0b] text-[#0f172a] shadow-md'
              : 'bg-[#1a233a] text-slate-300 hover:text-white hover:bg-[#23304c]'
          }`}
        >
          <Settings size={13} />
          <span>الإعدادات</span>
        </button>

        {/* Room Code on Mobile inline with nav */}
        {room && (
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1 bg-[#1a233a] px-2 py-1.5 rounded-lg text-[10px] font-mono sm:hidden"
            title="نسخ كود الغرفة"
          >
            <span className="text-amber-400 font-bold">الغرفة :</span>
            <span className="text-white font-bold">{room.id}</span>
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} className="text-slate-400" />}
          </button>
        )}
      </nav>

      {/* Desktop Action Controls (Hidden on Mobile, Shown on sm:) */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Room Code Badge */}
        {room && (
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center gap-1.5 bg-[#1a233a] hover:bg-[#23304c] px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
            title="نسخ كود الغرفة"
          >
            <span className="text-[10px] text-amber-400 font-bold">الغرفة :</span>
            <span className="text-white font-bold tracking-wider">{room.id}</span>
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-slate-400" />}
          </button>
        )}

        {/* User Profile Mini Badge */}
        {user && (
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-1.5 bg-[#1a233a] hover:bg-[#23304c] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
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
          className="p-1.5 rounded-lg bg-[#1a233a] hover:bg-[#23304c] text-amber-400 hover:text-amber-300 transition-colors"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} />}
        </button>

        {/* How to Play / Rules */}
        <button
          onClick={onOpenRules}
          className="p-1.5 rounded-lg bg-[#1a233a] hover:bg-[#23304c] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          title="كيف تلعب (قواعد اللعبة)"
        >
          <HelpCircle size={15} />
        </button>

        {/* Contact Developer Button */}
        <button
          onClick={onOpenContactDev}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a233a] hover:bg-[#23304c] text-amber-400 hover:text-amber-300 text-xs font-bold transition-all cursor-pointer"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4c1d24] text-rose-200 hover:bg-[#6b2832] hover:text-white text-xs font-bold transition-colors"
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
