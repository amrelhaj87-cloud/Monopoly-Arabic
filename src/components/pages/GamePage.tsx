import React, { useState, useCallback } from 'react';
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

interface GamePageProps {
  is3D: boolean;
}

export const GamePage: React.FC<GamePageProps> = ({ is3D }) => {
  const [showManageProps, setShowManageProps] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showBankruptcyConfirm, setShowBankruptcyConfirm] = useState(false);

  const { myPlayer, declareBankruptcy } = useGame();

  const handleBankruptcyRequest = useCallback(() => {
    setShowBankruptcyConfirm(true);
  }, []);

  const handleBankruptcyConfirmed = useCallback(() => {
    setShowBankruptcyConfirm(false);
    declareBankruptcy();
  }, [declareBankruptcy]);

  return (
    <div className="game-page-layout animate-fadeIn">
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
        onConfirm={handleBankruptcyConfirmed}
        onCancel={() => setShowBankruptcyConfirm(false)}
      />
    </div>
  );
};
