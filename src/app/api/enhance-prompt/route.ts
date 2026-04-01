import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, audience, name } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
       return NextResponse.json({ error: "Gemini API key missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const systemPrompt = `
      You are an expert AI Director and creative copywriter for saasvideo.online.
      The user is trying to write a "Design Vision Prompt" for their new SaaS video.
      Their current raw thoughts are:
      
      Project: ${name || 'N/A'}
      Target Audience: ${audience || 'N/A'}
      Current Prompt: "${prompt}"
      
      Your job is to rewrite and ENHANCE this prompt into a highly cinematic, professional, and detailed creative direction.
      Make it sound like instructions for a high-end 3D motion graphics rendering engine.
      Focus on aesthetics, pacing, transitions, and mood (e.g., "fast-paced tech reveal with sharp dark mode aesthetics, glowing neon borders, and dynamic 3D camera pan transitions...").
      
      Keep it between 40 to 80 words. DO NOT add any conversational filler like "Here is your enhanced prompt". Just return the prompt itself.
    `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    return NextResponse.json({ enhancedPrompt: text.trim() });

  } catch (error: any) {
    console.error("Enhance Prompt Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
