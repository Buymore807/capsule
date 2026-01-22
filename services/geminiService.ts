
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

export const generateStellarSummary = async (date: string, capsules: any[], lang: Language = 'en') => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. Collective memory remains in shadows.");
    return "The stars are silent today...";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const languageNames: Record<Language, string> = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German"
  };

  const prompt = `
    Below are capsules (memories) left by people for the date ${date}. 
    Please provide a poetic, cosmic summary of these collective memories. 
    Keep it under 3 sentences. Use a theme of stars, time, and legacy.
    IMPORTANT: Write the summary in ${languageNames[lang]}.

    Memories:
    ${capsules.map(c => `- ${c.title}: ${c.message}`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The cosmic winds have scattered the words of this era.";
  }
};

export const getAIGuidance = async (message: string, lang: Language = 'en') => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "The void reflects your own words.";

  const ai = new GoogleGenAI({ apiKey });
  
  const languageNames: Record<Language, string> = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German"
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transform this memory into a short poetic epitaph for a star in a galaxy. 
      Language: ${languageNames[lang]}. 
      Message: "${message}"`,
    });
    return response.text;
  } catch (error) {
    return message;
  }
};
