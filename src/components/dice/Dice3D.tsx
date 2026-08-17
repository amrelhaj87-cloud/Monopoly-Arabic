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

  const renderDots = (value: number) => {
    // 1 to 6 dot representations
    switch (value) {
      case 1:
        return <div className="w-3 h-3 bg-red-600 rounded-full shadow-inner" />;
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-1">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full self-start" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-1">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full self-start" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full self-center" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-1 gap-1 place-items-center">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 p-1 place-items-center">
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div />
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            <div />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 p-1 gap-0.5 place-items-center">
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
          </div>
        );
      default:
        return <span className="font-mono text-xl font-black">{value}</span>;
    }
  };

  const isDouble = dice[0] === dice[1];

  return (
    <div className="flex flex-col items-center justify-center my-2">
      <div 
        onClick={canRoll ? onRollClick : undefined}
        className={`dice-container cursor-pointer select-none ${canRoll ? 'hover:scale-105 transition-transform' : ''}`}
        title={canRoll ? 'انقر لرمي النرد' : undefined}
      >
        <div className={`dice-cube ${animating ? 'dice-rolling' : ''}`}>
          {renderDots(dice[0])}
        </div>
        <div className={`dice-cube ${animating ? 'dice-rolling' : ''}`} style={{ animationDelay: '0.1s' }}>
          {renderDots(dice[1])}
        </div>
      </div>

      {isDouble && !animating && (
        <span className="text-[11px] font-black text-amber-400 bg-amber-950/70 border border-amber-500/50 px-2 py-0.5 rounded-full mt-1 animate-bounce">
          🔥 رمية دبل متطابقة!
        </span>
      )}
    </div>
  );
};
