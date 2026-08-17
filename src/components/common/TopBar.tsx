import React, { useState } from 'react';
import { Volume2, VolumeX, BookOpen, Layers, Settings, LogOut, Share2, Copy, Check } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';

interface TopBarProps {
  is3D: boolean;
  setIs3D: (val: boolean) => void;
  onOpenRules: () => void;
  onOpenFirebaseConfig: () => void;
  onOpenProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  is3D,
  setIs3D,
  onOpenRules,
  onOpenFirebaseConfig,
  onOpenProfile
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
    <header className="w-full flex items-center justify-between px-4 py-3 glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎲</span>
        <div>
          <h1 className="text-lg font-extrabold font-gold tracking-wide leading-tight">مونوبولي العربية</h1>
          <span className="text-xs text-muted block">Monopoly Arabic</span>
        </div>
      </div>

      {/* Room Code Badge (if in room) */}
      {room && (
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-amber-500/30">
          <span className="text-xs text-amber-300 font-bold">كود الغرفة:</span>
          <span className="text-sm font-mono font-black text-white tracking-widest">{room.id}</span>
          <button 
            onClick={handleCopyRoomCode} 
            className="p-1 hover:text-amber-400 text-slate-300 transition-colors"
            title="نسخ كود الغرفة"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* 3D Perspective Toggle (In game only) */}
        {gameState && (
          <button
            onClick={() => setIs3D(!is3D)}
            className={`btn btn-sm ${is3D ? 'btn-gold' : 'btn-outline'}`}
            title="تبديل المنظور ثلاثي الأبعاد"
          >
            <Layers size={16} />
            <span className="hidden sm:inline">{is3D ? 'منظور 3D' : 'منظور 2D'}</span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={handleToggleSound}
          className="btn btn-outline btn-sm"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-emerald-400" />}
        </button>

        {/* Rulebook */}
        <button
          onClick={onOpenRules}
          className="btn btn-outline btn-sm"
          title="دليل وقواعد اللعبة"
        >
          <BookOpen size={16} />
          <span className="hidden md:inline">القواعد</span>
        </button>

        {/* Firebase Config Settings */}
        <button
          onClick={onOpenFirebaseConfig}
          className="btn btn-outline btn-sm"
          title="إعدادات السحابة و Firebase"
        >
          <Settings size={16} />
        </button>

        {/* User Profile / Avatar */}
        {user && (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
          >
            <span className="text-lg">{user.photoURL || '👳‍♂️'}</span>
            <span className="text-xs font-bold text-slate-200 hidden sm:inline">{user.displayName}</span>
          </button>
        )}

        {/* Leave Game / Room */}
        {room && (
          <button
            onClick={leaveRoom}
            className="btn btn-ruby btn-sm"
            title="مغادرة اللعبة"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">خروج</span>
          </button>
        )}
      </div>
    </header>
  );
};
