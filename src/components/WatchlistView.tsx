import React, { useState } from 'react';
import { Bookmark, Sparkles, Trash2, Shuffle, CheckCircle, Clock, Film, ArrowRight } from 'lucide-react';
import { Movie } from '../types.ts';
import { MovieCard } from './MovieCard.tsx';

interface WatchlistViewProps {
  movies: Movie[];
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onGoToDiscover: () => void;
  userRatings: Record<string, number>;
  onRateMovie: (movieId: string, rating: number) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  movies,
  watchlist,
  onToggleWatchlist,
  onSelectMovie,
  onGoToDiscover,
  userRatings,
  onRateMovie,
}) => {
  const [watchedIds, setWatchedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cinematch_watched');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [randomPick, setRandomPick] = useState<Movie | null>(null);

  const watchlistMovies = movies.filter((m) => watchlist.includes(m.id));

  const toggleWatched = (movieId: string) => {
    const updated = watchedIds.includes(movieId)
      ? watchedIds.filter((id) => id !== movieId)
      : [...watchedIds, movieId];
    setWatchedIds(updated);
    try {
      localStorage.setItem('cinematch_watched', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handlePickRandom = () => {
    if (watchlistMovies.length === 0) return;
    const unwatched = watchlistMovies.filter((m) => !watchedIds.includes(m.id));
    const pool = unwatched.length > 0 ? unwatched : watchlistMovies;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setRandomPick(pool[randomIndex]);
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/80 via-[#181132] to-orange-950/40 border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
              <Bookmark className="w-4 h-4 text-orange-400" />
              <span>Personal Cinema Vault</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your CineMatch Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/70 mt-1 max-w-xl leading-relaxed">
              Curate and revisit movies saved from your personalized recommendations.
            </p>
          </div>

          {/* Quick Stats & Decider Button */}
          {watchlistMovies.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                id="btn-pick-random-film"
                onClick={handlePickRandom}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-orange-950 transition-all cursor-pointer whitespace-nowrap"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Roll Movie Night</span>
              </button>
            </div>
          )}
        </div>

        {/* Stats Row */}
        {watchlistMovies.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-purple-900/40 text-xs">
            <span className="text-purple-300">
              <strong className="text-white font-bold">{watchlistMovies.length}</strong> Saved in Vault
            </span>
            <span>•</span>
            <span className="text-purple-300">
              <strong className="text-emerald-400 font-bold">{watchedIds.filter(id => watchlist.includes(id)).length}</strong> Marked Watched
            </span>
            <span>•</span>
            <span className="text-purple-300">
              Average Match: <strong className="text-orange-400 font-bold">
                {Math.round(watchlistMovies.reduce((acc, m) => acc + m.matchScore, 0) / watchlistMovies.length)}%
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Random Pick Spotlight Modal / Alert */}
      {randomPick && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-orange-900/40 border border-orange-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                Tonight's Selected Feature
              </span>
              <h3 className="font-display text-base font-bold text-white">
                {randomPick.title} ({randomPick.year})
              </h3>
              <p className="text-xs text-purple-200/80">
                {randomPick.vibe} • {randomPick.duration} • {randomPick.matchScore}% Match
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectMovie(randomPick)}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 shadow-md shadow-orange-950 transition-colors"
            >
              Open Details
            </button>
            <button
              onClick={() => setRandomPick(null)}
              className="px-3 py-2 rounded-xl text-purple-300 hover:text-white text-xs bg-purple-950/40 border border-purple-800/40"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Watchlist Movie List */}
      {watchlistMovies.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#130f26] border border-purple-800/40 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-400 mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="font-display text-xl font-bold text-white">
              Your Watchlist is empty
            </h2>
            <p className="text-xs text-purple-300/70 mt-1 leading-relaxed">
              Explore CineMatch's personalized spotlight and curated mood matrix to bookmark films you'd like to experience.
            </p>
          </div>
          <button
            id="empty-watchlist-discover-btn"
            onClick={onGoToDiscover}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold text-xs shadow-lg shadow-orange-950 transition-all cursor-pointer"
          >
            <Film className="w-4 h-4" />
            <span>Discover Recommended Movies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistMovies.map((movie) => {
              const isWatched = watchedIds.includes(movie.id);
              return (
                <div key={movie.id} className="relative flex flex-col">
                  {/* Status toggle pill on top of card */}
                  <div className="mb-2 flex items-center justify-between text-xs px-1">
                    <button
                      onClick={() => toggleWatched(movie.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        isWatched
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-purple-950/40 text-purple-300/80 border-purple-800/40 hover:text-white'
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${isWatched ? 'text-emerald-400' : 'text-purple-400/60'}`} />
                      <span>{isWatched ? 'Watched' : 'Mark Watched'}</span>
                    </button>

                    <button
                      onClick={() => onToggleWatchlist(movie.id)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px] p-1 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <MovieCard
                    movie={movie}
                    isInWatchlist={true}
                    onToggleWatchlist={onToggleWatchlist}
                    onSelectMovie={onSelectMovie}
                    userRating={userRatings[movie.id]}
                    onRateMovie={onRateMovie}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
