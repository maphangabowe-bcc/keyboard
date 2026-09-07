import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Globe,
  Settings,
  Sparkles,
  ArrowRight,
  Maximize2,
  Share2,
  Layers,
} from 'lucide-react';
import { KeyboardTheme } from '../types';

interface SetDefaultKeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: KeyboardTheme;
  isDefaultActive: boolean;
  onToggleDefaultActive: (active: boolean) => void;
  deferredInstallPrompt: any;
  onTriggerInstall: () => void;
}

type TabType = 'android' | 'ios' | 'desktop';

export const SetDefaultKeyboardModal: React.FC<SetDefaultKeyboardModalProps> = ({
  isOpen,
  onClose,
  theme,
  isDefaultActive,
  onToggleDefaultActive,
  deferredInstallPrompt,
  onTriggerInstall,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('android');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [testText, setTestText] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'android-1': false,
    'android-2': false,
    'android-3': false,
    'ios-1': false,
    'ios-2': false,
    'ios-3': false,
    'desktop-1': false,
    'desktop-2': false,
  });

  // Auto-detect user OS on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/android/i.test(ua)) {
        setActiveTab('android');
      } else if (/iphone|ipad|ipod/i.test(ua)) {
        setActiveTab('ios');
      } else {
        setActiveTab('android'); // Default to Android as most common for custom IMEs
      }
    }
  }, []);

  if (!isOpen) return null;

  const isLight = theme === 'clean-light' || theme === 'ios-light' || theme === 'soft-sand';
  const isDark = !isLight;

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const handleCopyPath = (textToCopy: string, key: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleOpenAndroidSettings = () => {
    try {
      // Android Intent scheme for Input Method Settings
      window.location.href = 'intent:#Intent;action=android.settings.INPUT_METHOD_SETTINGS;end';
    } catch {
      handleCopyPath('Settings > System > Languages & input > On-screen keyboard', 'android-path');
    }
  };

  const handleOpenFloatingWindow = () => {
    const width = 420;
    const height = 740;
    const left = Math.max(0, window.screen.width - width - 40);
    const top = 60;
    window.open(
      window.location.href,
      'PolyTypeKeyboardWindow',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col overflow-hidden max-h-[90vh] ${
          isDark
            ? 'bg-neutral-900 border-neutral-700/80 text-white'
            : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-700/40 flex items-center justify-between shrink-0 bg-neutral-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">Set as Default Keyboard</h3>
                {isDefaultActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                Activate real-time translation across all apps on your device
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-set-default-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selection Tabs */}
        <div className="px-5 pt-3 pb-1 border-b border-neutral-700/30 flex gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'android'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-neutral-800/40 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'ios'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-neutral-800/40 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-300" />
            <span>iPhone / iOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'desktop'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-neutral-800/40 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Laptop className="w-4 h-4 text-purple-400" />
            <span>Desktop & Popout</span>
          </button>
        </div>

        {/* Main Step-by-Step Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-sm">
          {/* Quick 1-Click Install Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-xs text-white">Step 1: Install to Your Device</div>
                <div className="text-[11px] text-neutral-300">
                  Installs PolyType Keyboard as a standalone system app
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-install-pwa-now"
              onClick={onTriggerInstall}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{deferredInstallPrompt ? 'Install Now' : 'Add to Home'}</span>
            </button>
          </div>

          {/* Android Steps */}
          {activeTab === 'android' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Android System Activation Guide</span>
                <span className="text-[10px] lowercase text-neutral-500">Android 9 to 15+</span>
              </div>

              {/* Step A1 */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  completedSteps['android-1']
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isDark
                    ? 'bg-neutral-800/40 border-neutral-700/60'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleStep('android-1')}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 transition-colors ${
                        completedSteps['android-1']
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-neutral-600 bg-neutral-800 text-transparent hover:border-neutral-400'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1.5">
                        <span>1. Open Device Keyboard Settings</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Go to your phone's <strong>Settings</strong> ➔{' '}
                        <strong>System</strong> (or <strong>General Management</strong> on Samsung){' '}
                        ➔ <strong>Languages & Input</strong> ➔ <strong>On-screen keyboard</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 pl-8">
                  <button
                    type="button"
                    onClick={handleOpenAndroidSettings}
                    className="px-3 py-1 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3 text-blue-400" />
                    <span>Open Keyboard Settings</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-neutral-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopyPath(
                        'Settings > System > Languages & input > On-screen keyboard',
                        'android-path'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors flex items-center gap-1 border border-neutral-700"
                  >
                    {copiedText === 'android-path' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied Path</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400" />
                        <span>Copy Path</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step A2 */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  completedSteps['android-2']
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isDark
                    ? 'bg-neutral-800/40 border-neutral-700/60'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleStep('android-2')}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 transition-colors ${
                      completedSteps['android-2']
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-neutral-600 bg-neutral-800 text-transparent hover:border-neutral-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className="font-semibold text-xs">
                      2. Enable "PolyType Translator Keyboard"
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Tap <strong>Manage on-screen keyboards</strong> and toggle{' '}
                      <span className="text-blue-400 font-medium">PolyType Keyboard</span> to{' '}
                      <strong>ON</strong>. Tap "OK" to allow input access.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step A3 */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  completedSteps['android-3']
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isDark
                    ? 'bg-neutral-800/40 border-neutral-700/60'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleStep('android-3')}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 transition-colors ${
                      completedSteps['android-3']
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-neutral-600 bg-neutral-800 text-transparent hover:border-neutral-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className="font-semibold text-xs">
                      3. Select as Default Input Method
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Tap <strong>Default keyboard</strong> and pick <strong>PolyType Keyboard</strong>.
                      Whenever you tap in WhatsApp, Gmail, or Slack, PolyType will pop up and translate in real time!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* iOS Steps */}
          {activeTab === 'ios' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>iPhone & iPad Activation Guide</span>
                <span className="text-[10px] lowercase text-neutral-500">iOS 14 to 18+</span>
              </div>

              {/* Step i1 */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  completedSteps['ios-1']
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isDark
                    ? 'bg-neutral-800/40 border-neutral-700/60'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleStep('ios-1')}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 transition-colors ${
                      completedSteps['ios-1']
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-neutral-600 bg-neutral-800 text-transparent hover:border-neutral-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className="font-semibold text-xs">
                      1. Add to Home Screen in Safari
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Tap the <Share2 className="w-3 h-3 inline text-blue-400 mx-0.5" /> <strong>Share</strong> button at the bottom of Safari, scroll down and select{' '}
                      <strong>"Add to Home Screen"</strong>. This registers the keyboard as an on-device web app.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step i2 */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  completedSteps['ios-2']
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isDark
                    ? 'bg-neutral-800/40 border-neutral-700/60'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleStep('ios-2')}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 transition-colors ${
                      completedSteps['ios-2']
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-neutral-600 bg-neutral-800 text-transparent hover:border-neutral-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className="font-semibold text-xs">
                      2. Add Keyboard in iOS Settings
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Go to <strong>Settings</strong> ➔ <strong>General</strong> ➔ <strong>Keyboard</strong> ➔ <strong>Keyboards</strong> ➔ <strong>Add New Keyboard...</strong> ➔ Select <strong>PolyType Keyboard</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step i3 */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  completedSteps['ios-3']
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isDark
                    ? 'bg-neutral-800/40 border-neutral-700/60'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleStep('ios-3')}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 transition-colors ${
                      completedSteps['ios-3']
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-neutral-600 bg-neutral-800 text-transparent hover:border-neutral-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className="font-semibold text-xs">
                      3. Enable "Allow Full Access" & Switch
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Tap <strong>PolyType Keyboard</strong> in the list and toggle on{' '}
                      <strong>"Allow Full Access"</strong> so the neural translation engine can work. Then in any app (iMessage, Notes), tap & hold the{' '}
                      <strong>🌐 Globe</strong> key to switch to PolyType.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop & Popout Tab */}
          {activeTab === 'desktop' && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Desktop & Floating Keyboard Mode
              </div>

              {/* Popout Window */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  isDark ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-xs">Floating Companion Window</div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Open PolyType Keyboard in a dedicated, compact popout window. Snap it side-by-side with Word, WhatsApp Web, Discord, or email clients!
                    </p>
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={handleOpenFloatingWindow}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Launch Floating Keyboard Window</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shortcut info */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  isDark ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs">Hardware Keyboard Passthrough</div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      You can type directly using your physical computer keyboard! Every keypress is captured and translated dynamically on the fly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Default Status Confirmation */}
          <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-700/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDefaultActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs">
                  {isDefaultActive ? 'Default Keyboard: Active' : 'Confirm Setup Completed'}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {isDefaultActive
                    ? 'Configured as primary input method on this device'
                    : 'Mark as your active default keyboard'}
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-toggle-default-active"
              onClick={() => onToggleDefaultActive(!isDefaultActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                isDefaultActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              }`}
            >
              {isDefaultActive ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Enabled</span>
                </>
              ) : (
                <span>Set as Active</span>
              )}
            </button>
          </div>

          {/* Test Keyboard Sandbox */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Test Default Keyboard Below:
            </label>
            <input
              type="text"
              id="input-test-default-keyboard"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Tap here to test typing with your default keyboard..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-800/80 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-700/40 flex items-center justify-between shrink-0 bg-neutral-950/30">
          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>100% Neural Translation Engine Ready</span>
          </div>

          <button
            type="button"
            id="btn-done-set-default-modal"
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Done</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
