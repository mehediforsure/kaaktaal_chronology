"use client";

import React, { useState } from 'react';
import { ActiveRoom } from '../types';
import { getOptimizedImageUrl } from '../utils/image';

interface CardProps {
  onRoomChange: (room: ActiveRoom) => void;
  isShrunk?: boolean;
}

export function PortalCard({ onRoomChange }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = getOptimizedImageUrl("https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/portal.png", 800);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onRoomChange('portal')}
      className={`relative w-full p-5 md:p-6 h-28 sm:h-36 md:h-40 lg:h-44 xl:h-48 2xl:h-52 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 border-2 border-ink rounded-sm shadow-[2px_2px_0px_rgba(17,17,19,0.15)] cursor-pointer overflow-hidden ${
        isHovered
          ? 'bg-ink text-accent -translate-y-0.5 shadow-[4px_4px_0px_rgba(17,17,19,0.3)]'
          : 'bg-bg text-ink'
      }`}
    >
      <img
        src={imageUrl}
        alt="The Portal background"
        referrerPolicy="no-referrer"
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 pointer-events-none ${
          isHovered ? 'opacity-85 scale-105' : 'opacity-55'
        }`}
      />
      <div className="relative z-10 w-full h-full flex items-center justify-center px-1">
        <h3 
          className="font-plakatbau text-4xl sm:text-6xl md:text-7xl lg:text-[6.2rem] xl:text-[7.2rem] 2xl:text-[8.5rem] font-extrabold uppercase tracking-wide leading-none select-none whitespace-nowrap transition-all duration-300"
          style={
            isHovered
              ? {
                  color: '#111113',
                  WebkitTextStroke: '2px #F8F7F4',
                }
              : {}
          }
        >
          The Portal
        </h3>
      </div>
    </div>
  );
}

export function FinderCard({ onRoomChange, isShrunk = false }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const textureUrl = getOptimizedImageUrl("https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/texture.jpg", 800);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onRoomChange('finder')}
      className={`relative flex flex-col items-center justify-center text-center transition-all duration-300 border border-ink rounded-sm shadow-[2px_2px_0px_rgba(17,17,19,0.15)] cursor-pointer ${
        isShrunk
          ? 'w-[24px] h-18 sm:w-auto sm:h-[30px] px-2 sm:px-3 max-sm:translate-y-6 max-sm:-translate-x-1.5'
          : 'p-2 md:p-0 h-18 sm:h-22 md:h-26 lg:h-30 xl:h-34 2xl:h-38'
      } ${
        isHovered
          ? 'bg-ink text-bg -translate-y-0.5 shadow-[4px_4px_0px_rgba(17,17,19,0.3)]'
          : 'bg-bg text-ink'
      }`}
    >
      <img
        src={textureUrl}
        alt="The Finder texture"
        referrerPolicy="no-referrer"
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 pointer-events-none rounded-sm ${
          isHovered ? 'opacity-40 invert scale-105' : 'opacity-20'
        }`}
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center p-0">
        <h3 className={`font-plakatbau font-extrabold uppercase tracking-widest leading-none select-none whitespace-nowrap ${
          isShrunk 
            ? 'text-[18px] sm:text-[28px] max-sm:[writing-mode:vertical-rl] max-sm:rotate-180' 
            : 'text-[68px] sm:text-[84px] md:text-[104px] lg:text-[120px] xl:text-[136px] 2xl:text-[152px]'
        }`}>
          Finder
        </h3>
      </div>
    </div>
  );
}
