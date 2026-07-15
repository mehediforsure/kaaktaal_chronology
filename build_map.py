import os

content = """\"\"\"use client\"\"\";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Music, BookOpen, FileText, Sparkles, X, ChevronRight } from 'lucide-react';
import useEngagement from '../hooks/useEngagement';
import { fetchSongs, fetchUnreleasedTracks, supabase, UnreleasedTrack } from '../lib/supabase';
import SongPage from './SongPage';
import { Song } from '../types';
import { Delaunay } from 'd3-delaunay';

interface MapNode {
  id: string;
  name: string;
  poeticSubtitle: string;
  poeticIntro: string;
  type: 'real' | 'imaginary' | 'memory' | 'show' | 'prison';
  x: number;
  y: number;
  color: string;
  songsCount: number;
  storiesCount: number;
  journalsCount: number;
  connectedItems: string[];
  relatedPlaceIds: string[];
}

const ARCHIVAL_COLORS = {
  charcoal1: '#1C1C1E',
  charcoal2: '#242426',
  dustyGrey: '#2C2C2E',
  deepNavy: '#1C2127',
  fadedMoss: '#222723',
  warmBark: '#2A2421',
  mutedPlum: '#261F26'
};

const INITIAL_NODES: MapNode[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    poeticSubtitle: 'The city that never quite left.',
    poeticIntro: 'A dense grid of overhead cables, river mist, and endless traffic where stories collide and crystallize.',
    type: 'real',
    x: 400,
    y: 400,
    color: ARCHIVAL_COLORS.charcoal2,
    songsCount: 14,
    storiesCount: 22,
    journalsCount: 18,
    connectedItems: ['Song: Totodine Deri Hoye Jay', 'Song: Nishader Chayajol', 'Journal: The Hum of Damp Condenser Mics'],
    relatedPlaceIds: ['jail', 'rooftop', 'stall', 'window']
  },
  {
    id: 'jail',
    name: 'Dhaka Central Jail',
    poeticSubtitle: 'Voices trapped in time.',
    poeticIntro: 'A heavy stone registry of voices trapped in time, echoing through damp corridors and rusted grates.',
    type: 'prison',
    x: 250,
    y: 650,
    color: ARCHIVAL_COLORS.charcoal1,
    songsCount: 7,
    storiesCount: 12,
    journalsCount: 5,
    connectedItems: ['Song: Shokun', 'Journal: Static from Sadarghat in the Rain'],
    relatedPlaceIds: ['memory-room']
  },
  {
    id: 'rooftop',
    name: 'Rooftop',
    poeticSubtitle: 'A sanctuary above the dust.',
    poeticIntro: 'Where nylon-string acoustics find space to float over the city skyline before the morning prayers begin.',
    type: 'memory',
    x: 650,
    y: 250,
    color: ARCHIVAL_COLORS.fadedMoss,
    songsCount: 9,
    storiesCount: 15,
    journalsCount: 8,
    connectedItems: ['Song: A Brief Encounter With A Stranger', 'Journal: 4 AM Recording Session Notes'],
    relatedPlaceIds: ['stage', 'imaginary-city']
  },
  {
    id: 'stall',
    name: 'Tea Stall',
    poeticSubtitle: 'Conversations outlived the tea.',
    poeticIntro: 'A makeshift wooden bench under neon glare. Conversations drowned in condensed milk and boiling tea.',
    type: 'memory',
    x: 150,
    y: 400,
    color: ARCHIVAL_COLORS.warmBark,
    songsCount: 5,
    storiesCount: 9,
    journalsCount: 4,
    connectedItems: ['Song: The Dust of Old Verandahs', 'Journal: Scribbled Napkin Chord'],
    relatedPlaceIds: ['studio', 'tree']
  },
  {
    id: 'window',
    name: 'Bus Window',
    poeticSubtitle: 'Songs written between two stops.',
    poeticIntro: 'A moving frame of blurred city lights. Restless heads resting against vibrating window-panes.',
    type: 'memory',
    x: 750,
    y: 500,
    color: ARCHIVAL_COLORS.deepNavy,
    songsCount: 6,
    storiesCount: 11,
    journalsCount: 7,
    connectedItems: ['Song: Shunno Station', 'Journal: Static from Sadarghat in the Rain'],
    relatedPlaceIds: ['rain']
  },
  {
    id: 'rain',
    name: 'Rainy Evening',
    poeticSubtitle: 'A portal opened by humidity.',
    poeticIntro: 'A place that exists only when water meets copper. The precise humidity that forces tape recorders to lag.',
    type: 'imaginary',
    x: 600,
    y: 750,
    color: ARCHIVAL_COLORS.mutedPlum,
    songsCount: 8,
    storiesCount: 6,
    journalsCount: 10,
    connectedItems: ['Song: Aakash Bhanga Brishti', 'Journal: A Monsoon Hum in Flat Three-B'],
    relatedPlaceIds: []
  },
  {
    id: 'imaginary-city',
    name: 'Imaginary City',
    poeticSubtitle: 'Replica of Dhaka inside wood.',
    poeticIntro: 'A slow, quiet, uncrowded replica of Dhaka that lives inside the acoustic resonances of the studio’s wooden floorboards.',
    type: 'imaginary',
    x: 900,
    y: 300,
    color: ARCHIVAL_COLORS.dustyGrey,
    songsCount: 11,
    storiesCount: 18,
    journalsCount: 12,
    connectedItems: ['Song: Shadrisshyo', 'Journal: Blueprint of the Quiet Streets'],
    relatedPlaceIds: ['window', 'rain']
  },
  {
    id: 'tree',
    name: 'Under the Tree',
    poeticSubtitle: 'Roots swallowing ancient walls.',
    poeticIntro: 'A natural cathedral where the rustling leaves provide a randomized metronome.',
    type: 'memory',
    x: 350,
    y: 200,
    color: ARCHIVAL_COLORS.fadedMoss,
    songsCount: 4,
    storiesCount: 8,
    journalsCount: 6,
    connectedItems: ['Song: Nodir Kotha', 'Journal: Acoustic Reflection in Leaves'],
    relatedPlaceIds: ['stage', 'rooftop']
  },
  {
    id: 'studio',
    name: 'Studio 6/6',
    poeticSubtitle: 'Direct-to-tape room recordings.',
    poeticIntro: 'A packed room of warm bodies, wooden stools, and direct-to-tape room recordings.',
    type: 'show',
    x: -50,
    y: 250,
    color: ARCHIVAL_COLORS.deepNavy,
    songsCount: 12,
    storiesCount: 14,
    journalsCount: 9,
    connectedItems: ['Song: Writer\\'s Block', 'Journal: The Hum of Damp Condenser Mics'],
    relatedPlaceIds: []
  },
  {
    id: 'stage',
    name: 'Empty Stage',
    poeticSubtitle: 'Silence following performance.',
    poeticIntro: 'The silence that follows a performance. Dusty spotlights catching floating dust-motes.',
    type: 'show',
    x: 550,
    y: -50,
    color: ARCHIVAL_COLORS.charcoal1,
    songsCount: 5,
    storiesCount: 8,
    journalsCount: 3,
    connectedItems: ['Song: Silent Letters on Wood', 'Journal: Notes on Post-Performance Hum'],
    relatedPlaceIds: []
  },
  {
    id: 'memory-room',
    name: 'Memory Room',
    poeticSubtitle: 'Sanctuary of forgotten tapes.',
    poeticIntro: 'A locked cabinet of high-bias tapes and written letters. An unmapped sanctuary.',
    type: 'memory',
    x: 50,
    y: 700,
    color: ARCHIVAL_COLORS.warmBark,
    songsCount: 10,
    storiesCount: 16,
    journalsCount: 11,
    connectedItems: ['Song: Gopon Kotha', 'Journal: Damp Cables and Monsoon Static'],
    relatedPlaceIds: ['stall']
  }
];

interface MapRoomProps {
  onBack?: () => void;
}

export default function MapRoom({ onBack }: MapRoomProps) {
  const { logAction } = useEngagement();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Panning & Zooming State
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 0.6 : 1.0;
    }
    return 1.0;
  });
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Supabase Data State
  const [liveOfficialSongs, setLiveOfficialSongs] = useState<Song[]>([]);
  const [liveUnreleasedSongs, setLiveUnreleasedSongs] = useState<UnreleasedTrack[]>([]);
  const [liveJournals, setLiveJournals] = useState<Array<{ id: string; title: string; content: string; created_at?: string }>>([]);
  
  // Modals
  const [selectedSongForModal, setSelectedSongForModal] = useState<any | null>(null);
  const [selectedJournalForModal, setSelectedJournalForModal] = useState<any | null>(null);
  const [archivedDetail, setArchivedDetail] = useState<{ isOpen: boolean; nodeName: string; item: string | null }>({
    isOpen: false, nodeName: '', item: null
  });

  const [showUI, setShowUI] = useState(true);
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [officialRes, unreleasedRes, journalRes] = await Promise.all([
          fetchSongs(),
          fetchUnreleasedTracks(),
          supabase.from('journals').select('*')
        ]);
        if (officialRes) setLiveOfficialSongs(officialRes);
        if (unreleasedRes) setLiveUnreleasedSongs(unreleasedRes);
        if (journalRes.data) setLiveJournals(journalRes.data);
      } catch (err) {
        console.error('Failed loading map Supabase data:', err);
      }
    }
    loadData();
  }, []);

  const mapNodes: MapNode[] = useMemo(() => {
    return INITIAL_NODES.map((node) => {
      let songsCount = node.songsCount;
      if (node.id === 'jail' && liveOfficialSongs.length > 0) songsCount = liveOfficialSongs.length;
      if (node.id === 'imaginary-city' && liveUnreleasedSongs.length > 0) songsCount = liveUnreleasedSongs.length;
      return { ...node, songsCount };
    });
  }, [liveOfficialSongs, liveUnreleasedSongs, liveJournals]);

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return mapNodes;
    const q = searchQuery.toLowerCase().trim();
    return mapNodes.filter(node => 
      node.name.toLowerCase().includes(q) ||
      node.poeticSubtitle.toLowerCase().includes(q) ||
      node.connectedItems.some(item => item.toLowerCase().includes(q))
    );
  }, [mapNodes, searchQuery]);

  // Generate Voronoi
  const delaunay = useMemo(() => {
    // We map all nodes, even if filtered out, to keep the territory shapes stable.
    // We'll just hide the text for filtered ones if needed, or filter affects nothing.
    // For a stable map, Voronoi is built on ALL nodes.
    return Delaunay.from(mapNodes.map(n => [n.x, n.y]));
  }, [mapNodes]);

  const voronoi = useMemo(() => {
    return delaunay.voronoi([-2000, -2000, 3000, 3000]);
  }, [delaunay]);

  useEffect(() => {
    const handleInactivity = () => {
      if (activeNode || hoveredNode || isHoveringControls || searchQuery) return;
      setShowUI(false);
    };
    let timer = setTimeout(handleInactivity, 5000);
    const handleActivity = () => {
      setShowUI(true);
      clearTimeout(timer);
      timer = setTimeout(handleInactivity, 5000);
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isHoveringControls, activeNode, hoveredNode, searchQuery]);

  const centerNodeView = (node: MapNode) => {
    logAction('map_click');
    setActiveNode(node);
    const targetX = (window.innerWidth < 640 ? 0 : 200) - node.x * zoom;
    const targetY = (window.innerHeight / 2) - node.y * zoom;
    setPan({ x: targetX, y: targetY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.map-control-ui')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.map-control-ui')) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    const nextZoom = e.deltaY < 0 ? Math.min(zoom + zoomIntensity, 2.5) : Math.max(zoom - zoomIntensity, 0.4);
    setZoom(nextZoom);
  };

  const resetView = () => {
    setZoom(window.innerWidth < 640 ? 0.6 : 1.0);
    setPan({ x: 0, y: 0 });
    setActiveNode(null);
  };

  const handleOpenConnectedItem = (itemString: string, nodeName: string) => {
    const parts = itemString.split(': ');
    const type = parts[0];
    const name = parts[1] || parts[0];

    if (type === 'Song') {
      const normName = name.toLowerCase().trim().replace(/[\\s\\(\\)\\-\\.]/g, '');
      const matchOfficial = liveOfficialSongs.find(s => {
        const t = (s.title_en || s.song_id || '').toLowerCase().trim().replace(/[\\s\\(\\)\\-\\.]/g, '');
        return t.includes(normName) || normName.includes(t);
      });
      if (matchOfficial) return setSelectedSongForModal(matchOfficial);

      const matchUnreleased = liveUnreleasedSongs.find(s => {
        const t = (s.title_en || s.song_id || '').toLowerCase().trim().replace(/[\\s\\(\\)\\-\\.]/g, '');
        return t.includes(normName) || normName.includes(t);
      });
      if (matchUnreleased) {
        return setSelectedSongForModal({
          song_id: matchUnreleased.song_id, title_en: matchUnreleased.title_en,
          title_bn: matchUnreleased.title_bn, album: 'Unreleased Archives // Few & Far Between',
          lyrics: matchUnreleased.lyrics, status: matchUnreleased.status || 'Unreleased'
        });
      }
      return setSelectedSongForModal({
        song_id: name.toLowerCase().replace(/[\\s\\(\\)\\-\\.]/g, '-'), title_en: name,
        album: `Archive Map Location: ${nodeName}`, status: 'Archived Track'
      });
    }

    if (type === 'Journal') {
      const normName = name.toLowerCase().trim();
      const matchJournal = liveJournals.find(j => j.title.toLowerCase().trim().includes(normName));
      if (matchJournal) return setSelectedJournalForModal(matchJournal);
      return setSelectedJournalForModal({
        id: 'journal-map-log', title: name,
        content: `This field entry was cataloged in the Kaaktaal archive under ${nodeName}.`
      });
    }

    setArchivedDetail({ isOpen: true, nodeName, item: itemString });
  };

  return (
    <div className="relative w-full h-full bg-[#111111] text-[#EAE8DE] overflow-hidden select-none font-sans">
      
      {/* Texture Layer */}
      <div className="absolute inset-0 bg-[#000] mix-blend-color-dodge opacity-10 pointer-events-none z-0" 
           style={{ backgroundImage: `radial-gradient(circle, #555 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      
      {/* 1. Header Control */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onMouseEnter={() => setIsHoveringControls(true)} onMouseLeave={() => setIsHoveringControls(false)}
            className="absolute top-4 left-4 z-20 max-w-sm bg-black/70 backdrop-blur-md p-4 border border-white/5 rounded-xs map-control-ui pointer-events-auto"
          >
            <h2 className="font-syne text-sm font-extrabold uppercase tracking-widest text-[#EAE8DE] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAE8DE] animate-pulse" />
              Cartography of Memory
            </h2>
            <p className="font-serif text-[11px] text-[#EAE8DE]/50 italic mt-1">
              An unfinished atlas. Scroll to zoom, drag to explore.
            </p>
            <div className="mt-3 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#EAE8DE]/30" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="w-full pl-7 pr-7 py-1.5 bg-white/5 border border-white/10 text-xs text-[#EAE8DE] focus:outline-none focus:border-white/30 rounded-xs placeholder:text-white/20"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return to Archive Button */}
      <AnimatePresence>
        {showUI && onBack && (
          <motion.div
            initial={{ opacity: 0, x: 120, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 120, y: -10 }}
            onMouseEnter={() => setIsHoveringControls(true)} onMouseLeave={() => setIsHoveringControls(false)}
            className="absolute top-4 right-0 z-30 map-control-ui pointer-events-auto"
          >
            <button
              onClick={onBack}
              className="py-2.5 px-5 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-[#D4CFC9] hover:text-white border-y border-l border-[#333] rounded-l-full rounded-r-none font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-xl flex items-center gap-2 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Archive</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Map Canvas */}
      <div 
        ref={containerRef}
        className={`w-full h-full relative cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
          className="absolute inset-0 origin-center transition-transform duration-75 ease-out select-none flex items-center justify-center"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <svg className="w-[1000px] h-[1000px] shrink-0 pointer-events-none select-none overflow-visible">
            <defs>
              <filter id="handdrawn" filterUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            {/* Voronoi Cells */}
            <g filter="url(#handdrawn)">
              {mapNodes.map((node, i) => {
                const isSelected = activeNode?.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const path = voronoi.renderCell(i);
                
                // Hide if filtered out but keep geometry
                if (searchQuery && !filteredNodes.find(n => n.id === node.id)) {
                  return <path key={node.id} d={path} fill="#111111" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />;
                }

                return (
                  <motion.g 
                    key={node.id} 
                    className="pointer-events-auto cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); centerNodeView(node); }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <motion.path 
                      d={path}
                      fill={node.color}
                      initial={{ fillOpacity: 0.4 }}
                      animate={{ 
                        fillOpacity: isSelected ? 0.9 : (isHovered ? 0.7 : 0.4),
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      stroke={isSelected ? "#EAE8DE" : "#333333"}
                      strokeOpacity={isSelected ? 0.5 : 0.4}
                      strokeWidth={isSelected ? 1.5 : 1}
                    />
                    
                    {/* Breathing inner glow for selected */}
                    {isSelected && (
                      <motion.path 
                        d={path}
                        fill="none"
                        stroke="#FAF9F6"
                        strokeWidth="2"
                        animate={{ strokeOpacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ pointerEvents: 'none' }}
                      />
                    )}

                    {/* Labels */}
                    <text
                      x={node.x} y={node.y - 5}
                      textAnchor="middle"
                      className="font-syne text-[14px] uppercase tracking-widest font-extrabold select-none"
                      fill={isSelected ? '#FAF9F6' : (isHovered ? '#EAE8DE' : 'rgba(234, 232, 222, 0.6)')}
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                    >
                      {node.name}
                    </text>
                    <text
                      x={node.x} y={node.y + 12}
                      textAnchor="middle"
                      className="font-serif text-[10px] italic select-none"
                      fill={isSelected ? 'rgba(234, 232, 222, 0.9)' : 'rgba(234, 232, 222, 0.4)'}
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                    >
                      {node.poeticSubtitle}
                    </text>
                    
                    {/* Seed Point Marker */}
                    <circle cx={node.x} cy={node.y + 25} r="1.5" fill={isSelected ? '#FAF9F6' : '#555'} opacity="0.5" />
                  </motion.g>
                );
              })}
            </g>

            {/* Relationship Lines (Only for active node) */}
            {activeNode && activeNode.relatedPlaceIds.map((targetId, idx) => {
              const targetNode = mapNodes.find(n => n.id === targetId);
              if (!targetNode) return null;
              return (
                <motion.line
                  key={`conn-${activeNode.id}-${targetId}`}
                  x1={activeNode.x} y1={activeNode.y}
                  x2={targetNode.x} y2={targetNode.y}
                  stroke="#FAF9F6"
                  strokeWidth="0.75"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: idx * 0.1 }}
                  style={{ pointerEvents: 'none' }}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Navigation Controls */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            className="absolute bottom-4 left-4 z-20 flex flex-col gap-2 map-control-ui pointer-events-auto"
          >
            <button onClick={() => setZoom(prev => Math.min(prev + 0.15, 2.5))} className="w-8 h-8 rounded-full border border-white/10 bg-black/70 text-white flex items-center justify-center shadow-md">＋</button>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.4))} className="w-8 h-8 rounded-full border border-white/10 bg-black/70 text-white flex items-center justify-center shadow-md">－</button>
            <button onClick={resetView} className="w-8 h-8 rounded-full border border-white/10 bg-black/70 text-white flex items-center justify-center text-xs shadow-md">⌖</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Slide-Out Memory Drawer (Archive Folder Style) */}
      <AnimatePresence>
        {activeNode && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveNode(null)}
              className="absolute inset-0 bg-black z-20 cursor-pointer pointer-events-auto"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[320px] sm:w-[420px] bg-[#161616] border-l border-white/5 z-30 p-8 flex flex-col justify-between shadow-2xl pointer-events-auto map-control-ui overflow-y-auto"
              style={{ backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))` }}
            >
              <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                      Territory Record // {activeNode.id.toUpperCase()}
                    </span>
                    <button onClick={() => setActiveNode(null)} className="text-white/30 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-syne text-3xl uppercase font-extrabold tracking-tighter text-[#FAF9F6]">
                    {activeNode.name}
                  </h3>
                  <div className="h-[1px] w-12 bg-white/20" />
                  <p className="font-serif text-sm text-[#EAE8DE]/80 leading-relaxed italic">
                    "{activeNode.poeticIntro}"
                  </p>
                </div>

                {/* Found Here */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/50">Found here</h4>
                  <ul className="space-y-2">
                    {activeNode.connectedItems.map((item, idx) => {
                      const itemParts = item.split(': ');
                      const itemType = itemParts[0];
                      const itemName = itemParts[1] || itemParts[0];
                      return (
                        <li 
                          key={idx} onClick={() => handleOpenConnectedItem(item, activeNode.name)}
                          className="group flex items-center gap-3 p-3 rounded-sm bg-black/20 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
                        >
                          {itemType === 'Song' && <Music className="w-3.5 h-3.5 text-white/40 group-hover:text-[#EAE8DE]" />}
                          {itemType === 'Journal' && <FileText className="w-3.5 h-3.5 text-white/40 group-hover:text-[#EAE8DE]" />}
                          {itemType !== 'Song' && itemType !== 'Journal' && <Sparkles className="w-3.5 h-3.5 text-white/40 group-hover:text-[#EAE8DE]" />}
                          
                          <span className="font-sans text-[12px] text-white/70 group-hover:text-white transition-colors">
                            {itemName}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Continue To (Relationships) */}
                {activeNode.relatedPlaceIds.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/50">Continue to</h4>
                    <div className="flex flex-col gap-2">
                      {activeNode.relatedPlaceIds.map(targetId => {
                        const targetNode = mapNodes.find(n => n.id === targetId);
                        if (!targetNode) return null;
                        return (
                          <button
                            key={targetId}
                            onClick={() => centerNodeView(targetNode)}
                            className="flex items-center justify-between p-3 rounded-sm bg-black/20 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left group"
                          >
                            <div>
                              <span className="block font-syne text-sm uppercase tracking-wider text-white/80 group-hover:text-white">{targetNode.name}</span>
                              <span className="block font-serif text-[10px] italic text-white/40">{targetNode.poeticSubtitle}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-transform group-hover:translate-x-1" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deep-Linked Modals... (Keeping them exactly the same structural logic, styled darkly) */}
      <AnimatePresence>
        {selectedSongForModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl relative">
               <button onClick={() => setSelectedSongForModal(null)} className="absolute -top-10 right-0 text-white/50 hover:text-white font-mono text-xs uppercase z-50">Close ×</button>
               <SongPage {...selectedSongForModal} onClose={() => setSelectedSongForModal(null)} />
            </div>
          </motion.div>
        )}
        {selectedJournalForModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#121212] border border-white/10 p-8 max-w-xl w-full relative">
              <button onClick={() => setSelectedJournalForModal(null)} className="absolute top-4 right-4 text-white/50 hover:text-white font-mono text-xs uppercase">Close ×</button>
              <h3 className="font-syne text-2xl uppercase tracking-tight text-[#FAF9F6] border-b border-white/10 pb-4 mb-4">{selectedJournalForModal.title}</h3>
              <p className="font-garamond text-lg text-white/80 leading-relaxed italic whitespace-pre-wrap">{selectedJournalForModal.content}</p>
            </motion.div>
          </motion.div>
        )}
        {archivedDetail.isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#121212] border border-white/10 p-8 max-w-lg w-full relative">
              <button onClick={() => setArchivedDetail({ isOpen: false, nodeName: '', item: null })} className="absolute top-4 right-4 text-white/50 hover:text-white font-mono text-xs uppercase">Close ×</button>
              <h3 className="font-syne text-2xl uppercase text-[#FAF9F6] border-b border-white/10 pb-4 mb-4">{archivedDetail.nodeName}</h3>
              <p className="font-sans text-sm text-white/70">Archival recovery for {archivedDetail.item || 'full catalog'} is logged.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
"""

with open("src/components/MapRoom.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Built new MapRoom.tsx")
