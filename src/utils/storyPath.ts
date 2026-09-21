import { Movie } from '../types.ts';
import { getMovieKeywords } from './recommendations.ts';

export interface StoryStepConnection {
  sharedDirector?: string;
  sharedGenres: string[];
  sharedLanguage?: string;
  sharedKeywords: string[];
  connectionReason: string;
}

export interface StoryPathItem {
  movie: Movie;
  connectionToNext?: StoryStepConnection;
}

export interface StoryPath {
  id: string;
  themeTitle: string;
  description: string;
  path: StoryPathItem[]; // Usually 3 movies: Movie 1 -> Movie 2 -> Movie 3
}

/**
 * Calculates a thematic connection between two movies based on:
 * - Shared Director
 * - Shared Genre
 * - Shared Language
 * - Shared Keywords
 */
export function calculateMovieConnection(movieA: Movie, movieB: Movie): {
  score: number;
  connection: StoryStepConnection;
} {
  const sharedDirector = movieA.director.toLowerCase() === movieB.director.toLowerCase() ? movieA.director : undefined;
  
  const genresA = new Set(movieA.genres.map((g) => g.toLowerCase()));
  const sharedGenres = movieB.genres.filter((g) => genresA.has(g.toLowerCase()));

  const sharedLanguage = movieA.language.toLowerCase() === movieB.language.toLowerCase() ? movieA.language : undefined;

  const keywordsA = new Set(getMovieKeywords(movieA).map((k) => k.toLowerCase()));
  const sharedKeywords = getMovieKeywords(movieB).filter((k) => keywordsA.has(k.toLowerCase()));

  // Scoring weights:
  // Director match is high-affinity for narrative continuity
  let score = 0;
  if (sharedDirector) score += 45;
  score += sharedGenres.length * 15;
  score += sharedKeywords.length * 12;
  if (sharedLanguage) score += 10;
  if (movieA.industry === movieB.industry) score += 5;

  // Synthesize readable connection reason
  const reasons: string[] = [];
  if (sharedDirector) {
    reasons.push(`Auteur signature of ${sharedDirector}`);
  }
  if (sharedGenres.length > 0) {
    reasons.push(sharedGenres.slice(0, 2).join(' & '));
  }
  if (sharedKeywords.length > 0) {
    reasons.push(`themes of ${sharedKeywords.slice(0, 2).map((k) => k.replace(/-/g, ' ')).join(' & ')}`);
  } else if (sharedLanguage) {
    reasons.push(`${sharedLanguage} cinema`);
  }

  const connectionReason = reasons.length > 0
    ? `Linked via ${reasons.join(', ')}`
    : `Connected through narrative pacing & cinematic atmosphere`;

  return {
    score,
    connection: {
      sharedDirector,
      sharedGenres,
      sharedLanguage,
      sharedKeywords,
      connectionReason,
    },
  };
}

/**
 * Dynamically computes a 3-movie story chain starting from `startMovie`:
 * Start Movie -> Related Movie 1 -> Related Movie 2
 */
export function computeStoryPath(startMovie: Movie, allMovies: Movie[]): StoryPath {
  // 1. First hop: Find best related movie to startMovie
  const candidates1 = allMovies.filter((m) => m.id !== startMovie.id);
  const scored1 = candidates1.map((m) => ({
    movie: m,
    ...calculateMovieConnection(startMovie, m),
  })).sort((a, b) => b.score - a.score);

  const step2 = scored1[0] || { movie: candidates1[0], score: 0, connection: { sharedGenres: [], sharedKeywords: [], connectionReason: 'Narrative companion' } };

  // 2. Second hop: Find best related movie to step2, excluding startMovie & step2
  const candidates2 = allMovies.filter((m) => m.id !== startMovie.id && m.id !== step2.movie.id);
  const scored2 = candidates2.map((m) => ({
    movie: m,
    ...calculateMovieConnection(step2.movie, m),
  })).sort((a, b) => b.score - a.score);

  const step3 = scored2[0] || { movie: candidates2[0], score: 0, connection: { sharedGenres: [], sharedKeywords: [], connectionReason: 'Narrative companion' } };

  // Determine an evocative journey theme title
  const commonGenres = startMovie.genres.slice(0, 2).join(' & ');
  const themeTitle = startMovie.director === step2.movie.director
    ? `${startMovie.director}'s Cinematic Dimension`
    : `The ${commonGenres || 'Atmospheric'} Story Arc`;

  const description = `Follow the storytelling thread from ${startMovie.title} through ${step2.movie.title} to ${step3.movie.title}.`;

  return {
    id: `path-${startMovie.id}`,
    themeTitle,
    description,
    path: [
      {
        movie: startMovie,
        connectionToNext: step2.connection,
      },
      {
        movie: step2.movie,
        connectionToNext: step3.connection,
      },
      {
        movie: step3.movie,
      },
    ],
  };
}

