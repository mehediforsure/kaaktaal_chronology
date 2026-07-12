"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getOptimizedImageUrl } from '../utils/image';

interface AccidentItem {
  id: string;
  title: string;
  category: string;
  medium: string;
  date: string;
  atmosphere: string;
  story: string;
  actionText: string;
  audioNote?: string;
  visualNote?: string;
}

const DIVINE_ACCIDENTS: AccidentItem[] = [
  {
    id: 'crow-reel-3',
    title: 'The Crow on Reel 3',
    category: 'Avian Interference',
    medium: '1/4-inch Magnet Tape',
    date: 'July 18, 2021',
    atmosphere: 'Post-Storm Wet Wood',
    story: 'During the afternoon recording of "Uronchandi" on our open porch, a solitary grey crow landed on the wooden frame of the window. Exactly on the transient of the acoustic drop-D chord, the crow let out a perfect, resonant double-call. The frequency matched the G string beautifully. We chose not to edit it out; it remains the emotional peak of the track.',
    actionText: 'Listen to the Tape Hiss & Caw',
    audioNote: 'A low-bias reel recording with 12dB of tape saturation and a distinct bird frequency at 1.4 kHz.'
  },
  {
    id: 'monsoon-blackout',
    title: 'Monsoon Power Outage Decay',
    category: 'Voltage Drift',
    medium: 'Acoustic Guitar / Tape Motor',
    date: 'August 14, 2023',
    atmosphere: '94% Humidity // Pitch Drop',
    story: 'The grid failed during a live room recording of "Na Shoite Pari". As the studio transformer went silent, the tape recorder motor slowly ground to a halt over four seconds, causing the playing guitar chord to pitch-bend downwards into an eerie, resonant hum. That specific decay became the signature transitional drone of our albums.',
    actionText: 'Settle into the Voltage Decay',
    audioNote: 'Smooth logarithmic pitch drop of 14 semitones over a period of 4.2 seconds.'
  },
  {
    id: 'iron-railing-ground',
    title: 'The 1974 Balcony Railing Ground',
    category: 'Electrical Hum',
    medium: 'Iron Railing / Copper Wire',
    date: 'May 09, 2024',
    atmosphere: 'Monsoon Electric Charge',
    story: 'The old iron railing on the studio porch was installed in 1974. During a heavy electrical storm, the unshielded microphone cable brushed against its rusted joints. The resulting 50Hz hum wasn\'t a harsh buzz, but a deep, warm, organ-like drone that seemed to thrum with fifty years of Dhaka rain. We built the bass loop of "Smritir Minar" on this hum.',
    actionText: 'Resonate with the Balcony Hum',
    audioNote: 'An organic 50Hz drone saturated with historical rust and damp atmosphere.'
  },
  {
    id: 'wet-ink-bleeding',
    title: 'Sleeve Bleed #14',
    category: 'Material Transmutation',
    medium: 'Blue Pen Ink on Kraft Paper',
    date: 'October 12, 2022',
    atmosphere: 'Dense Fog // Heavy Condensation',
    story: 'We left twenty hand-written cassette covers by the window overnight. The dense Dhaka fog leaked through the wooden slats, causing the wet indigo ink to bleed and run down the heavy cardboard. When we woke, the ink had settled into a shape resembling a dry banyan leaf. We now hand-wet every single sleeve we print.',
    actionText: 'View Bleeding Patterns',
    visualNote: 'Organic indigo ink stain patterns spreading on unbleached 300gsm cardboard paper.'
  },
  {
    id: 'copper-drip',
    title: 'Leaky Roof Copper Percussion',
    category: 'Accidental Metronome',
    medium: 'Water Drops on Copper Plate',
    date: 'June 29, 2024',
    atmosphere: 'Overcast // Continuous Rain',
    story: 'A persistent leak in our hallway roof dripped onto an old scrap copper printing plate. The interval was remarkably consistent: exactly 78 drops per minute. While recording a sparse harmonium outline, we turned off our digital click track and let the copper drips guide our timing. The song floats with the natural swell and decay of the rain.',
    actionText: 'Sync with the Rain\'s Heartbeat',
    audioNote: 'A metallic, high-transient click with a long, soft-water decay at 78 BPM.'
  },
  {
    id: 'harmonium-reed',
    title: 'The Stuck Reed on Low Bb',
    category: 'Instrumental Fault',
    medium: '1920s Foldable Harmonium',
    date: 'November 08, 2021',
    atmosphere: 'Dust & Wooden Resonator',
    story: 'The brass reed of our old harmonium was jammed by a tiny grain of sand from the Buriganga riverbed. As a result, the low Bb hummed constantly whenever the bellows were pumped. Rather than fixing it, we embraced the drone. It forced us to write the entire session in Bb major, providing a solemn, unchanging root note to our questions.',
    actionText: 'Embrace the Stuck Reed Drone',
    audioNote: 'A constant, dusty, multi-harmonic Bb drone sounding like an ancient steam engine.'
  }
];

