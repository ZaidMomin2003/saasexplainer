# Skill: Master Magnetic Interaction

## THE PRINCIPLE: "THE INVISIBLE HAND"
In a premium SaaS video, the cursor isn't a static image—it's a digital guide. It has weight, magnetism, and a "pulse" that makes the video feel reactive.

### 1. MAGNETIC CURSOR LOGIC
*   **Snap-to-Button**: When the cursor approaches within 100px of a target component, the camera and cursor coordinates "Snap" to the button's center using a `spring` with `stiffness: 200` and `damping: 15`.
*   **Natural Traversal**: Mouse movements follow **Bézier Curves** (Catmull-Rom splines) instead of straight lines. This mimics real human movement.

### 2. CLICK LIFECYCLE ALGORITHM
Every click must be a multi-stage visual event:
1.  **Stage 1 (Hover)**: As the cursor enters a button's boundaries, the button's background changes color and increases in `scale: 1.05` via a soft spring.
2.  **Stage 2 (Depress)**: At the moment of "Click," the component shrinks to `scale: 0.95` for 3 frames, then "pops" back to 1.
3.  **Stage 3 (Pulse)**: A 3-layer ripple expands from the click coordinate:
    *   **Layer 1 (White Circle)**: `opacity: 0.8`, `scale: 1` to `4`.
    *   **Layer 2 (Blur Ring)**: `blur(5px)`, `opacity: 0.4`, `scale: 1` to `6`.
    *   **Layer 3 (The Flash)**: A global brightness hit (1.2) for 2 frames.

### 3. MASTER RULES
*   **The Shadow Gap**: The cursor must have a physical `drop-shadow` that offsets based on velocity. As it moves faster, it "lifts" higher (shadow distance: 15px).
*   **State-Aware Interaction**: If the click triggers a new page or sidebar, the cursor must move out of the way or "lead" the eye to the new content.
*   **The Pulse**: Clicks should always have a 50ms vibration-style visual effect.
