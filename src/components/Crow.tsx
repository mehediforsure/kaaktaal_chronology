import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getOptimizedImageUrl } from '../utils/image';

interface CrowProps {
  onTrigger: () => void;
  title?: string;
  position?: 'left' | 'right';
}

type CrowState = 'initial' | 'visible' | 'hidden-short' | 'hidden-long';

export default function Crow({ onTrigger, title = "A Divine Accident appears...", position = 'left' }: CrowProps) {
  const [crowState, setCrowState] = useState<CrowState>('initial');
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Track hasInteracted in a ref so the effect has immediate access without resetting timeouts
  const hasInteractedRef = useRef(false);
  hasInteractedRef.current = hasInteracted;

  useEffect(() => {
    let stateTimer: NodeJS.Timeout;
    let fallbackTimer: NodeJS.Timeout;

    if (crowState === 'initial') {
      // 1. Initial appearance after 10 seconds on the Finder page
      stateTimer = setTimeout(() => {
        setHasInteracted(false);
        setCrowState('visible');
      }, 10000);
    } else if (crowState === 'visible') {
      // 2. Active state: stays for 10 seconds normally before hiding for 5 seconds
      stateTimer = setTimeout(() => {
        setCrowState('hidden-short');
      }, 10000);

      // 3. Smart early dismissal: If the user doesn't interact within 3 seconds, it disappears for 10 seconds
      fallbackTimer = setTimeout(() => {
        if (!hasInteractedRef.current) {
          setCrowState('hidden-long');
        }
      }, 3000);
    } else if (crowState === 'hidden-short') {
      // 4. Standard hidden cycle of 5 seconds
      stateTimer = setTimeout(() => {
        setHasInteracted(false);
        setCrowState('visible');
      }, 5000);
    } else if (crowState === 'hidden-long') {
      // 5. Un-interacted penalty hidden cycle of 10 seconds
      stateTimer = setTimeout(() => {
        setHasInteracted(false);
        setCrowState('visible');
      }, 10000);
    }

    return () => {
      clearTimeout(stateTimer);
      clearTimeout(fallbackTimer);
    };
  }, [crowState]);

  const handleInteraction = () => {
    setHasInteracted(true);
  };

  return (
    <AnimatePresence>
      {crowState === 'visible' && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 15, stiffness: 120 }}
          className={`fixed bottom-6 ${position === 'right' ? 'right-6' : 'left-6'} z-40 flex flex-col items-center gap-3 pointer-events-auto`}
        >
          <button
            onClick={() => {
              handleInteraction();
              onTrigger();
            }}
            onMouseEnter={handleInteraction}
            className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-ink bg-bg p-1 flex items-center justify-center shadow-[4px_4px_0px_rgba(17,17,19,0.2)] hover:shadow-[6px_6px_0px_rgba(17,17,19,0.3)] transition-all duration-300 hover:scale-105 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer overflow-hidden"
            title={title}
          >
            {/* Spinning/pulse effect behind */}
            <div className="absolute inset-0 border border-dashed border-accent/25 rounded-full animate-spin-slow pointer-events-none" />
            
            <img 
              src={getOptimizedImageUrl("https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Kaak.png", 100)}
              alt="Divine Accident Messenger"
              className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-300"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