export default function AccidentRoom() {
  const [currentAccident, setCurrentAccident] = useState<AccidentItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const triggerAccident = () => {
    setIsSpinning(true);
    setClickCount((prev) => prev + 1);
    
    // Simulate tape spin and selection
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * DIVINE_ACCIDENTS.length);
      // Avoid repeating the same one immediately if possible
      if (currentAccident && DIVINE_ACCIDENTS[nextIndex].id === currentAccident.id) {
        nextIndex = (nextIndex + 1) % DIVINE_ACCIDENTS.length;
      }
      setCurrentAccident(DIVINE_ACCIDENTS[nextIndex]);
      setIsSpinning(false);
    }, 900);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center select-none">
      
      {/* Editorial Title Block */}
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
        <h2 className="font-syne text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tighter text-ink leading-none">
          Settle into the Unpredicted
        </h2>
        <p className="font-sans text-sm text-ink/70 leading-relaxed pt-2">
          In Kaaktaal's sessions, we don't believe in perfect takes. When a tape jams, a crow calls, or a storms hums in the wire, we listen. We call these divine accidents. Press the crow button to pull a random occurrence from the Dhaka vaults.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        
        {/* Left Side: The Interactive Crow Button Wheel (5 columns) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 bg-bg border-2 border-ink rounded-sm p-8 shadow-[4px_4px_0px_rgba(17,17,19,0.15)] relative overflow-hidden min-h-[350px]">
          {/* Decorative archival grid lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5 pointer-events-none">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-ink" />
            ))}
          </div>

          <div className="relative">
            {/* Spinning/bouncing crow container */}
            <motion.button
              onClick={triggerAccident}
              disabled={isSpinning}
              className="relative z-10 w-40 h-40 rounded-full border-4 border-ink bg-bg overflow-hidden flex items-center justify-center shadow-[6px_6px_0px_rgba(17,17,19,0.2)] hover:shadow-[8px_8px_0px_rgba(17,17,19,0.35)] transition-shadow duration-300 active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
              animate={isSpinning ? { rotate: 360 } : { y: [0, -6, 0] }}
              transition={isSpinning ? { duration: 0.8, ease: "easeInOut" } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={getOptimizedImageUrl("https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Kaak.png", 250)}
                alt="Kaaktaal Crow Symbol"
                className="w-32 h-32 object-contain"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </motion.button>

            {/* Glowing active ring */}
            <div className="absolute inset-0 -m-3 border-2 border-dashed border-accent/40 rounded-full animate-spin-slow pointer-events-none" />
          </div>

          <div className="text-center space-y-2 z-10">
            <h4 className="font-syne text-lg font-bold uppercase tracking-tight text-ink">
              {isSpinning ? 'SPINNING TAPE REELS...' : 'TAP THE CROW'}
            </h4>
            <p className="font-mono text-[10px] uppercase text-ink/50 tracking-wider">
              {clickCount > 0 ? `Triggered ${clickCount} Coincidences` : 'Align current state with the archive'}
            </p>
          </div>

          <button
            onClick={triggerAccident}
            disabled={isSpinning}
            className="w-full py-3 px-6 border-2 border-ink bg-ink text-bg hover:bg-accent hover:text-bg font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-xs cursor-pointer shadow-sm disabled:opacity-40"
          >
            {isSpinning ? 'Consulting Vaults...' : 'Trigger Coincidence'}
          </button>
        </div>

        {/* Right Side: The Unveiled Accident Details (7 columns) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {currentAccident ? (
              <motion.div
                key={currentAccident.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="border-2 border-ink rounded-sm p-6 sm:p-8 bg-bg text-ink shadow-[4px_4px_0px_rgba(17,17,19,0.15)] space-y-6"
              >
                {/* Meta details */}
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-ink/15 pb-4 text-xs font-mono text-ink/60">
                  <span className="uppercase tracking-wider">{currentAccident.category}</span>
                  <span className="opacity-50">{currentAccident.date}</span>
                </div>

                {/* Main Accident Title */}
                <div className="space-y-1">
                  <h3 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase tracking-tighter text-ink leading-tight">
                    {currentAccident.title}
                  </h3>
                  <div className="flex gap-4 font-mono text-[9px] uppercase text-ink/60">
                    <span>Medium: {currentAccident.medium}</span>
                    <span>•</span>
                    <span>Atmosphere: {currentAccident.atmosphere}</span>
                  </div>
                </div>

                {/* Atmospheric Narrative */}
                <p className="font-sans text-sm sm:text-base text-ink/80 leading-relaxed italic border-l-2 border-accent pl-4 py-1">
                  "{currentAccident.story}"
                </p>

                {/* Additional Spec notes or interactive details */}
                <div className="p-4 bg-ink/[0.03] border border-ink/10 rounded-sm font-mono text-[11px] text-ink/70 leading-relaxed">
                  <p>{currentAccident.audioNote || currentAccident.visualNote}</p>
                </div>

                {/* Action Feedback Area */}
                <div className="pt-2 border-t border-ink/10 flex justify-end items-center gap-4 text-xs font-mono">
                  <button 
                    onClick={() => {
                      alert(`Aligning feedback frequency... ${currentAccident.title} is now part of your current session vibe.`);
                    }}
                    className="px-4 py-2 border border-ink bg-bg hover:bg-ink hover:text-bg transition-colors duration-200 uppercase text-[10px] font-bold tracking-wider rounded-xs cursor-pointer"
                  >
                    {currentAccident.actionText}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-dashed border-ink/30 rounded-sm p-12 text-center flex flex-col items-center justify-center min-h-[350px] space-y-4"
              >
                <div className="w-12 h-12 rounded-full border border-ink/20 flex items-center justify-center text-ink/40 font-mono text-lg">
                  ?
                </div>
                <div className="space-y-1">
                  <h3 className="font-syne text-lg font-extrabold uppercase text-ink/70 tracking-tight">
                    Archive Awaiting Signal
                  </h3>
                  <p className="font-sans text-xs text-ink/50 max-w-sm leading-relaxed mx-auto">
                    The reels are clean. Tap the circular crow symbol on the left to induce an honest mistake, a wet pen stain, or a bird call from the studio notes.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Grid of the remaining accidents at a glance */}
      <div className="mt-16 pt-12 border-t-2 border-ink/10 space-y-6">
        <h4 className="font-syne text-xl font-extrabold uppercase tracking-tight text-ink">
          Potential Frequencies
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {DIVINE_ACCIDENTS.map((item) => {
            const isSelected = currentAccident?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentAccident(item)}
                className={`p-4 border border-ink rounded-xs cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  isSelected ? 'bg-ink text-bg -translate-y-0.5 shadow-sm' : 'bg-bg text-ink hover:bg-ink/[0.02]'
                }`}
              >
                <div className="space-y-1">
                  <span className={`font-mono text-[8px] uppercase tracking-widest font-extrabold ${isSelected ? 'text-accent' : 'text-accent'}`}>
                    {item.category}
                  </span>
                  <h5 className="font-syne text-sm font-bold uppercase tracking-tight line-clamp-1">
                    {item.title}
                  </h5>
                </div>
                <p className={`font-sans text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-bg/75' : 'text-ink/60'}`}>
                  {item.story}
                </p>
                <div className="pt-2 border-t border-ink/10 flex justify-between items-center text-[8px] font-mono opacity-50">
                  <span>{item.date}</span>
                  <span>Select Log</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
