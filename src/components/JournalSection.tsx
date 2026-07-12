"use client";

import React, { useEffect, useState } from 'react';
import { MOCK_JOURNAL } from '../data';

export default function JournalSection() {
  const [typedText, setTypedText] = useState('');
  const fullContent = MOCK_JOURNAL.content;

  useEffect(() => {
    setTypedText('');
    let index = 0;
    const delay = Math.max(6, Math.round(11000 / fullContent.length));

    const interval = setInterval(() => {
      index++;
      setTypedText(fullContent.slice(0, index));
      if (index >= fullContent.length) {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full select-none">
      <article className="space-y-4 w-full">
        {/* Title in Bold Plakatbau display font with tracking-wide as requested by the first screenshot */}
        <h2 className="font-plakatbau text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide text-ink leading-[0.95] uppercase transition-all duration-300">
          {MOCK_JOURNAL.title}
        </h2>

        {/* Typewriter text block */}
        <div className="relative font-garamond text-base sm:text-lg md:text-xl lg:text-[1.4rem] text-ink/90 leading-relaxed max-w-xl min-h-[120px]">
          {/* Invisible layout-stable placeholder */}
          <div className="invisible select-none pointer-events-none whitespace-pre-wrap font-garamond">
            {fullContent}
            <span className="inline-block w-2 h-4.5 bg-accent ml-1 align-middle" />
          </div>
          
          {/* Actual typed text absolute overlay */}
          <div className="absolute inset-0 select-text whitespace-pre-wrap font-garamond">
            {typedText}
            <span className="inline-block w-2 h-4.5 bg-accent animate-pulse ml-1 align-middle" />
          </div>
        </div>
      </article>
    </div>
  );
}
