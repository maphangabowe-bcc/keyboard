import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Maximize2, Minimize2, CheckCircle2, Sparkles, Palette } from 'lucide-react';
import { KeyboardTheme } from '../types';
import { getThemeConfig } from '../utils/themeStyles';

interface PhoneFrameProps {
  children: React.ReactNode;
  theme: KeyboardTheme;
  onOpenSetDefaultModal?: () => void;
  onOpenSettingsModal?: () => void;
  isDefaultActive?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  theme,
  onOpenSetDefaultModal,
  onOpenSettingsModal,
  isDefaultActive = false,
}) => {
  const [currentTime, setCurrentTime] = useState('9:41');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${mins}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  const themeConfig = getThemeConfig(theme);

  return (
    <div className="w-full min-h-screen bg-[#05070a] flex flex-col items-center justify-center p-0 sm:p-4 text-neutral-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Floating Control Pill */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-sm mb-2 px-1 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-tight text-xs mr-0.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50" />
            <span>PolyType</span>
          </div>

          <button
            type="button"
            id="btn-header-set-default"
            onClick={onOpenSetDefaultModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer ${
              isDefaultActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 hover:text-blue-300'
            }`}
            title="Setup as default keyboard on Android, iPhone, or Desktop"
          >
            {isDefaultActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Default Active</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Set as Default</span>
              </>
            )}
          </button>

          {onOpenSettingsModal && (
            <button
              type="button"
              id="btn-header-theme-toggle"
              onClick={onOpenSettingsModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60 transition-all active:scale-95 cursor-pointer"
              title="Change keyboard theme"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{themeConfig.name}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          id="btn-toggle-fullscreen"
          onClick={() => setIsFullScreen((prev) => !prev)}
          className="flex items-center gap-1 hover:text-white transition-colors px-2 py-0.5 rounded-full hover:bg-neutral-850 cursor-pointer"
        >
          {isFullScreen ? (
            <>
              <Minimize2 className="w-3 h-3" />
              <span>Phone</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3 h-3" />
              <span>Expand</span>
            </>
          )}
        </button>
      </header>

      {/* Main Smartphone Shell */}
      <main
        className={`w-full transition-all duration-300 flex flex-col overflow-hidden relative ${
          isFullScreen
            ? 'h-screen max-w-none rounded-none border-0'
            : 'sm:max-w-[420px] h-screen sm:h-[850px] sm:max-h-[94vh] sm:rounded-[46px] sm:border-[9px] sm:border-[#1e232d] sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] sm:ring-1 sm:ring-white/10'
        } ${themeConfig.phoneShellBg}`}
      >
        {/* Subtle speaker slit on hardware bezel */}
        {!isFullScreen && (
          <div className="hidden sm:block absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-neutral-700/50 z-40" />
        )}

        {/* Dynamic Island / Mobile Status Bar */}
        <div
          className={`w-full h-11 px-6 flex items-center justify-between shrink-0 select-none z-30 transition-colors ${themeConfig.statusBarClass}`}
        >
          {/* Time */}
          <span className="text-xs font-semibold tracking-tight">{currentTime}</span>

          {/* Dynamic Island Notch */}
          <div className="hidden sm:flex items-center justify-center w-24 h-5 bg-black rounded-full shadow-inner ring-1 ring-neutral-800">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-800 mr-2" />
            <div className="w-2 h-2 rounded-full bg-blue-950 ring-1 ring-blue-900" />
          </div>

          {/* Mobile Status Icons */}
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {children}
        </div>

        {/* Bottom Home Bar Indicator */}
        <div
          className={`w-full h-5 flex items-center justify-center shrink-0 z-30 select-none transition-colors ${themeConfig.homeBarClass}`}
        >
          <div className="w-32 h-1 rounded-full bg-neutral-400/40" />
        </div>
      </main>
    </div>
  );
};
