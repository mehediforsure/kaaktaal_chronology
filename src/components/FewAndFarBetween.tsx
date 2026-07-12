"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURATED_COLLECTIONS, CuratedCollection, CuratedSong } from '../data/few-and-far-between';
import SongPage from './SongPage';
import { BookOpen, Music, Play, Pause, ArrowLeft, Calendar } from 'lucide-react';
import useEngagement from '../hooks/useEngagement';
import { getOptimizedImageUrl } from '../utils/image';
import shobEkhaneKolpona from '../assets/shob_ekhane_kolpona.png';

export default function FewAndFarBetween() {
  const { logAction } = useEngagement();
  const [selectedCollection, setSelectedCollection] = useState<CuratedCollection | null>(null);
  const [selectedSong, setSelectedSong] = useState<CuratedSong | null>(null);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [hoveredCollection, setHoveredCollection] = useState<CuratedCollection | null>(null);

  const handleOpenCollection = (collection: CuratedCollection) => {
    logAction('finder_usage');
    setSelectedCollection(collection);
  };

  const handleCloseCollection = () => {
    setSelectedCollection(null);
  };

  const handleOpenSong = (song: CuratedSong) => {
    setSelectedSong(song);
  };

  const handleCloseSong = () => {
    setSelectedSong(null);
  };

  const handleToggleListen = (songId: string) => {
    logAction('journal_interaction');
    if (playingSongId === songId) {
      setPlayingSongId(null);
    } else {
      setPlayingSongId(songId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 select-none min-h-[80vh] text-ink">
      
      <AnimatePresence mode="wait">
        {/* If a specific song is selected, display the full-fidelity modular Song Page */}
        {selectedSong ? (
          <motion.div
            key="song-detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
          >
            <SongPage
              songTitle={selectedSong.title}
              albumTitle={selectedSong.album}
              onClose={handleCloseSong}
              defaultLyrics={selectedSong.lyrics}
              defaultStory={selectedSong.story}
            />
          </motion.div>
        ) : !selectedCollection ? (
          /* Landing Page */
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Page Header */}
            <div className="border-b-2 border-ink pb-8 flex flex-col md:flex-row justify-between items-baseline gap-4 select-none">
              <div>
                <h3 className="font-syne text-3xl font-extrabold uppercase tracking-tighter text-ink mt-2">
                  Few &amp; Far Between
                </h3>
              </div>
            </div>

            {/* Collections Grid - Equal square shape and minimal clean look */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {CURATED_COLLECTIONS.map((col, index) => (
                <motion.div
                  key={col.id}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="aspect-square relative border-2 border-ink bg-bg rounded-sm overflow-hidden shadow-[4px_4px_0px_rgba(17,17,19,0.15)] group cursor-pointer"
                  onMouseEnter={() => setHoveredCollection(col)}
                  onMouseLeave={() => setHoveredCollection(null)}
                  onClick={() => handleOpenCollection(col)}
                >
                  {/* Card Cover Canvas */}
                  <div className="w-full h-full relative">
                    {col.coverUrl ? (
                      <img
                        src={getOptimizedImageUrl(col.coverUrl, 600)}
                        alt={col.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102 filter grayscale group-hover:grayscale-0 duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={shobEkhaneKolpona.src}
                        alt={col.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102 filter grayscale group-hover:grayscale-0 duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Minimal Hover Overlay - clean color tint */}
                    <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>


          </motion.div>
        ) : (
          /* Collection Detail Page */
          <motion.div
            key="collection-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            {/* Back to landing */}
            <div>
              <button
                onClick={handleCloseCollection}
                className="text-ink hover:text-accent transition-transform hover:-translate-x-1 duration-200 cursor-pointer p-1"
                aria-label="Back to collections"
              >
                <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Collection details banner */}
            <div className="border-2 border-ink p-6 md:p-8 rounded-sm bg-ink/[0.02] shadow-[3px_3px_0px_rgba(17,17,19,0.1)] relative overflow-hidden">
              <div className="max-w-3xl space-y-3 relative z-10">
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold px-2 py-0.5 border border-accent/20 rounded-xs inline-block">
                  Bespoke Anthology
                </span>
                <h2 className="font-syne text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-ink">
                  {selectedCollection.title}
                </h2>
                <p className="font-sans text-sm md:text-base text-ink/80 leading-relaxed italic border-l-4 border-accent pl-4">
                  "{selectedCollection.description}"
                </p>
              </div>

              {/* Decorative paper background circles */}
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full border-4 border-ink/5 pointer-events-none" />
            </div>

            {/* Songs Grid / list */}
            <div className="space-y-6">
              <div className="border-b border-ink/15 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50 font-extrabold">
                  INDEXED ARCHIVE SONGS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCollection.songs.map((song) => {
                  const isPlaying = playingSongId === song.id;
                  return (
                    <motion.div
                      key={song.id}
                      className="border-2 border-ink p-5 rounded-xs bg-bg shadow-[3px_3px_0px_rgba(17,17,19,0.1)] relative flex flex-col justify-between hover:border-accent duration-300 group"
                    >
                      <div className="space-y-4">
                        {/* Title and metadata */}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-ink group-hover:text-accent transition-colors">
                              {song.title}
                            </h3>
                            <span className="font-mono text-[9px] text-ink/50 uppercase block mt-0.5">
                              {song.album}
                            </span>
                          </div>
                          {song.duration && (
                            <span className="font-mono text-xs text-ink/40 font-bold">
                              [{song.duration}]
                            </span>
                          )}
                        </div>

                        {/* Hand-curated intimate Reason Quote box */}
                        <div className="py-4 px-4 bg-ink/[0.02] border-l-2 border-accent border-y border-r border-ink/5 rounded-r-xs my-2">
                          <p className="font-garamond text-md md:text-lg italic font-semibold text-ink leading-relaxed">
                            {song.reason}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-ink/5 mt-4">
                        <button
                          onClick={() => handleToggleListen(song.id)}
                          className={`font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 py-1 px-3 border rounded-xs transition-colors cursor-pointer select-none font-bold ${
                            isPlaying
                              ? 'bg-accent text-bg border-accent animate-pulse'
                              : 'border-ink/20 hover:border-ink hover:bg-ink-faint text-ink/75 hover:text-ink'
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3 h-3" /> Stop Preview
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" /> Listen Vibe
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenSong(song)}
                          className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 py-1 px-3 bg-ink hover:bg-accent border border-ink hover:border-accent text-bg rounded-xs transition-colors cursor-pointer select-none font-bold shadow-sm"
                        >
                          Open Song ✦
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
