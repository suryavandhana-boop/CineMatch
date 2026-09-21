import { Movie, SampleUser, CollaborativeRecommendation } from '../types.ts';

/**
 * Built-in sample rating dataset for several fictional users (1–5 star ratings).
 * Provides diverse taste archetypes for the educational demonstration.
 */
export const SAMPLE_USERS: SampleUser[] = [
  {
    id: 'user_1',
    name: 'User 1',
    avatarColor: 'from-blue-500 to-indigo-600',
    bio: 'Sci-Fi, cerebral thrillers & Christopher Nolan enthusiast',
    ratings: {
      m1: 5,  // Inception
      m2: 5,  // Interstellar
      m3: 5,  // The Prestige
      m4: 4,  // Memento
      m5: 4,  // The Dark Knight
      m6: 5,  // Oppenheimer
      m7: 5,  // Arrival
      m8: 5,  // Blade Runner 2049
      m9: 4,  // Shutter Island
      m10: 3, // Whiplash
      m11: 2, // Premam
      m19: 3, // 3 Idiots
      m23: 5, // Lucia
    },
  },
  {
    id: 'user_2',
    name: 'User 2',
    avatarColor: 'from-emerald-500 to-teal-600',
    bio: 'South Indian neo-noir thrillers, family dramas & LCU action',
    ratings: {
      m1: 4,  // Inception
      m5: 4,  // The Dark Knight
      m11: 5, // Premam
      m12: 5, // Kumbalangi Nights
      m13: 4, // Bangalore Days
      m14: 5, // Drishyam
      m15: 5, // Vikram
      m16: 4, // 96
      m17: 5, // Kaithi
      m18: 5, // Super Deluxe
      m20: 4, // Andhadhun
      m23: 4, // Lucia
    },
  },
  {
    id: 'user_3',
    name: 'User 3',
    avatarColor: 'from-amber-500 to-orange-600',
    bio: 'High-octane spectacles, mythic action & adrenaline-pumping blockbusters',
    ratings: {
      m1: 4,  // Inception
      m5: 5,  // The Dark Knight
      m8: 3,  // Blade Runner 2049
      m10: 4, // Whiplash
      m14: 4, // Drishyam
      m15: 5, // Vikram
      m17: 5, // Kaithi
      m20: 3, // Andhadhun
      m21: 4, // Tumbbad
      m22: 5, // RRR
      m24: 5, // Kantara
    },
  },
  {
    id: 'user_4',
    name: 'User 4',
    avatarColor: 'from-pink-500 to-purple-600',
    bio: 'Intimate character dramas, emotional coming-of-age & poetic narratives',
    ratings: {
      m2: 4,  // Interstellar
      m3: 3,  // The Prestige
      m6: 4,  // Oppenheimer
      m7: 4,  // Arrival
      m10: 5, // Whiplash
      m11: 5, // Premam
      m12: 5, // Kumbalangi Nights
      m13: 5, // Bangalore Days
      m16: 5, // 96
      m18: 4, // Super Deluxe
      m19: 5, // 3 Idiots
    },
  },
];

export interface UserSimilarityResult {
  user: SampleUser;
  similarity: number; // 0 to 1
  sharedMovieCount: number;
  sharedRatings: {
    movieTitle: string;
    suryaRating: number;
    userRating: number;
  }[];
}

/**
 * Calculates similarity between Surya's ratings and a sample user's ratings.
 * Uses Euclidean distance inverted to [0, 1] scaled by overlap confidence.
 */
export function calculateUserSimilarity(
  suryaRatings: Record<string, number>,
  sampleUser: SampleUser,
  moviesById: Record<string, Movie>
): UserSimilarityResult {
  const sharedRatings: UserSimilarityResult['sharedRatings'] = [];
  let sumSquaredDiff = 0;
  let count = 0;

  for (const [movieId, suryaRating] of Object.entries(suryaRatings)) {
    if (suryaRating > 0 && sampleUser.ratings[movieId] !== undefined) {
      const userRating = sampleUser.ratings[movieId];
      sumSquaredDiff += Math.pow(suryaRating - userRating, 2);
      count++;
      
      const movie = moviesById[movieId];
      sharedRatings.push({
        movieTitle: movie ? movie.title : movieId,
        suryaRating,
        userRating,
      });
    }
  }

  if (count === 0) {
    return {
      user: sampleUser,
      similarity: 0.1, // baseline prior
      sharedMovieCount: 0,
      sharedRatings: [],
    };
  }

  // Mean Euclidean distance
  const meanSquaredError = sumSquaredDiff / count;
  const distance = Math.sqrt(meanSquaredError); // 0 (identical) to ~4
  // Invert distance to similarity [0, 1]: 1 / (1 + distance)
  const rawSimilarity = 1 / (1 + distance);

  // Confidence scaling based on number of shared movies (up to 3 shared films for full weight)
  const confidence = Math.min(1, count / 2.5);
  const similarity = Math.max(0.1, rawSimilarity * confidence);

  return {
    user: sampleUser,
    similarity: Math.round(similarity * 100) / 100,
    sharedMovieCount: count,
    sharedRatings,
  };
}

