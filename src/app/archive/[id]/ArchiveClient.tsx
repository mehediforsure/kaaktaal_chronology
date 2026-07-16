'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../../context/AppContext';
import { CROW_ACCIDENTS } from '../../../data';

export default function ArchiveClient({ initialAccidentId }: { initialAccidentId: string }) {
  const router = useRouter();
  const { currentOverlayAccident, setCurrentOverlayAccident } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (initialAccidentId) {
      const accident = CROW_ACCIDENTS.find(a => a.id === initialAccidentId);
      if (accident) {
        setCurrentOverlayAccident(accident);
      }
    }
    setMounted(true);
  }, [initialAccidentId, setCurrentOverlayAccident]);

  // If they dismiss the overlay while on this route, take them back to home
  useEffect(() => {
    if (mounted && currentOverlayAccident === null) {
      router.push('/');
    }
  }, [mounted, currentOverlayAccident, router]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Fallback view if JS is disabled or while waiting for context */}
      <h2 className="font-syne text-2xl uppercase font-bold tracking-tight text-ink">
        Loading Archive Memory...
      </h2>
    </div>
  );
}
