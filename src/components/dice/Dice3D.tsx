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
        onClick={canRoll && !animating && !isRolling ? onRollClick : undefined}
        className={`flex items-center gap-2.5 p-2 rounded-2xl transition-all ${
          canRoll && !animating && !isRolling
            ? 'cursor-pointer hover:bg-slate-900/90 active:scale-95 ring-2 ring-amber-400/80 shadow-xl shadow-amber-500/25 bg-[#0f172a] animate-pulse-glow'
            : 'bg-[#0b1222]/80 border border-slate-800'
        }`}
        title={canRoll && !animating && !isRolling ? 'انقر هنا لرمي النرد!' : undefined}
      >
        {/* Die 1 */}
        <div 
          className={`dice-cube-large ${canRoll && !animating && !isRolling ? 'dice-clickable' : ''} ${
            animating ? 'dice-rolling-1' : ''
          }`}
        >
          {renderDiceFace(val1)}
        </div>

        {/* Die 2 */}
        <div 
          className={`dice-cube-large ${canRoll && !animating && !isRolling ? 'dice-clickable' : ''} ${
            animating ? 'dice-rolling-2' : ''
          }`}
        >
          {renderDiceFace(val2)}
        </div>
      </div>
    </div>
  );
};
