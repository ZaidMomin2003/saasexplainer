export default `---
title: Fonts & Brand Harmony
impact: MEDIUM
impactDescription: Ensures professional typography and brand alignment.
tags: fonts, typography, brand, Google Fonts, theme
---

## Google Fonts Loading - Optimize for Remotion

Always use \`@remotion/google-fonts\` to load fonts. Load them at the top of the file to prevent layout shifts.

\`\`\`tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();
\`\`\`

## Theme Variables - Centralize for Consistency

Define theme-level constants to ensure "harmony" between scenes.

\`\`\`tsx
const FONT_FAMILY = "Inter";
const PRIMARY_COLOR = "#0066FF";
const HEADING_WEIGHT = 700;
const BODY_WEIGHT = 400;

<div 
  style={{ 
    fontFamily: FONT_FAMILY, 
    color: "#000000",
    fontWeight: BODY_WEIGHT,
  }}
>
  <h1 style={{ fontWeight: HEADING_WEIGHT }}>{title}</h1>
  <p>{description}</p>
</div>
\`\`\`

## Responsive Typography - Use Remotion scale

Scale font size based on the video's narrowest dimension (usually \`width\`) to ensure readability on all resolutions.

\`\`\`tsx
const fontSize = 48 * (width / 1920);

<div style={{ fontSize: \`${fontSize}px\` }}>
  Scaled Text
</div>
\`\`\`
`;
