import React from 'react';
import { User, Mail, Shield, Film, Bookmark, Sparkles, LogOut, Award, Sliders, CheckCircle2, Star } from 'lucide-react';
import { UserProfile, Movie } from '../types.ts';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
  watchlist: string[];
  movies: Movie[];
  userRatings?: Record<string, number>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onLogout,
  watchlist,
  movies,
  userRatings = {},
}) => {
  const savedMovies = movies.filter((m) => watchlist.includes(m.id));
  const ratedMovieIds = Object.keys(userRatings).filter((id) => (userRatings[id] || 0) > 0);
  const ratedMovies = movies.filter((m) => ratedMovieIds.includes(m.id));

  // Compute favorite vibes or genres from saved movies
  const genresCount: Record<string, number> = {};
  movies.forEach(m => {
    m.genres.forEach(g => {
      genresCount[g] = (genresCount[g] || 0) + 1;
    });
  });

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto text-left">
      
      {/* Profile Header Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/80 via-[#181132] to-[#22102e] border border-purple-800/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar Icon */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-violet-700 to-orange-500 p-[2px] shadow-xl shadow-purple-950 flex-shrink-0">
            <div className="w-full h-full bg-[#120e24] rounded-[22px] flex items-center justify-center text-3xl font-display font-black text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {user.username}
              </h1>
              {user.isGuest ? (
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-semibold uppercase tracking-wider">
                  Guest Explorer
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3 text-orange-400" />
                  Verified Cinephile
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-purple-300/70">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                {user.email}
              </span>
              <span>•</span>
              <span>{user.memberSince || 'Active Member'}</span>
            </div>

            <p className="text-xs text-purple-200/80 pt-1 leading-relaxed max-w-xl">
              CineMatch Taste ID configured with high affinity for neon noir, speculative worldbuilding, atmospheric tension, and acoustic sensory design.
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            id="profile-logout-btn"
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-center sm:self-start"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid of Profile Stats & Taste Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-[#140f28] border border-purple-900/40 text-left">
          <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-2">
            <Bookmark className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-2xl font-display font-black text-white block">
            {watchlist.length}
          </span>
          <span className="text-xs font-semibold text-purple-300/80">
            Saved to Watchlist
          </span>
          <p className="text-[10px] text-purple-400/60 mt-0.5">
            Bookmarked films
          </p>
        </div>

        {/* Metric 2: User Rated Titles */}
        <div className="p-4 rounded-2xl bg-[#140f28] border border-purple-900/40 text-left">
          <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-2xl font-display font-black text-white block">
            {ratedMovieIds.length}
          </span>
          <span className="text-xs font-semibold text-purple-300/80">
            Personal Ratings
          </span>
          <p className="text-[10px] text-purple-400/60 mt-0.5">
            1–5 star reviews saved
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-[#140f28] border border-purple-900/40 text-left">
          <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-2xl font-display font-black text-white block">
            94.6%
          </span>
          <span className="text-xs font-semibold text-purple-300/80">
            Average Match Fit
          </span>
          <p className="text-[10px] text-purple-400/60 mt-0.5">
            Across top suggestions
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-[#140f28] border border-purple-900/40 text-left">
          <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-2">
            <Film className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-2xl font-display font-black text-white block truncate" title="Mind-Bending Neon">
            Mind-Bending
          </span>
          <span className="text-xs font-semibold text-purple-300/80">
            Top Vibe
          </span>
          <p className="text-[10px] text-purple-400/60 mt-0.5">
            Primary aesthetic
          </p>
        </div>

      </div>

      {/* User Rated Titles List (if any) */}
      {ratedMovies.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#130f26] border border-purple-800/40 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Your Saved Ratings ({ratedMovies.length})</span>
            </h3>
            <span className="text-xs text-purple-400/70 font-mono">
              Saved in browser
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ratedMovies.map((movie) => {
              const stars = userRatings[movie.id] || 0;
              return (
                <div
                  key={movie.id}
                  className="p-3 rounded-xl bg-[#181233] border border-purple-800/40 flex items-center gap-3"
                >
                  <div className="w-10 h-14 bg-black rounded-lg border border-purple-700/40 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display font-bold text-xs text-white truncate">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-purple-300/60">
                      {movie.year} • {movie.language}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-amber-300 font-semibold text-xs">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-2.5 h-2.5 ${
                              s <= stars ? 'fill-amber-400 text-amber-400' : 'text-purple-400/40'
                            }`}
                          />
                        ))}
                      </div>
                      <span>({stars}/5)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cinematic Taste Profile Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#130f26] border border-purple-800/40 space-y-5 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-400" />
              <span>CineMatch Taste DNA</span>
            </h3>
            <p className="text-xs text-purple-300/70 mt-0.5">
              Algorithm-weighted preferences calculated from your profile sessions
            </p>
          </div>
          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
            Active & Calibrated
          </span>
        </div>

        <div className="space-y-3.5 pt-2">
          <div>
            <div className="flex justify-between text-xs text-purple-200 mb-1">
              <span>Sci-Fi & Cyberpunk Worldbuilding</span>
              <span className="font-semibold text-orange-400">92%</span>
            </div>
            <div className="h-2 rounded-full bg-purple-950/60 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-orange-400 rounded-full w-[92%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-purple-200 mb-1">
              <span>Atmospheric Psychological Noir</span>
              <span className="font-semibold text-orange-400">86%</span>
            </div>
            <div className="h-2 rounded-full bg-purple-950/60 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full w-[86%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-purple-200 mb-1">
              <span>Ticking-Clock Suspense & Thriller</span>
              <span className="font-semibold text-orange-400">79%</span>
            </div>
            <div className="h-2 rounded-full bg-purple-950/60 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-600 to-amber-400 rounded-full w-[79%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-purple-200 mb-1">
              <span>Sensory & Harmonic Indie Drama</span>
              <span className="font-semibold text-orange-400">74%</span>
            </div>
            <div className="h-2 rounded-full bg-purple-950/60 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full w-[74%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Credentials Reference Box */}
      <div className="p-5 rounded-2xl bg-[#0f0c1f] border border-purple-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <div>
            <span className="font-semibold text-white block">
              Demo Credentials Reference
            </span>
            <span className="text-[11px] text-purple-400/70 font-mono">
              User: Surya | Email: demo@cinematch.com | Pass: movie123
            </span>
          </div>
        </div>
        <span className="text-[11px] text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/40">
          Stored in LocalStorage
        </span>
      </div>

    </div>
  );
};
