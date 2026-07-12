"use client";

import React, { useEffect, useState } from 'react';

const FALLBACK_JOURNAL = {
  title: 'The Weight of Quiet Verandahs',
  content: `We have been thinking about the spaces that exist between things. Not the notes, but the silence that holds them together. Lately, Dhaka has been breathing differently; the summer heat sits heavily on red-brick walls. We sat on the verandah with a broken microphone and a guitar that refused to stay in tune, letting the tape roll. Some things belong in the archive simply because they happened to be there.`
};

export default function JournalSection() {
  const [journal, setJournal] = useState<{ title: string; content: string } | null>(null);
  const [typedText, setTypedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch journal from the API on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchJournal() {
      try {
        const res = await fetch('/api/generate-journal');
        if (!res.ok) throw new Error('Failed to fetch journal');
        const data = await res.json();

        if (!cancelled && data.title && data.content) {
          setJournal({ title: data.title, content: data.content });
        } else if (!cancelled) {
          setJournal(FALLBACK_JOURNAL);
        }
      } catch (err) {
        console.error('Journal fetch error:', err);
        if (!cancelled) {
          setJournal(FALLBACK_JOURNAL);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchJournal();
    return () => { cancelled = true; };
  }, []);

  // Typewriter effect — runs once journal data arrives
  useEffect(() => {
    if (!journal) return;

    setTypedText('');
    let index = 0;
    const fullContent = journal.content;
    const delay = Math.max(6, Math.round(11000 / fullContent.length));

    const interval = setInterval(() => {
      index++;
      setTypedText(fullContent.slice(0, index));
      if (index >= fullContent.length) {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [journal]);

  // Loading state — subtle archival aesthetic
  if (isLoading) {
    return (
      <div className="w-full select-none">
        <article className="space-y-4 w-full">
          <div className="h-10 sm:h-12 md:h-14 bg-ink/[0.04] rounded-xs animate-pulse" />
          <div className="space-y-2.5 min-h-[120px]">
            <div className="h-4 bg-ink/[0.04] rounded-xs animate-pulse w-full" />
            <div className="h-4 bg-ink/[0.04] rounded-xs animate-pulse w-[95%]" />
            <div className="h-4 bg-ink/[0.04] rounded-xs animate-pulse w-[88%]" />
            <div className="h-4 bg-ink/[0.04] rounded-xs animate-pulse w-[72%]" />
          </div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink/30 animate-pulse">
            The archive is breathing...
          </p>
        </article>
      </div>
    );
  }

  if (!journal) return null;

  const fullContent = journal.content;

  return (
    <div className="w-full select-none">
      <article className="space-y-4 w-full">
        {/* Title in Bold Plakatbau display font with tracking-wide as requested by the first screenshot */}
        <h2 className="font-plakatbau text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide text-ink leading-[0.95] uppercase transition-all duration-300">
          {journal.title}
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
