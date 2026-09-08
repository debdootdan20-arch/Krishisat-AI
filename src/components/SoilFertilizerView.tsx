import React, { useState } from "react";
import { LanguageCode, SoilMetrics } from "../types";
import { FlaskConical, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, ShieldAlert, Leaf } from "lucide-react";

interface SoilFertilizerViewProps {
  currentLang: LanguageCode;
}

export const SoilFertilizerView: React.FC<SoilFertilizerViewProps> = ({ currentLang }) => {
  const [soil, setSoil] = useState<SoilMetrics>({
    nitrogenKgHa: 210,
    phosphorusKgHa: 18,
    potassiumKgHa: 240,
    pH: 6.8,
    moisturePct: 38,
    organicCarbonPct: 0.52
  });

  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [targetLandAcres, setTargetLandAcres] = useState(2);

  // Calculations for fertilizer bags
  // Standard NPK requirements for 1 acre wheat: 50kg N, 25kg P, 20kg K
  const calculateFertilizers = () => {
    const nitrogenDeficit = Math.max(0, 280 - soil.nitrogenKgHa);
    const ureaBags = Math.ceil((nitrogenDeficit * 0.15 * targetLandAcres) / 50) || 1;
    const dapBags = soil.phosphorusKgHa < 20 ? Math.ceil((1.2 * targetLandAcres)) : 1;
    const mopBags = soil.potassiumKgHa < 200 ? Math.ceil((0.8 * targetLandAcres)) : 1;

    return { ureaBags, dapBags, mopBags };
  };

  const dosage = calculateFertilizers();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-bold text-lg sm:text-xl">
              <FlaskConical className="w-5 h-5 text-amber-600" />
              <span>Soil Health & Fertilization Dosage Optimizer</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Precision soil nutrient balancing (NPK + pH + Micronutrients) based on soil test or satellite spectral estimates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm rounded-xl px-3 py-2"
            >
              <option value="Wheat">Target Crop: Wheat</option>
              <option value="Paddy">Target Crop: Paddy Rice</option>
              <option value="Cotton">Target Crop: Bt Cotton</option>
              <option value="Sugarcane">Target Crop: Sugarcane</option>
              <option value="Mustard">Target Crop: Mustard</option>
            </select>
            <div className="flex items-center gap-1 bg-amber-100 px-3 py-2 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-900">Land:</span>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={targetLandAcres}
                onChange={(e) => setTargetLandAcres(Number(e.target.value))}
                className="w-12 bg-white text-xs font-black text-center rounded border border-amber-300 py-0.5"
              />
              <span className="text-xs font-bold text-amber-900">Acre</span>
            </div>
          </div>
        </div>

        {/* Soil Test Input Dials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* Nitrogen N */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-extrabold text-stone-700 uppercase">Nitrogen (N)</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${soil.nitrogenKgHa < 240 ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"}`}>
                {soil.nitrogenKgHa < 240 ? "Low Deficit" : "Optimal"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-900">{soil.nitrogenKgHa}</span>
              <span className="text-xs font-semibold text-stone-500">kg/ha</span>
            </div>
            <input
              type="range"
              min="100"
              max="500"
              value={soil.nitrogenKgHa}
              onChange={(e) => setSoil({ ...soil, nitrogenKgHa: Number(e.target.value) })}
              className="w-full mt-3 accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Phosphorus P */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-extrabold text-stone-700 uppercase">Phosphorus (P)</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${soil.phosphorusKgHa < 15 ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"}`}>
                {soil.phosphorusKgHa < 15 ? "Low Deficit" : "Optimal"}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-900">{soil.phosphorusKgHa}</span>
              <span className="text-xs font-semibold text-stone-500">kg/ha</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={soil.phosphorusKgHa}
              onChange={(e) => setSoil({ ...soil, phosphorusKgHa: Number(e.target.value) })}
              className="w-full mt-3 accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Potassium K */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-extrabold text-stone-700 uppercase">Potassium (K)</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Optimal
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-900">{soil.potassiumKgHa}</span>
              <span className="text-xs font-semibold text-stone-500">kg/ha</span>
            </div>
            <input
              type="range"
              min="100"
              max="450"
              value={soil.potassiumKgHa}
              onChange={(e) => setSoil({ ...soil, potassiumKgHa: Number(e.target.value) })}
              className="w-full mt-3 accent-emerald-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Recommended Fertilizer Dosage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Urea Bag Dosage */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100/50 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
            Nitrogen Source
          </span>
          <h3 className="text-lg font-black text-stone-900 mt-1">Neem Coated Urea</h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-900">{dosage.ureaBags}</span>
            <span className="text-sm font-bold text-stone-600">Bags (50kg each)</span>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            Apply in 2 split doses: 50% at sowing & 50% during crown root initiation (21 days).
          </p>
        </div>

        {/* DAP Bag Dosage */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100/50 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
            Phosphorus Source
          </span>
          <h3 className="text-lg font-black text-stone-900 mt-1">DAP (18-46-0)</h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-950">{dosage.dapBags}</span>
            <span className="text-sm font-bold text-stone-600">Bags (50kg each)</span>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            Basal soil application before sowing to enhance seedling root establishment.
          </p>
        </div>

        {/* MOP Dosage */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100/50 rounded-bl-full pointer-events-none"></div>
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
            Potassium Source
          </span>
          <h3 className="text-lg font-black text-stone-900 mt-1">MOP (Muriate of Potash)</h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-900">{dosage.mopBags}</span>
            <span className="text-sm font-bold text-stone-600">Bags (50kg each)</span>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            Improves drought tolerance, grain weight, and straw vigor.
          </p>
        </div>
      </div>

      {/* Bio-Fertilizer & Organic Soil Health Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm uppercase">
          <Leaf className="w-4 h-4" />
          <span>Organic Bio-Fertilizer Recommendation</span>
        </div>
        <h3 className="text-xl font-extrabold mt-1">
          Azotobacter + PSB (Phosphate Solubilizing Bacteria) Seed Coating
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-2xl">
          Mix 200g Azotobacter and 200g PSB culture in 1 Liter jaggery (Gud) solution for 10kg seed treatment before sowing. Saves up to 20% chemical Urea costs while enhancing beneficial soil microbiota.
        </p>
      </div>
    </div>
  );
};
