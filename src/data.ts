import { Album, RecommendationPackage, CrowAccident } from './types';

export const ALBUMS: Album[] = [
  {
    id: 'na-koite-pari',
    title: 'Na Koite Pari - Na Shoite Pari',
    year: '2025',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_Na%20Koite%20Pari%20-%20Na%20Shoite%20Pari.jpg',
    description: 'A study on silent grief, lingering echoes, and things left unuttered. Recorded over seven sleepless autumn nights on a single cassette recorder in a quiet Dhaka suburb.',
    tracks: [
      'Na Koite Pari (Intro)',
      'Na Shoite Pari',
      'Uronchandi',
      'The Dust of Old Verandahs',
      'Aakash Bhanga Brishti',
      'Silent Letters on Wood'
    ],
    journalExcerpt: 'October 12. There is a specific quality to the silence of Dhaka at 3 AM. It doesn\'t feel like the absence of sound, but rather like the gathering of every word we decided not to say during the day. This record is made from those gathered things.'
  },
  {
    id: 'dinkal-ajkal',
    title: 'Dinkal Ajkal',
    year: '2024',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_Dinkal%20Ajkal.jpg',
    description: 'An observation of changing times, disappearing landmarks, and the heavy passage of youth. Musically expansive, integrating traditional instruments with weathered electronic drone.',
    tracks: [
      'Dinkal Ajkal',
      'Shayor',
      'Passing Through Sadarghat',
      'Smritir Minar',
      'Bhashman',
      'Dinkal (Reprise)'
    ],
    journalExcerpt: 'April 4. The old teahouse by the railway line was demolished yesterday. I sat across the street and watched. I realized that cities change exactly like faces do—incrementally, until you look one day and realize the person you knew is entirely gone.'
  },
  {
    id: 'karagarer-gaan',
    title: 'Karagarer Gaan',
    year: '2023',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_Karagarer%20Gaan.jpg',
    description: 'Literally translating to "Songs from Prison", this release gathers historical resistance songs, poems of captivity, and acoustic re-interpretations of freedom ballads.',
    tracks: [
      'Mukti',
      'Karagarer Chithi',
      'The Cell Wall Whistle',
      'Bandi',
      'Shokun',
      'Shorolpoth'
    ],
    journalExcerpt: 'January 19. Captivity has its own rhythm. The constant dripping of water, the uniform spacing of footfalls in the corridor. When you have nothing, you find melody in the friction of survival.'
  },
  {
    id: 'raw-vol-1',
    title: 'Kaaktaal Raw Volume 01',
    year: '2021',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_KaaktaalRaw%20Volume%2001.jpg',
    description: 'The foundation. Extremely raw four-track tapes, ambient apartment noise, and half-remembered melodies hummed while walking in the rain.',
    tracks: [
      'Borshar Gaan',
      'Kheyali',
      'Acoustic Sketch 09',
      'Chaya',
      'Distant Whistle & Rain'
    ],
    journalExcerpt: 'July 15. The microphone captured the entire thunderstorm outside my window. I chose not to filter it. The weather is as much a member of the band as we are.'
  },
  {
    id: 'raw-vol-2',
    title: 'Kaaktaal Raw Volume 02',
    year: '2021',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_Kaaktaal%20Raw%20Volume%2002.jpg',
    description: 'Continuing the archival process. Features sparse nylon string guitars and early diary entries spoken over slow instrumental loops.',
    tracks: [
      'Chorabali',
      'Nisshongo',
      'Tape Loop #4',
      'Shunnota',
      'The Crow\'s Monologue'
    ],
    journalExcerpt: 'September 22. A friend asked if we would ever record in a professional studio. I told them no. Studio walls are too clean. They don\'t have memories. Tapes recorded in a bedroom carry the dust of a real life.'
  },
  {
    id: 'raw-vol-3',
    title: 'Kaaktaal Raw Volume 03',
    year: '2022',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_KaaktaalRaw%20Volume%2003.jpg',
    description: 'Deepening into folk-minimalism. Sparse arrangements focusing heavily on the lyricism of the soil, water, and shifting skylines.',
    tracks: [
      'Bhatiyali Mood',
      'Shorot',
      'Nodir Kotha',
      'Proshno',
      'Eka'
    ],
    journalExcerpt: 'November 8. Water has a memory. If you listen closely to the river, it sings the exact same melodies that were sung a thousand years ago. We are just transcribing them.'
  },
  {
    id: 'raw-vol-4',
    title: 'Kaaktaal Raw, Vol. 4 (Version 01)',
    year: '2022',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_KaaktaalRaw%2C%20Vol.%204%20(Version%2001).jpg',
    description: 'An experimental divergence. Focuses on physical space, containing recordings made in abandoned railway stations and empty corridors.',
    tracks: [
      'Station Platform',
      'Shunno Station',
      'Protiddhoni',
      'Ondhokarer Gaan',
      'Midnight Echoes'
    ],
    journalExcerpt: 'February 3. Sound is shaped by what it bounces off of. A high-ceilinged stone railway hall adds a cathedral-like sacredness to a simple steel-string slide.'
  },
  {
    id: 'raw-vol-5',
    title: 'Kaaktaal Raw Volume 05',
    year: '2023',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_KaaktaalRaw%20Volume%2005.jpg',
    description: 'Written during a period of prolonged isolation. A quiet collection of lullabies for restless minds and people who cannot sleep.',
    tracks: [
      'Ghumer Gaan',
      'Nishachor',
      'Sleep Sketch 1',
      'Phire Asha',
      'Bhorer Alo'
    ],
    journalExcerpt: 'August 14. This is for the ones who lie awake listening to the fan spin. I wanted to make music that feels like a hand on your forehead when the night gets too long.'
  },
  {
    id: 'raw-vol-6',
    title: 'Kaaktaal Raw Volume 06',
    year: '2024',
    coverUrl: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_KaaktaalRaw%20Volume%2006.jpg',
    description: 'The latest chapter of raw documentation. Reflective, deeply melodic, and embracing the cracks and hiss of imperfect tape machinery.',
    tracks: [
      'Shesh Kotha',
      'The Hiss of Tape',
      'Sritir Chaya',
      'Pothik',
      'Smritir Ghor (Outro)'
    ],
    journalExcerpt: 'December 28. It is the imperfections that make things human. The crackle on the tape is not a flaw; it is the sound of time passing through the copper wire. We leave the doors open so the world can leak in.'
  }
];

