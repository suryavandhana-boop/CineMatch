import React, { useState } from 'react';
import { Film, Sparkles, ArrowLeft, Star, Bookmark, ArrowUpRight, Clapperboard, Globe } from 'lucide-react';
import { Movie } from '../types.ts';
import { FEATURED_DIRECTORS } from '../data/directors.ts';

interface DirectorUniverseViewProps {
  directorName: string;
  allMovies: Movie[];
  onSelectDirector: (name: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onBack: () => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  userRatings: Record<string, number>;
  onRateMovie: (movieId: string, rating: number) => void;
}

export const DirectorUniverseView: React.FC<DirectorUniverseViewProps> = ({
  directorName,
  allMovies,
  onSelectDirector,
  onSelectMovie,
  onBack,
  watchlist,
  onToggleWatchlist,
  userRatings,
  onRateMovie,
}) => {
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});

  const handlePosterError = (movieId: string) => {
    setFailedPosters((prev) => ({ ...prev, [movieId]: true }));
  };

  // Find all movies in current dataset by this director
  const directorMovies = allMovies.filter(
    (m) => m.director.toLowerCase() === directorName.toLowerCase()
  );

  // Director metadata from FEATURED_DIRECTORS
  const directorMeta = FEATURED_DIRECTORS.find(
    (d) => d.name.toLowerCase() === directorName.toLowerCase()
  );

  return (
    <div id="director-universe-view" className="space-y-8 pb-16 text-left">
      
      {/* 1. Top Navigation Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          id="director-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17112d] hover:bg-purple-900/60 border border-purple-800/50 text-purple-200 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-sm self-start"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Back to Browse</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-purple-300/70">
          <Clapperboard className="w-4 h-4 text-orange-400" />
          <span>Director Filmography • CineMatch Curated Universe</span>
        </div>
      </div>

      {/* 2. Director Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1038] via-[#211444] to-[#170e2c] border border-orange-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/60">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Director Universe</span>
              </span>
              {directorMeta && (
                <span className="px-2.5 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-medium flex items-center gap-1">
                  <Globe className="w-3 h-3 text-purple-400" />
                  <span>{directorMeta.industry} ({directorMeta.primaryLanguage})</span>
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {directorName}
            </h1>

            {directorMeta?.signatureStyle && (
              <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-light">
                <strong className="text-orange-300 font-semibold">Signature Cinematic Hallmarks:</strong> {directorMeta.signatureStyle}
              </p>
            )}

            {directorMeta?.quote && (
              <blockquote className="border-l-2 border-orange-500/60 pl-3 py-0.5 text-xs text-purple-300/70 italic">
                "{directorMeta.quote}"
              </blockquote>
            )}
          </div>

          {/* Stats Badge */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 p-4 rounded-2xl bg-[#110b24]/90 border border-purple-800/60 shadow-inner flex-shrink-0 self-stretch sm:self-auto">
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-mono">
                {directorMovies.length}
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-purple-300/70">
                Films in Dataset
              </div>
            </div>

            <div className="h-px w-full bg-purple-900/50 sm:hidden md:block" />

            <div className="text-center text-xs text-purple-200">
              <span className="text-amber-400 font-bold">
                ★ {(directorMovies.reduce((acc, m) => acc + m.rating, 0) / (directorMovies.length || 1)).toFixed(1)}
              </span>
              <span className="text-[10px] text-purple-400/80 block">Avg. Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Director Switcher Carousel / Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-purple-300/70 flex items-center gap-1.5">
            <Clapperboard className="w-3.5 h-3.5 text-orange-400" />
            <span>Switch Director Universe:</span>
          </span>
          <span className="text-[11px] text-purple-400/60">
            {FEATURED_DIRECTORS.length} Curated Auteurs
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FEATURED_DIRECTORS.map((dir) => {
            const isSelected = dir.name.toLowerCase() === directorName.toLowerCase();
            const count = allMovies.filter((m) => m.director.toLowerCase() === dir.name.toLowerCase()).length;

            return (
              <button
                key={dir.name}
                type="button"
                id={`switch-director-${dir.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectDirector(dir.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-950/60 scale-105 border border-orange-400 font-bold'
                    : 'bg-[#151028] text-purple-200/90 hover:text-white hover:bg-purple-900/50 border border-purple-800/40'
                }`}
              >
                <span>{dir.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-black/30 text-white' : 'bg-purple-950 text-purple-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Filmography Movies Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Films by {directorName}</span>
            <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800/60 text-orange-400">
              {directorMovies.length} Available
            </span>
          </h2>
        </div>

        {directorMovies.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#140f28] border border-purple-800/40 text-purple-300/70">
            No films found for {directorName} in current dataset.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {directorMovies.map((movie) => {
              const isInWatchlist = watchlist.includes(movie.id);
              const userRating = userRatings[movie.id] || 0;
              const isPosterUnavailable = failedPosters[movie.id] || !movie.posterUrl;

              return (
                <div
                  key={`director-movie-${movie.id}`}
                  id={`director-movie-card-${movie.id}`}
                  className="group rounded-3xl bg-[#140f28] border border-purple-800/40 hover:border-orange-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-950/30 flex flex-col overflow-hidden text-left"
                >
                  {/* Poster Box: strictly object-fit: contain, never cropped or stretched */}
                  <div
                    onClick={() => onSelectMovie(movie)}
                    className="relative w-full h-80 sm:h-88 bg-[#090613] p-3 flex items-center justify-center overflow-hidden cursor-pointer border-b border-purple-900/40 group/poster"
                  >
                    {!isPosterUnavailable ? (
                      <img
                        src={movie.posterUrl}
                        alt={`${movie.title} (${movie.year}) official poster directed by ${movie.director}`}
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

                    {/* Quick Watchlist toggle button */}
                    <button
                      type="button"
                      id={`director-watchlist-quick-${movie.id}`}
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

                    {/* Top Left: Year & Rating Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-purple-700/50 text-white font-mono text-xs font-bold">
                        {movie.year}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{movie.rating}</span>
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

                      {/* Required Metadata: Year, Language, Director */}
                      <div className="flex items-center flex-wrap gap-2 text-xs text-purple-300/80 mt-1 mb-2">
                        <span className="font-mono text-purple-300">{movie.year}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/60 text-[11px] font-semibold text-orange-300">
                          {movie.language}
                        </span>
                        <span>•</span>
                        <span className="text-purple-300 text-[11px]">
                          {movie.duration}
                        </span>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {movie.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-0.5 rounded-md bg-[#1d1637] border border-purple-800/40 text-[10px] font-medium text-purple-300"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      {/* Synopsis excerpt */}
                      <p className="text-xs text-purple-200/80 line-clamp-2 leading-relaxed">
                        {movie.synopsis}
                      </p>
                    </div>

                    {/* Bottom Action Controls */}
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
                                id={`director-movie-rate-${movie.id}-${s}`}
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
                          id={`director-view-details-${movie.id}`}
                          type="button"
                          onClick={() => onSelectMovie(movie)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold text-xs shadow-md shadow-orange-950/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer group/btn"
                        >
                          <span>View Movie Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>

                        <button
                          id={`director-watchlist-btn-${movie.id}`}
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
        )}
      </div>

    </div>
  );
};
