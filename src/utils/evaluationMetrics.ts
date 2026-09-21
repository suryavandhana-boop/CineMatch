import { Movie } from '../types.ts';

export interface EvaluationResult {
  relevantRecommended: number; // Relevant Recommended Movies (True Positives)
  nonRelevantRecommended: number; // Non-Relevant Recommended Movies (False Positives)
  totalRecommended: number; // Total Recommended Movies
  relevantNotRecommended: number; // Relevant Movies Not Recommended (False Negatives)
  totalRelevant: number; // Total Relevant Movies
  precision: number; // 0 to 1
  recall: number; // 0 to 1
  f1Score: number; // 0 to 1
  precisionPercent: string; // "80.0%"
  recallPercent: string; // "66.7%"
  f1Percent: string; // "72.7%"
}

export interface EvaluationScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  relevantRecommended: number;
  totalRecommended: number;
  totalRelevant: number;
  sampleRelevantRecommendedTitles?: string[];
  sampleNonRelevantRecommendedTitles?: string[];
  sampleMissedRelevantTitles?: string[];
}

/**
 * Mathematically evaluates Precision, Recall, and F1 Score:
 *
 * Precision = Relevant Recommended Movies / Total Recommended Movies
 * Recall = Relevant Recommended Movies / Total Relevant Movies
 * F1 Score = 2 × (Precision × Recall) / (Precision + Recall)
 */
export function calculateEvaluationMetrics(
  relevantRecommended: number,
  totalRecommended: number,
  totalRelevant: number
): EvaluationResult {
  const safeRelRec = Math.max(0, relevantRecommended);
  const safeTotRec = Math.max(safeRelRec, totalRecommended);
  const safeTotRel = Math.max(safeRelRec, totalRelevant);

  const precision = safeTotRec > 0 ? safeRelRec / safeTotRec : 0;
  const recall = safeTotRel > 0 ? safeRelRec / safeTotRel : 0;

  const sumPr = precision + recall;
  const f1 = sumPr > 0 ? (2 * (precision * recall)) / sumPr : 0;

  const nonRelevantRecommended = safeTotRec - safeRelRec;
  const relevantNotRecommended = safeTotRel - safeRelRec;

  return {
    relevantRecommended: safeRelRec,
    nonRelevantRecommended,
    totalRecommended: safeTotRec,
    relevantNotRecommended,
    totalRelevant: safeTotRel,
    precision,
    recall,
    f1Score: f1,
    precisionPercent: `${(precision * 100).toFixed(1)}%`,
    recallPercent: `${(recall * 100).toFixed(1)}%`,
    f1Percent: `${(f1 * 100).toFixed(1)}%`,
  };
}

/**
 * Curated benchmark scenarios for educational demonstration
 */
export const SAMPLE_BENCHMARK_SCENARIOS: EvaluationScenario[] = [
  {
    id: 'balanced',
    name: 'Balanced Recommender',
    badge: 'Optimal Quality & Coverage',
    description: 'A well-tuned recommendation algorithm that strikes a healthy balance between precision and discovering unseen gems.',
    relevantRecommended: 4,
    totalRecommended: 5,
    totalRelevant: 6,
    sampleRelevantRecommendedTitles: ['Inception', 'The Prestige', 'Interstellar', 'Memento'],
    sampleNonRelevantRecommendedTitles: ['La La Land'],
    sampleMissedRelevantTitles: ['The Dark Knight', 'Arrival'],
  },
  {
    id: 'high-precision',
    name: 'Conservative Filter (High Precision)',
    badge: 'Near Zero Irrelevant Suggestions',
    description: 'Very strict confidence threshold. Almost everything recommended is relevant, but it misses several great films.',
    relevantRecommended: 3,
    totalRecommended: 3,
    totalRelevant: 8,
    sampleRelevantRecommendedTitles: ['Inception', 'The Dark Knight', 'The Prestige'],
    sampleNonRelevantRecommendedTitles: [],
    sampleMissedRelevantTitles: ['Interstellar', 'Memento', 'Arrival', 'Shutter Island', 'Blade Runner 2049'],
  },
  {
    id: 'high-recall',
    name: 'Broad Exploration (High Recall)',
    badge: 'Maximum Discovery Coverage',
    description: 'Aggressive discovery engine designed to catch almost all relevant titles, accepting occasional irrelevant results.',
    relevantRecommended: 7,
    totalRecommended: 10,
    totalRelevant: 8,
    sampleRelevantRecommendedTitles: ['Inception', 'Interstellar', 'The Prestige', 'Memento', 'Arrival', 'The Dark Knight', 'Shutter Island'],
    sampleNonRelevantRecommendedTitles: ['Vikram', 'Kaithi', 'Drishyam'],
    sampleMissedRelevantTitles: ['Blade Runner 2049'],
  },
];

/**
 * Evaluates live user metrics based on current rated movies (>=4 stars or watchlist)
 * and top collaborative / content-based recommendations
 */
export function calculateLiveUserMetrics(
  allMovies: Movie[],
  userRatings: Record<string, number>,
  watchlist: string[],
  recommendedMovieIds: string[]
): {
  metrics: EvaluationResult;
  relevantMovies: Movie[];
  recommendedMovies: Movie[];
  relevantRecommendedMovies: Movie[];
  nonRelevantRecommendedMovies: Movie[];
  missedRelevantMovies: Movie[];
} {
  // A movie is marked relevant if user rated it >= 4 stars OR added it to their watchlist
  const relevantIdSet = new Set<string>();

  Object.entries(userRatings).forEach(([id, rating]) => {
    if (rating >= 4) {
      relevantIdSet.add(id);
    }
  });

  watchlist.forEach((id) => relevantIdSet.add(id));

  // Fallback: If user has 0 ratings and 0 watchlist items, provide starter baseline so metrics work dynamically
  if (relevantIdSet.size === 0) {
    relevantIdSet.add('m1'); // Inception
    relevantIdSet.add('m5'); // The Dark Knight
    relevantIdSet.add('m3'); // The Prestige
  }

  // Recommended set
  let effectiveRecIds = [...recommendedMovieIds];
  if (effectiveRecIds.length === 0) {
    // Default fallback recommendations: top rated catalog titles
    effectiveRecIds = ['m1', 'm2', 'm3', 'm7', 'm15'];
  }

  const recIdSet = new Set(effectiveRecIds);

  const relevantRecommendedIds = effectiveRecIds.filter((id) => relevantIdSet.has(id));
  const nonRelevantRecommendedIds = effectiveRecIds.filter((id) => !relevantIdSet.has(id));
  const missedRelevantIds = Array.from(relevantIdSet).filter((id) => !recIdSet.has(id));

  const relevantRecommended = relevantRecommendedIds.length;
  const totalRecommended = effectiveRecIds.length;
  const totalRelevant = relevantIdSet.size;

  const metrics = calculateEvaluationMetrics(relevantRecommended, totalRecommended, totalRelevant);

  const findMovie = (id: string) => allMovies.find((m) => m.id === id);

  return {
    metrics,
    relevantMovies: Array.from(relevantIdSet).map(findMovie).filter(Boolean) as Movie[],
    recommendedMovies: effectiveRecIds.map(findMovie).filter(Boolean) as Movie[],
    relevantRecommendedMovies: relevantRecommendedIds.map(findMovie).filter(Boolean) as Movie[],
    nonRelevantRecommendedMovies: nonRelevantRecommendedIds.map(findMovie).filter(Boolean) as Movie[],
    missedRelevantMovies: missedRelevantIds.map(findMovie).filter(Boolean) as Movie[],
  };
}
