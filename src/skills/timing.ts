export default `---
title: Timing & Interpolation Primitives
impact: HIGH
impactDescription: Essential for professional, non-janky motion.
tags: timing, interpolation, easing, spring, duration
---

## Interpolation Basics - Use clamp

Always use \`extrapolateLeft: "clamp"\` and \`extrapolateRight: "clamp"\` unless you explicitly need looping or infinite motion. This prevents unintended movement before/after the animation range.

\`\`\`tsx
const opacity = interpolate(
  frame,
  [startFrame, startFrame + 10],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
\`\`\`

## Easing Curves - Match the Vibe

Use \`Easing\` for smooth, cinematic transitions. Use \`spring\` for snappy, high-energy SaaS interactions.

### Cinematic Easing (Standard)
\`\`\`tsx
import { Easing } from "remotion";

const progress = interpolate(
  frame,
  [0, 30],
  [0, 1],
  {
    easing: Easing.bezier(0.33, 1, 0.68, 1), // easeOutCubic
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  }
);
\`\`\`

### High-Energy Spring (SaaS Default)
Use \`spring\` for UI elements entering the screen.

\`\`\`tsx
import { spring } from "remotion";

const entrance = spring({
  frame,
  fps,
  config: {
    stiffness: 100,
    damping: 10,
    mass: 0.5,
  },
});
\`\`\`

## Staggered Animations - Use sequence offset

Avoid animating all elements at the exact same frame. Stagger them by 2-5 frames for a more "harmonious" feel.

\`\`\`tsx
{ITEMS.map((item, i) => (
  <Sequence from={i * 3} key={i}>
    <MyComponent />
  </Sequence>
))}
\`\`\`
`;
