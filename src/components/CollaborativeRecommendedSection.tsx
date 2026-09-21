import React, { useState } from 'react';
import { Users, Star, Sparkles, Film, Bookmark, ArrowUpRight, Check, Info, TrendingUp, HeartHandshake } from 'lucide-react';
import { Movie, CollaborativeRecommendation, SampleUser } from '../types.ts';
import { UserSimilarityResult } from '../utils/collaborativeFiltering.ts';

interface CollaborativeRecommendedSectionProps {
  recommendations: CollaborativeRecommendation[];
  userSimilarities: UserSimilarityResult[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
  watchlist: string[];
  userRatings: Record<string, number>;
  onRateMovie: (movieId: string, rating: number) => void;
  currentUserName?: string;
}

export const CollaborativeRecommendedSection: React.FC<CollaborativeRecommendedSectionProps> = ({
  recommendations,
  userSimilarities,
  onSelectMovie,
  onToggleWatchlist,
  watchlist,
  userRatings,
  onRateMovie,
  currentUserName = 'Surya',
}) => {
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});
  const [showMatrix, setShowMatrix] = useState(false);

  const handlePosterError = (movieId: string) => {
    setFailedPosters((prev) => ({ ...prev, [movieId]: true }));
  };

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const topMatch = userSimilarities[0];

  return (
    <section id="recommended-by-similar-viewers-section" className="space-y-6 text-left">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#170e30] via-[#21113b] to-[#1a0e28] border border-orange-500/30 shadow-xl shadow-purple-950/40">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Users className="w-4 h-4 text-orange-400" />
            <span>Collaborative Filtering System</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Recommended by Similar Viewers
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
            We analyzed rating patterns across our viewer community (User 1, User 2, User 3, User 4) to find people whose tastes match <span className="text-orange-300 font-semibold">{currentUserName}</span>'s. These are top-rated films they loved that {currentUserName} hasn't rated yet.
          </p>
        </div>

        {/* Similarities Insights Pill & Toggle */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 self-start lg:self-auto">
          {topMatch && (
            <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/40 border border-purple-700/60 text-xs text-purple-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Top Taste Twin: <strong className="text-orange-300">{topMatch.user.name}</strong> ({Math.round(topMatch.similarity * 100)}% match)
              </span>
            </div>
          )}

          <button
            type="button"
            id="toggle-taste-matrix-btn"
            onClick={() => setShowMatrix(!showMatrix)}
            className="px-3 py-1.5 rounded-xl bg-[#261647] hover:bg-[#341d5e] border border-orange-500/40 text-orange-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-orange-400" />
            <span>{showMatrix ? 'Hide Viewer Similarity Breakdown' : 'How Similar Viewers Were Matched'}</span>
          </button>
        </div>
      </div>

      {/* 2. Educational Taste Matrix Breakdown (Expandable) */}
      {showMatrix && (
        <div className="p-5 rounded-2xl bg-[#110c24] border border-purple-800/50 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <HeartHandshake className="w-4 h-4 text-orange-400" />
              <span>Taste Affinity Breakdown: {currentUserName} vs. Community Users</span>
            </div>
            <span className="text-[11px] text-purple-400">
              Updates in real-time as {currentUserName} rates movies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {userSimilarities.map((item) => {
              const pct = Math.round(item.similarity * 100);
              return (
                <div
                  key={item.user.id}
                  className="p-3.5 rounded-xl bg-[#181135] border border-purple-800/40 space-y-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{item.user.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 font-mono text-xs font-bold border border-orange-500/30">
                      {pct}% match
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-300/70 line-clamp-2">
                    {item.user.bio}
                  </p>
                  <div className="text-[10px] text-purple-400/90 pt-1 border-t border-purple-900/30">
                    {item.sharedMovieCount > 0 ? (
                      <span>Agreed on {item.sharedMovieCount} shared rating{item.sharedMovieCount > 1 ? 's' : ''}</span>
                    ) : (
                      <span>Baseline prior (rate more to calibrate)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => {
          const movie = rec.movie;
          const isInWatchlist = watchlist.includes(movie.id);
          const userRating = userRatings[movie.id] || 0;
          const isPosterUnavailable = failedPosters[movie.id] || !movie.posterUrl;

          return (
            <div
              key={`collab-${movie.id}`}
              id={`collab-card-${movie.id}`}
              className="group rounded-3xl bg-[#140f28] border border-orange-500/40 hover:border-orange-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-950/40 flex flex-col overflow-hidden text-left"
            >
              {/* Poster Container: strictly object-fit: contain, never cropped or stretched */}
              <div
                onClick={() => onSelectMovie(movie)}
                className="relative w-full h-80 sm:h-88 bg-[#090613] p-3 flex items-center justify-center overflow-hidden cursor-pointer border-b border-purple-900/40 group/poster"
              >
                {!isPosterUnavailable ? (
                  <img
                    src={movie.posterUrl}
                    alt={`${movie.title} (${movie.year}) official poster`}
                    className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover/poster:scale-[1.02] select-none"
                    onError={() => handlePosterError(movie.id)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-purple-300/60 space-y-2 select-none">
                    <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
                      <Film className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-purple-200/80 tracking-wider uppercase">
                      Poster unavailable
                    </span>
                    <span className="text-[10px] text-purple-400/60">
                      {movie.title} • {movie.year}
                    </span>
                  </div>
                )}

                {/* Top Corner: Quick Watchlist bookmark button */}
                <button
                  type="button"
                  id={`collab-quick-watchlist-${movie.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(movie.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md z-10 ${
                    isInWatchlist
                      ? 'bg-orange-500 text-white shadow-orange-950'
                      : 'bg-black/60 text-purple-200 hover:bg-black/80 hover:text-white border border-purple-700/40'
                  }`}
                  title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  aria-label={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-current text-white' : ''}`} />
                </button>

                {/* Top Left: Predicted Rating Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-500/70 text-amber-300 font-bold text-[11px] flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{rec.predictedRating.toFixed(1)}★ Predicted</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div>
                  {/* Title */}
                  <h3
                    onClick={() => onSelectMovie(movie)}
                    className="font-display font-bold text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-1 cursor-pointer"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>

                  {/* Year, Director, Language */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-purple-300/80 mt-1 mb-2">
                    <span className="font-mono text-purple-300">{movie.year}</span>
                    <span>•</span>
                    <span className="font-medium text-purple-100 truncate max-w-[150px]" title={movie.director}>
                      Dir. {movie.director}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/60 text-[11px] font-semibold text-orange-300">
                      {movie.language}
                    </span>
                  </div>

                  {/* Genres Chips */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-0.5 rounded-md bg-[#1d1637] border border-purple-800/40 text-[10px] font-medium text-purple-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* Rating/Reason for Recommendation Box */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#201438] to-purple-950/70 border border-orange-500/40 shadow-inner space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-orange-400">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider">
                        <Users className="w-3 h-3 text-orange-400" />
                        <span>Viewer Recommendation</span>
                      </span>
                      <span className="font-mono text-purple-300 text-[10px]">
                        {rec.similarityScore}% Viewer Affinity
                      </span>
                    </div>
                    <p className="text-xs text-purple-100 font-medium leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions: View Details, Watchlist & Rate Control */}
                <div className="pt-2 border-t border-purple-900/40 space-y-2">
                  {/* Rating prompt */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-purple-400/80">Rate to Calibrate:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          id={`collab-rate-${movie.id}-${star}`}
                          onClick={() => onRateMovie(movie.id, star)}
                          className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                          title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              userRating >= star
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-purple-400/40 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                      {userRating > 0 && (
                        <span className="text-[10px] font-bold text-amber-400 ml-1">
                          ({userRating}★)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      id={`collab-view-details-${movie.id}`}
                      type="button"
                      onClick={() => onSelectMovie(movie)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold text-xs shadow-md shadow-orange-950/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer group/btn"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>

                    <button
                      id={`collab-watchlist-btn-${movie.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(movie.id);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isInWatchlist
                          ? 'bg-purple-950/80 text-orange-300 border-orange-500/50 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-500/50'
                          : 'bg-[#1a1435] text-purple-200 border-purple-700/60 hover:bg-orange-500 hover:text-white hover:border-orange-400'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isInWatchlist ? 'fill-current text-orange-400' : ''}`} />
                      <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
