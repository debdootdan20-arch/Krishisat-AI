import React, { useState, useEffect } from "react";
import { LanguageCode, MandiPrice } from "../types";
import { TrendingUp, Search, Filter, ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles, Building2 } from "lucide-react";

interface MandiTrackerViewProps {
  currentLang: LanguageCode;
}

export const MandiTrackerView: React.FC<MandiTrackerViewProps> = ({ currentLang }) => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [searchCrop, setSearchCrop] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPrices();
  }, [selectedState, searchCrop]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      let url = `/api/mandi-prices?state=${encodeURIComponent(selectedState)}`;
      if (searchCrop) url += `&crop=${encodeURIComponent(searchCrop)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPrices(data.data);
      }
    } catch (err) {
      console.error("Mandi price fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statesList = ["All", "Punjab", "Haryana", "Gujarat", "Madhya Pradesh", "Maharashtra", "West Bengal", "Rajasthan"];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-green-900 font-bold text-lg sm:text-xl">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Live APMC Mandi Commodity Price Tracker</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Agmarknet real-time price feeds across major agricultural market committees in India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPrices}
              className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all"
              title="Refresh Live Prices"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search Crop (e.g. Wheat, Cotton)..."
              value={searchCrop}
              onChange={(e) => setSearchCrop(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
            {statesList.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedState === st
                    ? "bg-green-800 text-white border-green-900"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Market Selling Advice Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-950 text-white rounded-2xl p-5 shadow-md flex items-start gap-3">
        <Sparkles className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            KrishiSat AI Market Advisor
          </span>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1 leading-relaxed">
            "Khanna APMC Wheat is up +₹45/qtl to ₹2,275 today due to flour mill procurement demand. If moisture content is under 12%, selling today yields maximum margin compared to holding."
          </p>
        </div>
      </div>

      {/* Prices Grid */}
      {loading ? (
        <div className="p-8 text-center text-stone-500">Updating live Mandi price feeds...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prices.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs hover:border-green-500 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                    {p.state}
                  </span>
                  <span
                    className={`text-xs font-extrabold flex items-center gap-0.5 ${
                      p.change >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {p.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {p.change >= 0 ? `+₹${p.change}` : `-₹${Math.abs(p.change)}`}
                  </span>
                </div>

                <h3 className="font-black text-stone-900 text-base mt-2">{p.crop}</h3>
                <div className="flex items-center gap-1 text-xs text-stone-500 font-medium mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>{p.mandi}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-stone-500 uppercase block">Rate / Quintal</span>
                  <span className="text-xl font-black text-stone-900">₹{p.pricePerQuintal.toLocaleString()}</span>
                </div>
                <span className="text-[11px] font-bold text-stone-600 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200">
                  {p.qualityGrade}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
