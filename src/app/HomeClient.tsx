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
    <main className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-6 py-2 select-none space-y-4 md:space-y-6 lg:space-y-4 xl:space-y-6">
      {/* 1. Portal Entrance on Top (Centered) */}
      <section className="w-full max-w-xl mx-auto mt-1 md:mt-2">
        <PortalCard href="/portal" />
      </section>
      
      {/* 2. Middle and Bottom Section */}
      <section className="w-full max-w-xl mx-auto mt-4 md:mt-6">
        <JournalSection />
      </section>
    </main>
  );
}
