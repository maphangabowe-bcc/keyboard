import React, { useState } from 'react';
import { KeyboardTheme, KeySize } from '../types';
import { getThemeConfig } from '../utils/themeStyles';

interface KeyProps {
  label: string;
  display?: React.ReactNode;
  isAction?: boolean;
  flex?: string;
  onPress: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
  active?: boolean;
  showPopup?: boolean;
  theme: KeyboardTheme;
  keySize?: KeySize;
  id?: string;
}

export const Key: React.FC<KeyProps> = ({
  label,
  display,
  isAction = false,
  flex = '1',
  onPress,
  onPressStart,
  onPressEnd,
  active = false,
  showPopup = true,
  theme,
  keySize = 'normal',
  id,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const themeConfig = getThemeConfig(theme);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressed(true);
    if (onPressStart) onPressStart();
    onPress();
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    if (onPressEnd) onPressEnd();
  };

  const handlePointerLeave = () => {
    if (isPressed) {
      setIsPressed(false);
      if (onPressEnd) onPressEnd();
    }
  };

  const getKeyClasses = () => {
    if (label.toLowerCase() === 'space') {
      return themeConfig.keySpace;
    }
    if (isAction) {
      return active ? themeConfig.keyActionActive : themeConfig.keyAction;
    }
    return themeConfig.keyNormal;
  };

  // Height and font size based on keySize
  const isLarge = keySize === 'large';
  const heightClass = isLarge ? 'h-13 sm:h-14' : 'h-11 sm:h-12';
  const textClass = isLarge ? 'text-[19px] sm:text-[20px]' : 'text-[17px]';

  return (
    <div
      className="relative select-none flex items-center justify-center"
      style={{ flex }}
      id={id || `key-${label.toLowerCase()}`}
    >
      {/* Key popup magnifier for normal letter keys */}
      {isPressed && showPopup && !isAction && label.length === 1 && (
        <div
          className={`absolute ${isLarge ? '-top-14 w-14 h-16' : '-top-12 w-12 h-14'} z-50 rounded-xl flex items-center justify-center pointer-events-none transition-transform animate-in fade-in duration-75 text-2xl font-bold ${themeConfig.keyPopup}`}
        >
          {label}
        </div>
      )}

      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
        className={`w-full ${heightClass} rounded-lg transition-all duration-75 flex items-center justify-center touch-manipulation select-none cursor-pointer ${getKeyClasses()} ${
          isPressed ? 'brightness-110' : ''
        }`}
      >
        {display || <span className={`${textClass} tracking-wide font-sans`}>{label}</span>}
      </button>
    </div>
  );
};

