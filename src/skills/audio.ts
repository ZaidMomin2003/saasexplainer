// @ts-nocheck
export default `---
title: Audio & SFX Synchronization
impact: HIGH
impactDescription: Essential for "SaaS Explainers" to sync voiceover/music with UI.
tags: audio, sfx, music, voiceover, sync
---

## Syncing Audio - Use staticFile and Audio

Always use the \`<Audio />\` component for high-performance audio synchronization. Store assets in the \`/public\` directory.

\`\`\`tsx
import { Audio, staticFile } from "remotion";

<Audio 
  src={staticFile("voiceover.mp3")} 
  startFrom={30 * 5} // Skip first 5 seconds
  volume={0.8}
/>
\`\`\`

## Sound Effects (SFX) - On Click Patterns

Trigger SFX exactly on the frame where a UI interaction (like a clicking mouse) happens.

\`\`\`tsx
const CLICK_FRAME = 45;

{frame === CLICK_FRAME && (
  <Audio src={staticFile("click.mp3")} volume={0.5} />
)}
\`\`\`

## Background Music - Loop & Fade

Ensure music doesn't drown out the voiceover. Use \`interpolate\` for smooth fades.

\`\`\`tsx
const volume = interpolate(
  frame,
  [durationInFrames - 30, durationInFrames],
  [0.2, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

<Audio src={staticFile("music.mp3")} volume={volume} loop />
\`\`\`
`;
