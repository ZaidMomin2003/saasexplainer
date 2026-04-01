# Skill: The Virtual Cinematic Camera

## THE PRINCIPLE
In high-end Adobe After Effects workflows, we avoid "sliding" scenes. Instead, we treat the UI as a physical landscape. The Virtual Cinematic Camera uses a "Null Object" logic: rather than moving the content, we transform a global wrapper. To achieve the "Silicon Valley" look, we employ **High-Inertia Springs**. Unlike linear tweens, springs provide natural overshoot and settling, making the camera feel like it has physical mass. When the camera "whips" between coordinates, we calculate the instantaneous velocity to apply a directional CSS blur, simulating an optical shutter.

## CODE TEMPLATE
```tsx
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

interface CameraState {
  x: number;
  y: number;
  zoom: number;
  rotateX: number;
  rotateY: number;
}

const SPRING_CONFIG = {
  stiffness: 250,
  damping: 25,
  mass: 1,
};

export const CinematicCamera: React.FC<{
  children: React.ReactNode;
  targetState: CameraState;
}> = ({ children, targetState }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // High-Inertia Movement Tracking
  const spr = (val: number) => spring({ frame, fps, config: SPRING_CONFIG, from: 0, to: val });

  const x = spr(targetState.x);
  const y = spr(targetState.y);
  const zoom = spr(targetState.zoom);
  const rx = spr(targetState.rotateX);
  const ry = spr(targetState.rotateY);

  // Velocity-Based Motion Blur Calculation
  const prevX = spring({ frame: frame - 1, fps, config: SPRING_CONFIG, from: 0, to: targetState.x });
  const velocity = Math.abs(x - prevX);
  const blur = interpolate(velocity, [0, 20], [0, 15], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', perspective: '1200px' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: `blur(${blur}px)`,
          transformOrigin: 'center center',
          transform: `
            translate3d(${x}px, ${y}px, 0) 
            scale(${zoom}) 
            rotateX(${rx}deg) 
            rotateY(${ry}deg)
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
```

## MASTER RULES
1. **Mass Over Movement**: Never use `interpolate` for camera position; always use `spring` with a stiffness ≥ 200.
2. **The 10% Zoom Rule**: Every pan must be accompanied by at least a 10% change in zoom (in or out) to maintain parallax depth.
3. **No Dead Air**: If the camera isn't actively panning, it must have a subtle "floating" idle (amplitude: 2px, frequency: 0.5Hz using `Math.sin`).
4. **Perspective Locking**: `rotateX` and `rotateY` should never exceed 15 degrees to prevent "flat cardboard" artifacts.
5. **Shutter Speed**: Max blur should never exceed 15px to keep text legible even during fast moves.
