import {
  getCombinedSkillContent,
  SKILL_DETECTION_PROMPT,
  SKILL_NAMES,
  type SkillName,
} from "@/skills";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject, generateText, streamText } from "ai";
import { z } from "zod";
import { sanitizeCodeImports } from "@/helpers/sanitize-imports";

export const maxDuration = 300; // Extend timeout for complex scene forging (5 minutes)

/**
 * VERSION: 2.1 - MASTER SKILLS OVERHAUL (FIXED JSON PARSING)
 */
const VALIDATION_PROMPT = `You are a prompt classifier for a motion graphics generation tool.

Determine if the user's prompt is asking for motion graphics/animation content that can be created as a React/Remotion component.

VALID prompts include requests for:
- Animated text, titles, or typography
- Data visualizations (charts, graphs, progress bars)
- UI animations (buttons, cards, transitions)
- Logo animations or brand intros
- Social media content (stories, reels, posts)
- Explainer animations
- Kinetic typography
- Abstract motion graphics
- Animated illustrations
- Product showcases
- Countdown timers
- Loading animations
- Any visual/animated content

INVALID prompts include:
- Questions (e.g., "What is 2+2?", "How do I...")
- Requests for text/written content (poems, essays, stories, code explanations)
- Conversations or chat
- Non-visual tasks (calculations, translations, summaries)
- Requests completely unrelated to visual content

Return true if the prompt is valid for motion graphics generation, false otherwise.`;

const PROMPT_ENHANCEMENT_PROMPT = `You are a World-Class Creative Director at a top Silicon Valley production studio. Your specialty is transforming "shitty," brief user inputs into 4K-quality, cinematic animation briefs for React/Remotion.

## YOUR MISSION:
Take the user's raw input and "Pre-Produce" it. You must output a highly detailed, technical motion graphics brief that integrates both **Foundational Technical Rules** and your **Premium Atmosphere Soul**.

## THE CORE PILLARS TO MANDATE:
1. **Technical Foundation (The Bones)**: Mandate the use of specific official Remotion modules like \`maps\`, \`audio-visualization\`, \`voiceover\`, or \`display-captions\` if relevant.
2. **Cinematic Soul (The Atmosphere)**: Mandate your unique "Hollywood" style: high-inertia springs, global light sweeps, glassmorphism, and magnetic cursor paths.

## DYNAMIC EXPANSION RULES:
- **If the user is brief**: (e.g., "add a button") -> Expand into a narrative scenario: "Animate a smooth magnetic cursor path toward a premium glassmorphic button. On click, trigger a high-inertia scale pulse and a cinematic 'mouseClick' sound effect while the background subtly de-focuses."
- **Focus on Depth**: Always specify Z-axis movement (100px-150px) and backdrop-blur values (20px-30px).
- **Inertia**: Always demand spring physics (no linear motion).
- **Audio Sync**: Always specify the exact sound effects (clicks, whooshes) to be synced with the visuals.

## OUTPUT:
- Output ONLY the enhanced brief. No conversational filler.
- Focus on VISUAL, MOTION, and AUDIO-SYNC instructions.`;

