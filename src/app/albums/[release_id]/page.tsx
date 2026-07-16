import React from 'react';
import type { Metadata } from 'next';
import AlbumsClient from '../AlbumsClient';
import { ALBUMS } from '../../../data';
import { fetchReleases } from '../../../lib/supabase';

interface Props {
  params: { release_id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { release_id } = params;
  
  // Try to find in mock data first for fast synchronous metadata (or fetch from Supabase if you prefer)
  const album = ALBUMS.find(a => a.release_id === release_id);
  
  if (!album) {
    return { title: 'Kaaktaal | Not Found' };
  }

  return {
    title: `${album.title} - Kaaktaal Album`,
    description: album.description_short || `Listen to ${album.title} by Kaaktaal.`,
    alternates: {
      canonical: `https://kaaktaal.com/albums/${release_id}`,
    },
    openGraph: {
      title: `${album.title} - Kaaktaal Album`,
      description: album.description_short,
      images: album.cover_image ? [{ url: album.cover_image }] : [],
    }
  };
}

export default async function AlbumDetailPage({ params }: Props) {
  const { release_id } = params;
  const album = ALBUMS.find(a => a.release_id === release_id);

  return (
    <>
      {album && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicAlbum",
              "name": album.title,
              "byArtist": {
                "@type": "MusicGroup",
                "name": "Kaaktaal"
              },
              "datePublished": album.release_date || album.year,
              "description": album.description_short,
              "url": `https://kaaktaal.com/albums/${release_id}`,
              "image": album.cover_image,
              "numTracks": album.tracks ? album.tracks.length : 0
            })
          }}
        />
      )}
      <div className="flex-1 w-full flex flex-col">
        {/* Pass initialAlbumId to the client component so it opens immediately */}
        <AlbumsClient initialAlbumId={release_id} />
      </div>
    </>
  );
}
