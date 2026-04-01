import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

    if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    // Instantly stream back a high-quality free synthetic voice to prevent API credential blocking and crash-loops
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.substring(0, 199))}&tl=en&client=tw-ob`;
    
    return NextResponse.redirect(url);
  } catch (error: any) {
    console.error("TTS Engine Fallback Error:", error);
    // Return empty silent mp3 or 204 to ensure the 3D player NEVER crashes on audio failure
    return new NextResponse(null, { status: 204 });
  }
}

