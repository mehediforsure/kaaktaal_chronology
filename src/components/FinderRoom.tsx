"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Music, Map, Compass, Menu, X } from 'lucide-react';
import MusicArchiveRoom from './MusicArchiveRoom';
import MapRoom from './MapRoom';
import FewAndFarBetween from './FewAndFarBetween';
import useEngagement from '../hooks/useEngagement';
import { FinderTab } from '../types';

interface FinderPrompt {
  id: string;
  prompt: string;
  response: React.ReactNode;
}

interface FinderRoomProps {
  activeTab: FinderTab;
  onBack?: () => void;
}

export default function FinderRoom({ activeTab, onBack }: FinderRoomProps) {
  const { logAction } = useEngagement();
  const [activePromptId, setActivePromptId] = useState<string | null>(null);

  const prompts: FinderPrompt[] = [
    {
      id: 'tickets',
      prompt: "I'd like tickets.",
      response: (
        <div className="space-y-4 font-sans text-[1.05rem] text-ink/85 leading-relaxed max-w-xl text-left sm:text-center">
          <p>
            This platform is not intended for ticket sales or commercial activities. Any ticket links shared here redirect to third-party platforms that handle ticket sales for our shows.
          </p>
          <div className="pt-2 flex flex-col items-start sm:items-center">
            <a 
              href="https://ashor.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-extrabold text-bg bg-ink hover:bg-accent border-2 border-ink hover:border-accent py-2.5 px-5 rounded-xs transition-colors cursor-pointer shadow-[3px_3px_0px_rgba(17,17,19,0.15)] select-none"
            >
              Enter Ticket Gateway ✦
            </a>
            <span className="font-mono text-[9px] text-ink/40 mt-2.5 block">
              REDIRECT GATEWAY: ashor.vercel.app
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'merch',
      prompt: "I'm looking for merch.",
      response: (
        <div className="space-y-4 font-sans text-[1.05rem] text-ink/85 leading-relaxed max-w-xl text-left sm:text-center">
          <p>
            This platform is not intended for merchandise sales or commercial activities. Any merchandise links shared here redirect to third-party platforms that handle merchandise sales for our band.
          </p>
          <div className="pt-2 flex flex-col items-start sm:items-center">
            <a 
              href="https://teashirthut.com/kaaktaal-exclusive-heavy-metal-t-shirt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-extrabold text-bg bg-ink hover:bg-accent border-2 border-ink hover:border-accent py-2.5 px-5 rounded-xs transition-colors cursor-pointer shadow-[3px_3px_0px_rgba(17,17,19,0.15)] select-none"
            >
              View Exclusive T-Shirt ✦
            </a>
            <span className="font-mono text-[9px] text-ink/40 mt-2.5 block">
              REDIRECT GATEWAY: teashirthut.com
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      prompt: "I'd like to contact Kaaktaal.",
      response: (
        <div className="space-y-4 font-sans text-[1.05rem] text-ink/85 leading-relaxed max-w-xl text-left sm:text-center">
          <p>
            If you'd like to get in touch with Kaaktaal, send us an email and let us know what it's about.
          </p>
          <p>
            <a 
              href="mailto:kaaktaal.official@gmail.com" 
              className="font-mono text-sm underline text-accent font-bold hover:text-accent/80 transition-colors"
            >
              kaaktaal.official@gmail.com
            </a>
          </p>
        </div>
      )
    },
    {
      id: 'learn',
      prompt: "I want to learn a song.",
      response: (
        <div className="space-y-4 font-sans text-[1.05rem] text-ink/85 leading-relaxed max-w-xl text-left sm:text-center">
          <p>
            Every Kaaktaal song is written to be sung, borrowed, and played again.
          </p>
          <p>
            We have prepared an archive containing lyrics, chords, tunings, and handwritten notes for more than 150+ songs.
          </p>
          <div className="pt-2 flex flex-col items-start sm:items-center">
            <button
              disabled
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-extrabold text-ink/40 bg-ink/5 border-2 border-ink/20 py-2.5 px-5 rounded-xs select-none cursor-not-allowed"
            >
              Song Book (Coming Soon) ✦
            </button>
          </div>
        </div>
      )
    }
  ];

  const isMap = activeTab === 'map';

  return (
    <div className={isMap ? "w-full h-full flex flex-col flex-1" : "max-w-6xl mx-auto px-6 py-0 md:py-1 space-y-4 w-full min-w-full"}>

      {/* Main Tab Content Canvas */}
      <div className={isMap ? "w-full h-full flex flex-col flex-1 pt-0" : "transition-all duration-300 pt-2 w-full min-w-full"}>
        <AnimatePresence mode="wait">
          {activeTab === 'seek' && (
            <motion.div
              key="seek-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto space-y-8 py-6"
            >
              <div className="flex flex-col items-start text-left sm:items-center sm:text-center pb-8 select-none border-b-2 border-ink/10 w-full">
                <h2 className="font-syne text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-ink leading-tight mb-3">
                  What are you seeking?
                </h2>
                <div className="w-16 h-1 bg-ink mb-3" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
                  Inquiry Terminal
                </p>
              </div>

              <div className="space-y-4 w-full">
                {prompts.map((item) => {
                  const isOpen = activePromptId === item.id;
                  return (
                    <div key={item.id} className="border-b border-ink/10 pb-4 last:border-0 flex flex-col items-start sm:items-center w-full">
                      {/* Prompt Link */}
                      <button
                        onClick={() => {
                          logAction('finder_usage');
                          setActivePromptId(isOpen ? null : item.id);
                        }}
                        className="group flex flex-col items-start sm:items-center justify-start sm:justify-center w-full text-left sm:text-center focus:outline-none cursor-pointer py-2"
                      >
                        <span className="font-syne text-lg md:text-xl font-extrabold text-ink uppercase tracking-wider group-hover:text-accent transition-colors duration-200">
                          {item.prompt}
                        </span>
                      </button>

                      {/* Expandable Content Area */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden w-full"
                          >
                            <div className="flex flex-col items-start sm:items-center justify-start sm:justify-center text-left sm:text-center py-5 px-6 border-2 border-ink bg-[#faf8f5] shadow-[3px_3px_0px_rgba(17,17,19,0.15)] rounded-sm w-full">
                              {item.response}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'music' && (
            <motion.div
              key="music-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MusicArchiveRoom />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex-1 h-full min-h-0"
            >
              <div className="w-full h-full min-h-0 overflow-hidden bg-[#0E0E0E]">
                <MapRoom onBack={onBack} />
              </div>
            </motion.div>
          )}

          {activeTab === 'few-far' && (
            <motion.div
              key="few-far-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FewAndFarBetween />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
