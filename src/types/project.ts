export type DiscoveryStep = "SETUP" | "SPEECH" | "LOGO" | "SCREENSHOTS" | "SCRIPT" | "APPROVE_SCRIPT" | "COMPLETED";

export interface ProjectAsset {
  id: string;
  type: "logo" | "screenshot" | "other";
  url: string; // base64 URL
  name: string;
  timestamp: number;
}

export interface ProjectState {
  discoveryStep: DiscoveryStep;
  hasSpeech: boolean | null;
  assets: ProjectAsset[];
  script: string | null;
  isScriptApproved: boolean;
}
