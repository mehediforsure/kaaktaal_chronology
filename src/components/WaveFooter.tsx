"use client";

import { useEffect, useState, type JSX } from 'react';

interface WaveFooterProps {
  nWaves?: number;
  height?: number;
}

const WAVE_COLORS = [
  'rgba(255, 91, 61, 1)',
  'rgba(37, 31, 27, 1)',
  'rgba(20, 104, 153, 1)',
  'rgba(222, 212, 0, 1)',
  'rgba(153, 131, 0, 1)',
  'rgba(247, 217, 203, 1)',
];

function buildWavePath(w: number, h: number, yOffset: number): string {
  const r = ((8 / 3 - Math.sqrt(3)) * w) / 2;
  const o = (2 * Math.sqrt(3) * h) / 6;
  return (
    `M 0 ${yOffset} ` +
    `c ${r} ${-o}, ${w - r} ${o}, ${w} 0 ` +
    `c ${r} ${-o}, ${w - r} ${o}, ${w} 0 ` +
    `v 100 h ${-2 * w} Z`
  );
}

export default function WaveFooter({ nWaves = 10, height = 220 }: WaveFooterProps) {
  const [waves, setWaves] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const built: JSX.Element[] = [];
    for (let i = 0; i < nWaves; i++) {
      const swellDuration = 12 + 6 * (((i / nWaves) * 1.5) ** 2 - (3 * i) / nWaves);
      const swellDelay = -nWaves + 0.3 * i;
      const waveDuration = 15;
      const waveDelay = 6 * (((i / nWaves) * 1.5) ** 2 - (3 * i) / nWaves);

      built.push(
        <svg key={i} style={{ animation: `swell ${swellDuration}s ease ${swellDelay}s infinite` }}>
          <path
            d={buildWavePath(100, 100, 50 + 7 * i)}
            fill={WAVE_COLORS[i % WAVE_COLORS.length]}
            style={{
              animation: `wave ${waveDuration}s cubic-bezier(0.36, 0.45, 0.63, 0.53) ${waveDelay}s infinite`,
            }}
          />
        </svg>
      );
    }
    setWaves(built);
  }, [nWaves]);

  return (
    <>
      <style>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes swell {
          0% { transform: translateY(0); }
          50% { transform: translateY(7px); }
          100% { transform: translateY(0); }
        }
      `}</style>
      <svg
        width="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height, overflow: 'visible' }}
      >
        {waves}
      </svg>
    </>
  );
}
