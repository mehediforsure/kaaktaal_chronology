"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import useEngagement from '../hooks/useEngagement';

interface MapNode {
  id: string;
  name: string;
  type: 'real' | 'imaginary' | 'memory' | 'show' | 'prison';
  x: number;
  y: number;
  description: string;
  songsCount: number;
  storiesCount: number;
  journalsCount: number;
  connectedItems: string[];
}

interface MapRoomProps {
  onBack?: () => void;
}

const MAP_NODES: MapNode[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    type: 'real',
    x: 500,
    y: 500,
    description: 'The beating heart of Kaaktaal’s memory map. A dense grid of overhead cables, river mist, and endless traffic where stories collide and crystallize.',
    songsCount: 14,
    storiesCount: 22,
    journalsCount: 18,
    connectedItems: ['Song: "Dhakaiya Goli"', 'Story: "The Overpass"', 'Journal: "Rainy Afternoon Logs"', 'Artwork: "Overhead Wires"', 'Timeline: "2024-2026 Dhaka Sessions"']
  },
  {
    id: 'jail',
    name: 'Dhaka Central Jail',
    type: 'prison',
    x: 350,
    y: 650,
    description: 'Origin place for many early songs. A heavy stone registry of voices trapped in time, echoing through damp corridors and rusted grates.',
    songsCount: 7,
    storiesCount: 12,
    journalsCount: 5,
    connectedItems: ['Song: "Lalbagh Walls"', 'Story: "The Warder’s Matchstick"', 'Journal: "July 3rd, 2026 Diary"', 'Artwork: "Cell No. 12 Ink Draft"', 'Timeline: "The Stone Inscriptions"']
  },
  {
    id: 'rooftop',
    name: 'Rooftop',
    type: 'memory',
    x: 580,
    y: 340,
    description: 'A sanctuary above the dust. Where nylon-string acoustics find space to float over the city skyline before the morning prayers begin.',
    songsCount: 9,
    storiesCount: 15,
    journalsCount: 8,
    connectedItems: ['Song: "Rooftop Raindrops"', 'Story: "Antennas and Crows"', 'Journal: "4 AM Recording Session Notes"', 'Artwork: "Skyline Charcoal Sketch"', 'Timeline: "Summer of 2025"']
  },
  {
    id: 'stall',
    name: 'Tea Stall',
    type: 'memory',
    x: 320,
    y: 480,
    description: 'A makeshift wooden bench under neon glare. Conversations drowned in condensed milk and boiling tea, where melodies were hummed in secret.',
    songsCount: 5,
    storiesCount: 9,
    journalsCount: 4,
    connectedItems: ['Song: "Condensed Milk Blues"', 'Story: "The Five-Taka Tea Whisperer"', 'Journal: "Scribbled Napkin Chord"', 'Artwork: "Hot Vapor Monotype"', 'Timeline: "Autumn 2024 Sessions"']
  },
  {
    id: 'window',
    name: 'Bus Window',
    type: 'memory',
    x: 680,
    y: 540,
    description: 'A moving frame of blurred city lights. Restless heads resting against vibrating window-panes as the wheels hum in standard tuning.',
    songsCount: 6,
    storiesCount: 11,
    journalsCount: 7,
    connectedItems: ['Song: "Sadarghat Passenger"', 'Story: "The Blue Ticket stub"', 'Journal: "Notes on a Vibrating Frame"', 'Artwork: "Blurred Dhaka Neon Photograph"', 'Timeline: "Monsoon Commutes 2025"']
  },
  {
    id: 'rain',
    name: 'Rainy Evening',
    type: 'imaginary',
    x: 620,
    y: 700,
    description: 'A place that exists only when water meets copper. The precise humidity that forces tape recorders to lag, opening a portal to a city that never was.',
    songsCount: 8,
    storiesCount: 6,
    journalsCount: 10,
    connectedItems: ['Song: "Tape Flutter and Wet Plaster"', 'Story: "The Floating Rickshaw"', 'Journal: "Damp Atmosphere Calibration Log"', 'Artwork: "Watercolour Wash in Grey"', 'Timeline: "Infinite Rainy Night Cycles"']
  },
  {
    id: 'imaginary-city',
    name: 'Imaginary City',
    type: 'imaginary',
    x: 760,
    y: 400,
    description: 'A slow, quiet, uncrowded replica of Dhaka that lives inside the acoustic resonances of the studio’s wooden floorboards.',
    songsCount: 11,
    storiesCount: 18,
    journalsCount: 12,
    connectedItems: ['Song: "Underneath the Concrete"', 'Story: "The Silent Rickshaw Driver"', 'Journal: "Blueprint of the Quiet Streets"', 'Artwork: "Floorboard Resonance Charcoal"', 'Timeline: "The Acoustic Grid Study"']
  },
  {
    id: 'tree',
    name: 'Under the Tree',
    type: 'memory',
    x: 420,
    y: 320,
    description: 'An old banyan tree whose roots swallow ancient brick walls. A natural cathedral where the rustling leaves provide a randomized metronome.',
    songsCount: 4,
    storiesCount: 8,
    journalsCount: 6,
    connectedItems: ['Song: "Banyan Metronome"', 'Story: "Roots in Red Soil"', 'Journal: "Acoustic Reflection in Leaves"', 'Artwork: "Bark Rubbing and Pencil Sketch"', 'Timeline: "Spring Outdoor Reel Sessions"']
  },
  {
    id: 'studio',
    name: 'Studio 6/6',
    type: 'show',
    x: 220,
    y: 360,
    description: 'A packed room of warm bodies, wooden stools, and direct-to-tape room recordings. The physical locus of Kaaktaal’s collective listening sessions.',
    songsCount: 12,
    storiesCount: 14,
    journalsCount: 9,
    connectedItems: ['Song: "Room Recording No. 04"', 'Story: "Sixty Stools, One Mic"', 'Journal: "Live Crowd Resonance Diary"', 'Artwork: "Folk Crowd Linocut"', 'Timeline: "December 2025 Show Logs"']
  },
  {
    id: 'stage',
    name: 'Empty Stage',
    type: 'show',
    x: 480,
    y: 180,
    description: 'The silence that follows a performance. Dusty spot-lights catching floating dust-motes over a floor cluttered with patch cables.',
    songsCount: 5,
    storiesCount: 8,
    journalsCount: 3,
    connectedItems: ['Song: "Vibration of Dying Chord"', 'Story: "The Lost Plectrum"', 'Journal: "Notes on Post-Performance Hum"', 'Artwork: "Cable Clutter Copper Print"', 'Timeline: "The 3 AM Post-Show Record"']
  },
  {
    id: 'memory-room',
    name: 'Memory Room',
    type: 'memory',
    x: 230,
    y: 580,
    description: 'A locked cabinet of high-bias tapes and written letters. An unmapped sanctuary where memory is stored, categorized, and gently forgotten.',
    songsCount: 10,
    storiesCount: 16,
    journalsCount: 11,
    connectedItems: ['Song: "Parchment Registry Anthem"', 'Story: "The Closed Wooden Box"', 'Journal: "Archival Cabinet Log"', 'Artwork: "Fading Letter Pencil Rubbing"', 'Timeline: "Foundations of the Archive"']
  }
];

