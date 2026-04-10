export const MUSIC_VIBES = {
  TECH_MINIMAL_1: "/music/tech_minimal_1.mp3",
  TECH_MINIMAL_2: "/music/tech_minimal_2.mp3",
  PREMIUM_LUXURY: "/music/premium_luxury.mp3",
  CORPORATE_BUSINESS: "/music/corporate_business.mp3",
  AI_PRODUCT: "/music/ai_product.mp3",
  B2B_PROFESSIONAL: "/music/b2b_professional.mp3",
  MODERN_BUSINESS: "/music/modern_business.mp3",
  PRO_STUDIO: "/music/pro_studio.mp3",
} as const;

export type MusicVibe = keyof typeof MUSIC_VIBES;
