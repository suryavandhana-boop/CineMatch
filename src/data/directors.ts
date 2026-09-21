export interface DirectorInfo {
  name: string;
  signatureStyle: string;
  knownFor: string;
  industry: 'Hollywood' | 'Indian';
  primaryLanguage: string;
  quote?: string;
}

export const FEATURED_DIRECTORS: DirectorInfo[] = [
  {
    name: 'Christopher Nolan',
    signatureStyle: 'Nonlinear chronology, theoretical physics, practical spectacles, and psychological obsessions.',
    knownFor: 'Inception, Interstellar, The Dark Knight, Oppenheimer',
    industry: 'Hollywood',
    primaryLanguage: 'English',
    quote: 'I have always been fascinated by time, subjective perception, and the architecture of memory.'
  },
  {
    name: 'Denis Villeneuve',
    signatureStyle: 'Monumental visual grandeur, existential sci-fi, philosophical weight, and atmospheric soundscapes.',
    knownFor: 'Arrival, Blade Runner 2049, Dune, Sicario',
    industry: 'Hollywood',
    primaryLanguage: 'English',
    quote: 'Cinema is about image and sound, an invitation into a meditative, visceral reality.'
  },
  {
    name: 'Martin Scorsese',
    signatureStyle: 'Gothic psychological tension, guilt, moral ambiguity, kinetic editing, and character-driven fury.',
    knownFor: 'Shutter Island, Taxi Driver, Goodfellas',
    industry: 'Hollywood',
    primaryLanguage: 'English',
    quote: 'Movies touch our hearts and awaken our vision, and change the way we see things.'
  },
  {
    name: 'Damien Chazelle',
    signatureStyle: 'Electric rhythmic montage, relentless artistic obsession, jazz percussion, and high-stakes ambition.',
    knownFor: 'Whiplash, La La Land, First Man',
    industry: 'Hollywood',
    primaryLanguage: 'English',
    quote: 'Pushing past human limitations to touch artistic greatness.'
  },
  {
    name: 'Alphonse Puthren',
    signatureStyle: 'Episodic coming-of-age warmth, butterfly color motifs, acoustic rhythms, and effortless comedic charm.',
    knownFor: 'Premam, Neram',
    industry: 'Indian',
    primaryLanguage: 'Malayalam',
    quote: 'Capturing youth, nostalgia, and the gentle transitions of human affection.'
  },
  {
    name: 'Lokesh Kanagaraj',
    signatureStyle: 'The Lokesh Cinematic Universe (LCU), single-night adrenaline sieges, masked vigilantes, and retro bangers.',
    knownFor: 'Vikram, Kaithi, Master, Leo',
    industry: 'Indian',
    primaryLanguage: 'Tamil',
    quote: 'Crafting non-stop visceral cinema where storytelling and kinetic momentum never pause.'
  },
  {
    name: 'Jeethu Joseph',
    signatureStyle: 'Airtight screenplay geometry, cat-and-mouse forensic alibis, family protective instincts, and tension.',
    knownFor: 'Drishyam, Memories',
    industry: 'Indian',
    primaryLanguage: 'Malayalam',
    quote: 'The ultimate thriller is built on the quiet, formidable intelligence of everyday people.'
  },
  {
    name: 'Anjali Menon',
    signatureStyle: 'Vibrant cousin camaraderie, tender character intimacy, travel revelations, and empathetic humor.',
    knownFor: 'Bangalore Days, Koode',
    industry: 'Indian',
    primaryLanguage: 'Malayalam',
    quote: 'Exploring relationships with gentle authenticity, warmth, and modern emotional nuance.'
  },
  {
    name: 'C. Prem Kumar',
    signatureStyle: 'Poetic nostalgia, school reunion longing, restrained romantic intimacy, and soul-stirring violin melodies.',
    knownFor: '96, Jaanu',
    industry: 'Indian',
    primaryLanguage: 'Tamil',
    quote: 'Unspoken words between old sweethearts carrying the emotional weight of decades.'
  },
  {
    name: 'Rajkumar Hirani',
    signatureStyle: 'Heartwarming social satire, unforgettable comedic timing, emotional catharsis, and empowering life mantras.',
    knownFor: '3 Idiots, PK, Munna Bhai M.B.B.S.',
    industry: 'Indian',
    primaryLanguage: 'Hindi',
    quote: 'Chasing excellence with laughter, courage, and unconditional friendship.'
  },
  {
    name: 'S. S. Rajamouli',
    signatureStyle: 'Mythic Indian folklore scale, gravity-defying emotional heroism, interval volcanic climaxes, and spectacle.',
    knownFor: 'RRR, Baahubali: The Beginning, Baahubali 2',
    industry: 'Indian',
    primaryLanguage: 'Telugu',
    quote: 'Emotion is the core; scale, visual effects, and spectacle are just the vessels to amplify it.'
  },
  {
    name: 'Pawan Kumar',
    signatureStyle: 'Nonlinear psychological puzzles, crowd-funded visionary indie storytelling, and dream-reality duality.',
    knownFor: 'Lucia, U-Turn',
    industry: 'Indian',
    primaryLanguage: 'Kannada',
    quote: 'Challenging narrative conventions to explore the delicate boundary between perception and reality.'
  },
  {
    name: 'Rishab Shetty',
    signatureStyle: 'Indigenous demigod folklore, thunderous ritual percussion, Coastal Karnataka mysticism, and trance performances.',
    knownFor: 'Kantara, Sarkari Hi. Pra. Shaale',
    industry: 'Indian',
    primaryLanguage: 'Kannada',
    quote: 'Rooting raw storytelling in ancestral demigod culture and sacred earth traditions.'
  }
];

export const DIRECTORS_LIST: string[] = FEATURED_DIRECTORS.map((d) => d.name);
