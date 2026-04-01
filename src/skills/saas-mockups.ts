// @ts-nocheck
export default `# Skill: SaaS Mockups

Use this skill when the user wants to show an app, a website, a dashboard, or any SaaS-related screen. This skill provides a premium, MacOS-style browser window with smooth shadows and glassmorphism.

## BRANDING & COLORS
- Use semi-transparent backgrounds for the browser header (glassmorphism).
- Use subtle border-radius (12px to 24px) for the window.
- Apply a deep, soft box-shadow: \`0 30px 60px rgba(0,0,0,0.12)\`.

## COMPONENT TEMPLATE
Include this \`Browser\` component logic in your animation:

\`\`\`tsx
const Browser = ({ children, title = "SaasApp.io", width = "90%", height = "80%" }) => {
  const { width: videoWidth, height: videoHeight } = useVideoConfig();
  
  const containerStyle: React.CSSProperties = {
    width: width,
    height: height,
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 30px 60px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1)',
    border: '1px solid rgba(0,0,0,0.05)',
    margin: 'auto',
    position: 'relative',
    transform: 'perspective(1000px) rotateX(2deg)', // Subtle 3D tilt
  };

  const headerStyle: React.CSSProperties = {
    height: '40px',
    backgroundColor: '#f6f6f6',
    borderBottom: '1px solid #eeeeee',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    gap: '8px',
  };

  const dotStyle = (color: string): React.CSSProperties => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
  });

  const addressBarStyle: React.CSSProperties = {
    flex: 1,
    height: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    margin: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: '#999999',
    border: '1px solid #eeeeee',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={dotStyle('#ff5f56')} />
        <div style={dotStyle('#ffbd2e')} />
        <div style={dotStyle('#27c93f')} />
        <div style={addressBarStyle}>{title}</div>
      </div>
      <div style={{ flex: 1, position: 'relative', background: '#fcfcfc' }}>
        {children}
      </div>
    </div>
  );
};
\`\`\`

## USAGE TIPS
- Wrap your main screenshot inside the \`<Browser>\` component.
- Use \`objectFit: 'cover'\` or \`'contain'\` for the screenshot inside the browser's content area.
- Combine with \`3d.md\` for cinematic camera movements around the browser window.
- For a "Big Shot" feel, use a subtle \`rotateX\` or \`rotateY\` on the browser container.
`;
