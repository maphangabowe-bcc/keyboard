import { Language } from '../types';

export const POPULAR_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', popular: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', popular: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', nonLatinScript: true, popular: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', popular: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', popular: true },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', nonLatinScript: true, popular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', popular: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', nonLatinScript: true, popular: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', nonLatinScript: true, popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', nonLatinScript: true, popular: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', nonLatinScript: true, popular: true },
];

export const ALL_LANGUAGES: Language[] = [
  ...POPULAR_LANGUAGES,
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', nonLatinScript: true },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', nonLatinScript: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', direction: 'rtl', nonLatinScript: true },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', nonLatinScript: true },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', flag: '🇮🇷', direction: 'rtl', nonLatinScript: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', direction: 'rtl', nonLatinScript: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', nonLatinScript: true },
  { code: 'tl', name: 'Tagalog (Filipino)', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'la', name: 'Latin', nativeName: 'Latina', flag: '🏛️' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🌐' },
];

export const QUICK_PROMPTS = [
  { label: '👋 Hello, nice to meet you!', text: 'Hello, nice to meet you!' },
  { label: '☕ Can I get a coffee please?', text: 'Can I get a coffee please?' },
  { label: '📍 Where is the nearest train station?', text: 'Where is the nearest train station?' },
  { label: '🙏 Thank you for your help', text: 'Thank you for your help' },
  { label: '✨ What are you doing today?', text: 'What are you doing today?' },
  { label: '💬 Let me know when you arrive', text: 'Let me know when you arrive' },
];

export const COMMON_EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😂', '🤣', '🥹', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😜', '🤪',
  '🤩', '🥳', '😎', '🤓', '🧐', '🤗', '🤔', '🤫', '🫡', '🤝',
  '👍', '👏', '🙌', '🙏', '❤️', '🔥', '✨', '🎉', '✈️', '🌍'
];
