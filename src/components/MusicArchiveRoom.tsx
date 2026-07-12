"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALBUMS } from '../data';
import { Album } from '../types';
import useEngagement from '../hooks/useEngagement';
import SongPage from './SongPage';
import { getOptimizedImageUrl } from '../utils/image';

interface MusicArchiveRoomProps {
  onSelectAlbum?: (album: Album) => void;
}

export default function MusicArchiveRoom({ onSelectAlbum }: MusicArchiveRoomProps) {
  const { logAction } = useEngagement();
  const [hoveredAlbum, setHoveredAlbum] = useState<Album | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [selectedSongTrack, setSelectedSongTrack] = useState<string | null>(null);

  // Dynamic atmospheric overlay style based on hovered album
  const getAtmosphericColor = () => {
    if (!hoveredAlbum) return 'bg-bg';
    // Subtly transition colors based on the album id
    switch (hoveredAlbum.id) {
      case 'na-koite-pari':
        return 'bg-[#f3eee2]'; // Deep warm antique paper
      case 'dinkal-ajkal':
        return 'bg-[#ece9e2]'; // Cooler weathered tint
      case 'karagarer-gaan':
        return 'bg-[#e5e4de]'; // Slate stone tint
      default:
        return 'bg-bg'; // Default warm paper
    }
  };

  const handleSelect = (album: Album) => {
    logAction('song_opened');
    setSelectedAlbum(album);
    if (onSelectAlbum) {
      onSelectAlbum(album);
    }
  };

  return (
    <div className={`transition-colors duration-1000 min-h-[90vh] pb-24 ${getAtmosphericColor()}`}>
      <AnimatePresence mode="wait">
        {!selectedAlbum ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-6 pt-12 md:pt-16 space-y-16"
          >
            {/* Header */}
            <div className="border-b-2 border-ink pb-8 flex flex-col md:flex-row justify-between items-baseline gap-4 select-none">
              <div>
                <h3 className="font-syne text-3xl font-extrabold uppercase tracking-tighter text-ink mt-2">
                  The Complete Recorded Works
                </h3>
              </div>
            </div>

            {/* Immersive Grid - Equal square shape and minimal clean look */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {ALBUMS.map((album, index) => (
                <motion.div
                  key={album.id}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="aspect-square relative border-2 border-ink bg-bg rounded-sm overflow-hidden shadow-[4px_4px_0px_rgba(17,17,19,0.15)] group cursor-pointer"
                  onMouseEnter={() => setHoveredAlbum(album)}
                  onMouseLeave={() => setHoveredAlbum(null)}
                  onClick={() => handleSelect(album)}
                >
                  {/* Album Cover Canvas */}
                  <div className="w-full h-full relative">
                    <img
                      src={getOptimizedImageUrl(album.coverUrl, 600)}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102 filter grayscale group-hover:grayscale-0 duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    {/* Minimal Hover Overlay - clean color tint */}
                    <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>


          </motion.div>
        ) : selectedSongTrack ? (
          <motion.div
            key="song-detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SongPage
              songTitle={selectedSongTrack}
              albumTitle={selectedAlbum.title}
              onClose={() => setSelectedSongTrack(null)}
            />
          </motion.div>
        ) : (
          /* PLACEHOLDER ALBUM DETAIL VIEW (Built with high design fidelity) */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto px-6 pt-12 md:pt-16 space-y-12"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedAlbum(null)}
              className="font-mono text-xs uppercase tracking-widest text-ink hover:text-bg hover:bg-ink border-2 border-ink py-2 px-4 rounded-xs transition-colors cursor-pointer font-bold select-none"
            >
              ← Back to Recorded Works
            </button>

            {/* Album Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
              
              {/* Left Side: Artwork (Spans 5 cols) */}
              <div className="md:col-span-5 space-y-6">
                <div className="aspect-square bg-neutral-200 border-2 border-ink overflow-hidden rounded-sm shadow-[4px_4px_0px_rgba(17,17,19,0.15)]">
                  <img
                    src={getOptimizedImageUrl(selectedAlbum.coverUrl, 600)}
                    alt={selectedAlbum.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="border-2 border-ink p-6 bg-bg rounded-sm space-y-4 shadow-[4px_4px_0px_rgba(17,17,19,0.1)]">
                  <h5 className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold select-none">
                    Archive Technical Note
                  </h5>
                  <div className="font-mono text-xs text-ink/75 space-y-2 leading-relaxed">
                    <p>Catalogue Reference: #KT-{selectedAlbum.id.toUpperCase()}-{selectedAlbum.year}</p>
                    <p>Format: High-Bias Ferrite Cassette Tape (C60)</p>
                    <p>Microphones: Tape Internal Omnidirectional Condenser</p>
                    <p>Status: Preserved inside physical vault box 04</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Details & Tracklist (Spans 7 cols) */}
              <div className="md:col-span-7 space-y-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 select-none">
                    <span className="font-mono text-xs text-ink/65 uppercase tracking-wider">
                      {selectedAlbum.year} LP RELEASE
                    </span>
                    <span className="w-1.5 h-1.5 bg-accent" />
                    <span className="font-mono text-xs text-ink/65 uppercase tracking-wider">
                      VAULT BOX #4
                    </span>
                  </div>
                  <h3 className="font-syne text-3xl md:text-4xl font-extrabold uppercase tracking-tighter text-ink leading-none">
                    {selectedAlbum.title}
                  </h3>
                </div>

                {/* Narrative / Description */}
                <p className="font-sans text-lg text-ink/80 leading-relaxed italic border-l-4 border-accent pl-4">
                  "{selectedAlbum.description}"
                </p>

                {/* Tracklist List */}
                <div className="space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-accent font-bold border-b-2 border-ink pb-2 select-none">
                    Indexed Tracks
                  </h4>
                  <div className="divide-y-2 divide-ink-faint font-sans">
                    {selectedAlbum.tracks.map((track, idx) => (
                      <div 
                        key={idx} 
                        className="py-3.5 flex items-center justify-between group hover:bg-ink-faint transition-colors px-2"
                      >
                        <div 
                          className="flex items-center gap-4 cursor-pointer flex-1"
                          onClick={() => {
                            logAction('song_opened');
                            setSelectedSongTrack(track);
                          }}
                        >
                          <span className="font-mono text-xs text-ink/40 font-bold select-none">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-lg font-bold text-ink uppercase tracking-tight font-syne flex items-center gap-2 group-hover:text-accent transition-all duration-300">
                            {track}
                            {playingTrack === track && (
                              <span className="text-xs text-accent font-mono animate-pulse uppercase tracking-widest pl-2">
                                ● Playing Vibe...
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              logAction('journal_interaction');
                              if (playingTrack === track) {
                                setPlayingTrack(null);
                              } else {
                                setPlayingTrack(track);
                              }
                            }}
                            className="font-mono text-[10px] text-accent uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity select-none cursor-pointer border border-accent/20 px-2 py-1 rounded-xs hover:bg-accent/5"
                          >
                            {playingTrack === track ? 'Stop Vibe' : 'Play Vibe'}
                          </button>
                          
                          <button
                            onClick={() => {
                              logAction('song_opened');
                              setSelectedSongTrack(track);
                            }}
                            className="font-mono text-[10px] text-bg bg-ink uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity select-none cursor-pointer px-2.5 py-1 rounded-xs hover:bg-accent hover:border-accent"
                          >
                            Open Song ✦
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Journal entry specific to that Album */}
                {selectedAlbum.journalExcerpt && (
                  <div className="border-t-2 border-ink pt-8 space-y-3">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-accent font-bold select-none">
                      Diary Excerpt Included in Sleeve
                    </h4>
                    <p className="font-sans text-base text-ink opacity-80 leading-relaxed bg-bg p-6 border-2 border-ink rounded-sm shadow-[4px_4px_0px_rgba(17,17,19,0.1)] whitespace-pre-line">
                      {selectedAlbum.journalExcerpt}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
