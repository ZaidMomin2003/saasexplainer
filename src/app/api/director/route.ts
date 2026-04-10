import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { website, screenshots = [] } = await req.json();

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("Gemini API key missing");
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    
    // Initialize latest 2.5 Pro model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      generationConfig: {
        temperature: 0.7,
      }
    });

    const systemPrompt = `
      You are an Elite SaaS Cinematic Director.
      
      MISSION:
      1. Analyze the website: "${website}".
      2. Analyze the uploaded screenshots to extract the visual "Soul" of the product:
         - Identify the EXACT primary hex color.
         - Identify the typography vibe (High-tech Sans, Brutalist, Playful, etc).
         - Identify key UI patterns (Glassmorphism, Dark Modern, Minimalist).
      3. Create a 30-second production blueprint (5 Chapters).
      
      CINEMATIC STANDARDS:
      - The "title" should be short and PUNCHY (1-3 words).
      - The "prompt" should be a LUNATIC-LEVEL cinematic instruction. Do not describe the features; describe the VISUAL MOTION, LIGHTING, and VIBE.
      
      OUTPUT:
      Return ONLY a JSON object:
      {
        "branding": {
           "primaryColor": "hex",
           "secondaryColor": "hex",
           "fontFamily": "Inter | Roboto | Outfit | etc",
           "style": "glassmorphic | minimal | dark_modern",
           "accentColor": "hex"
        },
        "scenes": [
           { "index": 0, "title": "CHAPTER TITLE", "prompt": "Visual instruction", "duration": 3 },
           { "index": 1, "title": "CHAPTER TITLE", "prompt": "Visual instruction", "duration": 4 },
           { "index": 2, "title": "CHAPTER TITLE", "prompt": "Visual instruction", "duration": 7 },
           { "index": 3, "title": "CHAPTER TITLE", "prompt": "Visual instruction", "duration": 6 },
           { "index": 4, "title": "CHAPTER TITLE", "prompt": "Visual instruction", "duration": 10 }
        ]
      }
    `;

    const imageParts = screenshots.map((base64: string) => {
      const mimeType = base64.split(';')[0].split(':')[1];
      const data = base64.split(',')[1];
      return {
        inlineData: {
          data,
          mimeType
        }
      };
    });

    const result = await model.generateContent([systemPrompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Director AI failed to produce JSON.");
    
    const blueprint = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, blueprint });

  } catch (error: any) {
    console.error("Director API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
