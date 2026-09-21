/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTab, UserProfile, Movie } from './types.ts';
import { PLACEHOLDER_MOVIES } from './data/movies.ts';
import { LoginPage } from './components/LoginPage.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HomeView } from './components/HomeView.tsx';
import { DiscoverView } from './components/DiscoverView.tsx';
import { WatchlistView } from './components/WatchlistView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { MovieDetailModal } from './components/MovieDetailModal.tsx';
import { DirectorUniverseView } from './components/DirectorUniverseView.tsx';
import { Sparkles, Film, Heart } from 'lucide-react';

export default function App() {
  // 1. Initialize user from localStorage if present
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('cinematch_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // 2. Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // 3. Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Modal state for movie details
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // 4b. Selected Director state for Director Universe
  const [selectedDirector, setSelectedDirector] = useState<string>('Christopher Nolan');

  const handleSelectDirector = (directorName: string) => {
    setSelectedDirector(directorName);
    setActiveTab('directors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. Watchlist state in localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cinematch_watchlist');
      if (stored) return JSON.parse(stored);
      // Default initial watchlist items for good initial UX
      return ['m1', 'm3'];
    } catch {
      return ['m1', 'm3'];
    }
  });

  // 6. User 1-5 Star Ratings state in localStorage (Surya's ratings)
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('cinematch_movie_ratings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Object.keys(parsed).length > 0) return parsed;
      }
      // Starter ratings for Surya: Inception (5★) and The Dark Knight (4★)
      // Enables immediate collaborative filtering demonstration
      const initial = { m1: 5, m5: 4 };
      localStorage.setItem('cinematch_movie_ratings', JSON.stringify(initial));
      return initial;
    } catch {
      return { m1: 5, m5: 4 };
    }
  });

  // Save watchlist to localStorage
  const handleToggleWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId];
      try {
        localStorage.setItem('cinematch_watchlist', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to write to localStorage', e);
      }
      return updated;
    });
  };

  // Save 1-5 star rating to localStorage
  const handleRateMovie = (movieId: string, rating: number) => {
    setUserRatings((prev) => {
      const updated = { ...prev };
      if (rating <= 0) {
        delete updated[movieId];
      } else {
        updated[movieId] = rating;
      }
      try {
        localStorage.setItem('cinematch_movie_ratings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to write rating to localStorage', e);
      }
      return updated;
    });
  };

  // Login handler
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('cinematch_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to write user to localStorage', e);
    }
    setActiveTab('home');
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('cinematch_user');
    } catch (e) {
      console.error('Failed to clear user from localStorage', e);
    }
    setActiveTab('home');
    setSearchQuery('');
  };

  // If user is not logged in, render the login page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0914] text-[#f1eef8] flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        onLogout={handleLogout}
        watchlistCount={watchlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Render Tab Views */}
        {activeTab === 'home' && (
          <HomeView
            movies={PLACEHOLDER_MOVIES}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectMovie={setSelectedMovie}
            onExploreDiscover={() => setActiveTab('discover')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            userRatings={userRatings}
            onRateMovie={handleRateMovie}
            currentUserName={currentUser?.username || 'Surya'}
            onSelectDirector={handleSelectDirector}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverView
            movies={PLACEHOLDER_MOVIES}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectMovie={setSelectedMovie}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            userRatings={userRatings}
            onRateMovie={handleRateMovie}
          />
        )}

        {activeTab === 'directors' && (
          <DirectorUniverseView
            directorName={selectedDirector}
            allMovies={PLACEHOLDER_MOVIES}
            onSelectDirector={setSelectedDirector}
            onSelectMovie={setSelectedMovie}
            onBack={() => setActiveTab('home')}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            userRatings={userRatings}
            onRateMovie={handleRateMovie}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            movies={PLACEHOLDER_MOVIES}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectMovie={setSelectedMovie}
            onGoToDiscover={() => setActiveTab('discover')}
            userRatings={userRatings}
            onRateMovie={handleRateMovie}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={currentUser}
            onLogout={handleLogout}
            watchlist={watchlist}
            movies={PLACEHOLDER_MOVIES}
            userRatings={userRatings}
          />
        )}
      </main>

      {/* Movie Details Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isInWatchlist={selectedMovie ? watchlist.includes(selectedMovie.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        userRating={selectedMovie ? (userRatings[selectedMovie.id] || 0) : 0}
        onRateMovie={handleRateMovie}
        onSelectDirector={handleSelectDirector}
        allMovies={PLACEHOLDER_MOVIES}
        onSelectMovie={setSelectedMovie}
      />

      {/* Footer */}
      <footer className="w-full border-t border-purple-900/30 bg-[#0c0918] py-8 text-center text-xs text-purple-400/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-orange-500 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-white text-sm">CineMatch</span>
            <span>— Atmospheric Cinema Recommendation Engine</span>
          </div>

          <div className="flex items-center gap-6 text-purple-300/70">
            <button 
              onClick={() => setActiveTab('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab('discover')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Discover
            </button>
            <button 
              onClick={() => setActiveTab('directors')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Directors
            </button>
            <button 
              onClick={() => setActiveTab('watchlist')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Watchlist ({watchlist.length})
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
