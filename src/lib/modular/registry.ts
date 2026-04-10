import React from 'react';

export interface SceneDefinition {
  id: string;
  name: string;
  category: 'intro' | 'feature' | 'dashboard' | 'outro';
  description: string;
  // The code is a string that expects certain globals: React, AbsoluteFill, spring, interpolate, etc.
  code: string;
}

export const MODULAR_SCENES: SceneDefinition[] = [
  {
    id: 'intro_cinematic_zoom',
    name: 'Cinematic Zoom Intro',
    category: 'intro',
    description: 'A deep zoom into the logo with a mesh gradient background.',
    code: `
({ params }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = interpolate(frame, [0, 60], [0.8, 1], {
    extrapolateRight: "clamp",
  });
  
  const opacity = interpolate(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: params.backgroundColor || '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        transform: \`scale(\${scale})\`,
        opacity,
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: params.primaryColor || '#fff',
          fontSize: 80,
          fontWeight: 900,
          fontFamily: params.fontFamily || 'sans-serif'
        }}>
          {params.title || 'HERO TITLE'}
        </h1>
        <p style={{ color: '#aaa', fontSize: 24, marginTop: 20 }}>
          {params.subtitle || 'SUBTITLE GOES HERE'}
        </p>
      </div>
    </AbsoluteFill>
  );
}
    `
  },
  {
    id: 'dashboard_glass_float',
    name: 'Glassmorphic Dashboard',
    category: 'dashboard',
    description: 'A floating dashboard window with translucent cards.',
    code: `
({ params }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  
  const y = interpolate(frame, [0, 120], [50, 0]);
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: params.backgroundColor || '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <div style={{
          width: '80%',
          height: '70%',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: 40,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          transform: \`translateY(\${y}px)\`,
          opacity,
          padding: 60,
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: 40
        }}>
           <div style={{ background: params.primaryColor || '#6366f1', borderRadius: 20, opacity: 0.1 }} />
           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ height: 40, width: '60%', background: '#e2e8f0', borderRadius: 10 }} />
              <div style={{ height: 100, width: '100%', background: '#e2e8f0', borderRadius: 10 }} />
              <div style={{ height: 100, width: '100%', background: '#e2e8f0', borderRadius: 10 }} />
           </div>
        </div>
    </AbsoluteFill>
  );
}
    `
  }
];
