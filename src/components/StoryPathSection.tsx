import React, { useState, useMemo } from 'react';
import { GitCommit, ArrowRight, Sparkles, Film, Compass, Play, Calendar, Star } from 'lucide-react';
import { Movie } from '../types.ts';
import { computeStoryPath, getCuratedStoryPaths, StoryPath } from '../utils/storyPath.ts';

interface StoryPathSectionProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onSelectDirector?: (directorName: string) => void;
}

export const StoryPathSection: React.FC<StoryPathSectionProps> = ({
  movies,
  onSelectMovie,
  onSelectDirector,
}) => {
  // Pre-calculated curated story paths (including prompt's exact Inception -> The Prestige -> Memento)
  const curatedPaths = useMemo(() => getCuratedStoryPaths(movies), [movies]);

  // Selected starting movie ID for generating path
  const [selectedMovieId, setSelectedMovieId] = useState<string>('m1'); // Inception as initial default

  // Failed poster tracker
  const [failedPosters, setFailedPosters] = useState<Record<string, boolean>>({});

  const handlePosterError = (movieId: string) => {
    setFailedPosters((prev) => ({ ...prev, [movieId]: true }));
  };

  // Active path: check if matches one of the curated paths, or compute dynamically
  const activePath: StoryPath = useMemo(() => {
    const matchedCurated = curatedPaths.find((p) => p.path[0].movie.id === selectedMovieId);
    if (matchedCurated) return matchedCurated;

    const startMovie = movies.find((m) => m.id === selectedMovieId) || movies[0];
    return computeStoryPath(startMovie, movies);
  }, [selectedMovieId, curatedPaths, movies]);

  const firstMovie = activePath.path[0]?.movie;

  return (
    <section id="one-story-leads-to-another-section" className="space-y-6 text-left">
      
      {/* 1. Header & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <GitCommit className="w-4 h-4 text-orange-400 rotate-90" />
            <span>Narrative Chains & Cinematic Bridges</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            One Story Leads To Another
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed font-light">
            Every great film is connected by invisible storytelling threads — shared auteurs, thematic genres, languages, and deep narrative keywords. Step onto a journey where one movie seamlessly flows into the next.
          </p>
        </div>

        {/* Dynamic Selector Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#140f29] p-1.5 rounded-2xl border border-purple-800/50 shadow-inner">
          <label htmlFor="story-start-select" className="text-[11px] font-semibold text-purple-300/80 pl-2">
            Start from:
          </label>
          <select
            id="story-start-select"
            value={selectedMovieId}
            onChange={(e) => setSelectedMovieId(e.target.value)}
            className="bg-[#1c143d] text-white text-xs font-semibold py-1.5 px-3 rounded-xl border border-purple-700/60 focus:outline-none focus:border-orange-400 cursor-pointer"
          >
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.year}) — {m.director}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Quick Curated Journey Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-bold text-purple-300/60 uppercase tracking-wider text-[10px] whitespace-nowrap">
          Featured Paths:
        </span>
        {curatedPaths.map((curated) => {
          const isSelected = selectedMovieId === curated.path[0].movie.id;
          const movieTitles = curated.path.map((p) => p.movie.title).join(' → ');

          return (
            <button
              key={curated.id}
              type="button"
              id={`curated-path-pill-${curated.path[0].movie.id}`}
              onClick={() => setSelectedMovieId(curated.path[0].movie.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border border-orange-400 shadow-orange-950/50'
                  : 'bg-[#15102a] text-purple-200/90 hover:text-white hover:bg-purple-900/50 border border-purple-800/40'
              }`}
              title={movieTitles}
            >
              <Sparkles className="w-3 h-3 text-orange-300" />
              <span>{curated.path[0].movie.title} → {curated.path[1].movie.title} → {curated.path[2]?.movie.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Journey Stage Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171032] via-[#1a1239] to-[#120b26] border border-orange-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/60 space-y-6">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-b from-orange-500/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Path Metadata Banner */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[11px] font-bold uppercase tracking-wider">
                Cinematic Journey
              </span>
              <span className="text-xs text-purple-300/70 font-mono">
                3 Connected Masterpieces
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              {activePath.themeTitle}
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-0.5 font-light">
              {activePath.description}
            </p>
          </div>

          {/* "Start Exploring" Action Button for the first movie */}
          {firstMovie && (
            <button
              type="button"
              id="start-exploring-path-btn"
              onClick={() => onSelectMovie(firstMovie)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-950/60 hover:shadow-orange-500/30 transition-all duration-300 cursor-pointer flex-shrink-0 group/start"
            >
              <Play className="w-4 h-4 fill-current text-white group-hover/start:scale-110 transition-transform" />
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4 group-hover/start:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* 4. Visual Path Pipeline: Movie -> Related Movie -> Related Movie */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {activePath.path.map((item, index) => {
            const movie = item.movie;
            const isPosterUnavailable = failedPosters[movie.id] || !movie.posterUrl;
            const isFirst = index === 0;
            const stepNumber = index + 1;

            return (
              <div
                key={`story-step-${movie.id}-${index}`}
                className="relative flex flex-col"
              >
                {/* Movie Card inside the Path */}
                <div
                  id={`story-path-card-${movie.id}`}
                  onClick={() => onSelectMovie(movie)}
                  className={`group h-full rounded-2xl bg-[#120c24] border transition-all duration-300 p-4 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-orange-950/40 text-left ${
                    isFirst
                      ? 'border-orange-500/60 hover:border-orange-400 ring-1 ring-orange-500/20'
                      : 'border-purple-800/40 hover:border-orange-500/50'
                  }`}
                >
                  {/* Top Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isFirst
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-900'
                          : 'bg-purple-900/80 text-purple-200 border border-purple-700/60'
                      }`}>
                        {stepNumber}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300/80">
                        {isFirst ? 'Starting Point' : `Related Movie #${index}`}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-black/60 border border-purple-800/50 text-[10px] font-semibold text-purple-300">
                      {movie.language}
                    </span>
                  </div>

                  {/* Poster Box: strictly object-fit: contain, never cropped or stretched */}
                  <div className="relative w-full h-64 sm:h-72 bg-[#090614] rounded-xl p-2 flex items-center justify-center overflow-hidden border border-purple-900/40 group-hover:border-purple-700/60 transition-colors">
                    {!isPosterUnavailable ? (
                      <img
                        src={movie.posterUrl}
                        alt={`${movie.title} (${movie.year}) directed by ${movie.director}`}
                        className="w-full h-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-[1.02] select-none"
                        onError={() => handlePosterError(movie.id)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-purple-300/60 space-y-2 select-none">
                        <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
                          <Film className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-purple-200/80 tracking-wider uppercase">
                          Poster unavailable
                        </span>
                        <span className="text-[10px] text-purple-400/60">
                          {movie.title} • {movie.year}
                        </span>
                      </div>
                    )}

                    {/* Badge: Year */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-purple-700/50 text-white font-mono text-[11px] font-bold">
                        {movie.year}
                      </span>
                    </div>
                  </div>

                  {/* Movie Info: Title, Year, Director */}
                  <div className="pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-base text-white group-hover:text-orange-400 transition-colors line-clamp-1" title={movie.title}>
                        {movie.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-purple-300/90 font-medium">
                        <span className="text-purple-400 font-semibold">Director:</span>
                        <span
                          onClick={(e) => {
                            if (onSelectDirector) {
                              e.stopPropagation();
                              onSelectDirector(movie.director);
                            }
                          }}
                          className="hover:text-orange-300 underline decoration-purple-600/40 hover:decoration-orange-400 transition-colors"
                        >
                          {movie.director}
                        </span>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {movie.genres.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded-md bg-[#1a1236] border border-purple-800/40 text-[10px] text-purple-300"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* View Details Hint */}
                    <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-orange-400 group-hover:text-orange-300 font-semibold">
                      <span>Click to view details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Visual Connection Bridge to Next Movie in the Pipeline */}
                {item.connectionToNext && (
                  <div className="hidden lg:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-950 border-2 border-[#171032]">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Connection Reason Badge beneath card */}
                {item.connectionToNext && (
                  <div className="mt-2 px-3 py-1.5 rounded-xl bg-[#140c2c] border border-orange-500/20 text-[11px] text-purple-200/90 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-400 flex-shrink-0" />
                    <span className="truncate">{item.connectionToNext.connectionReason}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Visual Breadcrumb Trail Header: Movie -> Related Movie -> Related Movie */}
        <div className="pt-3 border-t border-purple-800/40 flex items-center justify-center flex-wrap gap-2 text-xs font-semibold text-purple-300/80">
          <span className="text-[11px] uppercase tracking-wider text-purple-400/60">Story Chain:</span>
          {activePath.path.map((item, idx) => (
            <React.Fragment key={`crumb-${item.movie.id}-${idx}`}>
              <button
                type="button"
                onClick={() => onSelectMovie(item.movie)}
                className="hover:text-orange-400 transition-colors cursor-pointer"
              >
                {item.movie.title}
              </button>
              {idx < activePath.path.length - 1 && (
                <span className="text-orange-400 font-bold">→</span>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>

    </section>
  );
};
