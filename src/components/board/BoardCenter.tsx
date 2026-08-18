import React from 'react';
import { Dice3D } from '../dice/Dice3D';
import { useGame } from '../../context/GameContext';
import { Dices, ArrowRight, Home, Handshake, Clock } from 'lucide-react';

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
    isMovingPawn,
    rollDice, 
    endCurrentTurn,
    payJailBail,
    useJailCard
  } = useGame();

  if (!gameState || !currentPlayer) return null;

  const canRoll = isMyTurn && !gameState.hasRolled && !isMovingPawn && (gameState.phase === 'roll_dice' || gameState.phase === 'jail_decision');
  const canEndTurn = isMyTurn && gameState.hasRolled && !isMovingPawn && gameState.phase === 'idle';

  return (
    <div className="board-center-stage select-none">
      {/* Center Top: Free Parking Jackpot & Turn Header */}
      <div className="flex items-center justify-between w-full max-w-[320px] px-2 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🎲</span>
          <span className="font-gold font-black text-xs sm:text-sm">مونوبولي العربية</span>
        </div>

        {gameState.settings.freeParkingJackpot && (
          <div className="bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-lg text-right">
            <span className="text-[8px] text-amber-300 ml-1">حوض الموقف:</span>
            <span className="text-[10px] font-mono font-bold text-amber-400">{gameState.freeParkingPool} ر.س</span>
          </div>
        )}
      </div>

      {/* Current Turn Notification Pill */}
      <div 
        className="my-1 px-3 py-1 rounded-full flex items-center justify-between w-full max-w-[280px] border shadow-sm transition-all"
        style={{
          backgroundColor: `${currentPlayer.color}20`,
          borderColor: currentPlayer.color
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{currentPlayer.avatar}</span>
          <span className="text-[10px] sm:text-xs font-bold text-white">
            {currentPlayer.name} {myPlayer?.id === currentPlayer.id && '(أنت)'}
          </span>
        </div>

        {/* Turn Timer Badge */}
        {gameState.settings.turnTimeSeconds > 0 && (
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-700">
            <Clock size={10} />
            <span>{gameState.remainingTurnTime}ث</span>
          </div>
        )}
      </div>

      {/* 3D Dice Display */}
      <div className="my-0.5 transform scale-90 sm:scale-100">
        <Dice3D 
          dice={gameState.dice} 
          isRolling={isMovingPawn} 
          onRollClick={canRoll ? rollDice : undefined}
          canRoll={canRoll}
        />
      </div>

      {/* In-Jail Warning & Options for Active Player */}
      {currentPlayer.inJail && isMyTurn && !isMovingPawn && (
        <div className="w-full max-w-[260px] bg-rose-950/80 border border-rose-500/50 p-1.5 rounded-xl text-center my-1 text-xs">
          <span className="text-rose-200 font-bold block text-[10px] mb-1">
            🔒 أنت في السجن! (الدور {currentPlayer.jailTurns + 1}/3)
          </span>
          <div className="flex gap-1.5 justify-center">
            {myPlayer && myPlayer.cash >= 50 && (
              <button onClick={payJailBail} className="btn btn-ruby btn-sm py-0.5 text-[9px]">
                كفالة (50)
              </button>
            )}
            {myPlayer && myPlayer.getOutOfJailCards > 0 && (
              <button onClick={useJailCard} className="btn btn-gold btn-sm py-0.5 text-[9px]">
                بطاقة عفو
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Action Controls */}
      <div className="flex flex-col items-center justify-center gap-1.5 mt-1 w-full max-w-[260px]">
        {/* Moving Pawn Animation Feedback */}
        {isMovingPawn && (
          <div className="text-center py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold animate-pulse w-full">
            🏃‍♂️ جاري التقدم على اللوحة...
          </div>
        )}

        {/* Roll Dice Button */}
        {canRoll && (
          <button onClick={rollDice} className="btn btn-gold btn-sm w-full shadow-lg animate-pulse py-2 text-xs sm:text-sm">
            <Dices size={16} />
            ارمِ النرد! 🎲
          </button>
        )}

        {/* Waiting For Other Player */}
        {!isMyTurn && !isMovingPawn && (
          <div className="text-center py-1 text-[10px] sm:text-xs text-slate-400 font-medium">
            ⏳ في انتظار حركة {currentPlayer.name}...
          </div>
        )}

        {/* End Turn Button */}
        {canEndTurn && (
          <button onClick={endCurrentTurn} className="btn btn-emerald btn-sm w-full shadow-lg py-2 text-xs sm:text-sm">
            <ArrowRight size={16} />
            إنهاء دورك وتمريره للخصم 👉
          </button>
        )}

        {/* Action Controls for Real Player (Manage & Trade) */}
        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && (
          <div className="flex gap-1.5 w-full">
            <button
              onClick={onOpenManage}
              className="btn btn-outline btn-sm flex-1 text-[10px] py-1"
              title="بناء ورهن العقارات"
            >
              <Home size={12} className="text-amber-400" />
              إدارة العقارات
            </button>
            {gameState.settings.enableTrading && (
              <button
                onClick={onOpenTrade}
                className="btn btn-outline btn-sm flex-1 text-[10px] py-1"
                title="مقايضة وتجارة"
              >
                <Handshake size={12} className="text-emerald-400" />
                عرض صفقة
              </button>
            )}
          </div>
        )}
      </div>

      {/* Latest Game Ticker */}
      {gameState.logs.length > 0 && (
        <div className="mt-1.5 text-center text-[9px] sm:text-[10px] text-slate-300 bg-slate-950/70 px-2.5 py-0.5 rounded-full border border-slate-800 line-clamp-1 max-w-[260px]">
          {gameState.logs[0].message}
        </div>
      )}
    </div>
  );
};
