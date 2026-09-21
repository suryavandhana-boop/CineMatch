import React, { useState } from 'react';
import { Star, Bookmark, Sparkles, Clock, Calendar, ArrowUpRight, Film } from 'lucide-react';
import { Movie } from '../types.ts';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  onToggleWatchlist: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  userRating?: number; // Saved 1-5 rating from localStorage
  onRateMovie?: (movieId: string, rating: number) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isInWatchlist,
  onToggleWatchlist,
  onSelectMovie,
  userRating,
  onRateMovie,
}) => {
  const [posterError, setPosterError] = useState(false);

  return (
    <div 
      id={`movie-card-${movie.id}`}
      className="group relative flex flex-col rounded-2xl bg-[#141026] border border-purple-900/40 hover:border-purple-600/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/60 hover:-translate-y-1"
    >
      {/* 1. Visual Poster Frame: Consistent container width and height, object-fit: contain, complete poster visible */}
      <div 
        onClick={() => onSelectMovie(movie)}
        className="relative h-80 sm:h-84 w-full bg-[#090613] p-2.5 flex items-center justify-center cursor-pointer overflow-hidden border-b border-purple-900/40"
      >
        {/* Subtle radial aura behind poster */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-transparent to-black/80 pointer-events-none" />

        {/* Poster Image or Fallback */}
        {movie.posterUrl && !posterError ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} (${movie.year}) official poster`}
            className="w-full h-full object-contain drop-shadow-2xl select-none transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setPosterError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-purple-300/60 space-y-2 select-none">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 shadow-inner">
              <Film className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-purple-200/80 tracking-wider uppercase">
              Poster unavailable
            </span>
            <span className="text-[11px] text-purple-400/60">
              {movie.title} • {movie.year}
            </span>
          </div>
        )}

        {/* Top bar on poster: Match Score & Watchlist button */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d0918]/85 backdrop-blur-md border border-purple-500/40 text-xs font-semibold text-white shadow-md shadow-black/70">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-bold">
              {movie.matchScore}% Match
            </span>
          </div>

          <button
            id={`btn-watchlist-${movie.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie.id);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-md shadow-black/70 ${
              isInWatchlist
                ? 'bg-orange-500 text-white border-orange-400 shadow-orange-950/50'
                : 'bg-[#0d0918]/80 text-purple-200 border-purple-700/50 hover:bg-purple-900 hover:text-white'
            }`}
            title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isInWatchlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom bar on poster: Vibe Pill & Critic Rating */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between text-xs pointer-events-none">
          <span className="pointer-events-auto px-2.5 py-0.5 rounded-full bg-[#0d0918]/90 backdrop-blur-md border border-purple-700/50 text-purple-200 text-[11px] font-medium shadow-md shadow-black/60">
            {movie.vibe}
          </span>
          <div className="pointer-events-auto flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0d0918]/90 backdrop-blur-md border border-amber-500/40 text-amber-300 font-semibold text-[11px] shadow-md shadow-black/60">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* 2. Card Content & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title & Clickable Link */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 
              onClick={() => onSelectMovie(movie)}
              className="font-display font-bold text-base sm:text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-1 cursor-pointer"
              title={movie.title}
            >
              {movie.title}
            </h3>
          </div>

          {/* Primary Metadata: Year, Language, Director */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-purple-300/70 mb-2">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-purple-400" />
              {movie.year}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/60 text-[11px] font-semibold text-orange-300">
              {movie.language}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-purple-200/90 truncate max-w-[130px]" title={movie.director}>
              <Film className="w-3 h-3 text-orange-400 flex-shrink-0" />
              <span>{movie.director}</span>
            </span>
          </div>

          {/* Genres Chips */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-md bg-[#1d1637] border border-purple-800/40 text-[10px] font-medium text-purple-300"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* User's Saved Rating Indicator (if rated) */}
          <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between text-xs">
            <span className="text-[11px] text-purple-400/80">User Rating:</span>
            {userRating ? (
              <div 
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold text-[11px]"
                title={`You rated this ${userRating} out of 5 stars`}
              >
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
                className="text-[11px] text-purple-400/60 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Star className="w-2.5 h-2.5 text-purple-400/50" />
                <span>Rate 1–5 ★</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Card Action Buttons: View Details & Watchlist */}
        <div className="pt-2 border-t border-purple-900/40 flex flex-col gap-2">
          <button
            id={`btn-view-details-${movie.id}`}
            type="button"
            onClick={() => onSelectMovie(movie)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold text-xs shadow-md shadow-orange-950/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer group/btn"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>

          <button
            id={`btn-watchlist-action-${movie.id}`}
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
  );
};
