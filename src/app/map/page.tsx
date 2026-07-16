import React from 'react';
import type { Metadata } from 'next';
import MapClient from './MapClient';

export const metadata: Metadata = {
  title: 'Kaaktaal Chronology | Cartography Room',
  description: 'A map of memories and coincidences.',
  alternates: {
    canonical: 'https://kaaktaal-v2.vercel.app/map',
  },
  openGraph: {
    title: 'Kaaktaal Chronology | Cartography Room',
    description: 'A map of memories and coincidences.',
    url: 'https://kaaktaal-v2.vercel.app/map',
  }
};

export default function MapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Cartography Room - Kaaktaal",
            "url": "https://kaaktaal-v2.vercel.app/map"
          })
        }}
      />
      <main className="w-full h-full flex-1">
        <MapClient />
      </main>
    </>
  );
}
