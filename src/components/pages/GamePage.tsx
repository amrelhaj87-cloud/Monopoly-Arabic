import React, { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BoardView } from '../board/BoardView';
import { PlayerListHUD } from '../hud/PlayerListHUD';
import { MyPropertiesHUD } from '../hud/MyPropertiesHUD';
import { GameChatDrawer } from '../hud/GameChatDrawer';
import { PropertyBuyModal } from '../modals/PropertyBuyModal';
import { AuctionModal } from '../modals/AuctionModal';
import { ChanceCardModal } from '../modals/ChanceCardModal';
import { TradeModal } from '../modals/TradeModal';
import { ManagePropertiesModal } from '../modals/ManagePropertiesModal';
import { PropertyDetailModal } from '../modals/PropertyDetailModal';
import { WinnerModal } from '../modals/WinnerModal';
import { BankruptcyConfirmModal } from '../modals/BankruptcyConfirmModal';
import { useGame } from '../../context/GameContext';
import { AdsterraDesktopBanner } from '../ads/AdsterraDesktopBanner';
import { AdsterraMobileBanner } from '../ads/AdsterraMobileBanner';

interface GamePageProps {
  is3D: boolean;
}

export const GamePage: React.FC<GamePageProps> = ({ is3D }) => {
  const [showManageProps, setShowManageProps] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showBankruptcyConfirm, setShowBankruptcyConfirm] = useState(false);
  const [bankruptIds, setBankruptIds] = useState<Set<string>>(new Set());

  const { myPlayer, declareBankruptcy, gameState, grantRevival } = useGame();

  const handleRevival = useCallback(() => {
    grantRevival(1000);
    setShowBankruptcyConfirm(false); // Close the modal since player is revived
  }, [grantRevival]);

  useEffect(() => {
    if (gameState) {
      const newlyBankrupt = gameState.players.filter(p => p.isBankrupt && !bankruptIds.has(p.id));
      if (newlyBankrupt.length > 0) {
        setBankruptIds(prev => {
          const next = new Set(prev);
          newlyBankrupt.forEach(p => next.add(p.id));
          return next;
        });

        // Trigger sad/explosion confetti for bankruptcy
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.2 },
          colors: ['#0f172a', '#dc2626', '#450a0a', '#b91c1c'],
          gravity: 1.5,
          ticks: 300,
          startVelocity: 45
        });
      }
    }
  }, [gameState, bankruptIds]);

  const handleBankruptcyRequest = useCallback(() => {
    setShowBankruptcyConfirm(true);
  }, []);

  const handleBankruptcyConfirmed = useCallback(() => {
    setShowBankruptcyConfirm(false);
    declareBankruptcy();
  }, [declareBankruptcy]);

  return (
    <div className="game-page-layout animate-fadeIn pb-14 xl:pb-0">
      {/* Sidebar: Players HUD, Persistent My Properties, Live Chat */}
      <div className="game-sidebar">
        <PlayerListHUD />
        <MyPropertiesHUD />
        <GameChatDrawer />
      </div>

      {/* Main Board Arena */}
      <div className="game-board-area">
        <BoardView
          is3D={is3D}
          onOpenManage={() => setShowManageProps(true)}
          onOpenTrade={() => setShowTradeModal(true)}
          onDeclareBankruptcy={handleBankruptcyRequest}
        />
      </div>

      {/* Desktop Ad Banner (Left side in RTL layout) */}
      <div className="hidden xl:flex w-[180px] shrink-0 justify-center items-start pt-4 order-3 bg-slate-900/50 min-h-screen">
        <AdsterraDesktopBanner />
      </div>

      {/* Mobile Ad Banner (Fixed at the bottom) */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 py-1 flex justify-center">
        <AdsterraMobileBanner />
      </div>

      {/* In-Game Action Modals */}
      <PropertyBuyModal />
      <AuctionModal />
      <ChanceCardModal />
      <TradeModal isOpen={showTradeModal} onClose={() => setShowTradeModal(false)} />
      <ManagePropertiesModal isOpen={showManageProps} onClose={() => setShowManageProps(false)} />
      <PropertyDetailModal />
      <WinnerModal />
      <BankruptcyConfirmModal
        isOpen={showBankruptcyConfirm}
        playerName={myPlayer?.name}
        playerCash={myPlayer?.cash}
        hasUsedRevival={myPlayer?.hasUsedRevival}
        onConfirm={handleBankruptcyConfirmed}
        onCancel={() => setShowBankruptcyConfirm(false)}
        onRevival={handleRevival}
      />
    </div>
  );
};
