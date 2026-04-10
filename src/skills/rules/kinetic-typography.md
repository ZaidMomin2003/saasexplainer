# Skill: Master Kinetic Typography

## THE PRINCIPLE: "NARRATIVE TEXT PERFORMANCE"
In SaaS explainer videos, text is not read; it is "performed" in sync with the visual rhythm. We avoid static labels. Every headline, subtitle, and caption is animated with **Per-Character Staggering**.

### 1. NARRATIVE REVEAL LOGIC
*   **Staggered Appearance**: Words or characters do not appear at the same time. Each character is offset by 2 frames (`frame % index * 2`).
*   **Physical Entrance**: Headlines should "glide" up from 30px below their target position, using a `spring` with `stiffness: 120` and `damping: 15`.
*   **The Bloom Reveal**: At the moment of appearance, apply a subtle **Glow/Bloom** hit (1-2px) that fades out over 5 frames.

### 2. KINETIC REVEAL ALGORITHM
1.  **Word-by-Word Isolation**: Treat each word as a separate `AbsoluteFill` or `div`.
2.  **Opacity & Blur Stagger**: Combine a `blur(5px)` with an `opacity: 0` starting state. As each character appears, the blur decreases to 0 as the opacity reaches 1.
3.  **High-Inertia Movement**: Each word should have a unique spring to create an organic, "hand-animated" feel.

### 3. MASTER RULES
*   **The 50ms Rule**: No text should appear instantly. A 50-100ms fade/reveal is the minimum for premium production.
*   **Brand Typography Alignment**: Always use **Inter**, **Roboto**, or **Outfit** for SaaS dashboards. Use `fontWeight: 600` for headlines and `400` for UI text.
*   **Narrative Rhythm Control**: Match text animation duration (max 1.5s) to the narration's cadence.
*   **Color Contrast**: Always use `white` or `#F8F9FA` text on dark overlays with a soft `drop-shadow(0 4px 8px rgba(0,0,0,0.5))` to ensure readability.
