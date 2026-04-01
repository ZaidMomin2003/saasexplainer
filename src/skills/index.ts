// @ts-nocheck
/**
 * MASTER SKILL REGISTRATION v2.0
 * Optimized for "High-Inertia" SaaS Explainer Videos.
 * This registry provides the AI with its core motion graphics capabilities.
 */

import uiReplicationSkill from "./master-ui-replication.md";
import cinematicCameraSkill from "./master-cinematic-camera.md";
import kineticTypographySkill from "./master-kinetic-typography.md";
import magneticInteractionSkill from "./master-magnetic-interaction.md";
import productionAtmosphereSkill from "./master-production-atmosphere.md";

// The 5 Core Master Skills
const MASTER_SKILLS = [
  "ui-replication",
  "cinematic-camera",
  "kinetic-typography",
  "magnetic-interaction",
  "production-atmosphere",
] as const;

export const SKILL_NAMES = [...MASTER_SKILLS] as const;
export type SkillName = (typeof SKILL_NAMES)[number];

const masterSkillContent: Record<SkillName, string> = {
  "ui-replication": uiReplicationSkill,
  "cinematic-camera": cinematicCameraSkill,
  "kinetic-typography": kineticTypographySkill,
  "magnetic-interaction": magneticInteractionSkill,
  "production-atmosphere": productionAtmosphereSkill,
};

export function getSkillContent(skillName: SkillName): string {
  return masterSkillContent[skillName] || "";
}

export function getCombinedSkillContent(skills: SkillName[]): string {
  if (skills.length === 0) return "";
  return skills
    .map((skill) => getSkillContent(skill))
    .filter((c) => c.length > 0)
    .join("\n\n---\n\n");
}

export const SKILL_DETECTION_PROMPT = `Classify this motion graphics prompt into ALL applicable MASTER categories.
Only include categories that are strictly necessary for the request.

MASTER Categories:
- ui-replication: Exact mirroring of screenshots, component isolation, focus-blur effects, high-fidelity UI cloning.
- cinematic-camera: Virtual camera movement, state-based panning/zooming, motion blur, inertia-based spring transitions.
- kinetic-typography: Staggered text reveals, per-character animation, narrative titles, kinetic captions.
- magnetic-interaction: Cursor logic, clicking animations, snap-to-button interactions, hover/ripple effects.
- production-atmosphere: Global lighting sweeps, glassmorphism, background particles, high-end production aesthetics.

Return an array of the 5 master category names. Return an empty array if none apply.`;
