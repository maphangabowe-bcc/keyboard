import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardLayout,
  KeyboardTheme,
  KeyboardSettings,
  Language,
} from '../types';
import { Key } from './Key';
import { COMMON_EMOJIS } from '../data/languages';
import { playKeySound, triggerHaptic } from '../utils/sound';
import { getThemeConfig } from '../utils/themeStyles';
import {
  ArrowBigUp,
  Delete,
  Globe,
  Smile,
  Mic,
  CornerDownLeft,
} from 'lucide-react';

interface KeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onReturn: () => void;
  onOpenLanguageModal: () => void;
  currentLanguage: Language;
  settings: KeyboardSettings;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onSpace,
  onReturn,
  onOpenLanguageModal,
  currentLanguage,
  settings,
}) => {
  const [layout, setLayout] = useState<KeyboardLayout>('alpha');
  const [isShifted, setIsShifted] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const lastShiftTapRef = useRef<number>(0);
  const lastSpaceTapRef = useRef<number>(0);
  const backspaceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-capitalization at start or after period
  useEffect(() => {
    if (settings.autoCapitalize) {
      setIsShifted(true);
    }
  }, [settings.autoCapitalize]);

  // Physical keyboard listener so the user can also type with physical desktop keyboard!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea element that isn't our managed canvas
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT')) {
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleReturn();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleSpace();
      } else if (e.key === 'Shift') {
        setIsShifted((prev) => !prev);
      } else if (e.key.length === 1) {
        e.preventDefault();
        handleChar(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShifted, isCapsLock, settings]);

  const handleChar = (char: string) => {
    playKeySound('standard', settings.soundEnabled);
    triggerHaptic(settings.hapticEnabled);

    const outChar = isShifted || isCapsLock ? char.toUpperCase() : char.toLowerCase();
    onKeyPress(outChar);

    // After typing a single character, release shift unless caps lock is on
    if (isShifted && !isCapsLock) {
      setIsShifted(false);
    }
  };

  const handleSpace = () => {
    playKeySound('space', settings.soundEnabled);
    triggerHaptic(settings.hapticEnabled);

    const now = Date.now();
    // Double tap space shortcut inserts period + space
    if (now - lastSpaceTapRef.current < 350) {
      onBackspace();
      onKeyPress('. ');
      if (settings.autoCapitalize) {
        setIsShifted(true);
      }
      lastSpaceTapRef.current = 0;
    } else {
      lastSpaceTapRef.current = now;
      onSpace();
    }
  };

  const handleBackspace = () => {
    playKeySound('backspace', settings.soundEnabled);
    triggerHaptic(settings.hapticEnabled);
    onBackspace();
  };

  const handleBackspaceStart = () => {
    if (backspaceIntervalRef.current) clearInterval(backspaceIntervalRef.current);
    // After 400ms hold, start repeating delete
    const timeout = setTimeout(() => {
      backspaceIntervalRef.current = setInterval(() => {
        playKeySound('backspace', settings.soundEnabled);
        triggerHaptic(settings.hapticEnabled);
        onBackspace();
      }, 70);
    }, 350);

    const cleanup = () => {
      clearTimeout(timeout);
      if (backspaceIntervalRef.current) clearInterval(backspaceIntervalRef.current);
    };

    window.addEventListener('pointerup', cleanup, { once: true });
  };

  const handleBackspaceEnd = () => {
    if (backspaceIntervalRef.current) {
      clearInterval(backspaceIntervalRef.current);
      backspaceIntervalRef.current = null;
    }
  };

  const handleShift = () => {
    playKeySound('action', settings.soundEnabled);
    triggerHaptic(settings.hapticEnabled);

    const now = Date.now();
    if (now - lastShiftTapRef.current < 320) {
      // Double tap shift = Caps lock
      setIsCapsLock((prev) => !prev);
      setIsShifted(false);
    } else {
      if (isCapsLock) {
        setIsCapsLock(false);
        setIsShifted(false);
      } else {
        setIsShifted((prev) => !prev);
      }
    }
    lastShiftTapRef.current = now;
  };

  const handleReturn = () => {
    playKeySound('action', settings.soundEnabled);
    triggerHaptic(settings.hapticEnabled);
    onReturn();
  };

  // Keyboard theme container background
  const getContainerBg = () => {
    return getThemeConfig(settings.theme).keyboardChassisBg;
  };

  const alphaRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  const numericRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['.', ',', '?', '!', "'"],
  ];

  const symbolRows = [
    ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
    ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'],
    ['.', ',', '?', '!', "'"],
  ];

  return (
    <div
      id="virtual-mobile-keyboard"
      className={`w-full p-1.5 sm:p-2 select-none flex flex-col gap-1.5 sm:gap-2 transition-colors ${getContainerBg()}`}
    >
      {/* EMOJI PICKER LAYOUT */}
      {layout === 'emoji' ? (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-8 gap-1.5 h-44 overflow-y-auto p-1 bg-black/20 rounded-lg">
            {COMMON_EMOJIS.map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                id={`emoji-btn-${idx}`}
                onClick={() => {
                  playKeySound('standard', settings.soundEnabled);
                  triggerHaptic(settings.hapticEnabled);
                  onKeyPress(emoji);
                }}
                className="text-2xl h-10 flex items-center justify-center rounded hover:bg-white/10 active:scale-90 transition-all"
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <Key
              label="ABC"
              isAction
              flex="1.5"
              theme={settings.theme}
              keySize={settings.keySize}
              onPress={() => setLayout('alpha')}
            />
            <Key
              label="space"
              flex="4"
              theme={settings.theme}
              keySize={settings.keySize}
              onPress={handleSpace}
              display={<span className="text-xs uppercase opacity-70">space</span>}
            />
            <Key
              label="del"
              isAction
              flex="1.2"
              theme={settings.theme}
              keySize={settings.keySize}
              onPress={handleBackspace}
              display={<Delete className="w-4 h-4" />}
            />
          </div>
        </div>
      ) : (
        /* STANDARD QWERTY / NUMERIC / SYMBOL LAYOUT */
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* ROW 1 */}
          <div className="flex gap-1 sm:gap-1.5 w-full justify-center">
            {(layout === 'alpha'
              ? alphaRows[0]
              : layout === 'numeric'
              ? numericRows[0]
              : symbolRows[0]
            ).map((char) => {
              const displayChar = isShifted || isCapsLock ? char.toUpperCase() : char;
              return (
                <Key
                  key={char}
                  label={displayChar}
                  theme={settings.theme}
                  keySize={settings.keySize}
                  showPopup={settings.keyPopup}
                  onPress={() => handleChar(char)}
                />
              );
            })}
          </div>

          {/* ROW 2 */}
          <div className="flex gap-1 sm:gap-1.5 w-full px-1.5 sm:px-2.5 justify-center">
            {(layout === 'alpha'
              ? alphaRows[1]
              : layout === 'numeric'
              ? numericRows[1]
              : symbolRows[1]
            ).map((char) => {
              const displayChar = isShifted || isCapsLock ? char.toUpperCase() : char;
              return (
                <Key
                  key={char}
                  label={displayChar}
                  theme={settings.theme}
                  keySize={settings.keySize}
                  showPopup={settings.keyPopup}
                  onPress={() => handleChar(char)}
                />
              );
            })}
          </div>

          {/* ROW 3 */}
          <div className="flex gap-1 sm:gap-1.5 w-full justify-center">
            {layout === 'alpha' ? (
              <Key
                label="shift"
                isAction
                flex="1.3"
                theme={settings.theme}
                keySize={settings.keySize}
                active={isShifted || isCapsLock}
                onPress={handleShift}
                display={
                  <ArrowBigUp
                    className={`w-5 h-5 transition-transform ${
                      isCapsLock
                        ? 'text-blue-400 fill-blue-400'
                        : isShifted
                        ? 'text-white fill-white'
                        : 'opacity-80'
                    }`}
                  />
                }
              />
            ) : (
              <Key
                label={layout === 'numeric' ? '#+=' : '123'}
                isAction
                flex="1.3"
                theme={settings.theme}
                keySize={settings.keySize}
                onPress={() => setLayout(layout === 'numeric' ? 'symbols' : 'numeric')}
                display={<span className="text-xs font-semibold">{layout === 'numeric' ? '#+=' : '123'}</span>}
              />
            )}

            {(layout === 'alpha'
              ? alphaRows[2]
              : layout === 'numeric'
              ? numericRows[2]
              : symbolRows[2]
            ).map((char) => {
              const displayChar = isShifted || isCapsLock ? char.toUpperCase() : char;
              return (
                <Key
                  key={char}
                  label={displayChar}
                  theme={settings.theme}
                  keySize={settings.keySize}
                  showPopup={settings.keyPopup}
                  onPress={() => handleChar(char)}
                />
              );
            })}

            <Key
              label="backspace"
              isAction
              flex="1.3"
              theme={settings.theme}
              keySize={settings.keySize}
              onPress={handleBackspace}
              onPressStart={handleBackspaceStart}
              onPressEnd={handleBackspaceEnd}
              display={<Delete className="w-5 h-5 opacity-90" />}
            />
          </div>

          {/* ROW 4 - BOTTOM ACTION ROW */}
          <div className="flex gap-1 sm:gap-1.5 w-full justify-center">
            {layout === 'alpha' ? (
              <Key
                label="123"
                isAction
                flex="1.25"
                theme={settings.theme}
                keySize={settings.keySize}
                onPress={() => setLayout('numeric')}
                display={<span className="text-xs font-bold tracking-tight">123</span>}
              />
            ) : (
              <Key
                label="ABC"
                isAction
                flex="1.25"
                theme={settings.theme}
                keySize={settings.keySize}
                onPress={() => setLayout('alpha')}
                display={<span className="text-xs font-bold tracking-tight">ABC</span>}
              />
            )}

            {/* Language Globe Button */}
            <Key
              label="globe"
              isAction
              flex="0.9"
              theme={settings.theme}
              keySize={settings.keySize}
              onPress={onOpenLanguageModal}
              display={<Globe className="w-4 h-4 opacity-80" />}
            />

            {/* Emoji Button */}
            <Key
              label="emoji"
              isAction
              flex="0.9"
              theme={settings.theme}
              keySize={settings.keySize}
              onPress={() => setLayout('emoji')}
              display={<Smile className="w-4 h-4 opacity-80" />}
            />

            {/* Space Bar */}
            <Key
              label="space"
              flex="3.8"
              theme={settings.theme}
              keySize={settings.keySize}
              onPress={handleSpace}
              display={
                <div className="flex items-center gap-1.5 opacity-70">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">space</span>
                  <span className="text-[10px] opacity-80 font-medium">({currentLanguage.name})</span>
                </div>
              }
            />

            {/* Return / Send Button */}
            <Key
              label="return"
              isAction
              flex="1.6"
              theme={settings.theme}
              keySize={settings.keySize}
              active
              onPress={handleReturn}
              display={
                <div className="flex items-center gap-1 text-xs font-bold">
                  <span>Send</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};
