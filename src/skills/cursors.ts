export default `# Skill: Cursor Animation

Use this skill when you need to simulate a user's mouse cursor moving on screen, clicking buttons, or exploring an app interface. This makes SaaS explainers feel interactive and alive.

## CURSOR STYLE
- Use a high-quality SVG or a custom \`div\` for the cursor.
- Use a "clicking" state (shrinking or color change) to signal interactions.
- Apply a subtle "shadow" to the cursor to make it float.

## CURSOR COMPONENT LOGIC
\`\`\`tsx
const Cursor = ({ x, y, isClicking = false }) => {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: '32px',
    height: '32px',
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'transform 0.15s ease-out',
    transform: \`translate(-5px, -5px) scale(${isClicking ? 0.85 : 1})\`,
  };

  return (
    <div style={containerStyle}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M7 3V26L13.8 19.2L18.4 29L22.2 27.2L17.7 17.6H26L7 3Z" fill="white" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};
\`\`\`

## MOVEMENT RULES (CRITICAL)
- **Spring Physics**: ALWAYS move the cursor using the \`spring()\` function for smooth, "ease-in-out" movement.
- **Pathing**: For complex movements, use \`interpolate()\` to define a path between (x1, y1) and (x2, y2).
- **Timing**:
    1. Mouse moves into position (15-30 frames).
    2. Subtle hover (10 frames).
    3. Click / Down state (5 frames).
    4. Button reacts (e.g., changes color or glows).
    5. Mouse moves to next target.

## USAGE EXAMPLE
\`\`\`tsx
const cursorX = spring({
  frame: frame - movementStart,
  from: 100,
  to: 800,
  fps,
  config: { damping: 12, stiffness: 80 }
});

const isClicking = frame >= clickStart && frame <= (clickStart + 10);
\`\`\`

Add a "click effect" circle at the target location to make the interaction clearer. 
Combining with \`saas-mockups.md\` ensures the cursor moves *inside* the browser window's content area.
`;
