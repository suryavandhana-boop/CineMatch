import React, { useState } from 'react';
import { Film, Sparkles, Compass, Bookmark, User, Search, LogOut, Menu, X, Clapperboard } from 'lucide-react';
import { NavTab, UserProfile } from '../types.ts';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  user: UserProfile;
  onLogout: () => void;
  watchlistCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  watchlistCount,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Film className="w-4 h-4" /> },
    { id: 'discover', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { id: 'directors', label: 'Directors', icon: <Clapperboard className="w-4 h-4" /> },
    { id: 'watchlist', label: 'Watchlist', icon: <Bookmark className="w-4 h-4" />, badge: watchlistCount },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0914]/85 border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo" 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-violet-700 to-orange-500 p-[1.5px] shadow-lg shadow-purple-900/30 group-hover:shadow-orange-500/20 transition-all duration-300">
              <div className="w-full h-full bg-[#120e24] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-xl tracking-tight text-white">Cine</span>
                <span className="font-display font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Match</span>
              </div>
              <span className="text-[10px] font-medium tracking-wider uppercase text-purple-300/60 -mt-1">
                Recommendation Engine
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, director, genre or language..."
                className="w-full bg-[#16122b] text-sm text-purple-100 placeholder-purple-400/40 rounded-full pl-10 pr-9 py-2 border border-purple-800/40 focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  id="navbar-search-clear"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-900/60 to-purple-800/40 text-white border border-purple-500/40 shadow-sm shadow-purple-950'
                      : 'text-purple-200/70 hover:text-white hover:bg-purple-950/40'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white leading-none">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-purple-400 to-orange-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Pill & Logout */}
          <div className="hidden sm:flex items-center gap-3">
            <div 
              id="user-profile-badge" 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#181330] border border-purple-800/50 hover:border-purple-600/70 cursor-pointer transition-colors"
              title="View profile"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-orange-400 flex items-center justify-center text-[11px] font-bold text-white shadow-xs">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-purple-200 max-w-[90px] truncate">
                {user.username}
              </span>
              {user.isGuest && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30">
                  Guest
                </span>
              )}
            </div>

            <button
              id="nav-logout-btn"
              onClick={onLogout}
              className="p-2 rounded-xl text-purple-300/60 hover:text-orange-300 hover:bg-purple-950/60 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-purple-300 hover:text-white bg-[#171330] border border-purple-800/40"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, director, genre or language..."
              className="w-full bg-[#16122b] text-sm text-purple-100 placeholder-purple-400/40 rounded-full pl-10 pr-9 py-2 border border-purple-800/40 focus:outline-none focus:border-orange-500"
            />
            {searchQuery && (
              <button
                id="mobile-search-clear"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-t border-purple-900/40 bg-[#120e24] rounded-b-2xl mb-2 flex flex-col gap-1.5 shadow-2xl">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-purple-900/70 text-white border border-purple-600/40'
                      : 'text-purple-200/80 hover:bg-purple-950/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-purple-900/50 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-orange-400 flex items-center justify-center text-xs font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">{user.username}</span>
                  <span className="text-[10px] text-purple-300/60">{user.email}</span>
                </div>
              </div>
              <button
                id="mobile-logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-400 hover:text-orange-300 bg-orange-500/10 rounded-lg border border-orange-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
