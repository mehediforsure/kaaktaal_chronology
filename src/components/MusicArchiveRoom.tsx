import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ALBUMS } from '../data';
import { Album, Song } from '../types';
import useEngagement from '../hooks/useEngagement';
import SongPage from './SongPage';
import { getOptimizedImageUrl } from '../utils/image';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { fetchReleases, fetchSongsForAlbum } from '../lib/supabase';

interface MusicArchiveRoomProps {
  onSelectAlbum?: (album: Album) => void;
}

export default function MusicArchiveRoom({ onSelectAlbum }: MusicArchiveRoomProps) {
  const { logAction } = useEngagement();
  const [albumsList, setAlbumsList] = useState<Album[]>(ALBUMS);
  const [hoveredAlbum, setHoveredAlbum] = useState<Album | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedSongTrack, setSelectedSongTrack] = useState<string | null>(null);
  const [selectedSongObject, setSelectedSongObject] = useState<Song | null>(null);
  const [albumSongs, setAlbumSongs] = useState<Song[]>([]);

  useEffect(() => {
    async function loadLiveReleases() {
      const liveData = await fetchReleases();
      if (liveData && liveData.length > 0) {
        setAlbumsList(liveData);
      }
    }
    loadLiveReleases();
  }, []);

  // Fetch live database songs from Supabase and merge with album tracklist to ensure complete song list
  useEffect(() => {
    async function loadAlbumSongs() {
      if (!selectedAlbum) {
        setAlbumSongs([]);
        return;
      }
      
      const liveSongs = await fetchSongsForAlbum(selectedAlbum.release_id, selectedAlbum.title);
      const baseTracks = selectedAlbum.tracks || [];

      // If we got live songs from Supabase, use them directly
      if (liveSongs && liveSongs.length > 0) {
        // If there are also static baseTracks, merge: ensure every baseTrack has a match,
        // and append any Supabase songs not in baseTracks
        if (baseTracks.length > 0) {
          const fullList: Song[] = baseTracks.map((trackName, idx) => {
            const normTrack = trackName.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
            const matched = liveSongs.find(s => {
              const sId = (s.song_id || '').toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
              const sTitle = (s.title_en || '').toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
              return (sId && sId === normTrack) || (sTitle && sTitle === normTrack) || (sTitle && sTitle.includes(normTrack)) || (normTrack && normTrack.includes(sTitle));
            });

            if (matched) return matched;

            return {
              song_id: normTrack || `track-${idx + 1}`,
              title_en: trackName,
              album: selectedAlbum.title,
              year_released: selectedAlbum.year,
              cover_image: selectedAlbum.cover_image,
              duration: '03:45',
            };
          });

          // Append any extra Supabase songs not already matched
          liveSongs.forEach(s => {
            const sId = (s.song_id || '').toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
            const sTitle = (s.title_en || '').toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
            const exists = fullList.some(item => {
              const iId = (item.song_id || '').toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
              const iTitle = (item.title_en || '').toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
              return (sId && iId === sId) || (sTitle && iTitle === sTitle);
            });
            if (!exists) fullList.push(s);
          });

          setAlbumSongs(fullList);
        } else {
          // No static tracks — just use live songs directly
          setAlbumSongs(liveSongs);
        }
        return;
      }

      // Fallback: no live songs, build placeholder list from static tracks
      if (baseTracks.length > 0) {
        const placeholderList: Song[] = baseTracks.map((trackName, idx) => ({
          song_id: trackName.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '') || `track-${idx + 1}`,
          title_en: trackName,
          album: selectedAlbum.title,
          year_released: selectedAlbum.year,
          cover_image: selectedAlbum.cover_image,
          duration: '03:45',
        }));
        setAlbumSongs(placeholderList);
      } else {
        setAlbumSongs([]);
      }
    }
    loadAlbumSongs();
  }, [selectedAlbum]);

  // Dynamic atmospheric overlay style based on hovered album
  const getAtmosphericColor = () => {
    if (!hoveredAlbum) return 'bg-bg';
    // Subtly transition colors based on the album release_id
    switch (hoveredAlbum.release_id) {
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
    setSelectedSongObject(null);
    setSelectedSongTrack(null);
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

            {/* Editorial Zigzag Layout — alternating cover/info placement */}
            <div className="space-y-4 md:space-y-0">
              {albumsList.map((album, index) => {
                const isEven = index % 2 === 0;
                const releaseNum = String(index + 1).padStart(2, '0');

                return (
                  <motion.div
                    key={album.release_id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className={`group cursor-pointer border-b-2 border-ink-faint last:border-b-0 py-6 md:py-10 ${
                      index === 0 ? 'pt-0' : ''
                    }`}
                    onMouseEnter={() => setHoveredAlbum(album)}
                    onMouseLeave={() => setHoveredAlbum(null)}
                    onClick={() => handleSelect(album)}
                  >
                    <div className={`flex ${isEven ? 'flex-row' : 'flex-row-reverse'} gap-4 md:gap-10 items-center`}>
                                         {/* Cover Art */}
                      <div className="w-[35%] md:w-[45%] shrink-0">
                        <div className="aspect-square relative border-2 border-ink bg-bg rounded-sm overflow-hidden shadow-[4px_4px_0px_rgba(17,17,19,0.15)] group-hover:shadow-[6px_6px_0px_rgba(211,26,26,0.2)] transition-shadow duration-500">
                          <img
                            src={getOptimizedImageUrl(album.cover_image, 600)}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-ink/5 group-hover:bg-ink/10 transition-colors duration-300" />
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className={`w-[65%] md:w-[55%] flex flex-col justify-center space-y-2 md:space-y-5 select-none ${isEven ? 'pl-2' : 'pr-2'} ${isEven ? 'text-left' : 'text-right'}`}>
                        
                        {/* Index number — large typographic accent */}
                        <span className={`font-plakatbau text-[40px] md:text-[96px] leading-none text-ink/[0.04] font-bold tracking-tighter ${isEven ? '' : 'self-end'}`}>
                          {releaseNum}
                        </span>

                        <div className="space-y-1 md:space-y-2 -mt-4 md:-mt-14 relative z-10">
                          {/* Release type label */}
                          <div className={`flex items-center gap-2 ${isEven ? '' : 'justify-end'}`}>
                            <span className="w-4 md:w-6 h-[2px] bg-accent inline-block" />
                            <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-ink/45 font-bold">
                              {album.year} Release
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="font-syne text-sm md:text-3xl font-extrabold uppercase tracking-tight text-ink leading-[1.1] group-hover:text-accent transition-colors duration-300">
                            {album.title}
                          </h4>

                          {/* Short description */}
                          {album.description_short && (
                            <p className={`font-sans text-[10px] md:text-sm text-ink/55 leading-relaxed max-w-md ${isEven ? '' : 'ml-auto'} line-clamp-2 md:line-clamp-none`}>
                              {album.description_short}
                            </p>
                          )}

                          {/* Release date + track count */}
                          <div className={`flex flex-wrap items-center gap-1.5 md:gap-3 pt-1 ${isEven ? '' : 'justify-end'}`}>
                            <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest text-ink/40 font-bold">
                              {album.release_date
                                ? new Date(album.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : album.year}
                            </span>
                            <span className="w-1 h-1 bg-ink/25 rounded-full" />
                            <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest text-ink/40 font-bold">
                              {album.tracks?.length || '—'} Tracks
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </motion.div>
                );
              })}
            </div>


          </motion.div>
        ) : (selectedSongObject || selectedSongTrack) ? (
          <motion.div
            key="song-detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedSongObject ? (
              <SongPage
                songData={selectedSongObject}
                song_id={selectedSongObject.song_id}
                title_en={selectedSongObject.title_en}
                title_bn={selectedSongObject.title_bn}
                album={selectedSongObject.album || selectedAlbum?.title}
                duration={selectedSongObject.duration}
                year_released={String(selectedSongObject.year_released || selectedAlbum?.year || '')}
                cover_image={selectedSongObject.cover_image || selectedAlbum?.cover_image}
                youtube_url={selectedSongObject.youtube_url}
                spotify_url={selectedSongObject.spotify_url}
                lyrics_available={selectedSongObject.lyrics_available}
                status={selectedSongObject.status}
                description_short={selectedSongObject.description_short}
                description_long={selectedSongObject.description_long}
                lyrics={selectedSongObject.lyrics}
                onClose={() => {
                  setSelectedSongObject(null);
                  setSelectedSongTrack(null);
                }}
              />
            ) : (
              <SongPage
                songTitle={selectedSongTrack || ''}
                albumTitle={selectedAlbum?.title || 'Recorded Works'}
                onClose={() => {
                  setSelectedSongObject(null);
                  setSelectedSongTrack(null);
                }}
              />
            )}
          </motion.div>
        ) : selectedAlbum ? (
          /* ALBUM / RELEASE DETAIL VIEW */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto px-6 pt-12 md:pt-16 space-y-12 relative"
          >
            {/* Album Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
              
              {/* Left Side: Artwork (Spans 5 cols) */}
              <div className="md:col-span-5 space-y-6">
                <div className="aspect-square bg-neutral-200 border-2 border-ink overflow-hidden rounded-sm shadow-[4px_4px_0px_rgba(17,17,19,0.15)]">
                  <img
                    src={getOptimizedImageUrl(selectedAlbum.cover_image || '', 600)}
                    alt={selectedAlbum.title || 'Album'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                
                <div className="border-2 border-ink p-6 bg-bg rounded-sm space-y-4 shadow-[4px_4px_0px_rgba(17,17,19,0.1)]">
                  <h5 className="font-mono text-[10px] uppercase tracking-widest text-ink font-bold select-none">
                    Archive Note
                  </h5>
                  <div className="font-mono text-xs text-ink/75 leading-relaxed italic">
                    "No formal archive notes have been committed to this ledger yet. The tape loop runs in silence, preserving the room's empty resonance."
                  </div>
                </div>

                {/* Long Description / Journal Excerpt (Behind this release) */}
                {selectedAlbum.description_long && (
                  <div className="border-2 border-ink p-6 bg-bg rounded-sm space-y-3 shadow-[4px_4px_0px_rgba(17,17,19,0.1)]">
                    <h5 className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold select-none">
                      Behind this release
                    </h5>
                    <p className="font-sans text-sm text-ink opacity-85 leading-relaxed whitespace-pre-line">
                      {selectedAlbum.description_long}
                    </p>
                  </div>
                )}

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

                {/* Short Description */}
                {selectedAlbum.description_short && (
                  <p className="font-sans text-lg text-ink/80 leading-relaxed italic border-l-4 border-accent pl-4">
                    "{selectedAlbum.description_short}"
                  </p>
                )}

                {/* Tracklist List (Renders database songs from Supabase if connected) */}
                <div className="space-y-4">
                  {selectedAlbum.spotify_url && (
                    <div className="flex justify-end pt-1">
                      <a
                        href={selectedAlbum.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border-2 border-ink bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-ink py-1.5 px-4 rounded-xs font-mono text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm select-none"
                      >
                        <span>Listen on Spotify</span>
                        <ExternalLink className="w-3.5 h-3.5 text-accent" />
                      </a>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-b-2 border-ink pb-2 select-none">
                    <h4 className="font-mono text-sm uppercase tracking-widest text-ink font-bold pl-10">
                      Track List
                    </h4>
                    <span className="font-mono text-xs uppercase tracking-widest text-ink/75 font-bold">
                      Total Tracks: {String(albumSongs.length || selectedAlbum.tracks?.length || 0).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="divide-y-2 divide-ink-faint font-sans">
                    {albumSongs.length > 0 ? (
                      /* Render live database songs from Supabase table 'songs' */
                      albumSongs.map((song, idx) => (
                        <div 
                          key={song.song_id || idx} 
                          className="py-3.5 flex items-center justify-between group hover:bg-ink-faint transition-colors px-2"
                        >
                          <div 
                            className="flex items-center gap-4 cursor-pointer flex-1"
                            onClick={() => {
                              logAction('song_opened');
                              setSelectedSongObject(song);
                            }}
                          >
                            <span className="font-mono text-xs text-ink/40 font-bold select-none">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-lg font-bold text-ink uppercase tracking-tight font-syne flex items-baseline gap-2 group-hover:text-accent transition-all duration-300">
                              <span>{song.title_en}</span>
                              {song.title_bn && (
                                <span className="text-[15px] font-serif text-ink/60 font-normal">
                                  ({song.title_bn})
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {song.duration && (
                              <span className="font-mono text-xs text-ink/40 font-bold hidden sm:inline">
                                [{song.duration}]
                              </span>
                            )}
                            
                            <button
                              onClick={() => {
                                logAction('song_opened');
                                setSelectedSongObject(song);
                              }}
                              className="font-mono text-[10px] text-bg bg-ink uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity select-none cursor-pointer px-2.5 py-1 rounded-xs hover:bg-accent hover:border-accent"
                            >
                              Open Song
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      /* Fallback tracklist strings array */
                      (selectedAlbum.tracks || []).map((track, idx) => (
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
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                logAction('song_opened');
                                setSelectedSongTrack(track);
                              }}
                              className="font-mono text-[10px] text-bg bg-ink uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity select-none cursor-pointer px-2.5 py-1 rounded-xs hover:bg-accent hover:border-accent"
                            >
                              Open Song
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>


              </div>

            </div>

            {/* Back to Recorded Works Button (Bottom Right, Arrow Icon Only, No Text) */}
            <button
              onClick={() => setSelectedAlbum(null)}
              className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full border-2 border-ink bg-bg hover:bg-ink text-ink hover:text-bg shadow-[4px_4px_0px_rgba(17,17,19,0.25)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center cursor-pointer transition-all font-bold select-none"
              title="Back to Recorded Works"
              aria-label="Back to Recorded Works"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
