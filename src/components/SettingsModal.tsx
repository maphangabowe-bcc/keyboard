import React from 'react';
import { KeyboardSettings, KeyboardTheme } from '../types';
import { X, Volume2, Vibrate, Sparkles, Moon, Sun, Layers, Type, Smartphone, CheckCircle2, Palette } from 'lucide-react';
import { THEME_LIST, getThemeConfig } from '../utils/themeStyles';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: KeyboardSettings;
  onUpdateSettings: (newSettings: Partial<KeyboardSettings>) => void;
  onOpenSetDefaultModal?: () => void;
  isDefaultActive?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenSetDefaultModal,
  isDefaultActive = false,
}) => {
  if (!isOpen) return null;

  const currentThemeConfig = getThemeConfig(settings.theme);
  const isDark = currentThemeConfig.category !== 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
          isDark
            ? 'bg-neutral-900 border-neutral-700 text-white'
            : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-700/40 flex items-center justify-between">
          <h3 className="text-base font-bold">Keyboard Settings</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-800/40 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Default Keyboard System Configuration Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Default Input Keyboard</span>
                  {isDefaultActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {isDefaultActive
                    ? 'Configured as system keyboard across device'
                    : 'Enable as system-wide default keyboard'}
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-settings-open-set-default"
              onClick={() => {
                onClose();
                onOpenSetDefaultModal?.();
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0"
            >
              {isDefaultActive ? 'Manage' : 'Set as Default'}
            </button>
          </div>

          {/* Theme Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Keyboard Themes ({THEME_LIST.length})
              </label>
              <span className="text-[10px] text-blue-400 font-medium">1-Tap Apply</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {THEME_LIST.map((t) => {
                const isSelected = settings.theme === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdateSettings({ theme: t.id })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500 shadow-sm'
                        : isDark
                        ? 'bg-neutral-800/70 hover:bg-neutral-800 border-neutral-700/80 text-neutral-200'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-850'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-1 ring-white/20"
                          style={{ backgroundColor: t.dotColor }}
                        />
                        <span className="text-xs font-semibold leading-tight">{t.name}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      ) : t.badge ? (
                        <span className="text-[8px] px-1 py-0.2 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400">
                          {t.badge}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[10px] opacity-65 line-clamp-1">{t.tagline}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Size / Touch Comfort */}
          <div className="pt-2 border-t border-neutral-700/30">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
              Key Size & Touch Target
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-settings-keysize-normal"
                onClick={() => onUpdateSettings({ keySize: 'normal' })}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                  (settings.keySize || 'normal') === 'normal'
                    ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400/50'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-750'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                }`}
              >
                <div>Standard Size</div>
                <div className="text-[10px] opacity-75 font-normal mt-0.5">Default compact spacing</div>
              </button>

              <button
                type="button"
                id="btn-settings-keysize-large"
                onClick={() => onUpdateSettings({ keySize: 'large' })}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                  settings.keySize === 'large'
                    ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400/50'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-750'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                }`}
              >
                <div>Large Keys</div>
                <div className="text-[10px] opacity-75 font-normal mt-0.5">Taller keys, easy touch</div>
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 border-t border-neutral-700/30">
            {/* Live Translation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-sm font-medium">Live Instant Translation</div>
                  <div className="text-[11px] text-neutral-400">
                    Translate automatically as you type
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.liveTranslate}
                onChange={(e) => onUpdateSettings({ liveTranslate: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Key Sounds */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-sm font-medium">Key Clicks & Audio</div>
                  <div className="text-[11px] text-neutral-400">
                    Play audio feedback on keystroke
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Haptic Vibration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-sm font-medium">Haptic Feedback</div>
                  <div className="text-[11px] text-neutral-400">
                    Vibrate phone on key press
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticEnabled}
                onChange={(e) => onUpdateSettings({ hapticEnabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Key Popup Magnifier */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="text-sm font-medium">Key Magnifier Popup</div>
                  <div className="text-[11px] text-neutral-400">
                    Enlarged bubble preview above pressed letter
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.keyPopup}
                onChange={(e) => onUpdateSettings({ keyPopup: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Auto Capitalization */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-sm font-medium">Auto-Capitalize</div>
                  <div className="text-[11px] text-neutral-400">
                    Capitalize first letter of each sentence
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoCapitalize}
                onChange={(e) => onUpdateSettings({ autoCapitalize: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-neutral-700/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
