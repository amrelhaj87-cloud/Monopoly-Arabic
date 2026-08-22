import React from 'react';

interface KofiButtonProps {
  username?: string;
}

export const KofiButton: React.FC<KofiButtonProps> = ({ username = "zerocold" }) => {
  return (
    <a
      href={`https://ko-fi.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0f172a] font-black text-xs rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      title="ادعم المطور على Ko-fi ☕"
    >
      <span className="text-sm leading-none">☕</span>
      <span className="hidden sm:inline font-bold">دعم</span>
    </a>
  );
};

export default KofiButton;
