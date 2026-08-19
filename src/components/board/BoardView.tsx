import React, { useEffect, useRef, useState } from 'react';
import { TileComponent, TileSide } from './TileComponent';
import { BoardCenter } from './BoardCenter';
import { BOARD_TILES } from '../../constants/boardData';
import { useGame } from '../../context/GameContext';
import { TileData } from '../../types/game';

interface BoardViewProps {
  is3D: boolean;
  onOpenManage: () => void;
  onOpenTrade: () => void;
  onDeclareBankruptcy?: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ is3D, onOpenManage, onOpenTrade, onDeclareBankruptcy }) => {
  const { gameState, setSelectedTileDetail } = useGame();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [boardScale, setBoardScale] = useState(1);

  // Auto-scale the board to perfectly fit any screen size (Mobile & Desktop)
  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const isMobile = window.innerWidth < 1024;
      const clientWidth = wrapperRef.current.clientWidth || window.innerWidth;

      if (isMobile) {
        // On mobile, scale cleanly to available width without extra black margins
        const scaleX = (clientWidth - 8) / 1080;
        setBoardScale(Math.min(scaleX, 1));
      } else {
        const clientHeight = wrapperRef.current.clientHeight || window.innerHeight;
        const scaleX = (clientWidth - 20) / 1080;
        const scaleY = (clientHeight - 20) / 590;
        const optimalScale = Math.min(scaleX, scaleY, 1); 
        setBoardScale(optimalScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

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
    <div className="relative w-full flex flex-col items-center justify-start overflow-visible" dir="ltr">
      <div 
        ref={wrapperRef}
        dir="rtl" 
        className="board-perspective-wrapper flex items-center justify-center w-full overflow-visible"
      >
        <div 
          className={`monopoly-board-grid ${is3D ? 'board-3d-active' : ''}`}
          style={{ '--board-scale': boardScale } as React.CSSProperties}
        >
          {/* Render Center Area */}
          <BoardCenter onOpenManage={onOpenManage} onOpenTrade={onOpenTrade} onDeclareBankruptcy={onDeclareBankruptcy} />

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
                allPlayers={gameState.players}
                playersOnTile={playersOnTile}
                onTileClick={handleTileClick}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
