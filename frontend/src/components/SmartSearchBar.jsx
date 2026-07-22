import React, { useState } from 'react';
import { Sparkles, Search, X, Bot, SlidersHorizontal } from 'lucide-react';

export default function SmartSearchBar({ onSmartSearch, onReset, activeFilterSummary, loading }) {
  const [query, setQuery] = useState('');

  const samplePrompts = [
    "SUV under ₹25 lakh",
    "Electric cars under 60 lakh",
    "Sports car under 1 crore",
    "Luxury Sedan",
    "BMW under 2 crore"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSmartSearch(query.trim());
    }
  };

  const handleChipClick = (promptText) => {
    setQuery(promptText);
    onSmartSearch(promptText);
  };

  const handleClear = () => {
    setQuery('');
    onReset();
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 space-y-4 shadow-xl">
      
      {/* AI Header Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30 animate-pulse">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              AI Smart Search Engine
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase font-extrabold tracking-wider">
                NLP Powered
              </span>
            </h3>
            <p className="text-xs text-slate-400">Search using natural language prompt (e.g. "SUV under ₹15 lakh")</p>
          </div>
        </div>

        {activeFilterSummary && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-3.5 h-3.5" /> Clear AI Filters
          </button>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Sparkles className="w-5 h-5 text-indigo-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your vehicle wish... (e.g. 'SUV under ₹20 lakh' or 'Electric cars')"
            className="w-full bg-slate-950/90 border border-indigo-500/40 focus:border-indigo-400 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                Ask AI
              </>
            )}
          </button>
        </div>
      </form>

      {/* Active AI Parsed Filter Summary Pill */}
      {activeFilterSummary && (
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 animate-fade-in">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400 shrink-0" />
          <span><strong>AI Parsed Intent:</strong> {activeFilterSummary}</span>
        </div>
      )}

      {/* Quick Example Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Try Asking:
        </span>
        {samplePrompts.map((promptText) => (
          <button
            key={promptText}
            type="button"
            onClick={() => handleChipClick(promptText)}
            className="px-3 py-1 bg-slate-900 hover:bg-indigo-950 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/30 text-xs rounded-lg transition-colors shrink-0"
          >
            "{promptText}"
          </button>
        ))}
      </div>

    </div>
  );
}