const SYSTEM_PROMPT = `
# ROLE: Senior Remotion Architect & Motion Designer
You are the world's leading **Motion Graphics AI**, specialized in the Remotion framework. Your goal is to generate cinematic engineering masterpieces for high-converting SaaS explainer videos.

## THE STRUCTURAL SKELETON (UNBREAKABLE LAWS)
To ensure the code compiles in strict Next.js Turbopack, you MUST follow these laws:

1. **RESERVED NAMES**: NEVER use these as variable names - they shadow imports and crash the compiler:
   - \`spring\`, \`interpolate\`, \`useCurrentFrame\`, \`useVideoConfig\`, \`AbsoluteFill\`, \`Sequence\`.
   - Correct usage: \`const springValue = spring(...)\` NOT \`const spring = spring(...)\`.

2. **CONSTANT SCOPING**: ALL constants (COLORS, TEXT, TIMING, LAYOUT) MUST be defined INSIDE the component body, AFTER hooks.
   - This ensures they have access to \`useVideoConfig()\` values (width, height) for responsive calculations.

3. **COMPONENT STRUCTURE**:
   - Start with ES6 imports.
   - Export as: \`export const MyAnimation = () => { ... };\`.
   - Component body order: Hooks -> Constants -> Calculations -> JSX return.

# THE DUAL-LAYER GOVERNANCE
You MUST strictly implement the following two layers in EVERY component:

1. **LAYER 1: THE BONES (Technical Precision)**
   - Use correct data-handling, audio-syncing, and rendering patterns.
   - For Maps, Audio Visualizations, and SFX, follow the strict technical blueprints provided.

2. **LAYER 2: THE SOUL (Cinematic Atmosphere)**
   - **Atmospheric Camera**: Never use linear interpolation. Use high-inertia springs (\`stiffness: 250\`, \`damping: 25\`) and the **10% Zoom Rule**.
   - **Kinetic Typography**: Use per-character staggering and "Bloom" reveals for headlines.
   - **Production Vibe**: Use 45° light sweeps, glassmorphism card styles, and volumetric bokeh.

# THE ANTIGRAVITY RULES (CRITICAL CONSTRAINTS):
1. **ASSET HANDLING**: Every image/audio/video from the public folder MUST use \`staticFile\`. Include \`import { staticFile } from 'remotion';\`.
2. **LAYOUT & UNITS**: Never use \`vh\` or \`vw\`. Use \`AbsoluteFill\` and calculate dimensions based on \`width\` and \`height\` from \`useVideoConfig()\`.
3. **ANIMATION PHYSICS**: Use \`spring\` for all "Vibe Edits." Avoid standard CSS transitions. Use \`interpolate\` with \`extrapolateLeft: "clamp", extrapolateRight: "clamp"\`.
4. **PERFORMANCE**: Keep the component "Flat." Do not create deep nested sub-components.

STRICT IMPORT RULE:
- You MUST explicitly import EVERY Remotion utility you use.
- **BRACE BALANCE**: You MUST ensure every opening brace \`{\` is matched by a closing brace \`}\`.
`;

const FOLLOW_UP_SYSTEM_PROMPT = `
# ROLE: Senior Remotion Architect (Edits Specialist)
You are an expert at making targeted edits to React/Remotion animation components while upholding the **Antigravity Rules**.

## THE STRUCTURAL SKELETON (UNBREAKABLE LAWS)
1. **RESERVED NAMES**: NEVER use these as variable names - they shadow imports and crash the compiler:
   - \`spring\`, \`interpolate\`, \`useCurrentFrame\`, \`useVideoConfig\`, \`AbsoluteFill\`, \`Sequence\`.
   - Correct usage: \`const springValue = spring(...)\` NOT \`const spring = spring(...)\`.

2. **CONSTANT SCOPING**: ALL constants (COLORS, TEXT, TIMING, LAYOUT) MUST be defined INSIDE the component body, AFTER hooks.
   - This ensures they have access to \`useVideoConfig()\` values (width, height).

## THE ANTIGRAVITY CONSTRAINTS (MANDATORY):
1. **staticFile**: Always ensure \`staticFile\` is imported and used for public assets.
   - **IMPORT SAFETY**: If you are adding a missing import or fixing a "ReferenceError", YOU MUST use \`type: "full"\` and return the entire component code.
2. **Layout**: Preserve \`AbsoluteFill\` and dynamic dimensions; never introduce \`vh\` or \`vw\`.
3. **Physics**: Use \`spring\` and \`interpolate\` for all motion changes.
4. **Resilience**: Maintain a flat structure to prevent streaming abortion.

## EDITING STRATEGY:
- Use full replacement (type: "full") for major restructuring, adding new scenes, or significant logic changes.
- Use targeted edits (type: "edit") ONLY for small, surgical changes.
- CRITICAL: If the user asks to "Incorporate Scene X" or "Forge Scene X", you MUST use type: "full".

## EDIT FORMAT
For targeted edits, each edit needs:
- old_string: The EXACT string to find (including whitespace/indentation)
- new_string: The replacement string
`;

