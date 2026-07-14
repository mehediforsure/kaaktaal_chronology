"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSongVersions, SongVersion } from '../data/song-versions';
import { getBorrowedMeaningsForSong, saveBorrowedMeaning, RANDOM_QUESTIONS, BorrowedMeaning } from '../data/audience-meanings';
import { Music, FileText, BookOpen, GitBranch, Heart, Globe, MapPin, User, ChevronRight, ExternalLink } from 'lucide-react';
import useEngagement from '../hooks/useEngagement';
import { getOptimizedImageUrl } from '../utils/image';
import { Song } from '../types';

import { fetchSongs, fetchLyricsForSong } from '../lib/supabase';

export interface SongPageProps {
  song_id?: string;
  title_en?: string;
  title_bn?: string;
  album?: string;
  duration?: string;
  year_released?: string;
  cover_image?: string;
  youtube_url?: string;
  spotify_url?: string;
  lyrics_available?: boolean;
  status?: string;
  description_short?: string;
  description_long?: string;
  lyrics?: string;

  // Compatibility props
  songTitle?: string;
  albumTitle?: string;
  onClose: () => void;
  defaultLyrics?: string;
  defaultStory?: string;
  songData?: Song;
}

type SongTab = 'overview' | 'lyrics' | 'stories' | 'versions' | 'meanings';

