import React, { useState } from 'react';
import { Sparkles, Film, KeyRound, Mail, User, ShieldCheck, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types.ts';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [demoLoadedNotification, setDemoLoadedNotification] = useState(false);

  const DEMO_USER = {
    username: 'Surya',
    email: 'demo@cinematch.com',
    password: 'movie123'
  };

  const handleFillDemo = () => {
    setUsername(DEMO_USER.username);
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setErrorMessage('');
    setDemoLoadedNotification(true);
    setTimeout(() => setDemoLoadedNotification(false), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please provide username, email, and password.');
      return;
    }

    // Check against demo or validate format
    if (
      email.toLowerCase() === DEMO_USER.email.toLowerCase() &&
      password !== DEMO_USER.password
    ) {
      setErrorMessage('Incorrect password for demo user. Demo password is: movie123');
      return;
    }

    const loggedUser: UserProfile = {
      username: username.trim(),
      email: email.trim(),
      isGuest: false,
      memberSince: 'Member since 2024'
    };

    onLoginSuccess(loggedUser);
  };

  const handleGuestMode = () => {
    const guestUser: UserProfile = {
      username: 'Guest Cinephile',
      email: 'guest@cinematch.local',
      isGuest: true,
      memberSince: 'Guest Session'
    };
    onLoginSuccess(guestUser);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0b0914] overflow-hidden">
      {/* Cinematic Ambient Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-700/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-950/40 via-transparent to-orange-950/30 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Film Sprockets / Top Vignette */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 opacity-60" />

      <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Editorial Branding Column */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-medium w-fit">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Next-Gen Cinema Discovery</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-violet-700 to-orange-500 p-[1.5px] shadow-xl shadow-purple-950">
                <div className="w-full h-full bg-[#120e24] rounded-[14px] flex items-center justify-center">
                  <Film className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <h1 className="font-display text-4xl font-extrabold text-white tracking-tight">
                Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Match</span>
              </h1>
            </div>
            <p className="text-purple-200/70 text-sm leading-relaxed mt-3">
              Step away from algorithmic repetition. CineMatch analyzes visual atmospheres, narrative pacing, and soundscapes to pair you with cinema that truly resonates.
            </p>
          </div>

          {/* Demo Credentials Quick-Card */}
          <div 
            id="demo-credentials-card" 
            className="p-4 rounded-2xl bg-[#140f28]/90 border border-purple-800/40 shadow-xl space-y-2.5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Demo Account</span>
              </div>
              <button
                id="btn-autofill-demo"
                type="button"
                onClick={handleFillDemo}
                className="text-xs px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30 font-medium transition-colors cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-1.5 text-xs text-purple-200/80 font-mono bg-[#0c0918] p-2.5 rounded-xl border border-purple-900/30">
              <div className="flex justify-between">
                <span className="text-purple-400/60 font-sans">Username:</span>
                <span className="font-semibold text-purple-200">Surya</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400/60 font-sans">Email:</span>
                <span className="font-semibold text-purple-200">demo@cinematch.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400/60 font-sans">Password:</span>
                <span className="font-semibold text-orange-300">movie123</span>
              </div>
            </div>

            {demoLoadedNotification && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Demo credentials loaded into form!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#130f26]/95 border border-purple-700/30 shadow-2xl shadow-purple-950/60 backdrop-blur-md">
            
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Welcome to CineMatch
              </h2>
              <p className="text-xs text-purple-300/70 mt-1">
                Sign in with demo credentials or explore freely in guest mode.
              </p>
            </div>

            {errorMessage && (
              <div 
                id="login-error-message"
                className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs leading-relaxed"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/60" />
                  <input
                    id="login-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username (e.g. Surya)"
                    className="w-full bg-[#1b1535] text-sm text-white placeholder-purple-400/40 rounded-xl pl-10 pr-4 py-2.5 border border-purple-800/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/60" />
                  <input
                    id="login-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@cinematch.com"
                    className="w-full bg-[#1b1535] text-sm text-white placeholder-purple-400/40 rounded-xl pl-10 pr-4 py-2.5 border border-purple-800/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/60" />
                  <input
                    id="login-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="movie123"
                    className="w-full bg-[#1b1535] text-sm text-white placeholder-purple-400/40 rounded-xl pl-10 pr-4 py-2.5 border border-purple-800/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-login-submit"
                type="submit"
                className="w-full mt-2 py-3 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-500 shadow-lg shadow-orange-950/50 hover:shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to CineMatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-800/40" />
              </div>
              <span className="relative px-3 bg-[#130f26] text-[11px] font-semibold tracking-wider uppercase text-purple-400/60">
                Or explore without credentials
              </span>
            </div>

            {/* Guest Mode Button */}
            <button
              id="btn-guest-mode"
              type="button"
              onClick={handleGuestMode}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-purple-200 hover:text-white bg-purple-900/30 hover:bg-purple-800/40 border border-purple-700/40 hover:border-purple-500/60 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Compass className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition-transform duration-300" />
              <span>Enter Guest Mode</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
