import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Calendar, ThermometerSun, Droplets, Info, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Chatbot from "@/components/ui/chatbot";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Extended crop data with more detailed information
const cropData = [
  {
    name: "Rice",
    profitability: "High",
    season: "Kharif (June-October)",
    waterNeed: "High",
    temperature: "21-37°C",
    soilType: "Clay loam",
    expectedYield: "4-6 tons/hectare",
    marketPrice: "₹2,000-2,500/quintal",
    difficulty: "Medium",
    roi: "35-40%",
    description: "Rice is a staple food crop that requires substantial water and warm temperatures. Best suited for clay loam soils with proper irrigation facilities.",
    growthDuration: "120-150 days",
    bestPractices: [
      "Maintain proper water level throughout growth stages",
      "Apply nitrogen fertilizer in splits for better yield",
      "Control weeds during early growth stage",
      "Monitor for brown spot and blast diseases"
    ],
    commonPests: ["Brown Plant Hopper", "Stem Borer", "Rice Leaf Folder"],
    fertilization: "NPK ratio of 4:2:1 with additional zinc and iron supplements",
    irrigation: "Continuous flooding method with intermittent drainage"
  },
  {
    name: "Wheat",
    profitability: "High",
    season: "Rabi (November-April)",
    waterNeed: "Medium",
    temperature: "15-25°C",
    soilType: "Loamy",
    expectedYield: "3-5 tons/hectare",
    marketPrice: "₹1,800-2,200/quintal",
    difficulty: "Easy",
    roi: "30-35%",
    description: "Wheat is a cool-season cereal crop that performs well in loamy soils. Requires moderate water and cooler temperatures during growth.",
    growthDuration: "120-140 days",
    bestPractices: [
      "Sow at optimal depth of 3-4 cm",
      "Apply phosphorus at sowing time for better root development",
      "Timely weed control during tillering stage",
      "Proper drainage to avoid waterlogging"
    ],
    commonPests: ["Aphids", "Army Worm", "Wheat Mite"],
    fertilization: "Balanced NPK application with sulfur and zinc supplements",
    irrigation: "Irrigation at crown root initiation and heading stages"
  },
  {
    name: "Capsicum (Bell Pepper)",
    profitability: "High",
    season: "Year-round",
    waterNeed: "Medium",
    temperature: "18-30°C",
    soilType: "Sandy loam",
    expectedYield: "15-25 tons/hectare",
    marketPrice: "₹2,000-4,000/quintal",
    difficulty: "Medium",
    roi: "40-50%",
    description: "Capsicum is a high-value vegetable crop that can be grown year-round in suitable climates. Requires well-drained sandy loam soil.",
    growthDuration: "90-120 days",
    bestPractices: [
      "Mulching to maintain soil moisture",
      "Staking for supporting heavy fruits",
      "Regular harvesting to encourage new fruit set",
      "Proper spacing for air circulation"
    ],
    commonPests: ["Thrips", "Aphids", "Fruit Borer"],
    fertilization: "High potassium with moderate nitrogen and phosphorus",
    irrigation: "Drip irrigation for efficient water use"
  },
  {
    name: "Sugarcane",
    profitability: "Very High",
    season: "Year-round",
    waterNeed: "High",
    temperature: "20-30°C",
    soilType: "Loamy",
    expectedYield: "70-80 tons/hectare",
    marketPrice: "₹280-320/quintal",
    difficulty: "Medium",
    roi: "40-45%",
    description: "Sugarcane is a long-duration cash crop with high profitability. Requires substantial water and nutrient inputs but provides excellent returns.",
    growthDuration: "10-12 months",
    bestPractices: [
      "Use setts from healthy mother plants",
      "Earthing up during tillering stage",
      "Trash mulching to conserve moisture",
      "Proper ratoon management for successive crops"
    ],
    commonPests: ["Top Borer", "Scale Insects", "White Fly"],
    fertilization: "High nitrogen with potassium and phosphorus in split doses",
    irrigation: "Furrow irrigation with proper drainage"
  },
  {
    name: "Tomato",
    profitability: "High",
    season: "Year-round",
    waterNeed: "Medium",
    temperature: "20-27°C",
    soilType: "Sandy loam",
    expectedYield: "25-35 tons/hectare",
    marketPrice: "₹800-1,500/quintal",
    difficulty: "Medium",
    roi: "50-60%",
    description: "Tomato is a high-value vegetable crop with short duration. Performs well in sandy loam soils with proper irrigation and pest management.",
    growthDuration: "70-90 days",
    bestPractices: [
      "Staking or caging for supporting plants",
      "Mulching to reduce soil borne diseases",
      "Frequent harvesting to encourage continuous fruiting",
      "Pruning suckers for better air circulation"
    ],
    commonPests: ["Fruit Borer", "Leaf Miner", "White Fly"],
    fertilization: "Balanced NPK with calcium and magnesium supplements",
    irrigation: "Frequent light irrigation with mulching"
  },
  {
    name: "Maize",
    profitability: "Medium",
    season: "Kharif & Rabi",
    waterNeed: "Medium",
    temperature: "18-27°C",
    soilType: "Well-drained loam",
    expectedYield: "5-7 tons/hectare",
    marketPrice: "₹1,400-1,800/quintal",
    difficulty: "Easy",
    roi: "25-30%",
    description: "Maize is a versatile cereal crop that can be grown in both Kharif and Rabi seasons. Requires well-drained loam soil and moderate water.",
    growthDuration: "90-110 days",
    bestPractices: [
      "Optimal plant population for hybrid varieties",
      "Weed control during knee-high stage",
      "Proper drainage to avoid waterlogging",
      "Timely harvesting at physiological maturity"
    ],
    commonPests: ["Stem Borer", "Fall Army Worm", "Shoot Fly"],
    fertilization: "High nitrogen with phosphorus and potassium",
    irrigation: "Irrigation at critical growth stages"
  },
];

