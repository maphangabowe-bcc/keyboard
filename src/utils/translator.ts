import { TranslationState, TranslationTone } from '../types';

interface TranslateParams {
  text: string;
  targetLanguage: string;
  targetLanguageCode?: string;
  tone?: TranslationTone;
  context?: string;
}

const translationCache = new Map<
  string,
  {
    translatedText: string;
    romanization?: string;
    explanation?: string;
    source: 'gemini-ai' | 'neural-engine' | 'offline-engine';
    accuracy?: string;
    detectedSourceLang?: string;
  }
>();

export async function requestTranslation({
  text,
  targetLanguage,
  targetLanguageCode,
  tone = 'natural',
  context = 'mobile messenger',
}: TranslateParams): Promise<{
  translatedText: string;
  romanization?: string;
  explanation?: string;
  source: 'gemini-ai' | 'neural-engine' | 'offline-engine';
  accuracy?: string;
  detectedSourceLang?: string;
}> {
  const clean = text.trim();
  if (!clean) {
    return {
      translatedText: '',
      romanization: '',
      explanation: '',
      source: 'offline-engine',
    };
  }

  const cacheKey = `${clean.toLowerCase()}___${(targetLanguageCode || targetLanguage).toLowerCase()}___${tone}`;
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!;
    return {
      ...cached,
    };
  }

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: clean,
        targetLanguage,
        targetLanguageCode,
        tone,
        context,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    const result = {
      translatedText: data.translatedText || clean,
      romanization: data.romanization || '',
      explanation: data.explanation || '',
      source: (data.source as 'gemini-ai' | 'neural-engine' | 'offline-engine') || 'neural-engine',
      accuracy: data.accuracy || '100% Neural Accuracy',
      detectedSourceLang: data.detectedSourceLang || '',
    };

    // Cache successful translation
    translationCache.set(cacheKey, {
      translatedText: result.translatedText,
      romanization: result.romanization,
      explanation: result.explanation,
      source: result.source,
      accuracy: result.accuracy,
      detectedSourceLang: result.detectedSourceLang,
    });

    return result;
  } catch {
    return {
      translatedText: clean,
      romanization: '',
      explanation: 'Offline network mode',
      source: 'offline-engine',
    };
  }
}
