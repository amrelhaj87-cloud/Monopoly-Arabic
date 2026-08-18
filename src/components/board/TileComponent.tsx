import React from 'react';
import { TileData, Player } from '../../types/game';
import { GROUP_COLORS } from '../../constants/boardData';

export type TileSide = 'bottom' | 'top' | 'left' | 'right' | 'corner';

interface TileComponentProps {
  tile: TileData;
  gridRow: number;
  gridCol: number;
  side: TileSide;
  owner?: Player;
  playersOnTile: Player[];
  onTileClick: (tile: TileData) => void;
  isHighlighted?: boolean;
}

export const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  gridRow,
  gridCol,
  side,
  owner,
  playersOnTile,
  onTileClick,
  isHighlighted
}) => {
  const isCorner = side === 'corner';
  const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
  const houseCount = owner?.houses[tile.id] || 0;
  const isMortgaged = owner?.mortgaged[tile.id] || false;

  // Determine badge emoji (Flag or Icon)
  const badgeEmoji = tile.flag || tile.icon || '📍';

  return (
    <div
      onClick={() => onTileClick(tile)}
      style={{
        gridRow,
        gridColumn: gridCol
      }}
      className={`board-tile tile-${side} ${isCorner ? 'corner-tile' : ''} ${
        isHighlighted ? 'highlighted' : ''
      } ${owner ? 'has-owner' : ''}`}
      title={`${tile.name} - اضغط لعرض التفاصيل`}
    >
      {/* =========================================================================
          1. CORNER TILE RENDERER
         ========================================================================= */}
      {isCorner ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center select-none">
          <span className="text-2xl sm:text-3xl filter drop-shadow-md animate-bounce-gentle">
            {tile.icon}
          </span>
          <span className="text-[10px] sm:text-xs font-black text-amber-300 mt-1 leading-tight">
            {tile.name}
          </span>
          {tile.id === 0 && (
            <span className="text-[8px] sm:text-[9px] text-emerald-400 font-bold font-mono mt-0.5 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">
              +200 ر.س
            </span>
          )}
        </div>
      ) : (
        /* =========================================================================
           2. REGULAR BOARD TILE RENDERER (TOP, BOTTOM, LEFT, RIGHT)
           ========================================================================= */
        <div className={`tile-inner-container tile-inner-${side} w-full h-full flex select-none`}>
          {/* Group / Country Badge (Circular or pill) */}
          <div className="tile-badge-wrapper shrink-0">
            <div
              className="tile-flag-circle"
              style={{
                borderColor: groupStyle.main,
                boxShadow: owner
                  ? `0 0 0 2px ${owner.color}, 0 0 10px ${groupStyle.main}`
                  : `0 0 8px ${groupStyle.main}50`
              }}
            >
              <span className="tile-flag-emoji">{badgeEmoji}</span>
            </div>

            {/* Houses / Hotel Mini Badges */}
            {houseCount > 0 && (
              <div className="tile-houses-overlay">
                {houseCount === 5 ? (
                  <span className="house-hotel-badge">🏨</span>
                ) : (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: houseCount }).map((_, i) => (
                      <span key={i} className="house-dot-badge">🏠</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center Name & Info */}
          <div className="tile-name-wrapper flex-1 flex flex-col items-center justify-center text-center px-0.5">
            <span className="tile-name-text font-black text-slate-100 leading-tight">
              {tile.name}
            </span>

            {/* Mortgage Indicator */}
            {isMortgaged && (
              <span className="tile-mortgage-badge">
                مرهون 🔒
              </span>
            )}
          </div>

          {/* Outer Price / Tax / Action Pill */}
          <div className="tile-price-wrapper shrink-0">
            {tile.price ? (
              <div
                className="tile-price-pill"
                style={{
                  borderBottomColor: groupStyle.main
                }}
              >
                <span className="font-mono">{tile.price}</span>
                <span className="text-[7px] text-amber-200/80 mr-0.5">ر.س</span>
              </div>
            ) : tile.taxAmount ? (
              <div className="tile-tax-pill">
                <span>{tile.taxAmount}</span>
                <span className="text-[7px] mr-0.5">ر.س</span>
              </div>
            ) : (
              <div className="tile-special-pill">
                <span>{tile.icon}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          3. PLAYERS ON TILE (PAWNS)
         ========================================================================= */}
      {playersOnTile.length > 0 && (
        <div className="tile-pawns-container">
          {playersOnTile.map((p) => (
            <div
              key={p.id}
              className="token-pawn"
              style={{
                backgroundColor: p.color,
                borderColor: '#ffffff',
                boxShadow: `0 0 12px ${p.color}, inset 0 2px 4px rgba(255,255,255,0.6)`
              }}
              title={p.name}
            >
              <span>{p.avatar}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
