import { Movie, RecommendationItem } from '../types.ts';

// Comprehensive thematic keywords mapping for all movies in the dataset
export const MOVIE_KEYWORDS_MAP: Record<string, string[]> = {
  m1: ['dreams', 'subconscious', 'heist', 'mind-bending', 'science-fiction', 'psychological', 'architecture', 'reality'],
  m2: ['space', 'wormhole', 'black-hole', 'relativity', 'science-fiction', 'time-dilation', 'father-daughter', 'survival', 'cosmic'],
  m3: ['magic', 'illusion', 'rivalry', 'obsession', 'secrets', '19th-century', 'science-fiction', 'teleportation'],
  m4: ['amnesia', 'memory-loss', 'investigation', 'nonlinear', 'psychological', 'mystery', 'noir', 'paranoia'],
  m5: ['vigilante', 'superhero', 'chaos', 'joker', 'crime', 'justice', 'corruption', 'gotham'],
  m6: ['atomic-bomb', 'physics', 'biography', 'morality', 'war', 'historical', 'guilt', 'manhattan-project'],
  m7: ['aliens', 'linguistics', 'communication', 'science-fiction', 'time', 'first-contact', 'philosophy'],
  m8: ['cyberpunk', 'dystopia', 'ai', 'replicants', 'science-fiction', 'existential', 'detective', 'future'],
  m9: ['asylum', 'investigation', 'psychological', 'guilt', 'twist', 'trauma', 'mystery', 'island'],
  m10: ['jazz', 'perfectionism', 'music', 'mentor', 'obsession', 'psychological', 'ambition', 'drums'],
  m11: ['coming-of-age', 'college-life', 'romance', 'nostalgia', 'friendship', 'humor', 'youth', 'kerala'],
  m12: ['family', 'brothers', 'backwaters', 'dysfunctional', 'redemption', 'relationships', 'coastal', 'empathy'],
  m13: ['cousins', 'friendship', 'city-life', 'youth', 'motocross', 'relationships', 'feel-good', 'romance'],
  m14: ['alibi', 'cinema', 'investigation', 'family-protection', 'cat-and-mouse', 'police', 'cover-up', 'crime'],
  m15: ['vigilante', 'narcotics', 'black-ops', 'cinematic-universe', 'high-octane', 'gangs', 'revenge', 'action'],
  m16: ['childhood-sweethearts', 'school-reunion', 'nostalgia', 'poetic', 'one-night', 'unrequited-love', 'romance'],
  m17: ['single-night', 'siege', 'lorry', 'father-daughter', 'drugs', 'survival', 'action-thriller', 'prison'],
  m18: ['hyperlink', 'taboo', 'dark-comedy', 'philosophy', 'provocative', 'destiny', 'chennai', 'transgender'],
  m19: ['engineering', 'education', 'friendship', 'campus', 'innovation', 'pressure', 'road-trip', 'comedy'],
  m20: ['blindness', 'piano', 'black-comedy', 'murder', 'deceit', 'crime', 'twist', 'moral-ambiguity'],
  m21: ['greed', 'folklore', 'demon', 'ancestral-curse', 'treasure', 'rain', 'horror', 'period'],
  m22: ['freedom-struggle', 'bromance', 'epic', 'colonial', 'fire-and-water', 'rebellion', 'mythic', 'action'],
  m23: ['lucid-dreams', 'insomnia', 'dual-life', 'cinema', 'nonlinear', 'science-fiction', 'psychological', 'identity'],
  m24: ['demigod', 'bhoota-kola', 'indigenous', 'ancestral-land', 'possession', 'mythology', 'rituals', 'forest'],
};

/**
 * Returns keywords for a given movie, checking the movie object first,
 * then falling back to the curated keywords map.
 */
export function getMovieKeywords(movie: Movie): string[] {
  if (movie.keywords && movie.keywords.length > 0) {
    return movie.keywords;
  }
  return MOVIE_KEYWORDS_MAP[movie.id] || [];
}

interface UserPreferenceSignal {
  movie: Movie;
  weight: number; // 0.1 to 1.5
  source: 'rating' | 'watchlist' | 'both';
  rating?: number;
}

