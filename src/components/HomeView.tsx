import React, { useState, useMemo } from 'react';
import { Sparkles, Compass, Flame, Film, Bookmark, Check, ArrowRight, Play, Search, X, Star, Calendar, Clock } from 'lucide-react';
import { Movie } from '../types.ts';
import { MovieCard } from './MovieCard.tsx';
import { VIBES_LIST } from '../data/movies.ts';
import { RecommendedSection } from './RecommendedSection.tsx';
import { generateContentRecommendations } from '../utils/recommendations.ts';
import { CollaborativeRecommendedSection } from './CollaborativeRecommendedSection.tsx';
import { generateCollaborativeRecommendations } from '../utils/collaborativeFiltering.ts';
import { MoodRecommendationSection } from './MoodRecommendationSection.tsx';
import { DirectorUniverseSection } from './DirectorUniverseSection.tsx';
import { StoryPathSection } from './StoryPathSection.tsx';
import { RecommendationEvaluationSection } from './RecommendationEvaluationSection.tsx';

interface HomeViewProps {
  movies: Movie[];
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onExploreDiscover: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRatings: Record<string, number>;
  onRateMovie: (movieId: string, rating: number) => void;
  currentUserName?: string;
  onSelectDirector?: (directorName: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  movies,
  watchlist,
  onToggleWatchlist,
  onSelectMovie,
  onExploreDiscover,
  searchQuery,
  setSearchQuery,
  userRatings,
  onRateMovie,
  currentUserName = 'Surya',
  onSelectDirector,
}) => {
  const [selectedVibe, setSelectedVibe] = useState('All Vibes');
  const [spotlightPosterError, setSpotlightPosterError] = useState(false);

  // Spotlight movie is m1 (Inception)
  const spotlightMovie = movies[0];
  const isSpotlightInWatchlist = spotlightMovie ? watchlist.includes(spotlightMovie.id) : false;
  const spotlightUserRating = spotlightMovie ? (userRatings[spotlightMovie.id] || 0) : 0;

  // Check if user has active interactions (rated movies or watchlist items)
  const hasUserInteractions = useMemo(() => {
    const hasRatings = Object.values(userRatings).some((r) => r > 0);
    const hasWatchlist = watchlist.length > 0;
    return hasRatings || hasWatchlist;
  }, [userRatings, watchlist]);

  // Generate content-based recommendations dynamically using Genres, Director, Language, Keywords
  const contentRecommendations = useMemo(() => {
    return generateContentRecommendations(movies, watchlist, userRatings, 6);
  }, [movies, watchlist, userRatings]);

  // Generate Collaborative Filtering recommendations comparing Surya's ratings with Sample Users
  const collaborativeData = useMemo(() => {
    return generateCollaborativeRecommendations(movies, userRatings, 6);
  }, [movies, userRatings]);

  // Filter movies based on selected vibe and search query across: title, director, genre, language
  const filteredMovies = movies.filter((movie) => {
    const matchesVibe = selectedVibe === 'All Vibes' || movie.vibe === selectedVibe;
    const query = searchQuery.toLowerCase().trim();
    
    // Explicitly filters by title, director, genre, or language
    const matchesSearch =
      !query ||
      movie.title.toLowerCase().includes(query) ||
      movie.director.toLowerCase().includes(query) ||
      movie.genres.some((g) => g.toLowerCase().includes(query)) ||
      movie.language.toLowerCase().includes(query) ||
      movie.industry.toLowerCase().includes(query) ||
      movie.year.toString().includes(query);

    return matchesVibe && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. CineMatch Hero Spotlight (Original cinematic marquee layout) */}
      {!searchQuery && spotlightMovie && (
        <section 
          id="cinematch-spotlight" 
          className="relative rounded-3xl overflow-hidden border border-purple-800/40 bg-gradient-to-br from-[#1b1236] via-[#120e24] to-[#1c0f1e] p-6 sm:p-10 shadow-2xl shadow-purple-950/50"
        >
          {/* Ambient luminous glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-900/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Column: Spotlight Info */}
            <div className="flex-1 space-y-5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  CineMatch Spotlight
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-600/40 text-xs font-semibold text-purple-200">
                  {spotlightMovie.matchScore}% Match for you
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-950/80 text-xs text-orange-300 font-semibold border border-purple-800">
                  {spotlightMovie.language} • {spotlightMovie.industry}
                </span>
              </div>

              <div>
                <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {spotlightMovie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-purple-200/80 mt-2 font-medium">
                  <span className="font-mono text-purple-300">{spotlightMovie.year}</span>
                  <span>•</span>
                  <span>{spotlightMovie.duration}</span>
                  <span>•</span>
                  <span>Dir. {spotlightMovie.director}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-300 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {spotlightMovie.rating} / 10
                  </span>
                  {spotlightUserRating > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                        <Star className="w-3 h-3 fill-amber-400" />
                        Your Rating: {spotlightUserRating}/5
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm sm:text-base text-purple-100/90 max-w-2xl leading-relaxed">
                {spotlightMovie.synopsis}
              </p>

              {/* Rationale highlight */}
              <div className="p-3.5 rounded-2xl bg-[#0f0b20]/80 border border-purple-800/40 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CineMatch algorithmic verdict:</span>
                </div>
                <p className="text-xs text-purple-200/90 italic">
                  "{spotlightMovie.whyRecommended}"
                </p>
              </div>

              {/* Genres chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {spotlightMovie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-700/50 text-xs font-medium text-purple-200"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Spotlight CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="spotlight-view-details-btn"
                  onClick={() => onSelectMovie(spotlightMovie)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-orange-950/70 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Details</span>
                </button>

                <button
                  id="spotlight-watchlist-btn"
                  onClick={() => onToggleWatchlist(spotlightMovie.id)}
                  className={`px-5 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                    isSpotlightInWatchlist
                      ? 'bg-purple-950/80 text-orange-300 border-orange-500/50 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-500/50'
                      : 'bg-[#15102a]/80 text-purple-200 border-purple-700/60 hover:bg-orange-500 hover:text-white hover:border-orange-400'
                  }`}
                >
                  {isSpotlightInWatchlist ? (
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
              </div>
            </div>

            {/* Right Column: Visual Poster Frame */}
            <div 
              onClick={() => onSelectMovie(spotlightMovie)}
              className="w-full lg:w-72 h-80 sm:h-96 rounded-2xl bg-[#090613] border border-purple-700/60 p-3 shadow-2xl shadow-black/80 flex items-center justify-center cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              {spotlightMovie.posterUrl && !spotlightPosterError ? (
                <img
                  src={spotlightMovie.posterUrl}
                  alt={`${spotlightMovie.title} (${spotlightMovie.year}) theatrical poster`}
                  className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.02] select-none"
                  onError={() => setSpotlightPosterError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-purple-300/60 space-y-2 select-none">
                  <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
                    <Film className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-semibold text-purple-200/80 tracking-wider uppercase">
                    Poster unavailable
                  </span>
                  <span className="text-[11px] text-purple-400/60">
                    {spotlightMovie.title} • {spotlightMovie.year}
                  </span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="text-[11px] font-semibold text-purple-200/90 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-purple-800/40 inline-block group-hover:text-orange-300 transition-colors">
                  Click to View Full Details
                </span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 2. Search & Filter Bar: Filters by title, director, genre or language */}
      <section id="movie-search-section" className="space-y-4 text-left">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#130f28] border border-purple-800/50 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-orange-400" />
                <span>Find Movies</span>
              </h2>
              <p className="text-xs text-purple-300/70">
                Filter by title, director, genre, or original language
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear search</span>
              </button>
            )}
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input
              id="home-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, director, genre or language (e.g. Inception, Nolan, Sci-Fi, Malayalam, Tamil)..."
              className="w-full bg-[#181332] text-sm text-purple-100 placeholder-purple-400/50 rounded-xl pl-10 pr-9 py-2.5 border border-purple-700/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick search tags */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-purple-300/70 pt-1">
            <span className="font-semibold text-purple-300">Quick suggestions:</span>
            {[
              { label: 'Christopher Nolan', query: 'Christopher Nolan' },
              { label: 'Denis Villeneuve', query: 'Denis Villeneuve' },
              { label: 'Malayalam', query: 'Malayalam' },
              { label: 'Tamil', query: 'Tamil' },
              { label: 'Hindi', query: 'Hindi' },
              { label: 'Sci-Fi', query: 'Sci-Fi' },
              { label: 'Thriller', query: 'Thriller' },
              { label: 'Drama', query: 'Drama' },
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setSearchQuery(tag.query)}
                className={`px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  searchQuery.toLowerCase() === tag.query.toLowerCase()
                    ? 'bg-orange-500 text-white border-orange-400 font-semibold'
                    : 'bg-purple-950/60 border-purple-800/40 text-purple-300 hover:text-white hover:bg-purple-900/60'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Content-Based "Recommended For You" Section */}
      {!searchQuery && (
        <RecommendedSection
          recommendations={contentRecommendations}
          onSelectMovie={onSelectMovie}
          onToggleWatchlist={onToggleWatchlist}
          watchlist={watchlist}
          userRatings={userRatings}
          onRateMovie={onRateMovie}
          hasUserInteractions={hasUserInteractions}
        />
      )}

      {/* 4. Collaborative Filtering: "Recommended by Similar Viewers" */}
      {!searchQuery && (
        <CollaborativeRecommendedSection
          recommendations={collaborativeData.recommendations}
          userSimilarities={collaborativeData.userSimilarities}
          onSelectMovie={onSelectMovie}
          onToggleWatchlist={onToggleWatchlist}
          watchlist={watchlist}
          userRatings={userRatings}
          onRateMovie={onRateMovie}
          currentUserName={currentUserName}
        />
      )}

      {/* 5. "One Story Leads To Another" Narrative Journey Paths */}
      {!searchQuery && (
        <StoryPathSection
          movies={movies}
          onSelectMovie={onSelectMovie}
          onSelectDirector={onSelectDirector}
        />
      )}

      {/* 6. Mood-Based Recommendations: "Pick Your Mood" */}
      {!searchQuery && (
        <MoodRecommendationSection
          movies={movies}
          onSelectMovie={onSelectMovie}
          onToggleWatchlist={onToggleWatchlist}
          watchlist={watchlist}
          userRatings={userRatings}
          onRateMovie={onRateMovie}
        />
      )}

      {/* 6. Director Universe Showcase */}
      {!searchQuery && onSelectDirector && (
        <DirectorUniverseSection
          allMovies={movies}
          onSelectDirector={onSelectDirector}
        />
      )}

      {/* 7. Mood Matrix / CineMatch Vibe Selector */}
      <section id="mood-matrix-section" className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                Cinematic Mood Radar
              </h2>
            </div>
            <p className="text-xs text-purple-300/70 mt-0.5">
              Filter CineMatch selections by thematic vibe and narrative atmospheric wavelength
            </p>
          </div>

          <button
            onClick={onExploreDiscover}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vibe Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {VIBES_LIST.map((vibe) => {
            const isSelected = selectedVibe === vibe;
            return (
              <button
                key={vibe}
                id={`vibe-btn-${vibe.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedVibe(vibe)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950 font-semibold scale-105'
                    : 'bg-[#151028] text-purple-300/80 hover:text-white hover:bg-purple-900/50 border border-purple-800/40'
                }`}
              >
                {vibe}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. CineMatch Movie Card Grid */}
      <section id="movies-grid-section" className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">
            {searchQuery
              ? `Results for "${searchQuery}" (${filteredMovies.length})`
              : selectedVibe === 'All Vibes'
              ? 'Personalized Recommendations for You'
              : `${selectedVibe} Selections (${filteredMovies.length})`}
          </h3>
          <span className="text-xs text-purple-400/60 font-mono">
            {filteredMovies.length} {filteredMovies.length === 1 ? 'film' : 'films'}
          </span>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#130f26] border border-purple-800/40">
            <Compass className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
            <h4 className="font-display text-lg font-bold text-white mb-1">
              No matching cinema found
            </h4>
            <p className="text-xs text-purple-300/70 max-w-sm mx-auto mb-4">
              Try adjusting your search terms or choose a different vibe filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedVibe('All Vibes');
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 shadow-md shadow-orange-950"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWatchlist={watchlist.includes(movie.id)}
                onToggleWatchlist={onToggleWatchlist}
                onSelectMovie={onSelectMovie}
                userRating={userRatings[movie.id]}
                onRateMovie={onRateMovie}
              />
            ))}
          </div>
        )}
      </section>

      {/* 8. Recommendation Evaluation: Precision, Recall & F1 Score */}
      {!searchQuery && (
        <RecommendationEvaluationSection
          movies={movies}
          userRatings={userRatings}
          watchlist={watchlist}
          onSelectMovie={onSelectMovie}
          onSelectDirector={onSelectDirector}
        />
      )}

      {/* 9. Creative Double-Bill Featurette (Unique to CineMatch) */}
      <section 
        id="double-bill-featurette"
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/60 via-[#15102a] to-orange-950/40 border border-purple-700/40 text-left"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
          <Film className="w-4 h-4 text-orange-400" />
          <span>Curated Double-Bill Pairing</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-black text-white mb-2">
          The Contrast & Continuity Reel
        </h3>
        <p className="text-xs sm:text-sm text-purple-200/80 max-w-3xl leading-relaxed mb-6">
          Pairing <strong className="text-white">{movies[1]?.title || 'Interstellar'}</strong> ({movies[1]?.year} • {movies[1]?.genres.slice(0, 2).join(', ')}) with <strong className="text-white">{movies[2]?.title || 'The Prestige'}</strong> ({movies[2]?.year} • {movies[2]?.genres.slice(0, 2).join(', ')}) creates an enthralling double-bill exploring human ambition, obsession, and the grand mysteries of mind and cosmos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[movies[1], movies[2]].filter(Boolean).map((reelMovie) => (
            <div 
              key={reelMovie.id}
              className="p-4 rounded-2xl bg-[#100c22]/90 border border-purple-800/40 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-16 bg-black rounded-lg border border-purple-700/40 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img
                    src={reelMovie.posterUrl}
                    alt={reelMovie.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm">
                    {reelMovie.title} ({reelMovie.year})
                  </h4>
                  <p className="text-[11px] text-purple-300/70">
                    Dir. {reelMovie.director} • {reelMovie.language}
                  </p>
                  {userRatings[reelMovie.id] && (
                    <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Your Rating: {userRatings[reelMovie.id]}/5
                    </span>
                  )}
                </div>
              </div>

              <button
                id={`btn-double-bill-${reelMovie.id}`}
                onClick={() => onSelectMovie(reelMovie)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-orange-500 text-purple-200 hover:text-white border border-purple-700/40 text-xs font-semibold transition-all cursor-pointer flex-shrink-0"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
