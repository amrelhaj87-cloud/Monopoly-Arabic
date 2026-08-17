import React, { useState } from 'react';
import { BoardView } from '../board/BoardView';
import { PlayerListHUD } from '../hud/PlayerListHUD';
import { GameLogDrawer } from '../hud/GameLogDrawer';
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
    <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full animate-fadeIn">
      {/* Left Sidebar: Active Players, Game History Log, In-Game Chat */}
      <div className="w-full lg:w-80 flex flex-col gap-3 order-2 lg:order-1">
        <PlayerListHUD />
        <GameLogDrawer />
        <GameChatDrawer />
      </div>

      {/* Center Arena: 40-Tile Monopoly Board */}
      <div className="flex-1 flex items-center justify-center order-1 lg:order-2 w-full">
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
