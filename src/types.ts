export interface Movie {
  id: string;
  title: string;
  year: number;
  duration: string;
  rating: number; // out of 10 e.g. 8.8
  matchScore: number; // percentage e.g. 98
  genres: string[];
  director: string;
  synopsis: string;
  vibe: string;
  gradient: string; // Tailwind gradient classes for card poster
  accentColor: string; // 'purple' | 'orange'
  tag?: string;
  whyRecommended: string;
  cast: string[];
  language: string; // e.g. English, Malayalam, Tamil, Hindi, Telugu, Kannada
  industry: 'Hollywood' | 'Indian';
  posterUrl: string; // Verified theatrical poster url
  keywords?: string[]; // Thematic tags and narrative descriptors
}

export interface RecommendationItem {
  movie: Movie;
  score: number;
  explanation: string;
  matchedFeatures: {
    directors: string[];
    genres: string[];
    languages: string[];
    keywords: string[];
  };
}

export interface SampleUser {
  id: string;
  name: string;
  avatarColor: string;
  bio: string;
  ratings: Record<string, number>;
}

export interface CollaborativeRecommendation {
  movie: Movie;
  predictedRating: number;
  similarityScore: number; // 0 - 100%
  topSimilarUser: string;
  similarUserRating: number;
  reason: string;
  supportingUsers: {
    userName: string;
    rating: number;
    similarity: number;
  }[];
}

export interface UserProfile {
  username: string;
  email: string;
  isGuest: boolean;
  memberSince?: string;
}

export type NavTab = 'home' | 'discover' | 'directors' | 'watchlist' | 'profile';
