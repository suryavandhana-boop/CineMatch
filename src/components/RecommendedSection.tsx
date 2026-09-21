import React, { useState } from 'react';
import { Sparkles, Film, Bookmark, ArrowUpRight, Star, Compass, Check } from 'lucide-react';
import { Movie, RecommendationItem } from '../types.ts';

interface RecommendedSectionProps {
  recommendations: RecommendationItem[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
  watchlist: string[];
  userRatings: Record<string, number>;
  onRateMovie: (movieId: string, rating: number) => void;
  hasUserInteractions: boolean;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  recommendations,
  onSelectMovie,
  onToggleWatchlist,
  watchlist,
  userRatings,
  onRateMovie,
  hasUserInteractions,
}) => {
  // Track failed poster URLs
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});

  const handlePosterError = (movieId: string) => {
    setFailedPosters((prev) => ({ ...prev, [movieId]: true }));
  };

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section id="recommended-for-you-section" className="space-y-6 text-left">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-[#191133] to-orange-950/40 border border-purple-800/40 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-1.5">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Content-Based Recommendation Engine</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Recommended For You
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl leading-relaxed">
            {hasUserInteractions
              ? "Calculated in real-time from movies you've rated and saved to your Watchlist—matching your favorite directors, genres, languages, and narrative themes."
              : "Explore these handpicked starting recommendations. Rate any movie or save it to your Watchlist to instantly update your tailored recommendations!"}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
            <Compass className="w-3.5 h-3.5 text-orange-400" />
            <span>{recommendations.length} Tailored Matches</span>
          </span>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item) => {
          const movie = item.movie;
          const isInWatchlist = watchlist.includes(movie.id);
          const userRating = userRatings[movie.id] || 0;
          const isPosterUnavailable = failedPosters[movie.id] || !movie.posterUrl;

          return (
            <div
              key={`rec-${movie.id}`}
              id={`rec-card-${movie.id}`}
              className="group rounded-3xl bg-[#140f28] border border-purple-800/40 hover:border-orange-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-950/30 flex flex-col overflow-hidden text-left"
            >
              {/* 1. Poster Container: strictly object-fit: contain, never cropped or stretched */}
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
                  id={`rec-quick-watchlist-${movie.id}`}
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

                {/* Top Left: Algorithm Match Pill */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-orange-500/60 text-orange-300 font-bold text-[11px] flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>{movie.matchScore}% Match</span>
                  </span>
                </div>
              </div>

              {/* 2. Recommendation Content */}
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

                  {/* Primary Metadata: Year, Director, Language */}
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

                  {/* Genres */}
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

                  {/* Required "Why this movie?" Explanation Box */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/80 to-[#1e153a] border border-purple-700/50 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-400 mb-1">
                      <Sparkles className="w-3 h-3 text-orange-400 flex-shrink-0" />
                      <span>Why this movie?</span>
                    </div>
                    <p className="text-xs text-purple-100 font-medium leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>

                {/* Rating & Actions Bar */}
                <div className="pt-2 border-t border-purple-900/40 space-y-2">
                  {/* Personal Rating Status */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-purple-400/80">Your Rating:</span>
                    {userRating > 0 ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold text-[11px]">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-2.5 h-2.5 ${
                                s <= userRating ? 'fill-amber-400 text-amber-400' : 'text-purple-400/40'
                              }`}
                            />
                          ))}
                        </div>
                        <span>({userRating}/5)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectMovie(movie)}
                        className="text-[11px] text-purple-400/70 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-2.5 h-2.5 text-purple-400/50" />
                        <span>Rate 1–5 ★</span>
                      </button>
                    )}
                  </div>

                  {/* Action Buttons: View Details & Watchlist */}
                  <div className="flex flex-col gap-2">
                    <button
                      id={`rec-view-details-${movie.id}`}
                      type="button"
                      onClick={() => onSelectMovie(movie)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold text-xs shadow-md shadow-orange-950/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer group/btn"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>

                    <button
                      id={`rec-watchlist-btn-${movie.id}`}
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
