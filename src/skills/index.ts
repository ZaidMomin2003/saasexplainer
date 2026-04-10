// @ts-nocheck
/**
 * SUPREME UNIFIED REGISTRY v5.0
 * One Roof, No Separation.
 * Total Skills: 50 Combined Modules + 9 Code Examples.
 */

import { examples } from "@/examples/code";

// --- UNIFIED SKILL MODULES ---
import skill3d from "./rules/3d.md";
import skillAnimations from "./rules/animations.md";
import skillAssets from "./rules/assets.md";
import skillAudioVisualization from "./rules/audio-visualization.md";
import skillAudio from "./rules/audio.md";
import skillCalculateMetadata from "./rules/calculate-metadata.md";
import skillCanDecode from "./rules/can-decode.md";
import skillCharts from "./rules/charts.md";
import skillCinematicCamera from "./rules/cinematic-camera.md";
import skillCompositions from "./rules/compositions.md";
import skillCursors from "./rules/cursors.md";
import skillDisplayCaptions from "./rules/display-captions.md";
import skillExtractFrames from "./rules/extract-frames.md";
import skillFfmpeg from "./rules/ffmpeg.md";
import skillFonts from "./rules/fonts.md";
import skillGetAudioDuration from "./rules/get-audio-duration.md";
import skillGetVideoDimensions from "./rules/get-video-dimensions.md";
import skillGetVideoDuration from "./rules/get-video-duration.md";
import skillGifs from "./rules/gifs.md";
import skillImages from "./rules/images.md";
import skillImportSrtCaptions from "./rules/import-srt-captions.md";
import skillKineticTypography from "./rules/kinetic-typography.md";
import skillLightLeaks from "./rules/light-leaks.md";
import skillLottie from "./rules/lottie.md";
import skillMagneticInteraction from "./rules/magnetic-interaction.md";
import skillMaps from "./rules/maps.md";
import skillMeasuringDomNodes from "./rules/measuring-dom-nodes.md";
import skillMeasuringText from "./rules/measuring-text.md";
import skillMessaging from "./rules/messaging.md";
import skillOfficialReference from "./rules/official-reference.md";
import skillParameters from "./rules/parameters.md";
import skillProductionAtmosphere from "./rules/production-atmosphere.md";
import skillSaasMockups from "./rules/saas-mockups.md";
import skillSequencing from "./rules/sequencing.md";
import skillSfx from "./rules/sfx.md";
import skillSilenceDetection from "./rules/silence-detection.md";
import skillSocialMedia from "./rules/social-media.md";
import skillSpringPhysics from "./rules/spring-physics.md";
import skillStoryboarding from "./rules/storyboarding.md";
import skillSubtitles from "./rules/subtitles.md";
import skillTailwind from "./rules/tailwind.md";
import skillTextAnimations from "./rules/text-animations.md";
import skillTiming from "./rules/timing.md";
import skillTranscribeCaptions from "./rules/transcribe-captions.md";
import skillTransitions from "./rules/transitions.md";
import skillTransparentVideos from "./rules/transparent-videos.md";
import skillTrimming from "./rules/trimming.md";
import skillUiReplication from "./rules/ui-replication.md";
import skillVideos from "./rules/videos.md";
import skillVoiceover from "./rules/voiceover.md";

export const SKILL_NAMES = [
  "3d",
  "animations",
  "assets",
  "audio-visualization",
  "audio",
  "calculate-metadata",
  "can-decode",
  "charts",
  "cinematic-camera",
  "compositions",
  "cursors",
  "display-captions",
  "extract-frames",
  "ffmpeg",
  "fonts",
  "get-audio-duration",
  "get-video-dimensions",
  "get-video-duration",
  "gifs",
  "images",
  "import-srt-captions",
  "kinetic-typography",
  "light-leaks",
  "lottie",
  "magnetic-interaction",
  "maps",
  "measuring-dom-nodes",
  "measuring-text",
  "messaging",
  "official-reference",
  "parameters",
  "production-atmosphere",
  "saas-mockups",
  "sequencing",
  "sfx",
  "silence-detection",
  "social-media",
  "spring-physics",
  "storyboarding",
  "subtitles",
  "tailwind",
  "text-animations",
  "timing",
  "transcribe-captions",
  "transitions",
  "transparent-videos",
  "trimming",
  "ui-replication",
  "videos",
  "voiceover",
  // Examples
  "example-histogram",
  "example-progress-bar",
  "example-text-rotation",
  "example-falling-spheres",
  "example-animated-shapes",
  "example-lottie",
  "example-gold-price-chart",
  "example-typewriter-highlight",
  "example-word-carousel",
] as const;

export type SkillName = (typeof SKILL_NAMES)[number];

