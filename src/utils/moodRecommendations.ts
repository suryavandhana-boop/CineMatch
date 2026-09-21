import { Movie } from '../types.ts';
import { getMovieKeywords } from './recommendations.ts';

export type MoodType =
  | 'Happy'
  | 'Romantic'
  | 'Emotional'
  | 'Thriller'
  | 'Mind-Bending'
  | 'Feel-Good'
  | 'Dark'
  | 'Inspirational';

export interface MoodConfig {
  mood: MoodType;
  emoji: string;
  tagline: string;
  explanationTemplate: string;
  genreKeywords: string[];
  themeKeywords: string[];
  accentGradient: string;
}

export const MOODS_CONFIG: MoodConfig[] = [
  {
    mood: 'Happy',
    emoji: '😄',
    tagline: 'Laughter, vibrant youth, and cheerful spirits',
    explanationTemplate: 'Recommended for a happy, joyful mood.',
    genreKeywords: ['comedy', 'romance', 'family'],
    themeKeywords: ['humor', 'college-life', 'friendship', 'campus', 'road-trip', 'youth', 'feel-good'],
    accentGradient: 'from-amber-500 to-yellow-500',
  },
  {
    mood: 'Romantic',
    emoji: '💖',
    tagline: 'Intimate chemistry, nostalgic longing, and deep affection',
    explanationTemplate: 'Recommended for a romantic, heartwarming mood.',
    genreKeywords: ['romance', 'drama'],
    themeKeywords: ['romance', 'childhood-sweethearts', 'poetic', 'unrequited-love', 'relationships', 'school-reunion', 'nostalgia'],
    accentGradient: 'from-rose-500 to-pink-500',
  },
  {
    mood: 'Emotional',
    emoji: '🥺',
    tagline: 'Deep family bonds, poetic warmth, and tear-jerking journeys',
    explanationTemplate: 'Recommended for an emotional and soul-stirring mood.',
    genreKeywords: ['drama', 'family', 'romance'],
    themeKeywords: ['family', 'brothers', 'father-daughter', 'nostalgia', 'unrequited-love', 'empathy', 'redemption', 'poetic', 'guilt'],
    accentGradient: 'from-purple-500 to-indigo-500',
  },
  {
    mood: 'Thriller',
    emoji: '⚡',
    tagline: 'Edge-of-your-seat suspense, cunning cat-and-mouse alibis, and high stakes',
    explanationTemplate: 'Recommended for a gripping thriller mood.',
    genreKeywords: ['thriller', 'crime', 'psychological thriller', 'action'],
    themeKeywords: ['investigation', 'cat-and-mouse', 'alibi', 'siege', 'narcotics', 'black-ops', 'paranoia', 'twist', 'murder', 'police', 'cover-up'],
    accentGradient: 'from-orange-500 to-red-600',
  },
  {
    mood: 'Mind-Bending',
    emoji: '🌀',
    tagline: 'Multi-layer dreamscapes, time anomalies, and psychological puzzles',
    explanationTemplate: 'Recommended for a mind-bending mood.',
    genreKeywords: ['sci-fi', 'mystery', 'psychological thriller', 'cyberpunk'],
    themeKeywords: ['mind-bending', 'dreams', 'subconscious', 'time-dilation', 'nonlinear', 'relativity', 'lucid-dreams', 'existential', 'amnesia', 'secrets'],
    accentGradient: 'from-indigo-500 to-violet-600',
  },
  {
    mood: 'Feel-Good',
    emoji: '✨',
    tagline: 'Unbreakable camaraderie, uplifting warmth, and infectious energy',
    explanationTemplate: 'Recommended for a feel-good, uplifting mood.',
    genreKeywords: ['comedy', 'family', 'drama'],
    themeKeywords: ['feel-good', 'friendship', 'cousins', 'college-life', 'humor', 'innovation', 'bromance', 'brothers', 'city-life'],
    accentGradient: 'from-emerald-500 to-teal-500',
  },
  {
    mood: 'Dark',
    emoji: '🌑',
    tagline: 'Mythic horrors, morally ambiguous noir, and psychological tension',
    explanationTemplate: 'Recommended for a dark, intense cinematic mood.',
    genreKeywords: ['horror', 'crime', 'dark comedy', 'black comedy', 'period fantasy'],
    themeKeywords: ['greed', 'demon', 'chaos', 'joker', 'corruption', 'murder', 'ancestral-curse', 'rain', 'asylum', 'guilt', 'trauma', 'taboo'],
    accentGradient: 'from-neutral-600 to-purple-950',
  },
  {
    mood: 'Inspirational',
    emoji: '🔥',
    tagline: 'Tenacious ambition, heroic courage, and boundary-pushing feats',
    explanationTemplate: 'Recommended for an inspirational, motivating mood.',
    genreKeywords: ['biography', 'drama', 'epic', 'music', 'adventure'],
    themeKeywords: ['ambition', 'perfectionism', 'freedom-struggle', 'innovation', 'drums', 'bromance', 'survival', 'rebellion', 'physics', 'mentor'],
    accentGradient: 'from-orange-500 to-amber-500',
  },
];

