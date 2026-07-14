export interface SongVersion {
  year: string;
  title: string;
  type: 'Demo' | 'Studio' | 'Live' | 'Acoustic' | 'Unreleased' | 'Draft';
  description: string;
  optionalNote?: string;
  photoUrl?: string; // photo placeholder
  audioUrl?: string; // audio placeholder
}

export const SONG_VERSIONS_DATA: Record<string, SongVersion[]> = {
  'chorki': [
    {
      year: '2018',
      title: 'First Tune (Dhanmondi Porch)',
      type: 'Draft',
      description: 'Hummed into a phone voice note with an out-of-tune acoustic guitar on a humid August afternoon. The lyrics were only three lines long, repeating like a mantra.',
      optionalNote: 'This version still believed the song was about love.',
      photoUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2020',
      title: 'The Clay Pot Recording',
      type: 'Demo',
      description: 'Recorded inside a hollow clay pot to capture a raw, ancient acoustic echo. The tape loop hiss was left completely unfiltered to merge with the heavy air.',
      optionalNote: 'The clay pot cracked on the final chord, which remains preserved on the tape.',
      photoUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2022',
      title: 'Sadarghat Terminal Session',
      type: 'Live',
      description: 'An impromptu live performance on the roof of a departing ferry, blending acoustic strumming with the churning engines and distant whistles of the launch terminal.',
      photoUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2024',
      title: 'Studio Silhouette Re-take',
      type: 'Studio',
      description: 'Pressed onto 1/4-inch tape at a local Dhaka radio studio. Features a heavy electronic drone, creating a haunting, panoramic ambient space around the vocals.',
      optionalNote: 'This is where the song learned that some things can never return home.',
      photoUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60'
    }
  ],
  'na-shoite-pari': [
    {
      year: '2019',
      title: 'The Red-Brick Outline',
      type: 'Draft',
      description: 'Played on a single steel-string guitar on the roof of an old red-brick building in Chittagong. Features raw humming and birds scattering at dusk.',
      optionalNote: 'The draft was recorded on a microcassette that had already been recorded over three times.',
      photoUrl: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2021',
      title: 'The Jailhouse Whistle',
      type: 'Unreleased',
      description: 'An acoustic outline featuring a heavy, distant iron-door echo and rhythmic whistling that acts as the primary backbeat.',
      optionalNote: 'Recorded in a concrete high-ceiling hallway, capturing the heavy sense of confinement.',
      photoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2023',
      title: 'Official Studio Pressing',
      type: 'Studio',
      description: 'Featured on the album "Na Koite Pari - Na Shoite Pari". Recorded in complete isolation over seven sleepless nights on a vintage tape desk.',
      photoUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2025',
      title: 'Unplugged Candlelight Session',
      type: 'Acoustic',
      description: 'Performed with the lights turned off, utilizing only three candles and sixty people humming in unison. The room became an acoustic resonator.',
      optionalNote: 'This version still believed the song was about forgiveness.',
      photoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60'
    }
  ],
  'abbar-dekha-hole': [
    {
      year: '2018',
      title: 'First Tune (Acoustic Draft)',
      type: 'Draft',
      description: 'A sparse outline written on the back of a grocery receipt. The melody was originally structured as an ancient Bhatiyali boatman song.',
      optionalNote: 'This version was much faster, carrying a false sense of hope.',
      photoUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2020',
      title: 'The Jail Version',
      type: 'Unreleased',
      description: 'Hummed by the band members while listening to rain dripping from a leaky roof. The sparse notes carry a heavy, hollow resonance.',
      optionalNote: 'This version recognized that some rooms have no doors.',
      photoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2021',
      title: 'Chittagong Live Session',
      type: 'Live',
      description: 'Played in front of an intimate gathering of forty people. The audio is colored by the sound of heavy monsoon rain outside crashing on banyan trees.',
      photoUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2022',
      title: 'Studio Silhouette Pressing',
      type: 'Studio',
      description: 'The definitive, full studio recording with layered tape loops and a low, resonant contrabass drone anchoring the bittersweet vocals.',
      photoUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60'
    },
    {
      year: '2023',
      title: 'Bedroom Acoustic Revision',
      type: 'Acoustic',
      description: 'Stripped down entirely to a single nylon-string guitar and a weathered voice. No post-processing, no studio tricks, just pure tape hiss.',
      optionalNote: 'This version realized the song was actually about the silence left behind.',
      photoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60'
    }
  ]
};

export const DEFAULT_VERSIONS: SongVersion[] = [
  {
    year: '2019',
    title: 'Bedroom Tape Scratch',
    type: 'Draft',
    description: 'First demo sketch recorded on a vintage portable cassette player. The melody is loose, featuring several unfinished chord changes.',
    optionalNote: 'The lyrics were written in pencil in the margins of an old history notebook.',
    photoUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=60'
  },
  {
    year: '2021',
    title: 'Live Verandah Outline',
    type: 'Live',
    description: 'Captured on a single field microphone during a monsoon gathering. The ambient sound of rain dripping from tin sheets shapes the entire atmosphere.',
    photoUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=60'
  },
  {
    year: '2023',
    title: 'Definitive Album Version',
    type: 'Studio',
    description: 'The officially pressed track, balancing sparse acoustic guitars with vintage tape loop degradation and ambient noise overlays.',
    optionalNote: 'This is where the song found its final, permanent shape.',
    photoUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60'
  },
  {
    year: '2025',
    title: 'Late Night Acoustic Reprise',
    type: 'Acoustic',
    description: 'Recorded directly to cassette at 3 AM. Completely stripped down to a single vocal track and a delicate fingerstyle pattern.',
    optionalNote: 'Played under the dim hum of a ceiling fan in complete solitude.',
    photoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60'
  }
];

export function getSongVersions(songIdOrTitle?: string): SongVersion[] {
  if (!songIdOrTitle || typeof songIdOrTitle !== 'string') {
    return DEFAULT_VERSIONS;
  }
  const normKey = songIdOrTitle.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
  
  for (const [key, versions] of Object.entries(SONG_VERSIONS_DATA)) {
    if (normKey.includes(key) || key.includes(normKey)) {
      return versions;
    }
  }
  return DEFAULT_VERSIONS;
}
