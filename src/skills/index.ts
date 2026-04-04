// @ts-nocheck
/**
 * SUPREME SKILL REGISTRY v3.0
 * Merged from "Hollywood Production Suite" and "Claudebackend-main".
 * Total Skills: 5 Masters + 14 Experts + 9 Code Examples.
 */

import { examples } from "@/examples/code";

// MASTER SKILLS (The 5 Core Pillars)
import uiReplicationSkill from "./master-ui-replication.md";
import cinematicCameraSkill from "./master-cinematic-camera.md";
import kineticTypographySkill from "./master-kinetic-typography.md";
import magneticInteractionSkill from "./master-magnetic-interaction.md";
import productionAtmosphereSkill from "./master-production-atmosphere.md";

// EXPERT SKILLS (Domain Expertise)
import threeDSkill from "./3d.md";
import chartsSkill from "./charts.md";
import messagingSkill from "./messaging.md";
import sequencingSkill from "./sequencing.md";
import socialMediaSkill from "./social-media.md";
import springPhysicsSkill from "./spring-physics.md";
import transitionsSkill from "./transitions.md";
import typographySkill from "./typography.md";
import saasMockupsSkill from "./saas-mockups.md";
import cursorsSkill from "./cursors.md";
import storyboardingSkill from "./storyboarding.md";
import timingSkill from "./timing.md";
import fontsSkill from "./fonts.md";
import audioSkill from "./audio.md";

const MASTER_SKILLS = [
  "ui-replication",
  "cinematic-camera",
  "kinetic-typography",
  "magnetic-interaction",
  "production-atmosphere",
] as const;

const EXPERT_SKILLS = [
  "charts",
  "typography",
  "social-media",
  "messaging",
  "3d",
  "transitions",
  "sequencing",
  "spring-physics",
  "saas-mockups",
  "cursors",
  "storyboarding",
  "timing",
  "fonts",
  "audio",
] as const;

const EXAMPLE_SKILLS = [
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

export const SKILL_NAMES = [...MASTER_SKILLS, ...EXPERT_SKILLS, ...EXAMPLE_SKILLS] as const;
export type SkillName = (typeof SKILL_NAMES)[number];

const skillContentMap: Record<SkillName, string> = {
  // Masters
  "ui-replication": uiReplicationSkill,
  "cinematic-camera": cinematicCameraSkill,
  "kinetic-typography": kineticTypographySkill,
  "magnetic-interaction": magneticInteractionSkill,
  "production-atmosphere": productionAtmosphereSkill,
  
  // Experts
  charts: chartsSkill,
  typography: typographySkill,
  "social-media": socialMediaSkill,
  messaging: messagingSkill,
  "3d": threeDSkill,
  transitions: transitionsSkill,
  sequencing: sequencingSkill,
  "spring-physics": springPhysicsSkill,
  "saas-mockups": saasMockupsSkill,
  cursors: cursorsSkill,
  storyboarding: storyboardingSkill,
  timing: timingSkill,
  fonts: fontsSkill,
  audio: audioSkill,
};

const exampleIdMap: Record<(typeof EXAMPLE_SKILLS)[number], string> = {
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
  // Handle Example Skills
  if (skillName.startsWith("example-")) {
    const exampleId = exampleIdMap[skillName as (typeof EXAMPLE_SKILLS)[number]];
    const example = examples.find((e) => e.id === exampleId);
    if (example) {
      return `## EXAMPLE CODE: ${example.name}\n${example.description}\n\n\`\`\`tsx\n${example.code}\n\`\`\``;
    }
    return "";
  }

  // Handle Guidance Skills
  return skillContentMap[skillName] || "";
}

export function getCombinedSkillContent(skills: SkillName[]): string {
  if (skills.length === 0) return "";
  return skills
    .map((skill) => getSkillContent(skill))
    .filter((c) => c && c.length > 0)
    .join("\n\n---\n\n");
}

export const SKILL_DETECTION_PROMPT = `Classify this motion graphics prompt into ALL applicable categories.
A prompt can match multiple categories. Only include categories that are strictly necessary.

CORE MASTER PILLARS:
- ui-replication: Exact mirroring of screenshots, component isolation, focus-blur effects, high-fidelity UI cloning.
- cinematic-camera: Virtual camera movement, state-based panning/zooming, motion blur, inertia-based spring transitions.
- kinetic-typography: Staggered text reveals, per-character animation, narrative titles, kinetic captions.
- magnetic-interaction: Cursor logic, clicking animations, snap-to-button interactions, hover/ripple effects.
- production-atmosphere: Global lighting sweeps, glassmorphism, background particles, high-end production aesthetics.

EXPERT MODULES:
- charts: data visualizations, graphs, histograms, bar charts, statistics, metrics.
- typography: kinetic text, typewriter effects, text animations, word carousels.
- social-media: vertical video, stories, TikTok/YouTube Shorts layouts.
- messaging: chat interfaces, WhatsApp/iMessage bubbles, text message sequences.
- 3d: 3D objects, ThreeJS, spatial rotations, depth-aware scenes.
- transitions: wipes, slides, fades, multi-scene choreographies.
- sequencing: staggering element entrances, complex timings.
- spring-physics: bouncy, organic, high-inertia motion.
- saas-mockups: browser windows, MacOS desktops, app dashboard layouts.
- cursors: mouse movement, hovering, interactive demos.
- storyboarding: detailed production blueprints, scene mapping.
- audio: sound effect (SFX) cues, volume fades, music sync notes.

CODE EXAMPLES (Injects real code references):
- example-histogram, example-progress-bar, example-text-rotation, example-falling-spheres, example-animated-shapes, example-lottie, example-gold-price-chart, example-typewriter-highlight, example-word-carousel.

Return an array of matching category names. Return an empty array if none apply.`;