export default function SongPage({
  song_id,
  title_en,
  title_bn,
  album,
  duration,
  year_released,
  cover_image,
  youtube_url,
  spotify_url,
  lyrics_available,
  status,
  description_short,
  description_long,
  lyrics,
  songTitle,
  albumTitle,
  onClose,
  defaultLyrics,
  defaultStory,
  songData
}: SongPageProps) {
  const { logAction } = useEngagement();
  const [activeTab, setActiveTab] = useState<SongTab>('overview');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meaningsList, setMeaningsList] = useState<BorrowedMeaning[]>([]);
  
  // Submission Form State
  const [formName, setFormName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [formCity, setFormCity] = useState('');
  const [formInput, setFormInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // State for live fetched song data from Supabase
  const [liveSong, setLiveSong] = useState<Song | null>(null);
  const [liveLyrics, setLiveLyrics] = useState<string | null>(null);
  const [liveTitleBn, setLiveTitleBn] = useState<string | null>(null);

  useEffect(() => {
    async function loadLiveSong() {
      const targetId = song_id || songTitle?.toLowerCase().replace(/[\s\(\)\-\.]/g, '');
      if (targetId) {
        if (targetId.toUpperCase().startsWith('KTL')) {
          const results = await fetchSongs(targetId);
          if (results && results.length > 0) {
            setLiveSong(results[0]);
            return;
          }
        }
        
        const allSongs = await fetchSongs();
        if (allSongs && allSongs.length > 0) {
          const normTarget = targetId.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
          const matched = allSongs.find(s => {
            const sId = (s.song_id || '').toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
            const sTitle = (s.title_en || '').toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
            return sId === normTarget || sTitle === normTarget || sTitle.includes(normTarget) || normTarget.includes(sTitle);
          });
          if (matched) {
            setLiveSong(matched);
          }
        }
      }
    }
    loadLiveSong();
  }, [song_id, songTitle]);

  // Resolved values mapped to database column names (prioritizes live database data)
  const activeData = liveSong || songData;
  const resolvedSongId = song_id || activeData?.song_id || (songTitle ? songTitle.toLowerCase().replace(/[\s\(\)\-\.]/g, '') : 'song-01');

  useEffect(() => {
    async function loadLyrics() {
      if (resolvedSongId) {
        const targetId = resolvedSongId.toUpperCase().trim();
        const lyricsRecord = await fetchLyricsForSong(targetId);
        if (lyricsRecord) {
          if (lyricsRecord.lyrics) {
            setLiveLyrics(lyricsRecord.lyrics);
          }
          if (lyricsRecord.title_bn) {
            setLiveTitleBn(lyricsRecord.title_bn);
          }
        } else {
          setLiveLyrics(null);
          setLiveTitleBn(null);
        }
      }
    }
    loadLyrics();
  }, [resolvedSongId]);

  const formattedSongId = resolvedSongId.toUpperCase().startsWith('KTL') 
    ? resolvedSongId.toUpperCase() 
    : `#KT-${resolvedSongId.toUpperCase()}`;
  const resolvedTitleEn = title_en || activeData?.title_en || songTitle || 'Untitled Song';
  const resolvedTitleBn = title_bn || activeData?.title_bn || liveTitleBn;
  const resolvedAlbum = album || activeData?.album || albumTitle || 'Kaaktaal Archive';
  const resolvedDuration = duration || activeData?.duration || '03:45';
  const resolvedYear = year_released || activeData?.year_released || '2025';
  const resolvedCoverImage = cover_image || activeData?.cover_image;
  const resolvedYoutubeUrl = youtube_url || activeData?.youtube_url;
  const resolvedSpotifyUrl = spotify_url || activeData?.spotify_url;
  const resolvedLyricsAvailable = lyrics_available ?? (liveLyrics ? true : activeData?.lyrics_available) ?? true;
  const resolvedStatus = status || activeData?.status || 'Released';
  const resolvedDescShort = description_short || activeData?.description_short || 'This track is preserved in our primary physical cabinet under catalog index. Recorded live directly to a single-channel magnetic cassette deck.';
  const resolvedDescLong = description_long || activeData?.description_long || defaultStory || `This song was written in a single afternoon sitting on the red stairs of a weathered building in Chittagong. We had no microphones, just a cheap phone voice-recorder and a guitar with rusty strings. The background noise of stray crows and street vendors shouting is the true heartbeat of the track.`;
  const resolvedLyrics = lyrics || liveLyrics || activeData?.lyrics || defaultLyrics || `শৈশব নদী বয়ে চলে নিরবধি,
আমরা তো চেয়েছিলাম দেখা হোক যদি।
ফ্রেমে বাঁধা ছবিটা ধূলো পড়ে আজ,
বেদনার বুক জুড়ে শ্রাবণের সাজ।

আবার দেখা হলে পথ ভুলে যেও না,
পুরনো চেনা সেই গানটা গেও না।
ইথারে ভেসে চলা কান্নার সুর,
তুমি কি চলে গেছ বহু বহুদূর?`;
  
  // Versions Timeline list
  const versions: SongVersion[] = getSongVersions(resolvedTitleEn);

  // Load Meanings
  useEffect(() => {
    setMeaningsList(getBorrowedMeaningsForSong(resolvedTitleEn));
  }, [resolvedTitleEn]);

  // Roll a random question on mount & when song page changes
  useEffect(() => {
    rollRandomQuestion();
  }, [resolvedTitleEn]);

  const rollRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_QUESTIONS.length);
    setCurrentQuestion(RANDOM_QUESTIONS[randomIndex]);
  };

  const handleTabChange = (tab: SongTab) => {
    logAction('song_opened');
    setActiveTab(tab);
  };


  const handleOpenSubmission = () => {
    rollRandomQuestion();
    setFormInput('');
    setShowSuccess(false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInput.trim()) return;

    const saved = saveBorrowedMeaning({
      songTitle: resolvedTitleEn,
      fromName: isAnonymous ? 'Anonymous' : (formName || 'Someone'),
      isAnonymous: isAnonymous,
      city: formCity || 'Unknown Location',
      input: formInput,
      questionAsked: currentQuestion
    });

    // Prepend to current state meanings
    setMeaningsList(prev => [saved, ...prev]);
    setShowSuccess(true);
    
    // Reset input
    setFormInput('');
    setTimeout(() => {
      setIsModalOpen(false);
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <div className="bg-bg border-2 border-ink rounded-sm shadow-[4px_4px_0px_rgba(17,17,19,0.2)] text-ink overflow-hidden max-w-4xl mx-auto my-6">
      
      {/* Header Block with high design fidelity */}
      <div className="p-6 md:p-8 border-b-2 border-ink bg-ink/[0.02] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-ink/50 uppercase tracking-widest mb-1.5">
            <span>Indexed Song Track</span>
            <ChevronRight className="w-3 h-3 text-ink" />
            <span className="font-bold text-ink/75">{resolvedAlbum}</span>
            <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-xs border border-ink/20 text-ink/70 font-bold ml-2">
              {resolvedStatus}
            </span>
          </div>
          <h2 className="font-syne text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-ink flex flex-wrap items-baseline gap-3">
            <span>{resolvedTitleEn}</span>
            {resolvedTitleBn && (
              <span className="text-2.5xl md:text-3.5xl text-ink/60 font-serif font-normal">
                ({resolvedTitleBn})
              </span>
            )}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-xs uppercase tracking-widest text-ink hover:text-bg hover:bg-ink border-2 border-ink py-1.5 px-3.5 rounded-xs transition-colors cursor-pointer font-bold select-none shrink-0"
        >
          Close Drawer ×
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b-2 border-ink bg-[#faf8f5] select-none overflow-x-auto scrollbar-none divide-x-2 divide-ink">
        {(['overview', 'lyrics', 'stories', 'versions', 'meanings'] as SongTab[]).map((tab) => {
          const isActive = activeTab === tab;
          let label = '';
          switch (tab) {
            case 'overview': label = 'Overview'; break;
            case 'lyrics': label = 'Lyrics'; break;
            case 'stories': label = 'Stories'; break;
            case 'versions': label = 'Versions'; break;
            case 'meanings': label = 'Borrowed Meanings'; break;
          }
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 min-w-[120px] text-center py-3.5 px-3 font-syne text-xs uppercase tracking-wider font-extrabold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-ink text-bg font-black'
                  : 'text-ink hover:bg-ink-faint'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Content Area with custom layout for each tab */}
      <div className="p-6 md:p-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                {/* Left card description */}
                <div className="md:col-span-7 space-y-6">
                  {resolvedCoverImage && (
                    <div className="aspect-square w-full border-2 border-ink rounded-sm overflow-hidden shadow-xs">
                      <img
                        src={getOptimizedImageUrl(resolvedCoverImage, 800)}
                        alt={resolvedTitleEn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h3 className="font-sans text-xl font-semibold leading-relaxed italic text-ink/95">
                      "{resolvedDescShort}"
                    </h3>
                  </div>


                </div>

                {/* Right technical ledger */}
                <div className="md:col-span-5 space-y-4">
                  <div className="border-2 border-ink p-5 bg-bg rounded-sm shadow-[3px_3px_0px_rgba(17,17,19,0.1)] space-y-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold select-none border-b border-ink/10 pb-1.5">
                      Technical Ledger
                    </h4>
                    <div className="font-mono text-xs text-ink/80 space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-ink/40">SONG ID:</span>
                        <span className="font-bold">{formattedSongId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/40">DURATION:</span>
                        <span className="font-bold">{resolvedDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/40">YEAR RELEASED:</span>
                        <span className="font-bold">{resolvedYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink/40">STATUS:</span>
                        <span className="font-bold text-accent">{resolvedStatus}</span>
                      </div>
                    </div>

                    {/* External Streaming Links */}
                    {(resolvedSpotifyUrl || resolvedYoutubeUrl) && (
                      <div className="pt-3 border-t border-ink/10 space-y-2">
                        {resolvedSpotifyUrl && (
                          <a
                            href={resolvedSpotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 border border-ink bg-[#1DB954]/10 hover:bg-[#1DB954]/20 rounded-xs font-mono text-[10px] uppercase font-bold tracking-wider text-ink transition-colors"
                          >
                            <span>Listen on Spotify</span>
                            <ExternalLink className="w-3.5 h-3.5 text-accent" />
                          </a>
                        )}
                        {resolvedYoutubeUrl && (
                          <a
                            href={resolvedYoutubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 border border-ink bg-[#FF0000]/10 hover:bg-[#FF0000]/20 rounded-xs font-mono text-[10px] uppercase font-bold tracking-wider text-ink transition-colors"
                          >
                            <span>Watch on YouTube</span>
                            <ExternalLink className="w-3.5 h-3.5 text-accent" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 border border-dashed border-ink/20 rounded-sm text-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40 block">
                      TIMELINE EVOLUTION
                    </span>
                    <p className="font-sans text-xs text-ink/70 mt-1">
                      This song has lived <span className="font-bold text-accent">{versions.length} versions</span> since its first draft. Select the <strong className="font-mono font-bold">Versions</strong> tab above to explore.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LYRICS TAB */}
            {activeTab === 'lyrics' && (
              <div className="max-w-xl mx-auto py-4 text-center">
                {!resolvedLyricsAvailable ? (
                  <div className="p-8 border border-dashed border-ink/20 rounded-sm bg-ink/[0.02]">
                    <p className="font-sans text-sm italic text-ink/60">
                      Lyrics are currently marked as unavailable or instrumental for this track log.
                    </p>
                  </div>
                ) : (
                  <div className="inline-block text-left bg-white/40 border border-ink/5 p-8 md:p-12 rounded-sm shadow-xs min-w-[280px] sm:min-w-[400px]">
                    <pre className="font-garamond text-lg md:text-xl text-ink leading-loose whitespace-pre-wrap text-center select-text">
                      {resolvedLyrics}
                    </pre>
                    
                    {/* Small decorative page separator */}
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink/20" />
                      <span className="w-8 h-[1px] bg-ink/15" />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink/20" />
                    </div>
                    
                    <span className="font-mono text-[8px] uppercase tracking-widest text-ink/30 text-center block mt-3">
                      Preserved from original handwritten journals // {resolvedYear}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3. STORIES TAB */}
            {activeTab === 'stories' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3 select-none">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">
                    [ ARCHIVAL LORE LOG ]
                  </span>
                  <span className="flex-1 h-[1px] bg-ink/10" />
                </div>

                <div className="space-y-6">
                  <p className="font-garamond text-lg sm:text-xl text-ink/85 leading-relaxed italic first-letter:text-4xl first-letter:font-syne first-letter:font-extrabold first-letter:float-left first-letter:mr-3 first-letter:text-accent select-text whitespace-pre-line">
                    {resolvedDescLong}
                  </p>
                </div>

                <div className="border-t border-ink/10 pt-6">
                  <div className="bg-ink/[0.01] border-l-4 border-ink p-4 rounded-r-xs">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink/50 mb-1">
                      FIELD ARCHIVIST NOTES:
                    </p>
                    <p className="font-sans text-xs text-ink/70 leading-relaxed">
                      "The microphone used for the vocal draft is sensitive to moisture. The room conditions altered the frequency response, giving the track its distinctive tape atmosphere."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. VERSIONS TIMELINE TAB */}
            {activeTab === 'versions' && (
              <div className="space-y-8">
                <div className="border-b border-ink/10 pb-4 select-none">
                  <h3 className="font-syne text-lg font-extrabold uppercase tracking-tight text-ink">
                    Song Evolution Timeline
                  </h3>
                  <p className="font-sans text-xs text-ink/60 mt-1">
                    Explore how this melody has adapted, mutated, and lived different lives over the years.
                  </p>
                </div>

                {/* Timeline container */}
                <div className="relative pl-6 sm:pl-10 border-l-2 border-ink space-y-12">
                  {versions.map((ver, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className="relative"
                    >
                      {/* Timeline dot marker */}
                      <span className="absolute -left-[31px] sm:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-ink bg-bg flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      </span>

                      {/* Year Indicator floating on side */}
                      <div className="absolute -left-[90px] sm:-left-[120px] top-0 font-syne text-base sm:text-lg font-black text-ink/30 select-none">
                        {ver.year} ─
                      </div>

                      {/* Card Content */}
                      <div className="border-2 border-ink bg-bg p-5 rounded-sm shadow-[3px_3px_0px_rgba(17,17,19,0.15)] space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/10 pb-3">
                          <h4 className="font-syne text-md font-bold uppercase tracking-tight text-ink">
                            {resolvedTitleEn} (Evolution Outline)
                          </h4>
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold rounded-xs bg-ink text-bg">
                              {ver.type}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Plain color placeholder block instead of photo */}
                          <div className="md:col-span-3">
                            <div className="aspect-[4/3] bg-ink/5 border border-ink overflow-hidden rounded-xs relative group shadow-sm">
                              <div className="absolute inset-0 bg-ink/5 flex items-center justify-center">
                                <span className="font-mono text-[8px] uppercase tracking-widest text-ink/65 px-1.5 py-0.5 border border-ink/10 bg-bg rounded-xs">
                                  {ver.year} Archive
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="md:col-span-9 space-y-3">
                            <p className="font-sans text-xs sm:text-sm text-ink/80 leading-relaxed">
                              {ver.description}
                            </p>

                            {ver.optionalNote && (
                              <p className="font-sans text-xs italic text-accent/95 pl-3 border-l-2 border-accent/40">
                                "{ver.optionalNote}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. BORROWED MEANINGS TAB */}
            {activeTab === 'meanings' && (
              <div className="space-y-8">
                {/* Intro section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-ink/10 pb-5">
                  <div>
                    <h3 className="font-syne text-lg font-extrabold uppercase tracking-tight text-ink">
                      The Archive of Borrowed Meanings
                    </h3>
                    <p className="font-sans text-xs text-ink/60 mt-1">
                      A quiet ledger where listeners have left their own memories, meanings, and associations with this track.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenSubmission}
                    className="font-mono text-xs uppercase tracking-widest text-ink bg-ink-faint hover:bg-ink hover:text-bg border border-ink/30 hover:border-ink py-2 px-4 rounded-xs transition-colors cursor-pointer font-extrabold shadow-sm select-none"
                  >
                    Leave a Memory
                  </button>
                </div>

                {/* Random rotating question box */}
                <div className="p-5 border border-dashed border-accent/30 rounded-xs bg-accent/[0.01] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold block mb-1">
                      ARCHIVAL INQUIRY:
                    </span>
                    <p className="font-sans text-sm sm:text-base font-semibold italic text-ink">
                      "{currentQuestion}"
                    </p>
                  </div>
                  <button
                    onClick={rollRandomQuestion}
                    className="font-mono text-[8px] uppercase tracking-widest border border-ink/20 hover:border-ink py-1 px-2 rounded-xs transition-colors cursor-pointer text-ink/60 hover:text-ink font-bold shrink-0"
                  >
                    Roll another question ↻
                  </button>
                </div>

                {/* Handwritten meanings cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {meaningsList.length === 0 ? (
                    <div className="col-span-full py-16 text-center select-none">
                      <p className="font-sans text-base text-ink/40 italic">
                        This song's archive is currently blank. Leave the very first memory.
                      </p>
                    </div>
                  ) : (
                    meaningsList.map((m, idx) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-bg border-2 border-ink p-6 rounded-xs shadow-[3px_3px_0px_rgba(17,17,19,0.1)] relative overflow-hidden flex flex-col justify-between [background:radial-gradient(#faf8f5_1px,transparent_1px)] [background-size:16px_16px]"
                      >
                        {/* Typewriter texture line details */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[9px] font-mono text-ink/40 uppercase">
                            <span>From: {m.isAnonymous ? 'Anonymous' : m.fromName}</span>
                            <span>{m.city}</span>
                          </div>

                          {m.questionAsked && (
                            <span className="font-mono text-[8px] italic text-accent/70 block border-b border-ink/5 pb-1">
                              Reflecting on: "{m.questionAsked}"
                            </span>
                          )}

                          <blockquote className="font-garamond text-base sm:text-lg italic text-ink/90 leading-relaxed pr-2 pl-1 select-text">
                            "{m.input}"
                          </blockquote>
                        </div>

                        <div className="pt-4 border-t border-ink/5 flex justify-end text-[9px] font-mono text-ink/30 select-none">
                          <span>Archive Date: {m.date}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 6. SUBMISSION MODAL OVERLAY */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-bg border-2 border-ink rounded-sm p-6 sm:p-8 shadow-[6px_6px_0px_rgba(17,17,19,0.3)] relative text-ink"
            >
              {/* Success Screen */}
              {showSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center mx-auto text-accent text-2xl font-bold animate-pulse">
                    ✓
                  </div>
                  <h4 className="font-syne text-xl font-extrabold uppercase tracking-tight text-ink mt-4">
                    Memory Registered
                  </h4>
                  <p className="font-sans text-sm text-ink/80 max-w-xs mx-auto leading-relaxed">
                    Your memory has been left inside the archive. It is now part of this song's permanent landscape.
                  </p>
                </div>
              ) : (
                /* Form screen */
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="flex justify-between items-start border-b border-ink/10 pb-3">
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-accent font-bold">
                        BORROWED MEANING SUBMISSION
                      </span>
                      <h4 className="font-syne text-lg font-bold uppercase tracking-tight text-ink">
                        Add Your Memory
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="font-mono text-xs uppercase font-extrabold hover:text-accent cursor-pointer"
                    >
                      Close ×
                    </button>
                  </div>

                  {/* Question Prompt */}
                  <div className="p-3.5 border border-dashed border-accent/20 rounded-xs bg-accent/[0.01]">
                    <span className="font-mono text-[8px] text-accent font-bold block mb-0.5">
                      YOUR QUESTION:
                    </span>
                    <p className="font-sans text-xs sm:text-sm font-semibold italic text-ink">
                      "{currentQuestion}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Anonymous toggle */}
                    <div className="flex items-center justify-between py-1 bg-ink/[0.02] px-3 border border-ink/10 rounded-xs">
                      <label htmlFor="anon-toggle" className="font-mono text-[10px] uppercase font-bold text-ink/70">
                        Leave memory anonymously?
                      </label>
                      <input
                        id="anon-toggle"
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 accent-accent cursor-pointer border-2 border-ink"
                      />
                    </div>

                    {/* Name & City row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-ink/50 block mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder={isAnonymous ? "Prefilled: Anonymous" : "e.g. Mehedi"}
                          disabled={isAnonymous}
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full font-sans text-xs p-2.5 bg-bg border border-ink/20 focus:border-accent focus:outline-none rounded-xs disabled:opacity-55"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-ink/50 block mb-1">
                          City / Origin
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Chittagong"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full font-sans text-xs p-2.5 bg-bg border border-ink/20 focus:border-accent focus:outline-none rounded-xs"
                        />
                      </div>
                    </div>

                    {/* Input box */}
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-ink/50 block mb-1">
                        Your Memory / Interpretation
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write anything... how this song found you, what it reminds you of, or any memory that lives here."
                        value={formInput}
                        onChange={(e) => setFormInput(e.target.value)}
                        className="w-full font-sans text-xs p-3 bg-bg border border-ink/20 focus:border-accent focus:outline-none resize-none rounded-xs text-ink"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="font-mono text-xs uppercase tracking-widest text-bg bg-ink hover:bg-accent border border-ink hover:border-accent py-2 px-4 rounded-xs transition-colors cursor-pointer font-extrabold shadow-sm select-none"
                    >
                      Commit to Archive
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
