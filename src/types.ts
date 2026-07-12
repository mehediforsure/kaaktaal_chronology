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
  id: string;
  title: string;
  year: string;
  coverUrl: string;
  description: string;
  tracks: string[];
  journalExcerpt?: string;
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
}

export type EngagementAction = 
  | 'time_tick'
  | 'visit_room'
  | 'song_opened'
  | 'journal_interaction'
  | 'finder_usage'
  | 'map_click';

export interface UnlockableExperience {
  id: string;
  name: string;
  evaluate: (state: EngagementState) => boolean;
}