const skillContentMap: Record<SkillName, string> = {
  // Unified
  "3d": skill3d,
  animations: skillAnimations,
  assets: skillAssets,
  "audio-visualization": skillAudioVisualization,
  audio: skillAudio,
  "calculate-metadata": skillCalculateMetadata,
  "can-decode": skillCanDecode,
  charts: skillCharts,
  "cinematic-camera": skillCinematicCamera,
  compositions: skillCompositions,
  cursors: skillCursors,
  "display-captions": skillDisplayCaptions,
  "extract-frames": skillExtractFrames,
  ffmpeg: skillFfmpeg,
  fonts: skillFonts,
  "get-audio-duration": skillGetAudioDuration,
  "get-video-dimensions": skillGetVideoDimensions,
  "get-video-duration": skillGetVideoDuration,
  gifs: skillGifs,
  images: skillImages,
  "import-srt-captions": skillImportSrtCaptions,
  "kinetic-typography": skillKineticTypography,
  "light-leaks": skillLightLeaks,
  lottie: skillLottie,
  "magnetic-interaction": skillMagneticInteraction,
  maps: skillMaps,
  "measuring-dom-nodes": skillMeasuringDomNodes,
  "measuring-text": skillMeasuringText,
  messaging: skillMessaging,
  "official-reference": skillOfficialReference,
  parameters: skillParameters,
  "production-atmosphere": skillProductionAtmosphere,
  "saas-mockups": skillSaasMockups,
  sequencing: skillSequencing,
  sfx: skillSfx,
  "silence-detection": skillSilenceDetection,
  "social-media": skillSocialMedia,
  "spring-physics": skillSpringPhysics,
  storyboarding: skillStoryboarding,
  subtitles: skillSubtitles,
  tailwind: skillTailwind,
  "text-animations": skillTextAnimations,
  timing: skillTiming,
  "transcribe-captions": skillTranscribeCaptions,
  transitions: skillTransitions,
  "transparent-videos": skillTransparentVideos,
  trimming: skillTrimming,
  "ui-replication": skillUiReplication,
  videos: skillVideos,
  voiceover: skillVoiceover,
};

const exampleIdMap: Record<string, string> = {
  "example-histogram": "histogram",
  "example-progress-bar": "progress-bar",
  "example-text-rotation": "text-rotation",
  "example-falling-spheres": "falling-spheres",
  "example-animated-shapes": "animated-shapes",
  "example-lottie": "lottie-animation",
  "example-gold-price-chart": "gold-price-chart",
  "example-typewriter-highlight": "typewriter-highlight",
  "example-word-carousel": "word-carousel",
};

export function getSkillContent(skillName: SkillName): string {
  if (skillName.startsWith("example-")) {
    const exampleId = exampleIdMap[skillName];
    const example = examples.find((e) => e.id === exampleId);
    if (example) {
      return `## EXAMPLE CODE: ${example.name}\n${example.description}\n\n\`\`\`tsx\n${example.code}\n\`\`\``;
    }
    return "";
  }
  return skillContentMap[skillName] || "";
}

export function getCombinedSkillContent(skills: SkillName[]): string {
  if (skills.length === 0) return "";
  return skills
    .map((skill) => getSkillContent(skill))
    .filter((c) => c && c.length > 0)
    .join("\n\n---\n\n");
}

export const SKILL_DETECTION_PROMPT = `Analyze this motion graphics prompt and identify ALL required skill modules.

## CORE FRAMEWORK (Always Detect If Applicable):
- official-reference: The source of truth for Remotion fundamentals (Composition, Sequence, interpolate, spring, tags).
- animations: Foundational Remotion animation principles.
- compositions: Scene management and architecture.

## PREMIUM CINEMATIC LAYERS (The Soul):
- ui-replication: High-fidelity UI cloning and spotlighting.
- cinematic-camera: High-inertia springs, 10% zoom rule, motion blur.
- kinetic-typography: Staggered "Bloom" reveals for headlines.
- magnetic-interaction: Cursor paths and snapping click ripples.
- production-atmosphere: Global light sweeps and glassmorphism.
- saas-mockups: Browser and MacOS window frames.
- spring-physics: Organic, bouncy movements.
- cursors: Mouse movement and hover logic.

## TECHNICAL SPECIALTIES (The Bones):
- maps: Geographical data and flyover animations.
- audio-visualization: Waveforms and music-reactive shapes.
- voiceover: TTS and audio-visual synchronization.
- display-captions: Professional subtitles and transcripts.
- charts: Data-driven animated bar/line charts.
- 3d: Three.js integration and spatial rotations.
- lottie: Lottie-JSON animations.
- tailwind: Swift styling.
- transitions: Multi-scene wipes and fades.
- sfx: Strategic audio cues (whip, click, whoosh).
- timing: Frame-precision orchestration.

Return a JSON array of matching skill names.`;