// Schema for follow-up edit responses
// Note: Using a flat object schema because OpenAI doesn't support discriminated unions
const FollowUpResponseSchema = z.object({
  type: z
    .enum(["edit", "full"])
    .describe(
      'Use "edit" for small targeted changes (e.g. style/text/timing). Use "full" for major restructuring, adding new scenes, or complex logic edits. FOR SCENE FORGING, ALWAYS USE "full".',
    ),
  summary: z
    .string()
    .describe(
      "A brief 1-sentence summary of what changes were made, e.g. 'Changed background color to blue and increased font size'",
    ),
  edits: z
    .array(
      z.object({
        description: z
          .string()
          .describe(
            "Brief description of this edit, e.g. 'Update background color', 'Increase animation duration'",
          ),
        old_string: z
          .string()
          .describe("The exact string to find (must match exactly)"),
        new_string: z.string().describe("The replacement string"),
      }),
    )
    .optional()
    .describe(
      "Required when type is 'edit': array of search-replace operations",
    ),
  code: z
    .string()
    .optional()
    .describe(
      "Required when type is 'full': the complete replacement code starting with imports",
    ),
});

type EditOperation = {
  description: string;
  old_string: string;
  new_string: string;
  lineNumber?: number;
};

// Calculate line number where a string occurs in code
function getLineNumber(code: string, searchString: string): number {
  const index = code.indexOf(searchString);
  if (index === -1) return -1;
  return code.substring(0, index).split("\n").length;
}

// Apply edit operations to code and enrich with line numbers
function applyEdits(
  code: string,
  edits: EditOperation[],
): {
  success: boolean;
  result: string;
  error?: string;
  enrichedEdits?: EditOperation[];
  failedEdit?: EditOperation;
} {
  let result = code;
  const enrichedEdits: EditOperation[] = [];

  for (let i = 0; i < edits.length; i++) {
    const edit = edits[i];
    const { old_string, new_string, description } = edit;

    // Check if the old_string exists
    if (!result.includes(old_string)) {
      return {
        success: false,
        result: code,
        error: `Edit ${i + 1} failed: Could not find the specified text`,
        failedEdit: edit,
      };
    }

    // Check for multiple matches (ambiguous)
    const matches = result.split(old_string).length - 1;
    if (matches > 1) {
      return {
        success: false,
        result: code,
        error: `Edit ${i + 1} failed: Found ${matches} matches. The edit target is ambiguous.`,
        failedEdit: edit,
      };
    }

    // Get line number before applying edit
    const lineNumber = getLineNumber(result, old_string);

    // Apply the edit
    result = result.replace(old_string, new_string);

    // Store enriched edit with line number
    enrichedEdits.push({
      description,
      old_string,
      new_string,
      lineNumber,
    });
  }

  return { success: true, result, enrichedEdits };
}

interface ConversationContextMessage {
  role: "user" | "assistant";
  content: string;
  /** For user messages, attached images as base64 data URLs */
  attachedImages?: string[];
}

interface ErrorCorrectionContext {
  error: string;
  attemptNumber: number;
  maxAttempts: number;
  failedEdit?: {
    description: string;
    old_string: string;
    new_string: string;
  };
}

