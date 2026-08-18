import React from 'react';
import { TileComponent, TileSide } from './TileComponent';
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

  // Helper to map tile ID (0 to 39) to 15x7 Grid Row, Col & Orientation Side
  const getGridPosition = (id: number): { row: number; col: number; side: TileSide } => {
    // 1. Bottom Row: 0 (Start Corner), 1..13 (Properties/Specials), 14 (Jail Corner) -> Row 7
    if (id === 0) return { row: 7, col: 15, side: 'corner' };
    if (id >= 1 && id <= 13) return { row: 7, col: 15 - id, side: 'bottom' };
    if (id === 14) return { row: 7, col: 1, side: 'corner' };

    // 2. Left Column: 15..19 (Bottom to Top) -> Col 1, Rows 6 down to 2
    if (id >= 15 && id <= 19) return { row: 7 - (id - 14), col: 1, side: 'left' };
    if (id === 20) return { row: 1, col: 1, side: 'corner' };

    // 3. Top Row: 21..33 (Left to Right) -> Row 1, Cols 2 up to 14
    if (id >= 21 && id <= 33) return { row: 1, col: 1 + (id - 20), side: 'top' };
    if (id === 34) return { row: 1, col: 15, side: 'corner' };

    // 4. Right Column: 35..39 (Top to Bottom) -> Col 15, Rows 2 up to 6
    if (id >= 35 && id <= 39) return { row: 1 + (id - 34), col: 15, side: 'right' };

    return { row: 1, col: 1, side: 'corner' };
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
          const { row, col, side } = getGridPosition(tile.id);
          const owner = gameState.players.find((p) => p.properties.includes(tile.id));
          const playersOnTile = gameState.players.filter((p) => p.position === tile.id && !p.isBankrupt);
          const isHighlighted = gameState.pendingBuyTileId === tile.id;

          return (
            <TileComponent
              key={tile.id}
              tile={tile}
              gridRow={row}
              gridCol={col}
              side={side}
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
