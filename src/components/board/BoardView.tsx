import React from 'react';
import { TileComponent } from './TileComponent';
import { BoardCenter } from './BoardCenter';
import { BOARD_TILES } from '../../constants/boardData';
import { useGame } from '../../context/GameContext';
import { TileData } from '../../types/game';

interface BoardViewProps {
  is3D: boolean;
  onOpenManage: () => void;
  onOpenTrade: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ is3D, onOpenManage, onOpenTrade }) => {
  const { gameState, setSelectedTileDetail } = useGame();

  if (!gameState) return null;

  // Helper to map tile ID (0 to 39) to 11x11 Grid Row & Col
  const getGridPosition = (id: number): { row: number; col: number } => {
    // Bottom row (0 to 10): Row 11, Col 11 -> 1
    if (id >= 0 && id <= 10) {
      return { row: 11, col: 11 - id };
    }
    // Left column (11 to 19): Row 10 -> 2, Col 1
    if (id >= 11 && id <= 19) {
      return { row: 11 - (id - 10), col: 1 };
    }
    // Top row (20 to 30): Row 1, Col 1 -> 11
    if (id >= 20 && id <= 30) {
      return { row: 1, col: 1 + (id - 20) };
    }
    // Right column (31 to 39): Row 2 -> 10, Col 11
    if (id >= 31 && id <= 39) {
      return { row: 1 + (id - 30), col: 11 };
    }
    return { row: 1, col: 1 };
  };

  const handleTileClick = (tile: TileData) => {
    setSelectedTileDetail(tile);
  };

  return (
    <div className="board-perspective-wrapper">
      <div className={`monopoly-board-grid ${is3D ? 'board-3d-active' : ''}`}>
        {/* Render Center Area */}
        <BoardCenter onOpenManage={onOpenManage} onOpenTrade={onOpenTrade} />

        {/* Render 40 Tiles */}
        {BOARD_TILES.map((tile) => {
          const { row, col } = getGridPosition(tile.id);
          const owner = gameState.players.find((p) => p.properties.includes(tile.id));
          const playersOnTile = gameState.players.filter((p) => p.position === tile.id && !p.isBankrupt);
          const isHighlighted = gameState.pendingBuyTileId === tile.id;

          return (
            <TileComponent
              key={tile.id}
              tile={tile}
              gridRow={row}
              gridCol={col}
              owner={owner}
              playersOnTile={playersOnTile}
              onTileClick={handleTileClick}
              isHighlighted={isHighlighted}
            />
          );
        })}
      </div>
    </div>
  );
};
