import React from "react";
import { LanguageCode } from "../types";
import { TRANSLATIONS } from "../data/translations";
import {
  Satellite,
  FlaskConical,
  CloudRain,
  Bug,
  Calculator,
  TrendingUp,
  Users,
  Database
} from "lucide-react";

export type TabType =
  | "satellite"
  | "soil"
  | "weather"
  | "pest"
  | "calc"
  | "mandi"
  | "forum"
  | "sync";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentLang: LanguageCode;
  unsyncedCount: number;
  highPestCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  currentLang,
  unsyncedCount,
  highPestCount
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const tabs = [
    { id: "satellite" as TabType, label: t.tabSatellite, icon: Satellite, color: "text-emerald-600" },
    { id: "soil" as TabType, label: t.tabSoil, icon: FlaskConical, color: "text-amber-600" },
    { id: "weather" as TabType, label: t.tabWeather, icon: CloudRain, color: "text-blue-600" },
    { id: "pest" as TabType, label: t.tabPest, icon: Bug, color: "text-rose-600", badge: highPestCount > 0 ? highPestCount : null },
    { id: "calc" as TabType, label: t.tabCalc, icon: Calculator, color: "text-indigo-600" },
    { id: "mandi" as TabType, label: t.tabMandi, icon: TrendingUp, color: "text-green-600" },
    { id: "forum" as TabType, label: t.tabForum, icon: Users, color: "text-teal-600" },
    { id: "sync" as TabType, label: t.tabSync, icon: Database, color: "text-purple-600", badge: unsyncedCount > 0 ? unsyncedCount : null }
  ];

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-14 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between sm:justify-start gap-1 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 border ${
                  isActive
                    ? "bg-emerald-800 text-white border-emerald-900 shadow"
                    : "bg-stone-50 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 border-stone-200"
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-4 sm:h-4 ${isActive ? "text-emerald-200" : tab.color}`} />
                <span>{tab.label}</span>

                {tab.badge !== null && tab.badge !== undefined && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-amber-400 text-amber-950"
                        : "bg-rose-600 text-white"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
