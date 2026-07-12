'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveRoom, CrowAccident, FinderTab } from '../types';
import { CROW_ACCIDENTS } from '../data';
import useEngagement from '../hooks/useEngagement';
import { supabase } from '@/lib/supabase';

import { getOptimizedImageUrl } from '../utils/image';
import Crow from '../components/Crow';
import WaveFooter from '../components/WaveFooter';
import MemoryRoom from '../components/MemoryRoom';
import { Menu, X } from 'lucide-react';

// Section/Room imports
import { PortalCard, FinderCard } from '../components/DirectoryHero';
import JournalSection from '../components/JournalSection';
import PortalRoom from '../components/PortalRoom';
import MusicArchiveRoom from '../components/MusicArchiveRoom';
import FinderRoom from '../components/FinderRoom';
import MapRoom from '../components/MapRoom';
import AccidentRoom from '../components/AccidentRoom';

// --- TEMPORARY: Supabase connectivity test ---
async function testSupabase() {
  const { data, error } = await supabase
    .from('journals')
    .insert({
      title: 'Test Journal',
      content: 'Hello from Kaaktaal.',
      status: 'draft',
    });

  console.log('Supabase data:', data);
  console.log('Supabase error:', error);

  if (error) {
    alert(`Supabase Error: ${error.message}`);
  } else {
    alert('✅ Supabase insert successful! Check your dashboard.');
  }
}
// --- END TEMPORARY ---

