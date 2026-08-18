import React, { useState } from 'react';
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

interface GamePageProps {
  is3D: boolean;
}

export const GamePage: React.FC<GamePageProps> = ({ is3D }) => {
  const [showManageProps, setShowManageProps] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);

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
    </div>
  );
};
