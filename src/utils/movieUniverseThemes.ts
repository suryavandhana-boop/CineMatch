export interface MovieUniverseTheme {
  id: string;
  themeKey: string;
  universeName: string;
  tagline: string;
  atmosphereBadge: string;
  ambientVibe: string;
  bgGradient: string;
  accentColor: string; // Hex or Tailwind color class
  glowColor: string; // rgba or hex
  borderColor: string;
  primaryTone: 'cosmic' | 'dream' | 'fission' | 'theatre' | 'noir' | 'monsoon' | 'industrial' | 'nostalgia' | 'firewater' | 'mythic' | 'forest' | 'alien' | 'cyberpunk' | 'tempest' | 'jazz' | 'bioluminescent' | 'city' | 'reel' | 'headlights' | 'psychedelic' | 'collegiate' | 'piano' | 'lucid' | 'reverse';
  particleCount: number;
}

export const MOVIE_UNIVERSE_THEMES: Record<string, MovieUniverseTheme> = {
  // 1. Inception (m1)
  m1: {
    id: 'm1',
    themeKey: 'inception',
    universeName: 'Subconscious Dream Architecture',
    tagline: 'Folding 3D Paris Cityscapes & Shifting Geometric Realities',
    atmosphereBadge: '3D Folding Dream Grid',
    ambientVibe: 'Hans Zimmer Brass & Cerebral Gravity',
    bgGradient: 'from-[#070512] via-[#0e0724] to-[#04020a]',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    borderColor: 'rgba(249, 115, 22, 0.5)',
    primaryTone: 'dream',
    particleCount: 28,
  },

  // 2. Interstellar (m2)
  m2: {
    id: 'm2',
    themeKey: 'interstellar',
    universeName: 'Gargantua Cosmic Horizon',
    tagline: 'Singularity Accretion Glow, Deep Stellar Void & 3D Spatial Grid',
    atmosphereBadge: '3D Deep Space & Cosmic Grid',
    ambientVibe: 'Organ Grandeur & Relativistic Time',
    bgGradient: 'from-[#030208] via-[#090b1e] to-[#010105]',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    borderColor: 'rgba(56, 189, 248, 0.5)',
    primaryTone: 'cosmic',
    particleCount: 65,
  },

  // 3. The Prestige (m3)
  m3: {
    id: 'm3',
    themeKey: 'the-prestige',
    universeName: 'Victorian Illusionist Proscenium',
    tagline: 'Antique Brass Mechanical Clockwork, Velvet Shadows & Golden Embers',
    atmosphereBadge: 'Mechanical Gold & Stage Lights',
    ambientVibe: 'Obsessive Duality & Sleight-of-Hand',
    bgGradient: 'from-[#0d0705] via-[#160d09] to-[#060302]',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    borderColor: 'rgba(234, 179, 8, 0.5)',
    primaryTone: 'theatre',
    particleCount: 35,
  },

  // 4. Memento (m4)
  m4: {
    id: 'm4',
    themeKey: 'memento',
    universeName: 'Fragmented Reverse Timeline',
    tagline: 'Polaroid Film Shards, Reverse Clock Ticks & Fading Ink Notes',
    atmosphereBadge: 'Reverse Temporal Shards',
    ambientVibe: 'Paranoid Claustrophobia & Monochrome Flashbacks',
    bgGradient: 'from-[#0a0a0f] via-[#14121a] to-[#050508]',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    borderColor: 'rgba(168, 85, 247, 0.5)',
    primaryTone: 'reverse',
    particleCount: 30,
  },

  // 5. The Dark Knight (m5)
  m5: {
    id: 'm5',
    themeKey: 'the-dark-knight',
    universeName: 'Gotham Nocturnal Skyline',
    tagline: 'Torrential Night Rain, Searchlight Beams & Distant Bat Silhouettes',
    atmosphereBadge: 'Gotham Rain & Searchlights',
    ambientVibe: 'Anarchic Chaos & Moral Fortitude',
    bgGradient: 'from-[#05070e] via-[#09101c] to-[#020306]',
    accentColor: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    borderColor: 'rgba(96, 165, 250, 0.5)',
    primaryTone: 'noir',
    particleCount: 50,
  },

  // 6. Oppenheimer (m6)
  m6: {
    id: 'm6',
    themeKey: 'oppenheimer',
    universeName: 'Trinity Fission Chamber',
    tagline: 'Expanding Radiant Shockwaves, Atomic Orbits & Flaming Sparks',
    atmosphereBadge: 'Quantum Shockwaves & Embers',
    ambientVibe: 'Ludwig Göransson Violin Accelerando',
    bgGradient: 'from-[#120603] via-[#1c0903] to-[#050100]',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.55)',
    borderColor: 'rgba(249, 115, 22, 0.6)',
    primaryTone: 'fission',
    particleCount: 45,
  },

  // 7. Arrival (m7)
  m7: {
    id: 'm7',
    themeKey: 'arrival',
    universeName: 'Zero-G Non-Linear Temporal Chamber',
    tagline: 'Pulsing Heptapod Ink Logograms & Ambient Atmospheric Mist',
    atmosphereBadge: 'Alien Logograms & Gravity Mist',
    ambientVibe: 'Linguistic Relativity & Jóhannsson Chants',
    bgGradient: 'from-[#030a0d] via-[#07151a] to-[#020608]',
    accentColor: '#2dd4bf',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    borderColor: 'rgba(45, 212, 191, 0.5)',
    primaryTone: 'alien',
    particleCount: 30,
  },

  // 8. Blade Runner 2049 (m8)
  m8: {
    id: 'm8',
    themeKey: 'blade-runner-2049',
    universeName: 'Los Angeles 2049 Synthwave Haze',
    tagline: 'Neon Orange Smog, Cyan Holographic Rain & Cybernetic Scanlines',
    atmosphereBadge: 'Cyberpunk Neon & Acid Rain',
    ambientVibe: 'Vangelis Re-imagined & Existential Solitude',
    bgGradient: 'from-[#160803] via-[#1c0c1e] to-[#06020c]',
    accentColor: '#fb923c',
    glowColor: 'rgba(251, 146, 60, 0.5)',
    borderColor: 'rgba(251, 146, 60, 0.6)',
    primaryTone: 'cyberpunk',
    particleCount: 40,
  },

  // 9. Shutter Island (m9)
  m9: {
    id: 'm9',
    themeKey: 'shutter-island',
    universeName: 'Ashecliffe Tempest & Lighthouse Beacon',
    tagline: 'Sweeping Coastal Lighthouse Ray, Heavy Sea Fog & Falling Ash',
    atmosphereBadge: 'Lighthouse Beacon & Sea Gale',
    ambientVibe: 'Psychological Paranoia & Crashing Surges',
    bgGradient: 'from-[#06090c] via-[#0e161c] to-[#020304]',
    accentColor: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.35)',
    borderColor: 'rgba(148, 163, 184, 0.5)',
    primaryTone: 'tempest',
    particleCount: 45,
  },

  // 10. Whiplash (m10)
  m10: {
    id: 'm10',
    themeKey: 'whiplash',
    universeName: 'Studio Q Stark Concert Stage',
    tagline: 'Piercing Golden Spotlight, Rhythmic Soundwaves & Brass Sparks',
    atmosphereBadge: 'Stage Spotlight & Rhythmic Sparks',
    ambientVibe: 'Double-Time Swing & Kinetic Mentor Fury',
    bgGradient: 'from-[#140a02] via-[#241303] to-[#070301]',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    borderColor: 'rgba(245, 158, 11, 0.6)',
    primaryTone: 'jazz',
    particleCount: 35,
  },

  // 11. Premam (m11)
  m11: {
    id: 'm11',
    themeKey: 'premam',
    universeName: 'Kerala Monsoon & Butterfly Grove',
    tagline: 'Fluttering Color Butterflies, Gentle Rain Showers & Golden Sunlight',
    atmosphereBadge: 'Monsoon Rain & Butterflies',
    ambientVibe: 'Rajesh Murugesan Malare Acoustic Romance',
    bgGradient: 'from-[#05120a] via-[#091f14] to-[#020904]',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    borderColor: 'rgba(16, 185, 129, 0.55)',
    primaryTone: 'monsoon',
    particleCount: 35,
  },

  // 12. Kumbalangi Nights (m12)
  m12: {
    id: 'm12',
    themeKey: 'kumbalangi-nights',
    universeName: 'Kavaru Bioluminescent Backwaters',
    tagline: 'Glowing Aqua Phosphorescent Waves, Gentle Ripples & Fireflies',
    atmosphereBadge: 'Bioluminescent Neon Water',
    ambientVibe: 'Cherathukal Acoustic Tranquility & Brotherhood',
    bgGradient: 'from-[#020b12] via-[#041926] to-[#010609]',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    borderColor: 'rgba(6, 182, 212, 0.6)',
    primaryTone: 'bioluminescent',
    particleCount: 45,
  },

  // 13. Bangalore Days (m13)
  m13: {
    id: 'm13',
    themeKey: 'bangalore-days',
    universeName: 'Cosmopolitan Highway Neon',
    tagline: 'Warm Bokeh Discs, Motocross Trails & Youthful City Radiance',
    atmosphereBadge: 'City Lights & Youthful Bokeh',
    ambientVibe: 'Gopi Sundar Euphoria & Lifelong Bonds',
    bgGradient: 'from-[#110722] via-[#1a0c36] to-[#06020c]',
    accentColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    borderColor: 'rgba(192, 132, 252, 0.55)',
    primaryTone: 'city',
    particleCount: 35,
  },

  // 14. Drishyam (m14)
  m14: {
    id: 'm14',
    themeKey: 'drishyam',
    universeName: 'August 2nd Cinema Alibi Vault',
    tagline: 'Floating 35mm Film Frames, Mist & Suspenseful Countdown Rings',
    atmosphereBadge: 'Film Reel Alibi & Rubber Estate Mist',
    ambientVibe: 'Calculated Alibi Suspense & Family Devotion',
    bgGradient: 'from-[#070b12] via-[#0d1624] to-[#030508]',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    borderColor: 'rgba(56, 189, 248, 0.5)',
    primaryTone: 'reel',
    particleCount: 30,
  },

  // 15. Vikram (m15)
  m15: {
    id: 'm15',
    themeKey: 'vikram',
    universeName: 'Lokesh Cinematic Underworld',
    tagline: 'Dense Industrial Smoke, Crimson Strobe Sirens & Metallic Shrapnel',
    atmosphereBadge: 'Industrial Smoke & Blood-Red Strobes',
    ambientVibe: 'Anirudh Thumping Industrial EDM & Gatling Roar',
    bgGradient: 'from-[#160303] via-[#220707] to-[#080101]',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.55)',
    borderColor: 'rgba(239, 68, 68, 0.65)',
    primaryTone: 'industrial',
    particleCount: 40,
  },

  // 16. 96 (m16)
  m16: {
    id: 'm16',
    themeKey: '96',
    universeName: '1996 Nostalgic Twilight Walk',
    tagline: 'Sepia Polaroid Photo Memories, Gentle Drizzle & Soft Halogen Halo',
    atmosphereBadge: 'Nostalgic Polaroids & Soft Rain',
    ambientVibe: 'Govind Vasantha The Life of Ram Melancholy',
    bgGradient: 'from-[#120816] via-[#1e0d24] to-[#07020a]',
    accentColor: '#e879f9',
    glowColor: 'rgba(232, 121, 249, 0.45)',
    borderColor: 'rgba(232, 121, 249, 0.55)',
    primaryTone: 'nostalgia',
    particleCount: 32,
  },

  // 17. Kaithi (m17)
  m17: {
    id: 'm17',
    themeKey: 'kaithi',
    universeName: 'Midnight Highway Lorry Siege',
    tagline: 'Piercing Truck Headlights, Flare Embers & Wet Black Asphalt',
    atmosphereBadge: 'Nocturnal Headlights & Flare Embers',
    ambientVibe: 'Sam CS Heart-Racing Percussion & Single-Night Siege',
    bgGradient: 'from-[#0a0703] via-[#180f05] to-[#030201]',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    borderColor: 'rgba(249, 115, 22, 0.6)',
    primaryTone: 'headlights',
    particleCount: 38,
  },

  // 18. Super Deluxe (m18)
  m18: {
    id: 'm18',
    themeKey: 'super-deluxe',
    universeName: 'Auteur Chromatic Kaleidoscope',
    tagline: 'Magenta/Cyan Chromatic Glitches, Cosmic Portals & Retro Scanlines',
    atmosphereBadge: 'Chromatic Glitch & Cosmic Portals',
    ambientVibe: 'Yuvan Shankar Raja Eccentric Synth Soundscape',
    bgGradient: 'from-[#16041c] via-[#24062e] to-[#09010c]',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    borderColor: 'rgba(244, 63, 94, 0.6)',
    primaryTone: 'psychedelic',
    particleCount: 36,
  },

  // 19. 3 Idiots (m19)
  m19: {
    id: 'm19',
    themeKey: '3-idiots',
    universeName: 'Imperial College Blueprints & Sunshine',
    tagline: 'Floating Origami Paper Planes, Warm Golden Sun Rays & Whimsical Sparks',
    atmosphereBadge: 'Paper Planes & Golden Sunlight',
    ambientVibe: 'All Izz Well Youthful Optimism',
    bgGradient: 'from-[#140d04] via-[#221706] to-[#070401]',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    borderColor: 'rgba(234, 179, 8, 0.55)',
    primaryTone: 'collegiate',
    particleCount: 30,
  },

  // 20. Andhadhun (m20)
  m20: {
    id: 'm20',
    themeKey: 'andhadhun',
    universeName: 'Simulated Blindness Jazz Lounge',
    tagline: 'Floating Black & White Piano Keys, Musical Staves & Crimson Droplets',
    atmosphereBadge: 'Floating Piano Keys & Noir Jazz',
    ambientVibe: 'Amit Trivedi Piano Waltzes & Twisted Irony',
    bgGradient: 'from-[#0b080f] via-[#140f1c] to-[#040306]',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    borderColor: 'rgba(168, 85, 247, 0.55)',
    primaryTone: 'piano',
    particleCount: 32,
  },

  // 21. Tumbbad (m21)
  m21: {
    id: 'm21',
    themeKey: 'tumbbad',
    universeName: 'Forbidden Subterranean Vault of Hastar',
    tagline: 'Perpetual Maharashtra Rain, Ancient Red Stone & Floating Gold Embers',
    atmosphereBadge: 'Ancient Rain, Stone & Hastar Embers',
    ambientVibe: 'Jesper Kyd Haunting Folk Choirs & Dread',
    bgGradient: 'from-[#160402] via-[#220703] to-[#080101]',
    accentColor: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.55)',
    borderColor: 'rgba(234, 88, 12, 0.65)',
    primaryTone: 'mythic',
    particleCount: 45,
  },

  // 22. RRR (m22)
  m22: {
    id: 'm22',
    themeKey: 'rrr',
    universeName: 'Fire & Water Revolutionary Arena',
    tagline: 'Fierce Clash of Blazing Volcano Embers & Rushing Azure Water Droplets',
    atmosphereBadge: 'Fire Embers & Water Clash',
    ambientVibe: 'MM Keeravani Dosti & Naatu Naatu Percussive Thunder',
    bgGradient: 'from-[#160603] via-[#0a1124] to-[#040201]',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.55)',
    borderColor: 'rgba(249, 115, 22, 0.65)',
    primaryTone: 'firewater',
    particleCount: 50,
  },

  // 23. Lucia (m23)
  m23: {
    id: 'm23',
    themeKey: 'lucia',
    universeName: 'Split-Reality Lucid Drug Dreamscape',
    tagline: 'Half Monochrome Realism vs Half Neon Superstar Glow & Floating Pills',
    atmosphereBadge: 'Split Monochrome & Neon Lucid Glow',
    ambientVibe: 'Poornachandra Tejaswi Tingu Rangu Reality Shifts',
    bgGradient: 'from-[#07070a] via-[#160a22] to-[#020204]',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    borderColor: 'rgba(56, 189, 248, 0.55)',
    primaryTone: 'lucid',
    particleCount: 35,
  },

  // 24. Kantara (m24)
  m24: {
    id: 'm24',
    themeKey: 'kantara',
    universeName: 'Sacred Coastal Forest & Bhoota Kola',
    tagline: 'Thick Canopy Mist, Fiery Sacred Ritual Torches & Divine Spirit Glow',
    atmosphereBadge: 'Forest Mist & Sacred Torch Embers',
    ambientVibe: 'Ajaneesh Loknath Varaha Roopam Divine Chant',
    bgGradient: 'from-[#120703] via-[#1c0c05] to-[#060201]',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.55)',
    borderColor: 'rgba(245, 158, 11, 0.65)',
    primaryTone: 'forest',
    particleCount: 42,
  },
};

/**
 * Returns the universe theme for any given movie, with a fallback
 */
export function getMovieUniverseTheme(movieId: string): MovieUniverseTheme {
  if (MOVIE_UNIVERSE_THEMES[movieId]) {
    return MOVIE_UNIVERSE_THEMES[movieId];
  }

  // Fallback dynamic universe
  return {
    id: movieId,
    themeKey: 'cinematic-void',
    universeName: 'Cinematic Universe Dimension',
    tagline: 'Immersive Movie Realm & Ambient Spatial Canvas',
    atmosphereBadge: 'Spatial Cinematic Atmosphere',
    ambientVibe: 'CineMatch Spatial Soundstage',
    bgGradient: 'from-[#090518] via-[#130d2d] to-[#05030e]',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    borderColor: 'rgba(249, 115, 22, 0.5)',
    primaryTone: 'cosmic',
    particleCount: 35,
  };
}