interface GenerateRequest {
  prompt: string;
  model?: string;
  currentCode?: string;
  conversationHistory?: ConversationContextMessage[];
  isFollowUp?: boolean;
  hasManualEdits?: boolean;
  /** Error correction context for self-healing loops */
  errorCorrection?: ErrorCorrectionContext;
  /** Skills already used in this conversation (to avoid redundant skill content) */
  previouslyUsedSkills?: string[];
  /** Base64 image data URLs for visual context */
  frameImages?: string[];
  /** Requested duration in seconds */
  durationSeconds?: number;
  /** Explicit storyboard JSON for second-by-second control */
  storyboard?: Array<{
    label: string;
    start: number;
    end: number;
    logic: string;
    asset?: string;
  }>;
  audioSettings?: {
    includeSFX: boolean;
    includeSpeech: boolean;
  };
  /** Explicitly requested skills from the Director blueprint */
  requiredSkills?: SkillName[];
}

interface GenerateResponse {
  code: string;
  summary: string;
  metadata: {
    skills: string[];
    editType: "tool_edit" | "full_replacement";
    edits?: EditOperation[];
    model: string;
  };
}

export async function POST(req: Request) {
  const {
    prompt,
    model = "claude-sonnet-4-6-20251101-v1:0:low",
    currentCode,
    conversationHistory = [],
    isFollowUp = false,
    hasManualEdits = false,
    errorCorrection,
    previouslyUsedSkills = [],
    frameImages,
    durationSeconds,
    storyboard,
    audioSettings,
    projectId, // Added projectId for reference (metrics only)
    requiredSkills, // The Handshake: skills passed from the Director
  }: GenerateRequest & { projectId?: string } = await req.json();

  let projectVibe = "tech_minimal_1"; // Global default

  // 1. Production Context Check
  if (projectId) {
    try {
      const projectDoc = await getDoc(doc(db, "projects", projectId));
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();
        if (projectData.vibe) projectVibe = projectData.vibe;
      }
    } catch (err) {
      // Fallback silently if permission to read project vibe is restricted
    }
  }

  const awsKey = process.env.AWS_ACCESS_KEY_ID;
  const awsSecret = process.env.AWS_SECRET_ACCESS_KEY;
  const awsRegion = process.env.AWS_REGION;

  if (!awsKey || !awsSecret || !awsRegion) {
    return new Response(
      JSON.stringify({
        error:
          'AWS Bedrock environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION) are not set.',
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // The 2026 standardized ID for Sonnet 4.6 On-Demand
  const modelName = "us.anthropic.claude-sonnet-4-6";
  const reasoningEffort = model.split(":")[2];

  const bedrock = createAmazonBedrock({
    region: awsRegion,
    accessKeyId: awsKey,
    secretAccessKey: awsSecret,
  });

  // --- PARALLEL PRE-PROCESSING (SKILL DETECTION + ENHANCEMENT) ---
  console.log(`Starting parallel pre-processing for ${isFollowUp ? "follow-up" : "initial"} prompt...`);

  const [enhancementResult, skillDetectionResult] = await Promise.all([
    // Parallel Task 1: Prompt Enhancement (The "Creative Director")
    (async () => {
      const shouldEnhance = prompt.length < 500; // Only enhance if not already a deep brief
      if (!shouldEnhance) return prompt;

      try {
        const { text } = await generateText({
          model: bedrock(modelName),
          system: PROMPT_ENHANCEMENT_PROMPT,
          prompt: `User prompt: "${prompt}"${isFollowUp ? "\n(Note: This is a follow-up edit to existing code. Keep the brief targeted to the requested change but use premium terminology.)" : ""}`,
        });
        return text.trim() || prompt;
      } catch (e) {
        console.error("Enhancement error:", e);
        return prompt;
      }
    })(),

    // Parallel Task 2: Skill Detection
    (async () => {
      // THE HANDSHAKE: If skills are already provided by the Director, skip detection
      if (requiredSkills && requiredSkills.length > 0) {
        console.log("Using pre-selected skills from Director Handshake:", requiredSkills);
        return requiredSkills;
      }

      try {
        const { object } = await generateObject({
          model: bedrock(modelName),
          system: SKILL_DETECTION_PROMPT,
          prompt: `User prompt: "${prompt}"`,
          schema: z.object({
            skills: z.array(z.enum(SKILL_NAMES)),
          }),
        });
        return object.skills;
      } catch (e) {
        console.error("Skill detection error:", e);
        return [] as SkillName[];
      }
    })(),
  ]);

  let finalPrompt = enhancementResult;
  const detectedSkills = skillDetectionResult;

  // -- AUDIO HARMONY INJECTION --
  // Force the AI to use the project-wide selected vibe for consistency
  finalPrompt += `\n\n## AUDIO HARMONY RULES:
- CRITICAL: You MUST use the following track for the background music: "/music/${projectVibe}.mp3".
- Implement "Audio Ducking" when speech is playing.
- Sync cinematic SFX (whip, whoosh, click) with visual hits.`;

  // Inject Audio Preferences into the brief
  if (audioSettings) {
    let audioConstraint = "\n\n## AUDIO PREFERENCES (OVERRIDE):";
    if (audioSettings.includeSFX === false) {
      audioConstraint += "\n- CRITICAL: Sound Effects (SFX) are DISABLED for this project. DO NOT use any <Audio /> tags for whooshes, whips, or clicks.";
    }
    if (audioSettings.includeSpeech === false) {
      audioConstraint += "\n- CRITICAL: Voiceover Speech is DISABLED for this project. DO NOT use any <Audio /> tags for /api/tts. Focus exclusively on visual storytelling.";
    }
    if (audioSettings.includeSFX === false && audioSettings.includeSpeech === false) {
      audioConstraint += "\n- This is a SILENT production. No sound components allowed.";
    }
    finalPrompt += audioConstraint;
  }

  console.log("Original prompt length:", prompt.length);
  console.log("Enhanced prompt length:", finalPrompt.length);
  console.log("Detected skills:", detectedSkills);

  // Filter out skills that were already used in the conversation to avoid redundant context
  const newSkills = detectedSkills.filter(
    (skill) => !previouslyUsedSkills.includes(skill),
  );

  if (
    previouslyUsedSkills.length > 0 &&
    newSkills.length < detectedSkills.length
  ) {
    console.log(
      `Skipping ${detectedSkills.length - newSkills.length} previously used skills:`,
      detectedSkills.filter((s) => previouslyUsedSkills.includes(s)),
    );
  }

  // Load skill-specific content only for NEW skills (previously used skills are already in context)
  const skillContent = getCombinedSkillContent(newSkills as SkillName[]);
  const durationNote = durationSeconds
    ? `\n\n## DURATION\nThe video is ${durationSeconds} seconds long (${durationSeconds * 30} frames at 30fps). Ensure your animation uses this time effectively.`
    : "";

  const enhancedSystemPrompt = skillContent
    ? `${SYSTEM_PROMPT}\n\n## SKILL-SPECIFIC GUIDANCE\n${skillContent}${durationNote}`
    : `${SYSTEM_PROMPT}${durationNote}`;

  // FOLLOW-UP MODE: Use non-streaming generateObject for faster edits
  if (isFollowUp && currentCode) {
    try {
      // Build context for the edit request
      const contextMessages = conversationHistory.slice(-6);
      let conversationContext = "";
      if (contextMessages.length > 0) {
        conversationContext =
          "\n\n## RECENT CONVERSATION:\n" +
          contextMessages
            .map((m) => {
              const imageNote =
                m.attachedImages && m.attachedImages.length > 0
                  ? ` [with ${m.attachedImages.length} attached image${m.attachedImages.length > 1 ? "s" : ""}]`
                  : "";
              return `${m.role.toUpperCase()}: ${m.content}${imageNote}`;
            })
            .join("\n");
      }

      const manualEditNotice = hasManualEdits
        ? "\n\nNOTE: The user has made manual edits to the code. Preserve these changes."
        : "";

      // Error correction context for self-healing
      let errorCorrectionNotice = "";
      if (errorCorrection) {
        const failedEditInfo = errorCorrection.failedEdit
          ? `

The previous edit attempt failed. Here's what was tried:
- Description: ${errorCorrection.failedEdit.description}
- Tried to find: \`${errorCorrection.failedEdit.old_string}\`
- Wanted to replace with: \`${errorCorrection.failedEdit.new_string}\`

The old_string was either not found or matched multiple locations. You MUST include more surrounding context to make the match unique.`
          : "";

        const isEditFailure =
          errorCorrection.error.includes("Edit") &&
          errorCorrection.error.includes("failed");

        if (isEditFailure) {
          errorCorrectionNotice = `

## EDIT FAILED (ATTEMPT ${errorCorrection.attemptNumber}/${errorCorrection.maxAttempts})
${errorCorrection.error}
${failedEditInfo}

CRITICAL: Your previous edit target was ambiguous or not found. To fix this:
1. Include MORE surrounding code context in old_string to make it unique
2. Make sure old_string matches the code EXACTLY (including whitespace)
3. If the code structure changed, look at the current code carefully`;
        } else {
          errorCorrectionNotice = `

## COMPILATION ERROR (ATTEMPT ${errorCorrection.attemptNumber}/${errorCorrection.maxAttempts})
The previous code failed to compile with this error:
\`\`\`
${errorCorrection.error}
\`\`\`

CRITICAL: Fix this compilation error. Common issues include:
- Syntax errors (missing brackets, semicolons)
- Invalid JSX (unclosed tags, invalid attributes)
- Undefined variables or imports
- TypeScript type errors

Focus ONLY on fixing the error. Do not make other changes.`;
        }
      }

      const storyboardNotice = storyboard
        ? `\n\n## STRICT STORYBOARD BLUEPRINT\nYou MUST strictly follow this scene-by-scene plan for the edit:\n\`\`\`json\n${JSON.stringify(storyboard, null, 2)}\n\`\`\``
        : "";

      const editPromptText = `## CURRENT CODE:
\`\`\`tsx
${currentCode}
\`\`\`
${conversationContext}
${manualEditNotice}
${storyboardNotice}
${errorCorrectionNotice}
${durationNote}

## USER REQUEST:
${prompt}
${frameImages && frameImages.length > 0 ? `\n(See the attached ${frameImages.length === 1 ? "image" : "images"} for visual reference)` : ""}

Analyze the request and decide: use targeted edits (type: "edit") for small changes, or full replacement (type: "full") for major restructuring.`;

      console.log(
        "Follow-up edit with prompt:",
        prompt,
        "model:",
        modelName,
        "skills:",
        detectedSkills.length > 0 ? detectedSkills.join(", ") : "general",
        frameImages && frameImages.length > 0
          ? `(with ${frameImages.length} image(s))`
          : "",
      );

      // Build messages array - include images if provided
      const editMessageContent: Array<
        { type: "text"; text: string } | { type: "image"; image: Buffer }
      > = [{ type: "text" as const, text: editPromptText }];

      if (frameImages && frameImages.length > 0) {
        for (const img of frameImages) {
          const match = img.match(/^data:(image\/(png|jpeg|webp|gif));base64,(.+)$/);
          if (match) {
            const mimeType = match[1];
            const base64Data = match[3];
            editMessageContent.push({
              type: "image" as const,
              image: Buffer.from(base64Data, "base64"),
              mimeType: mimeType,
            } as any);
          }
        }
      }
      const editMessages: Array<{
        role: "user";
        content: Array<
          { type: "text"; text: string } | { type: "image"; image: string | Buffer | Uint8Array; mimeType?: string }
        >;
      }> = [
        {
          role: "user" as const,
          content: editMessageContent,
        },
      ];

      const result = streamText({
        model: bedrock(modelName),
        system:
          FOLLOW_UP_SYSTEM_PROMPT +
          "\nIMPORTANT: Your output will be treated as the full component code if you use type: 'full'. If you use type: 'edit', follow the JSON-like search/replace format.",
        messages: editMessages as any,
      });

      return result.toUIMessageStreamResponse({
        sendReasoning: true,
      });
    } catch (error) {
      console.error("Error in follow-up edit:", error);
      return new Response(
        JSON.stringify({
          error: "Something went wrong while processing the edit request.",
          details: error instanceof Error ? error.message : String(error),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  // INITIAL GENERATION: Use streaming for new animations
  try {
    // Build messages for initial generation (supports image references)
    const hasImages = frameImages && frameImages.length > 0;
    const storyboardNotice = storyboard
      ? `\n\n## STRICT STORYBOARD BLUEPRINT\nYou MUST strictly follow this scene-by-second plan:\n\`\`\`json\n${JSON.stringify(storyboard, null, 2)}\n\`\`\``
      : "";

    const assetMappingNote = frameImages && frameImages.length > 0
      ? `\n\n## ASSET MAPPING\nMap these symbols specifically to your code:\n- LOGO: User-provided brand logo\n${frameImages.map((_, i) => `- IMAGE_${i + 1}: Screenshot ${i + 1}`).join("\n")}`
      : "";

    const initialPromptText = hasImages
      ? `${finalPrompt}${storyboardNotice}${assetMappingNote}\n\n(See the attached ${frameImages.length === 1 ? "image" : "images"} for visual reference)`
      : `${finalPrompt}${storyboardNotice}${assetMappingNote}`;

    const initialMessageContent: Array<
      { type: "text"; text: string } | { type: "image"; image: Buffer }
    > = [{ type: "text" as const, text: initialPromptText }];

    if (hasImages) {
      for (const img of frameImages) {
        const match = img.match(/^data:(image\/(png|jpeg|webp|gif));base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[3];
          initialMessageContent.push({
            type: "image" as const,
            image: Buffer.from(base64Data, "base64"),
            mimeType: mimeType,
          } as any);
        }
      }
    }

    const initialMessages: Array<{
      role: "user";
      content: Array<
        { type: "text"; text: string } | { type: "image"; image: string | Buffer | Uint8Array; mimeType?: string }
      >;
    }> = [
      {
        role: "user" as const,
        content: initialMessageContent,
      },
    ];

    const result = streamText({
      model: bedrock(modelName),
      system: enhancedSystemPrompt,
      messages: initialMessages,
    });

    console.log(
      "Generating React component with prompt:",
      prompt,
      "model:",
      modelName,
      "skills:",
      detectedSkills.length > 0 ? detectedSkills.join(", ") : "general",
      reasoningEffort ? `reasoning_effort: ${reasoningEffort}` : "",
      hasImages ? `(with ${frameImages.length} image(s))` : "",
    );

    // Get the original stream response
    const originalResponse = result.toUIMessageStreamResponse({
      sendReasoning: true,
    });

    // Create metadata event to prepend
    const metadataEvent = `data: ${JSON.stringify({
      type: "metadata",
      skills: detectedSkills,
    })}\n\n`;

    // Create a new stream that prepends metadata before the LLM stream
    const originalBody = originalResponse.body;
    if (!originalBody) {
      return originalResponse;
    }

    const reader = originalBody.getReader();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send metadata event first
          controller.enqueue(encoder.encode(metadataEvent));

          // Then pipe through the original stream
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Check if the controller is already closed before enqueuing
            try {
              controller.enqueue(value);
            } catch (e) {
              // This happens if the user aborted the request
              break;
            }
          }
        } catch (error: any) {
          // Silent catch for AbortError
          if (error.name !== 'AbortError') {
            console.error("Stream reader error:", error);
          }
        } finally {
          try {
            controller.close();
            reader.releaseLock();
          } catch (e) {
            // Already closed
          }
        }
      },
      cancel() {
        // This is called if the client closes the connection
        reader.cancel();
      }
    });

    return new Response(stream, {
      headers: originalResponse.headers,
    });
  } catch (error) {
    console.error("Error generating code:", error);
    return new Response(
      JSON.stringify({
        error: "Something went wrong while trying to reach Bedrock APIs.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
