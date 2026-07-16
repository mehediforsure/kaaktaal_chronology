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
      canonical: `https://kaaktaal-v2.vercel.app/albums/${release_id}`,
    },
    openGraph: {
      title: `${album.title} - Kaaktaal Album`,
      description: album.description_short,
      url: `https://kaaktaal-v2.vercel.app/albums/${release_id}`,
      type: 'music.album',
      images: album.cover_image ? [{ url: album.cover_image }] : [],
      // @ts-ignore - Next.js types might not fully support all music.* properties yet
      music: {
        musician: 'https://kaaktaal-v2.vercel.app/',
        release_date: album.release_date,
      }
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
                "name": "Kaaktaal",
                "url": "https://kaaktaal-v2.vercel.app/"
              },
              "datePublished": album.release_date || album.year,
              "description": album.description_short,
              "url": `https://kaaktaal-v2.vercel.app/albums/${release_id}`,
              "image": album.cover_image || "https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png",
              "numTracks": album.tracks ? album.tracks.length : 0,
              "track": album.tracks ? album.tracks.map((t, i) => ({
                "@type": "MusicRecording",
                "name": t,
                "position": i + 1,
                "byArtist": { "@type": "MusicGroup", "name": "Kaaktaal" }
              })) : undefined
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
