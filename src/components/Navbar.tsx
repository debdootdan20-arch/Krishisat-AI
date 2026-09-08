import React from "react";
import { LanguageCode } from "../types";
import { LANGUAGES, TRANSLATIONS } from "../data/translations";
import {
  Satellite,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Zap,
  Code2,
  Globe,
  RefreshCw,
  Sparkles
} from "lucide-react";

interface NavbarProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  isDataSaver: boolean;
  onToggleDataSaver: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  unsyncedCount: number;
  onOpenArchDocs: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  isOnline,
  onToggleOnline,
  isDataSaver,
  onToggleDataSaver,
  isVoiceActive,
  onToggleVoice,
  unsyncedCount,
  onOpenArchDocs,
  onTriggerSync,
  isSyncing
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Satellite Status */}
        <div className="flex items-center gap-3">
          <div className="relative p-2 bg-emerald-800/80 rounded-xl border border-emerald-600/40 flex items-center justify-center">
            <Satellite className="w-6 h-6 text-emerald-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-50 font-sans">
                {t.appTitle}
              </h1>
              <span className="hidden xs:inline-block bg-emerald-700 text-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-600">
                ISRO/NASA Sat v3.2
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 hidden sm:block">
              {t.subTitle}
            </p>
          </div>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Online / Offline Sync Switcher */}
          <button
            onClick={onToggleOnline}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isOnline
                ? "bg-emerald-800/90 text-emerald-200 border-emerald-600 hover:bg-emerald-700"
                : "bg-amber-900/90 text-amber-200 border-amber-600 hover:bg-amber-800 animate-pulse"
            }`}
            title="Click to toggle Network Mode simulation"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">{t.online}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.offlineMode}</span>
              </>
            )}
          </button>

          {/* Offline Pending Items Sync Badge */}
          {unsyncedCount > 0 && (
            <button
              onClick={onTriggerSync}
              disabled={isSyncing || !isOnline}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-amber-950 hover:bg-amber-400 border border-amber-300 transition-all ${
                isSyncing ? "opacity-70 cursor-not-allowed" : ""
              }`}
              title="Click to sync offline queued posts and soil logs with server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>
                {isSyncing ? "Syncing..." : `Sync (${unsyncedCount})`}
              </span>
            </button>
          )}

          {/* Low Bandwidth / Data Saver Mode */}
          <button
            onClick={onToggleDataSaver}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isDataSaver
                ? "bg-emerald-700 text-emerald-100 border-emerald-400"
                : "bg-emerald-900/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-800"
            }`}
            title="Enable Data Saver for slow 2G/3G networks"
          >
            <Zap className={`w-3.5 h-3.5 ${isDataSaver ? "text-amber-300 fill-amber-300" : ""}`} />
            <span className="hidden sm:inline">{t.dataSaver}</span>
          </button>

          {/* Voice Narrator Assistant Toggle */}
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isVoiceActive
                ? "bg-emerald-700 text-emerald-100 border-emerald-400"
                : "bg-emerald-900/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-800"
            }`}
            title="Voice Reader assistance for low-literacy farmers"
          >
            {isVoiceActive ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden lg:inline">{t.voiceAssistant}</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2 text-emerald-300 pointer-events-none" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-emerald-800 text-emerald-50 text-xs pl-7 pr-2 py-1.5 rounded-lg border border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-emerald-900 text-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Technical Architecture Docs Drawer Trigger */}
          <button
            onClick={onOpenArchDocs}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-200 border border-emerald-700 hover:bg-emerald-850 hover:text-white transition-all"
            title="Flutter/Riverpod & Clean Architecture Specifications"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Arch Specs</span>
          </button>
        </div>
      </div>

      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div className="bg-amber-600 text-amber-950 text-xs px-4 py-1 font-medium flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-3.5 h-3.5 shrink-0 text-amber-950" />
            <span>
              <strong>Rural Offline Mode:</strong> You are viewing cached satellite imagery & local calculations. New field reports will queue and sync when signal returns.
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
