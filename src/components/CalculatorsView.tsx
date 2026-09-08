import React, { useState } from "react";
import { LanguageCode } from "../types";
import { Calculator, TrendingUp, Sparkles, DollarSign, Layers } from "lucide-react";

interface CalculatorsViewProps {
  currentLang: LanguageCode;
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ currentLang }) => {
  const [calcTab, setCalcTab] = useState<"YIELD" | "FERTILIZER">("YIELD");

  // Yield Inputs
  const [crop, setCrop] = useState("Wheat");
  const [areaAcres, setAreaAcres] = useState(3);
  const [seedVariety, setSeedVariety] = useState("Certified Hybrid");
  const [irrigationSource, setIrrigationSource] = useState("Canal + Borewell Drip");

  // Crop Yield benchmarks (Quintals per acre & avg price)
  const cropDataMap: Record<string, { qtlPerAcre: number; pricePerQtl: number; costPerAcre: number }> = {
    Wheat: { qtlPerAcre: 22, pricePerQtl: 2275, costPerAcre: 18500 },
    "Paddy Rice": { qtlPerAcre: 26, pricePerQtl: 2180, costPerAcre: 21000 },
    "Bt Cotton": { qtlPerAcre: 12, pricePerQtl: 7100, costPerAcre: 28000 },
    Sugarcane: { qtlPerAcre: 340, pricePerQtl: 350, costPerAcre: 45000 },
    Mustard: { qtlPerAcre: 10, pricePerQtl: 5400, costPerAcre: 14000 },
    Potato: { qtlPerAcre: 120, pricePerQtl: 1450, costPerAcre: 35000 },
    Tomato: { qtlPerAcre: 180, pricePerQtl: 1850, costPerAcre: 42000 }
  };

  const selectedCropStats = cropDataMap[crop] || cropDataMap["Wheat"];

  const seedMultiplier = seedVariety === "Certified Hybrid" ? 1.15 : 1.0;
  const irrigationMultiplier = irrigationSource.includes("Drip") ? 1.1 : 0.95;

  const totalYieldQuintals = Math.round(selectedCropStats.qtlPerAcre * areaAcres * seedMultiplier * irrigationMultiplier);
  const grossRevenueINR = totalYieldQuintals * selectedCropStats.pricePerQtl;
  const totalCostINR = selectedCropStats.costPerAcre * areaAcres;
  const netProfitINR = grossRevenueINR - totalCostINR;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Switcher */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-lg sm:text-xl">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>Agricultural Yield & Fertilizer Dosage Calculators</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Input field dimensions and inputs to forecast yield, gross revenue, and exact bag quantities.
            </p>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setCalcTab("YIELD")}
              className={`px-3 py-2 rounded-lg transition-all ${
                calcTab === "YIELD"
                  ? "bg-indigo-800 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Yield & Revenue Estimator
            </button>
            <button
              onClick={() => setCalcTab("FERTILIZER")}
              className={`px-3 py-2 rounded-lg transition-all ${
                calcTab === "FERTILIZER"
                  ? "bg-indigo-800 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Fertilizer Bag Dosage
            </button>
          </div>
        </div>
      </div>

      {/* Yield Estimator View */}
      {calcTab === "YIELD" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Controls */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-stone-900 text-sm border-b border-stone-100 pb-2">
              1. Input Farm Parameters
            </h3>

            {/* Select Crop */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Select Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold"
              >
                {Object.keys(cropDataMap).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Land Area */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Land Area (Acres): <strong className="text-indigo-900">{areaAcres} Acres</strong> (~{(areaAcres * 2.47).toFixed(1)} Bigha)
              </label>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={areaAcres}
                onChange={(e) => setAreaAcres(Number(e.target.value))}
                className="w-full accent-indigo-700 cursor-pointer"
              />
            </div>

            {/* Seed Quality */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Seed Variety Grade</label>
              <select
                value={seedVariety}
                onChange={(e) => setSeedVariety(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold"
              >
                <option value="Certified Hybrid">Certified High-Yield Hybrid (+15% Yield)</option>
                <option value="Farm Saved Seed">Traditional Farm Saved Seed</option>
              </select>
            </div>

            {/* Irrigation Source */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Irrigation System</label>
              <select
                value={irrigationSource}
                onChange={(e) => setIrrigationSource(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold"
              >
                <option value="Canal + Borewell Drip">Micro-Drip + Canal System (+10% Efficiency)</option>
                <option value="Flood Rainfed">Traditional Flood / Rainfed</option>
              </select>
            </div>
          </div>

          {/* Results Output Card */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                Calculated Harvest Forecast
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {totalYieldQuintals.toLocaleString()} Quintals
              </h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Targeting MSP/Mandi rate of ₹{selectedCropStats.pricePerQtl}/quintal
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-200 block">Est. Gross Revenue</span>
                <span className="text-lg font-black text-emerald-400">₹{grossRevenueINR.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-200 block">Cultivation Cost</span>
                <span className="text-lg font-black text-rose-300">₹{totalCostINR.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-emerald-500 text-emerald-950 rounded-xl p-4 font-black flex items-center justify-between">
              <div>
                <span className="text-xs uppercase text-emerald-900 font-extrabold block">Net Estimated Profit</span>
                <span className="text-2xl font-black">₹{netProfitINR.toLocaleString()}</span>
              </div>
              <Sparkles className="w-8 h-8 text-emerald-900 fill-emerald-900" />
            </div>
          </div>
        </div>
      ) : (
        /* Fertilizer Dosage Bag Calculator */
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
          <h3 className="font-extrabold text-stone-900 text-sm">
            Bag Calculator for {areaAcres} Acres of {crop}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Neem Coated Urea</span>
              <span className="text-3xl font-black text-emerald-950 block mt-2">{Math.ceil(areaAcres * 2)}</span>
              <span className="text-xs text-emerald-700 font-medium">Bags (50kg)</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <span className="text-xs font-bold text-amber-800 uppercase block">DAP (18-46-0)</span>
              <span className="text-3xl font-black text-amber-950 block mt-2">{Math.ceil(areaAcres * 1.2)}</span>
              <span className="text-xs text-amber-700 font-medium">Bags (50kg)</span>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
              <span className="text-xs font-bold text-blue-800 uppercase block">MOP (Muriate of Potash)</span>
              <span className="text-3xl font-black text-blue-950 block mt-2">{Math.ceil(areaAcres * 0.8)}</span>
              <span className="text-xs text-blue-700 font-medium">Bags (50kg)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
