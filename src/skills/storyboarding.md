# Skill: Storyboarding

Use this skill when a `storyboard` JSON array is provided in the request. This skill allows for frame-accurate, second-by-second control over the entire animation.

## STORYBOARD STRUCTURE
The storyboard is an array of scenes:
```json
[
  {
    "label": "Intro",
    "start": 0,
    "end": 3,
    "logic": "Kinetic typography with logo reveal",
    "asset": "LOGO"
  },
  {
    "label": "Dashboard",
    "start": 3,
    "end": 8,
    "logic": "Browser mockup with cursor click",
    "asset": "IMAGE_1"
  }
]
```

## IMPLEMENTATION RULES

### 1. Fixed Timestamps
- Convert seconds to frames using: `const startFrame = Math.round(startSeconds * fps);`
- Use `<Sequence />` for each storyboard item:
```tsx
<Sequence from={startFrame} durationInFrames={durationFrames}>
  <SceneComponent />
</Sequence>
```

### 2. Scene-Relative Frames
Inside each scene, calculate the local progress to ensure animations are perfectly timed:
```tsx
const sceneFrame = frame - startFrame;
const sceneProgress = interpolate(sceneFrame, [0, durationFrames], [0, 1]);
```

### 3. Asset Mapping (CRITICAL)
- **`LOGO`**: Refer to the primary brand logo.
- **`IMAGE_1`, `IMAGE_2`, etc.**: Refer to user-uploaded screenshots in the order they were provided.
- Ensure the AI uses the correct asset as directed in the `asset` field of the storyboard.

## DIRECTIVE
When a storyboard is provided, it takes **precedence** over the general user prompt. You MUST strictly follow the scene-by-scene logic and timestamps defined in the storyboard.

## EXAMPLE CODE
```tsx
// For a scene starting at 2s and ending at 5s (at 30fps)
// startFrame = 60, durationInFrames = 90
<Sequence from={60} durationInFrames={90}>
   <AbsoluteFill>
     {/* Scene logic here */}
   </AbsoluteFill>
</Sequence>
```
Combining with `saas-mockups.md` and `cursors.md` ensures that each storyboard segment has professional-grade visuals.
