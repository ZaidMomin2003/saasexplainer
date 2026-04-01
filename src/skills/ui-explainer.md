# Skill: UI Highlight & Component Cloning

## THE PRINCIPLE
This skill mimics the "Pre-comp Isolation" technique in After Effects. When a feature is highlighted, the background is not just dimmed—it is pushed back in Z-space and Gaussian blurred. The "Target Component" is effectively cloned into a "Spotlight Layer." We use Z-Axis Displacement to create a 3D shadow hierarchy, ensuring the user's eye is physically pulled toward the interaction point. This is the difference between a "tutorial" and a "product film."

## CODE TEMPLATE
```tsx
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

const FOCUS_SPRING = { stiffness: 150, damping: 20 };

export const UIHighlight: React.FC<{
  children: React.ReactNode;
  isFocused: boolean;
  highlightBox: { x: number; y: number; w: number; h: number };
}> = ({ children, isFocused, highlightBox }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: FOCUS_SPRING,
    from: 0,
    to: isFocused ? 1 : 0,
  });

  // Background receding logic
  const bgScale = interpolate(progress, [0, 1], [1, 0.95]);
  const bgBlur = interpolate(progress, [0, 1], [0, 10]);
  const bgOpacity = interpolate(progress, [0, 1], [1, 0.4]);

  // Component "Pop" logic
  const translateZ = interpolate(progress, [0, 1], [0, 100]);
  const shadowOpacity = interpolate(progress, [0, 1], [0, 0.5]);

  return (
    <AbsoluteFill>
      {/* Background Layer (The main dashboard) */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        filter: `blur(${bgBlur}px)`,
        opacity: bgOpacity,
        transform: `scale(${bgScale})`,
      }}>
        {children}
      </div>

      {/* Spotlight Layer (The high-res isolated clone) */}
      {isFocused && (
        <div style={{
          position: 'absolute',
          top: highlightBox.y,
          left: highlightBox.x,
          width: highlightBox.w,
          height: highlightBox.h,
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: `0 30px 60px rgba(0,0,0,${shadowOpacity})`,
          transform: `translateZ(${translateZ}px)`,
          zIndex: 10,
        }}>
          {/* Sub-container that shifts the full dashboard image into position */}
          <div style={{
            position: 'absolute',
            top: -highlightBox.y,
            left: -highlightBox.x,
            width: '100%', 
            height: '100%',
          }}>
            {children}
          </div>
          {/* Pulse Glow Effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: '12px',
            opacity: Math.sin(frame / 5) * 0.3 + 0.5,
          }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
```

## MASTER RULES
1. **Z-Space Hierarchy**: The isolated component must have a `translateZ` value between 50px and 150px.
2. **Edge Softness**: Always apply a `borderRadius` (8px–16px) to isolated clones to mimic modern UI aesthetics.
3. **The Shadow Lag**: The shadow should expand slightly slower than the component rises (using a separate `spring` if needed) to simulate light distance.
4. **Contextual Dimming**: Use a dark navy or deep charcoal overlay (`#0a0a0b`) instead of pure black for a more premium, "Apple-style" dimming effect.
5. **No Clipping Errors**: Ensure `overflow: 'hidden'` is applied correctly to the isolated box so it doesn't leak parts of the image it shouldn't show.
