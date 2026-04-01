import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const style = searchParams.get("style") || "Minimal";

  // Mapping vibes to high-end royalty free tracks from Mixkit (Mock selection)
  const musicMap: Record<string, string> = {
    "Energetic": "https://mixkit.imgix.net/music/preview/mixkit-high-level-412.mp3",
    "Minimal": "https://mixkit.imgix.net/music/preview/mixkit-serene-view-443.mp3",
    "Elegant": "https://mixkit.imgix.net/music/preview/mixkit-tech-house-vibes-130.mp3",
    "Dark": "https://mixkit.imgix.net/music/preview/mixkit-night-out-127.mp3"
  };

  const musicUrl = musicMap[style] || musicMap["Minimal"];
  
  return NextResponse.redirect(musicUrl);
}