/**
 * Generates personalized content-based recommendations using matching:
 * - Genres
 * - Director
 * - Language
 * - Keywords
 * 
 * Scaled by user rating or watchlist status.
 */
export function generateContentRecommendations(
  movies: Movie[],
  watchlist: string[],
  userRatings: Record<string, number>,
  limit: number = 6
): RecommendationItem[] {
  // 1. Gather user's explicit interaction signals (rated movies & watchlist items)
  const signals: UserPreferenceSignal[] = [];

  movies.forEach((m) => {
    const isWatchlist = watchlist.includes(m.id);
    const rating = userRatings[m.id];
    const hasRating = rating !== undefined && rating > 0;

    if (hasRating && isWatchlist) {
      // High intent: user both added to watchlist and rated it
      const ratingMultiplier = rating / 5; // e.g. 5★ = 1.0, 4★ = 0.8
      signals.push({
        movie: m,
        weight: 1.0 + ratingMultiplier * 0.5,
        source: 'both',
        rating,
      });
    } else if (hasRating) {
      // User rated the movie (higher stars = stronger affinity)
      const ratingMultiplier = rating / 5;
      signals.push({
        movie: m,
        weight: ratingMultiplier * 1.2,
        source: 'rating',
        rating,
      });
    } else if (isWatchlist) {
      // User saved to watchlist
      signals.push({
        movie: m,
        weight: 1.0,
        source: 'watchlist',
      });
    }
  });

  // If user has no ratings and no watchlist yet, fallback to using Spotlight / high affinity seeds
  const effectiveSignals = signals.length > 0
    ? signals
    : [{ movie: movies[0], weight: 1.0, source: 'watchlist' as const }];

  // Track movies the user has already interacted with
  const interactedIds = new Set(signals.map((s) => s.movie.id));

  // 2. Score candidate movies against user preferences
  const scoredItems: RecommendationItem[] = [];

  movies.forEach((candidate) => {
    // If the user already added it to watchlist or rated it 4-5 stars,
    // we prioritize fresh discoveries, though if few candidates exist, we can still show them.
    const isInteracted = interactedIds.has(candidate.id);

    const candidateKeywords = getMovieKeywords(candidate);
    let totalScore = 0;

    // Track matching evidence for the explanation
    const matchedDirectors = new Set<string>();
    const matchedGenres = new Set<string>();
    const matchedLanguages = new Set<string>();
    const matchedKeywords = new Set<string>();
    const matchedSeedTitles = new Set<string>();

    effectiveSignals.forEach((signal) => {
      const seed = signal.movie;
      if (seed.id === candidate.id) return; // Do not compare movie to itself

      const seedKeywords = getMovieKeywords(seed);
      let pairScore = 0;

      // 1. Director Match (High affinity: e.g. 4.0 pts)
      if (candidate.director.toLowerCase() === seed.director.toLowerCase()) {
        pairScore += 4.0;
        matchedDirectors.add(candidate.director);
      }

      // 2. Genre Matches (1.8 pts per shared genre)
      const commonGenres = candidate.genres.filter((g) =>
        seed.genres.some((sg) => sg.toLowerCase() === g.toLowerCase())
      );
      if (commonGenres.length > 0) {
        pairScore += commonGenres.length * 1.8;
        commonGenres.forEach((g) => matchedGenres.add(g));
      }

      // 3. Language Match (1.5 pts)
      if (candidate.language.toLowerCase() === seed.language.toLowerCase()) {
        pairScore += 1.5;
        matchedLanguages.add(candidate.language);
      }

      // 4. Keyword Matches (1.4 pts per shared keyword)
      const commonKeywords = candidateKeywords.filter((k) =>
        seedKeywords.some((sk) => sk.toLowerCase() === k.toLowerCase())
      );
      if (commonKeywords.length > 0) {
        pairScore += commonKeywords.length * 1.4;
        commonKeywords.forEach((k) => matchedKeywords.add(k));
      }

      // Apply seed weight (star rating or watchlist weight)
      if (pairScore > 0) {
        totalScore += pairScore * signal.weight;
        matchedSeedTitles.add(seed.title);
      }
    });

    // Deprioritize already-saved / already-rated items so recommendations offer new discoveries
    if (isInteracted) {
      totalScore *= 0.3;
    }

    if (totalScore > 0) {
      // 3. Construct a human-readable "Why this movie?" explanation
      const explanation = buildRecommendationExplanation({
        candidate,
        matchedDirectors: Array.from(matchedDirectors),
        matchedGenres: Array.from(matchedGenres),
        matchedLanguages: Array.from(matchedLanguages),
        matchedKeywords: Array.from(matchedKeywords),
        matchedSeedTitles: Array.from(matchedSeedTitles),
        hasCustomSignals: signals.length > 0,
      });

      scoredItems.push({
        movie: candidate,
        score: Math.round(totalScore * 10) / 10,
        explanation,
        matchedFeatures: {
          directors: Array.from(matchedDirectors),
          genres: Array.from(matchedGenres),
          languages: Array.from(matchedLanguages),
          keywords: Array.from(matchedKeywords),
        },
      });
    }
  });

  // Sort descending by score
  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems.slice(0, limit);
}

