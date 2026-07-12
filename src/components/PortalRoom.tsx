"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTAL_QUESTIONS, PORTAL_RECOMMENDATIONS, ALBUMS } from '../data';
import { RecommendationPackage, ActiveRoom } from '../types';
import { getOptimizedImageUrl } from '../utils/image';
import { 
  ChevronDown, 
  RefreshCw, 
  Compass, 
  Share2, 
  Zap, 
  ArrowRight, 
  X, 
  BookOpen, 
  Music, 
  Camera, 
  Download,
  Volume2,
  VolumeX
} from 'lucide-react';

interface TypewrittenTextProps {
  text: string;
  speed?: number;
  isMuted?: boolean;
}

function TypewrittenText({ text, speed = 18, isMuted = false }: TypewrittenTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        
        if (!isMuted) {
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const ctx = new AudioContextClass();
              const bufferSize = ctx.sampleRate * 0.02; // ultra brief noise strike
              const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
              const data = buffer.getChannelData(0);
              for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
              }
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              const filter = ctx.createBiquadFilter();
              filter.type = 'highpass';
              filter.frequency.setValueAtTime(1100 + Math.random() * 450, ctx.currentTime);
              const gain = ctx.createGain();
              gain.gain.setValueAtTime(0.008 + Math.random() * 0.006, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);
              source.connect(filter);
              filter.connect(gain);
              gain.connect(ctx.destination);
              source.start();
            }
          } catch (e) {}
        }
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, isMuted]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-1.5 h-4 bg-accent/80 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

interface PortalRoomProps {
  onRoomChange?: (room: ActiveRoom) => void;
  triggerRandomAccident?: () => void;
}

