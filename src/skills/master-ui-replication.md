# Skill: Master UI Replication & Spotlight Isolation

## THE PRINCIPLE: "THE SNIPER FOCUS"
This skill enables the AI to recreate a dashboard from a screenshot and isolate specific components with absolute precision. We avoid "simple" dimming. Instead, we use **Z-Axis Displacement** and **Gaussian Depth-of-Field**.

### 1. REPLICATION LOGIC
*   **Exact Mirroring**: When mirroring a screenshot, identify the exact `width`, `height`, and `borderRadius` (Standard SaaS: 12px for cards, 8px for buttons).
*   **Layer Separation**: The UI is split into two layers:
    *   **The World Layer (Background)**: The full app screenshot/render.
    *   **The Spotlight Layer (Component)**: A high-resolution clone of the *exact* target component.

### 2. ISOLATION ALGORITHM (THE "BLUR ALL EXCEPT" TECHNIQUE)
When focusing on a component:
1.  **Background Receding**: Apply `filter: blur(15px) brightness(0.4) saturate(0.8)`. This de-clutters the visual field.
2.  **Z-Space Pop**: Move the target component to `translateZ(120px)`.
3.  **Shadow Diffusion**: Apply a massive, soft shadow: `box-shadow: 0 50px 100px rgba(0,0,0,0.4)`.
4.  **Edge Glow**: Add a 2px `inner-glow` or `white-border-pulse` (opacity: 0.6) to the spotlight component to differentiate it from the blurred background.

### 3. MASTER RULES
*   **No Rough Cuts**: Use `overflow: hidden` on the isolated component box to ensure it perfectly matches the original screenshot's boundaries.
*   **Color Matching**: Use `backdrop-filter: blur(20px)` on any glassmorphic overlays to maintain the premium "Apple" aesthetic.
*   **The Soft Landing**: The component "pops" out using a `spring` with `stiffness: 150` and `damping: 20` to avoid jarring transitions.
