export interface BorrowedMeaning {
  id: string;
  songTitle: string;
  fromName: string;
  isAnonymous: boolean;
  city: string;
  input: string;
  date: string;
  questionAsked?: string;
}

export const RANDOM_QUESTIONS: string[] = [
  "What does this song remind you of?",
  "Did this song find you at a particular time?",
  "What do you think of when you hear this song?",
  "Did this song stay with you somehow?",
  "Is there a memory attached to this song?",
  "What lives inside this song for you?",
  "Where does this song take you?",
  "What did you find in this song?",
  "Leave a memory with this song.",
  "Tell us about your relationship with this song."
];

export const DEFAULT_MEANINGS: BorrowedMeaning[] = [
  {
    id: 'mean-1',
    songTitle: 'আবার দেখা হলে (Abbar Dekha Hole)',
    fromName: 'Anonymous',
    isAnonymous: true,
    city: 'Chittagong',
    input: 'I thought this was a love song. Then my father died. Now it means something else entirely. It feels like standing on an empty shore watching the last boat pull away into the dusk.',
    date: '2026-05-12'
  },
  {
    id: 'mean-2',
    songTitle: 'চর্কি (Chorki)',
    fromName: 'Joyee',
    isAnonymous: false,
    city: 'Dhaka',
    input: 'This song found me in the winter of 2020 when the streets of Dhaka were completely silent. The line “বাড়তে দাও বুনো ঝোপের মতোন করে” became my anchor during months of isolation. It reminded me that growth is often quiet and messy.',
    date: '2026-06-02'
  },
  {
    id: 'mean-3',
    songTitle: 'Na Shoite Pari',
    fromName: 'Tahmid',
    isAnonymous: false,
    city: 'Sylhet',
    input: 'When I hear the slide guitar at the beginning, I am instantly transported back to my grandmother’s house during monsoon. We would sit on the verandah, watching the mud puddles form. The cassette recorder hiss in the track is the exact same texture as the rain hitting the banyan tree.',
    date: '2026-07-01'
  },
  {
    id: 'mean-4',
    songTitle: 'Dinkal Ajkal',
    fromName: 'Anonymous',
    isAnonymous: true,
    city: 'Rajshahi',
    input: 'This song feels like walking through Sadarghat terminal in the fading light. Everyone is rushing somewhere, yet there is a deep, collective weight of moving. It reminds me of the friends I left behind when I moved out of the city.',
    date: '2026-06-25'
  },
  {
    id: 'mean-5',
    songTitle: 'Uronchandi',
    fromName: 'Samiha',
    isAnonymous: false,
    city: 'Khulna',
    input: 'I listened to this on loop during a twelve-hour bus journey. The acoustic rhythm matched the constant vibration of the seats. It made the entire landscape look like a slow-motion film about leaving home.',
    date: '2026-04-18'
  },
  {
    id: 'mean-6',
    songTitle: 'Ghumer Gaan',
    fromName: 'Anonymous',
    isAnonymous: true,
    city: 'Barisal',
    input: 'A perfect lullaby for people who cannot sleep. I have an old ceiling fan that clicks in the exact same rhythm as the percussion in this track. It feels like the song was recorded right here in my room.',
    date: '2026-07-05'
  }
];

export function getBorrowedMeaningsForSong(songTitle?: string): BorrowedMeaning[] {
  if (!songTitle || typeof songTitle !== 'string') {
    return DEFAULT_MEANINGS;
  }
  // Load from local storage if exists, otherwise use defaults
  let stored: BorrowedMeaning[] = [];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem('kaaktaal_borrowed_meanings');
      if (raw) {
        stored = JSON.parse(raw);
      }
    }
  } catch (e) {
    console.error("Failed to load borrowed meanings", e);
  }

  const all = [...stored, ...DEFAULT_MEANINGS];
  
  // Return meanings that match the song title (case insensitive, partial match)
  const normTitle = songTitle.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
  return all.filter(m => {
    if (!m.songTitle) return false;
    const mNorm = m.songTitle.toLowerCase().trim().replace(/[\s\(\)\-\.]/g, '');
    return mNorm === normTitle || mNorm.includes(normTitle) || normTitle.includes(mNorm);
  });
}

export function saveBorrowedMeaning(meaning: Omit<BorrowedMeaning, 'id' | 'date'>): BorrowedMeaning {
  const newMeaning: BorrowedMeaning = {
    ...meaning,
    id: 'mean-' + Date.now(),
    date: new Date().toISOString().split('T')[0]
  };

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem('kaaktaal_borrowed_meanings');
      const stored: BorrowedMeaning[] = raw ? JSON.parse(raw) : [];
      stored.unshift(newMeaning); // add to top
      localStorage.setItem('kaaktaal_borrowed_meanings', JSON.stringify(stored));
    }
  } catch (e) {
    console.error("Failed to save borrowed meaning", e);
  }

  return newMeaning;
}