export const PORTAL_QUESTIONS = [
  {
    id: 'q1',
    text: 'What does today sound like to you?',
    options: [
      { text: 'Rain on a tin roof', value: 'rain' },
      { text: 'A silent crowded street', value: 'crowd' },
      { text: 'Ceiling fan hum at 3 AM', value: 'fan' },
      { text: 'Leaves scratching on glass', value: 'leaves' }
    ]
  },
  {
    id: 'q2',
    text: 'What are you carrying that needs to be laid down?',
    options: [
      { text: 'An unsent letter', value: 'letter' },
      { text: 'A fading city weight', value: 'city' },
      { text: 'A quiet, recurring daydream', value: 'daydream' },
      { text: 'The tiredness of being seen', value: 'tiredness' }
    ]
  },
  {
    id: 'q3',
    text: 'If you were a room in this house, where would you sit?',
    options: [
      { text: 'By the rain-streaked window', value: 'window' },
      { text: 'In the quiet dark corner', value: 'corner' },
      { text: 'On cold entrance marble steps', value: 'steps' },
      { text: 'In the box-filled dusty attic', value: 'attic' }
    ]
  }
];

export const PORTAL_RECOMMENDATIONS: Record<string, RecommendationPackage> = {
  rain: {
    song: {
      title: 'Dekh Kemon Lage',
      album: 'Na Koite Pari-Na Shoite Pari',
      description: 'This track features Ammajaner Polapan. New release but the song is really pretty old.'
    },
    journal: {
      title: 'Water and Clay',
      excerpt: 'The soil remembers every drop. We think we are walking on mud, but we are walking on history that has been softened by the sky.',
      date: 'July 18, 2024'
    },
    story: {
      title: 'The Tin Roof Symphony',
      text: 'In the village, the rain had a voice. On tin roofs, it was sharp and industrial; on banana leaves, soft and rhythmic. To sleep under a tin roof in July was to be serenaded by a grand, chaotic orchestra.'
    },
    artwork: {
      title: 'Sunset Bandphoto',
      url: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/sunset%20bandphoto.jpg',
      artist: 'Archival Photo'
    },
    quote: {
      text: 'Some people feel the rain. Others just get wet.',
      author: 'Unknown'
    }
  },
  crowd: {
    song: {
      title: 'Neel Shohore Brishti',
      album: 'Karagarer Gaan',
      description: 'Song that were released from Dhaka Central Jail.'
    },
    journal: {
      title: 'The Solitude of Millions',
      excerpt: 'You can be more alone in a crowd of five million than in an empty desert. The desert does not ignore you; the crowd actively replaces you.',
      date: 'March 11, 2025'
    },
    story: {
      title: 'The Man with the Accordion',
      text: 'At the ferry terminal, amid the shouting of coolies and the horn of launches, there was a blind man playing a three-key accordion. Nobody stopped. But the metal of his instrument was the only thing that didn\'t smell of diesel or sweat.'
    },
    artwork: {
      title: 'Band Photo (Aia)',
      url: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/bandphoto%20aia.jpg',
      artist: ''
    },
    quote: {
      text: 'The city is not a concrete place. It is a map of intersecting tragedies and quiet hopes.',
      author: 'Notebook Entry'
    }
  },
  fan: {
    song: {
      title: 'Joratali',
      album: 'Kaaktaal Raw Volume 05',
      description: 'Joratali diye banano gaan?'
    },
    journal: {
      title: 'The Nocturnal Watch',
      excerpt: 'At 3 AM, the world is yours. There is no email, no expectation, no judgment. Just you, the spinning fan, and the truth you avoid during daylight.',
      date: 'August 15, 2023'
    },
    story: {
      title: 'The Ceiling Fan Orbit',
      text: 'He counted the rotations. It was seventy-two per minute on the medium setting. In three hours of sleeplessness, that was nearly thirteen thousand orbits. A quiet, stationary journey across the ceiling.'
    },
    artwork: {
      title: 'Grey Atmosphere',
      url: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/greyyyyy.jpg',
      artist: 'Atmospheric Capture'
    },
    quote: {
      text: 'In the middle of the night, the clock is not ticking. It is breathing.',
      author: 'Scratched into a desk'
    }
  },
  leaves: {
    song: {
      title: 'Shesh Kotha',
      album: 'Kaaktaal Raw Volume 06',
      description: 'An acoustic farewell track focusing on the beauty of decay and letting go.'
    },
    journal: {
      title: 'The Art of Disintegrating',
      excerpt: 'Leaves do not cry when they fall. They dance. They turn amber, brown, and gold, putting on their most beautiful clothes right before they return to the earth.',
      date: 'November 30, 2024'
    },
    story: {
      title: 'The Dried Leaf Archive',
      text: 'In the margins of his grandfather\'s books, there were hundreds of pressed leaves. Some were from oak, some from jackfruit trees. No notes. Just the skeleton of a leaf, capturing a specific Tuesday in 1964.'
    },
    artwork: {
      title: 'Old Bandphoto',
      url: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/old%20bandphoto.jpg',
      artist: 'Found Film'
    },
    quote: {
      text: 'All things that are beautiful are beautiful because they are fleeting.',
      author: 'Leaves of Wood'
    }
  }
};

