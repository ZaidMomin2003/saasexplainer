# Phase 05: The "Premium Polish" Roadmap 🚀

This plan focuses on transforming the SaaS video generator from a functional tool into a world-class production engine with deep professional audio, refined payments, and optimized generation speeds.

---

## 1. 🎤 Deepgram / TTS Implementation
Successfully transition from robotic fallback voices to human-grade speech.
- [ ] **Configure Environment**: Add `DEEPGRAM_API_KEY` to `.env`.
- [ ] **Upgrade TTS Route**: Rewrite `src/app/api/tts/route.ts` to use Deepgram Aura (`aura-asteria-en`).
- [ ] **Streaming Optimization**: Implement byte-streaming from Deepgram to ensure low-latency audio playback in previews.
- [ ] **Voice Variety**: Add support for multiple premium voices (e.g., Orpheus for male, Asteria for female) via a `voice` query parameter.

---

## 2. 🎵 Dynamic Sound Design (SFX & Haptics)
Incorporate auditory "weight" into the video using the official `@remotion/sfx` library.
- [ ] **Add SFX Library**: Install or link `@remotion/sfx` for direct CDN access.
- [ ] **Camera Whooshes**: Integrate `whoosh` and `whip` sounds on every camera pan in `master-cinematic-camera.md`.
- [ ] **UI Haptics**: Trigger `mouseClick` and `uiSwitch` sounds synchronized with interactive cursor events.
- [ ] **Audio Ducking**: Implement automatic music volume lowering (ducking) when the TTS voiceover is playing to ensure maximum clarity.
- [ ] **Ambient Layer**: Add "Pixabay" atmospheric wind/lo-fi background loops for a professional "Studio" vibe.

---

## 3. 💳 Strengthening Payments & Credits
Finalize the "Pay-to-Render" workflow using DodoPayments.
- [ ] **Webhook Infrastructure**: Complete the `DODOPAYMENTS_WEBHOOK_SECRET` setup to verify successful transactions.
- [ ] **Credit Persistence**: Ensure user credits are updated in Firestore immediately upon payment success.
- [ ] **Usage Guardrails**: Implement server-side checks to prevent high-res renders if a user has 0 credits.
- [ ] **Pricing UI**: Enhance the payment modal with a clear "Premium License" copy and tiered credit packages.

---

## 4. 🎨 UI/UX & Copy Polish
Modernize the Studio interface and enhance the marketing narrative.
- [ ] **Landing Page Copy**: Update hero section with "High-Fidelity" marketing copy focused on "One-Click Professional Explainers."
- [ ] **Generation Studio UI**: Refine the workspace layout to be middle-focused with a sleek red/dark theme.
- [ ] **Real-time Feedback**: Enhance the generation loading bar with "Pro" status updates (e.g., "Synthesizing Aura Voiceover...", "Applying Cinematic Camera...").
- [ ] **Error Handling**: Build a premium error state UI if the AI-generated code fails to compile, with a "Self-Heal" retry button.

---

## 5. 🛠 Master Skill Optimization
Deepen the "Five Master Skills" for even better output quality.
- [ ] **Skill Parallelization**: (DONE ✅) Parallelize Prompt Enhancement and Skill Detection calls.
- [ ] **Depth-of-Field Tuning**: Refine the `master-ui-replication.md` Gaussian blur settings for more natural "Sniper Focus" transitions.
- [ ] **Bézier Pathing**: Update `cursors.md` to ensure mouse movements follow human-like curves rather than straight lines.
- [ ] **Global Light Sweep**: Standardize the 45-degree linear gradient sweep across all browser mockups for that "Apple" sheen.

---

## TO-DO LIST (Immediate Steps)
1.  [ ] **Deepgram Integration**: Replace redirect in `api/tts/route.ts`.
2.  [ ] **SFX Mapping**: Add `whoosh.wav` to camera transitions.
3.  [ ] **Webhook validation**: Test DodoPayments success signal.
4.  [ ] **Studio UI Recap**: Clean up viewport-specific scrolling issues.
