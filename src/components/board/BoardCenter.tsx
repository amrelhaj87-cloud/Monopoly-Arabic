import React from 'react';
import { Dice3D } from '../dice/Dice3D';
import { useGame } from '../../context/GameContext';
import { Dices, ArrowRight, Home, Handshake, Clock, Sparkles } from 'lucide-react';

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
    <div className="board-center-stage select-none flex flex-col items-center justify-between p-2 sm:p-3 text-center w-full h-full">
      {/* 1. TOP HEADER ROW: Brand, Turn Info & Jackpot */}
      <div className="flex items-center justify-between w-full max-w-[500px] px-2">
        {/* Brand */}
        <div className="flex items-center gap-1.5">
          <span className="text-base">🎲</span>
          <span className="font-gold font-black text-xs sm:text-sm">مونوبولي العربية</span>
        </div>

        {/* Current Turn Badge */}
        <div 
          className="px-2.5 py-1 rounded-full flex items-center gap-1.5 border shadow-md bg-slate-900/90 backdrop-blur-sm"
          style={{
            borderColor: currentPlayer.color || '#f59e0b',
            boxShadow: `0 0 10px ${currentPlayer.color || '#f59e0b'}30`
          }}
        >
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs border shrink-0"
            style={{ backgroundColor: `${currentPlayer.color}30`, borderColor: currentPlayer.color }}
          >
            <span>{currentPlayer.avatar}</span>
          </div>
          <span className="text-[11px] font-bold text-white leading-none">
            {currentPlayer.name} {myPlayer?.id === currentPlayer.id && '(أنت)'}
          </span>
          {gameState.settings.turnTimeSeconds > 0 && (
            <span className="text-[9px] font-mono font-bold text-amber-300 bg-slate-950 px-1.5 py-0.2 rounded-full border border-slate-700 ml-1">
              {gameState.remainingTurnTime}ث
            </span>
          )}
        </div>

        {/* Jackpot / Parking Pool */}
        {gameState.settings.freeParkingJackpot ? (
          <div className="bg-amber-950/90 border border-amber-500/50 px-2 py-0.5 rounded-full text-right shadow-sm">
            <span className="text-[8px] text-amber-300 ml-1">الموقف:</span>
            <span className="text-[10px] font-mono font-bold text-amber-400">{gameState.freeParkingPool} ر.س</span>
          </div>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* 2. MIDDLE AREA: 3D Dice Display & Jail Bail if needed */}
      <div className="flex flex-col items-center justify-center my-0.5">
        <div className="transform scale-90 sm:scale-100">
          <Dice3D 
            dice={gameState.dice} 
            isRolling={isMovingPawn} 
            onRollClick={canRoll ? rollDice : undefined}
            canRoll={canRoll}
          />
        </div>

        {/* In-Jail Warning & Options for Active Player */}
        {currentPlayer.inJail && isMyTurn && !isMovingPawn && (
          <div className="bg-rose-950/90 border border-rose-500/60 px-3 py-1.5 rounded-xl text-center mt-1 text-xs shadow-lg flex items-center gap-2">
            <span className="text-rose-200 font-bold text-[10px]">
              🔒 أنت في السجن! ({currentPlayer.jailTurns + 1}/3)
            </span>
            <div className="flex gap-1">
              {myPlayer && myPlayer.cash >= 50 && (
                <button onClick={payJailBail} className="btn btn-ruby btn-xs py-0.5 px-2 text-[9.5px]">
                  دفع كفالة (50)
                </button>
              )}
              {myPlayer && myPlayer.getOutOfJailCards > 0 && (
                <button onClick={useJailCard} className="btn btn-gold btn-xs py-0.5 px-2 text-[9.5px]">
                  عفو ملكي
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM ROW CONTROLS: Widescreen Horizontal Cockpit Bar */}
      <div className="w-full max-w-[500px] flex items-center justify-center gap-2 px-1">
        {/* Manage Properties Button */}
        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && (
          <button
            onClick={onOpenManage}
            className="btn btn-outline btn-sm px-2.5 sm:px-3 py-1.5 text-xs bg-slate-900/90 hover:bg-slate-800 flex items-center gap-1.5 shrink-0 border border-slate-700 shadow-md"
            title="بناء ورهن العقارات"
          >
            <Home size={14} className="text-emerald-400" />
            <span className="font-bold text-[11px] sm:text-xs">إدارة العقارات</span>
          </button>
        )}

        {/* Primary Action Button (Roll / End Turn / Moving / Waiting) */}
        <div className="flex-1 min-w-[130px] max-w-[200px]">
          {canRoll && (
            <button onClick={rollDice} className="btn btn-gold btn-md w-full shadow-lg py-1.5 text-xs sm:text-sm font-black animate-bounce-gentle">
              <Dices size={16} />
              ارمِ النرد! 🎲
            </button>
          )}

          {canEndTurn && (
            <button onClick={endCurrentTurn} className="btn btn-emerald btn-md w-full shadow-lg py-1.5 text-xs sm:text-sm font-black">
              <ArrowRight size={16} />
              إنهاء الدور 👉
            </button>
          )}

          {isMovingPawn && (
            <div className="text-center py-1.5 px-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-bold animate-pulse">
              🏃‍♂️ جاري التقدم...
            </div>
          )}

          {!isMyTurn && !isMovingPawn && !canRoll && !canEndTurn && (
            <div className="text-center py-1.5 text-[10px] text-slate-300 font-medium bg-slate-950/80 rounded-xl border border-slate-800">
              ⏳ دور {currentPlayer.name}
            </div>
          )}
        </div>

        {/* Trade Button */}
        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && (
          <button
            onClick={onOpenTrade}
            className="btn btn-outline btn-sm px-2.5 sm:px-3 py-1.5 text-xs bg-slate-900/90 hover:bg-slate-800 flex items-center gap-1.5 shrink-0 border border-slate-700 shadow-md"
            title="تقديم عرض مقايضة أو صفقة"
          >
            <Handshake size={14} className="text-amber-400" />
            <span className="font-bold text-[11px] sm:text-xs">عرض صفقة</span>
          </button>
        )}
      </div>

      {/* 4. Mini Status Ticker at bottom */}
      {gameState.logs.length > 0 && (
        <div className="text-center text-[9.5px] text-slate-400 bg-slate-950/90 px-3 py-0.5 rounded-full border border-slate-800/80 line-clamp-1 max-w-[400px] shadow-sm mt-0.5">
          {gameState.logs[0].message}
        </div>
      )}
    </div>
  );
};
