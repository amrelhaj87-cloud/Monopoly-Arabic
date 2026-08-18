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
        <div className="w-full h-full flex flex-col items-center justify-between p-1 text-center select-none overflow-hidden">
          <span className="text-xl sm:text-2xl filter drop-shadow mt-0.5">
            {tile.icon}
          </span>
          <span className="text-[9px] sm:text-[11px] font-black text-amber-300 leading-tight px-0.5">
            {tile.name}
          </span>
          {tile.id === 0 ? (
            <span className="text-[7.5px] sm:text-[8.5px] text-emerald-300 font-bold font-mono bg-emerald-950/90 px-1.5 py-0.2 rounded-full border border-emerald-500/50 mb-0.5">
              +200 ر.س
            </span>
          ) : (
            <div className="h-1.5" />
          )}
        </div>
      ) : (
        /* =========================================================================
           2. REGULAR BOARD TILE (TOP, BOTTOM, LEFT, RIGHT)
           ========================================================================= */
        <div className="w-full h-full flex flex-col items-center justify-between p-0.5 select-none relative overflow-hidden">
          {/* Top Edge Color Stripe / Indicator */}
          {tile.price && (
            <div 
              className="w-full h-1.5 rounded-t-sm shrink-0"
              style={{ backgroundColor: groupStyle.main }}
            />
          )}

          {/* Icon / Flag Badge & Houses */}
          <div className="relative flex items-center justify-center shrink-0 my-0.5">
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs shadow border"
              style={{
                backgroundColor: '#0f172a',
                borderColor: groupStyle.main,
                boxShadow: owner ? `0 0 0 1.5px ${owner.color}` : 'none'
              }}
            >
              <span>{badgeEmoji}</span>
            </div>

            {/* Houses / Hotel Badge */}
            {houseCount > 0 && (
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-10">
                {houseCount === 5 ? (
                  <span className="text-[9px] filter drop-shadow">🏨</span>
                ) : (
                  <span className="text-[8px] bg-emerald-600 text-white font-bold px-1 rounded-full shadow">
                    🏠{houseCount}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* City / Property Name */}
          <div className="flex-1 flex flex-col items-center justify-center px-0.5 text-center min-h-0">
            <span className="text-[8px] sm:text-[9.5px] font-black text-slate-100 leading-tight line-clamp-2">
              {tile.name}
            </span>
            {isMortgaged && (
              <span className="text-[6.5px] bg-rose-950 text-rose-300 font-bold px-1 rounded border border-rose-600/60 mt-0.5">
                مرهون
              </span>
            )}
          </div>

          {/* Price / Tax Pill */}
          <div className="shrink-0 mb-0.5">
            {tile.price ? (
              <div className="bg-slate-950/90 border border-amber-500/40 text-amber-300 font-bold font-mono text-[7px] sm:text-[8px] px-1 py-0.2 rounded-full flex items-center gap-0.5 shadow-sm">
                <span>{tile.price}</span>
                <span className="text-[6px] text-amber-200/80">ر.س</span>
              </div>
            ) : tile.taxAmount ? (
              <div className="bg-rose-950/90 border border-rose-500/40 text-rose-200 font-bold font-mono text-[7px] sm:text-[8px] px-1 py-0.2 rounded-full">
                <span>-{tile.taxAmount}</span>
              </div>
            ) : (
              <div className="text-[8px] text-slate-400 font-medium">
                {tile.icon}
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
                boxShadow: `0 0 10px ${p.color}`
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
