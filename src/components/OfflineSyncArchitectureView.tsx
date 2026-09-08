import React, { useState } from "react";
import { LanguageCode, OfflineQueueItem } from "../types";
import { Database, RefreshCw, CheckCircle2, Code2, Zap, Layers, GitBranch, Cpu, ShieldCheck } from "lucide-react";

interface OfflineSyncArchitectureViewProps {
  currentLang: LanguageCode;
  isOnline: boolean;
  unsyncedQueue: OfflineQueueItem[];
  onClearQueue: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const OfflineSyncArchitectureView: React.FC<OfflineSyncArchitectureViewProps> = ({
  currentLang,
  isOnline,
  unsyncedQueue,
  onClearQueue,
  onTriggerSync,
  isSyncing
}) => {
  const [activeTab, setActiveTab] = useState<"SYNC_ENGINE" | "FLUTTER_ARCH" | "CICD_PIPELINE">("SYNC_ENGINE");

  const cicdWorkflowYaml = `# GitHub Actions CI/CD Pipeline for KrishiSat AI Platform
name: KrishiSat AI CI/CD Pipeline

on:
  push:
    branches: [ main, release/* ]
  pull_request:
    branches: [ main ]

jobs:
  validate-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install Dependencies
        run: npm ci
      - name: Code Type Check
        run: npm run lint

  build-container:
    needs: validate-and-lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Web Container Artifact
        run: |
          npm run build
          docker build -t krishisat-ai:latest .

  deploy-cloud-run:
    needs: build-container
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Cloud Run Container Instance
        run: echo "Deployed KrishiSat AI to Cloud Run production service"
`;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-purple-900 font-bold text-lg sm:text-xl">
              <Database className="w-5 h-5 text-purple-600" />
              <span>Offline Database Sync Engine & Technical Architecture Docs</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Local persistent queue, Flutter + Riverpod repository pattern blueprints, and automated CI/CD pipeline.
            </p>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab("SYNC_ENGINE")}
              className={`px-3 py-2 rounded-lg transition-all ${
                activeTab === "SYNC_ENGINE" ? "bg-purple-800 text-white shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Sync Engine ({unsyncedQueue.length})
            </button>
            <button
              onClick={() => setActiveTab("FLUTTER_ARCH")}
              className={`px-3 py-2 rounded-lg transition-all ${
                activeTab === "FLUTTER_ARCH" ? "bg-purple-800 text-white shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Flutter & Clean Arch
            </button>
            <button
              onClick={() => setActiveTab("CICD_PIPELINE")}
              className={`px-3 py-2 rounded-lg transition-all ${
                activeTab === "CICD_PIPELINE" ? "bg-purple-800 text-white shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              CI/CD Pipeline YAML
            </button>
          </div>
        </div>
      </div>

      {/* Sync Engine Inspector Tab */}
      {activeTab === "SYNC_ENGINE" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-stone-900 text-base">Local Persistent Queue Engine</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                {unsyncedQueue.length === 0
                  ? "All local farmer records, soil logs, and posts are synchronized with cloud server."
                  : `${unsyncedQueue.length} record(s) currently waiting for network connectivity to sync.`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {unsyncedQueue.length > 0 && (
                <button
                  onClick={onClearQueue}
                  className="px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200"
                >
                  Clear Queue
                </button>
              )}
              <button
                onClick={onTriggerSync}
                disabled={isSyncing || !isOnline || unsyncedQueue.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-xl text-xs font-bold hover:bg-purple-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync Cloud Database"}</span>
              </button>
            </div>
          </div>

          {/* Queue Items List */}
          {unsyncedQueue.length > 0 && (
            <div className="space-y-2">
              {unsyncedQueue.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-stone-900">{item.type}</span>
                    <span className="text-stone-400 mx-2">•</span>
                    <span className="text-stone-600">{item.data?.title || item.data?.cropName || "Local Farmer Activity"}</span>
                  </div>
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    Pending Sync
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Flutter & Riverpod Clean Architecture Specification */}
      {activeTab === "FLUTTER_ARCH" && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-black text-stone-900 text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-600" />
              <span>Flutter Cross-Platform Architecture & State Management (Riverpod + Drift)</span>
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Architecture blueprint addresses cross-platform deployment, offline database synchronization using Drift/Hive, state management with Riverpod, and repository isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-800">
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 space-y-2">
              <span className="font-extrabold text-purple-900 uppercase text-[11px] block">
                Why Flutter & Drift for Offline Sync?
              </span>
              <p className="leading-relaxed">
                <strong>Drift (built on SQLite)</strong> or <strong>Hive (key-value store)</strong> provides compiled C-speed local database transactions. When offline in remote agricultural belts, queries execute directly against the local Drift cache with zero UI latency.
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2">
              <span className="font-extrabold text-emerald-900 uppercase text-[11px] block">
                Riverpod State Management
              </span>
              <p className="leading-relaxed">
                Riverpod provides immutable, compile-time safe state providers (e.g. <code>satelliteScanProvider</code>, <code>weatherScheduleNotifier</code>). It decouples business logic from Flutter widget lifecycle.
              </p>
            </div>
          </div>

          {/* Directory Pattern Diagram */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 font-mono text-xs overflow-x-auto">
            <span className="text-emerald-400 font-bold block mb-2">// Clean Architecture Modular Directory Tree</span>
            <pre className="leading-relaxed">
{`lib/
├── core/
│   ├── network/ (Dio client, ConnectivityInterceptor, OfflineSyncEngine)
│   ├── database/ (DriftDatabase, HiveStorage, SchemaMigrations)
│   └── theme/ (RuralHighContrastTheme, Typography)
├── features/
│   ├── satellite_scan/
│   │   ├── data/ (SatelliteRepositoryImpl, GeminiRemoteDataSource, LocalDriftDao)
│   │   ├── domain/ (CropDiseaseEntity, AnalyzeSatelliteUseCase)
│   │   └── presentation/ (SatelliteScanScreen, RiverpodProviders)
│   ├── weather_irrigation/
│   ├── mandi_prices/
│   └── community_forum/
└── main.dart`}
            </pre>
          </div>
        </div>
      )}

      {/* CI/CD Pipeline Tab */}
      {activeTab === "CICD_PIPELINE" && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-600" />
            <span>Automated GitHub Actions CI/CD Pipeline (.github/workflows/ci-cd.yml)</span>
          </h3>

          <div className="bg-stone-950 text-emerald-300 rounded-2xl p-4 font-mono text-xs overflow-x-auto">
            <pre>{cicdWorkflowYaml}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
