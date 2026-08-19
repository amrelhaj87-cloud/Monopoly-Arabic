import React from 'react';
import { Gavel, Clock, ArrowUp, Hand, Coins, ShieldCheck, UserX } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { BOARD_TILES, GROUP_COLORS } from '../../constants/boardData';
import { PlayerBlob } from '../common/PlayerBlob';

export const AuctionModal: React.FC = () => {
  const { gameState, myPlayer, placeBid, passBid } = useGame();
  const { user } = useAuth();

  if (!gameState || gameState.phase !== 'auction' || !gameState.activeAuction) {
    return null;
  }

  const auction = gameState.activeAuction;
  const tile = BOARD_TILES.find((t) => t.id === auction.tileId);
  if (!tile) return null;

  const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
  const highestBidder = auction.highestBidderId
    ? gameState.players.find((p) => p.id === auction.highestBidderId)
    : null;

  const isParticipating = user && auction.activePlayerIds.includes(user.uid);
  const currentBid = auction.currentBid;
  const isTimeCritical = auction.timeLeftSeconds <= 5;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scaleUp max-w-[460px] w-full p-5 sm:p-6 bg-slate-950 border-2 border-amber-500/40 shadow-2xl rounded-3xl">
        
        {/* 1. HEADER ROW */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Gavel size={20} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">مزاد علني مباشر</h3>
              <span className="text-[10px] text-amber-300/80 font-medium">المزايدة الحية على العقار</span>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-black transition-all shadow-md ${
              isTimeCritical
                ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse scale-105 shadow-rose-900/50'
                : 'bg-slate-900 border-amber-500/40 text-amber-300'
            }`}
          >
            <Clock size={14} className={isTimeCritical ? 'text-rose-400 animate-spin' : 'text-amber-400'} />
            <span className="text-sm tracking-wider">{auction.timeLeftSeconds}ث</span>
          </div>
        </div>

        {/* 2. PROPERTY CARD BANNER */}
        <div
          className="p-3.5 rounded-2xl border-2 flex items-center justify-between mb-4 shadow-lg"
          style={{ 
            backgroundColor: `${groupStyle.main}20`, 
            borderColor: groupStyle.border || '#f59e0b' 
          }}
        >
          <div className="flex items-center gap-2.5">
            {(tile.flag || tile.icon) && (
              <span className="text-2xl filter drop-shadow">{tile.flag || tile.icon}</span>
            )}
            <div>
              <span className="text-[10px] text-slate-300 font-bold block">العقار المعروض للمزايدة:</span>
              <h4 className="text-base sm:text-lg font-black text-white leading-tight">{tile.name}</h4>
            </div>
          </div>
          <div className="text-left bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-400 font-bold block">السعر الأصلي:</span>
            <span className="text-xs sm:text-sm font-mono font-black text-amber-300">{tile.price} $</span>
          </div>
        </div>

        {/* 3. CURRENT HIGHEST BID DISPLAY */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 p-4 rounded-2xl text-center mb-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500" />
          
          <span className="text-xs text-amber-300/90 font-bold block mb-1">أعلى مزايدة حالية</span>
          <div className="text-3xl sm:text-4xl font-black font-mono font-gold tracking-wider drop-shadow">
            {currentBid} $
          </div>

          {highestBidder ? (
            <div className="mt-3 inline-flex items-center gap-2 bg-slate-900/95 px-3.5 py-1.5 rounded-full border border-slate-700 shadow-md">
              <PlayerBlob color={highestBidder.color} size="sm" />
              <span className="text-xs font-black text-slate-100">{highestBidder.name}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/40">
                صاحب أعلى عرض 🏆
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-bold block mt-2">
              في انتظار أول مزايد لفتح الجلسة...
            </span>
          )}
        </div>

        {/* 4. ACTIVE BIDDERS LIST */}
        <div className="mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-black text-slate-400 block mb-2">المتنافسون في الجلسة:</span>
          <div className="flex flex-wrap gap-1.5">
            {gameState.players
              .filter((p) => !p.isBankrupt)
              .map((p) => {
                const isActive = auction.activePlayerIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-slate-800 border-slate-600 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/40 text-slate-500 opacity-60 line-through'
                    }`}
                  >
                    <PlayerBlob color={p.color} size="sm" />
                    <span className="font-bold text-[11px] truncate max-w-[85px]">{p.name}</span>
                    {!isActive && <UserX size={12} className="text-rose-400 shrink-0" />}
                  </div>
                );
              })}
          </div>
        </div>

        {/* 5. USER CASH & BIDDING ACTIONS */}
        {isParticipating && myPlayer ? (
          <div className="space-y-3">
            {/* User Cash Balance Indicator */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold">رصيدك المالي المتاح:</span>
              <div className="flex items-center gap-1 font-mono font-black text-emerald-400 text-sm">
                <Coins size={14} />
                <span>{myPlayer.cash} $</span>
              </div>
            </div>

            {/* +10, +50, +100 Quick Bids */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => placeBid(currentBid + 10)}
                disabled={myPlayer.cash < currentBid + 10}
                className="btn btn-gold btn-sm py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUp size={14} />
                <span>10+ $</span>
              </button>

              <button
                type="button"
                onClick={() => placeBid(currentBid + 50)}
                disabled={myPlayer.cash < currentBid + 50}
                className="btn btn-gold btn-sm py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUp size={14} />
                <span>50+ $</span>
              </button>

              <button
                type="button"
                onClick={() => placeBid(currentBid + 100)}
                disabled={myPlayer.cash < currentBid + 100}
                className="btn btn-gold btn-sm py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUp size={14} />
                <span>100+ $</span>
              </button>
            </div>

            {/* Pass / Withdraw Button */}
            <button
              type="button"
              onClick={passBid}
              className="btn btn-ruby w-full btn-sm py-2.5 text-xs font-black shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Hand size={15} />
              <span>انسحاب من هذا المزاد</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center text-xs text-amber-300/80 font-bold flex items-center justify-center gap-2">
            <span>⏳</span>
            <span>أنت خارج هذا المزاد، بانتظار إعلان الفائز...</span>
          </div>
        )}
      </div>
    </div>
  );
};
