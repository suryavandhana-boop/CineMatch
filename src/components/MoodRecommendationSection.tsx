import React, { useState } from 'react';
import { Sparkles, Film, Bookmark, ArrowUpRight, Star } from 'lucide-react';
import { Movie } from '../types.ts';
import { MOODS_CONFIG, MoodType, getMoviesForMood } from '../utils/moodRecommendations.ts';

interface MoodRecommendationSectionProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
  watchlist: string[];
  userRatings: Record<string, number>;
  onRateMovie: (movieId: string, rating: number) => void;
}

export const MoodRecommendationSection: React.FC<MoodRecommendationSectionProps> = ({
  movies,
  onSelectMovie,
  onToggleWatchlist,
  watchlist,
  userRatings,
  onRateMovie,
}) => {
  // Default mood to "Mind-Bending"
  const [selectedMood, setSelectedMood] = useState<MoodType>('Mind-Bending');
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});

  const handlePosterError = (movieId: string) => {
    setFailedPosters((prev) => ({ ...prev, [movieId]: true }));
  };

  const activeMoodConfig = MOODS_CONFIG.find((m) => m.mood === selectedMood) || MOODS_CONFIG[4];
  const matchingMovies = getMoviesForMood(movies, selectedMood);

  return (
    <section id="pick-your-mood-section" className="space-y-6 text-left">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1b1035] via-[#24133f] to-[#1e0f2d] border border-orange-500/30 shadow-xl shadow-purple-950/40">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Atmospheric Sentiment & Vibe Matcher</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pick Your Mood
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
            Select how you want to feel right now. We analyze each film's genres, narrative themes, and keywords to surface movies tailored to your exact emotional frequency.
          </p>
        </div>

        {/* Selected Mood Active Indicator */}
        <div className="px-4 py-2 rounded-2xl bg-purple-900/50 border border-orange-500/40 text-xs text-purple-200 flex items-center gap-2 self-start lg:self-auto shadow-sm">
          <span className="text-lg">{activeMoodConfig.emoji}</span>
          <div>
            <div className="text-[10px] uppercase font-bold text-orange-400">Active Mood</div>
            <div className="font-bold text-white text-xs">{selectedMood} • {matchingMovies.length} Selections</div>
          </div>
        </div>
      </div>

      {/* 2. Mood Options Selector Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOODS_CONFIG.map((config) => {
            const isSelected = selectedMood === config.mood;
            return (
              <button
                key={config.mood}
                type="button"
                id={`mood-btn-${config.mood.toLowerCase()}`}
                onClick={() => setSelectedMood(config.mood)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-950/60 scale-105 border border-orange-400'
                    : 'bg-[#151028] text-purple-200/90 hover:text-white hover:bg-purple-900/50 border border-purple-800/50'
                }`}
              >
                <span className="text-sm">{config.emoji}</span>
                <span>{config.mood}</span>
              </button>
            );
          })}
        </div>

        {/* Tagline for active mood */}
        <div className="px-1 text-xs text-purple-300/70 italic flex items-center gap-1.5">
          <span>{activeMoodConfig.emoji}</span>
          <span>{activeMoodConfig.tagline}</span>
        </div>
      </div>

      {/* 3. Matching Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchingMovies.map(({ movie, explanation }) => {
          const isInWatchlist = watchlist.includes(movie.id);
          const userRating = userRatings[movie.id] || 0;
          const isPosterUnavailable = failedPosters[movie.id] || !movie.posterUrl;

          return (
            <div
              key={`mood-${selectedMood}-${movie.id}`}
              id={`mood-movie-card-${movie.id}`}
              className="group rounded-3xl bg-[#140f28] border border-purple-800/40 hover:border-orange-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-950/30 flex flex-col overflow-hidden text-left"
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
                  id={`mood-quick-watchlist-${movie.id}`}
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

                {/* Top Left: Mood Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-orange-500/60 text-orange-300 font-bold text-[11px] flex items-center gap-1 shadow-md">
                    <span>{activeMoodConfig.emoji}</span>
                    <span>{selectedMood} Mood</span>
                  </span>
                </div>
              </div>

              {/* Card Details Body */}
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

                  {/* Metadata: Year, Director, Language */}
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

                  {/* Required "Recommended for a [mood] mood" Explanation Box */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/80 to-[#1e153a] border border-purple-700/50 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-400 mb-1">
                      <Sparkles className="w-3 h-3 text-orange-400 flex-shrink-0" />
                      <span>Mood Match Rationale</span>
                    </div>
                    <p className="text-xs text-purple-100 font-medium leading-relaxed">
                      {explanation}
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
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            id={`mood-rate-${movie.id}-${s}`}
                            onClick={() => onRateMovie(movie.id, s)}
                            className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                            title={`Rate ${s} star${s > 1 ? 's' : ''}`}
                          >
                            <Star className="w-3 h-3 text-purple-400/50 hover:text-amber-300" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: View Details & Watchlist */}
                  <div className="flex flex-col gap-2">
                    <button
                      id={`mood-view-details-${movie.id}`}
                      type="button"
                      onClick={() => onSelectMovie(movie)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold text-xs shadow-md shadow-orange-950/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer group/btn"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>

                    <button
                      id={`mood-watchlist-btn-${movie.id}`}
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
