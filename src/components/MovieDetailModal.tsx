import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  Clock, 
  Calendar, 
  Bookmark, 
  Film, 
  Users, 
  Trash2, 
  ArrowRight, 
  GitCommit,
  Compass,
  Radio,
  Eye,
  EyeOff
} from 'lucide-react';
import { Movie } from '../types.ts';
import { computeStoryPath } from '../utils/storyPath.ts';
import { getMovieUniverseTheme } from '../utils/movieUniverseThemes.ts';
import { MovieUniverseCanvas } from './MovieUniverseCanvas.tsx';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movieId: string) => void;
  userRating?: number; // Saved 1-5 rating from localStorage
  onRateMovie: (movieId: string, rating: number) => void;
  onSelectDirector?: (directorName: string) => void;
  allMovies?: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  isInWatchlist,
  onToggleWatchlist,
  userRating = 0,
  onRateMovie,
  onSelectDirector,
  allMovies = [],
  onSelectMovie,
}) => {
  const [posterError, setPosterError] = useState(false);
  const [modalPathPosterErrors, setModalPathPosterErrors] = useState<Record<string, boolean>>({});
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isAtmosphereExpanded, setIsAtmosphereExpanded] = useState(false);

  useEffect(() => {
    setPosterError(false);
    setModalPathPosterErrors({});
    setTilt({ x: 0, y: 0 });
  }, [movie?.id]);

  const storyPath = useMemo(() => {
    if (!movie || allMovies.length === 0) return null;
    return computeStoryPath(movie, allMovies);
  }, [movie, allMovies]);

  const universeTheme = useMemo(() => {
    if (!movie) return null;
    return getMovieUniverseTheme(movie.id);
  }, [movie?.id]);

  if (!movie || !universeTheme) return null;

  const activeRating = hoverRating !== null ? hoverRating : userRating;

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Gentle 3D perspective tilt
    setTilt({ x: -(y * 5), y: x * 5 });
  };

  const handleContainerMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b ${universeTheme.bgGradient} backdrop-blur-xl animate-in fade-in duration-300 overflow-hidden select-none`}
    >
      {/* 3D Thematic Movie Universe Simulation Layer */}
      <MovieUniverseCanvas theme={universeTheme} interactive={true} />

      {/* Cinematic Ambient Radial Lighting & Fog Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${universeTheme.glowColor} 0%, transparent 65%)`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-black/75" />

      {/* Universe Quick Banner at Top of Screen */}
      <div className="absolute top-3 left-4 right-4 sm:top-5 sm:left-8 sm:right-8 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs shadow-lg pointer-events-auto">
          <span className="relative flex h-2 w-2">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: universeTheme.accentColor }}
            />
            <span 
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: universeTheme.accentColor }}
            />
          </span>
          <span className="font-semibold text-white tracking-wide">
            {universeTheme.universeName}
          </span>
          <span className="hidden sm:inline-block text-[11px] text-purple-300/80 font-mono border-l border-white/10 pl-2">
            {universeTheme.atmosphereBadge}
          </span>
        </div>

        {/* Atmosphere immersion toggle */}
        <button
          onClick={() => setIsAtmosphereExpanded(!isAtmosphereExpanded)}
          className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-purple-200 hover:text-white border border-white/10 text-xs transition-colors flex items-center gap-1.5 pointer-events-auto cursor-pointer shadow-md"
          title="Toggle cinema atmosphere view"
        >
          {isAtmosphereExpanded ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Show Movie Info</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Marvel Atmosphere</span>
            </>
          )}
        </button>
      </div>

      {/* Main Movie Detail Card Container with 3D Parallax & Depth */}
      <div 
        id="movie-detail-modal"
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          boxShadow: `0 25px 50px -12px ${universeTheme.glowColor}, 0 0 35px -5px ${universeTheme.glowColor}`,
          borderColor: universeTheme.borderColor,
          opacity: isAtmosphereExpanded ? 0.25 : 1,
        }}
        className="relative w-full max-w-3xl bg-[#0f0b21]/95 backdrop-blur-2xl border rounded-3xl overflow-hidden max-h-[88vh] sm:max-h-[90vh] flex flex-col transition-all duration-300 ease-out z-10"
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-[#090615]/90">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-xs font-semibold text-orange-400 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {movie.matchScore}% CineMatch Affinity
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/50 text-xs font-medium text-purple-200 border border-purple-800/40">
              {movie.vibe}
            </span>
          </div>

          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-colors border border-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thematic Atmosphere Banner */}
        <div className="px-5 sm:px-6 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs text-purple-200/90 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            <span className="font-semibold text-white">Atmosphere:</span>
            <span className="text-purple-300 font-light truncate max-w-[280px] sm:max-w-md">
              {universeTheme.tagline}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-400/80 font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">3D Motion Active</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-left select-text">
          
          {/* Main Info Section with Official Poster */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Poster Container: Consistent size, object-fit: contain, complete poster visible */}
            <div className="relative w-full sm:w-56 h-72 sm:h-80 flex-shrink-0">
              {/* Thematic Ambient Glow behind Poster */}
              <div 
                className="absolute -inset-1 rounded-2xl opacity-40 blur-lg pointer-events-none transition-all duration-500"
                style={{ backgroundColor: universeTheme.glowColor }}
              />
              
              <div className="relative w-full h-full bg-[#080512] rounded-2xl border border-purple-800/50 flex items-center justify-center p-2.5 overflow-hidden shadow-xl shadow-black/70">
                {movie.posterUrl && !posterError ? (
                  <img
                    src={movie.posterUrl}
                    alt={`${movie.title} (${movie.year}) official poster`}
                    className="w-full h-full object-contain drop-shadow-2xl select-none"
                    onError={() => setPosterError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-purple-300/60 space-y-2 select-none">
                    <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
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
              </div>
            </div>

            {/* Movie Header & Metadata */}
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {movie.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-purple-200/80 mt-2 font-medium">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> {movie.year}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" /> {movie.duration}
                  </span>
                  <span>•</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-900/80 border border-purple-600/50 text-xs font-semibold text-orange-300">
                    {movie.language} • {movie.industry}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-300 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {movie.rating} / 10
                  </span>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300/60 mb-1.5">
                  Synopsis
                </h4>
                <p className="text-sm text-purple-100/90 leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              {/* Cast & Director */}
              <div className="pt-2 border-t border-purple-900/40 text-xs text-purple-200/90 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Film className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="font-semibold text-purple-300">Director:</span>
                  <button
                    type="button"
                    id={`modal-director-link-${movie.director.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      onClose();
                      onSelectDirector?.(movie.director);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/90 hover:bg-orange-500/20 border border-orange-500/50 hover:border-orange-400 text-orange-400 hover:text-orange-300 font-bold text-xs transition-all cursor-pointer group/dir shadow-sm"
                    title={`Explore ${movie.director}'s Director Universe`}
                  >
                    <span>{movie.director}</span>
                    <Sparkles className="w-3 h-3 text-orange-400 group-hover/dir:rotate-12 transition-transform" />
                    <span className="text-[10px] text-purple-300/80 font-normal">
                      • Explore Universe
                    </span>
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Cast:</strong> {movie.cast.join(', ')}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {movie.genres.map(g => (
                  <span key={g} className="px-2.5 py-1 rounded-lg bg-[#1c1537] border border-purple-700/40 text-xs text-purple-200 font-medium">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 1–5 Star Rating Control (saved in localStorage) */}
          <div 
            id={`star-rating-control-${movie.id}`}
            className="p-4 rounded-2xl bg-[#17122e] border border-purple-700/50 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                  <span>Your Personal Rating (1–5 Stars)</span>
                </h4>
                <p className="text-xs text-purple-300/80 mt-0.5">
                  {userRating > 0
                    ? `You rated this film ${userRating} out of 5 stars (saved to your browser).`
                    : 'Click a star below to save your rating.'}
                </p>
              </div>

              {userRating > 0 && (
                <button
                  type="button"
                  id="btn-clear-rating"
                  onClick={() => onRateMovie(movie.id, 0)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-rose-950/60 border border-purple-800/40 hover:border-rose-500/50 text-purple-300 hover:text-rose-300 text-xs transition-colors cursor-pointer w-fit"
                  title="Remove saved rating"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Rating</span>
                </button>
              )}
            </div>

            {/* Interactive Stars */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeRating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      id={`rate-star-${starValue}`}
                      onClick={() => onRateMovie(movie.id, starValue === userRating ? 0 : starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 rounded-lg hover:bg-purple-900/40 transition-transform active:scale-95 cursor-pointer focus:outline-none"
                      aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : 'text-purple-400/30 hover:text-purple-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="ml-3 pl-3 border-l border-purple-800/40">
                <span className="text-sm font-bold text-amber-300">
                  {activeRating > 0 ? `${activeRating} / 5 Stars` : 'Unrated'}
                </span>
              </div>
            </div>
          </div>

          {/* Why CineMatch Recommended This */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-[#1e153a] border border-purple-800/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Why CineMatch recommends this to you</span>
            </div>
            <p className="text-sm text-purple-100 leading-relaxed">
              {movie.whyRecommended}
            </p>
          </div>

          {/* One Story Leads To Another: Visual Story Path */}
          {storyPath && (
            <div id="modal-one-story-leads-to-another" className="p-4 rounded-2xl bg-[#0f0a21] border border-orange-500/30 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-orange-400 rotate-90" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    One Story Leads To Another
                  </h5>
                </div>
                <span className="text-[10px] text-purple-300/60">
                  Recommended Storyline Path
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {storyPath.path.map((step, idx) => {
                  const m = step.movie;
                  const isCurrent = m.id === movie.id;
                  const isPosterFailed = modalPathPosterErrors[m.id] || !m.posterUrl;

                  return (
                    <div
                      key={`modal-story-${m.id}-${idx}`}
                      onClick={() => {
                        if (!isCurrent && onSelectMovie) {
                          onSelectMovie(m);
                        }
                      }}
                      className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-[#181135] border-orange-500/60 ring-1 ring-orange-500/20'
                          : 'bg-[#130d29] border-purple-800/40 hover:border-orange-400/60 cursor-pointer group/card'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                          isCurrent ? 'bg-orange-500 text-white' : 'bg-purple-950 text-purple-300 border border-purple-800/50'
                        }`}>
                          {idx === 0 ? 'Current Film' : `Next Step #${idx}`}
                        </span>
                        <span className="text-[10px] font-mono text-purple-300/80">
                          {m.year}
                        </span>
                      </div>

                      {/* Poster: strictly object-fit: contain */}
                      <div className="w-full h-36 bg-[#080512] rounded-lg p-1.5 flex items-center justify-center overflow-hidden mb-2 border border-purple-900/40">
                        {!isPosterFailed ? (
                          <img
                            src={m.posterUrl}
                            alt={`${m.title} official poster`}
                            className="w-full h-full object-contain drop-shadow-md select-none"
                            onError={() => setModalPathPosterErrors((prev) => ({ ...prev, [m.id]: true }))}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-center text-purple-300/60">
                            <Film className="w-4 h-4 text-purple-400 mb-1" />
                            <span className="text-[9px] uppercase font-bold text-purple-200">
                              Poster unavailable
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={`font-display font-bold text-xs truncate ${isCurrent ? 'text-orange-300' : 'text-white group-hover/card:text-orange-300'}`}>
                          {m.title}
                        </div>
                        <div className="text-[10px] text-purple-300/80 truncate">
                          {m.director}
                        </div>
                      </div>

                      {!isCurrent && (
                        <div className="mt-2 pt-1.5 border-t border-purple-900/40 flex items-center justify-between text-[10px] text-orange-400 font-semibold">
                          <span>Explore Next</span>
                          <ArrowRight className="w-3 h-3 group-hover/card:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between gap-4">
            <button
              id="modal-toggle-watchlist-btn"
              onClick={() => onToggleWatchlist(movie.id)}
              className={`flex-1 py-3 px-5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isInWatchlist
                  ? 'bg-purple-950/80 text-orange-300 border border-orange-500/50 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-500/50'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-950'
              }`}
            >
              {isInWatchlist ? (
                <>
                  <Bookmark className="w-4 h-4 fill-current text-orange-400" />
                  <span>Remove from Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl font-medium text-sm text-purple-300 hover:text-white bg-purple-950/40 border border-purple-800/40 hover:bg-purple-900/40 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
