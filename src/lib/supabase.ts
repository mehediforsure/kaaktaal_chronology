import { createClient } from '@supabase/supabase-js';
import { Album, Song } from '../types';
import { ALBUMS } from '../data';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Fetch all releases from Supabase table 'releases'.
 * Falls back to local ALBUMS mock data if empty or fetch error occurs.
 */
export async function fetchReleases(): Promise<Album[]> {
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('*');
    
    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase releases fetch warning:', error.message);
      return ALBUMS;
    }
    return data as Album[];
  } catch (err) {
    console.error('Failed to fetch releases from Supabase:', err);
    return ALBUMS;
  }
}

/**
 * Fetch all songs from Supabase table 'songs'.
 * Optionally filter by song_id if provided.
 */
export async function fetchSongs(songId?: string): Promise<Song[]> {
  try {
    let query = supabase.from('songs_official').select('*');
    if (songId) {
      query = query.eq('song_id', songId);
    }
    const { data, error } = await query;
    if (error || !data) {
      if (error) console.warn('Supabase songs fetch warning:', error.message);
      return [];
    }
    return data as Song[];
  } catch (err) {
    console.error('Failed to fetch songs from Supabase:', err);
    return [];
  }
}

/**
 * Fetch all songs matching a specific release from Supabase table 'songs'.
 * Tries filtering by release_id first (server-side), then falls back to album title matching.
 */
export async function fetchSongsForAlbum(releaseId: string, albumTitle?: string): Promise<Song[]> {
  try {
    // First, try a direct server-side filter on release_id (most reliable)
    if (releaseId) {
      const { data: byReleaseId, error: releaseError } = await supabase
        .from('songs_official')
        .select('*')
        .eq('release_id', releaseId);

      if (!releaseError && byReleaseId && byReleaseId.length > 0) {
        return byReleaseId as Song[];
      }
    }

    // Fallback: fetch all songs and filter client-side by album title or release_id
    const matchTarget = albumTitle || releaseId;
    const { data, error } = await supabase
      .from('songs_official')
      .select('*');
    
    if (error || !data || data.length === 0) {
      return [];
    }

    const normTarget = matchTarget.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
    const filtered = (data as Song[]).filter(s => {
      // Match by release_id field on the song
      if (s.release_id) {
        const normReleaseId = s.release_id.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
        if (normReleaseId === releaseId.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '')) return true;
      }
      // Match by album title
      if (!s.album) return false;
      const normAlbum = s.album.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
      return normAlbum === normTarget || normAlbum.includes(normTarget) || normTarget.includes(normAlbum);
    });

    return filtered;
  } catch (err) {
    console.error('Failed to fetch songs for album from Supabase:', err);
    return [];
  }
}

/**
 * Fetch lyrics from Supabase table 'lyrics_bank' matching the given song_id.
 */
export async function fetchLyricsForSong(songId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('lyrics_bank')
      .select('*')
      .ilike('song_id', `%${songId}%`);
    
    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase lyrics fetch warning:', error.message);
      return null;
    }
    
    const target = songId.toUpperCase().trim();
    const matched = data.find(item => {
      if (!item.song_id) return false;
      const ids = item.song_id.toUpperCase().split(',').map((s: string) => s.trim());
      return ids.includes(target);
    });
    
    return matched || null;
  } catch (err) {
    console.error('Failed to fetch lyrics from Supabase:', err);
    return null;
  }
}