import React, { useState } from "react";
import { CropPlot, DiseaseAnalysisResult, LanguageCode } from "../types";
import { MOCK_CROP_PLOTS } from "../data/mockData";
import {
  Satellite,
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Volume2,
  TrendingUp,
  Layers,
  MapPin,
  RefreshCw,
  Info
} from "lucide-react";

interface SatelliteScanViewProps {
  currentLang: LanguageCode;
  isOnline: boolean;
  isDataSaver: boolean;
  isVoiceActive: boolean;
}

export const SatelliteScanView: React.FC<SatelliteScanViewProps> = ({
  currentLang,
  isOnline,
  isDataSaver,
  isVoiceActive
}) => {
  const [selectedPlot, setSelectedPlot] = useState<CropPlot>(MOCK_CROP_PLOTS[0]);
  const [mapLayer, setMapLayer] = useState<"NDVI" | "MOISTURE" | "THERMAL" | "RGB">("NDVI");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResult | null>(null);
  const [speechText, setSpeechText] = useState<string | null>(null);

  // Sample leaf disease test images for quick one-click testing
  const sampleLeafImages = [
    {
      name: "Early Blight (Tomato/Potato)",
      url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Wheat Yellow Rust Leaf",
      url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Healthy Paddy Leaves",
      url: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/gemini/analyze-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          cropName: selectedPlot.currentCrop,
          landAreaAcres: selectedPlot.areaAcres,
          stateRegion: selectedPlot.locationState,
          soilType: "Alluvial Soil"
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        const narration = `Disease Analysis complete: ${data.analysis.diseaseDetected}. Severity is ${data.analysis.severity}. Recommended chemical treatment: ${data.analysis.diseaseTreatment.chemicalRemedy}`;
        setSpeechText(narration);

        if (isVoiceActive && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(narration);
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error("Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playVoiceReadout = () => {
    if (speechText && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Plot Selector */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg sm:text-xl">
              <Satellite className="w-5 h-5 text-emerald-600" />
              <span>Satellite Plot Scanner & Crop Disease Detector</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Multi-spectral NDVI satellite telemetry + Gemini AI vision disease diagnosis for Indian farms.
            </p>
          </div>

          {/* Plot Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <select
              value={selectedPlot.id}
              onChange={(e) => {
                const found = MOCK_CROP_PLOTS.find((p) => p.id === e.target.value);
                if (found) setSelectedPlot(found);
              }}
              className="bg-stone-50 border border-stone-300 text-stone-800 text-xs sm:text-sm rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {MOCK_CROP_PLOTS.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.plotName} ({plot.locationState}) - {plot.currentCrop}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Plot Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
              NDVI Veg. Index
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-emerald-900">
                {selectedPlot.ndviScore}
              </span>
              <span className="text-xs font-semibold text-emerald-600">/ 1.0</span>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${selectedPlot.ndviScore * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-blue-50/70 rounded-xl p-3 border border-blue-100">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide">
              Canopy Moisture
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-blue-900">
                {Math.round(selectedPlot.moistureScore * 100)}%
              </span>
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${selectedPlot.moistureScore * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-100">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
              Farm Area
            </span>
            <div className="text-xl font-black text-amber-950 mt-1">
              {selectedPlot.areaAcres} Acres
            </div>
            <span className="text-[11px] text-amber-700 font-medium">
              ~{(selectedPlot.areaAcres * 2.47).toFixed(1)} Bigha
            </span>
          </div>

          <div className="bg-purple-50/70 rounded-xl p-3 border border-purple-100">
            <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wide">
              Health Status
            </span>
            <div className="mt-1">
              <span
                className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedPlot.healthStatus === "EXCELLENT"
                    ? "bg-emerald-100 text-emerald-800"
                    : selectedPlot.healthStatus === "GOOD"
                    ? "bg-blue-100 text-blue-800"
                    : selectedPlot.healthStatus === "ATTENTION_NEEDED"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-rose-100 text-rose-800 animate-pulse"
                }`}
              >
                {selectedPlot.healthStatus.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Satellite Map Preview + Leaf Camera Scan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Interactive Satellite Multi-spectral View */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Satellite Spectral Imagery</span>
              </h3>
              {/* Layer Controls */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                {(["NDVI", "MOISTURE", "THERMAL", "RGB"] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setMapLayer(layer)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      mapLayer === layer
                        ? "bg-emerald-800 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Satellite Plot View Image Canvas */}
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-stone-300 bg-stone-950 group">
              <img
                src={selectedPlot.satelliteImageUrl}
                alt="Satellite Plot"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  mapLayer === "NDVI"
                    ? "hue-rotate-90 saturate-200 contrast-125"
                    : mapLayer === "MOISTURE"
                    ? "hue-rotate-180 contrast-150"
                    : mapLayer === "THERMAL"
                    ? "invert saturate-200"
                    : ""
                }`}
              />

              {/* Grid overlay for satellite tile simulation */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

              {/* Spectral Legend Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-stone-900/90 backdrop-blur-xs p-2 rounded-xl text-white text-xs border border-white/20 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-300">
                  {mapLayer} Spectrum Layer
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-300">Stress</span>
                  <div className="h-2 w-20 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500"></div>
                  <span className="text-[10px] text-stone-300">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Satellite passes occur every 3 days. High NDVI values (&gt;0.70) indicate dense photosynthetic chlorophyll activity.
            </span>
          </div>
        </div>

        {/* Right Card: Crop Leaf Scanner & Photo Uploader */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Crop Disease Image Diagnosis</span>
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Gemini AI Vision
              </span>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center bg-stone-50/50 hover:bg-emerald-50/30 transition-all">
              {uploadedImage ? (
                <div className="relative max-h-48 rounded-xl overflow-hidden mx-auto">
                  <img src={uploadedImage} alt="Crop Leaf Scan" className="max-h-48 mx-auto object-contain rounded-xl" />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-stone-900/80 text-white text-xs px-2 py-1 rounded-lg hover:bg-rose-600"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-700">
                    Upload field photo or take leaf picture
                  </p>
                  <label className="inline-block bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-emerald-700 shadow-xs">
                    Browse File or Camera
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* Quick Test Preset Leaf Samples */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-stone-500 uppercase">
                Or select sample crop leaf:
              </span>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {sampleLeafImages.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUploadedImage(sample.url)}
                    className="flex items-center gap-1.5 p-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all"
                  >
                    <img src={sample.url} alt={sample.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[10px] font-semibold text-stone-800 line-clamp-2">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scan Action Button */}
          <div className="mt-4">
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all ${
                isAnalyzing
                  ? "bg-stone-400 cursor-not-allowed"
                  : "bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99]"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Satellite & Spectral Leaf Telemetry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run AI Disease & Fertilization Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-md space-y-5 animate-in fade-in duration-300">
          {/* Header Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200">
                  Diagnosis Complete
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  {analysisResult.confidenceScore}% AI Confidence
                </span>
              </div>
              <h2 className="text-xl font-black text-stone-900 mt-2">
                {analysisResult.diseaseDetected}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Severity: <strong>{analysisResult.severity}</strong> • Satellite Vegetation Index: <strong>{analysisResult.satelliteNDVIIndex}</strong>
              </p>
            </div>

            {/* Voice Audio Readout */}
            <button
              onClick={playVoiceReadout}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-900 rounded-xl hover:bg-emerald-200 text-xs font-bold border border-emerald-300 shrink-0 self-start sm:self-auto"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>Listen Diagnosis Audio</span>
            </button>
          </div>

          {/* Treatment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chemical Remedy */}
            <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Recommended Chemical Treatment</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                {analysisResult.diseaseTreatment.chemicalRemedy}
              </p>
            </div>

            {/* Organic Remedy */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Natural / Organic Farming Remedy</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                {analysisResult.diseaseTreatment.organicRemedy}
              </p>
            </div>
          </div>

          {/* Customized Fertilizer Plan */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Targeted Soil Fertilizer Plan for {selectedPlot.currentCrop}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {analysisResult.fertilizerPlan.map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border border-stone-200 shadow-2xs">
                  <span className="font-bold text-emerald-900 text-xs block">{f.fertilizer}</span>
                  <span className="text-sm font-extrabold text-stone-900 block mt-0.5">{f.dosage}</span>
                  <span className="text-[11px] text-stone-600 block mt-1">{f.timing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Yield & Revenue Gain Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Potential Economic Benefit
              </span>
              <h4 className="text-lg font-black mt-1">
                Yield Increase: +{analysisResult.expectedYieldEstimate.yieldIncreasePercent}%
              </h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                From {analysisResult.expectedYieldEstimate.withoutTreatmentQuintals} Qtl/acre to{" "}
                {analysisResult.expectedYieldEstimate.withOptimizationQuintals} Qtl/acre
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/20 text-center sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Est. Profit Boost</span>
              <span className="text-xl font-black text-amber-300">{analysisResult.expectedYieldEstimate.estRevenueGainINR}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
