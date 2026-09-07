import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Language,
  TranslationState,
  ChatMessage,
  KeyboardSettings,
  TranslationTone,
} from './types';
import { POPULAR_LANGUAGES } from './data/languages';
import { requestTranslation } from './utils/translator';
import { PhoneFrame } from './components/PhoneFrame';
import { ChatSandbox } from './components/ChatSandbox';
import { SmartBar } from './components/SmartBar';
import { Keyboard } from './components/Keyboard';
import { LanguageModal } from './components/LanguageModal';
import { SettingsModal } from './components/SettingsModal';
import { SetDefaultKeyboardModal } from './components/SetDefaultKeyboardModal';

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(POPULAR_LANGUAGES[0]); // Spanish by default
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isSetDefaultModalOpen, setIsSetDefaultModalOpen] = useState<boolean>(false);
  const [isDefaultKeyboardActive, setIsDefaultKeyboardActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('polyglot_default_keyboard_active') === 'true';
    } catch {
      return false;
    }
  });
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [sandboxMode, setSandboxMode] = useState<'chat' | 'notepad'>('chat');
  const [isSimulatingReply, setIsSimulatingReply] = useState<boolean>(false);

  // Capture PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Ask user on first launch if they want to use PolyType as default keyboard
  useEffect(() => {
    try {
      const hasPrompted = localStorage.getItem('polytype_launch_prompted');
      if (!hasPrompted) {
        localStorage.setItem('polytype_launch_prompted', 'true');
        const timer = setTimeout(() => {
          setIsSetDefaultModalOpen(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleToggleDefaultActive = (active: boolean) => {
    setIsDefaultKeyboardActive(active);
    try {
      localStorage.setItem('polyglot_default_keyboard_active', active ? 'true' : 'false');
    } catch {}
  };

  const handleTriggerInstall = async () => {
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          handleToggleDefaultActive(true);
        }
      } catch {}
      setDeferredInstallPrompt(null);
    } else {
      setIsSetDefaultModalOpen(true);
    }
  };

  const [settings, setSettings] = useState<KeyboardSettings>({
    soundEnabled: true,
    hapticEnabled: true,
    keyPopup: true,
    liveTranslate: true,
    autoCapitalize: true,
    theme: 'clean-light',
    keySize: 'normal',
    tone: 'natural',
    speechPlayback: true,
  });

  const [translation, setTranslation] = useState<TranslationState>({
    originalText: '',
    translatedText: '',
    romanization: '',
    explanation: '',
    isLoading: false,
    source: 'idle',
    error: null,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg-1',
      originalText: 'Hello, welcome to the translator keyboard!',
      translatedText: '¡Hola, bienvenido al teclado traductor!',
      targetLanguage: 'es',
      timestamp: '9:41 AM',
      sender: 'partner',
    },
  ]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced Live Translation Effect
  const performTranslation = useCallback(
    async (text: string, lang: Language, tone: TranslationTone) => {
      const trimmed = text.trim();
      if (!trimmed) {
        setTranslation({
          originalText: '',
          translatedText: '',
          romanization: '',
          explanation: '',
          isLoading: false,
          source: 'idle',
        });
        return;
      }

      setTranslation((prev) => ({
        ...prev,
        originalText: text,
        isLoading: true,
      }));

      try {
        const res = await requestTranslation({
          text: trimmed,
          targetLanguage: lang.name,
          targetLanguageCode: lang.code,
          tone,
        });

        setTranslation({
          originalText: text,
          translatedText: res.translatedText,
          romanization: res.romanization,
          explanation: res.explanation,
          isLoading: false,
          source: res.source,
          accuracy: res.accuracy,
          detectedSourceLang: res.detectedSourceLang,
          error: null,
        });
      } catch (err: any) {
        setTranslation((prev) => ({
          ...prev,
          isLoading: false,
          error: err?.message || 'Translation failed',
        }));
      }
    },
    []
  );

  useEffect(() => {
    if (!settings.liveTranslate) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!inputText.trim()) {
      setTranslation({
        originalText: '',
        translatedText: '',
        romanization: '',
        explanation: '',
        isLoading: false,
        source: 'idle',
      });
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performTranslation(inputText, currentLanguage, settings.tone);
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputText, currentLanguage, settings.liveTranslate, settings.tone, performTranslation]);

  // Key press handlers from virtual keyboard or hardware keyboard
  const handleKeyPress = (char: string) => {
    setInputText((prev) => prev + char);
  };

  const handleBackspace = () => {
    setInputText((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setInputText((prev) => prev + ' ');
  };

  const handleReturn = () => {
    if (!inputText.trim() && !translation.translatedText.trim()) return;

    const finalTranslated = translation.translatedText || inputText;
    const now = new Date();
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${
      now.getHours() >= 12 ? 'PM' : 'AM'
    }`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      originalText: inputText,
      translatedText: finalTranslated,
      targetLanguage: currentLanguage.code,
      timestamp: timeStr,
      sender: 'user',
      romanization: translation.romanization,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTranslation({
      originalText: '',
      translatedText: '',
      romanization: '',
      explanation: '',
      isLoading: false,
      source: 'idle',
    });
  };

  const handleInsertTranslation = () => {
    if (!translation.translatedText) return;
    setInputText(translation.translatedText);
  };

  const handleManualTranslate = () => {
    performTranslation(inputText, currentLanguage, settings.tone);
  };

  const handleSelectLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    if (inputText.trim()) {
      performTranslation(inputText, lang, settings.tone);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setInputText(promptText);
    performTranslation(promptText, currentLanguage, settings.tone);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const handleClearInput = () => {
    setInputText('');
    setTranslation({
      originalText: '',
      translatedText: '',
      romanization: '',
      explanation: '',
      isLoading: false,
      source: 'idle',
    });
  };

  const handleSimulateReply = async () => {
    if (isSimulatingReply) return;
    setIsSimulatingReply(true);

    try {
      const now = new Date();
      const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${
        now.getHours() >= 12 ? 'PM' : 'AM'
      }`;

      // Simulate a natural response in the target language
      const promptToTranslate = 'That sounds great! Thank you for speaking with me.';
      const res = await requestTranslation({
        text: promptToTranslate,
        targetLanguage: currentLanguage.name,
        tone: 'natural',
      });

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            originalText: promptToTranslate,
            translatedText: res.translatedText,
            targetLanguage: currentLanguage.code,
            timestamp: timeStr,
            sender: 'partner',
            romanization: res.romanization,
          },
        ]);
        setIsSimulatingReply(false);
      }, 1200);
    } catch {
      setIsSimulatingReply(false);
    }
  };

  return (
    <PhoneFrame
      theme={settings.theme}
      onOpenSetDefaultModal={() => setIsSetDefaultModalOpen(true)}
      onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      isDefaultActive={isDefaultKeyboardActive}
    >
      {/* 1. Sandbox Messaging / Memo Area (Upper portion of phone) */}
      <ChatSandbox
        messages={messages}
        inputText={inputText}
        translation={translation}
        currentLanguage={currentLanguage}
        onClearInput={handleClearInput}
        onSelectPrompt={handleSelectPrompt}
        onClearHistory={handleClearHistory}
        onSimulateReply={handleSimulateReply}
        isSimulatingReply={isSimulatingReply}
        theme={settings.theme}
        mode={sandboxMode}
        onChangeMode={setSandboxMode}
      />

      {/* 2. Keyboard Smart Translation Bar */}
      <SmartBar
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenSetDefaultModal={() => setIsSetDefaultModalOpen(true)}
        isDefaultActive={isDefaultKeyboardActive}
        translation={translation}
        onInsertTranslation={handleInsertTranslation}
        theme={settings.theme}
        onChangeTheme={(newTheme) =>
          setSettings((prev) => ({ ...prev, theme: newTheme }))
        }
        keySize={settings.keySize || 'normal'}
        onChangeKeySize={(newSize) =>
          setSettings((prev) => ({ ...prev, keySize: newSize }))
        }
        tone={settings.tone}
        onChangeTone={(newTone) => {
          setSettings((prev) => ({ ...prev, tone: newTone }));
          if (inputText.trim()) {
            performTranslation(inputText, currentLanguage, newTone);
          }
        }}
        liveTranslate={settings.liveTranslate}
        onToggleLiveTranslate={() =>
          setSettings((prev) => ({ ...prev, liveTranslate: !prev.liveTranslate }))
        }
        onManualTranslate={handleManualTranslate}
      />

      {/* 3. Virtual Mobile Keyboard (Lower portion of phone) */}
      <Keyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
        onReturn={handleReturn}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        currentLanguage={currentLanguage}
        settings={settings}
      />

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        theme={settings.theme}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onOpenSetDefaultModal={() => setIsSetDefaultModalOpen(true)}
        isDefaultActive={isDefaultKeyboardActive}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
      />

      {/* Set as Default Keyboard Setup Modal */}
      <SetDefaultKeyboardModal
        isOpen={isSetDefaultModalOpen}
        onClose={() => setIsSetDefaultModalOpen(false)}
        theme={settings.theme}
        isDefaultActive={isDefaultKeyboardActive}
        onToggleDefaultActive={handleToggleDefaultActive}
        deferredInstallPrompt={deferredInstallPrompt}
        onTriggerInstall={handleTriggerInstall}
      />
    </PhoneFrame>
  );
}