/**
 * Returns curated spotlight story paths starting with Inception (prompt example),
 * Vikram, Premam, and Lucia for instant visual storytelling.
 */
export function getCuratedStoryPaths(allMovies: Movie[]): StoryPath[] {
  const findMovie = (titleOrId: string) =>
    allMovies.find((m) => m.id === titleOrId || m.title.toLowerCase() === titleOrId.toLowerCase());

  const curatedDefinitions: {
    startId: string;
    secondId: string;
    thirdId: string;
    themeTitle: string;
    description: string;
  }[] = [
    {
      // The exact example requested in prompt: Inception -> The Prestige -> Memento
      startId: 'm1', // Inception
      secondId: 'm3', // The Prestige
      thirdId: 'm4', // Memento
      themeTitle: 'The Architecture of the Mind',
      description: 'Christopher Nolan’s signature trilogy of reality-bending obsessions, illusions, and fractured memories.',
    },
    {
      // Interstellar -> Arrival -> Blade Runner 2049
      startId: 'm2', // Interstellar
      secondId: 'm7', // Arrival
      thirdId: 'm8', // Blade Runner 2049
      themeTitle: 'Cosmic & Existential Horizons',
      description: 'Journey from relativity and wormholes to alien linguistics and existential cyberpunk dystopias.',
    },
    {
      // Vikram -> Kaithi -> The Dark Knight
      startId: 'm15', // Vikram
      secondId: 'm17', // Kaithi
      thirdId: 'm5', // The Dark Knight
      themeTitle: 'The Night-Siege Vigilante Thread',
      description: 'High-octane interconnected action cinema tracking masked justice, cartel sieges, and moral tests of heroism.',
    },
    {
      // Premam -> Bangalore Days -> Kumbalangi Nights
      startId: 'm11', // Premam
      secondId: 'm13', // Bangalore Days
      thirdId: 'm12', // Kumbalangi Nights
      themeTitle: 'Warmth, Brotherhood & Nostalgia',
      description: 'Soulful Malayalam storytelling exploring youth transitions, lifelong cousin bonds, and heartfelt family redemption.',
    },
    {
      // Drishyam -> Andhadhun -> Shutter Island
      startId: 'm14', // Drishyam
      secondId: 'm20', // Andhadhun
      thirdId: 'm9', // Shutter Island
      themeTitle: 'The Forensic Alibi & Psychological Twist',
      description: 'Gripping cat-and-mouse investigations where deceptive alibis, musical cover-ups, and shattered reality collide.',
    },
    {
      // Lucia -> Inception -> Shutter Island
      startId: 'm23', // Lucia
      secondId: 'm1', // Inception
      thirdId: 'm9', // Shutter Island
      themeTitle: 'Lucid Dreams & Dual Realities',
      description: 'Mind-bending psychological journeys exploring dream capsules, layered subconscious, and psychological mystery.',
    },
    {
      // Kantara -> Tumbbad -> RRR
      startId: 'm24', // Kantara
      secondId: 'm21', // Tumbbad
      thirdId: 'm22', // RRR
      themeTitle: 'Sacred Folklore & Mythic Fury',
      description: 'Visceral cinematic odysseys rooted in ancestral demigod rituals, mythological greed, and rebellion.',
    },
  ];

  const results: StoryPath[] = [];

  curatedDefinitions.forEach((def) => {
    const m1 = findMovie(def.startId);
    const m2 = findMovie(def.secondId);
    const m3 = findMovie(def.thirdId);

    if (m1 && m2 && m3) {
      const conn1 = calculateMovieConnection(m1, m2);
      const conn2 = calculateMovieConnection(m2, m3);

      results.push({
        id: `curated-${m1.id}-${m2.id}-${m3.id}`,
        themeTitle: def.themeTitle,
        description: def.description,
        path: [
          {
            movie: m1,
            connectionToNext: conn1.connection,
          },
          {
            movie: m2,
            connectionToNext: conn2.connection,
          },
          {
            movie: m3,
          },
        ],
      });
    }
  });

  return results;
}
