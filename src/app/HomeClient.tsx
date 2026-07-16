'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PortalCard } from '../components/DirectoryHero';
import JournalSection from '../components/JournalSection';

export default function HomeClient() {
  const router = useRouter();

  const handleRoomChange = (room: string) => {
    router.push(`/${room}`);
  };

  return (
    <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-6 py-2 select-none space-y-4 md:space-y-6 lg:space-y-4 xl:space-y-6">
      {/* 1. Portal Entrance on Top (Centered) */}
      <div className="w-full max-w-xl mx-auto mt-1 md:mt-2">
        <PortalCard href="/portal" />
      </div>
      
      {/* 2. Middle and Bottom Section */}
      <div className="w-full max-w-xl mx-auto mt-4 md:mt-6">
        <JournalSection />
      </div>
    </div>
  );
}
