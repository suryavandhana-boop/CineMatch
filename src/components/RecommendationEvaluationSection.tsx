import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Sliders, 
  Activity, 
  Film, 
  ChevronRight, 
  BookOpen, 
  Zap, 
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Movie } from '../types.ts';
import { 
  calculateEvaluationMetrics, 
  calculateLiveUserMetrics, 
  SAMPLE_BENCHMARK_SCENARIOS, 
  EvaluationResult 
} from '../utils/evaluationMetrics.ts';
import { generateCollaborativeRecommendations } from '../utils/collaborativeFiltering.ts';

interface RecommendationEvaluationSectionProps {
  movies: Movie[];
  userRatings: Record<string, number>;
  watchlist: string[];
  onSelectMovie: (movie: Movie) => void;
  onSelectDirector?: (directorName: string) => void;
}

export const RecommendationEvaluationSection: React.FC<RecommendationEvaluationSectionProps> = ({
  movies,
  userRatings,
  watchlist,
  onSelectMovie,
  onSelectDirector,
}) => {
  // Selected demonstration mode: 'live' | 'balanced' | 'high-precision' | 'high-recall' | 'sandbox'
  const [selectedMode, setSelectedMode] = useState<string>('live');

  // Custom simulator counts for sandbox mode
  const [customRelevantRec, setCustomRelevantRec] = useState<number>(4);
  const [customTotalRec, setCustomTotalRec] = useState<number>(6);
  const [customTotalRel, setCustomTotalRel] = useState<number>(8);

  // Poster error tracking strictly following rules
  const [posterErrors, setPosterErrors] = useState<Record<string, boolean>>({});

  const handlePosterError = (movieId: string) => {
    setPosterErrors((prev) => ({ ...prev, [movieId]: true }));
  };

  // 1. Calculate live recommendations from collaborative filtering engine
  const liveRecommendations = useMemo(() => {
    return generateCollaborativeRecommendations(movies, userRatings);
  }, [movies, userRatings]);

  const liveRecMovieIds = useMemo(() => {
    return liveRecommendations.recommendations.slice(0, 6).map((r) => r.movie.id);
  }, [liveRecommendations]);

  // 2. Compute live user metrics
  const liveEvaluation = useMemo(() => {
    return calculateLiveUserMetrics(movies, userRatings, watchlist, liveRecMovieIds);
  }, [movies, userRatings, watchlist, liveRecMovieIds]);

  // 3. Compute active metrics based on selected scenario
  const currentScenario = useMemo(() => {
    return SAMPLE_BENCHMARK_SCENARIOS.find((s) => s.id === selectedMode);
  }, [selectedMode]);

  const activeResult: EvaluationResult = useMemo(() => {
    if (selectedMode === 'live') {
      return liveEvaluation.metrics;
    }

    if (currentScenario) {
      return calculateEvaluationMetrics(
        currentScenario.relevantRecommended,
        currentScenario.totalRecommended,
        currentScenario.totalRelevant
      );
    }

    // Sandbox mode
    return calculateEvaluationMetrics(customRelevantRec, customTotalRec, customTotalRel);
  }, [selectedMode, liveEvaluation, currentScenario, customRelevantRec, customTotalRec, customTotalRel]);

  // Handle custom sandbox increments
  const adjustCustom = (type: 'relRec' | 'totRec' | 'totRel', delta: number) => {
    if (type === 'relRec') {
      const next = Math.max(0, Math.min(customTotalRec, customTotalRel, customRelevantRec + delta));
      setCustomRelevantRec(next);
    } else if (type === 'totRec') {
      const next = Math.max(1, customTotalRec + delta);
      setCustomTotalRec(next);
      if (customRelevantRec > next) setCustomRelevantRec(next);
    } else if (type === 'totRel') {
      const next = Math.max(1, customTotalRel + delta);
      setCustomTotalRel(next);
      if (customRelevantRec > next) setCustomRelevantRec(next);
    }
  };

  return (
    <section id="recommendation-evaluation-section" className="space-y-6 text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
            <Calculator className="w-4 h-4 text-orange-400" />
            <span>Algorithm Performance Laboratory</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
            Recommendation Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed font-light">
            How accurate are CineMatch recommendations? In machine learning and retrieval systems, three mathematical gold-standard metrics evaluate performance: <strong>Precision</strong>, <strong>Recall</strong>, and <strong>F1 Score</strong>.
          </p>
        </div>

        {/* Live Ratings Indicator */}
        <div className="flex items-center gap-2 bg-[#140f29] px-3 py-2 rounded-2xl border border-purple-800/50 text-xs">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-purple-300">Active Rated Films:</span>
          <span className="font-bold text-white bg-purple-900/80 px-2 py-0.5 rounded-lg border border-purple-700/50">
            {Object.keys(userRatings).length}
          </span>
        </div>
      </div>

      {/* Mode Switcher / Scenario Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          type="button"
          id="eval-tab-live"
          onClick={() => setSelectedMode('live')}
          className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
            selectedMode === 'live'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-400 shadow-lg shadow-orange-950/50'
              : 'bg-[#15102a] text-purple-200 hover:text-white hover:bg-purple-900/50 border-purple-800/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Live CineMatch Engine</span>
          <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-md font-mono">Dynamic</span>
        </button>

        {SAMPLE_BENCHMARK_SCENARIOS.map((scenario) => {
          const isSelected = selectedMode === scenario.id;
          return (
            <button
              key={scenario.id}
              type="button"
              id={`eval-tab-${scenario.id}`}
              onClick={() => setSelectedMode(scenario.id)}
              className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-400 shadow-lg shadow-orange-950/50'
                  : 'bg-[#15102a] text-purple-200 hover:text-white hover:bg-purple-900/50 border-purple-800/40'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-purple-300" />
              <span>{scenario.name}</span>
            </button>
          );
        })}

        <button
          type="button"
          id="eval-tab-sandbox"
          onClick={() => setSelectedMode('sandbox')}
          className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
            selectedMode === 'sandbox'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-400 shadow-lg shadow-orange-950/50'
              : 'bg-[#15102a] text-purple-200 hover:text-white hover:bg-purple-900/50 border-purple-800/40'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-orange-300" />
          <span>Interactive Sandbox</span>
        </button>
      </div>

      {/* Scenario Explanation Banner */}
      <div className="p-4 rounded-2xl bg-[#140e29] border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-bold text-white mr-1.5">
              {selectedMode === 'live'
                ? 'Current User Profile Mode:'
                : selectedMode === 'sandbox'
                ? 'Interactive Parameter Sandbox:'
                : `${currentScenario?.name}:`}
            </span>
            <span className="text-purple-200/80">
              {selectedMode === 'live'
                ? 'Calculates metrics using your real ratings (>= 4★ and watchlist) tested against current recommendations.'
                : selectedMode === 'sandbox'
                ? 'Adjust the counters below to observe how Precision, Recall, and F1 Score react in real time.'
                : currentScenario?.description}
            </span>
          </div>
        </div>

        {selectedMode === 'live' && (
          <span className="text-[11px] text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-lg self-start sm:self-auto font-medium">
            Dynamic Real-Time Sync
          </span>
        )}
      </div>

      {/* Interactive Sandbox Controls (visible in sandbox mode) */}
      {selectedMode === 'sandbox' && (
        <div className="p-5 rounded-2xl bg-[#171032] border border-orange-500/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Relevant Recommended Controls */}
          <div className="bg-[#100b24] p-3 rounded-xl border border-purple-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-200">Relevant Recommended (TP)</span>
              <span className="text-base font-bold font-mono text-emerald-400">{customRelevantRec}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustCustom('relRec', -1)}
                className="flex-1 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white font-bold cursor-pointer transition-colors"
              >
                - 1
              </button>
              <button
                type="button"
                onClick={() => adjustCustom('relRec', 1)}
                className="flex-1 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white font-bold cursor-pointer transition-colors"
              >
                + 1
              </button>
            </div>
            <p className="text-[10px] text-purple-400/70">Recommended films you actually enjoyed</p>
          </div>

          {/* Total Recommended Controls */}
          <div className="bg-[#100b24] p-3 rounded-xl border border-purple-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-200">Total Recommended</span>
              <span className="text-base font-bold font-mono text-amber-400">{customTotalRec}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustCustom('totRec', -1)}
                className="flex-1 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white font-bold cursor-pointer transition-colors"
              >
                - 1
              </button>
              <button
                type="button"
                onClick={() => adjustCustom('totRec', 1)}
                className="flex-1 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white font-bold cursor-pointer transition-colors"
              >
                + 1
              </button>
            </div>
            <p className="text-[10px] text-purple-400/70">Total suggestions returned by algorithm</p>
          </div>

          {/* Total Relevant Controls */}
          <div className="bg-[#100b24] p-3 rounded-xl border border-purple-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-200">Total Relevant in Catalog</span>
              <span className="text-base font-bold font-mono text-blue-400">{customTotalRel}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustCustom('totRel', -1)}
                className="flex-1 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white font-bold cursor-pointer transition-colors"
              >
                - 1
              </button>
              <button
                type="button"
                onClick={() => adjustCustom('totRel', 1)}
                className="flex-1 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white font-bold cursor-pointer transition-colors"
              >
                + 1
              </button>
            </div>
            <p className="text-[10px] text-purple-400/70">All movies the user would enjoy</p>
          </div>
        </div>
      )}

      {/* 3 Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Metric 1: Precision */}
        <div className="rounded-3xl bg-gradient-to-br from-[#15122b] to-[#100c22] border border-emerald-500/40 p-6 shadow-xl flex flex-col justify-between space-y-4 text-left relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                Retrieval Accuracy
              </span>
              <span className="text-xs text-purple-300/70 font-mono">
                {activeResult.relevantRecommended} / {activeResult.totalRecommended}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-white">
              Precision
            </h3>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-display text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                {activeResult.precisionPercent}
              </span>
              <span className="text-xs text-purple-300/80 font-medium">accuracy rate</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full h-2 bg-purple-950/80 rounded-full overflow-hidden border border-purple-800/40 mt-2">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, activeResult.precision * 100))}%` }}
              />
            </div>

            {/* Mathematical Formula Substitution */}
            <div className="p-2.5 rounded-xl bg-[#0c081d] border border-purple-800/50 text-[11px] font-mono text-purple-200 space-y-1">
              <div className="text-purple-400 font-semibold">Formula:</div>
              <div>Relevant Recommended / Total Recommended</div>
              <div className="text-emerald-300 font-bold">
                = {activeResult.relevantRecommended} / {activeResult.totalRecommended} = {activeResult.precisionPercent}
              </div>
            </div>
          </div>

          {/* Educational Explanation */}
          <div className="pt-3 border-t border-purple-900/40 text-xs text-purple-200/85 leading-relaxed font-light">
            <strong className="text-white font-medium">What it means:</strong> Answers <em>"Out of all movies recommended to you, how many were actually relevant to your taste?"</em> High precision ensures you aren’t spammed with unwanted titles.
          </div>
        </div>

        {/* Metric 2: Recall */}
        <div className="rounded-3xl bg-gradient-to-br from-[#15122b] to-[#100c22] border border-cyan-500/40 p-6 shadow-xl flex flex-col justify-between space-y-4 text-left relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[11px] font-bold uppercase tracking-wider">
                Catalog Coverage
              </span>
              <span className="text-xs text-purple-300/70 font-mono">
                {activeResult.relevantRecommended} / {activeResult.totalRelevant}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-white">
              Recall
            </h3>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-display text-4xl sm:text-5xl font-black text-cyan-400 tracking-tight">
                {activeResult.recallPercent}
              </span>
              <span className="text-xs text-purple-300/80 font-medium">discovery rate</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full h-2 bg-purple-950/80 rounded-full overflow-hidden border border-purple-800/40 mt-2">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, activeResult.recall * 100))}%` }}
              />
            </div>

            {/* Mathematical Formula Substitution */}
            <div className="p-2.5 rounded-xl bg-[#0c081d] border border-purple-800/50 text-[11px] font-mono text-purple-200 space-y-1">
              <div className="text-purple-400 font-semibold">Formula:</div>
              <div>Relevant Recommended / Total Relevant</div>
              <div className="text-cyan-300 font-bold">
                = {activeResult.relevantRecommended} / {activeResult.totalRelevant} = {activeResult.recallPercent}
              </div>
            </div>
          </div>

          {/* Educational Explanation */}
          <div className="pt-3 border-t border-purple-900/40 text-xs text-purple-200/85 leading-relaxed font-light">
            <strong className="text-white font-medium">What it means:</strong> Answers <em>"Out of all relevant movies in the universe, how many did the system succeed in finding?"</em> High recall prevents you from missing out on hidden masterworks.
          </div>
        </div>

        {/* Metric 3: F1 Score */}
        <div className="rounded-3xl bg-gradient-to-br from-[#17112f] to-[#120b25] border border-orange-500/50 p-6 shadow-xl flex flex-col justify-between space-y-4 text-left relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[11px] font-bold uppercase tracking-wider">
                Harmonic Balance
              </span>
              <span className="text-xs text-purple-300/70 font-mono">
                2 × (P × R) / (P + R)
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-white">
              F1 Score
            </h3>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-display text-4xl sm:text-5xl font-black text-orange-400 tracking-tight">
                {activeResult.f1Percent}
              </span>
              <span className="text-xs text-purple-300/80 font-medium">balance score</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full h-2 bg-purple-950/80 rounded-full overflow-hidden border border-purple-800/40 mt-2">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, activeResult.f1Score * 100))}%` }}
              />
            </div>

            {/* Mathematical Formula Substitution */}
            <div className="p-2.5 rounded-xl bg-[#0c081d] border border-purple-800/50 text-[11px] font-mono text-purple-200 space-y-1">
              <div className="text-purple-400 font-semibold">Formula:</div>
              <div>2 × (Precision × Recall) / (Precision + Recall)</div>
              <div className="text-amber-300 font-bold">
                = 2 × ({activeResult.precisionPercent} × {activeResult.recallPercent}) / ({activeResult.precisionPercent} + {activeResult.recallPercent}) = {activeResult.f1Percent}
              </div>
            </div>
          </div>

          {/* Educational Explanation */}
          <div className="pt-3 border-t border-purple-900/40 text-xs text-purple-200/85 leading-relaxed font-light">
            <strong className="text-white font-medium">What it means:</strong> The harmonic mean balancing both Precision and Recall. It prevents an algorithm from gaming the score by recommending only 1 safe movie or recommending the entire catalog.
          </div>
        </div>

      </div>

      {/* Visual Classification Breakdown: Hits, False Alarms & Misses */}
      <div className="rounded-3xl bg-[#120c24] border border-purple-800/40 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-900/50">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Retrieval Classification Matrix
            </h4>
          </div>
          <span className="text-xs text-purple-300/70">
            Categorizing actual movie outcomes for the selected evaluation test
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          {/* Column 1: Relevant Recommended (True Positives) */}
          <div className="p-4 rounded-2xl bg-[#0d081c] border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Hits (True Positives)</span>
              </span>
              <span className="font-mono font-bold text-white bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-600/40">
                {activeResult.relevantRecommended}
              </span>
            </div>
            <p className="text-[11px] text-purple-300/80">
              Recommended to user AND user found them relevant.
            </p>

            <div className="pt-2 flex flex-wrap gap-1.5">
              {selectedMode === 'live' ? (
                liveEvaluation.relevantRecommendedMovies.length > 0 ? (
                  liveEvaluation.relevantRecommendedMovies.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onSelectMovie(m)}
                      className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-[10px] font-medium hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      {m.title}
                    </button>
                  ))
                ) : (
                  <span className="text-[10px] text-purple-400/60 italic">Rate more movies to grow hits</span>
                )
              ) : currentScenario?.sampleRelevantRecommendedTitles ? (
                currentScenario.sampleRelevantRecommendedTitles.map((t) => (
                  <span key={t} className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-[10px] font-medium">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-emerald-300 font-mono">{activeResult.relevantRecommended} simulated movies</span>
              )}
            </div>
          </div>

          {/* Column 2: Non-Relevant Recommended (False Positives) */}
          <div className="p-4 rounded-2xl bg-[#0d081c] border border-purple-700/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Noise (False Positives)</span>
              </span>
              <span className="font-mono font-bold text-white bg-purple-950 px-2 py-0.5 rounded-md border border-purple-700/50">
                {activeResult.nonRelevantRecommended}
              </span>
            </div>
            <p className="text-[11px] text-purple-300/80">
              Recommended to user, but not flagged as relevant.
            </p>

            <div className="pt-2 flex flex-wrap gap-1.5">
              {selectedMode === 'live' ? (
                liveEvaluation.nonRelevantRecommendedMovies.length > 0 ? (
                  liveEvaluation.nonRelevantRecommendedMovies.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onSelectMovie(m)}
                      className="px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-700/40 text-purple-300 text-[10px] font-medium hover:bg-purple-900 transition-colors cursor-pointer"
                    >
                      {m.title}
                    </button>
                  ))
                ) : (
                  <span className="text-[10px] text-purple-400/60 italic">Zero unwanted suggestions</span>
                )
              ) : currentScenario?.sampleNonRelevantRecommendedTitles && currentScenario.sampleNonRelevantRecommendedTitles.length > 0 ? (
                currentScenario.sampleNonRelevantRecommendedTitles.map((t) => (
                  <span key={t} className="px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-700/40 text-purple-300 text-[10px] font-medium">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-purple-400/60 italic">
                  {activeResult.nonRelevantRecommended > 0
                    ? `${activeResult.nonRelevantRecommended} simulated non-relevant movies`
                    : '0 noise (100% precision)'}
                </span>
              )}
            </div>
          </div>

          {/* Column 3: Relevant Not Recommended (False Negatives) */}
          <div className="p-4 rounded-2xl bg-[#0d081c] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Missed Gems (False Negatives)</span>
              </span>
              <span className="font-mono font-bold text-white bg-amber-950 px-2 py-0.5 rounded-md border border-amber-600/40">
                {activeResult.relevantNotRecommended}
              </span>
            </div>
            <p className="text-[11px] text-purple-300/80">
              User considers relevant, but algorithm didn't recommend.
            </p>

            <div className="pt-2 flex flex-wrap gap-1.5">
              {selectedMode === 'live' ? (
                liveEvaluation.missedRelevantMovies.length > 0 ? (
                  liveEvaluation.missedRelevantMovies.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onSelectMovie(m)}
                      className="px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 text-[10px] font-medium hover:bg-amber-900 transition-colors cursor-pointer"
                    >
                      {m.title}
                    </button>
                  ))
                ) : (
                  <span className="text-[10px] text-purple-400/60 italic">Full coverage (100% recall)</span>
                )
              ) : currentScenario?.sampleMissedRelevantTitles && currentScenario.sampleMissedRelevantTitles.length > 0 ? (
                currentScenario.sampleMissedRelevantTitles.map((t) => (
                  <span key={t} className="px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 text-[10px] font-medium">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-purple-400/60 italic">
                  {activeResult.relevantNotRecommended > 0
                    ? `${activeResult.relevantNotRecommended} simulated missed gems`
                    : '0 missed (100% recall)'}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
