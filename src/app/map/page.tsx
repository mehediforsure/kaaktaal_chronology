import React from 'react';
import type { Metadata } from 'next';
import MapClient from './MapClient';

export const metadata: Metadata = {
  title: 'Kaaktaal Chronology | Cartography Room',
  description: 'A map of memories and coincidences.',
  alternates: {
    canonical: 'https://kaaktaal.com/map',
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
            "url": "https://kaaktaal.com/map"
          })
        }}
      />
      <div className="w-full h-full flex-1">
        <MapClient />
      </div>
    </>
  );
}
