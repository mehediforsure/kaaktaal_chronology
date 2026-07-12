"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryRoomProps {
  isModal?: boolean;
  onClose?: () => void;
  isDarkTheme?: boolean;
}

export default function MemoryRoom({ isModal = false, onClose, isDarkTheme = false }: MemoryRoomProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const bgClass = isDarkTheme ? "bg-[#0e0202]/75 backdrop-blur-md" : "bg-bg/75 backdrop-blur-md";
  const borderClass = isDarkTheme ? "border-2 border-[#39ff14]/30" : "border-2 border-ink";
  const textClass = isDarkTheme ? "text-white" : "text-ink";
  const textMutedClass = isDarkTheme ? "text-white/60" : "text-ink/60";
  const textMutedDenseClass = isDarkTheme ? "text-white/80" : "text-ink/80";
  const accentBarClass = isDarkTheme ? "bg-[#39ff14]" : "bg-accent";
  const shadowClass = isDarkTheme ? "shadow-[6px_6px_0px_rgba(57,255,20,0.15)]" : "shadow-[6px_6px_0px_rgba(17,17,19,0.15)]";
  
  const containerClasses = isModal 
    ? `${bgClass} ${borderClass} p-6 md:p-8 max-w-xl md:max-w-2xl w-full relative ${shadowClass} rounded-sm opacity-75`
    : `${bgClass} ${borderClass} p-8 md:p-16 max-w-2xl mx-auto rounded shadow-sm relative ${shadowClass}`;

  return (
    <div className={isModal ? "w-full" : "max-w-4xl mx-auto px-6 py-12 md:py-20"}>
      
      {!isModal && (
        <div className={`border-b-2 ${isDarkTheme ? 'border-[#39ff14]/20' : 'border-ink'} pb-6 mb-12 select-none`}>
          <h3 className={`font-syne text-3xl font-extrabold uppercase tracking-tighter ${textClass}`}>
            Leaving your mark on the parchment
          </h3>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className={containerClasses}
      >
        {isModal && onClose && (
          <button 
            onClick={onClose}
            className={`absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest ${isDarkTheme ? 'text-[#39ff14]/60 hover:text-[#39ff14]' : 'text-ink/60 hover:text-accent'} font-bold cursor-pointer`}
          >
            Close ×
          </button>
        )}

        {/* Notebook spine line accent */}
        <div className={`absolute left-0 top-0 h-full w-2 ${accentBarClass} opacity-90`} />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div 
              key="form-stage"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pl-4"
            >
              <div className="border-b border-ink/10 pb-1">
                <h4 className={`font-plakatbau text-3xl md:text-4xl font-extrabold uppercase tracking-wide ${textClass}`}>
                  If youd like us to remember you
                </h4>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Name */}
                  <div className="space-y-1">
                    <label className={`block font-mono text-[10px] uppercase tracking-wider ${textMutedClass} font-bold select-none`}>
                      Your Name 
                    </label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. S. Sen"
                      className={`w-full ${isDarkTheme ? 'bg-[#060000] border-2 border-white/10 focus:border-[#39ff14] text-white placeholder:text-white/20' : 'bg-bg border-2 border-ink focus:border-accent text-ink placeholder:text-ink/30'} font-mono text-xs p-2.5 focus:outline-none transition-colors rounded-xs`}
                    />
                  </div>

                  {/* Field 3: City */}
                  <div className="space-y-1">
                    <label className={`block font-mono text-[10px] uppercase tracking-wider ${textMutedClass} font-bold select-none`}>
                      Your Current City 
                    </label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Dhaka, Dhanmondi"
                      className={`w-full ${isDarkTheme ? 'bg-[#060000] border-2 border-white/10 focus:border-[#39ff14] text-white placeholder:text-white/20' : 'bg-bg border-2 border-ink focus:border-accent text-ink placeholder:text-ink/30'} font-mono text-xs p-2.5 focus:outline-none transition-colors rounded-xs`}
                    />
                  </div>
                </div>

                {/* Field 2: Email or WhatsApp */}
                <div className="space-y-1">
                  <label className={`block font-mono text-[10px] uppercase tracking-wider ${textMutedClass} font-bold select-none`}>
                    Email Address or WhatsApp Number
                  </label>
                  <input 
                    type="text" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="ssen@letters.org or +880..."
                    className={`w-full ${isDarkTheme ? 'bg-[#060000] border-2 border-white/10 focus:border-[#39ff14] text-white placeholder:text-white/20' : 'bg-bg border-2 border-ink focus:border-accent text-ink placeholder:text-ink/30'} font-mono text-xs p-2.5 focus:outline-none transition-colors rounded-xs`}
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <span className={`font-mono text-[9px] ${textMutedClass} select-none text-center sm:text-left`}>
                    your details are safe with us
                  </span>
                  <button
                    type="submit"
                    disabled={isLoading || !name || !contact}
                    className={`w-full sm:w-auto py-2.5 px-5 ${
                      isDarkTheme 
                        ? 'border-2 border-[#39ff14] bg-transparent text-[#39ff14] hover:bg-[#39ff14] hover:text-[#060000] shadow-[3px_3px_0px_rgba(57,255,20,0.15)] disabled:hover:bg-transparent disabled:hover:text-[#39ff14]' 
                        : 'border-2 border-ink bg-bg text-ink hover:bg-ink hover:text-bg shadow-[3px_3px_0px_rgba(17,17,19,0.15)]'
                    } transition-all duration-200 font-mono text-xs uppercase tracking-wider rounded-sm disabled:opacity-40 cursor-pointer font-bold`}
                  >
                    {isLoading ? 'Inking parchment...' : 'Request Remembrance'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success-stage"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6 pl-4"
            >
              <span className="text-4xl select-none">✒️</span>
              <h4 className={`font-syne text-2xl font-extrabold uppercase ${textClass}`}>
                "We have set your name down in ink."
              </h4>
              <p className={`font-sans text-base ${textMutedDenseClass} leading-relaxed max-w-md mx-auto`}>
                Thank you, <span className={`font-bold ${isDarkTheme ? 'text-[#39ff14]' : 'text-accent'} underline underline-offset-4 decoration-current`}>{name}</span>. Your presence has been archived under <span className="font-mono text-sm font-bold">{city || 'GPO Dhaka'}</span>. 
              </p>
              <p className={`font-mono text-[10px] ${textMutedClass} uppercase tracking-wider`}>
                If the stars align, you will hear from us. Rest easy.
              </p>
              {isModal && onClose && (
                <div className="pt-6">
                  <button
                    onClick={onClose}
                    className={`py-3 px-6 ${
                      isDarkTheme 
                        ? 'border-2 border-[#39ff14] bg-transparent text-[#39ff14] hover:bg-[#39ff14] hover:text-[#060000] shadow-[3px_3px_0px_rgba(57,255,20,0.15)]' 
                        : 'border-2 border-ink bg-bg text-ink hover:bg-ink hover:text-bg shadow-[3px_3px_0px_rgba(17,17,19,0.15)]'
                    } font-mono text-xs uppercase tracking-wider transition-all duration-200 rounded-sm cursor-pointer font-bold`}
                  >
                    Return to Exploration
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
