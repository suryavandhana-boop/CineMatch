import { Movie } from '../types.ts';

export const PLACEHOLDER_MOVIES: Movie[] = [
  // 1. Inception
  {
    id: 'm1',
    title: 'Inception',
    year: 2010,
    duration: '2h 28m',
    rating: 8.8,
    matchScore: 99,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    director: 'Christopher Nolan',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m1.jpg',
    synopsis: 'A skilled thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    vibe: 'Mind-Bending Neon',
    gradient: 'from-purple-950 via-indigo-950 to-orange-950',
    accentColor: 'orange',
    tag: 'Daily Spotlight',
    whyRecommended: 'Masterpiece dream-architecture narrative structure, Hans Zimmer’s brass score, and cerebral multi-layered subconscious heist mechanics.',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy', 'Marion Cotillard']
  },

  // 2. Interstellar
  {
    id: 'm2',
    title: 'Interstellar',
    year: 2014,
    duration: '2h 49m',
    rating: 8.7,
    matchScore: 98,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    director: 'Christopher Nolan',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m2.jpg',
    synopsis: 'When Earth becomes uninhabitable in the future, a former NASA pilot leads a team of researchers through a mysterious wormhole near Saturn across time and space.',
    vibe: 'Cosmic Wonder',
    gradient: 'from-indigo-950 via-purple-950 to-amber-950',
    accentColor: 'orange',
    tag: 'Cosmic Wonder',
    whyRecommended: 'Theoretical astrophysics grounded by a poignant father-daughter emotional anchor and majestic organ-driven orchestral grandeur.',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine']
  },

  // 3. The Prestige
  {
    id: 'm3',
    title: 'The Prestige',
    year: 2006,
    duration: '2h 10m',
    rating: 8.5,
    matchScore: 95,
    genres: ['Mystery', 'Drama', 'Sci-Fi'],
    director: 'Christopher Nolan',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m3.jpg',
    synopsis: 'In 1890s London, two rival stage magicians engage in a bitter, obsessive feud to craft the ultimate teleportation illusion, sacrificing their lives and morals.',
    vibe: 'Atmospheric Thrill',
    gradient: 'from-violet-950 via-slate-900 to-amber-950',
    accentColor: 'purple',
    tag: 'Twist Classic',
    whyRecommended: 'Impeccable structural sleight-of-hand: the pledge, the turn, and the prestige mirroring the dark psychology of professional obsession.',
    cast: ['Christian Bale', 'Hugh Jackman', 'Scarlett Johansson', 'David Bowie', 'Michael Caine']
  },

  // 4. Memento
  {
    id: 'm4',
    title: 'Memento',
    year: 2000,
    duration: '1h 53m',
    rating: 8.4,
    matchScore: 94,
    genres: ['Mystery', 'Thriller'],
    director: 'Christopher Nolan',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m4.jpg',
    synopsis: 'An insurance investigator with short-term memory loss, unable to form new memories, uses Polaroid photos and body tattoos to hunt his wife’s killer.',
    vibe: 'Atmospheric Thrill',
    gradient: 'from-purple-950 via-neutral-900 to-orange-950',
    accentColor: 'purple',
    tag: 'Reverse Narrative',
    whyRecommended: 'Revolutionary reverse-chronological editing putting viewers directly inside the protagonist’s disorienting, paranoid reality.',
    cast: ['Guy Pearce', 'Carrie-Anne Moss', 'Joe Pantoliano']
  },

  // 5. The Dark Knight
  {
    id: 'm5',
    title: 'The Dark Knight',
    year: 2008,
    duration: '2h 32m',
    rating: 9.0,
    matchScore: 99,
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m5.jpg',
    synopsis: 'When the menace known as the Joker wreaks chaos on Gotham City, Batman must accept one of the greatest psychological and physical tests of his moral code.',
    vibe: 'Pulse Thriller',
    gradient: 'from-zinc-950 via-purple-950 to-orange-950',
    accentColor: 'orange',
    tag: 'All-Time Legend',
    whyRecommended: 'Heath Ledger’s legendary Oscar-winning Joker performance and tense philosophical combat between order, chaos, and institutional sacrifice.',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Gary Oldman']
  },

  // 6. Oppenheimer
  {
    id: 'm6',
    title: 'Oppenheimer',
    year: 2023,
    duration: '3h 00m',
    rating: 8.9,
    matchScore: 97,
    genres: ['Biography', 'Drama', 'History'],
    director: 'Christopher Nolan',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m6.jpg',
    synopsis: 'The epic story of theoretical physicist J. Robert Oppenheimer, his leadership of the Manhattan Project, and the shattering moral aftermath of the atomic age.',
    vibe: 'Atmospheric Thrill',
    gradient: 'from-orange-950 via-amber-950 to-purple-950',
    accentColor: 'orange',
    tag: 'Oscar Winner',
    whyRecommended: 'Ludwig Göransson’s relentless violin pulse, subjective visual montage, and riveting geopolitical character study of scientific triumph and ethical dread.',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh']
  },

  // 7. Arrival
  {
    id: 'm7',
    title: 'Arrival',
    year: 2016,
    duration: '1h 56m',
    rating: 8.0,
    matchScore: 96,
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    director: 'Denis Villeneuve',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m7.jpg',
    synopsis: 'A linguistics professor leads an elite investigative unit when twelve gigantic extraterrestrial spacecraft touch down across global coordinates.',
    vibe: 'Cosmic Wonder',
    gradient: 'from-purple-950 via-indigo-900 to-slate-900',
    accentColor: 'purple',
    tag: 'Cerebral Sci-Fi',
    whyRecommended: 'Profound meditation on linguistic relativity, non-linear time perception, and grief, accompanied by Jóhann Jóhannsson’s vocal soundscapes.',
    cast: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker', 'Michael Stuhlbarg']
  },

  // 8. Blade Runner 2049
  {
    id: 'm8',
    title: 'Blade Runner 2049',
    year: 2017,
    duration: '2h 44m',
    rating: 8.1,
    matchScore: 97,
    genres: ['Sci-Fi', 'Mystery', 'Cyberpunk'],
    director: 'Denis Villeneuve',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m8.png',
    synopsis: 'Young Blade Runner K unearths a long-buried secret that has the potential to destabilize humanity, leading him on a trek to find missing veteran Rick Deckard.',
    vibe: 'Mind-Bending Neon',
    gradient: 'from-orange-950 via-purple-950 to-indigo-950',
    accentColor: 'orange',
    tag: 'Visual Wonder',
    whyRecommended: 'Roger Deakins’ Oscar-winning cinematography paired with deep existential questions about artificial life, memory, and soulfulness.',
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas', 'Sylvia Hoeks', 'Robin Wright']
  },

  // 9. Shutter Island
  {
    id: 'm9',
    title: 'Shutter Island',
    year: 2010,
    duration: '2h 18m',
    rating: 8.2,
    matchScore: 93,
    genres: ['Psychological Thriller', 'Mystery'],
    director: 'Martin Scorsese',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m9.jpg',
    synopsis: 'In 1954, a troubled U.S. Marshal investigates the disappearance of a patient from an isolated fortress hospital for the criminally insane.',
    vibe: 'Atmospheric Thrill',
    gradient: 'from-stone-950 via-purple-950 to-slate-950',
    accentColor: 'purple',
    tag: 'Gothic Mystery',
    whyRecommended: 'Oppressive storm-lashed atmosphere, disquieting classical soundtrack selections, and a devastating psychological climax about guilt and grief.',
    cast: ['Leonardo DiCaprio', 'Mark Ruffalo', 'Ben Kingsley', 'Michelle Williams', 'Max von Sydow']
  },

  // 10. Whiplash
  {
    id: 'm10',
    title: 'Whiplash',
    year: 2014,
    duration: '1h 46m',
    rating: 8.5,
    matchScore: 96,
    genres: ['Drama', 'Music', 'Psychological'],
    director: 'Damien Chazelle',
    language: 'English',
    industry: 'Hollywood',
    posterUrl: '/posters/m10.jpg',
    synopsis: 'A promising young jazz drummer enrolls at an unforgiving music conservatory where his pursuit of greatness is pushed to extreme limits by a ruthless maestro.',
    vibe: 'Pulse Thriller',
    gradient: 'from-amber-950 via-purple-950 to-orange-950',
    accentColor: 'orange',
    tag: 'High Octane',
    whyRecommended: 'Electric rhythmic montage editing, ferocious mentor-student kinetic tension, and one of modern cinema’s most breathless finale sequences.',
    cast: ['Miles Teller', 'J.K. Simmons', 'Paul Reiser', 'Melissa Benoist']
  },

  // 11. Premam
  {
    id: 'm11',
    title: 'Premam',
    year: 2015,
    duration: '2h 36m',
    rating: 8.3,
    matchScore: 95,
    genres: ['Romance', 'Comedy', 'Drama'],
    director: 'Alphonse Puthren',
    language: 'Malayalam',
    industry: 'Indian',
    posterUrl: '/posters/m11.jpg',
    synopsis: 'A young man’s emotional evolution is traced across three seminal epochs of his life—school, college, and adulthood—discovering love, heartbreak, and resilience.',
    vibe: 'Heartfelt Indie',
    gradient: 'from-purple-950 via-violet-900 to-amber-950',
    accentColor: 'purple',
    tag: 'Cult Classic',
    whyRecommended: 'Effortless episodic charm, Rajesh Murugesan’s acoustic soundtrack, poetic butterfly motifs, and Nivin Pauly’s iconic college swagger.',
    cast: ['Nivin Pauly', 'Sai Pallavi', 'Madonna Sebastian', 'Anupama Parameswaran']
  },

  // 12. Kumbalangi Nights
  {
    id: 'm12',
    title: 'Kumbalangi Nights',
    year: 2019,
    duration: '2h 15m',
    rating: 8.5,
    matchScore: 96,
    genres: ['Drama', 'Family', 'Romance'],
    director: 'Madhu C. Narayanan',
    language: 'Malayalam',
    industry: 'Indian',
    posterUrl: '/posters/m12.jpg',
    synopsis: 'Four estranged brothers inhabiting a dysfunctional home in the backwaters of Kumbalangi find reconciliation and warmth when love enters their lives.',
    vibe: 'Heartfelt Indie',
    gradient: 'from-emerald-950 via-purple-950 to-orange-950',
    accentColor: 'orange',
    tag: 'Island Poetry',
    whyRecommended: 'Tender subversion of masculine tropes, luminous bioluminescent backwater imagery, and Fahadh Faasil’s unforgettable Shammi.',
    cast: ['Fahadh Faasil', 'Shane Nigam', 'Soubin Shahir', 'Sreenath Bhasi']
  },

  // 13. Bangalore Days
  {
    id: 'm13',
    title: 'Bangalore Days',
    year: 2014,
    duration: '2h 51m',
    rating: 8.3,
    matchScore: 92,
    genres: ['Comedy', 'Drama', 'Romance'],
    director: 'Anjali Menon',
    language: 'Malayalam',
    industry: 'Indian',
    posterUrl: '/posters/m13.jpg',
    synopsis: 'Three close-knit cousins fulfill their lifelong dream of moving to Bangalore, navigating the exhilaration and vulnerability of adult ambitions and romance.',
    vibe: 'Heartfelt Indie',
    gradient: 'from-purple-900 via-indigo-950 to-orange-900',
    accentColor: 'purple',
    tag: 'Feel-Good Gem',
    whyRecommended: 'Sparkling ensemble chemistry, infectious Gopi Sundar melodies, motocross races, and Anjali Menon’s vibrant, empathetic direction.',
    cast: ['Dulquer Salmaan', 'Nivin Pauly', 'Nazriya Nazim', 'Fahadh Faasil', 'Parvathy Thiruvothu']
  },

  // 14. Drishyam
  {
    id: 'm14',
    title: 'Drishyam',
    year: 2013,
    duration: '2h 40m',
    rating: 8.6,
    matchScore: 97,
    genres: ['Crime', 'Thriller', 'Drama'],
    director: 'Jeethu Joseph',
    language: 'Malayalam',
    industry: 'Indian',
    posterUrl: '/posters/m14.jpg',
    synopsis: 'A humble cable TV operator uses his vast memory of cinema storylines to fabricate an airtight alibi for his family after an uninvited crisis strikes.',
    vibe: 'Pulse Thriller',
    gradient: 'from-purple-950 via-zinc-950 to-orange-950',
    accentColor: 'orange',
    tag: 'Alibi Masterclass',
    whyRecommended: 'Legendary screenplay logic, suspenseful cat-and-mouse interrogation pacing, and Mohanlal’s quietly resolute protective father role.',
    cast: ['Mohanlal', 'Meena', 'Ansiba Hassan', 'Asha Sharath', 'Siddique']
  },

  // 15. Vikram
  {
    id: 'm15',
    title: 'Vikram',
    year: 2022,
    duration: '2h 53m',
    rating: 8.3,
    matchScore: 98,
    genres: ['Action', 'Thriller', 'Crime'],
    director: 'Lokesh Kanagaraj',
    language: 'Tamil',
    industry: 'Indian',
    posterUrl: '/posters/m15.jpg',
    synopsis: 'A special black-ops task force investigates masked vigilante executions, unearthing a multi-tier narcotics syndicate in the Lokesh Cinematic Universe.',
    vibe: 'Pulse Thriller',
    gradient: 'from-orange-950 via-purple-950 to-red-950',
    accentColor: 'orange',
    tag: 'Action Spectacle',
    whyRecommended: 'Kamal Haasan’s vintage swagger, Anirudh’s thumping industrial score, and blistering action choreography between legendary cinema titans.',
    cast: ['Kamal Haasan', 'Vijay Sethupathi', 'Fahadh Faasil', 'Suriya', 'Narain']
  },

  // 16. 96
  {
    id: 'm16',
    title: '96',
    year: 2018,
    duration: '2h 38m',
    rating: 8.5,
    matchScore: 94,
    genres: ['Romance', 'Drama'],
    director: 'C. Prem Kumar',
    language: 'Tamil',
    industry: 'Indian',
    posterUrl: '/posters/m16.jpg',
    synopsis: 'Two high-school sweethearts reunite at a 1996 batch reunion after twenty-two years apart, embarking on a poignant, single-night nocturnal walk through Chennai.',
    vibe: 'Heartfelt Indie',
    gradient: 'from-amber-950 via-purple-950 to-violet-950',
    accentColor: 'purple',
    tag: 'Poetic Romance',
    whyRecommended: 'Quiet, restrained intimacy between Vijay Sethupathi and Trisha, highlighted by Govind Vasantha’s soul-stirring violin melodies.',
    cast: ['Vijay Sethupathi', 'Trisha Krishnan', 'Varsha Bollamma', 'Devadarshini']
  },

  // 17. Kaithi
  {
    id: 'm17',
    title: 'Kaithi',
    year: 2019,
    duration: '2h 25m',
    rating: 8.4,
    matchScore: 96,
    genres: ['Action', 'Thriller', 'Crime'],
    director: 'Lokesh Kanagaraj',
    language: 'Tamil',
    industry: 'Indian',
    posterUrl: '/posters/m17.jpg',
    synopsis: 'Dilli, an ex-convict desperate to see his daughter for the very first time, is recruited to drive a truck of sedated police officers across a siege of drug gangs.',
    vibe: 'Pulse Thriller',
    gradient: 'from-orange-950 via-zinc-950 to-purple-950',
    accentColor: 'orange',
    tag: 'Non-Stop Night',
    whyRecommended: 'Fierce single-night survival intensity free of romantic diversions or song interruptions—pure adrenaline-fueled action filmmaking.',
    cast: ['Karthi', 'Narain', 'Arjun Das', 'George Maryan']
  },

  // 18. Super Deluxe
  {
    id: 'm18',
    title: 'Super Deluxe',
    year: 2019,
    duration: '2h 56m',
    rating: 8.3,
    matchScore: 95,
    genres: ['Dark Comedy', 'Drama', 'Thriller'],
    director: 'Thiagarajan Kumararaja',
    language: 'Tamil',
    industry: 'Indian',
    posterUrl: '/posters/m18.jpg',
    synopsis: 'Four disparate stories involving an adulterous wife, an estranged transgender parent, curious teenage friends, and a corrupt police inspector collide across Chennai.',
    vibe: 'Mind-Bending Neon',
    gradient: 'from-fuchsia-950 via-purple-950 to-amber-950',
    accentColor: 'purple',
    tag: 'Auteur Vision',
    whyRecommended: 'Audacious hyperlink narrative exploring mortality, cosmos, morality, and Vijay Sethupathi’s National Award-winning portrayal of Shilpa.',
    cast: ['Vijay Sethupathi', 'Fahadh Faasil', 'Samantha Ruth Prabhu', 'Ramya Krishnan', 'Mysskin']
  },

  // 19. 3 Idiots
  {
    id: 'm19',
    title: '3 Idiots',
    year: 2009,
    duration: '2h 50m',
    rating: 8.4,
    matchScore: 96,
    genres: ['Comedy', 'Drama'],
    director: 'Rajkumar Hirani',
    language: 'Hindi',
    industry: 'Indian',
    posterUrl: '/posters/m19.jpg',
    synopsis: 'Two friends embark on a road trip to find their elusive college roommate Rancho while reflecting on their days defying their engineering college’s rigid system.',
    vibe: 'Heartfelt Indie',
    gradient: 'from-purple-950 via-amber-950 to-orange-900',
    accentColor: 'orange',
    tag: 'Evergreen Classic',
    whyRecommended: 'Unforgettable comedic timing, emotional warmth, and empowering life mantras celebrating genuine curiosity over rote memorization.',
    cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi', 'Kareena Kapoor', 'Boman Irani']
  },

  // 20. Andhadhun
  {
    id: 'm20',
    title: 'Andhadhun',
    year: 2018,
    duration: '2h 19m',
    rating: 8.2,
    matchScore: 95,
    genres: ['Black Comedy', 'Crime', 'Thriller'],
    director: 'Sriram Raghavan',
    language: 'Hindi',
    industry: 'Indian',
    posterUrl: '/posters/m20.jpg',
    synopsis: 'A piano player simulating blindness accidentally witnesses the murder of an elderly cinema star, spiraling into a treacherous rabbit hole of deceit.',
    vibe: 'Atmospheric Thrill',
    gradient: 'from-purple-950 via-stone-900 to-orange-950',
    accentColor: 'orange',
    tag: 'Twisty Thriller',
    whyRecommended: 'Deliciously cynical dark comedy, unpredictable narrative twists, and Tabu’s wickedly entertaining and calculating antagonist.',
    cast: ['Ayushmann Khurrana', 'Tabu', 'Radhika Apte', 'Anil Dhawan']
  },

  // 21. Tumbbad
  {
    id: 'm21',
    title: 'Tumbbad',
    year: 2018,
    duration: '1h 44m',
    rating: 8.2,
    matchScore: 94,
    genres: ['Horror', 'Period Fantasy', 'Mystery'],
    director: 'Rahi Anil Barve',
    language: 'Hindi',
    industry: 'Indian',
    posterUrl: '/posters/m21.jpg',
    synopsis: 'In a perpetually rain-soaked 1920s village, a man unearths the forbidden subterranean vault of the fallen fertility demon Hastar in an obsessive hunt for gold.',
    vibe: 'Atmospheric Thrill',
    gradient: 'from-amber-950 via-stone-950 to-purple-950',
    accentColor: 'orange',
    tag: 'Folk Mythic',
    whyRecommended: 'Atmospheric visual mythology, rich red womb aesthetics, eerie folklore, and a chilling cautionary parable on unbounded human greed.',
    cast: ['Sohum Shah', 'Jyoti Malshe', 'Anita Date-Kelkar', 'Ronjini Chakraborty']
  },

  // 22. RRR
  {
    id: 'm22',
    title: 'RRR',
    year: 2022,
    duration: '3h 07m',
    rating: 8.0,
    matchScore: 98,
    genres: ['Action', 'Epic', 'Drama'],
    director: 'S. S. Rajamouli',
    language: 'Telugu',
    industry: 'Indian',
    posterUrl: '/posters/m22.jpg',
    synopsis: 'A fearless tribal guardian and an undercover British Indian officer forge an epic bond in 1920s Delhi, unaware of each other’s perilous secret missions.',
    vibe: 'Pulse Thriller',
    gradient: 'from-orange-950 via-amber-950 to-purple-950',
    accentColor: 'orange',
    tag: 'Global Epic',
    whyRecommended: 'Mythic scale, exhilarating interval clash of fire and water, and the hyper-energetic Oscar-winning ‘Naatu Naatu’ dance sequence.',
    cast: ['N. T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn', 'Olivia Morris']
  },

  // 23. Lucia
  {
    id: 'm23',
    title: 'Lucia',
    year: 2013,
    duration: '2h 15m',
    rating: 8.2,
    matchScore: 93,
    genres: ['Psychological Thriller', 'Sci-Fi', 'Mystery'],
    director: 'Pawan Kumar',
    language: 'Kannada',
    industry: 'Indian',
    posterUrl: '/posters/m23.jpg',
    synopsis: 'An insomniac cinema usher consumes a mysterious lucid-dream drug called Lucia, leading him to experience an alternate, glamorous reality as a superstar.',
    vibe: 'Mind-Bending Neon',
    gradient: 'from-purple-950 via-indigo-950 to-neutral-950',
    accentColor: 'purple',
    tag: 'Pioneering Indie',
    whyRecommended: 'Brilliant nonlinear split-reality execution balancing monochrome realism and lush color dreamscapes exploring identity and envy.',
    cast: ['Sathish Ninasam', 'Sruthi Hariharan', 'Achyuth Kumar']
  },

  // 24. Kantara
  {
    id: 'm24',
    title: 'Kantara',
    year: 2022,
    duration: '2h 28m',
    rating: 8.2,
    matchScore: 96,
    genres: ['Action', 'Mythology', 'Thriller'],
    director: 'Rishab Shetty',
    language: 'Kannada',
    industry: 'Indian',
    posterUrl: '/posters/m24.jpg',
    synopsis: 'When an ancestral forest dispute flares between villagers and officials in Coastal Karnataka, the divine demigods Panjurli and Guliga rise to deliver justice.',
    vibe: 'Atmospheric Thrill',
    gradient: 'from-orange-950 via-amber-900 to-purple-950',
    accentColor: 'orange',
    tag: 'Divine Folklore',
    whyRecommended: 'Spellbinding Bhoota Kola rituals, thunderous native percussion, and Rishab Shetty’s trance-like climactic possession sequence.',
    cast: ['Rishab Shetty', 'Sapthami Gowda', 'Kishore', 'Achyuth Kumar']
  }
];

export const VIBES_LIST = [
  'All Vibes',
  'Mind-Bending Neon',
  'Atmospheric Thrill',
  'Cosmic Wonder',
  'Pulse Thriller',
  'Heartfelt Indie'
];

export const GENRES_LIST = [
  'All Genres',
  'Sci-Fi',
  'Action',
  'Thriller',
  'Mystery',
  'Drama',
  'Psychological',
  'Crime',
  'Romance',
  'Comedy',
  'Horror',
  'Mythology'
];

export const INDUSTRIES_LIST = [
  'All Industries',
  'Hollywood',
  'Indian'
];

export const LANGUAGES_LIST = [
  'All Languages',
  'English',
  'Malayalam',
  'Tamil',
  'Hindi',
  'Telugu',
  'Kannada'
];