function AppContent() {
  const [activeRoom, setActiveRoom] = useState<ActiveRoom>('home');
  const [showMemoryInvitation, setShowMemoryInvitation] = useState(false);
  const [hasDismissedInvitation, setHasDismissedInvitation] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeFinderTab, setActiveFinderTab] = useState<FinderTab>('music');
  const [isFinderNavOpen, setIsFinderNavOpen] = useState(false);

  const { logAction } = useEngagement();
  const [currentOverlayAccident, setCurrentOverlayAccident] = useState<CrowAccident | null>(null);

  // Log room visits to the engagement tracker
  useEffect(() => {
    logAction('visit_room', activeRoom);
  }, [activeRoom, logAction]);

  const handleRoomChange = (room: ActiveRoom) => {
    setActiveRoom(room);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerRandomAccident = () => {
    const rand = CROW_ACCIDENTS[Math.floor(Math.random() * CROW_ACCIDENTS.length)];
    setCurrentOverlayAccident(rand);
  };

  // Auto-trigger the subtle parchment paper invitation of memory after being on the finder page for exactly 5 seconds
  useEffect(() => {
    if (activeRoom !== 'finder' || hasDismissedInvitation || showMemoryInvitation) return;

    const timer = setTimeout(() => {
      setShowMemoryInvitation(true);
    }, 5000); // 5 seconds on finder page

    return () => clearTimeout(timer);
  }, [activeRoom, hasDismissedInvitation, showMemoryInvitation]);

  const renderAccidentContent = () => {
    if (!currentOverlayAccident) return null;

    switch (currentOverlayAccident.type) {
      case 'song':
        return (
          <div className="space-y-4">
            {currentOverlayAccident.image && (
              <div className="w-full h-44 rounded-xs overflow-hidden border border-ink/20 relative group">
                <img 
                  src={getOptimizedImageUrl(currentOverlayAccident.image, 400)} 
                  alt={currentOverlayAccident.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-bg/90 border border-ink text-[8px] font-mono uppercase px-2 py-0.5 tracking-wider">
                  Cassette Rip
                </div>
              </div>
            )}
            <div className="space-y-2">
              <h3 className="font-syne text-xl font-extrabold uppercase tracking-tight text-ink leading-tight flex items-center gap-2">
                <span className="text-xs">M</span> {currentOverlayAccident.title}
              </h3>
              <p className="font-sans text-sm text-ink/80 leading-relaxed">
                {currentOverlayAccident.content}
              </p>
            </div>
          </div>
        );

      case 'lyric':
        return (
          <div className="space-y-4 text-center py-2 relative overflow-hidden">
            <div className="absolute -top-6 -left-2 text-8xl font-plakatbau text-ink/[0.04] select-none pointer-events-none">
              &ldquo;
            </div>
            <div className="space-y-4 relative z-10">
              {currentOverlayAccident.bengali && (
                <p className="font-sans text-lg sm:text-xl font-bold text-ink leading-relaxed">
                  {currentOverlayAccident.bengali}
                </p>
              )}
              <p className="font-sans text-sm sm:text-base italic text-ink/80 leading-relaxed max-w-xs mx-auto">
                {currentOverlayAccident.content}
              </p>
              <div className="w-12 h-[1px] bg-accent/30 mx-auto my-1" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-semibold block">
                {currentOverlayAccident.subtext}
              </span>
            </div>
          </div>
        );

      case 'story':
        return (
          <div className="space-y-3 bg-ink/[0.02] border border-dashed border-ink/20 p-4 rounded-xs">
            <span className="font-mono text-[8px] uppercase tracking-wider text-accent border border-accent/30 px-1.5 py-0.5 rounded-xs inline-block">
              Vault Lore Log
            </span>
            <h3 className="font-syne text-lg font-bold uppercase tracking-tight text-ink">
              {currentOverlayAccident.title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-ink/85 leading-relaxed italic">
              &quot;{currentOverlayAccident.content}&quot;
            </p>
          </div>
        );

      case 'artwork':
        return (
          <div className="space-y-4">
            {currentOverlayAccident.image && (
              <div className="w-full h-48 rounded-xs overflow-hidden border-2 border-ink shadow-[2px_2px_0px_rgba(17,17,19,0.1)]">
                <img 
                  src={getOptimizedImageUrl(currentOverlayAccident.image, 450)} 
                  alt={currentOverlayAccident.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            )}
            <div className="space-y-1">
              <h4 className="font-mono text-[9px] uppercase tracking-wider text-accent">
                Featured Artwork
              </h4>
              <h3 className="font-syne text-lg font-extrabold uppercase tracking-tight text-ink">
                {currentOverlayAccident.title}
              </h3>
              <p className="font-sans text-xs text-ink/70 leading-relaxed">
                {currentOverlayAccident.content}
              </p>
            </div>
          </div>
        );

      case 'journal':
        return (
          <div className="space-y-3 relative p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] border border-ink/10 rounded-xs">
            <div className="flex justify-between items-center text-[8px] font-mono text-ink/40 uppercase">
              <span>Typewriter Note</span>
              <span>{currentOverlayAccident.subtext}</span>
            </div>
            <h3 className="font-mono text-sm font-bold uppercase text-ink/80">
              {currentOverlayAccident.title}
            </h3>
            <p className="font-mono text-xs text-ink/75 leading-relaxed whitespace-pre-wrap">
              {currentOverlayAccident.content}
            </p>
          </div>
        );

      case 'memory':
        return (
          <div className="space-y-3 border-l-4 border-accent pl-4 py-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
              ⚡ Show Memory
            </span>
            <h3 className="font-syne text-lg font-extrabold uppercase tracking-tight text-ink leading-tight">
              {currentOverlayAccident.title}
            </h3>
            <p className="font-sans text-sm text-ink/80 leading-relaxed italic">
              {currentOverlayAccident.content}
            </p>
            <span className="font-mono text-[9px] uppercase tracking-wider text-ink/50 block">
              — {currentOverlayAccident.subtext}
            </span>
          </div>
        );

      case 'unpublished':
        return (
          <div className="space-y-3 bg-red-500/[0.02] border border-red-500/20 p-4 rounded-xs relative overflow-hidden">
            <div className="absolute top-2 right-2 border border-red-500/30 text-red-500/70 text-[8px] font-mono px-1 py-0.2 uppercase tracking-widest rounded-xs rotate-6 font-bold select-none">
              Unreleased // Demo
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-red-500 font-bold block">
              🔒 Vault Restricted
            </span>
            <h3 className="font-syne text-lg font-extrabold uppercase tracking-tight text-ink">
              {currentOverlayAccident.title}
            </h3>
            <p className="font-sans text-xs text-ink/70 leading-relaxed">
              {currentOverlayAccident.content}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-ink/40">
              {currentOverlayAccident.subtext}
            </p>
          </div>
        );

      case 'interpretation':
        return (
          <div className="space-y-3 bg-yellow-500/[0.02] border border-yellow-500/20 p-4 rounded-xs relative">
            <h3 className="font-syne text-base sm:text-lg font-extrabold uppercase tracking-tight text-ink">
              {currentOverlayAccident.title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-ink/75 leading-relaxed italic">
              &quot;{currentOverlayAccident.content}&quot;
            </p>
            <div className="pt-2 border-t border-ink/5 text-left">
              <span className="font-mono text-[9px] uppercase text-ink/40">
                Verdict: Wrong interpretation
              </span>
            </div>
          </div>
        );

      case 'question':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold block">
                ❓ Inquiry
              </span>
              <h3 className="font-syne text-lg sm:text-xl font-extrabold uppercase tracking-tight text-ink leading-snug">
                {currentOverlayAccident.title}
              </h3>
              <p className="font-sans text-sm text-ink/80 leading-relaxed italic">
                &quot;{currentOverlayAccident.content}&quot;
              </p>
            </div>
            
            <div className="space-y-2">
              <textarea
                placeholder="Reflect here... let your thoughts turn to dust."
                rows={2}
                className="w-full text-xs font-mono p-3 bg-bg border border-ink/20 focus:border-accent focus:outline-none resize-none rounded-xs text-ink"
              />
              <button
                onClick={() => {
                  alert("Your thought has been scattered in the Dhaka wind. It is now part of the archive's soil.");
                }}
                className="px-3 py-1.5 border border-ink bg-bg hover:bg-ink hover:text-bg text-[8px] font-mono uppercase tracking-widest font-bold transition-all duration-200 rounded-xs cursor-pointer"
              >
                Commit to the Wind
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const drawerLinks = [
    { key: 'home' as ActiveRoom, label: 'Entrance' },
    { key: 'portal' as ActiveRoom, label: 'The Portal' },
    { key: 'finder' as ActiveRoom, label: 'The Finder' },
    { key: null, label: 'Archive', isDisabled: true }
  ];

  const renderActiveRoom = () => {
    switch (activeRoom) {
      case 'home':
        return (
          <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-6 py-2 select-none space-y-4 md:space-y-6 lg:space-y-4 xl:space-y-6">
            {/* 1. Portal Entrance on Top (Centered) */}
            <div className="w-full max-w-xl mx-auto mt-1 md:mt-2">
              <PortalCard onRoomChange={handleRoomChange} />
            </div>
            
            {/* 2. Middle and Bottom Section */}
            <div className="w-full max-w-xl mx-auto mt-4 md:mt-6">
              <JournalSection />
            </div>

            {/* --- TEMPORARY: Supabase Test Button --- */}
            <div className="w-full max-w-xl mx-auto mt-4">
              <button
                onClick={testSupabase}
                className="px-4 py-2 border-2 border-ink bg-bg hover:bg-ink hover:text-bg font-mono text-xs uppercase tracking-widest font-bold transition-all duration-200 rounded-xs cursor-pointer"
              >
                Test Supabase
              </button>
            </div>
            {/* --- END TEMPORARY --- */}
          </div>
        );
      case 'portal':
        return (
          <div className="pt-4 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-4 md:pt-8 md:px-8 md:pb-4 flex-1 max-w-5xl mx-auto w-full flex flex-col relative z-10">
            {/* Subtle radial glow to blend the light slate-green portal card into the off-white page background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(213,220,217,0.35)_0%,transparent_75%)] pointer-events-none z-0" />
            <div className="relative z-10 flex-1 flex flex-col">
              <PortalRoom onRoomChange={handleRoomChange} triggerRandomAccident={triggerRandomAccident} />
            </div>
          </div>
        );
      case 'music':
        return (
          <div className="p-6 md:p-12 flex-1 max-w-5xl mx-auto w-full">
            <MusicArchiveRoom />
          </div>
        );
      case 'finder':
        const isMapTab = activeFinderTab === 'map';
        return (
          <div className={isMapTab 
            ? "pt-0 pb-0 px-0 max-w-none w-full h-full flex flex-col flex-1" 
            : "pt-0 pb-6 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto w-full flex flex-col justify-start flex-1"
          }>
            <FinderRoom 
              activeTab={activeFinderTab} 
              onBack={() => {
                setActiveFinderTab('music');
              }}
            />
          </div>
        );
      case 'memory':
        return (
          <div className="p-6 md:p-12 flex-1">
            <MemoryRoom />
          </div>
        );
      case 'map':
        return (
          <div className="w-full h-full flex-1">
            <MapRoom onBack={() => handleRoomChange('home')} />
          </div>
        );
      case 'accident':
        return (
          <div className="flex-1">
            <AccidentRoom />
          </div>
        );
      default:
        return null;
    }
  };

  const isFullPageMap = activeRoom === 'map' || (activeRoom === 'finder' && activeFinderTab === 'map');

  return (
    <div className={`${isFullPageMap ? 'h-screen overflow-hidden' : 'min-h-screen justify-between'} bg-bg flex flex-col selection:bg-accent/15 relative font-sans text-ink`}>
      
      {/* Slide-out Drawer Panel */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-xs cursor-pointer"
            />
            {/* Slide-out cabinet drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[320px] sm:w-[380px] bg-bg border-r-2 border-ink z-50 p-8 flex flex-col justify-between shadow-[6px_0px_12px_rgba(17,17,19,0.15)] select-none"
            >
              <div className="space-y-12">
                {/* Drawer Header */}
                <div className="flex justify-between items-center border-b border-ink/10 pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Archival Collection</span>
                    <p className="font-mono text-xs uppercase tracking-wider font-bold text-accent">Cabinet Drawer</p>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="font-mono text-xs uppercase tracking-widest text-ink hover:text-accent font-bold cursor-pointer"
                  >
                    Close ×
                  </button>
                </div>

                {/* Typography-First Navigation list */}
                <nav className="flex flex-col gap-6 pt-4">
                  {drawerLinks.map((link) => {
                    const isActive = activeRoom === link.key;
                    
                    if (link.isDisabled) {
                      return (
                        <div key={link.label} className="opacity-30 flex items-baseline gap-4 select-none">
                          <span className="font-syne text-xl uppercase font-extrabold tracking-tight text-ink">
                            {link.label} <span className="text-[9px] uppercase tracking-widest ml-2 bg-ink text-bg px-1 py-0.5 rounded-xs font-mono font-normal">Coming Soon</span>
                          </span>
                        </div>
                      );
                    }
                    return (
                      <button
                        key={link.label}
                        onClick={() => {
                          if (link.key) {
                            handleRoomChange(link.key);
                          }
                          setIsDrawerOpen(false);
                        }}
                        className="group flex items-baseline gap-4 text-left w-full cursor-pointer"
                      >
                        <span className={`font-syne text-2xl uppercase font-extrabold tracking-tighter transition-all group-hover:text-accent group-hover:pl-2 duration-300 ${
                          isActive ? 'text-accent underline underline-offset-4 decoration-accent/30' : 'text-ink'
                        }`}>
                          {link.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-ink/10 pt-6 font-mono text-[10px] text-ink/40 space-y-1">
                <p>KAAKTAAL ARCHIVE</p>
                <p>© 2026</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Header */}
      {!isFullPageMap && (
        <header className="px-6 md:px-12 lg:px-16 flex justify-between items-center bg-bg select-none py-3 md:py-4 z-30">
          <button 
            onClick={() => handleRoomChange('home')}
            className="text-left focus:outline-none cursor-pointer group flex items-center gap-4 animate-fade-in translate-y-1 md:translate-y-2"
          >
            <img 
              src={getOptimizedImageUrl("https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png", 250)}
              alt="Kaaktaal Logo"
              className="w-auto object-contain filter hover:brightness-110 transition-all duration-300 h-18 md:h-22"
              referrerPolicy="no-referrer"
            />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-[10px] md:text-xs text-accent tracking-widest uppercase border-l-2 border-accent pl-4 ml-2 max-w-[200px] leading-tight hidden sm:inline-block">
              Coincidence &amp; Serendipity
            </span>
          </button>


          {/* Navigation Cabinet & Finder Actions */}
          <div className="flex items-center gap-3 sm:gap-4 z-20">
            <AnimatePresence mode="wait">
              {activeRoom === 'home' && (
                <motion.div
                  key="header-finder-btn"
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ 
                    opacity: { duration: 0.25, ease: "easeOut" },
                    scale: { type: "spring", stiffness: 350, damping: 25 },
                    y: { type: "spring", stiffness: 350, damping: 25 }
                  }}
                >
                  <FinderCard onRoomChange={handleRoomChange} isShrunk={true} />
                </motion.div>
              )}

              {activeRoom === 'finder' && (
                <motion.div
                  key="header-finder-dropdown"
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="relative select-none translate-y-1 md:translate-y-2"
                >
                  <button
                    onClick={() => setIsFinderNavOpen(!isFinderNavOpen)}
                    className="flex items-center gap-2 text-ink cursor-pointer hover:text-accent transition-colors duration-150 select-none font-plakatbau text-[15px] sm:text-[18px] uppercase tracking-widest font-extrabold focus:outline-none"
                  >
                    <span>Finder</span>
                    <span className="flex items-center justify-center">
                      {isFinderNavOpen ? (
                        <X className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px] text-accent" />
                      ) : (
                        <Menu className="w-[22px] h-[22px] sm:w-[28px] sm:h-[28px]" />
                      )}
                    </span>
                  </button>

                  {isFinderNavOpen && (
                    <div 
                      className="fixed inset-0 z-30 cursor-default" 
                      onClick={() => setIsFinderNavOpen(false)} 
                    />
                  )}

                  <AnimatePresence>
                    {isFinderNavOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-64 border-2 border-ink bg-[#faf8f5] shadow-[4px_4px_0px_rgba(17,17,19,0.25)] rounded-sm z-40 overflow-hidden flex flex-col"
                      >
                        {[
                          { id: 'few-far' as FinderTab, label: 'Few & Far Between' },
                          { id: 'music' as FinderTab, label: 'Music Catalogue' },
                          { id: 'seek' as FinderTab, label: 'Inquiry Terminal' },
                          { id: 'map' as FinderTab, label: 'Cartography Room' }
                        ].map((tab) => {
                          const isActive = activeFinderTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                logAction('finder_usage');
                                setActiveFinderTab(tab.id);
                                handleRoomChange('finder');
                                setIsFinderNavOpen(false);
                              }}
                              className={`w-full text-left p-3.5 border-b last:border-b-0 border-ink/10 font-syne text-xs uppercase tracking-widest font-extrabold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                                isActive 
                                  ? 'bg-ink text-bg' 
                                  : 'bg-bg text-ink hover:bg-ink/5 hover:text-accent'
                              }`}
                            >
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
      )}

      {/* Main Area: Full Width Content space */}
      <main className={`flex-1 flex flex-col bg-bg ${isFullPageMap ? 'h-full min-h-0 overflow-hidden' : 'overflow-y-auto'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoom}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`flex-1 flex flex-col ${isFullPageMap ? 'h-full min-h-0' : ''}`}
          >
            {renderActiveRoom()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Block */}
      {!isFullPageMap && (
        <footer className={`relative overflow-hidden flex flex-col sm:flex-row justify-between items-center bg-bg gap-6 select-none transition-all duration-300 ${activeRoom === 'home' ? 'min-h-[50px] md:min-h-[60px] py-1' : 'border-t border-ink/10 py-6'}`}>
          {activeRoom === 'home' && (
            <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0 w-full h-[50px] md:h-[60px]">
              <WaveFooter nWaves={10} height={60} />
            </div>
          )}
        </footer>
      )}

      {/* Dynamic Crow component linked to our engagement system (appears on the finder page or cartography room) */}
      {(activeRoom === 'finder' || activeRoom === 'map') && (
        <Crow onTrigger={triggerRandomAccident} position={isFullPageMap ? 'right' : 'left'} />
      )}

      {/* Divine Accident Modal Overlay */}
      <AnimatePresence>
        {currentOverlayAccident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-bg border-2 border-ink rounded-sm p-6 sm:p-8 shadow-[6px_6px_0px_rgba(17,17,19,0.3)] relative text-ink"
            >
              <div className="space-y-6">
                {/* Meta details */}
                <div className="flex justify-end items-center border-b border-ink/10 pb-4">
                  <button 
                    onClick={() => setCurrentOverlayAccident(null)}
                    className="font-mono text-xs uppercase tracking-widest text-ink hover:text-accent font-bold cursor-pointer"
                  >
                    Dismiss ×
                  </button>
                </div>

                {/* Body Content */}
                {renderAccidentContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Portal Memory Invitation */}
      <AnimatePresence>
        {showMemoryInvitation && activeRoom !== 'home' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/15 backdrop-blur-xs pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, x: 300, y: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, y: 300, scale: 0.8 }}
              transition={{ type: "spring", damping: 22, stiffness: 140 }}
              className="w-full max-w-xl md:max-w-2xl"
            >
              <MemoryRoom 
                isModal={true} 
                onClose={() => {
                  setShowMemoryInvitation(false);
                  setHasDismissedInvitation(true);
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Page() {
  return <AppContent />;
}
