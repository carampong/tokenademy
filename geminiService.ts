import { GoogleGenAI } from "@google/genai";

// specific safety check for browser environments where process might be undefined
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateTokenContent = async (name: string, symbol: string, style: 'meme' | 'serious') => {
  try {
    if (!apiKey) {
        console.warn("API Key missing. Returning fallback content.");
        throw new Error("Missing API Key");
    }

    const prompt = `
      You are a crypto marketing expert.
      Generate a short, punchy description (max 2 sentences) for a new cryptocurrency token.
      
      Token Name: ${name}
      Symbol: ${symbol}
      Style: ${style === 'meme' ? 'Funny, hype-driven, meme culture, "to the moon" references' : 'Professional, utility-focused, innovative, financial revolution'}
      
      Return ONLY the raw string of the description. Do not wrap in quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails or key is missing
    return `The future of decentralized finance is here with ${name} ($${symbol}). Join the revolution today.`;
  }
};