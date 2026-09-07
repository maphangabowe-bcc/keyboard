import React, { useState } from 'react';
import { Language, KeyboardTheme } from '../types';
import { ALL_LANGUAGES, POPULAR_LANGUAGES } from '../data/languages';
import { Search, X, Check, Globe, Plus } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  theme: KeyboardTheme;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customLangInput, setCustomLangInput] = useState('');

  if (!isOpen) return null;

  const isLight = theme === 'clean-light' || theme === 'ios-light' || theme === 'soft-sand';
  const isDark = !isLight;

  // Filter languages based on search query
  const filteredLanguages = ALL_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (lang: Language) => {
    onSelectLanguage(lang);
    onClose();
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customLangInput.trim();
    if (!clean) return;

    const newLang: Language = {
      code: clean.slice(0, 3).toLowerCase(),
      name: clean,
      nativeName: clean,
      flag: '🌐',
      popular: false,
    };

    onSelectLanguage(newLang);
    setCustomLangInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
          isDark
            ? 'bg-neutral-900 border-neutral-700 text-white'
            : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold">Select Target Language</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-800/40 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-neutral-700/30">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
              isDark ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-100 border-neutral-200'
            }`}
          >
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              id="input-search-language"
              placeholder="Search 60+ world languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Any Custom Language Form */}
        <div className="px-3 py-2 border-b border-neutral-700/20 bg-blue-500/5">
          <form onSubmit={handleAddCustomLanguage} className="flex gap-2">
            <input
              type="text"
              id="input-custom-language"
              placeholder="Or type ANY custom language/dialect..."
              value={customLangInput}
              onChange={(e) => setCustomLangInput(e.target.value)}
              className={`flex-1 text-xs px-2.5 py-1.5 rounded-lg border outline-none ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400'
                  : 'bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400'
              }`}
            />
            <button
              type="submit"
              disabled={!customLangInput.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 disabled:opacity-50 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Use
            </button>
          </form>
        </div>

        {/* Languages List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Popular Section if no search query */}
          {!searchQuery && (
            <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Popular Languages
            </div>
          )}

          {(!searchQuery ? POPULAR_LANGUAGES : filteredLanguages).map((lang) => {
            const isSelected = lang.name.toLowerCase() === currentLanguage.name.toLowerCase();
            return (
              <button
                key={lang.code + lang.name}
                type="button"
                id={`btn-select-lang-${lang.code}`}
                onClick={() => handleSelect(lang)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold'
                    : isDark
                    ? 'hover:bg-neutral-800/80 text-neutral-200'
                    : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <div className="text-sm font-medium leading-tight">{lang.name}</div>
                    <div className="text-xs opacity-60 leading-tight">{lang.nativeName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {lang.direction === 'rtl' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      RTL
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </button>
            );
          })}

          {!searchQuery && (
            <>
              <div className="px-2 pt-3 pb-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                All Supported Languages
              </div>
              {ALL_LANGUAGES.filter((l) => !l.popular).map((lang) => {
                const isSelected = lang.name.toLowerCase() === currentLanguage.name.toLowerCase();
                return (
                  <button
                    key={lang.code + lang.name}
                    type="button"
                    onClick={() => handleSelect(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold'
                        : isDark
                        ? 'hover:bg-neutral-800/80 text-neutral-200'
                        : 'hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <div>
                        <div className="text-sm font-medium leading-tight">{lang.name}</div>
                        <div className="text-xs opacity-60 leading-tight">{lang.nativeName}</div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </>
          )}

          {filteredLanguages.length === 0 && (
            <div className="py-8 text-center text-sm text-neutral-400">
              No matching languages found for "{searchQuery}".
              <br />
              <button
                type="button"
                onClick={() => {
                  onSelectLanguage({
                    code: 'custom',
                    name: searchQuery,
                    nativeName: searchQuery,
                    flag: '🌐',
                  });
                  onClose();
                }}
                className="mt-2 text-xs text-blue-400 underline font-semibold"
              >
                Use "{searchQuery}" as target language
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
