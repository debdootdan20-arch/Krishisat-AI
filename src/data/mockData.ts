import { CropPlot, ForumPost, MandiPrice, PestForecast } from "../types";

export const MOCK_CROP_PLOTS: CropPlot[] = [
  {
    id: "plot-pb-01",
    plotName: "Punjab Wheat Sector #4",
    locationState: "Punjab",
    district: "Ludhiana",
    areaAcres: 3.5,
    currentCrop: "Wheat (HD-2967 Variety)",
    sowingDate: "2026-11-10",
    ndviScore: 0.72,
    moistureScore: 0.65,
    healthStatus: "GOOD",
    satelliteImageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    soil: {
      nitrogenKgHa: 210, // Low
      phosphorusKgHa: 22, // Opt
      potassiumKgHa: 240, // Opt
      pH: 6.9,
      moisturePct: 42,
      organicCarbonPct: 0.52
    }
  },
  {
    id: "plot-mh-02",
    plotName: "Maharashtra Cotton Plot #2",
    locationState: "Maharashtra",
    district: "Wardha",
    areaAcres: 2.0,
    currentCrop: "Bt Cotton (Long Staple)",
    sowingDate: "2026-06-18",
    ndviScore: 0.54,
    moistureScore: 0.38,
    healthStatus: "ATTENTION_NEEDED",
    satelliteImageUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80",
    soil: {
      nitrogenKgHa: 180, // Low
      phosphorusKgHa: 14, // Low
      potassiumKgHa: 310, // High
      pH: 7.8,
      moisturePct: 31,
      organicCarbonPct: 0.41
    }
  },
  {
    id: "plot-up-03",
    plotName: "UP Sugarcane Block #9",
    locationState: "Uttar Pradesh",
    district: "Muzaffarnagar",
    areaAcres: 5.0,
    currentCrop: "Sugarcane (Co 0238)",
    sowingDate: "2026-03-12",
    ndviScore: 0.81,
    moistureScore: 0.78,
    healthStatus: "EXCELLENT",
    satelliteImageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80",
    soil: {
      nitrogenKgHa: 310, // Opt
      phosphorusKgHa: 28, // Opt
      potassiumKgHa: 260, // Opt
      pH: 7.1,
      moisturePct: 58,
      organicCarbonPct: 0.68
    }
  },
  {
    id: "plot-wb-04",
    plotName: "Bengal Aman Paddy Field",
    locationState: "West Bengal",
    district: "Purba Bardhaman",
    areaAcres: 1.8,
    currentCrop: "Paddy (Swarna Rice)",
    sowingDate: "2026-07-05",
    ndviScore: 0.48,
    moistureScore: 0.82,
    healthStatus: "CRITICAL",
    satelliteImageUrl: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80",
    soil: {
      nitrogenKgHa: 155, // Low
      phosphorusKgHa: 9, // Low
      potassiumKgHa: 190, // Opt
      pH: 6.2,
      moisturePct: 76,
      organicCarbonPct: 0.48
    }
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: "fp-101",
    authorName: "Gurpreet Singh",
    location: "Bathinda, Punjab",
    cropCategory: "Wheat",
    title: "How to prevent yellowing of wheat leaves after second irrigation?",
    content: "Noticeable yellow patches appeared in my 40-day wheat crop after yesterday's watering. Soil is clay loam. Should I apply Zinc Sulphate or Urea top dressing?",
    upvotes: 24,
    repliesCount: 7,
    timestamp: "2 hours ago",
    isSynced: true,
    tags: ["Yellowing", "Zinc Deficiency", "Punjab Farmers"]
  },
  {
    id: "fp-102",
    authorName: "Rameshwar Patil",
    location: "Yavatmal, Maharashtra",
    cropCategory: "Cotton",
    title: "Effective organic remedy for early Pink Bollworm attack",
    content: "Sharing my experience: Installing 6 pheromone traps per acre along with weekly Neem oil 10,000 PPM spray reduced bollworm infestation by 70% without costly chemicals.",
    upvotes: 42,
    repliesCount: 15,
    timestamp: "5 hours ago",
    isSynced: true,
    tags: ["Organic Remedy", "Pink Bollworm", "Cotton Safety"]
  },
  {
    id: "fp-103",
    authorName: "Subhash Mondal",
    location: "Burdwan, West Bengal",
    cropCategory: "Paddy",
    title: "Mandi price comparison for Swarna Paddy this week",
    content: "Burdwan APMC offering ₹2,180/qtl whereas Memari mandi is buying @ ₹2,240/qtl for moisture under 14%. Direct millers paying ₹2,290.",
    upvotes: 31,
    repliesCount: 9,
    timestamp: "Yesterday",
    isSynced: true,
    tags: ["Mandi Price", "Paddy Sale", "West Bengal"]
  }
];
