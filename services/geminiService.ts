import { GoogleGenAI } from "@google/genai";

export const generateTokenContent = async (name: string, symbol: string, style: 'meme' | 'serious') => {
  try {
    // Access process.env inside the function scope to avoid top-level module evaluation errors
    // Check if process exists to avoid ReferenceError in some browser environments
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

    if (!apiKey) {
        // This is expected in a demo/static environment without env vars
        // We throw here to trigger the catch block which returns the fallback
        throw new Error("API Key missing");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

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
    console.warn("AI Generation unavailable (missing key or error), using fallback.");
    // Fallback content allowing the app to function without API key
    return `The future of decentralized finance is here with ${name} ($${symbol}). Join the revolution today.`;
  }
};
