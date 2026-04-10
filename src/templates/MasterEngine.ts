
export const MASTER_ENGINE_TEMPLATE = `
import React, { useMemo } from 'react';
import { 
  AbsoluteFill, 
  interpolate, 
  spring, 
  useCurrentFrame, 
  useVideoConfig, 
  Sequence,
  Audio,
  staticFile,
  Easing,
  Img
} from 'remotion';

// DATA HYDRATION SLOTS
const BRANDING = /* {{BRANDING_JSON}} */;
const CHAPTERS = /* {{CHAPTER_DATA_JSON}} */;
const TOGGLES = /* {{TOGGLES_JSON}} */;

// ELITE THEME SYSTEM
const THEME = {
  primary: BRANDING.primaryColor || "#635BFF",
  secondary: BRANDING.secondaryColor || "#0A2540",
  accent: BRANDING.accentColor || "#38BDF8",
  font: BRANDING.fontFamily || "Inter, sans-serif",
  glass: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(60px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '40px',
    boxShadow: '0 80px 160px -40px rgba(0,0,0,0.5)'
  }
};

// --- CINEMATIC COMPONENTS ---

const AmbientLight = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: THEME.secondary }}>
      <div style={{
        position: 'absolute', width: '200%', height: '200%', left: '-50%', top: '-50%',
        background: \`radial-gradient(circle at 50% 50%, \${THEME.primary}33 0%, transparent 60%)\`,
        transform: \`translate(\${Math.sin(frame * 0.01) * 100}px, \${Math.cos(frame * 0.01) * 100}px)\`,
        filter: 'blur(120px)'
      }} />
      <div style={{
        position: 'absolute', width: '150%', height: '150%', right: '-25%', bottom: '-25%',
        background: \`radial-gradient(circle at 50% 50%, \${THEME.accent}22 0%, transparent 50%)\`,
        transform: \`rotate(\${frame * 0.2}deg)\`,
        filter: 'blur(80px)'
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")\`,
      }} />
    </AbsoluteFill>
  );
};

const MockBrowser = ({ children, frame, entry }) => {
  return (
    <div style={{
      ...THEME.glass,
      width: '90%', height: '80%',
      display: 'flex', flexDirection: 'column',
      transform: \`translateY(\${interpolate(entry, [0, 1], [400, 0])}px) scale(\${interpolate(entry, [0, 1], [0.8, 1])})\`,
      boxShadow: '0 100px 200px rgba(0,0,0,0.8)',
      overflow: 'hidden'
    }}>
      <div style={{ height: 60, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', px: 30, gap: 15 }}>
         <div style={{ display: 'flex', gap: 8 }}>
            {[ '#FF5F56', '#FFBD2E', '#27C93F' ].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
         </div>
         <div style={{ flex: 1, height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 10, display: 'flex', alignItems: 'center', px: 20 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>wisdomis.fun</span>
         </div>
      </div>
      <div style={{ flex: 1, position: 'relative', background: '#050505' }}>
        {children}
      </div>
    </div>
  );
};

const IntroScene = ({ frame, fps, data }) => {
  const spr = spring({ frame, fps, config: { stiffness: 100, damping: 20 } });
  const textScale = interpolate(spr, [0, 1], [0.5, 1]);
  
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', transform: \`scale(\${textScale})\` }}>
         {BRANDING.logoUrl ? (
            <img src={staticFile(BRANDING.logoUrl)} style={{ height: 140, marginBottom: 50, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }} />
         ) : (
            <div style={{ fontSize: 60, fontWeight: 900, color: THEME.primary, marginBottom: 40, letterSpacing: -2 }}>LOGO</div>
         )}
         <h1 style={{ fontSize: 130, fontWeight: 900, color: 'white', letterSpacing: -6, margin: 0, textShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
           {data.title}
         </h1>
         <div style={{ height: 6, width: 200, background: THEME.primary, margin: '40px auto', borderRadius: 100 }} />
         <p style={{ fontSize: 42, color: 'white', opacity: 0.6, fontWeight: 700 }}>{data.prompt}</p>
      </div>
    </AbsoluteFill>
  );
};

const FeatureScene = ({ frame, fps, data }) => {
  const entry = spring({ frame, fps, config: { stiffness: 80, damping: 20 } });
  const float = Math.sin(frame * 0.05) * 15;
  
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
       <MockBrowser entry={entry} frame={frame}>
          <div style={{ padding: 80, height: '100%', display: 'flex', gap: 60 }}>
             <div style={{ flex: 1.2, transform: \`translateY(\${float}px)\` }}>
                <div style={{ width: '100%', height: '100%', background: \`linear-gradient(45deg, \${THEME.primary}44, \${THEME.accent}44)\`, borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)' }} />
             </div>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ fontSize: 72, fontWeight: 900, color: 'white', letterSpacing: -3 }}>{data.title}</h2>
                <div style={{ height: 4, width: 80, background: THEME.primary, margin: '30px 0' }} />
                <p style={{ fontSize: 32, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, fontWeight: 600 }}>{data.prompt}</p>
             </div>
          </div>
       </MockBrowser>
    </AbsoluteFill>
  );
};

const CTAScene = ({ frame, fps, data }) => {
  const spr = spring({ frame, fps, config: { stiffness: 200, damping: 10 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
       <div style={{ textAlign: 'center', transform: \`scale(\${spr})\` }}>
          <h1 style={{ fontSize: 110, fontWeight: 900, color: 'white', marginBottom: 40, letterSpacing: -5 }}>{data.title}</h1>
          <p style={{ fontSize: 36, color: 'rgba(255,255,255,0.5)', maxWidth: 800, margin: '0 auto 80px', fontWeight: 600 }}>{data.prompt}</p>
          <div style={{
            padding: '35px 90px', borderRadius: 100,
            background: \`linear-gradient(90deg, \${THEME.primary}, \${THEME.accent})\`,
            color: 'white', fontSize: 42, fontWeight: 900,
            boxShadow: \`0 40px 80px \${THEME.primary}66\`,
            textTransform: 'uppercase', letterSpacing: 2
          }}>
            Forge Your Destiny
          </div>
       </div>
    </AbsoluteFill>
  );
};

export const Production = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const T = {
    c1: 3 * fps,
    c2: (3+4) * fps,
    c3: (3+4+7) * fps,
    c4: (3+4+7+6) * fps,
    c5: (3+4+7+6+10) * fps,
  };

  return (
    <AbsoluteFill style={{ fontFamily: THEME.font, backgroundColor: '#000' }}>
      <AmbientLight />
      
      <Sequence from={0} durationInFrames={T.c1}>
        <IntroScene frame={frame} fps={fps} data={CHAPTERS[0]} />
      </Sequence>

      <Sequence from={T.c1} durationInFrames={T.c2 - T.c1}>
        <FeatureScene frame={frame - T.c1} fps={fps} data={CHAPTERS[1]} />
      </Sequence>

      <Sequence from={T.c2} durationInFrames={T.c3 - T.c2}>
        <FeatureScene frame={frame - T.c2} fps={fps} data={CHAPTERS[2]} />
      </Sequence>

      <Sequence from={T.c3} durationInFrames={T.c4 - T.c3}>
        <FeatureScene frame={frame - T.c3} fps={fps} data={CHAPTERS[3]} />
      </Sequence>

      <Sequence from={T.c4} durationInFrames={T.c5 - T.c4}>
        <CTAScene frame={frame - T.c4} fps={fps} data={CHAPTERS[4]} />
      </Sequence>
      
      {TOGGLES.includeMusic && <Audio src={staticFile("bg-music.mp3")} volume={0.6} />}
      
    </AbsoluteFill>
  );
};
`;