export interface MoodMovieMatch {
  movie: Movie;
  score: number;
  explanation: string;
  matchedGenreOrKeywords: string[];
}

/**
 * Returns matching movies for a chosen mood, scored by keyword and genre matches.
 */
export function getMoviesForMood(movies: Movie[], moodType: MoodType): MoodMovieMatch[] {
  const config = MOODS_CONFIG.find((c) => c.mood === moodType);
  if (!config) return [];

  const results: MoodMovieMatch[] = [];

  movies.forEach((movie) => {
    let score = 0;
    const matchedItems: string[] = [];

    // 1. Check Genre matches
    const lowerGenres = movie.genres.map((g) => g.toLowerCase());
    config.genreKeywords.forEach((gk) => {
      if (lowerGenres.some((lg) => lg.includes(gk) || gk.includes(lg))) {
        score += 3;
        matchedItems.push(gk);
      }
    });

    // 2. Check Keyword matches
    const keywords = getMovieKeywords(movie);
    config.themeKeywords.forEach((tk) => {
      if (keywords.includes(tk)) {
        score += 2;
        matchedItems.push(tk.replace('-', ' '));
      }
    });

    // Custom tailoring for special edge cases:
    if (moodType === 'Mind-Bending' && ['m1', 'm2', 'm3', 'm7', 'm8', 'm23', 'm4'].includes(movie.id)) {
      score += 4;
    }
    if (moodType === 'Thriller' && ['m14', 'm15', 'm17', 'm9', 'm20', 'm5', 'm4'].includes(movie.id)) {
      score += 4;
    }
    if (moodType === 'Romantic' && ['m16', 'm11', 'm13', 'm12'].includes(movie.id)) {
      score += 4;
    }
    if (moodType === 'Happy' && ['m19', 'm13', 'm11', 'm12'].includes(movie.id)) {
      score += 4;
    }
    if (moodType === 'Feel-Good' && ['m19', 'm13', 'm11', 'm12', 'm22'].includes(movie.id)) {
      score += 4;
    }
    if (moodType === 'Emotional' && ['m12', 'm16', 'm2', 'm13', 'm6'].includes(movie.id)) {
      score += 4;
    }
    if (moodType === 'Dark' && ['m21', 'm5', 'm20', 'm18', 'm9', 'm6'].includes(movie.id)) {
      score += 4;
    }
    if (moodType === 'Inspirational' && ['m19', 'm10', 'm22', 'm2', 'm6', 'm24'].includes(movie.id)) {
      score += 4;
    }

    if (score > 0) {
      results.push({
        movie,
        score,
        explanation: config.explanationTemplate,
        matchedGenreOrKeywords: Array.from(new Set(matchedItems)),
      });
    }
  });

  // Sort by score descending, then by movie matchScore / rating
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.movie.rating - a.movie.rating;
  });

  return results;
}
