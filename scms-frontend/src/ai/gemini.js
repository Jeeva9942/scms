import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDPuz95P3HK5ym3MQXcWEbb24MGfwDA8jc";
const genAI = new GoogleGenerativeAI(API_KEY);

// Chat function for the chatbot
export async function chatWithGemini(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble responding right now. Please try again later.";
  }
}

// Image analysis function for disease detection
export async function analyzeImage(imageData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const result = await model.generateContent([
      "Analyze this crop image and detect any diseases. Provide the crop name and any visible diseases or health issues.",
      imageData
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    return "Unable to analyze the image. Please try again.";
  }
}