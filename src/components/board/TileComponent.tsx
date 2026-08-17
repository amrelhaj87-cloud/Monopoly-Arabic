import React from 'react';
import { TileData, Player } from '../../types/game';
import { GROUP_COLORS } from '../../constants/boardData';
import { Home } from 'lucide-react';

interface TileComponentProps {
  tile: TileData;
  gridRow: number;
  gridCol: number;
  owner?: Player;
  playersOnTile: Player[];
  onTileClick: (tile: TileData) => void;
  isHighlighted?: boolean;
}

export const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  gridRow,
  gridCol,
  owner,
  playersOnTile,
  onTileClick,
  isHighlighted
}) => {
  const isCorner = tile.type === 'go' || tile.type === 'jail' || tile.type === 'free_parking' || tile.type === 'go_to_jail';
  const groupStyle = GROUP_COLORS[tile.group] || GROUP_COLORS['special'];
  const houseCount = owner?.houses[tile.id] || 0;
  const isMortgaged = owner?.mortgaged[tile.id] || false;

  // Determine orientation based on grid position for banners
  const isTop = gridRow === 1;
  const isBottom = gridRow === 11;
  const isLeft = gridCol === 1;
  const isRight = gridCol === 11;

  return (
    <div
      onClick={() => onTileClick(tile)}
      style={{
        gridRow,
        gridColumn: gridCol
      }}
      className={`board-tile ${isCorner ? 'corner-tile' : ''} ${isHighlighted ? 'highlighted' : ''} ${
        owner ? 'has-owner' : ''
      }`}
    >
      {/* Property Color Banner for Street Tiles */}
      {tile.type === 'property' && (
        <div
          className="w-full h-3.5 sm:h-4.5 rounded-sm flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm"
          style={{
            backgroundColor: groupStyle.main,
            borderBottom: isTop ? `2px solid ${groupStyle.border}` : 'none',
            borderTop: isBottom ? `2px solid ${groupStyle.border}` : 'none'
          }}
        >
          {/* Houses / Hotels Indicator */}
          {houseCount > 0 && (
            <div className="flex items-center gap-0.5 px-1">
              {houseCount === 5 ? (
                <span className="text-xs bg-red-600 text-white font-black px-1 rounded shadow animate-pulse">
                  🏨 فندق
                </span>
              ) : (
                Array.from({ length: houseCount }).map((_, i) => (
                  <span key={i} className="text-[10px] text-emerald-300">
                    🏠
                  </span>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center text-center p-0.5 overflow-hidden">
        {/* Icon / Emoji */}
        <span className={`${isCorner ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'} my-0.5`}>
          {tile.icon}
        </span>

        {/* Tile Arabic Name */}
        <span
          className={`font-bold leading-tight line-clamp-2 ${
            isCorner ? 'text-xs sm:text-sm text-amber-300' : 'text-[9px] sm:text-[11px] text-slate-100'
          }`}
        >
          {tile.name}
        </span>

        {/* English Subtitle (optional for style) */}
        {tile.englishName && !isCorner && (
          <span className="text-[7px] text-slate-400 font-en uppercase tracking-wider hidden sm:block">
            {tile.englishName}
          </span>
        )}

        {/* Mortgage Notice */}
        {isMortgaged && (
          <span className="bg-rose-900/90 text-rose-200 text-[8px] font-bold px-1 rounded mt-0.5 border border-rose-500">
            مرهون 🔒
          </span>
        )}
      </div>

      {/* Footer: Price or Tax Amount or Owner Pill */}
      {!isCorner && (
        <div className="w-full text-center py-0.5 mt-auto bg-slate-900/80 rounded-b flex items-center justify-between px-1 text-[8px] sm:text-[10px]">
          {tile.price ? (
            <span className="text-amber-400 font-mono font-bold mx-auto">{tile.price} ر.س</span>
          ) : tile.taxAmount ? (
            <span className="text-rose-400 font-mono font-bold mx-auto">ادفع {tile.taxAmount}</span>
          ) : (
            <span className="text-slate-400 mx-auto">-</span>
          )}

          {/* Owner Color Dot */}
          {owner && (
            <span
              className="w-2.5 h-2.5 rounded-full border border-white shadow-sm shrink-0"
              style={{ backgroundColor: owner.color }}
              title={`مملوك لـ: ${owner.name}`}
            />
          )}
        </div>
      )}

      {/* Players Pawns on this tile */}
      {playersOnTile.length > 0 && (
        <div className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-center gap-1 p-1 z-30">
          {playersOnTile.map((p) => (
            <div
              key={p.id}
              className="token-pawn token-active-pulse"
              style={{
                backgroundColor: p.color,
                borderColor: '#ffffff',
                boxShadow: `0 0 8px ${p.color}`
              }}
              title={p.name}
            >
              <span className="text-xs">{p.avatar}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