export default function PortalRoom({ onRoomChange, triggerRandomAccident }: PortalRoomProps = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<RecommendationPackage | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Sound and Customization States
  const [isMuted, setIsMuted] = useState(false);
  const [shareTheme, setShareTheme] = useState<'classic' | 'polaroid' | 'cassette'>('classic');
  const [isTapePlaying, setIsTapePlaying] = useState(false);

  // Web Audio procedural synthesis for vintage cassette loop
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    oscillator1?: OscillatorNode;
    oscillator2?: OscillatorNode;
    gainNode?: GainNode;
    hissNode?: AudioBufferSourceNode;
    filterNode?: BiquadFilterNode;
  }>({});

  const startAudio = (songTitle: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create main output gain
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, ctx.currentTime);
      mainGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.5);

      // Lowpass filter for warm copper cassette aesthetics
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);

      // Subtly wobble the pitch (Wow & Flutter effect)
      let baseFreq = 110; // A2 frequency
      const titleLower = songTitle.toLowerCase();
      if (titleLower.includes('dekh kemon lage')) baseFreq = 110;
      else if (titleLower.includes('neel shohore')) baseFreq = 98; // G2
      else if (titleLower.includes('joratali')) baseFreq = 130.81; // C3
      else if (titleLower.includes('shesh kotha')) baseFreq = 82.41; // E2

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime); // Perfect fifth drone

      const oscGain1 = ctx.createGain();
      const oscGain2 = ctx.createGain();
      oscGain1.gain.setValueAtTime(0.1, ctx.currentTime);
      oscGain2.gain.setValueAtTime(0.05, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.35, ctx.currentTime); // 0.35Hz wobble
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(2.5, ctx.currentTime); // pitch variation bounds

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      // Procedural warm cassette brown noise hiss
      const bufferSize = ctx.sampleRate * 2.0;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const hissSource = ctx.createBufferSource();
      hissSource.buffer = noiseBuffer;
      hissSource.loop = true;

      const hissGain = ctx.createGain();
      hissGain.gain.setValueAtTime(0.02, ctx.currentTime);

      // Slow amplitude modulation to mimic dusty vintage tape decay
      const ampLfo = ctx.createOscillator();
      ampLfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const ampLfoGain = ctx.createGain();
      ampLfoGain.gain.setValueAtTime(0.005, ctx.currentTime);
      ampLfo.connect(ampLfoGain);
      ampLfoGain.connect(hissGain.gain);

      // Connections
      osc1.connect(oscGain1);
      osc2.connect(oscGain2);
      oscGain1.connect(filter);
      oscGain2.connect(filter);

      hissSource.connect(hissGain);
      hissGain.connect(filter);

      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      // Fire up synthesizers
      osc1.start();
      osc2.start();
      lfo.start();
      hissSource.start();
      ampLfo.start();

      nodesRef.current = {
        oscillator1: osc1,
        oscillator2: osc2,
        gainNode: mainGain,
        hissNode: hissSource,
        filterNode: filter
      };
    } catch (err) {
      console.error("Procedural synth start failure:", err);
    }
  };

  const stopAudio = () => {
    try {
      const { gainNode, oscillator1, oscillator2, hissNode } = nodesRef.current;
      const ctx = audioCtxRef.current;
      if (ctx && gainNode) {
        gainNode.gain.cancelScheduledValues(ctx.currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
        
        setTimeout(() => {
          try {
            oscillator1?.stop();
            oscillator2?.stop();
            hissNode?.stop();
          } catch (e) {}
          nodesRef.current = {};
        }, 400);
      }
    } catch (err) {
      console.error("Procedural synth stop failure:", err);
    }
  };

  const toggleTapePlay = () => {
    if (isTapePlaying) {
      stopAudio();
      setIsTapePlaying(false);
    } else {
      if (recommendation) {
        startAudio(recommendation.song.title);
        setIsTapePlaying(true);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Cinematic story navigation / state
  const [currentCard, setCurrentCard] = useState(0);
  const [activeModal, setActiveModal] = useState<'journal' | 'story' | 'photo' | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isGeneratingShareImage, setIsGeneratingShareImage] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Archive processing counter states
  const [isCardFourActive, setIsCardFourActive] = useState(false);
  const [songsCount, setSongsCount] = useState(0);
  const [storiesCount, setStoriesCount] = useState(0);
  const [memoriesCount, setMemoriesCount] = useState(0);

  // Set body class when share modal is open to adjust parent stacking contexts
  useEffect(() => {
    if (isShareOpen) {
      document.body.classList.add('share-card-open');
    } else {
      document.body.classList.remove('share-card-open');
    }
    return () => {
      document.body.classList.remove('share-card-open');
    };
  }, [isShareOpen]);

  const matchingAlbum = recommendation
    ? ALBUMS.find(
        (a) =>
          a.title.replace(/\s+/g, '').toLowerCase() ===
          recommendation.song.album.replace(/\s+/g, '').toLowerCase()
      )
    : null;
  const songCoverUrl = matchingAlbum?.coverUrl;

  const handleSelect = (questionId: string, value: string) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);

    if (currentStep < PORTAL_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // End of questions, calculate recommendation
      setIsCalculating(true);
      setTimeout(() => {
        const firstAnswerVal = updatedAnswers['q1'] || 'rain';
        const rec = PORTAL_RECOMMENDATIONS[firstAnswerVal] || PORTAL_RECOMMENDATIONS['rain'];
        setRecommendation(rec);
        setIsCalculating(false);
        setCurrentStep(PORTAL_QUESTIONS.length); // Advance past questions
        setCurrentCard(0); // Reset story scrolling back to Card One
      }, 1500);
    }
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      setCurrentStep(0);
      setAnswers({});
      setRecommendation(null);
      setCurrentCard(0);
      setIsResetting(false);
    }, 4000); // Elegant 4-second delay matching original style
  };

  // Trigger counts on Card Four
  useEffect(() => {
    if (recommendation && currentCard === 3) {
      setIsCardFourActive(true);
      setSongsCount(0);
      setStoriesCount(0);
      setMemoriesCount(0);
      
      const duration = 1800; // ms
      const steps = 40;
      const intervalTime = duration / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        setSongsCount(Math.min(127, Math.round((127 / steps) * step)));
        setStoriesCount(Math.min(43, Math.round((43 / steps) * step)));
        setMemoriesCount(Math.min(19, Math.round((19 / steps) * step)));
        
        if (step >= steps) {
          clearInterval(timer);
        }
      }, intervalTime);
      
      return () => clearInterval(timer);
    }
  }, [currentCard, recommendation]);

  // Handle scroll snap index calculation
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== currentCard && index >= 0 && index < 9) {
      setCurrentCard(index);
    }
  };

  const scrollToCard = (index: number) => {
    const cardEl = document.getElementById(`portal-card-${index}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper functions for options text mapping
  const getFirstAnswerText = (val: string) => {
    const optionsMap: Record<string, string> = {
      rain: "Rain on a tin roof",
      crowd: "A silent crowded street",
      fan: "Ceiling fan hum at 3 AM",
      leaves: "Leaves scratching on glass",
    };
    return optionsMap[val] || val;
  };

  const getSecondAnswerText = (val: string) => {
    const optionsMap: Record<string, string> = {
      letter: "An unsent letter",
      city: "A fading city weight",
      daydream: "A quiet, recurring daydream",
      tiredness: "The tiredness of being seen",
    };
    return optionsMap[val] || val;
  };

  const getThirdAnswerText = (val: string) => {
    const optionsMap: Record<string, string> = {
      window: "By the rain-streaked window",
      corner: "In the quiet dark corner",
      steps: "On cold entrance marble steps",
      attic: "In the box-filled dusty attic",
    };
    return optionsMap[val] || val;
  };

  const getRecommendationLine = (songTitle: string) => {
    const normTitle = songTitle.toLowerCase();
    if (normTitle.includes('dekh kemon lage')) {
      return "For the ones who seek shelter under a tin roof but keep the windows open.";
    } else if (normTitle.includes('neel shohore')) {
      return "For people who laugh normally but lock the door twice.";
    } else if (normTitle.includes('joratali')) {
      return "For those who count the orbits of the ceiling fan while the rest of the world is asleep.";
    } else if (normTitle.includes('shesh kotha')) {
      return "For the wanderers who find beauty in decay and know when it is time to let go.";
    }
    return "For people who laugh normally but lock the door twice.";
  };

  // Export share card functionality
  const handleDownloadShareCard = async () => {
    if (!shareCardRef.current) return;
    setIsGeneratingShareImage(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Ultra HD Retina
        width: 1080,
        height: 1920,
        cacheBust: true,
        style: {
          left: '0',
          top: '0',
          margin: '0',
          position: 'relative',
        }
      });
      const link = document.createElement('a');
      link.download = `kaaktaal-chronology-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate share card image', error);
    } finally {
      setIsGeneratingShareImage(false);
    }
  };

  const currentQuestion = PORTAL_QUESTIONS[currentStep];
  const isQuestionFlow = !recommendation;
  const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  // Genre cards tags data
  const emotionalTags = [
    { text: "soft-darkness", bg: "bg-[#E3E2DD] border-[#CBCAC5] text-[#40403C]", rot: "rotate-3 hover:rotate-0" },
    { text: "fear", bg: "bg-[#E0DFD8] border-[#C8C7C0] text-[#3F3E38]", rot: "-rotate-2 hover:rotate-0" },
    { text: "bus-window", bg: "bg-[#E6E5DC] border-[#CECDC4] text-[#43423B]", rot: "rotate-6 hover:rotate-0" },
    { text: "late-night-listening", bg: "bg-[#DFDFD3] border-[#C7C7BC] text-[#3F3F37]", rot: "-rotate-4 hover:rotate-0" },
    { text: "city", bg: "bg-[#DAD8CF] border-[#C2C0B7] text-[#3E3D35]", rot: "rotate-1 hover:rotate-0" }
  ];

  return (
    <div className={`w-full bg-[#D5DCD9] border border-black/10 relative text-ink px-4 sm:px-8 md:px-12 py-8 shadow-2xl flex flex-col justify-center select-none transition-all duration-300 rounded-lg min-h-[580px] h-[580px] sm:h-[620px] md:h-[640px] max-h-[90vh] ${
      isShareOpen || activeModal ? 'overflow-visible' : 'overflow-hidden'
    }`}>
      
      {/* Absolute background patterns (Only shown during questions or loading) */}
      {isQuestionFlow && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
          <div className="absolute inset-y-0 left-[14%] w-[1px] bg-black/10" />
          <div className="absolute inset-y-0 left-[30%] w-[1px] bg-black/10" />
          <div className="absolute inset-y-0 left-[42%] w-[1px] bg-black/10" />
          <div className="absolute inset-y-0 left-[60%] w-[1px] bg-black/10" />
          <div className="absolute inset-y-0 left-[75%] w-[1px] bg-black/10" />
        </div>
      )}

      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          
          {/* QUESTIONS FLOW STAGE */}
          {currentStep < PORTAL_QUESTIONS.length && !isCalculating && !isResetting && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center"
            >
              <div className="lg:col-span-7 text-left flex flex-col justify-center">
                <h3 className="font-plakatbau font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-wide text-black leading-[0.95] max-w-xl">
                  {currentQuestion.text}
                </h3>

                <div className="mt-8 pt-4 pb-5 px-3 bg-black/[0.015] rounded-md max-w-md relative">
                  <p className="font-space text-xs text-black/80 leading-relaxed">
                    By answering three brief inquiries about your current sensory surroundings and state of mind, the archive aligns itself to your present frequency.
                  </p>
                  <div className="absolute bottom-0 left-6 right-0 h-[1.5px] bg-black/20 rounded-full" />
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center border-l-0 lg:border-l border-black/10 pl-0 lg:pl-8 py-2">
                <div className="flex flex-col gap-2 w-full">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(currentQuestion.id, option.value)}
                      className="group w-full flex justify-between items-center py-3 px-3 border border-transparent hover:border-accent/20 hover:bg-black/[0.04] rounded-sm transition-all duration-200 text-left font-sans text-sm uppercase font-bold tracking-wider cursor-pointer text-black hover:text-accent"
                    >
                      <span className="truncate pr-4">{option.text}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* LOADING CALCULATION STAGE */}
          {isCalculating && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 flex flex-col items-center justify-center space-y-6"
            >
              <div className="w-12 h-12 border-2 border-t-accent border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin mb-2" />
              <p className="font-mono text-sm font-bold text-accent animate-pulse uppercase tracking-widest">
                ALIGNING RECEPTORS WITH DEEP ARCHIVES...
              </p>
              <span className="font-mono text-[10px] uppercase tracking-widest text-black/50 block mt-2 max-w-md">
                GATHERING MATCHING TAPES, CHARCOAL SKETCHES, POETIC JOURNALS, AND NARRATIVES
              </span>
            </motion.div>
          )}

          {/* RESETTING STAGE */}
          {isResetting && (
            <motion.div
              key="resetting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <motion.div
                  className="relative z-10 w-40 h-40 rounded-full border-4 border-black bg-[#D5DCD9] overflow-hidden flex items-center justify-center shadow-[6px_6px_0px_rgba(17,17,19,0.25)] pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                >
                  <img 
                    src={getOptimizedImageUrl("https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Kaak.png", 250)}
                    alt="Kaaktaal Crow Symbol"
                    className="w-32 h-32 object-contain"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </motion.div>
                <div className="absolute inset-0 -m-3 border-2 border-dashed border-accent/40 rounded-full animate-spin-slow pointer-events-none" />
              </div>

              <div className="space-y-2 select-none">
                <p className="font-mono text-sm font-bold text-accent animate-pulse uppercase tracking-widest">
                  DISSOLVING SENSORY DECISIONS...
                </p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-black/50 block mt-2 max-w-md">
                  You cannot do this more than twice. That's the daily limit. 
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CINEMATIC SPOTIFY WRAPPED / STORY REVEAL STAGE */}
      {recommendation && currentStep === PORTAL_QUESTIONS.length && !isCalculating && !isResetting && (
        <div 
          id="portal-wrap-container"
          onScroll={handleScroll}
          className="absolute inset-0 z-20 bg-[#D5DCD9] text-ink overflow-y-scroll snap-y snap-mandatory scroll-smooth flex flex-col h-full w-full select-none"
        >
          {/* Vertical Division Lines for aesthetic consistency */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-15">
            <div className="absolute inset-y-0 left-[14%] w-[1px] bg-black/10" />
            <div className="absolute inset-y-0 left-[30%] w-[1px] bg-black/10" />
            <div className="absolute inset-y-0 left-[42%] w-[1px] bg-black/10" />
            <div className="absolute inset-y-0 left-[60%] w-[1px] bg-black/10" />
            <div className="absolute inset-y-0 left-[75%] w-[1px] bg-black/10" />
          </div>

          {/* Top Story Progress Segments */}
          {currentCard > 0 && (
            <div className="absolute top-4 left-4 right-4 z-40 flex gap-2.5 px-2 md:px-8 pointer-events-none">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex-1 h-[3px] bg-black/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: i < currentCard ? "100%" : i === currentCard ? "100%" : "0%" }}
                    transition={{ duration: i === currentCard ? 0.3 : 0.15 }}
                  />
                </div>
              ))}
            </div>
          )}


          {/* CARD 1: CHRONOLOGY - Sensory Input Response */}
          <div 
            id="portal-card-0" 
            data-card-name="Card 1: Chronology" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.015)_0%,transparent_60%)] pointer-events-none" />
            <div className="max-w-2xl space-y-4 sm:space-y-6 relative z-10 px-4">
              <h2 className="font-plakatbau text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink uppercase tracking-wide leading-tight font-bold">
                You came here looking
              </h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 80, delay: 0.4 }}
                className="inline-block border border-black/10 bg-[#F8F7F4]/60 px-6 sm:px-8 py-3.5 rounded-xs shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <span className="font-sans text-base sm:text-lg md:text-xl italic font-bold text-ink">
                  "{getFirstAnswerText(answers.q1)}"
                </span>
              </motion.div>
            </div>
          </div>

          {/* CARD 2: ENVIRONMENT - State of Mind Context */}
          <div 
            id="portal-card-1" 
            data-card-name="Card 2: Environment" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6 text-center"
          >

            {/* ATMOSPHERIC BACKGROUNDS DEPENDING ON CHOSEN SENSORY DECISION */}
            {answers.q2 === 'letter' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-transparent" />
                {Array.from({ length: 15 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute font-mono text-[9px] text-accent/15 select-none"
                    style={{
                      left: `${5 + Math.random() * 90}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{ 
                      y: [-20, -100 - Math.random() * 200],
                      opacity: [0, 0.4, 0]
                    }}
                    transition={{ 
                      duration: 6 + Math.random() * 8, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: Math.random() * 4
                    }}
                  >
                    {["a", "s", "d", "f", "h", "j", "k", "l", "m", "n", "p", "q", "r", "t", "w", "x", "y", "z"][idx % 18]}
                  </motion.div>
                ))}
              </div>
            )}

            {answers.q2 === 'city' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden bg-transparent">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute rounded-full filter blur-[60px] opacity-[0.08]"
                    style={{
                      background: idx % 2 === 0 ? "rgba(211,26,26,0.6)" : "rgba(184,69,42,0.6)",
                      width: 140 + Math.random() * 160,
                      height: 140 + Math.random() * 160,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    initial={{ left: "-40%" }}
                    animate={{ left: "130%" }}
                    transition={{
                      duration: 14 + Math.random() * 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 6,
                    }}
                  />
                ))}
              </div>
            )}

            {answers.q2 === 'daydream' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden bg-transparent">
                {Array.from({ length: 25 }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute w-1.5 h-1.5 rounded-full bg-black/20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.15, 0.7, 0.15],
                      scale: [0.7, 1.3, 0.7],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>
            )}

            {answers.q2 === 'tiredness' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden bg-transparent">
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full filter blur-[80px]"
                  style={{ background: "rgba(184,69,42,0.06)" }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [0.94, 1.06, 0.94],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}

            <div className="max-w-2xl space-y-4 sm:space-y-6 relative z-10 px-4">
              <h2 className="font-plakatbau text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink uppercase tracking-wide leading-tight font-bold">
                You are listening from...
              </h2>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="inline-block border border-black/10 bg-[#F8F7F4]/60 px-6 sm:px-8 py-3.5 rounded-xs"
              >
                <span className="font-sans text-base sm:text-lg md:text-xl italic font-bold text-ink/90">
                  "{getSecondAnswerText(answers.q2)}"
                </span>
              </motion.div>
            </div>
          </div>

          {/* CARD 3: CAPACITY - Sensory Capacity Limits */}
          <div 
            id="portal-card-2" 
            data-card-name="Card 3: Capacity" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6 text-center"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,26,26,0.03)_0%,transparent_60%)] pointer-events-none" />
            <div className="max-w-2xl space-y-4 sm:space-y-6 relative z-10 px-4">
              <h2 className="font-plakatbau text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink uppercase tracking-wide leading-tight font-bold">
                And today, you could handle...
              </h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 85, delay: 0.3 }}
                className="inline-block border border-rust/20 bg-[#F8F7F4]/60 px-6 sm:px-8 py-3.5 rounded-xs shadow-[0_4px_20px_rgba(184,69,42,0.04)]"
              >
                <span className="font-sans text-base sm:text-lg md:text-xl italic font-bold text-rust">
                  "{getThirdAnswerText(answers.q3)}"
                </span>
              </motion.div>
            </div>
          </div>

          {/* CARD 4: SCANNER - Simplified Loader */}
          <div 
            id="portal-card-3" 
            data-card-name="Card 4: Scanner" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6"
          >

            {/* Soft grid lines to replicate blueprint style */}
            <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="w-full max-w-md bg-[#F8F7F4] border border-black/10 p-8 sm:p-10 rounded-md shadow-md text-center space-y-6 relative text-ink">
              {/* Three large dots loading animation */}
              <div className="flex justify-center items-center gap-3 py-2">
                <motion.span 
                  className="w-3.5 h-3.5 rounded-full bg-accent"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span 
                  className="w-3.5 h-3.5 rounded-full bg-accent"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span 
                  className="w-3.5 h-3.5 rounded-full bg-accent"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Message text */}
              <p className="font-sans text-sm sm:text-base text-ink/80 leading-relaxed max-w-sm mx-auto">
                I looked in every corner of the archive. Found a few things that can maybe comfort you? Check it out and maybe save in your gallery
              </p>
            </div>
          </div>

          {/* CARD 5: CASSETTE - Retro Recommendation Reveal */}
          <div 
            id="portal-card-4" 
            data-card-name="Card 5: Cassette" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6 text-center"
          >

            {/* Soft, beautiful cover blur background in watercolor style */}
            {songCoverUrl && (
              <div 
                className="absolute inset-0 filter blur-[100px] opacity-[0.06] pointer-events-none scale-125"
                style={{ 
                  backgroundImage: `url(${getOptimizedImageUrl(songCoverUrl, 300)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
            )}
            
            <div className="max-w-3xl w-full flex flex-col items-center gap-4 relative z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 18 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10"
              >
                
                {/* Visual Cover art next to Cassette */}
                {songCoverUrl && (
                  <motion.div 
                    initial={{ rotate: -5, y: 10 }}
                    whileInView={{ rotate: -3, y: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="w-32 h-32 md:w-36 md:h-36 border border-black/10 rounded-xs overflow-hidden shadow-lg relative group flex-shrink-0"
                  >
                    <img 
                      src={getOptimizedImageUrl(songCoverUrl, 300)} 
                      alt={recommendation.song.album} 
                      className="w-full h-full object-cover filter brightness-95 contrast-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </motion.div>
                )}

                {/* HIGH-FIDELITY RETRO CASSETTE TAPE */}
                <div 
                  onClick={toggleTapePlay}
                  className="relative w-72 h-40 md:w-80 md:h-44 bg-[#EAE6DF] rounded-lg p-2.5 shadow-[0_10px_30px_rgba(17,17,19,0.15)] border-4 border-[#C3BDB3] flex flex-col justify-between overflow-hidden flex-shrink-0 scale-95 sm:scale-100 cursor-pointer hover:border-accent/40 active:scale-98 transition-all duration-300 group"
                  title={isTapePlaying ? "Click to Pause Tape" : "Click to Play Tape"}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#D3CBC0]" />
                  <div className="absolute inset-x-2 bottom-2 top-2 border border-black/5 rounded-md pointer-events-none" />
                  
                  {/* Tape label */}
                  <div className="relative z-10 bg-[#F8F7F4] text-ink px-3 py-2 rounded-xs border-2 border-black/80 flex flex-col justify-between h-20 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[6px] uppercase tracking-wider text-black/40 font-bold">Kaaktaal Archive // C60 Tape</span>
                        {/* Blinking play LED */}
                        {isTapePlaying && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        )}
                      </div>
                      <span className="font-mono text-[7px] font-bold text-accent flex items-center gap-1">
                        {isTapePlaying && <span className="w-1 h-1 rounded-full bg-accent" />}
                        SIDE A
                      </span>
                    </div>
                    
                    {/* Write-in title area */}
                    <div className="border-b-2 border-dashed border-black/20 pb-0.5 mt-0.5 text-center">
                      <h4 className="font-sans text-[11px] md:text-xs font-extrabold uppercase tracking-wide text-ink truncate px-2">
                        {recommendation.song.title}
                      </h4>
                    </div>
                    
                    <div className="flex justify-between items-center text-[6px] font-mono text-black/40">
                      <span>MONO STEREO</span>
                      <span>ALBUM: {recommendation.song.album}</span>
                    </div>
                  </div>

                  {/* Center window with tape rotating spools */}
                  <div className="relative z-10 mx-auto w-32 h-10 bg-black/5 border-2 border-[#C3BDB3] rounded-sm flex items-center justify-between px-5">
                    {/* Left Spool */}
                    <motion.div 
                      className="w-6 h-6 rounded-full border-2 border-dashed border-black/35 flex items-center justify-center relative bg-white/40"
                      animate={isTapePlaying ? { rotate: 360 } : {}}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-zinc-700 border border-zinc-900" />
                    </motion.div>

                    {/* Tape block visual */}
                    <div className="w-8 h-1 bg-black/10 rounded-full overflow-hidden opacity-50">
                      <div className={`h-full bg-accent/70 transition-all duration-300 ${isTapePlaying ? 'w-full' : 'w-3/4'}`} />
                    </div>

                    {/* Right Spool */}
                    <motion.div 
                      className="w-6 h-6 rounded-full border-2 border-dashed border-black/35 flex items-center justify-center relative bg-white/40"
                      animate={isTapePlaying ? { rotate: 360 } : {}}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-2 h-2 rounded-full bg-zinc-700 border border-zinc-900" />
                    </motion.div>
                  </div>

                  {/* Bottom Cassette block detail */}
                  <div className="mx-auto w-28 h-2.5 bg-[#D3CBC0] rounded-b-md flex justify-between px-5 items-center border border-[#C3BDB3]">
                    <div className="w-1 h-1 rounded-full bg-[#A89E90]" />
                    {/* Status lamp glow */}
                    <div className={`w-2 h-0.5 rounded-full transition-colors duration-300 ${isTapePlaying ? 'bg-accent shadow-[0_0_4px_rgba(184,69,42,1)]' : 'bg-[#A89E90]'}`} />
                    <div className="w-1 h-1 rounded-full bg-[#A89E90]" />
                  </div>
                </div>

              </motion.div>

              {/* Tape controls */}
              <div className="flex justify-center items-center gap-3 mt-1 relative z-10">
                <button
                  onClick={toggleTapePlay}
                  className={`px-4 py-1.5 border border-black/15 hover:border-accent bg-bg text-ink hover:text-accent rounded-xs text-[10px] font-mono uppercase font-bold tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-sm`}
                >
                  <span className={`w-2 h-2 rounded-full ${isTapePlaying ? 'bg-accent animate-pulse' : 'bg-zinc-400'}`} />
                  {isTapePlaying ? "Mute / Pause Tape" : "Spin / Play Tape"}
                </button>
                {onRoomChange && (
                  <button
                    onClick={() => {
                      stopAudio();
                      setIsTapePlaying(false);
                      onRoomChange('music');
                    }}
                    className="px-4 py-1.5 border border-black/15 hover:border-black bg-transparent text-ink rounded-xs text-[10px] font-mono uppercase font-bold tracking-widest transition-all cursor-pointer shadow-sm"
                  >
                    Explore Tracks →
                  </button>
                )}
              </div>

              <div className="space-y-1 max-w-2xl px-4 mt-3">
                <span className="font-mono text-[9px] tracking-widest text-accent font-extrabold uppercase">your recommended frequency</span>
                <h2 className="font-plakatbau text-3xl sm:text-4xl text-ink uppercase tracking-wide font-extrabold">
                  {recommendation.song.title}
                </h2>
                <div className="h-[1px] w-16 bg-accent/25 mx-auto my-1.5" />
                <p className="font-sans text-sm sm:text-base text-rust italic leading-relaxed max-w-xl mx-auto px-4 font-medium">
                  "{getRecommendationLine(recommendation.song.title)}"
                </p>
              </div>
            </div>
          </div>

          {/* CARD 6: PROFILE - Emotional Sentiment Profile */}
          <div 
            id="portal-card-5" 
            data-card-name="Card 6: Profile" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6 text-center"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,26,26,0.03)_0%,transparent_60%)] pointer-events-none" />
            
            <div className="max-w-2xl space-y-6 sm:space-y-8 relative z-10 px-4 w-full">
              <div className="space-y-2">
                <h2 className="font-plakatbau text-2xl sm:text-3xl md:text-4xl text-ink uppercase tracking-wide font-bold">Why This Found You</h2>
                <p className="font-sans text-xs text-ink/60 max-w-md mx-auto">
                  Your subconscious selections align with specific emotional clusters compiled within the deep tape loops.
                </p>
              </div>

              {/* Genre cards cluster (Polished stack representation) */}
              <div className="flex flex-wrap justify-center gap-3 pt-2 max-w-xl mx-auto">
                {emotionalTags.map((tag, i) => (
                  <motion.div
                    key={tag.text}
                    initial={{ opacity: 0, scale: 0.8, y: 15 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: i * 0.1 }}
                    className={`${tag.bg} border rounded-md px-4 py-2 cursor-pointer transition-all duration-300 hover:scale-105 shadow-[0_3px_8px_rgba(17,17,19,0.02)] ${tag.rot}`}
                  >
                    <span className="font-mono text-xs font-semibold tracking-wider">
                      #{tag.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 7: ARTWORK - Captured Polaroid */}
          <div 
            id="portal-card-6" 
            data-card-name="Card 7: Captured Polaroid" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6 text-center"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,69,42,0.03)_0%,transparent_60%)] pointer-events-none" />
            
            <div className="max-w-md w-full space-y-4 relative z-10 px-4">
              {/* Photograph Polaroid Frame */}
              <div className="bg-[#F8F7F4]/90 border border-black/10 hover:border-accent/40 rounded-md p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-md max-w-sm mx-auto">
                <div className="space-y-4">
                  <div className="aspect-[4/3] sm:aspect-square bg-white border border-black/10 overflow-hidden relative rounded-xs p-1 shadow-inner">
                    <img 
                      src={getOptimizedImageUrl(recommendation.artwork.url, 400)} 
                      alt={recommendation.artwork.title}
                      className="w-full h-full object-cover filter brightness-95 contrast-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 text-center pb-1">
                    <span className="font-mono text-[8px] text-ink/40 uppercase font-bold tracking-widest">Captured Polaroid</span>
                    <h4 className="font-plakatbau text-base text-ink uppercase truncate">{recommendation.artwork.title}</h4>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal('photo')}
                  className="w-full mt-3 py-2 border border-black/10 hover:border-accent bg-transparent hover:bg-accent/5 text-[10px] font-mono uppercase font-bold tracking-widest transition-all rounded-xs cursor-pointer text-center text-ink hover:text-accent"
                >
                  See Full Photo
                </button>
              </div>
            </div>
          </div>

          {/* CARD 8: JOURNAL - Archival Typewriter Journal */}
          <div 
            id="portal-card-7" 
            data-card-name="Card 8: Archival Journal" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6 text-center"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(42,120,184,0.03)_0%,transparent_60%)] pointer-events-none" />
            
            <div className="max-w-md w-full space-y-4 relative z-10 px-4">
              {/* Journal Preview Card */}
              <div className="bg-[#F8F7F4]/90 border border-black/10 hover:border-accent/40 rounded-md p-5 flex flex-col justify-between transition-all duration-300 shadow-md max-w-sm mx-auto">
                <div className="space-y-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center text-accent">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[8px] text-ink/40 uppercase font-bold tracking-widest">Archival Journal</span>
                    <h4 className="font-plakatbau text-base text-ink uppercase truncate">{recommendation.journal.title}</h4>
                  </div>
                  <p className="font-sans text-xs text-ink/60 line-clamp-4 leading-relaxed italic">
                    "{recommendation.journal.excerpt}"
                  </p>
                </div>
                <button 
                  onClick={() => setActiveModal('journal')}
                  className="w-full mt-4 py-2 border border-black/10 hover:border-accent bg-transparent hover:bg-accent/5 text-[10px] font-mono uppercase font-bold tracking-widest transition-all rounded-xs cursor-pointer text-center text-ink hover:text-accent"
                >
                  Read Journal Entry
                </button>
              </div>
            </div>
          </div>

          {/* CARD 9: EPILOGUE - Epilogue & Controls */}
          <div 
            id="portal-card-8" 
            data-card-name="Card 9: Epilogue" 
            className="w-full h-full snap-start flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden bg-[#D5DCD9] p-6 text-center"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,26,26,0.04)_0%,transparent_60%)] pointer-events-none" />
            
            <div className="max-w-2xl space-y-6 relative z-10 px-4">
              <div className="space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold">EPILOGUE</span>
                <h2 className="font-plakatbau text-2xl sm:text-3xl md:text-4xl text-ink uppercase tracking-wide leading-tight font-extrabold max-w-md mx-auto">
                  "Some doors do not close after opening."
                </h2>
                <p className="font-sans text-xs text-ink/60 max-w-sm mx-auto leading-relaxed">
                  The chronology of your answers is permanently added to Kaaktaal's soil. Return anytime to calibrate your sensors again.
                </p>
              </div>

              {/* Action Buttons: Large Crow Button & Share Button */}
              <div className="flex flex-col items-center gap-6 max-w-sm mx-auto w-full pt-4">
                
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-black bg-[#F8F7F4] p-2 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group relative"
                    title="Re-calibrate / Start Over"
                  >
                    {/* Spinning dashed circle around the crow */}
                    <div className="absolute inset-0 border border-dashed border-accent/30 rounded-full animate-spin-slow pointer-events-none" />
                    
                    <img 
                      src={getOptimizedImageUrl("https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Kaak.png", 200)}
                      alt="Kaaktaal Crow"
                      className="w-14 h-14 object-contain group-hover:rotate-12 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold mt-1">Re-calibrate</span>
                </div>

                <button
                  onClick={() => setIsShareOpen(true)}
                  className="px-6 py-2.5 w-full max-w-[200px] border border-accent hover:bg-accent hover:text-white bg-accent/90 text-[#F8F7F4] text-[10px] font-mono uppercase font-bold tracking-widest transition-all rounded-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* MEDIA MODALS (Read/See content overlay dialogues) */}
      <AnimatePresence>
        {activeModal && recommendation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-[#F4EFE6] border border-[#DDD3C4] rounded-sm p-6 sm:p-8 relative text-ink shadow-[inset_0_0_40px_rgba(40,25,5,0.08),0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden max-h-[85vh] flex flex-col justify-between"
            >
              {/* Top controls header */}
              <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
                {/* Sound toggle button */}
                {(activeModal === 'journal' || activeModal === 'story') && (
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.07] text-ink/60 hover:text-ink transition-all cursor-pointer flex items-center justify-center"
                    title={isMuted ? "Unmute typewriter sound" : "Mute typewriter sound"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
                  </button>
                )}
                
                {/* Close button */}
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.07] text-ink/60 hover:text-ink transition-all cursor-pointer flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Decorative side margins to emulate binding punch holes or physical sheet edges */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/[0.04] to-transparent pointer-events-none" />
              <div className="absolute left-2.5 top-0 bottom-0 border-l border-dashed border-black/[0.08] pointer-events-none" />

              <div className="overflow-y-auto pr-2 pl-4 space-y-6 flex-1 select-text">
                {activeModal === 'journal' && (
                  <div className="space-y-4 pt-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-extrabold block">Archival Typewriter Journal</span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-zinc-900 tracking-tight leading-tight font-extrabold border-b border-black/10 pb-3">{recommendation.journal.title}</h3>
                    <div className="font-mono text-xs sm:text-sm leading-relaxed text-zinc-800 whitespace-pre-line bg-black/[0.015] p-5 border border-black/5 rounded-xs shadow-[inset_0_1px_5px_rgba(0,0,0,0.02)] min-h-[160px] relative">
                      {/* Subtle typewriter guide lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:100%_1.5rem] pointer-events-none opacity-50" />
                      <p className="relative z-10 leading-6 pl-1 pt-1 font-medium">
                        <TypewrittenText text={recommendation.journal.excerpt} isMuted={isMuted} speed={15} />
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-accent block pt-1">Dated / Timestamp: {recommendation.journal.date}</span>
                  </div>
                )}

                {activeModal === 'story' && (
                  <div className="space-y-4 pt-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-extrabold block">Unpublished Fiction Record</span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-zinc-900 tracking-tight leading-tight font-extrabold border-b border-black/10 pb-3">{recommendation.story.title}</h3>
                    <div className="font-serif text-base sm:text-lg leading-relaxed text-zinc-900 bg-white/30 p-5 border border-black/5 rounded-xs shadow-inner min-h-[220px]">
                      <p className="whitespace-pre-wrap leading-relaxed first-letter:text-4xl first-letter:font-extrabold first-letter:text-accent first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                        <TypewrittenText text={recommendation.story.text} isMuted={isMuted} speed={10} />
                      </p>
                    </div>
                  </div>
                )}

                {activeModal === 'photo' && (
                  <div className="space-y-4 pt-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-extrabold block">Subconscious Polaroid Capture</span>
                    <div className="border-8 border-white rounded-xs shadow-lg overflow-hidden bg-white max-h-[50vh] flex items-center justify-center p-3">
                      <div className="border border-black/5 overflow-hidden w-full h-full relative">
                        <img 
                          src={getOptimizedImageUrl(recommendation.artwork.url, 800)} 
                          alt={recommendation.artwork.title} 
                          className="w-full object-contain filter brightness-95 contrast-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)] pointer-events-none mix-blend-multiply" />
                      </div>
                    </div>
                    <div className="space-y-1 pl-1">
                      <h4 className="font-serif text-xl text-zinc-900 font-extrabold leading-snug">{recommendation.artwork.title}</h4>
                      <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wider">Source: {recommendation.artwork.artist || "Kaaktaal Vault Capture"}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-black/[0.08] pt-4 mt-6 flex justify-end">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 border border-black/15 hover:border-black bg-bg hover:bg-black hover:text-white text-zinc-800 text-[10px] font-mono uppercase tracking-widest font-extrabold transition-all rounded-xs cursor-pointer shadow-xs"
                >
                  Dismiss / Slide Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INSTAGRAM SHARE CARD MODAL */}
      <AnimatePresence>
        {isShareOpen && recommendation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 backdrop-blur-md overflow-y-auto"
          >
            <div className="min-h-full w-full flex flex-col items-center justify-start p-4 pb-8 sm:pb-12 pt-20 sm:pt-24">
              {/* Elastic spacer to shift contents towards the bottom while keeping scroll safe */}
              <div className="flex-grow min-h-[10px] sm:min-h-[20px]" />
              
              <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-4 sm:gap-6 text-center">
                
                {/* Theme Selector */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mb-2 bg-black/[0.03] p-1 rounded-full border border-black/5 z-20 relative">
                  <button 
                    onClick={() => setShareTheme('classic')}
                    className={`px-3 py-1 text-[8.5px] font-mono uppercase tracking-wider rounded-full border transition-all cursor-pointer ${shareTheme === 'classic' ? 'bg-black text-[#F8F7F4] border-black font-extrabold' : 'border-transparent text-ink/70 hover:bg-black/[0.04]'}`}
                  >
                    Classic Grid
                  </button>
                  <button 
                    onClick={() => setShareTheme('polaroid')}
                    className={`px-3 py-1 text-[8.5px] font-mono uppercase tracking-wider rounded-full border transition-all cursor-pointer ${shareTheme === 'polaroid' ? 'bg-black text-[#F8F7F4] border-black font-extrabold' : 'border-transparent text-ink/70 hover:bg-black/[0.04]'}`}
                  >
                    Polaroid
                  </button>
                  <button 
                    onClick={() => setShareTheme('cassette')}
                    className={`px-3 py-1 text-[8.5px] font-mono uppercase tracking-wider rounded-full border transition-all cursor-pointer ${shareTheme === 'cassette' ? 'bg-black text-[#F8F7F4] border-black font-extrabold' : 'border-transparent text-ink/70 hover:bg-black/[0.04]'}`}
                  >
                    Tape Sleeve
                  </button>
                </div>

                {/* LIVE MINIFIED PREVIEW */}
                <div className="w-[300px] h-[533px] sm:w-[350px] sm:h-[620px] border border-black/80 rounded-sm overflow-hidden bg-[#F8F7F4] p-4 sm:p-5 pt-6 sm:pt-8 text-left flex flex-col justify-between text-ink relative shadow-2xl select-none transition-all duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,26,26,0.02)_0%,transparent_60%)] pointer-events-none" />
                  
                  {shareTheme === 'classic' && (
                    <>
                      <div className="flex justify-between items-center border-b border-black pb-2 sm:pb-2.5">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <img 
                            src="https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png"
                            alt="Kaaktaal Logo"
                            className="h-3.5 sm:h-4.5 w-auto object-contain"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-mono text-[7.5px] sm:text-[8.5px] uppercase tracking-widest text-ink/50 font-bold">kaaktaliyo granthashala</span>
                        </div>
                        <span className="font-mono text-[7.5px] sm:text-[8.5px] text-ink/40 font-bold">{formattedDate}</span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between pt-3 sm:pt-4 pb-1 sm:pb-1.5 overflow-hidden">
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 h-full grid-rows-[auto_auto_1fr] items-stretch">
                          {/* Row 1, Col 1: Song Cover */}
                          <div className="aspect-square w-full">
                            {songCoverUrl ? (
                              <img 
                                src={getOptimizedImageUrl(songCoverUrl, 150)} 
                                alt={recommendation.song.album} 
                                className="w-full h-full object-cover border border-black rounded-xs"
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full border border-black bg-black/5 rounded-xs flex items-center justify-center font-mono text-[8px] font-bold text-ink/40">NO COVER</div>
                            )}
                          </div>

                          {/* Row 1, Col 2: Song Info */}
                          <div className="aspect-square w-full border border-black p-3 sm:p-4 bg-black/[0.015] flex flex-col justify-center rounded-xs min-w-0">
                            <span className="font-mono text-[8.5px] sm:text-[10px] uppercase tracking-widest text-accent font-extrabold block mb-1">A song that found you</span>
                            <h4 className="font-plakatbau text-[14px] sm:text-[17px] font-extrabold uppercase tracking-wide text-ink leading-tight">
                              {recommendation.song.title}
                            </h4>
                            <p className="font-mono text-[9px] sm:text-[11px] text-ink/40 truncate mt-1.5">Album: {recommendation.song.album}</p>
                          </div>

                          {/* Row 2, Col 1: Offered Band Image */}
                          <div className="aspect-square w-full">
                            <img 
                              src={getOptimizedImageUrl(recommendation.artwork.url, 300)} 
                              alt={recommendation.artwork.title}
                              className="w-full h-full object-cover border border-black rounded-xs"
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Row 2, Col 2: Archival Journal Upper Part */}
                          <div className="aspect-square w-full border border-black p-3 sm:p-4 bg-black/[0.015] rounded-xs flex flex-col justify-between min-w-0">
                            <div>
                              <span className="font-mono text-[8.5px] sm:text-[10px] uppercase tracking-widest text-accent font-extrabold block mb-1">Archival Journal</span>
                              <h5 className="font-plakatbau text-[14px] sm:text-[17px] text-ink uppercase font-extrabold leading-tight line-clamp-2">{recommendation.journal.title}</h5>
                            </div>
                            <span className="font-mono text-[9px] sm:text-[11px] text-accent block font-bold">{recommendation.journal.date}</span>
                          </div>

                          {/* Row 3, Col 1 & 2 (Spans both): Archival Journal Lower Part */}
                          <div className="col-span-2 border border-black p-3 sm:p-4 bg-black/[0.015] text-left rounded-xs flex flex-col justify-center min-w-0">
                            <p className="font-sans text-[12px] sm:text-[14px] text-ink/85 leading-relaxed italic line-clamp-3">
                              "{recommendation.journal.excerpt}"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-black pb-0.5 pt-1.5 sm:pt-2 flex justify-between items-end">
                        <div className="space-y-0.5">
                          <p className="font-mono text-[6px] sm:text-[7px] text-ink/35 uppercase">Digital Archive</p>
                          <p className="font-mono text-[7px] sm:text-[8px] font-bold text-ink/60 uppercase">kaaktaal.website</p>
                        </div>
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-accent/20 flex items-center justify-center">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-accent" />
                        </div>
                      </div>
                    </>
                  )}

                  {shareTheme === 'polaroid' && (
                    <div className="flex-1 flex flex-col justify-between p-1 text-center bg-[#EFECE4] border border-black/5 rounded-xs h-full">
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="bg-white p-2.5 sm:p-3.5 pb-6 sm:pb-8 shadow-md border border-black/5 rounded-xs w-full max-w-[210px] sm:max-w-[250px] aspect-[4/5] flex flex-col justify-between">
                          <div className="w-full h-[85%] overflow-hidden bg-black/5 relative border border-black/5">
                            <img 
                              src={getOptimizedImageUrl(recommendation.artwork.url, 300)} 
                              alt={recommendation.artwork.title}
                              className="w-full h-full object-cover filter brightness-95 contrast-105"
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.12)_100%)] pointer-events-none mix-blend-multiply" />
                          </div>
                          <div className="text-[7px] sm:text-[8px] font-mono text-zinc-400 uppercase tracking-widest mt-1.5 truncate">
                            {recommendation.artwork.title}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pb-4 sm:pb-6 space-y-1">
                        <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-widest text-accent font-extrabold block">subconscious resonance</span>
                        <h4 className="font-serif text-base sm:text-lg italic text-zinc-800 leading-tight">
                          "{recommendation.song.title}"
                        </h4>
                        <p className="font-mono text-[7px] text-zinc-500 uppercase tracking-wider">
                          captured by kaaktaal archive • {recommendation.journal.date}
                        </p>
                      </div>
                    </div>
                  )}

                  {shareTheme === 'cassette' && (
                    <div className="flex-1 flex flex-col justify-between border-2 border-black/80 bg-[#EAE6DF] p-3 sm:p-4 rounded-xs text-ink/90 font-mono relative overflow-hidden h-full">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-rust to-black opacity-60" />
                      
                      <div className="space-y-4 flex-1 flex flex-col justify-between pt-1">
                        {/* Tape Title Area */}
                        <div className="border-b border-black/35 pb-2">
                          <div className="flex justify-between items-center text-[7px] text-black/50 font-extrabold">
                            <span>KAAKTAAL MAGNETIC ARCHIVE</span>
                            <span>C60 TAPE</span>
                          </div>
                          <h4 className="font-plakatbau text-[15px] sm:text-[18px] text-black uppercase font-extrabold tracking-wider mt-1 truncate">
                            {recommendation.song.title}
                          </h4>
                          <p className="text-[7px] sm:text-[8px] text-black/60 truncate uppercase">ALBUM: {recommendation.song.album}</p>
                        </div>

                        {/* Answer Logs Table */}
                        <div className="space-y-2 border-b border-dashed border-black/25 pb-3">
                          <span className="text-[7.5px] text-accent uppercase font-extrabold tracking-wider">Calibration logs:</span>
                          <div className="space-y-1 text-[8px] sm:text-[9px] leading-relaxed text-black/80">
                            <div className="flex justify-between">
                              <span className="font-extrabold">01/ sensory:</span>
                              <span className="italic max-w-[130px] truncate">"{getFirstAnswerText(answers.q1)}"</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-extrabold">02/ atmosphere:</span>
                              <span className="italic max-w-[130px] truncate">"{getSecondAnswerText(answers.q2) || 'Standard'}"</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-extrabold">03/ emotional load:</span>
                              <span className="italic max-w-[130px] truncate">"{getThirdAnswerText(answers.q3)}"</span>
                            </div>
                          </div>
                        </div>

                        {/* Barcode representation */}
                        <div className="flex flex-col items-center pt-2">
                          <div className="h-6 w-32 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_5px)] opacity-60" />
                          <span className="text-[6.5px] text-black/40 uppercase mt-1 tracking-wider">REF: KAK-{recommendation.song.title.slice(0,3).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2 w-full max-w-[200px] sm:max-w-[240px]">
                  <button
                    onClick={handleDownloadShareCard}
                    disabled={isGeneratingShareImage}
                    className="w-full py-2 sm:py-2.5 bg-neutral-600 text-[#F8F7F4] hover:bg-neutral-700 font-mono text-xs uppercase font-extrabold tracking-widest rounded-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isGeneratingShareImage ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        GENERATING...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" /> Download
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsShareOpen(false)}
                    className="w-full py-2 sm:py-2.5 border border-black/15 hover:border-black/40 bg-transparent font-mono text-xs uppercase tracking-widest font-bold transition-all rounded-sm cursor-pointer text-ink"
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OFF-SCREEN HIGH-RESOLUTION RENDER COMPONENT FOR PNG EXPORT */}
      {recommendation && (
        <div 
          ref={shareCardRef}
          className="absolute flex flex-col justify-between bg-[#F8F7F4] text-ink p-16 pt-24 pb-12 font-sans select-none overflow-hidden border-[16px] border-black"
          style={{
            width: "1080px",
            height: "1920px",
            left: "-9999px",
            top: "-9999px",
          }}
        >
          {shareTheme === 'classic' && (
            <>
              {/* Subtle textured overlay background for premium print poster quality */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,26,26,0.02)_0%,transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPg==')] bg-repeat pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-center border-b-4 border-black pb-8">
                <div className="flex items-center gap-6">
                  <img 
                    src="https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png"
                    alt="Kaaktaal Logo"
                    className="h-20 w-auto object-contain"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="font-mono text-2xl uppercase tracking-widest text-ink/50 font-bold">KAAKTALIYO GRANTHASHALA</span>
                    <h3 className="font-plakatbau text-7xl uppercase tracking-wider text-accent font-extrabold">KAAKTAAL</h3>
                  </div>
                </div>
                <span className="font-mono text-3xl text-ink/40 font-bold">{formattedDate}</span>
              </div>

              {/* Main content timeline */}
              <div className="flex-1 flex flex-col justify-between pt-16 pb-6">
                <div className="grid grid-cols-2 gap-10 h-full grid-rows-[auto_auto_1fr] items-stretch">
                  {/* Row 1, Col 1: Song Cover */}
                  <div className="aspect-square w-full">
                    {songCoverUrl ? (
                      <img 
                        src={getOptimizedImageUrl(songCoverUrl, 500)} 
                        alt={recommendation.song.album} 
                        className="w-full h-full object-cover border-4 border-black rounded-sm"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full border-4 border-black bg-black/5 rounded-sm flex items-center justify-center font-mono text-4xl font-bold text-ink/40">NO COVER</div>
                    )}
                  </div>

                  {/* Row 1, Col 2: Song Info */}
                  <div className="aspect-square w-full border-4 border-black p-12 bg-black/[0.015] flex flex-col justify-center rounded-sm min-w-0">
                    <span className="font-mono text-2xl uppercase tracking-widest text-accent font-extrabold block mb-2">A song that found you</span>
                    <h4 className="font-plakatbau text-6xl font-extrabold uppercase tracking-wide text-ink leading-snug">
                      {recommendation.song.title}
                    </h4>
                    <p className="font-mono text-3xl text-ink/40 truncate mt-3">Album: {recommendation.song.album}</p>
                  </div>

                  {/* Row 2, Col 1: Offered Band Image */}
                  <div className="aspect-square w-full">
                    <img 
                      src={getOptimizedImageUrl(recommendation.artwork.url, 500)} 
                      alt={recommendation.artwork.title}
                      className="w-full h-full object-cover border-4 border-black rounded-sm filter brightness-95 contrast-105"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Row 2, Col 2: Archival Journal Upper Part */}
                  <div className="aspect-square w-full border-4 border-black p-12 bg-black/[0.015] rounded-sm flex flex-col justify-between min-w-0">
                    <div>
                      <span className="font-mono text-2xl uppercase tracking-widest text-accent font-extrabold block mb-4">Archival Journal</span>
                      <h5 className="font-plakatbau text-6xl text-ink uppercase font-extrabold leading-tight line-clamp-2">{recommendation.journal.title}</h5>
                    </div>
                    <span className="font-mono text-3xl text-accent block font-bold">{recommendation.journal.date}</span>
                  </div>

                  {/* Row 3, Col 1 & 2 (Spans both): Archival Journal Lower Part */}
                  <div className="col-span-2 border-4 border-black p-12 bg-black/[0.015] text-left rounded-sm flex flex-col justify-center min-w-0">
                    <p className="font-sans text-[38px] text-ink/85 leading-relaxed italic">
                      "{recommendation.journal.excerpt}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer branding details */}
              <div className="border-t-4 border-black pb-2 pt-12 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="font-mono text-lg text-ink/30 uppercase tracking-widest">Digital Archive</p>
                  <p className="font-mono text-2xl font-bold text-ink/50 uppercase">kaaktaal.website</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-accent/30 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            </>
          )}

          {shareTheme === 'polaroid' && (
            <div className="flex-grow flex flex-col justify-between text-center p-8 bg-[#EFECE4] h-full border-[10px] border-[#DDD5C5]">
              <div className="flex-1 flex flex-col justify-center items-center py-10">
                <div className="bg-white p-12 pb-24 shadow-[0_15px_30px_rgba(0,0,0,0.1)] rounded-xs w-full max-w-[750px] aspect-[4/5] flex flex-col justify-between">
                  <div className="w-full h-[85%] overflow-hidden bg-black/5 relative border-2 border-black/5">
                    <img 
                      src={getOptimizedImageUrl(recommendation.artwork.url, 800)} 
                      alt={recommendation.artwork.title}
                      className="w-full h-full object-cover filter brightness-95 contrast-105"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.12)_100%)] pointer-events-none mix-blend-multiply" />
                  </div>
                  <div className="text-2xl font-mono text-zinc-400 uppercase tracking-widest mt-6 text-center">
                    {recommendation.artwork.title}
                  </div>
                </div>
              </div>
              
              <div className="pb-16 space-y-4">
                <span className="font-mono text-xl uppercase tracking-widest text-accent font-extrabold block">subconscious resonance</span>
                <h4 className="font-serif text-6xl italic text-zinc-800 leading-tight">
                  "{recommendation.song.title}"
                </h4>
                <div className="h-1 w-24 bg-accent/20 mx-auto my-4" />
                <p className="font-mono text-xl text-zinc-500 uppercase tracking-wider">
                  captured by kaaktaal archive • {recommendation.journal.date}
                </p>
              </div>
            </div>
          )}

          {shareTheme === 'cassette' && (
            <div className="flex-grow flex flex-col justify-between border-[8px] border-black bg-[#EAE6DF] p-16 rounded-xs text-ink font-mono relative overflow-hidden h-full">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-r from-accent via-rust to-black opacity-80" />
              
              <div className="space-y-12 flex-1 flex flex-col justify-between pt-8">
                {/* Tape Title Area */}
                <div className="border-b-4 border-black pb-8">
                  <div className="flex justify-between items-center text-xl text-black/50 font-extrabold">
                    <span>KAAKTAAL MAGNETIC ARCHIVE</span>
                    <span>C60 TAPE RECORD</span>
                  </div>
                  <h4 className="font-plakatbau text-7xl text-black uppercase font-extrabold tracking-wider mt-4">
                    {recommendation.song.title}
                  </h4>
                  <p className="text-2xl text-black/60 uppercase mt-1">ALBUM: {recommendation.song.album}</p>
                </div>

                {/* Answer Logs Table */}
                <div className="space-y-6 border-b-4 border-dashed border-black/25 pb-12">
                  <span className="text-2xl text-accent uppercase font-extrabold tracking-wider">Calibration logs:</span>
                  <div className="space-y-4 text-3xl leading-relaxed text-black/80">
                    <div className="flex justify-between border-b border-black/10 pb-2">
                      <span className="font-extrabold">01/ SENSORY SELECTION:</span>
                      <span className="italic max-w-[600px] truncate">"{getFirstAnswerText(answers.q1)}"</span>
                    </div>
                    <div className="flex justify-between border-b border-black/10 pb-2">
                      <span className="font-extrabold">02/ ATMOSPHERE / EMOTION:</span>
                      <span className="italic max-w-[600px] truncate">"{getSecondAnswerText(answers.q2) || 'Standard'}"</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="font-extrabold">03/ EMOTIONAL CAPACITY LOAD:</span>
                      <span className="italic max-w-[600px] truncate">"{getThirdAnswerText(answers.q3)}"</span>
                    </div>
                  </div>
                </div>

                {/* Barcode representation */}
                <div className="flex flex-col items-center pt-8">
                  <div className="h-20 w-96 bg-[repeating-linear-gradient(90deg,black,black_4px,transparent_4px,transparent_10px)] opacity-75" />
                  <span className="text-lg text-black/40 uppercase mt-4 tracking-widest">REFERENCE ID: KAK-{recommendation.song.title.slice(0,3).toUpperCase()}-{Date.now().toString().slice(-4)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
