import React from 'react';
import { Dice3D } from '../dice/Dice3D';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Dices, ArrowRight, Home, Handshake, Lock, Clock } from 'lucide-react';

interface BoardCenterProps {
  onOpenManage: () => void;
  onOpenTrade: () => void;
}

export const BoardCenter: React.FC<BoardCenterProps> = ({ onOpenManage, onOpenTrade }) => {
  const { 
    gameState, 
    currentPlayer, 
    myPlayer, 
    isMyTurn, 
    rollDice, 
    endCurrentTurn,
    payJailBail,
    useJailCard
  } = useGame();

  if (!gameState || !currentPlayer) return null;

  const canRoll = isMyTurn && !gameState.hasRolled && (gameState.phase === 'roll_dice' || gameState.phase === 'jail_decision');
  const canEndTurn = isMyTurn && gameState.hasRolled && gameState.phase === 'idle';

  return (
    <div className="board-center-stage select-none">
      {/* Center Top: Free Parking Jackpot or Brand */}
      <div className="flex items-center justify-between w-full px-3 py-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🎲</span>
          <span className="font-gold font-black text-sm sm:text-base">مونوبولي العربية</span>
        </div>

        {gameState.settings.freeParkingJackpot && (
          <div className="bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-lg text-right">
            <span className="text-[9px] text-amber-300 block">حوض الموقف المجاني:</span>
            <span className="text-xs font-mono font-bold text-amber-400">{gameState.freeParkingPool} ريال</span>
          </div>
        )}
      </div>

      {/* Current Turn Notification Card */}
      <div 
        className="my-1.5 px-4 py-2 rounded-xl flex items-center justify-between w-full max-w-xs border shadow-md transition-all"
        style={{
          backgroundColor: `${currentPlayer.color}25`,
          borderColor: currentPlayer.color
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentPlayer.avatar}</span>
          <div>
            <span className="text-[10px] text-slate-300 block">الدور الحالي:</span>
            <span className="text-xs sm:text-sm font-bold text-white">
              {currentPlayer.name} {isMyTurn && '(أنت)'}
            </span>
          </div>
        </div>

        {/* Turn Timer Badge */}
        {gameState.settings.turnTimeSeconds > 0 && (
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-700">
            <Clock size={12} />
            <span>{gameState.remainingTurnTime}ث</span>
          </div>
        )}
      </div>

      {/* 3D Dice Display */}
      <Dice3D 
        dice={gameState.dice} 
        isRolling={false} 
        onRollClick={canRoll ? rollDice : undefined}
        canRoll={canRoll}
      />

      {/* In-Jail Warning & Options for Active Player */}
      {currentPlayer.inJail && isMyTurn && (
        <div className="w-full max-w-xs bg-rose-950/70 border border-rose-500/50 p-2 rounded-xl text-center mb-2 text-xs">
          <span className="text-rose-200 font-bold block mb-1">
            🔒 أنت في السجن! (الدور {currentPlayer.jailTurns + 1}/3)
          </span>
          <div className="flex gap-1.5 justify-center mt-1">
            {myPlayer && myPlayer.cash >= 50 && (
              <button onClick={payJailBail} className="btn btn-ruby btn-sm py-1 text-[10px]">
                دفع كفالة (50)
              </button>
            )}
            {myPlayer && myPlayer.getOutOfJailCards > 0 && (
              <button onClick={useJailCard} className="btn btn-gold btn-sm py-1 text-[10px]">
                استخدام بطاقة عفو
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-1 w-full max-w-sm">
        {/* Roll Dice Button */}
        {canRoll && (
          <button onClick={rollDice} className="btn btn-gold btn-lg w-full shadow-lg animate-pulse">
            <Dices size={20} />
            ارمِ النرد! 🎲
          </button>
        )}

        {/* End Turn Button */}
        {canEndTurn && (
          <button onClick={endCurrentTurn} className="btn btn-emerald btn-lg w-full shadow-lg">
            <ArrowRight size={20} />
            إنهاء دورك وتمريره للخصم 👉
          </button>
        )}

        {/* Action Controls for Real Player (Manage & Trade) */}
        {myPlayer && !myPlayer.isBankrupt && (
          <div className="flex gap-2 w-full mt-1">
            <button
              onClick={onOpenManage}
              className="btn btn-outline btn-sm flex-1 text-[11px] py-1.5"
              title="بناء ورهن العقارات"
            >
              <Home size={14} className="text-amber-400" />
              إدارة العقارات
            </button>
            {gameState.settings.enableTrading && (
              <button
                onClick={onOpenTrade}
                className="btn btn-outline btn-sm flex-1 text-[11px] py-1.5"
                title="مقايضة وتجارة"
              >
                <Handshake size={14} className="text-emerald-400" />
                عرض صفقة
              </button>
            )}
          </div>
        )}
      </div>

      {/* Latest Game Ticker */}
      {gameState.logs.length > 0 && (
        <div className="mt-2 text-center text-[10px] sm:text-[11px] text-slate-300 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800 line-clamp-1 max-w-sm">
          {gameState.logs[0].message}
        </div>
      )}
    </div>
  );
};
