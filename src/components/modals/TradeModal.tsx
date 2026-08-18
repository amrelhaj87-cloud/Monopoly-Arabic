import React, { useState } from 'react';
import { Handshake, X, ArrowLeftRight, Check, Ban, Sparkles, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BOARD_TILES, GROUP_COLORS, COLOR_GROUP_TILES } from '../../constants/boardData';
import { TradeOffer } from '../../types/game';
import { AIService } from '../../services/aiService';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose }) => {
  const { gameState, myPlayer, proposeTrade, respondToTrade } = useGame();

  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [offeredCash, setOfferedCash] = useState<number>(0);
  const [offeredProps, setOfferedProps] = useState<number[]>([]);
  const [requestedCash, setRequestedCash] = useState<number>(0);
  const [requestedProps, setRequestedProps] = useState<number[]>([]);

  if (!gameState || !myPlayer) return null;

  // Check if there is an active incoming trade targeting me
  const activeTrade = gameState.activeTrade;
  const isIncomingForMe = activeTrade && activeTrade.toPlayerId === myPlayer.id;

  // Auto AI evaluate if trade is targeting a bot
  if (activeTrade) {
    const targetBot = gameState.players.find(p => p.id === activeTrade.toPlayerId && p.isBot);
    if (targetBot) {
      setTimeout(() => {
        const accept = AIService.evaluateTradeOffer(targetBot, activeTrade, gameState);
        respondToTrade(activeTrade.id, accept);
      }, 1400);
    }
  }

  if (!isOpen && !isIncomingForMe) return null;

  const otherPlayers = gameState.players.filter((p) => p.id !== myPlayer.id && !p.isBankrupt);
  const targetPlayer = gameState.players.find((p) => p.id === (selectedTargetId || otherPlayers[0]?.id));

  // Helper to check if property can be traded (must have 0 houses in entire color group)
  const canTradeProperty = (playerId: string, tileId: number): boolean => {
    const p = gameState.players.find(x => x.id === playerId);
    const tile = BOARD_TILES.find(t => t.id === tileId);
    if (!p || !tile) return false;
    const groupTiles = COLOR_GROUP_TILES[tile.group] || [];
    return groupTiles.every(id => (p.houses[id] || 0) === 0);
  };

  const toggleOfferedProp = (id: number) => {
    if (!canTradeProperty(myPlayer.id, id)) return;
    setOfferedProps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleRequestedProp = (id: number) => {
    if (!targetPlayer || !canTradeProperty(targetPlayer.id, id)) return;
    setRequestedProps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Valuation calculation
  const totalOfferedValue = offeredCash + offeredProps.reduce((sum, id) => {
    const t = BOARD_TILES.find(x => x.id === id);
    return sum + (t?.price || 0);
  }, 0);

  const totalRequestedValue = requestedCash + requestedProps.reduce((sum, id) => {
    const t = BOARD_TILES.find(x => x.id === id);
    return sum + (t?.price || 0);
  }, 0);

  const valuationDiff = totalOfferedValue - totalRequestedValue;

  const handleSendOffer = () => {
    if (!targetPlayer) return;
    const offer: TradeOffer = {
      id: `trade_${Date.now()}`,
      fromPlayerId: myPlayer.id,
      toPlayerId: targetPlayer.id,
      offeredCash,
      offeredProperties: offeredProps,
      requestedCash,
      requestedProperties: requestedProps,
      status: 'pending'
    };
    proposeTrade(offer);
    onClose();
  };

  // --- Incoming Trade Receiver View ---
  if (isIncomingForMe && activeTrade) {
    const proposer = gameState.players.find(p => p.id === activeTrade.fromPlayerId);
    const incomingOfferedVal = activeTrade.offeredCash + activeTrade.offeredProperties.reduce((sum, id) => {
      const t = BOARD_TILES.find(x => x.id === id);
      return sum + (t?.price || 0);
    }, 0);
    const incomingRequestedVal = activeTrade.requestedCash + activeTrade.requestedProperties.reduce((sum, id) => {
      const t = BOARD_TILES.find(x => x.id === id);
      return sum + (t?.price || 0);
    }, 0);

    return (
      <div className="modal-overlay">
        <div className="modal-content animate-scaleUp" style={{ maxWidth: '520px' }}>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700 mb-3">
            <Handshake className="text-amber-400" size={26} />
            <div>
              <h3 className="text-lg font-bold text-white">عرض مقايضة وتجارة وارد!</h3>
              <span className="text-xs text-slate-400">قدم لك <strong className="text-amber-300">{proposer?.name}</strong> عرض صفقة جديد</span>
            </div>
          </div>

          {/* Offer / Request Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            {/* Offered by proposer (What I get) */}
            <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-300 block mb-2">ما ستحصل عليه:</span>
                {activeTrade.offeredCash > 0 && (
                  <div className="bg-emerald-900/60 text-emerald-200 p-2 rounded-lg font-mono font-bold text-sm mb-2 flex items-center gap-1">
                    <DollarSign size={14} />
                    +{activeTrade.offeredCash} ر.س نقدياً
                  </div>
                )}
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {activeTrade.offeredProperties.length === 0 && activeTrade.offeredCash === 0 ? (
                    <span className="text-slate-500 text-[10px]">لا توجد عقارات معروضة</span>
                  ) : (
                    activeTrade.offeredProperties.map(id => {
                      const t = BOARD_TILES.find(x => x.id === id);
                      const groupStyle = GROUP_COLORS[t?.group || 'special'];
                      return (
                        <div key={id} className="bg-slate-900 p-2 rounded-lg border border-slate-700 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-white">{t?.name}</span>
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: groupStyle.main }} />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[10px] text-slate-400">
                القيمة الإجمالية: <strong className="text-emerald-300 font-mono">{incomingOfferedVal} ر.س</strong>
              </div>
            </div>

            {/* Requested by proposer (What I give) */}
            <div className="bg-rose-950/30 border border-rose-500/40 p-3 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-300 block mb-2">ما ستقدمه بالمقابل:</span>
                {activeTrade.requestedCash > 0 && (
                  <div className="bg-rose-900/60 text-rose-200 p-2 rounded-lg font-mono font-bold text-sm mb-2 flex items-center gap-1">
                    <DollarSign size={14} />
                    -{activeTrade.requestedCash} ر.س نقدياً
                  </div>
                )}
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {activeTrade.requestedProperties.length === 0 && activeTrade.requestedCash === 0 ? (
                    <span className="text-slate-500 text-[10px]">لا توجد عقارات مطلوبة</span>
                  ) : (
                    activeTrade.requestedProperties.map(id => {
                      const t = BOARD_TILES.find(x => x.id === id);
                      const groupStyle = GROUP_COLORS[t?.group || 'special'];
                      return (
                        <div key={id} className="bg-slate-900 p-2 rounded-lg border border-slate-700 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-white">{t?.name}</span>
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: groupStyle.main }} />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-[10px] text-slate-400">
                القيمة الإجمالية: <strong className="text-rose-300 font-mono">{incomingRequestedVal} ر.س</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => respondToTrade(activeTrade.id, true)}
              className="btn btn-emerald flex-1 py-2.5 font-bold"
            >
              <Check size={16} /> قبول الصفقة 🤝
            </button>
            <button
              onClick={() => respondToTrade(activeTrade.id, false)}
              className="btn btn-ruby flex-1 py-2.5 font-bold"
            >
              <Ban size={16} /> رفض الصفقة ❌
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Proposer View ---
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
          <div className="flex items-center gap-2">
            <Handshake className="text-emerald-400" size={24} />
            <div>
              <h3 className="text-lg font-bold text-white">تقديم عرض مقايضة وتجارة</h3>
              <span className="text-xs text-slate-400">تفاوض على تبادل الأراضي والأموال لتقوية احتكاراتك</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Target Player Selector Tabs */}
        <div className="mb-3">
          <label className="text-xs font-bold text-slate-300 block mb-1.5">اختر اللاعب المفاوض:</label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {otherPlayers.map((p) => {
              const isSelected = (selectedTargetId || otherPlayers[0]?.id) === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedTargetId(p.id)}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-all shrink-0 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base">{p.avatar}</span>
                  <div className="text-right">
                    <span className="block font-bold">{p.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">{p.cash} ر.س • {p.properties.length} عقار</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trade Valuation Difference Bar */}
        <div className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 mb-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">قيمة عرضك:</span>
            <span className="font-mono font-bold text-amber-300">{totalOfferedValue} ر.س</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">قيمة طلبك:</span>
            <span className="font-mono font-bold text-emerald-300">{totalRequestedValue} ر.س</span>
          </div>
          <div className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
            valuationDiff > 0 
              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' 
              : valuationDiff < 0 
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
              : 'bg-slate-800 text-slate-300'
          }`}>
            {valuationDiff > 0 ? <TrendingUp size={11} /> : valuationDiff < 0 ? <TrendingDown size={11} /> : null}
            <span>{valuationDiff === 0 ? 'صفقة متكافئة' : `${Math.abs(valuationDiff)} ر.س ${valuationDiff > 0 ? 'لصالح الخصم' : 'لصالحك'}`}</span>
          </div>
        </div>

        {/* Trade Columns: Give vs Receive */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          {/* Left: What I Offer */}
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <span className="font-bold text-amber-400 block mb-2">ما ستعرضه للخصم:</span>
              
              {/* Cash input */}
              <div className="mb-2.5">
                <label className="text-[10px] text-slate-400 block mb-1">أموال إضافية (رصيدك: {myPlayer.cash}):</label>
                <input
                  type="number"
                  min={0}
                  max={myPlayer.cash}
                  value={offeredCash}
                  onChange={(e) => setOfferedCash(Math.max(0, Math.min(myPlayer.cash, Number(e.target.value))))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-xs focus:border-amber-400 outline-none"
                />
              </div>

              {/* My Properties */}
              <label className="text-[10px] text-slate-400 block mb-1">حدد العقارات المعروضة:</label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {myPlayer.properties.length === 0 ? (
                  <span className="text-[10px] text-slate-500 block py-4 text-center">لا تملك أي عقارات حالياً</span>
                ) : (
                  myPlayer.properties.map((id) => {
                    const tile = BOARD_TILES.find((t) => t.id === id);
                    const isChecked = offeredProps.includes(id);
                    const isTradable = canTradeProperty(myPlayer.id, id);
                    const groupStyle = GROUP_COLORS[tile?.group || 'special'];

                    return (
                      <div
                        key={id}
                        onClick={() => isTradable && toggleOfferedProp(id)}
                        className={`p-2 rounded-lg border text-[11px] flex items-center justify-between transition-all ${
                          !isTradable 
                            ? 'opacity-40 bg-slate-950 border-slate-800 cursor-not-allowed' 
                            : isChecked 
                            ? 'bg-amber-500/20 border-amber-400 text-white cursor-pointer shadow-sm' 
                            : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:border-slate-500 cursor-pointer'
                        }`}
                        title={!isTradable ? 'يجب بيع منازل المجموعة أولاً' : ''}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{tile?.flag || tile?.icon || '📍'}</span>
                          <span className="font-bold">{tile?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-amber-300 font-mono">{tile?.price} ر.س</span>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupStyle.main }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right: What I Request */}
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <span className="font-bold text-emerald-400 block mb-2">ما تطلبه من {targetPlayer?.name}:</span>

              {/* Cash input */}
              <div className="mb-2.5">
                <label className="text-[10px] text-slate-400 block mb-1">أموال تطلبها (رصيده: {targetPlayer?.cash || 0}):</label>
                <input
                  type="number"
                  min={0}
                  max={targetPlayer?.cash || 0}
                  value={requestedCash}
                  onChange={(e) => setRequestedCash(Math.max(0, Math.min(targetPlayer?.cash || 0, Number(e.target.value))))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-xs focus:border-emerald-400 outline-none"
                />
              </div>

              {/* Target Properties */}
              <label className="text-[10px] text-slate-400 block mb-1">حدد عقارات الخصم المطلوبة:</label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {!targetPlayer || targetPlayer.properties.length === 0 ? (
                  <span className="text-[10px] text-slate-500 block py-4 text-center">اللاعب لا يملك أي عقارات</span>
                ) : (
                  targetPlayer.properties.map((id) => {
                    const tile = BOARD_TILES.find((t) => t.id === id);
                    const isChecked = requestedProps.includes(id);
                    const isTradable = canTradeProperty(targetPlayer.id, id);
                    const groupStyle = GROUP_COLORS[tile?.group || 'special'];

                    return (
                      <div
                        key={id}
                        onClick={() => isTradable && toggleRequestedProp(id)}
                        className={`p-2 rounded-lg border text-[11px] flex items-center justify-between transition-all ${
                          !isTradable 
                            ? 'opacity-40 bg-slate-950 border-slate-800 cursor-not-allowed' 
                            : isChecked 
                            ? 'bg-emerald-500/20 border-emerald-400 text-white cursor-pointer shadow-sm' 
                            : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:border-slate-500 cursor-pointer'
                        }`}
                        title={!isTradable ? 'يجب بيع منازل المجموعة أولاً' : ''}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{tile?.flag || tile?.icon || '📍'}</span>
                          <span className="font-bold">{tile?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-emerald-300 font-mono">{tile?.price} ر.س</span>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupStyle.main }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="btn btn-outline flex-1">
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSendOffer}
            disabled={!targetPlayer || (offeredProps.length === 0 && offeredCash === 0 && requestedProps.length === 0 && requestedCash === 0)}
            className="btn btn-gold flex-1 font-bold"
          >
            <ArrowLeftRight size={16} />
            إرسال عرض المقايضة
          </button>
        </div>
      </div>
    </div>
  );
};
