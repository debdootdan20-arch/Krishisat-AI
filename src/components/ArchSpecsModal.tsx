import React from "react";
import { X, Code2, Cpu, Database, GitBranch, ShieldCheck, CheckCircle2 } from "lucide-react";

interface ArchSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchSpecsModal: React.FC<ArchSpecsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                KrishiSat AI Technical Architecture Specifications
              </h2>
              <p className="text-xs text-stone-500">
                Full-Stack Architecture & Mobile Cross-Platform Engineering Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framework Analysis: Flutter vs React Native */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>1. Cross-Platform Framework Recommendation: Flutter vs React Native</span>
          </h3>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-700 space-y-2">
            <p className="leading-relaxed font-medium">
              <strong>Recommendation: Flutter is superior for this offline-first rural agriculture system.</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li>
                <strong>Robust Offline DB Integration:</strong> Flutter pairs natively with compiled packages like <code>Drift</code> (strongly-typed SQLite ORM) and <code>Hive</code> (fast key-value store). These deliver instant local database operations without JS-bridge marshaling overhead.
              </li>
              <li>
                <strong>Predictable Canvas & Image Rendering:</strong> Satellite imagery, NDVI heatmaps, and low-bandwidth icon renders operate on Skia/Impeller graphics engine with consistent 60FPS UI across low-spec Android smartphones used in rural India.
              </li>
              <li>
                <strong>State Management with Riverpod:</strong> Riverpod decouples logic into immutable providers (e.g. <code>offlineSyncProvider</code>, <code>satelliteScanNotifier</code>), facilitating unit testing and repository patterns.
              </li>
            </ul>
          </div>
        </div>

        {/* Clean Architecture & Repository Pattern */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            <span>2. Clean Architecture & Repository Pattern Isolation</span>
          </h3>

          <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 text-xs text-purple-950 space-y-2 font-medium">
            <p>
              The system isolates network requests behind abstract repository contracts:
            </p>
            <div className="bg-white p-3 rounded-xl border border-purple-200 font-mono text-[11px] text-purple-900 leading-relaxed">
              <code>abstract class ISatelliteRepository &#123;</code><br />
              <code>&nbsp;&nbsp;Future&lt;Either&lt;Failure, CropDiseaseAnalysis&gt;&gt; analyzeCropImage(File image);</code><br />
              <code>&nbsp;&nbsp;Future&lt;List&lt;CropPlot&gt;&gt; getCachedPlotHistory();</code><br />
              <code>&#125;</code>
            </div>
            <p className="text-purple-800">
              If the device loses connectivity, <code>SatelliteRepositoryImpl</code> automatically falls back to <code>LocalDriftDao</code> without blowing up the presentation layer.
            </p>
          </div>
        </div>

        {/* Firebase Real-Time & Gemini Integration */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>3. Backend Architecture: Server-Side Gemini API + Firebase Sync</span>
          </h3>

          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 space-y-1 font-medium">
            <p>
              • All Gemini AI vision and text advisory models execute on the Express backend (<code>server.ts</code>) using <code>@google/genai</code> SDK with <code>gemini-3.6-flash</code>.
            </p>
            <p>
              • Firebase Firestore and Realtime Database provide automatic delta synchronization when rural devices reconnect to cellular networks.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-sm"
          >
            Close Architecture Specs
          </button>
        </div>
      </div>
    </div>
  );
};
