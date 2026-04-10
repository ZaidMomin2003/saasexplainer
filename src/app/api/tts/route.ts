import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");
    const voice = searchParams.get("voice") || "aura-asteria-en";

    if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

    // Use Deepgram if API key is available
    if (DEEPGRAM_API_KEY && DEEPGRAM_API_KEY !== "") {
      const response = await fetch(
        `https://api.deepgram.com/v1/speak?model=${voice}`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${DEEPGRAM_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error(`Deepgram API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // FALLBACK: Google Search TTS (for development without API key)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.substring(0, 199))}&tl=en&client=tw-ob`;
    return NextResponse.redirect(url);

  } catch (error: any) {
    console.error("TTS Engine Error:", error);
    // Return empty silent mp3 or 204 to ensure the player NEVER crashes
    return new NextResponse(null, { status: 204 });
  }
}