export const MOCK_JOURNAL = {
  date: 'Friday, July 3, 2026',
  title: 'The Weight of Quiet Verandahs',
  content: `We have been thinking about the spaces that exist between things. Not the notes, but the silence that holds them together. Lately, Dhaka has been breathing differently; the summer heat sits heavily on red-brick walls. We sat on the verandah with a broken microphone and a guitar that refused to stay in tune, letting the tape roll. Some things belong in the archive simply because they happened to be there.`
};

export const CROW_ACCIDENTS: CrowAccident[] = [
  {
    id: 'crow-song-1',
    type: 'song',
    title: 'Na Shoite Pari',
    content: 'A study on silent grief, lingering echoes, and things left unuttered. Recorded over seven sleepless autumn nights on a single cassette recorder in a quiet Dhaka suburb.',
    subtext: 'Album: Na Koite Pari - Na Shoite Pari (2025)',
    image: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_Na%20Koite%20Pari%20-%20Na%20Shoite%20Pari.jpg',
    metadata: 'Fidelity: 128kbps Cassette Rip // Key: Drop D'
  },
  {
    id: 'crow-lyric-1',
    type: 'lyric',
    title: 'A Stray Line from Borshar Gaan',
    content: '“The rain does not wash away the memories; it merely makes them heavier to carry.”',
    bengali: '“বৃষ্টি স্মৃতি মুছে দেয় না, কেবল বহন করাটা আরো ভারী করে তোলে।”',
    subtext: 'Song: Borshar Gaan // Kaaktaal Raw Volume 01',
    metadata: 'Written in a ledger under candlelight during the 2021 monsoon.'
  },
  {
    id: 'crow-story-1',
    type: 'story',
    title: 'The Sunset at Sadarghat',
    content: 'While recording the field track for "Passing Through Sadarghat", we sat on a rusted metal launch at sunset. The engine vibrations blended perfectly with our acoustic slide guitar. A kid selling spiced tea sat next to us, humming a completely different tune in a different key. That clashing duality is the essence of Dhaka.',
    subtext: 'Band Lore // Dhaka, April 2024',
    metadata: 'Source: Recorded porch conversation logs // Tape Reel 4'
  },
  {
    id: 'crow-artwork-1',
    type: 'artwork',
    title: 'Karagarer Gaan Block Print',
    content: 'The original hand-carved woodblock print created for the Karagarer Gaan sleeve. It depicts the heavy iron doors of a historical prison, softened by overgrown creepers.',
    subtext: 'Artwork by Kaaktaal Archive',
    image: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_Karagarer%20Gaan.jpg',
    metadata: 'Medium: Indigo Block Ink on Hand-made Jute Paper'
  },
  {
    id: 'crow-journal-1',
    type: 'journal',
    title: 'The Solitude of Millions',
    content: 'You can be more alone in a crowd of five million than in an empty desert. The desert does not ignore you; the crowd actively replaces you. In the margins of our notebook, we sketched the face of a passenger who sat across from us on the ferry. He had the eyes of someone who hadn\'t spoken in a week.',
    subtext: 'Notebook Entry // March 11, 2025',
    metadata: 'Written on a weathered notepad on the Sadarghat-Barisal Route'
  },
  {
    id: 'crow-memory-1',
    type: 'memory',
    title: 'Under the Dim Amber Bulb',
    content: 'Our very first intimate gig in Chittagong. There was a sudden power cut mid-song, but the audience didn\'t move or shout. We lit three candles, sat cross-legged on the floor, and sang "Chorabali" entirely unplugged. The sound of sixty people breathing, humming, and singing together in a completely dark room felt like a sacred circle.',
    subtext: 'Live Show Archive // Chittagong, October 2022',
    metadata: 'Atmosphere: Smoke-filled room // Candlelight decay'
  },
  {
    id: 'crow-unpublished-1',
    type: 'unpublished',
    title: 'The Dust of Old Verandahs',
    content: 'A skeletal, unreleased guitar piece we recorded on a vintage tape loop. It features nothing but a repeated acoustic phrase and the dry sound of banyan leaves scratching against the porch window.',
    subtext: 'Status: Unreleased // Expected 2027',
    metadata: 'Recorded in a drafty bedroom with a single ribbon microphone'
  },
  {
    id: 'crow-interpretation-1',
    type: 'interpretation',
    title: 'The Avian Conspiracy',
    content: 'A listener once sent us an elaborate 3,000-word handwritten letter explaining that our song "Shokun" (Vulture) was actually a secret cryptographic guide to hidden bird-watching coordinates in the Sundarbans. In reality, we wrote it about the heavy, suffocating silence that settles in a room after an argument.',
    subtext: 'Fan Interpretations // Vault Log #89',
    metadata: 'Original intent: Emotional friction // Misinterpreted as: Ornithological maps'
  },
  {
    id: 'crow-question-1',
    type: 'question',
    title: 'An Inquiry for the Restless',
    content: 'If your current state of mind were a sound leaking through a cracked wooden window pane, what frequency would it carry?',
    subtext: 'A Question from Kaaktaal',
    metadata: 'Reflect in silence or listen to the tape hum'
  }
];