const CONNECTIONS = [
  { from: 'dhaka', to: 'jail' },
  { from: 'dhaka', to: 'rooftop' },
  { from: 'dhaka', to: 'stall' },
  { from: 'dhaka', to: 'window' },
  { from: 'jail', to: 'memory-room' },
  { from: 'memory-room', to: 'stall' },
  { from: 'stall', to: 'studio' },
  { from: 'stall', to: 'tree' },
  { from: 'tree', to: 'stage' },
  { from: 'tree', to: 'rooftop' },
  { from: 'rooftop', to: 'stage' },
  { from: 'rooftop', to: 'imaginary-city' },
  { from: 'imaginary-city', to: 'window' },
  { from: 'imaginary-city', to: 'rain' },
  { from: 'window', to: 'rain' }
];

export default function MapRoom({ onBack }: MapRoomProps) {
  const { logAction } = useEngagement();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Panning & Zooming State
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 0.55 : 0.85;
    }
    return 0.85;
  });
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Detailed Archive modal
  const [archivedDetail, setArchivedDetail] = useState<{ isOpen: boolean; nodeName: string; item: string | null }>({
    isOpen: false,
    nodeName: '',
    item: null
  });

  // UI Auto-Hide States
  const [showUI, setShowUI] = useState(true);
  const [isHoveringControls, setIsHoveringControls] = useState(false);

  useEffect(() => {
    // Auto-hide controls after 4 seconds of inactivity
    const handleInactivity = () => {
      if (activeNode || hoveredNode || isHoveringControls) return;
      setShowUI(false);
    };

    let timer = setTimeout(handleInactivity, 4000);

    const handleActivity = () => {
      setShowUI(true);
      clearTimeout(timer);
      timer = setTimeout(handleInactivity, 4000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isHoveringControls, activeNode, hoveredNode]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging when clicking UI side panels or buttons
    if ((e.target as HTMLElement).closest('.map-control-ui')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Dragging support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.map-control-ui')) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  // Handle zooming via mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.08;
    const nextZoom = e.deltaY < 0 
      ? Math.min(zoom + zoomIntensity, 2.5) 
      : Math.max(zoom - zoomIntensity, 0.45);
    setZoom(nextZoom);
  };

  // Reset to center
  const resetView = () => {
    setZoom(window.innerWidth < 640 ? 0.55 : 0.85);
    setPan({ x: 0, y: 0 });
  };

  // Node styles configuration
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'real': return '#EAE8DE'; // Pearl white
      case 'prison': return '#8C8B82'; // Slate iron
      case 'memory': return '#A19E92'; // Muted sage/stone
      case 'show': return '#d31a1a'; // Brand red
      case 'imaginary': return '#CD9A62'; // Golden amber
      default: return '#EAE8DE';
    }
  };

  const getNodeTypeName = (type: string) => {
    switch (type) {
      case 'real': return 'Real Place';
      case 'prison': return 'Prison Location';
      case 'memory': return 'Memory Place';
      case 'show': return 'Show Location';
      case 'imaginary': return 'Imaginary Place';
      default: return 'Archive Site';
    }
  };

  // Filter nodes based on active filter
  const filteredNodes = MAP_NODES.filter(node => {
    if (activeFilter === 'all') return true;
    return node.type === activeFilter;
  });

  // Check if a line is active (either from or to is hovered/selected)
  const isLineActive = (from: string, to: string) => {
    const isHovered = hoveredNode && (hoveredNode.id === from || hoveredNode.id === to);
    const isSelected = activeNode && (activeNode.id === from || activeNode.id === to);
    return isHovered || isSelected;
  };

  return (
    <div className="relative w-full h-full bg-[#0E0E0E] text-bg overflow-hidden select-none">
      
      {/* Background paper texture & grit */}
      <div className="absolute inset-0 bg-[#0E0E0E] mix-blend-color-dodge opacity-5 pointer-events-none z-0" 
           style={{ backgroundImage: `radial-gradient(circle, #555 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,248,220,0.03)_0%,transparent_75%)] pointer-events-none z-0" />
      
      {/* 1. Header / Legend Overlay */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHoveringControls(true)}
            onMouseLeave={() => setIsHoveringControls(false)}
            className="absolute top-4 left-4 z-20 max-w-sm sm:max-w-md bg-black/80 backdrop-blur-md p-4 border border-bg/10 rounded-xs map-control-ui pointer-events-auto"
          >
            <h2 className="font-syne text-sm sm:text-base font-extrabold uppercase tracking-tight text-[#EAE8DE] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Illustrated Constellation Map
            </h2>
            <p className="font-sans text-[10px] sm:text-xs text-bg/60 leading-relaxed mt-1 select-text">
              An archival cartography of Kaaktaal. Explore the physical, imaginary, and memory grids that frame the tape logs. Drag to pan, wheel to zoom.
            </p>

            {/* Legend pills */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-bg/10">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-2 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                  activeFilter === 'all' ? 'bg-bg text-black border-bg' : 'bg-transparent text-bg/60 border-bg/20 hover:border-bg/40'
                }`}
              >
                All Nodes
              </button>
              <button 
                onClick={() => setActiveFilter('real')}
                className={`px-2 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                  activeFilter === 'real' ? 'bg-[#EAE8DE] text-black border-[#EAE8DE]' : 'bg-transparent text-[#EAE8DE]/60 border-[#EAE8DE]/20 hover:border-[#EAE8DE]/40'
                }`}
              >
                Real
              </button>
              <button 
                onClick={() => setActiveFilter('imaginary')}
                className={`px-2 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                  activeFilter === 'imaginary' ? 'bg-[#CD9A62] text-black border-[#CD9A62]' : 'bg-transparent text-[#CD9A62]/60 border-[#CD9A62]/20 hover:border-[#CD9A62]/40'
                }`}
              >
                Imaginary
              </button>
              <button 
                onClick={() => setActiveFilter('memory')}
                className={`px-2 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                  activeFilter === 'memory' ? 'bg-[#A19E92] text-black border-[#A19E92]' : 'bg-transparent text-[#A19E92]/60 border-[#A19E92]/20 hover:border-[#A19E92]/40'
                }`}
              >
                Memory
              </button>
              <button 
                onClick={() => setActiveFilter('show')}
                className={`px-2 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                  activeFilter === 'show' ? 'bg-[#E0533C] text-bg border-[#E0533C]' : 'bg-transparent text-[#E0533C]/60 border-[#E0533C]/20 hover:border-[#E0533C]/40'
                }`}
              >
                Show
              </button>
              <button 
                onClick={() => setActiveFilter('prison')}
                className={`px-2 py-0.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                  activeFilter === 'prison' ? 'bg-[#8C8B82] text-black border-[#8C8B82]' : 'bg-transparent text-[#8C8B82]/60 border-[#8C8B82]/20 hover:border-[#8C8B82]/40'
                }`}
              >
                Prison
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1.5. Return to Archive Button (Top Right) */}
      <AnimatePresence>
        {showUI && onBack && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHoveringControls(true)}
            onMouseLeave={() => setIsHoveringControls(false)}
            className="absolute top-4 right-4 z-30 map-control-ui pointer-events-auto"
          >
            <button
              onClick={onBack}
              className="p-2 sm:px-4 sm:py-2 bg-transparent sm:bg-black/85 hover:text-white sm:hover:bg-bg sm:hover:text-black border-none sm:border sm:border-bg/20 rounded-xs text-[10px] font-mono tracking-widest text-[#EAE8DE] transition-all cursor-pointer shadow-none sm:shadow-md flex items-center gap-1.5 active:translate-y-[1px]"
              title="Return where you came from"
            >
              <ArrowLeft className="w-4 h-4 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">RETURN WHERE YOU CAME FROM</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Map Canvas (Saves mouse actions for panning/zooming) */}
      <div 
        ref={containerRef}
        className={`w-full h-full relative cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Constellation Container */}
        <div 
          className="absolute inset-0 origin-center transition-transform duration-75 ease-out select-none flex items-center justify-center"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <svg className="w-[1100px] h-[900px] shrink-0 pointer-events-none select-none overflow-visible">
            {/* SVG filter for textured hand-drawn paths */}
            <defs>
              <filter id="handdrawn" filterUnits="userSpaceOnUse" x="0" y="0" width="1100" height="900">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1100" height="900">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connecting Lines */}
            {CONNECTIONS.map((conn, idx) => {
              const fromNode = MAP_NODES.find(n => n.id === conn.from);
              const toNode = MAP_NODES.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const active = isLineActive(conn.from, conn.to);

              return (
                <g key={idx}>
                  {/* Outer glow line on hover */}
                  {active && (
                    <motion.line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={getNodeColor(fromNode.type)}
                      strokeWidth="2.5"
                      opacity="0.35"
                      filter="url(#glow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  {/* Core hand-drawn line */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={active ? '#EAE8DE' : '#EAE8DE'}
                    strokeWidth={active ? '1.5' : '0.8'}
                    strokeDasharray={fromNode.type === 'imaginary' || toNode.type === 'imaginary' ? '3 4' : active ? '0' : '2 2'}
                    opacity={active ? '0.85' : '0.22'}
                    className="transition-all duration-300"
                    filter="url(#handdrawn)"
                  />
                  {/* Subtle moving particles on active connecting lines */}
                  {active && (
                    <motion.circle
                      r="1.5"
                      fill="#E0533C"
                      animate={{
                        cx: [fromNode.x, toNode.x],
                        cy: [fromNode.y, toNode.y]
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Ambient Background Elements (Constellations / Compass) */}
            <circle cx="500" cy="500" r="410" stroke="#FAF9F6" strokeWidth="0.5" strokeDasharray="1 15" opacity="0.1" />
            <circle cx="500" cy="500" r="180" stroke="#FAF9F6" strokeWidth="0.5" strokeDasharray="3 20" opacity="0.08" />
            <line x1="500" y1="50" x2="500" y2="950" stroke="#FAF9F6" strokeWidth="0.5" strokeDasharray="2 30" opacity="0.05" />
            <line x1="50" y1="500" x2="950" y2="500" stroke="#FAF9F6" strokeWidth="0.5" strokeDasharray="2 30" opacity="0.05" />

            {/* Nodes group */}
            {filteredNodes.map((node) => {
              const isSelected = activeNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const nodeColor = getNodeColor(node.type);

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    logAction('map_click');
                    setActiveNode(node);
                  }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Floating trigger/hit area */}
                  <circle r="26" fill="transparent" />

                  {/* Pulsing visual halo for specific type or on hover */}
                  {(isHovered || isSelected) && (
                    <motion.circle
                      r="22"
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="1"
                      opacity="0.3"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  )}

                  {/* Type Specific Hand-Drawn / Archival Elements */}
                  {node.type === 'real' && (
                    <g>
                      <circle r="7.5" fill="none" stroke={nodeColor} strokeWidth="1.2" />
                      <circle r="3.5" fill={nodeColor} />
                    </g>
                  )}

                  {node.type === 'prison' && (
                    <g>
                      {/* Heavy square border */}
                      <rect x="-6" y="-6" width="12" height="12" fill="none" stroke={nodeColor} strokeWidth="1.5" />
                      {/* Prison bars inside */}
                      <line x1="-3" y1="-6" x2="-3" y2="6" stroke={nodeColor} strokeWidth="0.8" />
                      <line x1="0" y1="-6" x2="0" y2="6" stroke={nodeColor} strokeWidth="0.8" />
                      <line x1="3" y1="-6" x2="3" y2="6" stroke={nodeColor} strokeWidth="0.8" />
                    </g>
                  )}

                  {node.type === 'memory' && (
                    <g>
                      {/* Wobbly wiggling memory point */}
                      <motion.circle 
                        r="5.5" 
                        fill="none" 
                        stroke={nodeColor} 
                        strokeWidth="1" 
                        animate={{ y: [0, -2, 1, 0], x: [0, 1, -1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <circle r="2" fill={nodeColor} opacity="0.8" />
                    </g>
                  )}

                  {node.type === 'show' && (
                    <g>
                      {/* Diamond marker */}
                      <polygon points="0,-7 7,0 0,7 -7,0" fill="none" stroke={nodeColor} strokeWidth="1.5" />
                      <circle r="2.5" fill={nodeColor} />
                    </g>
                  )}

                  {node.type === 'imaginary' && (
                    <g>
                      {/* Concentric dashed nebula rings */}
                      <motion.circle 
                        r="8" 
                        fill="none" 
                        stroke={nodeColor} 
                        strokeWidth="0.8" 
                        strokeDasharray="2 2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.circle 
                        r="4" 
                        fill="none" 
                        stroke={nodeColor} 
                        strokeWidth="1.2" 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </g>
                  )}

                  {/* Text label underneath node */}
                  <text
                    y="20"
                    textAnchor="middle"
                    className="font-mono text-[9px] uppercase tracking-wider select-none font-semibold"
                    fill={isHovered || isSelected ? '#EAE8DE' : 'rgba(234, 232, 222, 0.55)'}
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.85)' }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Standard Navigation Controls (Zoom/Reset) */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHoveringControls(true)}
            onMouseLeave={() => setIsHoveringControls(false)}
            className="absolute bottom-4 left-4 z-20 flex flex-col gap-2 map-control-ui pointer-events-auto"
          >
            <button 
              onClick={() => setZoom(prev => Math.min(prev + 0.15, 2.5))}
              className="w-8 h-8 rounded-full border border-bg/20 bg-black/85 text-bg hover:bg-bg hover:text-black flex items-center justify-center font-mono text-sm shadow-md transition-colors cursor-pointer"
              title="Zoom In"
            >
              ＋
            </button>
            <button 
              onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.45))}
              className="w-8 h-8 rounded-full border border-bg/20 bg-black/85 text-bg hover:bg-bg hover:text-black flex items-center justify-center font-mono text-sm shadow-md transition-colors cursor-pointer"
              title="Zoom Out"
            >
              －
            </button>
            <button 
              onClick={resetView}
              className="w-8 h-8 rounded-full border border-bg/20 bg-black/85 text-bg hover:bg-bg hover:text-black flex items-center justify-center font-mono text-xs shadow-md transition-colors cursor-pointer"
              title="Recenter"
            >
              ⌖
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Soft Hover Tooltip Overlay */}
      <AnimatePresence>
        {hoveredNode && !activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/90 backdrop-blur-md border border-bg/15 px-5 py-3.5 rounded-xs shadow-xl min-w-[180px] pointer-events-none select-none text-center"
          >
            <div className="font-mono text-[8px] uppercase tracking-widest text-[#CD9A62]">
              {getNodeTypeName(hoveredNode.type)}
            </div>
            <h4 className="font-syne text-xs font-extrabold uppercase tracking-tight text-bg mt-0.5">
              {hoveredNode.name}
            </h4>
            
            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-bg/10 font-mono text-[9px] text-bg/70">
              <div>
                <span className="block font-bold text-bg">{hoveredNode.songsCount}</span>
                Songs
              </div>
              <div>
                <span className="block font-bold text-bg">{hoveredNode.storiesCount}</span>
                Stories
              </div>
              <div>
                <span className="block font-bold text-bg">{hoveredNode.journalsCount}</span>
                Journals
              </div>
            </div>

            <div className="text-[8px] font-mono uppercase tracking-widest text-accent mt-3 opacity-90 animate-pulse">
              [Click Node to Explore]
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Elegant Narrative Side Drawer (Slide-out detail panel) */}
      <AnimatePresence>
        {activeNode && (
          <>
            {/* Dark blur backdrop for panel focus */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNode(null)}
              className="absolute inset-0 bg-black z-20 cursor-pointer pointer-events-auto"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 180 }}
              className="absolute right-0 top-0 h-full w-[300px] sm:w-[380px] bg-[#111111] border-l border-bg/15 z-30 p-6 flex flex-col justify-between shadow-2xl pointer-events-auto map-control-ui select-none overflow-y-auto"
            >
              {/* Top Row & Node Details */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-bg/10 pb-4">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-accent font-extrabold">
                      {getNodeTypeName(activeNode.type)}
                    </span>
                    <p className="font-mono text-[9px] uppercase text-bg/40 tracking-wider">Coordinates: {activeNode.x} , {activeNode.y}</p>
                  </div>
                  <button 
                    onClick={() => setActiveNode(null)}
                    className="font-mono text-[10px] uppercase tracking-widest text-bg/60 hover:text-accent font-extrabold cursor-pointer"
                  >
                    Close ×
                  </button>
                </div>

                {/* Node Name */}
                <div className="space-y-2">
                  <h3 className="font-syne text-2xl uppercase font-extrabold tracking-tighter text-[#EAE8DE]">
                    {activeNode.name}
                  </h3>
                  <div className="h-[1.5px] bg-accent/40 w-12" />
                </div>

                {/* Node Narrative description */}
                <p className="font-sans text-xs text-bg/85 leading-relaxed italic select-text">
                  “{activeNode.description}”
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-3 gap-2 py-3 bg-black/40 border border-bg/10 rounded-xs text-center font-mono text-[10px]">
                  <div>
                    <span className="block text-sm font-extrabold text-[#E0533C]">{activeNode.songsCount}</span>
                    <span className="text-bg/50 uppercase text-[8px]">Songs</span>
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-[#CD9A62]">{activeNode.storiesCount}</span>
                    <span className="text-bg/50 uppercase text-[8px]">Stories</span>
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-[#A19E92]">{activeNode.journalsCount}</span>
                    <span className="text-bg/50 uppercase text-[8px]">Journals</span>
                  </div>
                </div>

                {/* Connected Items listing */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#EAE8DE] font-bold">
                    Connected Archive Items
                  </h4>
                  <ul className="space-y-1.5">
                    {activeNode.connectedItems.map((item, idx) => {
                      const itemParts = item.split(': ');
                      const itemType = itemParts[0];
                      const itemName = itemParts[1];

                      return (
                        <li 
                          key={idx}
                          onClick={() => setArchivedDetail({ isOpen: true, nodeName: activeNode.name, item: item })}
                          className="group flex items-center justify-between p-2 rounded-xs bg-black/35 hover:bg-accent/10 border border-bg/5 hover:border-accent/20 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-[#CD9A62] group-hover:bg-accent transition-colors" />
                            <span className="font-mono text-[9px] uppercase text-bg/40 group-hover:text-accent/80 transition-colors">
                              [{itemType}]
                            </span>
                            <span className="font-sans text-[11px] text-bg/85 group-hover:text-[#EAE8DE] transition-colors line-clamp-1">
                              {itemName}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-bg/30 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all">
                            →
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* View Archive Button */}
              <div className="pt-4 border-t border-bg/10">
                <button 
                  onClick={() => setArchivedDetail({ isOpen: true, nodeName: activeNode.name, item: null })}
                  className="w-full py-2.5 bg-accent hover:bg-accent/90 text-bg font-mono text-[10px] uppercase tracking-widest font-extrabold transition-all text-center rounded-xs shadow-md cursor-pointer active:translate-y-[1px]"
                >
                  View Node Archive
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Poetic Archive Detail Modal */}
      <AnimatePresence>
        {archivedDetail.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#121212] border-2 border-bg/20 text-[#FAF9F6] p-6 sm:p-8 max-w-lg w-full rounded-sm shadow-2xl relative select-text"
            >
              <button 
                onClick={() => setArchivedDetail({ isOpen: false, nodeName: '', item: null })}
                className="absolute top-4 right-4 font-mono text-xs uppercase tracking-wider hover:text-accent font-bold cursor-pointer text-[#FAF9F6]/60"
              >
                Close ×
              </button>

              <div className="space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-extrabold">
                  {archivedDetail.item ? 'Archive Item Recovery' : 'Node Catalog Ledger'}
                </span>
                
                <h3 className="font-syne text-xl sm:text-2xl font-extrabold uppercase tracking-tight border-b border-bg/10 pb-3">
                  {archivedDetail.nodeName}
                </h3>

                {archivedDetail.item ? (
                  <div className="space-y-3">
                    <p className="font-mono text-[10px] uppercase text-[#CD9A62]">
                      Recovered {archivedDetail.item.split(': ')[0]}
                    </p>
                    <p className="font-sans text-sm font-semibold text-bg">
                      "{archivedDetail.item.split(': ')[1]}"
                    </p>
                    <p className="font-sans text-xs text-bg/70 leading-relaxed pt-2 border-t border-bg/5">
                      This unreleased item was captured during the early morning sessions in Dhaka. The original multi-track copper reels contain wet environmental recordings, hum from surrounding transformer cables, and local neighborhood whispers that happened to leak into the microphones.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="font-sans text-xs text-bg/85 leading-relaxed">
                      You are inspecting the complete archival records for <strong className="text-[#E0533C]">{archivedDetail.nodeName}</strong>. 
                    </p>
                    <p className="font-sans text-xs text-bg/70 leading-relaxed">
                      This includes physical tapes cataloged inside the wooden cabinet, handwritten chord progressions on standard grid notebooks, and charcoal artwork drafts preserved on textured heavy acid-free parchment.
                    </p>
                    <div className="p-3 bg-black/50 rounded-xs border border-bg/5 space-y-1 font-mono text-[9px] text-[#A19E92]">
                      <p>CATALOG CODE: KK-MAP-{archivedDetail.nodeName.toUpperCase().replace(/\s+/g, '-')}-2026</p>
                      <p>MEDIUM: Direct high-bias stereo room transfer</p>
                      <p>METADATA ENCODING: Standard 24-bit PCM WAV / 96kHz</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setArchivedDetail({ isOpen: false, nodeName: '', item: null })}
                    className="px-5 py-2 border border-bg/20 hover:bg-bg hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest rounded-xs cursor-pointer"
                  >
                    Acknowledge &amp; Return
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
