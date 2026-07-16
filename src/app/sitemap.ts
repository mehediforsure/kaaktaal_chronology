import { MetadataRoute } from 'next';
import { fetchReleases, fetchSongs } from '../lib/supabase';
import { ALBUMS, CROW_ACCIDENTS } from '../data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kaaktaal-v2.vercel.app';

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/portal`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/finder`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/albums`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic Albums
  ALBUMS.forEach((album) => {
    sitemapEntries.push({
      url: `${baseUrl}/albums/${album.release_id}`,
      lastModified: new Date(album.release_date || new Date()),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });

  // Dynamic Songs
  const allSongs = await fetchSongs();
  allSongs.forEach((song) => {
    if (song.song_id) {
      sitemapEntries.push({
        url: `${baseUrl}/songs/${song.song_id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  });

  // Archive / Lore
  CROW_ACCIDENTS.forEach((accident) => {
    sitemapEntries.push({
      url: `${baseUrl}/archive/${accident.id}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    });
  });

  return sitemapEntries;
}
