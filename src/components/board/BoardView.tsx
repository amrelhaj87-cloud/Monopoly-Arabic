import React from 'react';
import { TileComponent, TileSide } from './TileComponent';
import { BoardCenter } from './BoardCenter';
import { BOARD_TILES } from '../../constants/boardData';
import { useGame } from '../../context/GameContext';
import { TileData } from '../../types/game';
import { ZoomIn, ZoomOut, Maximize2, MousePointer2 } from 'lucide-react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

interface BoardViewProps {
  is3D: boolean;
  onOpenManage: () => void;
  onOpenTrade: () => void;
  onDeclareBankruptcy?: () => void;
}

const ZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute top-1 left-2 z-30 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 shadow-lg backdrop-blur-sm select-none">
      <button
        onClick={() => zoomOut()}
        className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        title="تصغير اللوحة"
      >
        <ZoomOut size={14} />
      </button>

      <button
        onClick={() => resetTransform()}
        className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
        title="إعادة ضبط الحجم الطبيعي"
      >
        <Maximize2 size={14} />
      </button>

      <button
        onClick={() => zoomIn()}
        className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        title="تكبير اللوحة"
      >
        <ZoomIn size={14} />
      </button>

      <div className="w-px h-4 bg-slate-700 mx-1"></div>
      
      <div className="px-1 text-[9px] text-slate-400 flex items-center gap-1">
        <MousePointer2 size={10} />
        اسحب للتحريك
      </div>
    </div>
  );
};

export const BoardView: React.FC<BoardViewProps> = ({ is3D, onOpenManage, onOpenTrade, onDeclareBankruptcy }) => {
  const { gameState, setSelectedTileDetail } = useGame();
  const [isDesktop, setIsDesktop] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const boardContent = (
    <div dir="rtl" className="board-perspective-wrapper flex items-center justify-center p-2 w-full h-full min-h-max min-w-max">
      <div 
        className={`monopoly-board-grid ${is3D ? 'board-3d-active' : ''}`}
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
  );

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" dir="ltr">
      {isDesktop ? (
        <div className="w-full h-full overflow-auto flex items-center justify-center custom-scrollbar">
          {boardContent}
        </div>
      ) : (
        <TransformWrapper
          initialScale={1}
          minScale={0.4}
          maxScale={3}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
        >
          <div dir="rtl">
            <ZoomControls />
          </div>
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            {boardContent}
          </TransformComponent>
        </TransformWrapper>
      )}
    </div>
  );
};
