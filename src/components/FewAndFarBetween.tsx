"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURATED_COLLECTIONS, CuratedCollection, CuratedSong } from '../data/few-and-far-between';
import SongPage from './SongPage';
import { ArrowLeft, Search, Music, Sparkles } from 'lucide-react';
import useEngagement from '../hooks/useEngagement';
import { getOptimizedImageUrl } from '../utils/image';
import shobEkhaneKolpona from '../assets/shob_ekhane_kolpona.png';
import { fetchUnreleasedTracks, UnreleasedTrack } from '../lib/supabase';

export default function FewAndFarBetween() {
  const { logAction } = useEngagement();
  const [selectedCollection, setSelectedCollection] = useState<CuratedCollection | null>(null);
  const [selectedSong, setSelectedSong] = useState<CuratedSong | null>(null);
  const [hoveredCollection, setHoveredCollection] = useState<CuratedCollection | null>(null);
  const [unreleasedTracks, setUnreleasedTracks] = useState<UnreleasedTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'collections' | 'all'>('collections');

  useEffect(() => {
    async function loadTracks() {
      try {
        const data = await fetchUnreleasedTracks();
        if (data && data.length > 0) {
          setUnreleasedTracks(data);
        }
      } catch (err) {
        console.error('Failed to load unreleased tracks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTracks();
  }, []);

  // Map unreleased tracks from Supabase into CuratedSong list
  const supabaseSongs: CuratedSong[] = useMemo(() => {
    return unreleasedTracks.map((t) => {
      const lyricLines = (t.lyrics || '').split('\n').map(l => l.trim()).filter(Boolean);
      const quote = lyricLines.length > 0 ? `“${lyricLines[0]}”` : `“${t.title_en}”`;

      return {
        song_id: t.song_id,
        id: t.song_id,
        title_en: t.title_en,
        title_bn: t.title_bn || undefined,
        album: 'Unreleased Archives // Few & Far Between',
        lyrics_available: !!t.lyrics,
        status: t.status || 'Unreleased',
        description_short: quote,
        description_long: t.lyrics,
        lyrics: t.lyrics,
        youtube_url: t.youtube_url,
        spotify_url: t.spotify_url
      };
    });
  }, [unreleasedTracks]);

  // Dynamically partition Supabase tracks into collections if loaded, or use default collections
  const collectionsToRender: CuratedCollection[] = useMemo(() => {
    if (supabaseSongs.length === 0) {
      return CURATED_COLLECTIONS;
    }

    // Partition tracks into 6 curated collections
    const chunkSize = Math.ceil(supabaseSongs.length / 6);
    const titles = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
    const descriptions = [
      'Unreleased cassette recordings and early bedroom loops discovered in dusty crates.',
      'Acoustic sketches and broadcast frequencies recorded for late-night listeners.',
      'Outtakes and overlooked notes floating down quiet corridors.',
      'Monsoon drafts recorded under heavy rains on rustic single microphones.',
      'Unfinished tape fragments and raw lyric scribbles saved from forgotten vaults.',
      'Archival drafts and quiet whispers captured before studio production.'
    ];

    return titles.map((title, idx) => {
      const start = idx * chunkSize;
      const end = start + chunkSize;
      const songsChunk = supabaseSongs.slice(start, end);
      return {
        id: `unreleased-col-${idx + 1}`,
        title,
        description: descriptions[idx] || 'Curated unreleased song drafts.',
        songCount: songsChunk.length,
        coverUrl: '',
        songs: songsChunk
      };
    });
  }, [supabaseSongs]);

  // Filtered list for "All Songs" tab or search query
  const filteredAllSongs = useMemo(() => {
    const list = supabaseSongs.length > 0 ? supabaseSongs : CURATED_COLLECTIONS.flatMap(c => c.songs);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(s => 
      (s.title_en && s.title_en.toLowerCase().includes(q)) ||
      (s.title_bn && s.title_bn.toLowerCase().includes(q)) ||
      (s.song_id && s.song_id.toLowerCase().includes(q)) ||
      (s.lyrics && s.lyrics.toLowerCase().includes(q))
    );
  }, [searchQuery, supabaseSongs]);

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
              song_id={selectedSong.song_id || selectedSong.id}
              title_en={selectedSong.title_en || selectedSong.title}
              title_bn={selectedSong.title_bn}
              album={selectedSong.album}
              duration={selectedSong.duration}
              year_released={selectedSong.year_released}
              cover_image={selectedSong.cover_image}
              youtube_url={selectedSong.youtube_url}
              spotify_url={selectedSong.spotify_url}
              lyrics_available={selectedSong.lyrics_available}
              status={selectedSong.status}
              description_short={selectedSong.description_short || selectedSong.reason}
              description_long={selectedSong.description_long || selectedSong.story}
              lyrics={selectedSong.lyrics}
              onClose={handleCloseSong}
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
            className="space-y-8"
          >
            {/* Page Header */}
            <div className="border-b-2 border-ink pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 select-none">
              <div>
                <h3 className="font-syne text-3xl md:text-4xl font-extrabold uppercase tracking-tighter text-ink mt-2">
                  Few &amp; Far Between
                </h3>
              </div>

              {/* View mode switcher & Search input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <div className="flex border-2 border-ink rounded-xs bg-bg overflow-hidden divide-x-2 divide-ink text-xs font-syne font-extrabold uppercase">
                  <button
                    onClick={() => setActiveTab('collections')}
                    className={`px-3 py-1.5 transition-colors ${
                      activeTab === 'collections' ? 'bg-ink text-bg' : 'text-ink hover:bg-ink/5'
                    }`}
                  >
                    Collections
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 transition-colors ${
                      activeTab === 'all' ? 'bg-ink text-bg' : 'text-ink hover:bg-ink/5'
                    }`}
                  >
                    All Songs ({supabaseSongs.length || CURATED_COLLECTIONS.flatMap(c => c.songs).length})
                  </button>
                </div>

                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lyrics or titles..."
                    className="w-full pl-9 pr-3 py-1.5 border-2 border-ink bg-bg text-xs font-sans text-ink focus:outline-none focus:border-accent rounded-xs"
                  />
                </div>
              </div>
            </div>

            {/* Render Tab Content: Search mode, Collections mode, or All Songs mode */}
            {searchQuery.trim() || activeTab === 'all' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-ink/15 pb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50 font-extrabold">
                    {searchQuery.trim() ? `SEARCH RESULTS (${filteredAllSongs.length})` : `ALL UNRELEASED TRACKS (${filteredAllSongs.length})`}
                  </span>
                </div>

                {filteredAllSongs.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-ink/20 text-center rounded-xs">
                    <p className="font-sans text-sm text-ink/50 italic">
                      No matching song lyrics found for "{searchQuery}".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAllSongs.map((song) => {
                      const currentSongId = song.song_id || song.id || song.title_en;
                      const displayTitle = song.title_en || song.title;
                      return (
                        <motion.div
                          key={currentSongId}
                          whileHover={{ y: -2 }}
                          className="border-2 border-ink p-5 rounded-xs bg-bg shadow-[3px_3px_0px_rgba(17,17,19,0.1)] relative flex flex-col justify-between hover:border-accent duration-300 group"
                        >
                          <div className="space-y-4">
                            {/* Title and metadata */}
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-ink group-hover:text-accent transition-colors flex items-baseline gap-2">
                                  <span>{displayTitle}</span>
                                  {song.title_bn && (
                                    <span className="text-[15px] font-serif text-ink/60 font-normal">
                                      ({song.title_bn})
                                    </span>
                                  )}
                                </h3>
                                <span className="font-mono text-[9px] text-ink/50 uppercase block mt-0.5">
                                  {song.song_id ? `ID: ${song.song_id}` : song.album}
                                </span>
                              </div>
                              <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-ink/20 font-bold text-accent rounded-xs">
                                {song.status || 'Unreleased'}
                              </span>
                            </div>

                            {/* Quote snippet box */}
                            <div className="py-3 px-4 bg-ink/[0.02] border-l-2 border-accent border-y border-r border-ink/5 rounded-r-xs my-2">
                              <p className="font-garamond text-md md:text-lg italic font-semibold text-ink leading-relaxed line-clamp-3">
                                {song.description_short || song.reason}
                              </p>
                            </div>
                          </div>

                          {/* Action button */}
                          <div className="flex items-center justify-end pt-4 border-t border-ink/5 mt-4">
                            <button
                              onClick={() => handleOpenSong(song)}
                              className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 py-1 px-3 bg-ink hover:bg-accent border border-ink hover:border-accent text-bg rounded-xs transition-colors cursor-pointer select-none font-bold shadow-sm"
                            >
                              Open Song Lyrics
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Collections Grid - Equal square shape and minimal clean look */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {collectionsToRender.map((col) => (
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
                      
                      {/* Dynamic Title overlay on top of cover image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-6 flex flex-col justify-end text-bg transition-opacity duration-300">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
                          Anthology {col.title}
                        </span>
                        <h4 className="font-syne text-2xl font-extrabold uppercase tracking-tight text-bg">
                          Collection {col.title}
                        </h4>
                        <span className="font-mono text-[10px] text-bg/70 block mt-1">
                          {col.songCount} Archived Tracks
                        </span>
                      </div>

                      {/* Minimal Hover Overlay */}
                      <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
                  Collection {selectedCollection.title}
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
                  INDEXED ARCHIVE SONGS ({selectedCollection.songs.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCollection.songs.map((song) => {
                  const currentSongId = song.song_id || song.id || song.title_en;
                  const displayTitle = song.title_en || song.title;
                  return (
                    <motion.div
                      key={currentSongId}
                      className="border-2 border-ink p-5 rounded-xs bg-bg shadow-[3px_3px_0px_rgba(17,17,19,0.1)] relative flex flex-col justify-between hover:border-accent duration-300 group"
                    >
                      <div className="space-y-4">
                        {/* Title and metadata */}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-ink group-hover:text-accent transition-colors flex items-baseline gap-2">
                              <span>{displayTitle}</span>
                              {song.title_bn && (
                                <span className="text-[15px] font-serif text-ink/60 font-normal">
                                  ({song.title_bn})
                                </span>
                              )}
                            </h3>
                            <span className="font-mono text-[9px] text-ink/50 uppercase block mt-0.5">
                              {song.song_id ? `ID: ${song.song_id}` : song.album}
                            </span>
                          </div>
                          {song.duration ? (
                            <span className="font-mono text-xs text-ink/40 font-bold">
                              [{song.duration}]
                            </span>
                          ) : (
                            <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-ink/20 font-bold text-accent rounded-xs">
                              {song.status || 'Unreleased'}
                            </span>
                          )}
                        </div>

                        {/* Hand-curated intimate Reason Quote box */}
                        <div className="py-4 px-4 bg-ink/[0.02] border-l-2 border-accent border-y border-r border-ink/5 rounded-r-xs my-2">
                          <p className="font-garamond text-md md:text-lg italic font-semibold text-ink leading-relaxed line-clamp-3">
                            {song.description_short || song.reason}
                          </p>
                        </div>
                      </div>

                      {/* Action button — Open Song only */}
                      <div className="flex items-center justify-end pt-4 border-t border-ink/5 mt-4">
                        <button
                          onClick={() => handleOpenSong(song)}
                          className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 py-1 px-3 bg-ink hover:bg-accent border border-ink hover:border-accent text-bg rounded-xs transition-colors cursor-pointer select-none font-bold shadow-sm"
                        >
                          Open Song
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