/**
 * Generates Collaborative Filtering recommendations for Surya.
 * Identifies movies that similar users rated highly (>= 4 stars)
 * which Surya has NOT rated yet.
 */
export function generateCollaborativeRecommendations(
  movies: Movie[],
  suryaRatings: Record<string, number>,
  limit: number = 6
): {
  recommendations: CollaborativeRecommendation[];
  userSimilarities: UserSimilarityResult[];
  activeUserRatingsCount: number;
} {
  const moviesById: Record<string, Movie> = {};
  movies.forEach((m) => {
    moviesById[m.id] = m;
  });

  // Calculate Surya's active ratings count
  const activeRatedMovieIds = Object.keys(suryaRatings).filter((id) => (suryaRatings[id] || 0) > 0);

  // 1. Calculate similarity between Surya and each sample user
  const userSimilarities = SAMPLE_USERS.map((sampleUser) =>
    calculateUserSimilarity(suryaRatings, sampleUser, moviesById)
  );

  // Sort users by similarity to Surya descending
  userSimilarities.sort((a, b) => b.similarity - a.similarity);

  // 2. Identify candidate movies that Surya has NOT rated yet
  const candidateScores: Record<
    string,
    {
      movie: Movie;
      weightedRatingSum: number;
      similarityWeightSum: number;
      topUser: string;
      topUserRating: number;
      topSimilarity: number;
      supportingUsers: { userName: string; rating: number; similarity: number }[];
    }
  > = {};

  userSimilarities.forEach(({ user, similarity }) => {
    // Only users with some positive similarity influence recommendations
    if (similarity <= 0) return;

    for (const [movieId, userRating] of Object.entries(user.ratings)) {
      // Must NOT be rated by Surya yet
      const suryaHasRated = (suryaRatings[movieId] || 0) > 0;
      if (suryaHasRated) continue;

      // Must be rated highly by the sample user (>= 4 stars)
      if (userRating < 4) continue;

      const movie = moviesById[movieId];
      if (!movie) continue;

      if (!candidateScores[movieId]) {
        candidateScores[movieId] = {
          movie,
          weightedRatingSum: 0,
          similarityWeightSum: 0,
          topUser: user.name,
          topUserRating: userRating,
          topSimilarity: similarity,
          supportingUsers: [],
        };
      }

      const cand = candidateScores[movieId];
      cand.weightedRatingSum += userRating * similarity;
      cand.similarityWeightSum += similarity;
      cand.supportingUsers.push({
        userName: user.name,
        rating: userRating,
        similarity: Math.round(similarity * 100),
      });

      if (similarity > cand.topSimilarity) {
        cand.topSimilarity = similarity;
        cand.topUser = user.name;
        cand.topUserRating = userRating;
      }
    }
  });

  // 3. Convert candidate scores into CollaborativeRecommendation items
  const recommendations: CollaborativeRecommendation[] = Object.values(candidateScores).map((cand) => {
    const predictedRating = cand.similarityWeightSum > 0
      ? Math.round((cand.weightedRatingSum / cand.similarityWeightSum) * 10) / 10
      : 4.0;

    const topSimPct = Math.round(cand.topSimilarity * 100);

    // Build educational reason text explaining the collaborative filtering match
    const reason = buildCollaborativeReason({
      movie: cand.movie,
      topUser: cand.topUser,
      topUserRating: cand.topUserRating,
      topSimPct,
      predictedRating,
      supportingCount: cand.supportingUsers.length,
    });

    return {
      movie: cand.movie,
      predictedRating,
      similarityScore: topSimPct,
      topSimilarUser: cand.topUser,
      similarUserRating: cand.topUserRating,
      reason,
      supportingUsers: cand.supportingUsers,
    };
  });

  // Sort by predicted rating descending, then by similarity score
  recommendations.sort((a, b) => {
    if (b.predictedRating !== a.predictedRating) {
      return b.predictedRating - a.predictedRating;
    }
    return b.similarityScore - a.similarityScore;
  });

  return {
    recommendations: recommendations.slice(0, limit),
    userSimilarities,
    activeUserRatingsCount: activeRatedMovieIds.length,
  };
}

interface ReasonParams {
  movie: Movie;
  topUser: string;
  topUserRating: number;
  topSimPct: number;
  predictedRating: number;
  supportingCount: number;
}

function buildCollaborativeReason(params: ReasonParams): string {
  const { topUser, topUserRating, topSimPct, predictedRating, supportingCount } = params;

  if (supportingCount > 1) {
    return `Rated ${topUserRating}★ by ${topUser} and ${supportingCount - 1} other viewer${
      supportingCount > 2 ? 's' : ''
    } with similar rating patterns (Predicted: ${predictedRating.toFixed(1)}★).`;
  }

  return `Rated ${topUserRating}★ by ${topUser}, who has a ${topSimPct}% rating similarity with Surya based on shared movie scores.`;
}