interface ExplanationParams {
  candidate: Movie;
  matchedDirectors: string[];
  matchedGenres: string[];
  matchedLanguages: string[];
  matchedKeywords: string[];
  matchedSeedTitles: string[];
  hasCustomSignals: boolean;
}

/**
 * Builds clear, concise, conversational "Why this movie?" rationale.
 * Example formats:
 * - "Because you liked Christopher Nolan movies and science-fiction."
 * - "Because you enjoy Lokesh Kanagaraj's high-octane Tamil thrillers."
 * - "Because you saved Inception (matching Sci-Fi, mind-bending themes, and English cinema)."
 */
function buildRecommendationExplanation(params: ExplanationParams): string {
  const {
    candidate,
    matchedDirectors,
    matchedGenres,
    matchedLanguages,
    matchedKeywords,
    matchedSeedTitles,
    hasCustomSignals,
  } = params;

  // Case 1: Matching Director & Genre
  if (matchedDirectors.length > 0 && matchedGenres.length > 0) {
    const director = matchedDirectors[0];
    const topGenre = matchedGenres[0].toLowerCase();
    return `Because you liked ${director} movies and ${topGenre}.`;
  }

  // Case 2: Matching Director only
  if (matchedDirectors.length > 0) {
    return `Because you liked movies directed by ${matchedDirectors[0]}.`;
  }

  // Case 3: Matching Multiple Genres & Keywords
  if (matchedGenres.length >= 2 && matchedKeywords.length > 0) {
    const g1 = matchedGenres[0];
    const g2 = matchedGenres[1];
    const k1 = matchedKeywords[0].replace('-', ' ');
    return `Because you enjoy ${g1} and ${g2} with ${k1} themes.`;
  }

  // Case 4: Matching Genres and Language
  if (matchedGenres.length > 0 && matchedLanguages.length > 0) {
    const genre = matchedGenres[0];
    const lang = matchedLanguages[0];
    return `Because you liked ${lang} ${genre.toLowerCase()} cinema.`;
  }

  // Case 5: Seed title match
  if (matchedSeedTitles.length > 0 && matchedGenres.length > 0) {
    const seed = matchedSeedTitles[0];
    const genre = matchedGenres.slice(0, 2).join(' & ');
    return `Because you showed interest in ${seed} (shares ${genre}).`;
  }

  // Case 6: Keywords & Language
  if (matchedKeywords.length > 0) {
    const keywordStr = matchedKeywords.slice(0, 2).map((k) => k.replace('-', ' ')).join(' and ');
    return `Because you liked movies with ${keywordStr} themes.`;
  }

  // Fallback default
  if (!hasCustomSignals) {
    return `Because you might enjoy ${candidate.genres.join(', ')} directed by ${candidate.director}.`;
  }

  return `Because it matches your cinematic preference for ${candidate.genres[0]} and ${candidate.language} cinema.`;
}
