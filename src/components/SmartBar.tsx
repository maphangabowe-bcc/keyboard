import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  Copy,
  Check,
  SlidersHorizontal,
  ChevronDown,
  Palette,
  Sun,
  Moon,
  Zap,
  Coffee,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';
import {
  Language,
  TranslationState,
  KeyboardTheme,
  TranslationTone,
  KeySize,
} from '../types';
import { POPULAR_LANGUAGES } from '../data/languages';
import { speakText } from '../utils/sound';
import { getThemeConfig, THEME_LIST } from '../utils/themeStyles';

interface SmartBarProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenLanguageModal: () => void;
  onOpenSettingsModal: () => void;
  translation: TranslationState;
  onInsertTranslation: () => void;
  theme: KeyboardTheme;
  onChangeTheme: (theme: KeyboardTheme) => void;
  keySize: KeySize;
  onChangeKeySize: (size: KeySize) => void;
  tone: TranslationTone;
  onChangeTone: (tone: TranslationTone) => void;
  liveTranslate: boolean;
  onToggleLiveTranslate: () => void;
  onManualTranslate: () => void;
  onOpenSetDefaultModal?: () => void;
  isDefaultActive?: boolean;
}

export const SmartBar: React.FC<SmartBarProps> = ({
  currentLanguage,
  onSelectLanguage,
  onOpenLanguageModal,
  onOpenSettingsModal,
  translation,
  onInsertTranslation,
  theme,
  onChangeTheme,
  keySize,
  onChangeKeySize,
  tone,
  onChangeTone,
  liveTranslate,
  onToggleLiveTranslate,
  onManualTranslate,
  onOpenSetDefaultModal,
  isDefaultActive = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isThemePopoverOpen, setIsThemePopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (!translation.translatedText) return;
    navigator.clipboard.writeText(translation.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSpeak = () => {
    if (!translation.translatedText) return;
    speakText(translation.translatedText, currentLanguage.code);
  };

  // Close theme popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsThemePopoverOpen(false);
      }
    };
    if (isThemePopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isThemePopoverOpen]);

  const themeConfig = getThemeConfig(theme);
  const isLight = themeConfig.category === 'light';
  const isDark = !isLight;

  const quickThemes = THEME_LIST.map((t) => ({
    id: t.id,
    name: t.name,
    tagline: t.tagline,
    dotColor: t.dotColor,
    badge: t.badge,
    category: t.category,
  }));

  return (
    <div
      id="smart-keyboard-bar"
      className={`relative w-full flex flex-col border-b px-2 py-1.5 gap-1.5 transition-colors select-none ${themeConfig.smartBarBg}`}
    >
      {/* Top row: Language Selector & Live status */}
      <div className="flex items-center justify-between gap-1.5">
        {/* Main Language Switcher Trigger */}
        <button
          type="button"
          id="btn-open-language-picker"
          onClick={onOpenLanguageModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all active:scale-95 shrink-0 ${
            isDark
              ? 'bg-neutral-750 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
              : 'bg-white hover:bg-neutral-50 text-neutral-850 border border-neutral-300 shadow-xs'
          }`}
        >
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="font-semibold tracking-tight">{currentLanguage.name}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {/* Quick popular language chips */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth flex-1 max-w-[180px] sm:max-w-xs py-0.5">
          {POPULAR_LANGUAGES.slice(0, 5).map((lang) => {
            const isSelected = lang.code === currentLanguage.code;
            return (
              <button
                key={lang.code}
                type="button"
                id={`chip-lang-${lang.code}`}
                onClick={() => onSelectLanguage(lang)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : isDark
                    ? 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300'
                    : 'bg-neutral-200 hover:bg-neutral-250 text-neutral-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right side controls: Quick Theme Switcher, Tone, Settings */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick 1-Tap Theme Switcher Button */}
          <button
            type="button"
            id="btn-quick-theme-toggle"
            onClick={() => setIsThemePopoverOpen((prev) => !prev)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 border ${
              isThemePopoverOpen
                ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                : isDark
                ? 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700'
                : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300 shadow-xs'
            }`}
            title="Switch Keyboard Theme (Easy Presets)"
          >
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline text-[11px] font-semibold">Theme</span>
          </button>

          {/* Tone Selector pill */}
          <select
            id="tone-selector"
            value={tone}
            aria-label="Translation Tone"
            onChange={(e) => onChangeTone(e.target.value as TranslationTone)}
            className={`text-[11px] font-medium py-1 px-1.5 rounded-md border appearance-none outline-none cursor-pointer transition-colors ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-750'
                : 'bg-white border-neutral-300 text-neutral-750 hover:bg-neutral-50'
            }`}
          >
            <option value="natural">Natural</option>
            <option value="casual">Casual</option>
            <option value="polite">Polite</option>
            <option value="formal">Formal</option>
            <option value="slang">Slang</option>
          </select>

          {/* Default Keyboard Quick Action */}
          {onOpenSetDefaultModal && (
            <button
              type="button"
              id="btn-smartbar-set-default"
              onClick={onOpenSetDefaultModal}
              className={`p-1.5 rounded-full transition-colors active:scale-95 ${
                isDefaultActive
                  ? 'text-emerald-400 hover:bg-emerald-500/20'
                  : isDark
                  ? 'text-neutral-400 hover:text-blue-400 hover:bg-neutral-750'
                  : 'text-neutral-600 hover:text-blue-600 hover:bg-neutral-200'
              }`}
              title={isDefaultActive ? 'Default Keyboard Active' : 'Set as Default Keyboard on your Phone'}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Settings modal button */}
          <button
            type="button"
            id="btn-keyboard-settings"
            onClick={onOpenSettingsModal}
            className={`p-1.5 rounded-full transition-colors active:scale-95 ${
              isDark ? 'hover:bg-neutral-750 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-700'
            }`}
            title="Keyboard Settings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK THEME POPOVER MENU (Immediate 1-tap switching) */}
      {isThemePopoverOpen && (
        <div
          ref={popoverRef}
          id="popover-quick-themes"
          className={`absolute top-10 right-2 z-50 w-72 rounded-2xl border shadow-2xl p-2.5 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-100 ${
            isDark
              ? 'bg-neutral-900/95 border-neutral-700 text-white backdrop-blur-md'
              : 'bg-white/95 border-neutral-300 text-neutral-900 backdrop-blur-md'
          }`}
        >
          <div className="flex items-center justify-between px-1 pb-1 border-b border-neutral-700/30">
            <div className="flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold">Easy Keyboard Themes</span>
            </div>
            <span className="text-[10px] text-neutral-400">1-Tap Switch</span>
          </div>

          {/* Theme choices */}
          <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
            {quickThemes.map((t) => {
              const isSelected = theme === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  id={`theme-opt-${t.id}`}
                  onClick={() => {
                    onChangeTheme(t.id);
                    setIsThemePopoverOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl border flex items-center justify-between text-left transition-all active:scale-[0.98] cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500 font-semibold'
                      : isDark
                      ? 'bg-neutral-800/80 hover:bg-neutral-750 border-neutral-700/70 text-neutral-200'
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full ring-2 ring-white/20 shrink-0 shadow-xs"
                      style={{ backgroundColor: t.dotColor }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold leading-tight">{t.name}</span>
                        {t.badge && (
                          <span className="text-[9px] px-1 py-0.2 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {t.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] opacity-65 leading-tight mt-0.5">{t.tagline}</div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Key Size Quick Toggle */}
          <div className="pt-1.5 border-t border-neutral-700/30 flex items-center justify-between px-1">
            <span className="text-xs font-medium text-neutral-400">Key Size / Touch:</span>
            <div className="flex gap-1">
              <button
                type="button"
                id="btn-keysize-normal"
                onClick={() => onChangeKeySize('normal')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  keySize === 'normal'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                id="btn-keysize-large"
                onClick={() => onChangeKeySize('large')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  keySize === 'large'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-200 text-neutral-700'
                }`}
                title="Larger keys for easy tapping without typos"
              >
                Large Keys
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Translation Conversion Display Bar */}
      {(translation.translatedText || translation.originalText || translation.isLoading) && (
        <div
          id="translation-preview-box"
          className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border transition-all ${
            isDark
              ? 'bg-neutral-800/90 border-neutral-700/80'
              : 'bg-blue-50/70 border-blue-200/80 text-neutral-900'
          }`}
        >
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-1">
                <Sparkles
                  className={`w-3 h-3 ${
                    translation.isLoading ? 'animate-spin text-amber-400' : 'text-blue-500'
                  }`}
                />
                {translation.isLoading ? 'Translating...' : currentLanguage.name}
              </span>

              {!translation.isLoading && translation.translatedText && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  100% Accurate
                </span>
              )}

              {translation.source === 'gemini-ai' && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-medium">
                  AI
                </span>
              )}
            </div>

            {/* Translated content with RTL handling */}
            <p
              className={`text-sm font-medium leading-tight truncate mt-0.5 ${
                currentLanguage.direction === 'rtl' ? 'text-right' : 'text-left'
              } ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}
              dir={currentLanguage.direction || 'ltr'}
            >
              {translation.translatedText || (
                <span className="italic opacity-60">Type in English to see translation...</span>
              )}
            </p>

            {/* Phonetics / Romanization for non-Latin scripts */}
            {translation.romanization && (
              <span className="text-[11px] text-amber-400/90 font-mono tracking-tight truncate mt-0.5">
                🗣️ {translation.romanization}
              </span>
            )}
          </div>

          {/* Action buttons for the translated text */}
          <div className="flex items-center gap-1 shrink-0">
            {translation.translatedText && (
              <>
                <button
                  type="button"
                  id="btn-speak-translation"
                  onClick={handleSpeak}
                  className={`p-1.5 rounded-md transition-all active:scale-95 ${
                    isDark
                      ? 'hover:bg-neutral-700 text-neutral-300'
                      : 'hover:bg-blue-100 text-blue-700'
                  }`}
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="btn-copy-translation"
                  onClick={handleCopy}
                  className={`p-1.5 rounded-md transition-all active:scale-95 ${
                    isDark
                      ? 'hover:bg-neutral-700 text-neutral-300'
                      : 'hover:bg-blue-100 text-blue-700'
                  }`}
                  title="Copy translated text"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  id="btn-insert-translation"
                  onClick={onInsertTranslation}
                  className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all active:scale-95 shadow-xs"
                  title="Insert into input"
                >
                  Insert
                </button>
              </>
            )}

            {!liveTranslate && (
              <button
                type="button"
                id="btn-manual-translate"
                onClick={onManualTranslate}
                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all active:scale-95"
              >
                Translate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
