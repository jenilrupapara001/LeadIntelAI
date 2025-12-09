import { GoogleGenAI, Type } from "@google/genai";
import { Lead, SearchParams } from "../types";

// Initialize the client
// NOTE: We recreate this in the function to ensure we capture the latest env var if it changes,
// but for this structure, a global instance is fine as long as the key is present.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLeads = async (params: SearchParams): Promise<Lead[]> => {
  const ai = getClient();
  
  const prompt = `
    You are an expert Lead Intelligence AI. Your task is to find and qualify business leads.
    
    Target Criteria:
    - Industry: ${params.industry}
    - Location: ${params.location}
    - Service to Pitch: ${params.service}

    Task:
    1. Identify 100 real or realistic companies in this specific location and industry that would likely benefit from ${params.service}.
    2. For each company, simulate a deep analysis to find a key Decision Maker (CEO, Founder, Marketing Director).
    3. Predict a verified email address format (e.g., firstname@domain.com) based on common patterns.
    4. Calculate a "Lead Score" (0-100) based on their likely need for the service (e.g., if they need SEO, look for companies with poor online visibility).
    5. Provide a specific 1-sentence reason why they are a good fit.

    Output Validation:
    - Ensure websites look valid (start with http/https).
    - Ensure scores are distributed realistically (not all 100).
    - Return strictly a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // NOTE: Google Search tool cannot be combined with responseMimeType: "application/json"
        // We are using the model's internal knowledge to generate realistic leads with strict schema validation.
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              website: { type: Type.STRING },
              industry: { type: Type.STRING },
              location: { type: Type.STRING },
              size: { type: Type.STRING },
              decisionMaker: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  email: { type: Type.STRING },
                  linkedIn: { type: Type.STRING }
                },
                required: ["name", "role", "email"]
              },
              phone: { type: Type.STRING },
              score: { type: Type.NUMBER },
              scoreBreakdown: {
                type: Type.OBJECT,
                properties: {
                  onlinePresence: { type: Type.NUMBER },
                  websiteQuality: { type: Type.NUMBER },
                  seoIssues: { type: Type.NUMBER },
                  growthSignals: { type: Type.NUMBER },
                  relevancy: { type: Type.NUMBER }
                },
                required: ["onlinePresence", "websiteQuality", "seoIssues", "growthSignals", "relevancy"]
              },
              reason: { type: Type.STRING }
            },
            required: ["companyName", "website", "score", "decisionMaker", "scoreBreakdown", "reason"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");

    const rawData = JSON.parse(text);
    
    // Add IDs for React keys
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: `lead-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error generating leads:", error);
    throw error;
  }
};