export const MODELS = [
  { id: "claude-sonnet-4-6-20251101-v1:0:none", name: "Claude Sonnet 4.6" },
  { id: "claude-sonnet-4-6-20251101-v1:0:low", name: "Claude 4.6 (Low Reasoning)" },
  { id: "claude-sonnet-4-6-20251101-v1:0:medium", name: "Claude 4.6 (Med Reasoning)" },
  { id: "claude-sonnet-4-6-20251101-v1:0:high", name: "Claude 4.6 (High Reasoning)" },
] as const;

export type ModelId = (typeof MODELS)[number]["id"];

export type StreamPhase = "idle" | "reasoning" | "generating";

export type GenerationErrorType = "validation" | "api";
