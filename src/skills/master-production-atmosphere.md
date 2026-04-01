# Skill: Master Production Atmosphere

## THE PRINCIPLE: "PREMIUM ATMOSPHERE & LIGHTING"
In a high-end production, the UI doesn't sit in a void. It exists in an environment with light, depth, and glassmorphism.

### 1. GLOBAL LIGHTING LOGIC
*   **The Light Sweep**: A 45° angle linear-gradient (White, 0.4 opacity) that travels across the dashboard every 4 seconds. This creates a "sheen" for a premium look.
*   **Volumetric Bokeh**: Transparent floating particles (circles of 3 sizes) that drift in the background with a 10px blur. They follow the camera's Z-position.

### 2. GLASSMORPHISM & REFRACTION ALGORITHM
1.  **Backdrop Shimmer**: Cards must have a `backdrop-filter: blur(25px) saturate(1.5)`. This creates a refractive glass look.
2.  **Translucent Grain**: Add a 5% opacity "noise" texture to the background to ensure gradients are smooth and feel professional.
3.  **Specular Highlights**: Corners of active UI cards should have a 1px white border with 0.8 opacity on the top and left to mimic light hitting a physical edge.

### 3. MASTER RULES
*   **The 80% Lightness Rule**: Gradients should never be "muddy." Use HSL colors with 80% lightness and 60% saturation for premium "Silicon Valley" gradients.
*   **Atmospheric Bloom**: The background must have a subtle `radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0b 100%)` for deep, cinematic contrast.
*   **Dynamic Lighting**: Lighting hits must be synchronized with the camera's rotation. If rotating X, the highlight on the top edge increases.
*   **The 4K Standard**: Use high-res PNG or SVG assets. If scaling an image, never exceed 120% without applying a `blur(1px)` to hide pixelation.
