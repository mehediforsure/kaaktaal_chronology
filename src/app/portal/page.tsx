import React from 'react';
import type { Metadata } from 'next';
import PortalClient from './PortalClient';

export const metadata: Metadata = {
  title: 'Kaaktaal Chronology | The Portal',
  description: 'Enter the portal to explore the depths of Kaaktaal’s memory.',
  alternates: {
    canonical: 'https://kaaktaal-v2.vercel.app/portal',
  },
  openGraph: {
    title: 'Kaaktaal Chronology | The Portal',
    description: 'Enter the portal to explore the depths of Kaaktaal’s memory.',
    url: 'https://kaaktaal-v2.vercel.app/portal',
  }
};

export default function PortalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "The Portal - Kaaktaal",
            "url": "https://kaaktaal-v2.vercel.app/portal"
          })
        }}
      />
      <main className="pt-4 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-4 md:pt-8 md:px-8 md:pb-4 flex-1 max-w-5xl mx-auto w-full flex flex-col relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(213,220,217,0.35)_0%,transparent_75%)] pointer-events-none z-0" />
        <div className="relative z-10 flex-1 flex flex-col">
          <PortalClient />
        </div>
      </main>
    </>
  );
}
