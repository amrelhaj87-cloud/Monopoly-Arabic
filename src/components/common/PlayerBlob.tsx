import React from 'react';

interface PlayerBlobProps {
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'pawn';
}

export const PlayerBlob: React.FC<PlayerBlobProps> = ({ color, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    pawn: 'w-6 h-6 border-[1.5px] border-white/80 shadow-[0_3px_6px_rgba(0,0,0,0.5)]'
  };

  const eyeSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    pawn: 'w-1.5 h-1.5'
  };

  const pupilSize = {
    sm: 'w-0.5 h-0.5',
    md: 'w-1 h-1',
    lg: 'w-1.5 h-1.5',
    pawn: 'w-0.5 h-0.5'
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative shadow-inner`}
      style={{ backgroundColor: color }}
    >
      {/* Eyes */}
      <div className="flex gap-0.5 mt-1">
        <div className={`${eyeSize[size]} bg-white rounded-full flex items-center justify-center`}>
          <div className={`${pupilSize[size]} bg-black rounded-full translate-x-[0.5px]`}></div>
        </div>
        <div className={`${eyeSize[size]} bg-white rounded-full flex items-center justify-center`}>
          <div className={`${pupilSize[size]} bg-black rounded-full translate-x-[0.5px]`}></div>
        </div>
      </div>
    </div>
  );
};
