import React, { useState, useEffect } from "react";
import { LanguageCode, PestForecast } from "../types";
import { Bug, AlertTriangle, ShieldCheck, Volume2, MapPin, Thermometer } from "lucide-react";

interface PestForecastViewProps {
  currentLang: LanguageCode;
  isVoiceActive: boolean;
}

export const PestForecastView: React.FC<PestForecastViewProps> = ({ currentLang, isVoiceActive }) => {
  const [pests, setPests] = useState<PestForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pest-forecast")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPests(data.data);
      })
      .catch((err) => console.error("Pest fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const playPestVoice = (alertHi: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(alertHi);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-900 font-bold text-lg sm:text-xl">
              <Bug className="w-5 h-5 text-rose-600" />
              <span>Upcoming Pest Infestation & Disease Risk Forecast</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Micro-climate risk modeling predicting insect emergence before visible crop loss occurs.
            </p>
          </div>
        </div>
      </div>

      {/* Pest Cards Grid */}
      {loading ? (
        <div className="p-8 text-center text-stone-500">Loading pest risk telemetry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pests.map((pest) => (
            <div
              key={pest.id}
              className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between space-y-4 ${
                pest.riskLevel === "HIGH"
                  ? "border-rose-300 ring-1 ring-rose-200"
                  : "border-amber-200"
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      pest.riskLevel === "HIGH"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {pest.riskLevel} RISK ({pest.riskScore}/100)
                  </span>
                  <span className="text-xs font-bold text-stone-500">{pest.cropTarget}</span>
                </div>

                {/* Pest Title */}
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">{pest.pestName}</h3>
                  <div className="flex items-center gap-1 text-xs text-stone-600 mt-1">
                    <Thermometer className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{pest.favorableConditions}</span>
                  </div>
                </div>

                {/* Local Dialect Alert Quote */}
                <div className="bg-rose-50/80 rounded-xl p-3 border border-rose-200 text-xs font-semibold text-rose-950">
                  <p>"{pest.dialectAlertHi}"</p>
                  <button
                    onClick={() => playPestVoice(pest.dialectAlertHi)}
                    className="mt-2 flex items-center gap-1 text-[11px] font-bold text-rose-800 hover:text-rose-950"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Audio Alert</span>
                  </button>
                </div>

                {/* Regions */}
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                    Affected Belts
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pest.affectedRegions.map((reg, i) => (
                      <span key={i} className="text-[10px] font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded-md border border-stone-200">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preventive Action */}
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Actionable Prevention
                  </span>
                  <p className="leading-relaxed font-medium">{pest.preventiveAction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
