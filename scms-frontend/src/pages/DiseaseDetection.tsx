import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chatbot from "@/components/ui/chatbot";

const DiseaseDetection = () => {
  const { t, language } = useLanguage(); // ✅ get current language
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  // ✅ Store selected language in a variable
  const userSelectedLanguage = language;
  console.log("🌐 User selected language:", userSelectedLanguage);

  // 🔹 Upload + Analyze image
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const blobUrl = URL.createObjectURL(file);
      setSelectedImage(blobUrl);
      setAnalyzing(true);
      console.log("📸 Selected file:", file.name);

      // Convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64Image = await base64Promise;

      // Initialize Gemini with your API key
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDPuz95P3HK5ym3MQXcWEbb24MGfwDA8jc";
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // ✅ Language-aware AI prompt
      const prompt = `You are an expert agricultural assistant. 
Speak and reply to the user in their selected language: ${userSelectedLanguage}. 
Do not use * or _ symbols. 
Analyze the uploaded crop, leave,stem image and provide a clear, factual, and structured analysis. 
If listing points, use numbered format (1, 2, 3...). 

Your response must contain only real insights based on the image — do not make up information. 
Return the result in normal steps format with the following keys:
1. Crop Name 
2. Crop Status (Healthy or Diseased)
3. Disease Detected (If any disease detected, give its real name. If none, write "None")
4. Disease Solution (Brief and practical treatment steps)
5. Fertilizer Recommendations (Based on crop health)
6. Yield Prediction
7. Overall Suggestions (watering, sunlight, soil, pest control, harvesting)

Rules:
- If the image does not contain a crop but , respond only with: "Please upload a valid crop image".
- If no disease is found, say: "Crop Status: Healthy, Disease Found: None, Solution: No treatment required."
- Be concise, accurate, and avoid extra formatting.`;

      const imagePart = {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: file.type,
        },
      };

      const response = await model.generateContent([prompt, imagePart]);
      const fullText = response.response.text();

      console.log("🧠 Gemini Result:", fullText);
      setResult(fullText);

      toast({
        title: "Analysis Complete",
        description: "Crop disease identified successfully",
      });
    } catch (error) {
      console.error("❌ Error analyzing image:", error);
      setResult("Failed to analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero mt-20">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t.aiCropDisease}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t.aiCropDiseaseDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                {t.uploadCropImage}
              </CardTitle>
              <CardDescription>{t.uploadCropImageDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors relative">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Selected crop"
                      className="max-h-96 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">{t.dropImageHere}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.orClickBrowse}
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {selectedImage && (
                  <Button
                    disabled={analyzing}
                    className="w-full bg-gradient-primary"
                  >
                    {analyzing ? t.analyzing : t.analyzeImage}
                  </Button>
                )}

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-growth" />
                    {t.tipsForBestResults}
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>{t.tip1}</li>
                    <li>{t.tip2}</li>
                    <li>{t.tip3}</li>
                    <li>{t.tip4}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>{t.analysisResults}</CardTitle>
              <CardDescription>{t.analysisResultsDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="whitespace-pre-wrap text-lg">{result}</div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>{t.uploadToStart}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <Chatbot />
      </div>
    </div>
  );
};

export default DiseaseDetection;
