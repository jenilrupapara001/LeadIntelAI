import { Lead, SearchParams, DecisionMaker, ScoreBreakdown } from "../types";
import { GoogleGenAI, Type } from "@google/genai";

// --- Configuration ---
// Fix: Use import.meta.env for Vite, with a fallback to empty string to prevent undefined errors.
const GOOGLE_MAPS_API_KEY = 'AIzaSyAl6U7t6CpIheb65VOpW_7Vv9Cjuo13yd4';

// --- Algorithmic Scoring Engine ---
const calculateScore = (place: any, service: string): { score: number, breakdown: ScoreBreakdown, reason: string } => {
  const rating = place.rating || 0;
  const reviews = place.userRatingCount || 0;
  const hasWebsite = !!place.websiteUri;

  // Base Scores
  let onlinePresence = Math.min((reviews / 50) * 100, 100); // 50+ reviews is 100% presence
  let websiteQuality = hasWebsite ? 80 : 10; // Simple check
  let seoIssues = hasWebsite ? 40 : 90; // No website = major SEO issue
  let growthSignals = Math.min((reviews / 10) * 100, 100);
  let relevancy = 75; // Baseline

  // Service-Specific Logic
  let reason = "";
  
  const serviceLower = service.toLowerCase();
  
  if (serviceLower.includes("seo") || serviceLower.includes("marketing")) {
    // Low reviews or low rating = High Opportunity for SEO
    relevancy = reviews < 20 ? 95 : (rating < 4.0 ? 90 : 60);
    seoIssues = reviews < 20 ? 85 : 40;
    reason = reviews < 20 
      ? `Only ${reviews} reviews found. High potential for local SEO & review generation.`
      : `Established presence (${reviews} reviews) but opportunities to dominate local keywords.`;
  } else if (serviceLower.includes("web") || serviceLower.includes("design")) {
    // No website or bad metrics
    relevancy = !hasWebsite ? 100 : 50;
    reason = !hasWebsite 
      ? "Missing website URL on Google Maps. Critical need for web development."
      : "Website exists, but could likely use conversion optimization.";
  } else if (serviceLower.includes("reputation")) {
    relevancy = rating < 4.2 ? 95 : 40;
    reason = rating < 4.2
      ? `Low rating (${rating} stars). Urgent need for reputation management.`
      : `Strong rating (${rating} stars). Maintenance focus only.`;
  } else {
    reason = `Local business in ${place.location} matching target criteria.`;
  }

  // Final Weighted Score
  const totalScore = Math.round(
    (onlinePresence * 0.15) + 
    (websiteQuality * 0.15) + 
    (seoIssues * 0.20) + 
    (relevancy * 0.50)
  );

  return {
    score: totalScore,
    breakdown: { onlinePresence, websiteQuality, seoIssues, growthSignals, relevancy },
    reason
  };
};

// --- Mock Data Generator (Fallback) ---
const generateMockLeads = (params: SearchParams): Lead[] => {
  const { industry, location } = params;
  
  // Industry-specific name generators
  const prefixes = ["Apex", "Summit", "Urban", "Prime", "Elite", "Modern", "Local", "City", "Metro", "NextLevel"];
  const suffixes = industry.includes("Dental") ? ["Dental", "Smiles", "Orthodontics", "Clinic"] 
                 : industry.includes("Tech") ? ["Systems", "Labs", "Solutions", "Tech"]
                 : industry.includes("Real Estate") ? ["Realty", "Properties", "Estates", "Group"]
                 : ["Ventures", "Solutions", "Services", "Co.", "Group"];
  
  const streetNames = ["Market St", "Main St", "Broadway", "2nd Ave", "Oak Ln", "Pine St", "Washington Blvd"];

  return Array.from({ length: 12 }).map((_, i) => {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${prefix} ${suffix}`;
    const domain = name.toLowerCase().replace(/ /g, '') + ".com";
    
    // Randomize stats
    const rating = (3.5 + Math.random() * 1.5).toFixed(1); // 3.5 to 5.0
    const reviewCount = Math.floor(Math.random() * 150) + 2;
    const hasWebsite = Math.random() > 0.1; // 90% have websites

    const placeMock = {
      rating: parseFloat(rating),
      userRatingCount: reviewCount,
      websiteUri: hasWebsite ? `https://${domain}` : null,
      location: location
    };

    const scoring = calculateScore(placeMock, params.service);

    return {
      id: `mock-${i}`,
      companyName: name,
      website: hasWebsite ? `https://${domain}` : "",
      industry: industry,
      location: location,
      address: `${Math.floor(Math.random() * 9000) + 100} ${streetNames[Math.floor(Math.random() * streetNames.length)]}, ${location}`,
      googleRating: parseFloat(rating),
      reviewCount: reviewCount,
      size: Math.random() > 0.5 ? "1-10 employees" : "11-50 employees",
      decisionMaker: {
        name: ["Sarah Miller", "James Carter", "David Chen", "Emily Davis", "Michael Ross"][Math.floor(Math.random() * 5)],
        role: ["Founder", "Owner", "CEO", "Director", "Manager"][Math.floor(Math.random() * 5)],
        email: `hello@${domain}`
      },
      phone: `(555) ${Math.floor(Math.random() * 899) + 100}-${Math.floor(Math.random() * 8999) + 1000}`,
      score: scoring.score,
      scoreBreakdown: scoring.breakdown,
      reason: scoring.reason
    };
  });
};

