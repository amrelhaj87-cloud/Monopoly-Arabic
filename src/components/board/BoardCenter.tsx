import React, { useRef, useEffect } from 'react';
import { Dice3D } from '../dice/Dice3D';
import { useGame } from '../../context/GameContext';
import { Dices, ArrowRight, Home, Handshake, ScrollText, Skull, Shield } from 'lucide-react';
import { PlayerBlob } from '../common/PlayerBlob';
import { isNativePlatform, handleRewardAd } from '../../services/adService';

interface BoardCenterProps {
  onOpenManage: () => void;
  onOpenTrade: () => void;
  onDeclareBankruptcy?: () => void;
}

export const BoardCenter: React.FC<BoardCenterProps> = ({ onOpenManage, onOpenTrade, onDeclareBankruptcy }) => {
  const { 
    gameState, 
    currentPlayer, 
    myPlayer, 
    isMyTurn, 
    isMovingPawn,
    rollDice, 
    endCurrentTurn,
    payJailBail,
    useJailCard,
    addTurnTime,
    useTimeShield
  } = useGame();

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [gameState?.logs?.length]);

  if (!gameState || !currentPlayer) return null;

  const canRoll = isMyTurn && !gameState.hasRolled && !isMovingPawn && (gameState.phase === 'roll_dice' || gameState.phase === 'jail_decision');
  const canEndTurn = isMyTurn && gameState.hasRolled && !isMovingPawn && gameState.phase === 'idle';

  // Last 5 events for the live center feed
  const recentLogs = gameState.logs.slice(0, 5);

  return (
    <div className="board-center-stage select-none flex flex-col items-center justify-between p-3 sm:p-4 text-center w-full h-full gap-2">
      {/* 1. TOP HEADER ROW: Brand, Turn Info & Jackpot */}
      <div className="flex items-center justify-between w-full px-2 sm:px-6 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-sm sm:text-base">🎲</span>
          <span className="font-gold font-black text-xs sm:text-sm">
            أملاك <span className="text-amber-300 font-semibold text-[10px] sm:text-xs">وعقارات</span>
          </span>
        </div>

        {/* Current Turn Badge */}
        <div 
          className="px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 border shadow-md bg-slate-900/90 backdrop-blur-sm"
          style={{
            borderColor: currentPlayer.color || '#f59e0b',
            boxShadow: `0 0 10px ${currentPlayer.color || '#f59e0b'}30`
          }}
        >
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          >
            <PlayerBlob color={currentPlayer.color} size="pawn" />
          </div>
          <span className="text-[10.5px] sm:text-xs font-bold text-white leading-none">
            {currentPlayer.name} {myPlayer?.id === currentPlayer.id && '(أنت)'}
          </span>
          {gameState.settings.turnTimeSeconds > 0 && (
            <span className="text-[9px] font-mono font-bold text-amber-300 bg-slate-950 px-1.5 py-0.2 rounded-full border border-slate-700 ml-0.5">
              {gameState.remainingTurnTime}ث
            </span>
          )}
        </div>

        {/* Jackpot / Parking Pool */}
        {gameState.settings.freeParkingJackpot ? (
          <div className="bg-amber-950/90 border border-amber-500/50 px-2 py-0.5 rounded-full text-right shadow-sm shrink-0">
            <span className="text-[8px] text-amber-300 ml-1">الموقف:</span>
            <span className="text-[10px] font-mono font-bold text-amber-400">{gameState.freeParkingPool} $</span>
          </div>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* 2. MIDDLE AREA: Log (Left) | Dice (Center) | Actions (Right) */}
      <div className="flex-1 w-full flex flex-row items-center justify-between px-2 sm:px-8 gap-4 my-2">
        
        {/* Right (Visual Left in RTL): Live Real-Time Activity Log Feed */}
        <div 
          style={{ width: '280px', height: '125px', boxSizing: 'border-box' }}
          className="shrink-0 bg-slate-950/90 border border-slate-800/90 rounded-2xl p-2.5 text-right shadow-inner flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 text-[11px] text-slate-400 font-bold mb-1 shrink-0">
            <span className="flex items-center gap-1.5">
              <ScrollText size={13} className="text-amber-400" />
              سجل الأحداث المباشر
            </span>
            <span className="text-[9px] text-emerald-400/90 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              مباشر
            </span>
          </div>

          <div 
            ref={logContainerRef} 
            className="space-y-1.5 overflow-hidden flex-1 flex flex-col justify-start"
          >
            {recentLogs.length === 0 ? (
              <div className="text-[10px] text-slate-500 text-center py-5">بدأت المباراة، بانتظار الرمية الأولى...</div>
            ) : (
              recentLogs.slice(0, 3).map((log, idx) => {
                const isLatest = idx === 0;
                return (
                  <div
                    key={log.id}
                    className={`text-[10px] sm:text-[10.5px] leading-tight p-1.5 rounded-xl transition-all flex items-start gap-1.5 ${
                      isLatest
                        ? 'bg-slate-900 border border-amber-500/50 text-amber-200 font-black shadow-sm'
                        : 'text-slate-400 font-medium opacity-80'
                    }`}
                  >
                    <span className="shrink-0 text-xs">{isLatest ? '👉' : '•'}</span>
                    <span className="flex-1 truncate">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Center: 3D Dice */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="transform scale-100">
            <Dice3D 
              dice={gameState.dice} 
              isRolling={isMovingPawn} 
              onRollClick={canRoll ? rollDice : undefined}
              canRoll={canRoll}
            />
          </div>
        </div>

        {/* Left (Visual Right in RTL): Primary Action Buttons */}
        <div className="w-[200px] shrink-0 flex flex-col items-center justify-center gap-3">
          {/* In-Jail Warning & Options for Active Player */}
          {currentPlayer.inJail && isMyTurn && !isMovingPawn && (
            <div className="bg-rose-950/90 border border-rose-500/60 px-3 py-2 rounded-xl text-center text-xs shadow-lg flex flex-col items-center gap-2 w-full">
              <span className="text-rose-200 font-bold text-[10px]">
                🔒 في السجن ({currentPlayer.jailTurns + 1}/3)
              </span>
              <div className="flex gap-2 w-full">
                {myPlayer && myPlayer.cash >= 50 && (
                  <button onClick={payJailBail} className="btn btn-ruby btn-sm flex-1 py-1 text-[10px]">
                    كفالة (50)
                  </button>
                )}
                {myPlayer && myPlayer.getOutOfJailCards > 0 && (
                  <button onClick={useJailCard} className="btn btn-gold btn-sm flex-1 py-1 text-[10px]">
                    عفو ملكي
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Roll / End Turn Buttons */}
          <div className="w-full">
            {canRoll && (
              <button onClick={rollDice} className="btn btn-gold btn-sm w-full shadow-lg py-2.5 text-sm font-black animate-bounce-gentle">
                <Dices size={16} />
                ارمِ النرد! 🎲
              </button>
            )}

            {canEndTurn && (
              <button onClick={endCurrentTurn} className="btn btn-emerald btn-sm w-full shadow-lg py-2.5 text-sm font-black">
                <ArrowRight size={16} />
                إنهاء الدور 👉
              </button>
            )}

            {/* Time Shield Ad Button (Web Only) */}
            {isMyTurn && !isMovingPawn && myPlayer && myPlayer.activePerks?.includes('timeShield') && !myPlayer.hasUsedTimeShield && (
              <button 
                onClick={useTimeShield} 
                className="btn btn-sm w-full shadow-lg py-2 mt-2 text-xs font-black transition-all hover:brightness-110"
                style={{ backgroundColor: '#0ea5e9', color: 'white', borderColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Shield size={14} />
                تفعيل درع الوقت (+20ث)
              </button>
            )}

            {isMovingPawn && (
              <div className="text-center py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold animate-pulse">
                🏃‍♂️ جاري التقدم...
              </div>
            )}

            {!isMyTurn && !isMovingPawn && !canRoll && !canEndTurn && (
              <div className="text-center py-2 text-[11px] text-slate-300 font-medium bg-slate-950/80 rounded-xl border border-slate-800">
                {currentPlayer?.isBot ? (
                  <span className="flex items-center justify-center gap-1.5 text-violet-300">
                    <span className="inline-flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="font-bold">{currentPlayer.name} بيفكر...</span>
                    <span>🤖</span>
                  </span>
                ) : (
                  <span>⏳ دور {currentPlayer?.name}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW CONTROLS: Property Management, Trade & Bankruptcy */}
      <div className="w-full flex items-center justify-center gap-4 px-4 pb-2 shrink-0">
        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && (
          <button
            onClick={onOpenManage}
            className="btn btn-outline btn-sm px-4 py-1.5 text-xs bg-slate-900/90 hover:bg-slate-800 flex items-center gap-1.5 border border-slate-700 shadow-md"
            title="بناء ورهن وتطوير العقارات"
          >
            <Home size={16} className="text-emerald-400" />
            <span className="font-bold">إدارة وبناء العقارات</span>
          </button>
        )}

        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && (
          <button
            onClick={onOpenTrade}
            className="btn btn-outline btn-sm px-4 py-1.5 text-xs bg-slate-900/90 hover:bg-slate-800 flex items-center gap-1.5 border border-slate-700 shadow-md"
            title="تقديم عرض مقايضة أو صفقة"
          >
            <Handshake size={16} className="text-amber-400" />
            <span className="font-bold">عرض صفقة ومقايضة</span>
          </button>
        )}

        {myPlayer && !myPlayer.isBankrupt && !isMovingPawn && onDeclareBankruptcy && (
          <button
            onClick={onDeclareBankruptcy}
            className="btn btn-outline btn-sm px-4 py-1.5 text-xs bg-slate-900/90 hover:bg-rose-950 flex items-center gap-1.5 border border-rose-800/60 hover:border-rose-500 text-rose-400 shadow-md transition-colors"
            title="إعلان الإفلاس (لا رجعة فيه)"
          >
            <Skull size={16} />
            <span className="font-bold">إفلاس</span>
          </button>
        )}
      </div>
    </div>
  );
};
