export type LanguageCode = "hi" | "en" | "pa" | "bn" | "mr" | "te" | "ta" | "gu" | "kn";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export interface SoilMetrics {
  nitrogenKgHa: number; // Low < 280, Opt 280-560, High > 560
  phosphorusKgHa: number; // Low < 11, Opt 11-25, High > 25
  potassiumKgHa: number; // Low < 118, Opt 118-280, High > 280
  pH: number;
  moisturePct: number;
  organicCarbonPct: number;
}

export interface FertilizerRecommendation {
  fertilizerName: string;
  bagsPerAcre: number;
  totalKgPerAcre: number;
  timing: string;
  notes: string;
  isOrganic?: boolean;
}

export interface CropPlot {
  id: string;
  plotName: string;
  locationState: string;
  district: string;
  areaAcres: number;
  currentCrop: string;
  sowingDate: string;
  ndviScore: number;
  moistureScore: number;
  healthStatus: "EXCELLENT" | "GOOD" | "ATTENTION_NEEDED" | "CRITICAL";
  satelliteImageUrl: string;
  soil: SoilMetrics;
}

export interface DiseaseAnalysisResult {
  diseaseDetected: string;
  severity: string;
  confidenceScore: number;
  satelliteNDVIIndex: number;
  soilHealthStatus: {
    nitrogenStatus: string;
    phosphorusStatus: string;
    potassiumStatus: string;
    pH: number;
    moisturePercent: number;
  };
  fertilizerPlan: Array<{
    fertilizer: string;
    dosage: string;
    timing: string;
    notes: string;
  }>;
  diseaseTreatment: {
    chemicalRemedy: string;
    organicRemedy: string;
    preventionTip: string;
  };
  expectedYieldEstimate: {
    withoutTreatmentQuintals: number;
    withOptimizationQuintals: number;
    yieldIncreasePercent: number;
    estRevenueGainINR: string;
  };
}

export interface MandiPrice {
  id: string;
  crop: string;
  state: string;
  mandi: string;
  pricePerQuintal: number;
  change: number;
  trend: "up" | "down" | "stable";
  arrivalTons: number;
  qualityGrade: string;
}

export interface PestForecast {
  id: string;
  pestName: string;
  cropTarget: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  riskScore: number;
  favorableConditions: string;
  affectedRegions: string[];
  symptoms: string;
  preventiveAction: string;
  dialectAlertHi: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  location: string;
  cropCategory: string;
  title: string;
  content: string;
  upvotes: number;
  repliesCount: number;
  timestamp: string;
  isSynced: boolean;
  tags: string[];
}

export interface OfflineQueueItem {
  id: string;
  type: "FORUM_POST" | "SOIL_LOG" | "DISEASE_REPORT" | "CALCULATOR_SAVE";
  data: any;
  createdAt: string;
  synced: boolean;
}
