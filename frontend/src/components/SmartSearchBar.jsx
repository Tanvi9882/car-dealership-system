import React, { useState, useRef } from 'react';
import { Sparkles, Search, X, Mic, Camera, SlidersHorizontal, Volume2, Upload, Check } from 'lucide-react';

export default function SmartSearchBar({ onSmartSearch, onReset, activeFilterSummary, loading }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showImageSearchModal, setShowImageSearchModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState('');
  const fileInputRef = useRef(null);

  const samplePrompts = [
    "SUV under ₹25 lakh",
    "Electric cars under 60 lakh",
    "Sports car under 1 crore",
    "Luxury Sedan",
    "Mahindra Thar 4x4",
    "BMW under 2 crore"
  ];

  // 1. Voice Search Handler (Web Speech API)
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is supported on Google Chrome / Edge / modern browsers.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus("Listening to your vehicle wish...");
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setQuery(transcript);
        setVoiceStatus(`" ${transcript} "`);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setVoiceStatus("Speech recognition error. Please try typing.");
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceStatus('');
        if (query.trim()) {
          onSmartSearch(query.trim());
        }
      };

      recognition.start();
    } catch (err) {
      console.error("Voice search failed", err);
      setIsListening(false);
    }
  };

  // 2. Image Search Upload Handler
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePerformImageSearch = (detectedQuery) => {
    const queryToUse = detectedQuery || "Luxury Sports SUV";
    setQuery(queryToUse);
    onSmartSearch(queryToUse);
    setShowImageSearchModal(false);
  };

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
    setImagePreview(null);
    onReset();
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-r from-[#070B17] via-[#111827] to-[#070B17] space-y-5 shadow-2xl relative overflow-hidden">
      
      {/* Background Subtle Glow Accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* AI Concierge Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              ✨ Ask our AI Concierge
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-widest">
                NLP & Vision AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">Search with natural language, voice input, or car photo upload</p>
          </div>
        </div>

        {activeFilterSummary && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
          >
            <X className="w-3.5 h-3.5" /> Clear AI Search
          </button>
        )}
      </div>

      {/* Primary Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center gap-2 pointer-events-none text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask our AI Concierge... (e.g. 'Mahindra SUV under ₹20 lakh' or 'Electric sports car')"
            className="w-full bg-[#070B17]/90 border border-purple-500/30 focus:border-purple-400 rounded-2xl pl-12 pr-44 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner font-medium"
          />

          {/* Action Buttons inside Input */}
          <div className="absolute right-2 flex items-center gap-1.5">
            
            {/* 🎤 Voice Search Button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Voice Search"
              className={`p-2.5 rounded-xl text-xs transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-bounce shadow-lg shadow-rose-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* 📷 Image Search Button */}
            <button
              type="button"
              onClick={() => setShowImageSearchModal(true)}
              title="Image Search"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* ✨ Ask AI Submit Button */}
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Voice Listening Feedback Pulse Bar */}
      {isListening && (
        <div className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 animate-pulse">
          <Volume2 className="w-4 h-4 text-rose-400" />
          <span className="font-semibold">{voiceStatus || 'Listening... Speak your vehicle request now'}</span>
        </div>
      )}

      {/* Active AI Parsed Filter Summary Pill */}
      {activeFilterSummary && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-950/40 border border-purple-500/30 rounded-xl text-xs text-purple-200 animate-fade-in">
          <SlidersHorizontal className="w-4 h-4 text-purple-400 shrink-0" />
          <span><strong>AI Concierge Parsed Intent:</strong> {activeFilterSummary}</span>
        </div>
      )}

      {/* AI Suggestions / Try Asking Chips */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
          AI Suggestions:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {samplePrompts.map((promptText) => (
            <button
              key={promptText}
              type="button"
              onClick={() => handleChipClick(promptText)}
              className="px-3.5 py-1.5 bg-[#111827] hover:bg-purple-950/60 text-slate-300 hover:text-purple-200 border border-slate-800 hover:border-purple-500/40 text-xs font-semibold rounded-xl transition-all shrink-0 hover:scale-105"
            >
              ✨ "{promptText}"
            </button>
          ))}
        </div>
      </div>

      {/* 📷 IMAGE SEARCH MODAL */}
      {showImageSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            
            <button
              onClick={() => setShowImageSearchModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Visual Car Search</h3>
              <p className="text-xs text-slate-400">Upload a photo of any car to find matching models in our showroom inventory.</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="space-y-4">
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                  <img src={imagePreview} alt="Uploaded Car" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-3">
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Photo Analyzed by Vision AI
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePerformImageSearch("SUV")}
                    className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-800"
                  >
                    Match SUV Fleet
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePerformImageSearch("Sports")}
                    className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-800"
                  >
                    Match Sports Fleet
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors space-y-3 bg-slate-950/50"
              >
                <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-white">Click to upload vehicle photo</p>
                  <p className="text-[11px] text-slate-500">Supports PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => handlePerformImageSearch("Mahindra SUV")}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-600/20"
            >
              Search Similar Showroom Vehicles
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
