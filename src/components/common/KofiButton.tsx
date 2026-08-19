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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff5e5b] hover:bg-[#e04a47] text-white font-black text-xs rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95 border border-[#ff8380]/60 select-none cursor-pointer"
      title="ادعم المطور على Ko-fi ☕"
    >
      <span className="text-sm leading-none">☕</span>
      <span className="hidden sm:inline whitespace-nowrap font-bold">ادعمنا على Ko-fi</span>
    </a>
  );
};

export default KofiButton;
