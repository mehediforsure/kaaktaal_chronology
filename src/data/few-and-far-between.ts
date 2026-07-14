export interface CuratedSong {
  song_id?: string;
  title_en?: string;
  title_bn?: string;
  album: string;
  duration?: string;
  year_released?: string;
  cover_image?: string;
  youtube_url?: string;
  spotify_url?: string;
  lyrics_available?: boolean;
  status?: string;
  description_short?: string;
  description_long?: string;
  lyrics?: string;
  
  // Legacy fallback compatibility keys
  id?: string;
  title?: string;
  reason?: string;
  story?: string;
}

export interface CuratedCollection {
  id: string;
  title: string;
  description: string;
  songCount: number;
  coverUrl: string;
  songs: CuratedSong[];
}

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'attic-reels',
    title: 'One',
    description: 'Unreleased four-track cassette recordings discovered inside dusty wooden crates. These tracks capture raw moments of bedroom resonance before the polish of studio walls.',
    songCount: 4,
    coverUrl: '',
    songs: [
      {
        song_id: 'chorki',
        title_en: 'Chorki',
        title_bn: 'চর্কি',
        album: 'The Attic Reels // Tape Loop 03',
        duration: '03:45',
        year_released: '2024',
        cover_image: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_Kaaktaal%20Raw%20Volume%2002.jpg',
        youtube_url: 'https://youtube.com/watch?v=chorki_example',
        spotify_url: 'https://open.spotify.com/track/chorki_example',
        lyrics_available: true,
        status: 'Released',
        description_short: '“বাড়তে দাও বুনো ঝোপের মতোন করে”',
        description_long: 'Recorded in the summer of 2019 on a vintage Sony TCM-200DV tape recorder. The microphone was placed inside a hollow earthenware pot to create a deep, claustrophobic reverb. The sound of banyan leaves scraping against the windowpane is audible in the background.',
        lyrics: `বাড়তে দাও বুনো ঝোঁপের মতোন করে
শুকিয়ে যেতে দাও ফুল যেমন ঝরে
গভীর হতে দাও আমার গভীরে
রাতের সাথে অন্ধকার যেমন বাড়ে।`
      },
      {
        song_id: 'verandah-draft',
        title_en: 'The Dust of Old Verandahs',
        album: 'Unreleased Draft // 2021',
        duration: '04:12',
        year_released: '2021',
        cover_image: 'https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/Cover_KaaktaalRaw%20Volume%2001.jpg',
        spotify_url: 'https://open.spotify.com/track/verandah_example',
        lyrics_available: true,
        status: 'Unreleased',
        description_short: '“A study on what remains after everything is swept away.”',
        description_long: 'This piece was played entirely on a vintage zinc-resonator slide guitar. It was recorded in a single take during a power outage in Dhanmondi. The rhythmic creaking of an antique rocking chair acts as the only percussion.',
        lyrics: `The wind is sweeping the dust
Of old verandahs we used to trust.
A cup of tea turned cold and grey,
Nothing more remains to say.

Step light on the worn-out tile,
We haven't met in a long, long while.
Let the shadows stretch their hands,
Over these forgotten lands.`
      },
      {
        song_id: 'silent-letters',
        title_en: 'Silent Letters on Wood',
        title_bn: 'কাঠের বুকে নাম',
        album: 'The Attic Reels // Box 02',
        duration: '02:50',
        year_released: '2022',
        lyrics_available: true,
        status: 'Archived',
        description_short: '“Words carved into school desks that never reached their destination.”',
        description_long: 'A minimalist acoustic loop played on a detuned nylon string guitar. It features whispers recorded by the band members while reading through old postcards from the 1970s found at a flea market.',
        lyrics: `কাঠের বুকে খোদাই করা নাম,
ফেরত এসেছে না পাঠানো খাম।
অক্ষরেরা স্তব্ধ হয়ে আছে,
শুকনো পাতার মতন মরা গাছে।

তুমি তো বোঝোনি নিরবতার মানে,
যে সুর হারিয়ে যায় ধুলোবালি গানে।`
      },
      {
        song_id: 'rain-sketch',
        title_en: 'Aakash Bhanga Brishti',
        title_bn: 'আকাশ ভেঙে বৃষ্টি',
        album: 'Room Recordings // Vol. 1',
        duration: '05:04',
        year_released: '2022',
        lyrics_available: true,
        status: 'Released',
        description_short: '“A tribute to the sudden fury of a July afternoon.”',
        description_long: 'Recorded by placing a stereo pair of microphones on a covered balcony during the height of the 2022 monsoon. The guitar is tuned to Open D, allowed to drone continuously under the downpour.',
        lyrics: `আকাশ ভেঙে নামুক ধারা,
পথ ভুলে যাক পথিক দিশাহারা।
মেঘের গর্জনে কেঁপে উঠুক বুক,
বৃষ্টি ধুয়ে দিক চেনা সব মুখ।

আমরা তো ভিজেছিলাম এক সাথে,
আজ একা দাঁড়িয়ে শূন্য এই রাতে।`
      }
    ]
  },
  {
    id: 'midnight-broadcasts',
    title: 'Two',
    description: 'Songs quietly played once on community radio at 4 AM and never officially pressed. Preserved only through sketchy listener-recorded tape loops.',
    songCount: 3,
    coverUrl: '',
    songs: [
      {
        id: 'radio-echo',
        title: '৪টা ১০-এর ইথার (Ether of 4:10)',
        reason: '“A frequency meant only for the sleepless and the departed.”',
        album: 'FM Archives // Bootleg #11',
        duration: '3:15',
        lyrics: `ইথারে ভেসে আসে চেনা সেই গান,
ঘুমহীন চোখে জাগে স্মৃতির তুফান।
৪টা ১০ মিনিটে যখন নিভে যায় বাতি,
রেдиоর কাঁটা যেন একলা পথের সাথী।

তুমি কি শুনছ সেই যান্ত্রিক স্বর?
যা ভেঙে দিয়ে যায় সাজানো এ ঘর।`,
        story: 'Broadcasted live on an independent radio station in Chittagong during a late-night takeover session. Only three people are believed to have recorded the live signal.'
      },
      {
        id: 'sleepless-fan',
        title: 'The Ceiling Fan Whistle',
        reason: '“The rhythm of endless rotations and heavy thoughts.”',
        album: 'FM Archives // Loop Tape',
        duration: '4:40',
        lyrics: `Endless orbit of the rusted steel,
More than any heart should ever feel.
Count the clicks and count the spin,
Where does the quiet night begin?

Spinning slow, spinning fast,
Nothing of this night will last.`
      },
      {
        id: 'shokun-acoustic',
        title: 'Shokun (Acoustic Sketch)',
        reason: '“The original, raw skeleton of a song before it became a anthem of captivity.”',
        album: 'Radio Session // Dhaka 2023',
        duration: '3:55',
        lyrics: `শকুন উড়ে যায় মেঘের ওপর দিয়ে,
আমাদের বন্দি জীবনের গল্প নিয়ে।
কারাকক্ষের এই লোহার শিক গলিয়ে,
মন চলে যায় দূর দিগন্তে পালিয়ে।`
      }
    ]
  },
  {
    id: 'overlooked-whispers',
    title: 'Three',
    description: 'Tracks that slipped through the cracks of official releases, holding deep memories for those few who happened to hear them.',
    songCount: 3,
    coverUrl: '',
    songs: [
      {
        id: 'bhashman-demo',
        title: 'ভাসমান (Bhashman - Drift)',
        reason: '“Floating down the Buriganga with no anchor in sight.”',
        album: 'Dinkal Ajkal Outtake',
        duration: '4:22',
        lyrics: `জলের বুকে ভাসছে কুয়াশার চাদর,
ন নদী চেনে মানুষের শেষ অবাদর।
আমরা তো ভেসে যাই খড়কুটো ভেসে,
কোনো এক অজানা দেশের উদ্দেশ্যে।`
      },
      {
        id: 'chorabali-live',
        title: 'Chorabali (Candlelight Session)',
        reason: '“Recorded in complete darkness after a sudden Chittagong power outage.”',
        album: 'Live Bootlegs // 2022',
        duration: '5:10',
        lyrics: `চোরাবালির টানে তলিয়ে যাই ধীরে,
তুমি কি দাঁড়াবে এসে নদীর তীরে?
হাত বাড়িয়ে দাও যদি সময় থাকে,
স্মৃতিরা ধুয়ে যাক জোয়ারের ডাকে।`
      },
      {
        id: 'missing-station',
        title: 'Shunno Station (Acoustic)',
        reason: '“A tribute to empty platforms and trains that never stop.”',
        album: 'Railway Tapes // Vol 04',
        duration: '3:30',
        lyrics: `শূণ্য স্টেশনে একলা দাঁড়িয়ে থাকা,
টিকিট কাউন্টারে ধুলোর প্রলেপ মাখা।
বাঁশি বেজে ওঠে বহু দূরের বাঁকে,
কোনো যাত্রী নেই শুধু কুয়াশা ঢেকে রাখে।`
      }
    ]
  },
  {
    id: 'lost-verandah',
    title: 'Four',
    description: 'Acoustic drafts recorded under monsoon downpours on a single microphone, capturing the direct humidity of rural Bengal.',
    songCount: 3,
    coverUrl: '',
    songs: [
      {
        id: 'nodir-kotha-raw',
        title: 'নদীর কথা (Nodir Kotha - River Speaks)',
        reason: '“Water is the only true archivist. It remembers every song.”',
        album: 'Verandah Tapes // Vol 01',
        duration: '4:55',
        lyrics: `নদী বয়ে যায় নিজের খেয়ালে,
কত কথা লেখা মাটির দেয়াле।
জল ধুয়ে দেয় দুঃখের ইতিহাস,
মাটির বুকে জাগে নতুন বিশ্বাস।`
      },
      {
        id: 'kheyali-draft',
        title: 'খেয়ালী (Kheyali - Whimsical Draft)',
        reason: '“Hummed while watching crows assemble on electrical wires.”',
        album: 'Verandah Tapes // Vol 02',
        duration: '3:05',
        lyrics: `খেয়ালী হাওয়া বয়ে যায় বহুদূরে,
আমার একলা মন কান্দে কোনো সুরে।
কাঁটাতারে বসা একলা কালো কাক,
স্মৃতিদের ডেকে আনে তার করুণ ডাক।`
      },
      {
        id: 'shesh-kotha-raw',
        title: 'Shesh Kotha (Porch Acoustic)',
        reason: '“The quiet hum of the cricket choir blending with our final chords.”',
        album: 'Verandah Tapes // Vol 03',
        duration: '5:30',
        lyrics: `শেষ কথা বলা হয়নি তোমাকে,
মিলিয়ে গেছ তুমি পথের বাঁকে।
ঝিঝি পোকার গান বাজে চারিপাশে,
আমরা তো হারিয়ে যাই ইতিহাসের ঘাসে।`
      }
    ]
  },
  {
    id: 'unorganized-vault',
    title: 'Five',
    description: 'A silent vault containing yet unclassified tape frequencies, hums, and raw drafts recovered from forgotten reels.',
    songCount: 0,
    coverUrl: '',
    songs: []
  },
  {
    id: 'hidden-attic-notes',
    title: 'Six',
    description: 'Late-night humming and fragile tape drafts discovered at the back of old closets, waiting to be cataloged.',
    songCount: 2,
    coverUrl: '',
    songs: [
      {
        id: 'gopon-kotha',
        title: 'গোপন কথা (Gopon Kotha)',
        reason: '“A whisper that stayed in the cracks of the floorboards.”',
        album: 'Closet Drafts // Vol 01',
        duration: '3:15',
        lyrics: `বলা হয়নি কোনো কথা,
বুকের ভেতর জমল ব্যথা।
লুকিয়ে রাখা সেই খামে,
আজও তোমার সুর চিনে।`
      },
      {
        id: 'dur-shur',
        title: 'দূরের সুর (Durer Shur)',
        reason: '“Played softly as the streetlamps flickered outside.”',
        album: 'Closet Drafts // Vol 02',
        duration: '4:10',
        lyrics: `দূরের কোনো একলা গান,
জুড়িয়ে দেয় অবুঝ প্রাণ।
নিভে যাওয়া আলোর দেশে,
আমরা আবার আসব ভেসে।`
      }
    ]
  }
];
