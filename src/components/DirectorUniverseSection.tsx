import React from 'react';
import { Clapperboard, Sparkles, ArrowRight, Film } from 'lucide-react';
import { Movie } from '../types.ts';
import { FEATURED_DIRECTORS } from '../data/directors.ts';

interface DirectorUniverseSectionProps {
  allMovies: Movie[];
  onSelectDirector: (directorName: string) => void;
}

export const DirectorUniverseSection: React.FC<DirectorUniverseSectionProps> = ({
  allMovies,
  onSelectDirector,
}) => {
  return (
    <section id="director-universe-section" className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Clapperboard className="w-4 h-4 text-orange-400" />
            <span>Auteur Cinema & Filmography</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            Director Universe
          </h2>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 max-w-2xl">
            Explore curated filmographies from legendary visionary auteurs. Click any director to step into their cinematic world and film catalogue.
          </p>
        </div>
      </div>

      {/* Directors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {FEATURED_DIRECTORS.map((dir) => {
          const filmsByDirector = allMovies.filter(
            (m) => m.director.toLowerCase() === dir.name.toLowerCase()
          );
          const filmCount = filmsByDirector.length;

          return (
            <div
              key={dir.name}
              id={`director-card-${dir.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectDirector(dir.name)}
              className="group p-5 rounded-2xl bg-[#140f29] border border-purple-800/40 hover:border-orange-500/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-orange-950/30 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700/60 text-[10px] font-bold text-orange-300 uppercase tracking-wider">
                    {dir.industry}
                  </span>
                  <span className="text-[11px] font-semibold text-purple-300/80 flex items-center gap-1 font-mono">
                    <Film className="w-3 h-3 text-orange-400" />
                    <span>{filmCount} Film{filmCount !== 1 ? 's' : ''}</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                  {dir.name}
                </h3>

                <p className="text-xs text-purple-200/80 mt-1 line-clamp-2 leading-relaxed">
                  {dir.signatureStyle}
                </p>

                <div className="mt-2 text-[11px] text-purple-400/70 truncate">
                  <span className="text-purple-300 font-semibold">Known for:</span> {dir.knownFor}
                </div>
              </div>

              <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-xs text-orange-400 group-hover:text-orange-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Enter Universe</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
