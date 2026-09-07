export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction?: 'ltr' | 'rtl';
  nonLatinScript?: boolean;
  popular?: boolean;
}

export type KeyboardLayout = 'alpha' | 'numeric' | 'symbols' | 'emoji';

export type KeyboardTheme =
  | 'cyber-slate'
  | 'nordic-frost'
  | 'champagne-gold'
  | 'emerald-sage'
  | 'clean-dark'
  | 'clean-light'
  | 'ios-dark'
  | 'ios-light'
  | 'midnight-blue'
  | 'soft-sand'
  | 'high-contrast';

export type KeySize = 'normal' | 'large';

export type TranslationTone = 'natural' | 'casual' | 'formal' | 'polite' | 'slang';

export interface TranslationState {
  originalText: string;
  translatedText: string;
  romanization?: string;
  explanation?: string;
  isLoading: boolean;
  source: 'gemini-ai' | 'neural-engine' | 'offline-engine' | 'idle';
  error?: string | null;
  accuracy?: string;
  detectedSourceLang?: string;
}

export interface ChatMessage {
  id: string;
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  timestamp: string;
  sender: 'user' | 'partner';
  romanization?: string;
}

export interface KeyboardSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  keyPopup: boolean;
  liveTranslate: boolean;
  autoCapitalize: boolean;
  theme: KeyboardTheme;
  keySize: KeySize;
  tone: TranslationTone;
  speechPlayback: boolean;
}

