import { GoogleGenAI, Type } from "@google/genai";
import { Lead, SearchParams } from "../types";

// Initialize the client
// NOTE: We recreate this in the function to ensure we capture the latest env var if it changes,
// but for this structure, a global instance is fine as long as the key is present.
const getClient = () => new GoogleGenAI({ apiKey: 'AIzaSyAFoOtS5m806_tndRpqhLOjk4JmO5kVmvg' });

export const generateLeads = async (params: SearchParams): Promise<Lead[]> => {
  const ai = getClient();
  
 const prompt = `
You are an advanced Lead Intelligence AI designed to find, analyze, and qualify ideal business leads with high accuracy and realistic data.

=== TARGET CRITERIA ===
Industry: ${params.industry}
Location: ${params.location}
Primary Service to Pitch: ${params.service}

=== OBJECTIVES ===
1. Generate a list of *100 real or highly realistic companies* that match the industry and location.
2. Perform a simulated deep-analysis for each company to identify:
   - A key decision maker (CEO, Founder, Co-Founder, Director, Marketing Head).
   - A realistic full name (avoid generic placeholders).
   - A predicted email pattern based on the company domain and common corporate email structures.
3. Validate or intelligently generate a plausible website.
4. Score each lead with a **Lead Score (0–100)** based on:
   - Likelihood that they need ${params.service}
   - Size & growth signals
   - Market activity
   - Website quality / SEO signals (simulated)
   - Industry maturity
   - Digital presence strength
5. Provide a concise 1-sentence reason why they are a strong potential prospect.

=== SCORING RULES ===
- Spread scores realistically (no cluster of 90–100 only).
- Only 5–10% should be above 90.
- 20–30% should be in the 70–85 range (strong leads).
- At least 30% should be below 50 (weak but included for realism).
- Never return the same score twice consecutively.

=== EMAIL GENERATION RULES ===
Use realistic, corporate-friendly patterns only:
- firstname@domain
- firstname.lastname@domain
- firstinitiallastname@domain
- marketing@domain
- info@domain (only if no person found)
Never use fake TLDs or random domains.

=== DATA VALIDATION ===
Before returning output:
- Ensure company names look real (no “Company 1, Demo Corp, Test LLC”).
- **WEBSITES MUST BE VALID URLS**. They must start with https://.
- **DO NOT** use "example.com", "domain.com", or invalid TLDs.
- If you cannot find a realistic website, **exclude the lead**.
- No missing fields.
- No duplicates.
- Decision maker roles must be senior level.
- Emails must match the domain of the company website.

=== OUTPUT FORMAT ===
Return strictly a JSON array of 100 objects with the following structure:

[
  {
    "companyName": "",
    "website": "",
    "industry": "${params.industry}",
    "location": "${params.location}",
    "decisionMaker": {
        "name": "",
        "role": ""
    },
    "email": "",
    "leadScore": 0,
    "scoreBreakdown": {
       "onlinePresence": 0,
       "websiteQuality": 0,
       "seoIssues": 0,
       "growthSignals": 0,
       "relevancy": 0
    },
    "reason": ""
  }
]

=== IMPORTANT RULES ===
- Do NOT explain anything.
- Do NOT include metadata, comments, or extra text.
- Only output the JSON array.
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
    
    // Strict URL Regex for http/https
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    const validatedLeads = rawData.filter((item: any) => {
        const isValidUrl = item.website && urlRegex.test(item.website) && !item.website.includes("example.com");
        return isValidUrl;
    });

    // Add IDs for React keys
    return validatedLeads.map((item: any, index: number) => ({
      ...item,
      id: `lead-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error generating leads:", error);
    throw error;
  }
};

export const generateOutreachEmail = async (lead: Lead, service: string): Promise<{ subject: string; body: string }> => {
  const ai = getClient();
  const prompt = `
    Role: Senior B2B Sales Strategist.
    Task: Write a "Cold Email" to a prospect.
    
    Goal: Start a conversation. NOT to sell immediately.
    Style: "Peer-to-Peer" tone. Short, punchy, no marketing fluff. Plain text style.

    PROSPECT:
    - Name: ${lead.decisionMaker.name} (${lead.decisionMaker.role})
    - Company: ${lead.companyName}
    - Insight/Hook: ${lead.reason}
    
    MY OFFERING: ${service}

    STRICT FRAMEWORK (PAS - Problem, Agitate, Solution):
    
    1. SUBJECT LINE: Internal style, lowercase, boring but relevant. Max 4 words. (e.g., "question about [company]", "idea for [company]", "[company] + [service]")
    
    2. THE BODY:
       - SALUTATION: "Hi [Name],"
       - THE HOOK (The "Why You"): Mention the specific insight regarding ${lead.companyName}. Prove you aren't a bot in 1 sentence.
       - THE PROBLEM (Agitate): Mention a common pain point for ${lead.industry} companies regarding ${service}. 
       - THE SOLUTION (Brief): One sentence on how we fix that specific pain point.
       - SOFT CTA: "Worth a quick chat?" or "Open to seeing how it works?" (No "let's jump on a call at 2pm" aggression).
    
    3. FORMATTING:
       - Max 100 words total.
       - Use double line breaks between paragraphs.
       - No emojis. 

    Output JSON: { "subject": "string", "body": "string" }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["subject", "body"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Email gen error", error);
    // Fallback if AI fails
    return {
      subject: `question about ${lead.companyName}`,
      body: `Hi ${lead.decisionMaker.name},\n\nI was looking into ${lead.companyName} and noticed you're well-positioned in the ${lead.industry} space, but might be missing some opportunities with your ${service}.\n\nMost leaders in your field struggle to scale this efficiently without adding headcount.\n\nWe've built a system that solves this directly. Worth a quick look?\n\nBest,\n[Your Name]`
    };
  }
};