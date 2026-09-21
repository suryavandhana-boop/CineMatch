import React, { useState } from 'react';
import { Search, Compass, SlidersHorizontal, Star, Sparkles, X } from 'lucide-react';
import { Movie } from '../types.ts';
import { MovieCard } from './MovieCard.tsx';
import { GENRES_LIST } from '../data/movies.ts';

interface DiscoverViewProps {
  movies: Movie[];
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRatings: Record<string, number>;
  onRateMovie: (movieId: string, rating: number) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  movies,
  watchlist,
  onToggleWatchlist,
  onSelectMovie,
  searchQuery,
  setSearchQuery,
  userRatings,
  onRateMovie,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedIndustry, setSelectedIndustry] = useState<'All' | 'Hollywood' | 'Indian'>('All');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'year'>('match');
  const [minMatchScore, setMinMatchScore] = useState<number>(80);

  // Filter movies
  const filtered = movies.filter((movie) => {
    const matchesIndustry = selectedIndustry === 'All' || movie.industry === selectedIndustry;

    const matchesGenre =
      selectedGenre === 'All Genres' ||
      movie.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      movie.title.toLowerCase().includes(query) ||
      movie.genres.some((g) => g.toLowerCase().includes(query)) ||
      movie.director.toLowerCase().includes(query) ||
      movie.synopsis.toLowerCase().includes(query) ||
      movie.vibe.toLowerCase().includes(query) ||
      movie.language.toLowerCase().includes(query) ||
      movie.industry.toLowerCase().includes(query) ||
      movie.year.toString().includes(query);

    const matchesScore = movie.matchScore >= minMatchScore;

    return matchesIndustry && matchesGenre && matchesSearch && matchesScore;
  });

  // Sort movies
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'year') return b.year - a.year;
    return 0;
  });

  return (
    <div className="space-y-8 pb-16 text-left">
      
      {/* Discover Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/70 via-[#16102c] to-[#1d122b] border border-purple-800/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
          <Compass className="w-4 h-4 text-orange-400" />
          <span>Cinematic Discovery Hub</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore the CineMatch Spectrum
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/70 mt-1 max-w-2xl leading-relaxed">
          Search the index, adjust your match affinity threshold, and isolate specific genre threads across our curated catalog.
        </p>

        {/* Big Search Input */}
        <div className="mt-6 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            id="discover-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, director, genre or language..."
            className="w-full bg-[#120e24] text-sm text-white placeholder-purple-400/40 rounded-2xl pl-11 pr-10 py-3.5 border border-purple-700/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        {/* Industry / Origin Selector */}
        <div className="flex items-center gap-2">
          {(['All', 'Hollywood', 'Indian'] as const).map((ind) => {
            const isSelected = selectedIndustry === ind;
            const count = ind === 'All' 
              ? movies.length 
              : movies.filter(m => m.industry === ind).length;
            const label = ind === 'All' ? 'All Cinema' : ind === 'Indian' ? 'Indian Cinema' : 'Hollywood';
            return (
              <button
                key={ind}
                id={`industry-filter-${ind.toLowerCase()}`}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-950 font-bold'
                    : 'bg-[#151028] text-purple-300/80 hover:text-white hover:bg-purple-900/40 border border-purple-800/40'
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/30 text-white' : 'bg-purple-900/60 text-purple-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Genre Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GENRES_LIST.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                id={`genre-filter-${genre.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950 font-semibold'
                    : 'bg-[#151028] text-purple-300/80 hover:text-white hover:bg-purple-900/40 border border-purple-800/40'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Secondary controls: Minimum match & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#140f28] border border-purple-900/40">
          
          {/* Match Score Threshold Slider */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <label htmlFor="min-match-slider" className="text-xs text-purple-200 whitespace-nowrap font-medium">
              Min Affinity: <strong className="text-orange-400">{minMatchScore}%</strong>
            </label>
            <input
              id="min-match-slider"
              type="range"
              min="80"
              max="98"
              step="1"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-28 sm:w-36 accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="text-xs text-purple-300/70 mr-1">Sort:</span>
            
            <button
              id="sort-by-match"
              onClick={() => setSortBy('match')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                sortBy === 'match'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold'
                  : 'text-purple-300 hover:text-white bg-purple-950/30'
              }`}
            >
              Match Score
            </button>

            <button
              id="sort-by-rating"
              onClick={() => setSortBy('rating')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                sortBy === 'rating'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold'
                  : 'text-purple-300 hover:text-white bg-purple-950/30'
              }`}
            >
              Top Rated
            </button>

            <button
              id="sort-by-year"
              onClick={() => setSortBy('year')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                sortBy === 'year'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold'
                  : 'text-purple-300 hover:text-white bg-purple-950/30'
              }`}
            >
              Year
            </button>
          </div>

        </div>
      </div>

      {/* Movie Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Showing {sorted.length} {sorted.length === 1 ? 'Title' : 'Titles'}
          </span>
          {(searchQuery || selectedGenre !== 'All Genres' || minMatchScore > 80) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All Genres');
                setMinMatchScore(80);
              }}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#130f26] border border-purple-800/40">
            <Compass className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-white mb-1">
              No matching films match this filter combination
            </h3>
            <p className="text-xs text-purple-300/70 max-w-sm mx-auto mb-4">
              Try lowering the minimum match threshold or choosing a broader genre filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All Genres');
                setMinMatchScore(80);
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white font-medium text-xs hover:bg-orange-400 shadow-md shadow-orange-950"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((movie) => (
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
      </div>

    </div>
  );
};
