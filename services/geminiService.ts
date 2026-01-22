
import { GoogleGenAI } from "@google/genai";

export const generateStellarSummary = async (date: string, capsules: any[]) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. Collective memory remains in shadows.");
    return "The stars are silent today...";
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    Below are capsules (memories) left by people for the date ${date}. 
    Please provide a poetic, cosmic summary of these collective memories. 
    Keep it under 3 sentences. Use a theme of stars, time, and legacy.

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

export const getAIGuidance = async (message: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "The void reflects your own words.";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transform this memory into a short poetic epitaph for a star in a galaxy: "${message}"`,
    });
    return response.text;
  } catch (error) {
    return message;
  }
};
