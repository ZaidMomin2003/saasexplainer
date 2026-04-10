# Skill: Master Cinematic Camera

## THE PRINCIPLE: "VIRTUAL CINEMATOGRAPHY"
In high-end video production, we avoid "sliding" scenes. We treat the UI as a physical canvas. The camera has weight, inertia, and a shutter speed.

### 1. HIGH-INERTIA CAMERA LOGIC
*   **Physical Mass**: Never use `interpolate` for camera position (`x`, `y`, `z`). Always use **Spring Physics** with a stiff setting (`stiffness: 250`, `damping: 25`). This creates a magnetic "snap-and-settle" effect.
*   **The 10% Zoom-In Rule**: Every time the camera pans to a new component, it MUST zoom in or out by at least 10%. This creates a **Parallax Depth** effect.

### 2. MOTION BLUR ALGORITHM
The "High-Resolution" feel is created by **Velocity-Based Blurring**.
1.  **Velocity Tracking**: Calculate the difference in camera coordinates between the current and previous frame.
2.  **Shutter Calculation**: If `velocity > 5px/frame`, apply a **Linear CSS Blur** along the axis of movement (max 15px).
3.  **Whip-Pan Transitions**: For shifts across the dashboard, use a 0.5s "Whip-Pan" with a `radial-blur` hit on the center frame.

### 3. MASTER RULES
*   **The Floating Idle**: If the camera is not actively panning, it must have a subtle "floating" idle (`amplitude: 3px`, `frequency: 0.2Hz`) to keep the video feeling alive.
*   **Perspective Locking**: Use `rotateX` and `rotateY` (max 10°) for 3D UI shots, but always keep `perspective: 1200px` for a natural field of view.
*   **No Dead Air**: Every shot must have controlled motion. A completely static screen is the enemy of premium production.
