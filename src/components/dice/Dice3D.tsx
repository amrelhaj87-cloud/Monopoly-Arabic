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
        className={`relative flex items-center justify-center gap-4 px-8 py-5 rounded-[24px] transition-all mb-4 ${
          canRoll
            ? 'cursor-pointer hover:bg-[#131d38] active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.15)] bg-[#0f172a] border-2 border-amber-500/80'
            : 'bg-[#0f172a]/80 border-2 border-amber-500/30'
        }`}
        title={canRoll ? 'انقر هنا لرمي النرد!' : undefined}
      >
        {/* Die 1 */}
        <div className="flex flex-col items-center gap-2">
          <div 
            className={`dice-cube-large ${canRoll ? 'dice-clickable' : ''} ${
              animating ? 'dice-rolling-1' : ''
            }`}
          >
            {renderDiceFace(val1)}
          </div>
          <div className="w-4 h-6 border border-amber-500/50 rounded-full flex items-center justify-center bg-[#080c17]">
            <span className="text-[10px] font-black text-amber-500 font-mono">{val1}</span>
          </div>
        </div>

        {/* Plus Symbol */}
        <span className="text-xl font-black text-amber-500 drop-shadow-sm mb-6">+</span>

        {/* Die 2 */}
        <div className="flex flex-col items-center gap-2">
          <div 
            className={`dice-cube-large ${canRoll ? 'dice-clickable' : ''} ${
              animating ? 'dice-rolling-2' : ''
            }`}
          >
            {renderDiceFace(val2)}
          </div>
          <div className="w-4 h-6 border border-amber-500/50 rounded-full flex items-center justify-center bg-[#080c17]">
            <span className="text-[10px] font-black text-amber-500 font-mono">{val2}</span>
          </div>
        </div>

        {/* Overlapping Bottom Badges */}
        {!animating && (
          <div className="absolute -bottom-3.5 left-0 right-0 flex items-center justify-center gap-2">
            {isDouble && (
              <div className="bg-gradient-to-r from-red-600 to-rose-600 border border-amber-400 px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1.5 text-[11px] font-black text-white animate-bounce-gentle z-10">
                <Flame size={12} className="text-yellow-300 animate-pulse" />
                <span>دبل ({val1} + {val2})!</span>
              </div>
            )}
            
            <div className="bg-[#0f172a] border border-amber-500/80 px-4 py-0.5 rounded-full shadow-lg flex items-center gap-1.5 text-[11px] font-bold z-10">
              <span className="text-slate-300">المجموع:</span>
              <span className="text-sm font-black font-mono text-amber-400 drop-shadow">
                {total}
              </span>
              <span className="text-slate-300">خطوات</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
