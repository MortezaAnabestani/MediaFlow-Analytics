import { GoogleGenAI } from "@google/genai";
import { NarrativeReport, MONITORED_SOURCES } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMediaTrends = async (topic: string = "اخبار مهم", date?: string, specificSources?: string[]): Promise<NarrativeReport> => {
  const targetDateObj = date ? new Date(date) : new Date();
  const targetDateStr = targetDateObj.toLocaleDateString('fa-IR');
  const targetDateIso = targetDateObj.toISOString().split('T')[0]; 
  
  const sourcesToAnalyze = specificSources && specificSources.length > 0 
    ? specificSources 
    : [
        ...MONITORED_SOURCES.domestic,
        ...MONITORED_SOURCES.international,
        ...MONITORED_SOURCES.social
      ];

  const sourcesContext = sourcesToAnalyze.join(", ");
  
  // Determine if this is a broad search or specific topic search
  const isSpecificTopic = topic && topic.trim().length > 0 && topic !== "اخبار مهم";
  
  // Conditional directives based on user intent
  const searchDirectives = isSpecificTopic 
    ? `SEARCH INTENT: You are searching SPECIFICALLY for news about "${topic}" from the listed sources on ${targetDateIso}.
       CRITICAL: If a news item is not related to "${topic}", IGNORE IT.
       CRITICAL: If you find ZERO verified news items about "${topic}" in these sources, return an empty 'topItems' list and state that no news was found.`
    : `SEARCH INTENT: Find the most important headlines and trending stories from the listed sources on ${targetDateIso}.`;

  // SYSTEM INSTRUCTION: STRICT TRUTH AND CITATION POLICY + PERSIAN LANGUAGE
  const systemInstruction = `
    You are "Rasad", a strict Fact-Based News Aggregator for the Persian web.
    
    CORE DIRECTIVE: ZERO TOLERANCE FOR HALLUCINATION.
    
    1. **VERIFICATION IS MANDATORY:** You must ONLY report news that you have found via the 'googleSearch' tool. 
    2. **URL REQUIREMENT:** Every single item in 'topItems' MUST have a valid, direct URL extracted from the search results. If you cannot find a URL for a claim, THAT CLAIM DOES NOT EXIST. DROP IT.
    3. **STRICT ADHERENCE:** 
       - ${searchDirectives}
       - You are restricted to the provided sources context.
       - DO NOT INVENT NEWS to fill the dashboard. An empty report is better than a fake one.
    4. **DATE ACCURACY:** Ensure news is from ${targetDateIso}.
    5. **LANGUAGE:** All output text must be in PERSIAN (Farsi).

    Output format: Pure JSON only. No markdown formatting around it.
  `;

  const prompt = `
    Perform the search now.
    Date: ${targetDateIso} (${targetDateStr})
    Sources Context: ${sourcesContext}
    Topic Filter: ${topic || "General Top News"}

    Task:
    Return a JSON object with this EXACT structure. 
    
    CRITICAL: 
    - If no news is found matching the criteria, set 'topItems' to [] and 'dominantNarrative' to "موردی یافت نشد".
    - Do not make up fake headlines or stats to fill the JSON.
    - All text values MUST be in Persian (Farsi).

    {
      "date": "${targetDateStr}",
      "dominantNarrative": "عنوان اصلی‌ترین جریان خبری (یا 'موردی یافت نشد')",
      "summary": "خلاصه تحلیلی دقیق (یا توضیح اینکه خبری با این مشخصات یافت نشد)",
      "totalMonitored": 0, // Number of related items found (0 if none)
      "activeSources": ${sourcesToAnalyze.length},
      "sentimentBreakdown": [
        { "name": "مثبت", "value": 0, "color": "#10b981" },
        { "name": "خنثی", "value": 0, "color": "#64748b" },
        { "name": "منفی", "value": 0, "color": "#ef4444" }
      ],
      "sourceDistribution": [
        { "name": "خبرگزاری‌ها", "value": 0, "color": "#3b82f6" },
        { "name": "توییتر", "value": 0, "color": "#0ea5e9" },
        { "name": "اینستاگرام", "value": 0, "color": "#ec4899" }
      ],
      "detailedFlows": [
        {
          "category": "دسته بندی موضوعی",
          "icon": "Layers", 
          "summary": "خلاصه کوتاه جریان",
          "keyHeadlines": ["تیتر واقعی ۱"]
        }
      ],
      "topItems": [
        { 
          "id": "Unique ID", 
          "title": "Exact Headline from Source (Persian)", 
          "source": "Exact Source Name", 
          "type": "News" | "Twitter" | "Instagram", 
          "sentiment": "positive" | "negative" | "neutral", 
          "views": 0, 
          "shares": 0, 
          "publishTime": "HH:MM",
          "url": "THE_ACTUAL_URL_FROM_SEARCH_RESULT" 
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      }
    });

    if (response.text) {
      let cleanText = response.text.trim();
      
      cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '');
      
      const startIndex = cleanText.indexOf('{');
      const endIndex = cleanText.lastIndexOf('}');
      
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        cleanText = cleanText.substring(startIndex, endIndex + 1);
      }

      return JSON.parse(cleanText) as NarrativeReport;
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};