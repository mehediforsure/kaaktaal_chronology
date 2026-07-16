export type ActiveRoom = 
  | 'home' 
  | 'portal' 
  | 'music' 
  | 'finder' 
  | 'memory' 
  | 'map' 
  | 'accident';

export type FinderTab = 'seek' | 'music' | 'map' | 'few-far';

export interface Album {
  release_id: string;
  title: string;
  release_date?: string;
  year: string;
  cover_image: string;
  spotify_url?: string;
  description_short: string;
  description_long?: string;
  tracks: string[];
}

export interface Song {
  song_id: string;
  title_en: string;
  title_bn?: string;
  release_id?: string;
  album?: string;
  duration?: string;
  year_released?: string | number;
  cover_image?: string;
  youtube_url?: string;
  spotify_url?: string;
  description_short?: string;
  description_long?: string;
  lyrics_available?: boolean;
  status?: string;
  lyrics?: string;
}

export interface RecommendationPackage {
  song: {
    title: string;
    album: string;
    description: string;
  };
  journal: {
    title: string;
    excerpt: string;
    date: string;
  };
  story: {
    title: string;
    text: string;
  };
  artwork: {
    title: string;
    url: string;
    artist: string;
  };
  quote: {
    text: string;
    author: string;
  };
}

export interface CrowAccident {
  id: string;
  type: 'song' | 'lyric' | 'story' | 'artwork' | 'journal' | 'memory' | 'unpublished' | 'interpretation' | 'question';
  title: string;
  content: string;
  subtext?: string;
  image?: string;
  bengali?: string;
  metadata?: string;
}

// ========================================================
// Engagement System Types (Extensible for future-proofing)
// ========================================================

export interface EngagementState {
  timeSpent: number; // total time spent in seconds
  visitedRooms: string[]; // unique rooms visited
  songsOpened: number; // total songs or albums opened/previewed
  journalInteractions: number; // play/stop atmosphere clicks
  finderUsage: number; // finder question clicks
  mapClicks: number; // map node clicks
  globalClicks: number; // overall total clicks
}

export type EngagementAction = 
  | 'time_tick'
  | 'visit_room'
  | 'song_opened'
  | 'journal_interaction'
  | 'finder_usage'
  | 'map_click'
  | 'global_click';

export interface UnlockableExperience {
  id: string;
  name: string;
  evaluate: (state: EngagementState) => boolean;
}