const getProfitabilityColor = (level: string) => {
  switch (level) {
    case "Very High":
      return "bg-growth text-white";
    case "High":
      return "bg-primary text-white";
    case "Medium":
      return "bg-harvest text-white";
    default:
      return "bg-muted";
  }
};

const getDifficultyColor = (level: string) => {
  switch (level) {
    case "Easy":
      return "text-success";
    case "Medium":
      return "text-warning";
    case "Hard":
      return "text-destructive";
    default:
      return "text-muted";
  }
};

const CropRecommendations = () => {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<typeof cropData[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (crop: typeof cropData[0]) => {
    setSelectedCrop(crop);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedCrop(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-hero pt-24">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t.aiCropRecommendations}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t.aiCropRecommendationsDesc}
          </p>
        </div>

        {/* Current Conditions */}
        <Card className="shadow-medium mb-8">
          <CardHeader>
            <CardTitle>{t.yourFarmConditions}</CardTitle>
            <CardDescription>
              {t.yourFarmConditionsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.soilMoisture}</p>
                  <p className="font-semibold">58%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-harvest/10 rounded-lg">
                  <ThermometerSun className="h-6 w-6 text-harvest" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.temperature}</p>
                  <p className="font-semibold">28°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-growth/10 rounded-lg">
                  <Info className="h-6 w-6 text-growth" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.soilType}</p>
                  <p className="font-semibold">Loamy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-sky" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.season}</p>
                  <p className="font-semibold">Rabi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crop Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cropData.map((crop, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-2xl">{crop.name}</CardTitle>
                  <Badge className={getProfitabilityColor(crop.profitability)}>
                    {crop.profitability}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t.roi}: {crop.roi}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.season}:</span>
                    <span className="font-medium">{crop.season}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.waterNeed}:</span>
                    <span className="font-medium">{crop.waterNeed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.temperature}:</span>
                    <span className="font-medium">{crop.temperature}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.soilType}:</span>
                    <span className="font-medium">{crop.soilType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.difficulty}:</span>
                    <span className="font-medium">{crop.difficulty}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-growth mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">{t.expectedYield}</p>
                      <p className="text-muted-foreground">{crop.expectedYield}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-harvest mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">{t.marketPrice}</p>
                      <p className="text-muted-foreground">{crop.marketPrice}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-primary" onClick={() => handleViewDetails(crop)}>
                  {t.viewDetails}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Crop Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl">{selectedCrop?.name}</DialogTitle>
                <DialogDescription>
                  {selectedCrop?.description}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={closeDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedCrop && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t.roi}</p>
                  <p className="font-semibold">{selectedCrop.roi}</p>
                </div>
                <div className="bg-harvest/10 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t.difficulty}</p>
                  <p className={`font-semibold ${getDifficultyColor(selectedCrop.difficulty)}`}>
                    {selectedCrop.difficulty}
                  </p>
                </div>
                <div className="bg-growth/10 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t.growthDuration}</p>
                  <p className="font-semibold">{selectedCrop.growthDuration}</p>
                </div>
                <div className="bg-sky/10 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t.expectedYield}</p>
                  <p className="font-semibold">{selectedCrop.expectedYield}</p>
                </div>
              </div>
              
              {/* Detailed Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t.bestPractices}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedCrop.bestPractices.map((practice, index) => (
                      <li key={index} className="text-sm">{practice}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t.commonPests}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCrop.commonPests.map((pest, index) => (
                      <Badge key={index} variant="secondary">{pest}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t.fertilization}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCrop.fertilization}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t.irrigation}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCrop.irrigation}</p>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-primary" onClick={closeDialog}>
                {t.close}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Chatbot/>
    </div>
  );
};

export default CropRecommendations;