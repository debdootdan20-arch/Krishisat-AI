import React, { useState, useEffect } from "react";
import { LanguageCode } from "../types";
import {
  CloudRain,
  Sun,
  CloudSun,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Bell,
  Volume2
} from "lucide-react";

interface WeatherIrrigationViewProps {
  currentLang: LanguageCode;
  isVoiceActive: boolean;
}

export const WeatherIrrigationView: React.FC<WeatherIrrigationViewProps> = ({
  currentLang,
  isVoiceActive
}) => {
  const [location, setLocation] = useState("Ludhiana, Punjab");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const fetchWeather = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/weather-irrigation?location=${encodeURIComponent(location)}`);
      const data = await res.json();
      if (data.success) {
        setWeatherData(data.data);
      }
    } catch (e) {
      console.error("Weather fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const playWeatherAlertAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = "Critical Weather Alert: 75% chance of thunderstorm at 3 PM today. Do not irrigate wheat fields to prevent root lodging!";
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading || !weatherData) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-stone-600 space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold">Fetching micro-location satellite weather & irrigation telemetry...</p>
      </div>
    );
  }

  const rec = weatherData.irrigationRecommendation;

  return (
    <div className="space-y-6 pb-12">
      {/* Weather Dialect Push Alert Banner */}
      {!alertDismissed && (
        <div className="bg-rose-900 text-white rounded-2xl p-4 sm:p-5 border border-rose-700 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-800 rounded-xl shrink-0 mt-0.5">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-rose-800 text-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Critical Dialect Weather Alert
                </span>
                <span className="text-xs text-rose-300">Ludhiana Cluster</span>
              </div>
              <p className="text-sm font-bold text-rose-100 mt-1">
                "शाम 3 बजे 75% बारिश और तेज हवाओं की संभावना! गेहूं में पानी न दें, फसल गिर (lodging) सकती है।"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={playWeatherAlertAudio}
              className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-rose-100 text-xs font-bold rounded-xl border border-rose-600 flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Listen Dialect Alert</span>
            </button>
            <button
              onClick={() => setAlertDismissed(true)}
              className="text-xs text-rose-300 hover:text-white px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Header & Location Picker */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-lg sm:text-xl">
              <CloudRain className="w-5 h-5 text-blue-600" />
              <span>Real-time Weather & Precision Irrigation Schedule</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Evapotranspiration rate ({weatherData.evapotranspirationMmDay} mm/day) & soil moisture model.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">Cluster:</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-stone-50 border border-stone-300 font-bold text-xs sm:text-sm text-stone-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600"
            >
              <option value="Ludhiana, Punjab">Ludhiana, Punjab (Wheat/Paddy)</option>
              <option value="Karnal, Haryana">Karnal, Haryana (Basmati Rice)</option>
              <option value="Wardha, Maharashtra">Wardha, Maharashtra (Cotton)</option>
              <option value="Indore, Madhya Pradesh">Indore, MP (Soybean)</option>
              <option value="Burdwan, West Bengal">Burdwan, WB (Paddy)</option>
            </select>
          </div>
        </div>

        {/* Current Weather Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
            <span className="text-[11px] font-bold text-blue-700 uppercase">Temperature</span>
            <div className="text-2xl font-black text-blue-950 mt-1">{weatherData.temperature}°C</div>
            <span className="text-[11px] text-blue-700 font-medium">{weatherData.condition}</span>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Rain Chance</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{weatherData.rainfallChance}%</div>
            <span className="text-[11px] text-emerald-700 font-medium">18mm expected</span>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100">
            <span className="text-[11px] font-bold text-amber-800 uppercase">Soil Moisture</span>
            <div className="text-2xl font-black text-amber-950 mt-1">{weatherData.soilMoisturePct}%</div>
            <span className="text-[11px] text-amber-700 font-medium">Optimal root zone</span>
          </div>

          <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100">
            <span className="text-[11px] font-bold text-purple-800 uppercase">Wind Speed</span>
            <div className="text-2xl font-black text-purple-950 mt-1">{weatherData.windSpeedKm} km/h</div>
            <span className="text-[11px] text-purple-700 font-medium">NW Breeze</span>
          </div>
        </div>
      </div>

      {/* Smart Irrigation Action Decision Box */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-amber-950 rounded-2xl shrink-0 font-black text-lg">
              SKIP
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Smart Irrigation Decision
              </span>
              <h3 className="text-xl font-black text-white">{rec.headline}</h3>
            </div>
          </div>

          <div className="bg-blue-800/80 px-4 py-2 rounded-xl text-center border border-blue-700 shrink-0">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Water Saved</span>
            <span className="text-lg font-black text-amber-300">{rec.savedWaterLiters} Liters</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
          {rec.reason}
        </p>

        <div className="flex items-center gap-2 text-xs text-amber-200 font-bold bg-blue-950/60 p-3 rounded-xl border border-blue-800">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Next Scheduled Cycle: {rec.nextScheduledTime}</span>
        </div>
      </div>

      {/* Hourly Timeline */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
        <h4 className="font-bold text-stone-900 text-sm mb-3">Hourly Weather & Rain Probability</h4>
        <div className="grid grid-cols-5 gap-2">
          {weatherData.hourlyForecast.map((h: any, i: number) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-center ${
                h.rainChance > 50
                  ? "bg-blue-50 border-blue-300 text-blue-900"
                  : "bg-stone-50 border-stone-200 text-stone-700"
              }`}
            >
              <span className="text-xs font-bold block">{h.time}</span>
              <span className="text-lg font-black block mt-1">{h.temp}°C</span>
              <span className="text-[10px] font-bold text-blue-700 block mt-1">
                ☔ {h.rainChance}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
