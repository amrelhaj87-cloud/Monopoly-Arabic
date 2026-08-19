import React from 'react';

interface PlayerBlobProps {
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'pawn';
  className?: string;
}

export const PlayerBlob: React.FC<PlayerBlobProps> = ({ 
  color = '#f59e0b', 
  size = 'md', 
  className = ''
}) => {
  // Proportional eye dimensions and positioning for each size
  const sizeMap = {
    pawn: { size: 24, eyeW: 4.5, eyeH: 5.5, pupil: 2.8, catch1: 1.2, catch2: 0.6, gap: 1.5, top: 7 },
    sm:   { size: 26, eyeW: 5.0, eyeH: 6.0, pupil: 3.0, catch1: 1.3, catch2: 0.7, gap: 1.8, top: 8 },
    md:   { size: 40, eyeW: 7.5, eyeH: 9.0, pupil: 4.5, catch1: 1.8, catch2: 0.9, gap: 2.5, top: 12 },
    lg:   { size: 60, eyeW: 11.0, eyeH: 13.0, pupil: 6.5, catch1: 2.6, catch2: 1.3, gap: 4.0, top: 18 },
    xl:   { size: 84, eyeW: 15.0, eyeH: 18.0, pupil: 9.0, catch1: 3.6, catch2: 1.8, gap: 5.5, top: 25 },
  };

  const config = sizeMap[size] || sizeMap.md;
  const s = config.size;

  return (
    <div
      className={`relative rounded-full flex items-center justify-center select-none shrink-0 transition-transform ${className}`}
      style={{
        width: `${s}px`,
        height: `${s}px`,
        backgroundColor: color,
        boxShadow: `0 4px 12px rgba(0,0,0,0.45), 0 0 14px ${color}60, inset 0 2px 5px rgba(255,255,255,0.45)`,
        border: size === 'pawn' ? '1.5px solid rgba(255,255,255,0.95)' : '2px solid rgba(255,255,255,0.9)'
      }}
    >
      {/* 3D Gloss Highlight */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)'
        }}
      />

      {/* Expressive Shiny Cartoon Eyes */}
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Left Eye */}
        <g transform={`translate(${s / 2 - config.gap - config.eyeW}, ${config.top})`}>
          {/* White Sclera with subtle depth border */}
          <ellipse
            cx={config.eyeW / 2}
            cy={config.eyeH / 2}
            rx={config.eyeW / 2}
            ry={config.eyeH / 2}
            fill="#ffffff"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="0.6"
          />
          {/* Pupil */}
          <circle
            cx={config.eyeW / 2 + 0.2}
            cy={config.eyeH / 2 + 0.3}
            r={config.pupil / 2}
            fill="#0f172a"
          />
          {/* Primary Shine / Catchlight (Sparkle) */}
          <circle
            cx={config.eyeW / 2 - 0.4}
            cy={config.eyeH / 2 - 0.7}
            r={config.catch1 / 2}
            fill="#ffffff"
          />
          {/* Secondary Tiny Catchlight */}
          <circle
            cx={config.eyeW / 2 + 0.7}
            cy={config.eyeH / 2 + 0.7}
            r={config.catch2 / 2}
            fill="#ffffff"
          />
        </g>

        {/* Right Eye */}
        <g transform={`translate(${s / 2 + config.gap}, ${config.top})`}>
          {/* White Sclera with subtle depth border */}
          <ellipse
            cx={config.eyeW / 2}
            cy={config.eyeH / 2}
            rx={config.eyeW / 2}
            ry={config.eyeH / 2}
            fill="#ffffff"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="0.6"
          />
          {/* Pupil */}
          <circle
            cx={config.eyeW / 2 + 0.2}
            cy={config.eyeH / 2 + 0.3}
            r={config.pupil / 2}
            fill="#0f172a"
          />
          {/* Primary Shine / Catchlight (Sparkle) */}
          <circle
            cx={config.eyeW / 2 - 0.4}
            cy={config.eyeH / 2 - 0.7}
            r={config.catch1 / 2}
            fill="#ffffff"
          />
          {/* Secondary Tiny Catchlight */}
          <circle
            cx={config.eyeW / 2 + 0.7}
            cy={config.eyeH / 2 + 0.7}
            r={config.catch2 / 2}
            fill="#ffffff"
          />
        </g>
      </svg>
    </div>
  );
};
