import React, { useState, useEffect } from "react";
import { LanguageCode, OfflineQueueItem } from "./types";
import { Navbar } from "./components/Navbar";
import { NavigationTabs, TabType } from "./components/NavigationTabs";
import { SatelliteScanView } from "./components/SatelliteScanView";
import { SoilFertilizerView } from "./components/SoilFertilizerView";
import { WeatherIrrigationView } from "./components/WeatherIrrigationView";
import { PestForecastView } from "./components/PestForecastView";
import { CalculatorsView } from "./components/CalculatorsView";
import { MandiTrackerView } from "./components/MandiTrackerView";
import { CommunityForumView } from "./components/CommunityForumView";
import { OfflineSyncArchitectureView } from "./components/OfflineSyncArchitectureView";
import { ArchSpecsModal } from "./components/ArchSpecsModal";

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("hi");
  const [activeTab, setActiveTab] = useState<TabType>("satellite");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isDataSaver, setIsDataSaver] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [unsyncedQueue, setUnsyncedQueue] = useState<OfflineQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);

  // Sync queue handler
  const handleAddUnsyncedItem = (item: OfflineQueueItem) => {
    setUnsyncedQueue((prev) => [item, ...prev]);
  };

  const handleClearQueue = () => {
    setUnsyncedQueue([]);
  };

  const handleTriggerSync = async () => {
    if (unsyncedQueue.length === 0 || !isOnline) return;
    setIsSyncing(true);

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queue: unsyncedQueue })
      });
      const data = await res.json();
      if (data.success) {
        setUnsyncedQueue([]);
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className={`min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 ${
      isDataSaver ? "data-saver-mode" : ""
    }`}>
      {/* Top Header Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        isDataSaver={isDataSaver}
        onToggleDataSaver={() => setIsDataSaver(!isDataSaver)}
        isVoiceActive={isVoiceActive}
        onToggleVoice={() => setIsVoiceActive(!isVoiceActive)}
        unsyncedCount={unsyncedQueue.length}
        onOpenArchDocs={() => setIsArchModalOpen(true)}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
      />

      {/* Navigation Bar for Literacy Levels */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentLang={currentLang}
        unsyncedCount={unsyncedQueue.length}
        highPestCount={2}
      />

      {/* Main Responsive Body Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-20">
        {activeTab === "satellite" && (
          <SatelliteScanView
            currentLang={currentLang}
            isOnline={isOnline}
            isDataSaver={isDataSaver}
            isVoiceActive={isVoiceActive}
          />
        )}

        {activeTab === "soil" && (
          <SoilFertilizerView currentLang={currentLang} />
        )}

        {activeTab === "weather" && (
          <WeatherIrrigationView
            currentLang={currentLang}
            isVoiceActive={isVoiceActive}
          />
        )}

        {activeTab === "pest" && (
          <PestForecastView
            currentLang={currentLang}
            isVoiceActive={isVoiceActive}
          />
        )}

        {activeTab === "calc" && (
          <CalculatorsView currentLang={currentLang} />
        )}

        {activeTab === "mandi" && (
          <MandiTrackerView currentLang={currentLang} />
        )}

        {activeTab === "forum" && (
          <CommunityForumView
            currentLang={currentLang}
            isOnline={isOnline}
            onAddUnsyncedItem={handleAddUnsyncedItem}
          />
        )}

        {activeTab === "sync" && (
          <OfflineSyncArchitectureView
            currentLang={currentLang}
            isOnline={isOnline}
            unsyncedQueue={unsyncedQueue}
            onClearQueue={handleClearQueue}
            onTriggerSync={handleTriggerSync}
            isSyncing={isSyncing}
          />
        )}
      </main>

      {/* Architecture Specs Modal */}
      <ArchSpecsModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Bottom Mobile Floating Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-3 sm:hidden shadow-lg flex justify-around text-[10px] font-bold text-stone-600">
        <button
          onClick={() => setActiveTab("satellite")}
          className={`flex flex-col items-center gap-0.5 ${activeTab === "satellite" ? "text-emerald-800 font-extrabold" : ""}`}
        >
          <span className="text-base">🛰️</span>
          <span>Satellite</span>
        </button>
        <button
          onClick={() => setActiveTab("soil")}
          className={`flex flex-col items-center gap-0.5 ${activeTab === "soil" ? "text-amber-800 font-extrabold" : ""}`}
        >
          <span className="text-base">🧪</span>
          <span>Soil</span>
        </button>
        <button
          onClick={() => setActiveTab("weather")}
          className={`flex flex-col items-center gap-0.5 ${activeTab === "weather" ? "text-blue-800 font-extrabold" : ""}`}
        >
          <span className="text-base">🌧️</span>
          <span>Weather</span>
        </button>
        <button
          onClick={() => setActiveTab("mandi")}
          className={`flex flex-col items-center gap-0.5 ${activeTab === "mandi" ? "text-green-800 font-extrabold" : ""}`}
        >
          <span className="text-base">📈</span>
          <span>Mandi</span>
        </button>
        <button
          onClick={() => setActiveTab("forum")}
          className={`flex flex-col items-center gap-0.5 ${activeTab === "forum" ? "text-teal-800 font-extrabold" : ""}`}
        >
          <span className="text-base">👥</span>
          <span>Forum</span>
        </button>
      </div>
    </div>
  );
}
