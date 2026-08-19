import React from 'react';
import { PlayerTokenId } from '../../types/game';
import { GAME_TOKENS } from '../../constants/tokens';

interface PlayerBlobProps {
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'pawn';
  token?: PlayerTokenId | string;
  emoji?: string;
  className?: string;
}

export const PlayerBlob: React.FC<PlayerBlobProps> = ({ 
  color = '#f59e0b', 
  size = 'md', 
  token, 
  emoji,
  className = ''
}) => {
  // Resolve display emoji from token or explicit emoji
  const matchedToken = token ? GAME_TOKENS.find(t => t.id === token) : null;
  const displayEmoji = emoji || matchedToken?.emoji || (token && !matchedToken ? token : '👑');

  if (size === 'pawn') {
    return (
      <div
        className={`relative rounded-full flex items-center justify-center select-none shrink-0 transition-transform ${className}`}
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: color,
          border: '2px solid rgba(255, 255, 255, 0.95)',
          boxShadow: `0 3px 8px rgba(0,0,0,0.6), 0 0 10px ${color}80, inset 0 2px 4px rgba(255,255,255,0.4)`
        }}
      >
        <span className="text-[12px] leading-none filter drop-shadow-sm pointer-events-none">
          {displayEmoji}
        </span>
      </div>
    );
  }

  const dimensions = {
    sm: { box: 'w-6 h-6', text: 'text-xs', border: 'border-[1.5px]' },
    md: { box: 'w-10 h-10', text: 'text-lg', border: 'border-2' },
    lg: { box: 'w-16 h-16', text: 'text-2xl', border: 'border-[2.5px]' },
    xl: { box: 'w-20 h-20', text: 'text-3xl', border: 'border-3' },
  }[size] || { box: 'w-10 h-10', text: 'text-lg', border: 'border-2' };

  return (
    <div
      className={`relative ${dimensions.box} rounded-full flex items-center justify-center select-none shrink-0 transition-all ${dimensions.border} border-white/80 shadow-md ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: `0 4px 14px rgba(0,0,0,0.4), 0 0 14px ${color}60, inset 0 2px 6px rgba(255,255,255,0.45)`
      }}
    >
      {/* 3D Gloss Highlight Overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-transparent to-black/25 pointer-events-none" />

      {/* Token Emoji / Icon */}
      <span className={`${dimensions.text} relative z-10 filter drop-shadow leading-none`}>
        {displayEmoji}
      </span>
    </div>
  );
};