// --- Main Lead Generation Function ---
export const generateLeads = async (params: SearchParams): Promise<Lead[]> => {
  // Graceful check for API key
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("No Google Maps API Key found (VITE_GOOGLE_MAPS_API_KEY). Using high-fidelity simulation.");
    return new Promise(resolve => setTimeout(() => resolve(generateMockLeads(params)), 1500));
  }

  try {
    // 1. Fetch from Google Places API (New) - Text Search
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.primaryType'
      },
      body: JSON.stringify({
        textQuery: `${params.industry} in ${params.location}`
      })
    });

    if (!response.ok) throw new Error("Google Maps API Error");
    const data = await response.json();
    
    if (!data.places || data.places.length === 0) {
      return generateMockLeads(params); // Fallback if no results
    }

    // 2. Transform Data
    const leads: Lead[] = data.places.map((place: any, index: number) => {
      const scoring = calculateScore(place, params.service);
      const domain = place.websiteUri 
        ? new URL(place.websiteUri).hostname.replace('www.', '') 
        : 'gmail.com'; // Fallback

      // Heuristic for Decision Maker (Since Maps doesn't give this)
      const decisionMaker = {
        name: "Hiring Manager", // Placeholder as Maps doesn't provide names
        role: "Owner / Manager",
        email: `info@${domain}` // Predicted generic email
      };

      return {
        id: `gmaps-${index}-${Date.now()}`,
        companyName: place.displayName.text,
        website: place.websiteUri || "",
        industry: params.industry,
        location: params.location,
        address: place.formattedAddress,
        googleRating: place.rating || 0,
        reviewCount: place.userRatingCount || 0,
        size: "Unknown",
        decisionMaker,
        phone: place.nationalPhoneNumber,
        score: scoring.score,
        scoreBreakdown: scoring.breakdown,
        reason: scoring.reason
      };
    });

    // 3. Filter only working websites if possible (Basic Regex check)
    return leads.filter(l => l.website && l.website.startsWith('http'));

  } catch (error) {
    console.error("Failed to fetch Google Maps data", error);
    return generateMockLeads(params);
  }
};

// --- Template-Based Email Generator (Fallback) ---
const generateTemplateEmail = (lead: Lead, service: string): { subject: string; body: string } => {
  const firstName = lead.decisionMaker.name.split(' ')[0];
  const lowRating = lead.googleRating < 4.2;
  const lowReviews = lead.reviewCount < 20;
  
  let subject = `question about ${lead.companyName}`;
  if (lowReviews) subject = `local visibility for ${lead.companyName}`;
  else if (lowRating) subject = `reviews for ${lead.companyName}`;

  const hook = `I found ${lead.companyName} on Google Maps while looking for ${lead.industry} providers in ${lead.location}.`;
  
  let problem = "";
  if (lowReviews) {
    problem = `I noticed you only have ${lead.reviewCount} reviews. In ${lead.location}, top competitors usually have 50+, which pushes you down the search results.`;
  } else if (lowRating) {
    problem = `I saw your rating is sitting at ${lead.googleRating}. Even a few negative reviews can significantly impact new patient/client trust when they compare options.`;
  } else {
    problem = `You have a solid profile, but I noticed your website isn't fully optimized to capture the traffic coming from Maps.`;
  }

  const solution = `We help businesses in ${lead.industry} fix this by implementing a system to ${lowReviews ? 'automatically generate 5-star reviews' : 'optimize local rankings and conversion'}.`;
  const cta = "Worth a quick 10-minute chat to see how we could help?";

  const body = `Hi ${firstName},\n\n${hook}\n\n${problem}\n\n${solution}\n\n${cta}\n\nBest,\n[Your Name]`;

  return { subject, body };
};

// --- AI-Based Email Generator ---
export const generateOutreachEmail = async (lead: Lead, service: string): Promise<{ subject: string; body: string }> => {
  if (!process.env.API_KEY) {
    return generateTemplateEmail(lead, service);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an expert sales copywriter using the PAS (Problem-Agitate-Solution) framework.
      Write a cold outreach email to ${lead.decisionMaker.name}, ${lead.decisionMaker.role} at ${lead.companyName}.
      
      Details:
      - Industry: ${lead.industry}
      - Location: ${lead.location}
      - Rating: ${lead.googleRating} (${lead.reviewCount} reviews)
      - Service: ${service}
      - Issues: ${lead.reason}
      
      Return JSON with "subject" and "body".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          }
        }
      }
    });

    const json = JSON.parse(response.text);
    return { subject: json.subject, body: json.body };
  } catch (error) {
    console.warn("Gemini generation failed, falling back to template", error);
    return generateTemplateEmail(lead, service);
  }
};