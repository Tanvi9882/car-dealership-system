import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Search, X, Mic, Camera, SlidersHorizontal, Volume2, Upload, Check, Bot } from 'lucide-react';

export default function SmartSearchBar({ 
  onSmartSearch, 
  onReset, 
  activeFilterSummary, 
  loading,
  isOpen: externalIsOpen,
  onOpenChange 
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val) => {
    if (onOpenChange) {
      onOpenChange(val);
    } else {
      setInternalIsOpen(val);
    }
  };

  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState('');
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const samplePrompts = [
    "SUV under ₹25 lakh",
    "Electric cars under 60 lakh",
    "Sports car under 1 crore",
    "Luxury Sedan",
    "Mahindra Thar 4x4",
    "BMW under 2 crore"
  ];

  // Prevent background scrolling when modal is open, auto-focus input, and add ESC key listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // 1. Voice Search Handler (Web Speech API)
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("Voice search requires Chrome, Edge, or a browser with Speech Recognition.");
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
        setVoiceStatus(`"${transcript}"`);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setVoiceStatus("Speech recognition error. Please try typing.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Voice search failed", err);
      setIsListening(false);
      setVoiceStatus("Voice search could not be initialized.");
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
    setShowImageUpload(false);
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSmartSearch(query.trim());
      setIsOpen(false);
    }
  };

  const handleChipClick = (promptText) => {
    setQuery(promptText);
    onSmartSearch(promptText);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setImagePreview(null);
    onReset();
  };

  const modalContent = isOpen ? (
    <div 
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#0F172A] border border-purple-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Soft Ambient Light */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header / Close Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Vehicle Search</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors text-xs flex items-center gap-1 px-2"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        {/* AI Search Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-purple-400 absolute left-4 pointer-events-none" />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe what car you want (e.g. 'SUV under 25 lakh', 'Electric sports car')"
              className="w-full bg-[#070B17] border border-purple-500/40 focus:border-purple-400 rounded-xl pl-12 pr-24 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
            />

            {/* Voice & Image Buttons inside input */}
            <div className="absolute right-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleVoiceSearch}
                title="Voice Search"
                className={`p-2 rounded-lg text-xs transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-bounce shadow-lg shadow-rose-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowImageUpload(!showImageUpload)}
                title="Visual Photo Search"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Listening / Feedback */}
          {(isListening || voiceStatus) && (
            <div className={`flex items-center justify-between p-2.5 rounded-lg text-xs border ${
              isListening
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-center gap-2">
                <Volume2 className={`w-4 h-4 ${isListening ? 'text-rose-400' : 'text-purple-400'}`} />
                <span className="font-semibold">{voiceStatus || 'Listening... Speak your query now'}</span>
              </div>
              {voiceStatus && !isListening && (
                <button type="button" onClick={() => setVoiceStatus('')} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Image Search Drawer inside Modal */}
          {showImageUpload && (
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2.5 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-purple-400" /> Visual Match
                </span>
                <button type="button" onClick={() => setShowImageUpload(false)} className="text-slate-400 hover:text-white text-xs">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <img src={imagePreview} alt="Uploaded Car" className="w-14 h-10 object-cover rounded-md" />
                  <div className="flex-1 text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Image Loaded
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePerformImageSearch("SUV")}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg"
                  >
                    Search Match
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 border border-dashed border-slate-700 hover:border-purple-500/50 rounded-lg text-center text-xs text-slate-400 hover:text-white transition-colors bg-slate-950/40 flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" /> Click to upload car photo for AI match
                </button>
              )}
            </div>
          )}

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Search with AI
              </>
            )}
          </button>
        </form>

        {/* Quick Prompt Chips */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Quick Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((promptText) => (
              <button
                key={promptText}
                type="button"
                onClick={() => handleChipClick(promptText)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-purple-950/60 text-slate-300 hover:text-purple-200 border border-slate-800 hover:border-purple-500/40 text-xs rounded-lg transition-all"
              >
                "{promptText}"
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Trigger Button & Active Filter Pill */}
      <div className="flex items-center gap-3">
        
        {/* ✨ Ask AI Button with Icon */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-purple-600/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.6)] active:scale-95 border border-purple-400/30 shrink-0"
          title="Open AI Natural Language & Visual Search"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Ask AI</span>
        </button>

        {/* Active AI Search Filter Pill */}
        {activeFilterSummary && (
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-purple-950/70 border border-purple-500/40 rounded-xl text-xs text-purple-200 animate-fade-in shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span><strong>AI Search:</strong> {activeFilterSummary}</span>
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-purple-900/60 rounded-full text-purple-300 hover:text-rose-400 transition-colors"
              title="Clear AI Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Render overlay modal at document.body level via React Portal */}
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
