import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Flame } from 'lucide-react';

interface Dice3DProps {
  dice: [number, number];
  isRolling?: boolean;
  onRollClick?: () => void;
  canRoll?: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({ 
  dice, 
  isRolling = false, 
  onRollClick, 
  canRoll = false 
}) => {
  const [animating, setAnimating] = useState(false);
  const [displayValues, setDisplayValues] = useState<[number, number]>(dice);
  const prevDiceRef = useRef<[number, number]>(dice);

  // Trigger animation whenever dice changes OR when isRolling is true
  useEffect(() => {
    const hasChanged = prevDiceRef.current[0] !== dice[0] || prevDiceRef.current[1] !== dice[1];
    prevDiceRef.current = dice;

    if (isRolling || hasChanged) {
      setAnimating(true);
      
      // Fast lightweight rapid tumble interval (60ms)
      const interval = setInterval(() => {
        setDisplayValues([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
        ]);
      }, 60);

      // Settle smoothly on real values at 480ms
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setDisplayValues(dice);
        setAnimating(false);
      }, 480);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setDisplayValues(dice);
    }
  }, [dice, isRolling]);

  const renderDiceFace = (value: number) => {
    switch (value) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="dice-dot-red" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2.5">
            <div className="dice-dot-black self-start" />
            <div className="dice-dot-black self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2.5">
            <div className="dice-dot-black self-start" />
            <div className="dice-dot-black self-center" />
            <div className="dice-dot-black self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2.5">
            <div className="flex justify-between">
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
            <div className="flex justify-between">
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2.5 relative">
            <div className="flex justify-between">
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="dice-dot-red w-4 h-4" />
            </div>
            <div className="flex justify-between">
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
            <div className="flex justify-between">
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
            <div className="flex justify-between">
              <div className="dice-dot-black" />
              <div className="dice-dot-black" />
            </div>
          </div>
        );
      default:
        return <span className="text-2xl font-black text-slate-900">{value}</span>;
    }
  };

  const val1 = displayValues[0] || 1;
  const val2 = displayValues[1] || 1;
  const isDouble = val1 === val2;
  const total = val1 + val2;

  return (
    <div className="flex flex-col items-center justify-center my-1 select-none">
      {/* Dice Cubes Interactive Area */}
      <div
        onClick={canRoll && !animating ? onRollClick : undefined}
        className={`flex items-center gap-3.5 px-4 py-2 rounded-2xl transition-all ${
          canRoll
            ? 'cursor-pointer hover:bg-slate-900/90 active:scale-95 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20 bg-slate-950/80'
            : 'bg-slate-950/50'
        } border border-slate-700/60`}
        title={canRoll ? 'انقر هنا لرمي النرد!' : undefined}
      >
        {/* Die 1 */}
        <div className="flex flex-col items-center gap-1.5">
          <div 
            className={`dice-cube-large ${canRoll ? 'dice-clickable' : ''} ${
              animating ? 'dice-rolling-1' : ''
            }`}
          >
            {renderDiceFace(val1)}
          </div>
          <span className="text-xs font-mono font-black bg-slate-950 text-amber-400 border border-amber-500/60 px-2.5 py-0.5 rounded-full shadow-sm">
            {val1}
          </span>
        </div>

        {/* Plus Symbol */}
        <span className="text-xl font-black text-amber-400/80 drop-shadow-sm">+</span>

        {/* Die 2 */}
        <div className="flex flex-col items-center gap-1.5">
          <div 
            className={`dice-cube-large ${canRoll ? 'dice-clickable' : ''} ${
              animating ? 'dice-rolling-2' : ''
            }`}
          >
            {renderDiceFace(val2)}
          </div>
          <span className="text-xs font-mono font-black bg-slate-950 text-amber-400 border border-amber-500/60 px-2.5 py-0.5 rounded-full shadow-sm">
            {val2}
          </span>
        </div>
      </div>

      {/* Dice Result / Total Steps Banner */}
      <div className="mt-2.5 flex items-center gap-2 flex-wrap justify-center">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/70 px-4 py-1 rounded-full shadow-md flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-400">المجموع:</span>
          <span className="text-base font-black font-mono text-amber-300 drop-shadow">
            {total}
          </span>
          <span className="text-slate-300">خطوات</span>
        </div>

        {/* Doubles Flare */}
        {isDouble && !animating && (
          <div className="bg-gradient-to-r from-amber-600 to-rose-600 border border-amber-300 px-3 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs font-black text-white animate-bounce-gentle">
            <Flame size={14} className="text-yellow-300 animate-pulse" />
            <span>دبل ({val1} + {val2})!</span>
          </div>
        )}
      </div>
    </div>
  );
};
