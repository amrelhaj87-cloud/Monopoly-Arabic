import React, { useState, useEffect } from 'react';

interface Dice3DProps {
  dice: [number, number];
  isRolling: boolean;
  onRollClick?: () => void;
  canRoll?: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({ dice, isRolling, onRollClick, canRoll }) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isRolling) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 600);
      return () => clearTimeout(t);
    }
  }, [isRolling, dice]);

  const renderDiceFace = (value: number) => {
    // Large, crystal-clear high-contrast dot patterns
    const dotClasses = "rounded-full shadow-inner transition-transform";
    const blackDot = `${dotClasses} bg-slate-950 w-3.5 h-3.5 sm:w-4 sm:h-4`;
    const redDot = `${dotClasses} bg-red-600 w-5 h-5 sm:w-6 sm:h-6 shadow-md`;

    switch (value) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className={redDot} />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className={`${blackDot} self-start`} />
            <div className={`${blackDot} self-end`} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className={`${blackDot} self-start`} />
            <div className={`${blackDot} self-center`} />
            <div className={`${blackDot} self-end`} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className={blackDot} />
              <div className={blackDot} />
            </div>
            <div className="flex justify-between">
              <div className={blackDot} />
              <div className={blackDot} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2 relative">
            <div className="flex justify-between">
              <div className={blackDot} />
              <div className={blackDot} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={redDot} style={{ width: '14px', height: '14px' }} />
            </div>
            <div className="flex justify-between">
              <div className={blackDot} />
              <div className={blackDot} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className={blackDot} />
              <div className={blackDot} />
            </div>
            <div className="flex justify-between">
              <div className={blackDot} />
              <div className={blackDot} />
            </div>
            <div className="flex justify-between">
              <div className={blackDot} />
              <div className={blackDot} />
            </div>
          </div>
        );
      default:
        return <span className="font-mono text-3xl font-black text-slate-900">{value}</span>;
    }
  };

  const isDouble = dice[0] === dice[1];
  const total = dice[0] + dice[1];

  return (
    <div className="flex flex-col items-center justify-center my-2 select-none">
      {/* Dice Cubes Row */}
      <div
        onClick={canRoll ? onRollClick : undefined}
        className={`flex items-center gap-4 cursor-pointer p-2 rounded-2xl transition-all ${
          canRoll ? 'hover:scale-105 hover:bg-amber-500/10' : ''
        }`}
        title={canRoll ? 'انقر لرمي النرد' : undefined}
      >
        {/* Die 1 */}
        <div className="flex flex-col items-center gap-1">
          <div className={`dice-cube-large ${animating ? 'dice-rolling' : ''}`}>
            {renderDiceFace(dice[0])}
          </div>
          <span className="text-xs font-black font-mono bg-slate-900/90 text-amber-400 border border-slate-700 px-2 py-0.5 rounded-full shadow">
            {dice[0]}
          </span>
        </div>

        {/* Plus Symbol */}
        <span className="text-xl font-black text-slate-400">+</span>

        {/* Die 2 */}
        <div className="flex flex-col items-center gap-1">
          <div className={`dice-cube-large ${animating ? 'dice-rolling' : ''}`} style={{ animationDelay: '0.08s' }}>
            {renderDiceFace(dice[1])}
          </div>
          <span className="text-xs font-black font-mono bg-slate-900/90 text-amber-400 border border-slate-700 px-2 py-0.5 rounded-full shadow">
            {dice[1]}
          </span>
        </div>
      </div>

      {/* Dice Total Banner */}
      <div className="mt-1.5 flex items-center gap-2">
        <div className="bg-slate-950/90 border border-amber-500/40 px-3 py-1 rounded-full shadow flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-400">المجموع:</span>
          <span className="text-base font-black font-mono font-gold">{total}</span>
          <span className="text-[11px] text-slate-300">خطوات</span>
        </div>

        {isDouble && !animating && (
          <span className="text-xs font-black text-amber-300 bg-amber-950/90 border border-amber-500/70 px-3 py-1 rounded-full shadow animate-bounce">
            🔥 دبل ({dice[0]} + {dice[1]})!
          </span>
        )}
      </div>
    </div>
  );
};
