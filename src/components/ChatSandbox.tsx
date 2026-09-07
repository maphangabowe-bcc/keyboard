import React, { useRef, useEffect } from 'react';
import {
  ChatMessage,
  Language,
  TranslationState,
  KeyboardTheme,
} from '../types';
import { QUICK_PROMPTS } from '../data/languages';
import {
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  MessageSquare,
  FileText,
  Trash2,
  Bot,
} from 'lucide-react';
import { speakText } from '../utils/sound';
import { getThemeConfig } from '../utils/themeStyles';

interface ChatSandboxProps {
  messages: ChatMessage[];
  inputText: string;
  translation: TranslationState;
  currentLanguage: Language;
  onClearInput: () => void;
  onSelectPrompt: (text: string) => void;
  onClearHistory: () => void;
  onSimulateReply: () => void;
  isSimulatingReply: boolean;
  theme: KeyboardTheme;
  mode: 'chat' | 'notepad';
  onChangeMode: (mode: 'chat' | 'notepad') => void;
}

export const ChatSandbox: React.FC<ChatSandboxProps> = ({
  messages,
  inputText,
  translation,
  currentLanguage,
  onClearInput,
  onSelectPrompt,
  onClearHistory,
  onSimulateReply,
  isSimulatingReply,
  theme,
  mode,
  onChangeMode,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, inputText]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const themeConfig = getThemeConfig(theme);
  const isLight = themeConfig.category === 'light';
  const isDark = !isLight;

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      {/* Top Header of the Sandbox */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between shrink-0 select-none transition-colors ${themeConfig.chatHeaderBg}`}
      >
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold shadow-xs">
              {currentLanguage.flag}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-neutral-900" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-semibold tracking-tight leading-none">
                {currentLanguage.name} Channel
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-medium">
                Live
              </span>
            </div>
            <p className="text-[10px] opacity-70 mt-0.5">
              Typing in English ➔ Translating to {currentLanguage.nativeName}
            </p>
          </div>
        </div>

        {/* View Switcher: Chat vs Notepad & Clear */}
        <div className="flex items-center gap-1">
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs ${
              isDark ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-100 border-neutral-200'
            }`}
          >
            <button
              type="button"
              id="btn-mode-chat"
              onClick={() => onChangeMode('chat')}
              className={`p-1 rounded flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
                mode === 'chat'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Chat Simulation"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              id="btn-mode-notepad"
              onClick={() => onChangeMode('notepad')}
              className={`p-1 rounded flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
                mode === 'notepad'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Notepad / Memo View"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            id="btn-clear-chat"
            onClick={onClearHistory}
            className="p-1.5 rounded-lg transition-colors active:scale-95 opacity-60 hover:opacity-100 cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Phrase Suggestion Chips */}
      <div
        className={`px-3 py-1.5 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none transition-colors ${themeConfig.chatQuickBarBg}`}
      >
        <span className="text-[10px] font-semibold opacity-50 shrink-0 uppercase tracking-wider">
          Quick:
        </span>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            id={`quick-prompt-${i}`}
            onClick={() => onSelectPrompt(prompt.text)}
            className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all active:scale-95 cursor-pointer ${themeConfig.quickPromptChip}`}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Scrollable Conversation or Notepad Area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-3 flex flex-col gap-3.5 transition-colors ${themeConfig.chatBodyBg}`}
      >
        {mode === 'notepad' ? (
          /* NOTEPAD / DOCUMENT VIEW */
          <div className="flex flex-col gap-3 max-w-xl mx-auto w-full">
            <div
              className={`p-4 rounded-xl border shadow-sm flex flex-col gap-3 ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-700/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Translated Document Memo
                </span>
                <span className="text-xs opacity-60">{currentLanguage.name} ({currentLanguage.flag})</span>
              </div>

              {/* Accumulated or Active Translated Note */}
              <div className="min-h-[140px] text-base leading-relaxed whitespace-pre-wrap font-sans">
                {messages.length === 0 && !translation.translatedText ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center opacity-50 text-sm italic">
                    Type English sentences on the mobile keyboard below. They will immediately translate into{' '}
                    {currentLanguage.name} right here!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className="group relative pb-2 border-b border-neutral-800/20">
                        <p className="text-base font-medium">{m.translatedText}</p>
                        {m.romanization && (
                          <p className="text-xs text-amber-400 font-mono mt-0.5">🗣️ {m.romanization}</p>
                        )}
                        <p className="text-xs opacity-60 mt-0.5 italic">En: {m.originalText}</p>
                      </div>
                    ))}
                    {translation.translatedText && (
                      <div className="p-2.5 rounded-lg bg-blue-500/15 border border-blue-500/30">
                        <p className="text-base font-medium text-blue-300">{translation.translatedText}</p>
                        {translation.romanization && (
                          <p className="text-xs text-amber-400 font-mono mt-0.5">🗣️ {translation.romanization}</p>
                        )}
                        <p className="text-xs opacity-70 mt-0.5">En: {inputText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* CHAT MESSAGING VIEW */
          <>
            {messages.length === 0 && (
              <div className="my-auto flex flex-col items-center text-center py-6 px-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-2xl mb-2.5 shadow-sm">
                  {currentLanguage.flag}
                </div>
                <h3 className="text-sm font-bold opacity-90">
                  Ready to translate to {currentLanguage.name}
                </h3>
                <p className="text-xs opacity-60 max-w-xs mt-1 leading-relaxed">
                  Start tapping on the virtual keyboard below or use your physical keyboard. Your English words convert in real-time!
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl text-sm shadow-xs transition-all relative group ${
                      isUser
                        ? `${themeConfig.userBubble} rounded-br-xs`
                        : `${themeConfig.partnerBubble} rounded-bl-xs`
                    }`}
                  >
                    {/* Translated text */}
                    <div
                      className="text-[14px] font-medium leading-snug"
                      dir={isUser ? currentLanguage.direction || 'ltr' : 'ltr'}
                    >
                      {msg.translatedText}
                    </div>

                    {/* Phonetics / Romanization */}
                    {msg.romanization && (
                      <div className="text-[11px] text-amber-300 font-mono mt-1 pt-1 border-t border-white/20">
                        🗣️ {msg.romanization}
                      </div>
                    )}

                    {/* Original English Sub-label */}
                    {isUser && (
                      <div className="text-[11px] opacity-80 mt-1 pt-1 border-t border-white/20">
                        <span className="opacity-75">English:</span> {msg.originalText}
                      </div>
                    )}

                    {/* Action buttons (Listen & Copy) */}
                    <div className="flex items-center gap-1.5 mt-2 justify-end opacity-90">
                      <button
                        type="button"
                        onClick={() => speakText(msg.translatedText, msg.targetLanguage)}
                        className="p-1 rounded hover:bg-black/20 text-current transition-colors cursor-pointer"
                        title="Listen to native voice"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.translatedText)}
                        className="p-1 rounded hover:bg-black/20 text-current transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="text-[10px] opacity-60 ml-1">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isSimulatingReply && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-800/60 max-w-[180px] text-xs opacity-70 animate-pulse">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
                <span>Partner typing in {currentLanguage.name}...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Active Typing Input Bar (Right above the keyboard) */}
      <div
        className={`px-3 py-2 border-t flex flex-col gap-1 select-none shrink-0 transition-colors ${themeConfig.inputBarBg}`}
      >
        <div className="flex items-center justify-between text-[11px] opacity-70">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">English Input Buffer:</span>
            {inputText && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 opacity-90">
                {inputText.length} chars
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && mode === 'chat' && (
              <button
                type="button"
                id="btn-simulate-partner-reply"
                onClick={onSimulateReply}
                disabled={isSimulatingReply}
                className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center gap-1 font-medium active:scale-95 transition-all cursor-pointer"
                title="Simulate a reply from a native speaker"
              >
                <Bot className="w-3 h-3" />
                Simulate Reply
              </button>
            )}

            {inputText && (
              <button
                type="button"
                id="btn-clear-input-buffer"
                onClick={onClearInput}
                className="hover:opacity-100 transition-opacity cursor-pointer"
                title="Clear current input"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Input box showing live text */}
        <div
          className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 min-h-[42px] transition-colors ${themeConfig.inputFieldBg}`}
        >
          <div className="flex-1 font-sans text-sm break-words">
            {inputText ? (
              <span>
                {inputText}
                <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
              </span>
            ) : (
              <span className="opacity-50 italic text-xs">
                Tap virtual keys or type on your keyboard in English...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
