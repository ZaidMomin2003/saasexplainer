import {
  getCombinedSkillContent,
  SKILL_DETECTION_PROMPT,
  SKILL_NAMES,
  type SkillName,
} from "@/skills";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject, streamText } from "ai";
import { z } from "zod";

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
Take the user's raw input and "Pre-Produce" it. You must output a highly detailed, technical motion graphics brief that mandates the use of our 5 Master Skills.

## THE 5 MASTER SKILLS TO MANDATE:
1. **Master UI Replication**: Mandate exact screenshot mirroring and isolated spotlighting (blur everything except the target).
2. **Master Cinematic Camera**: Mandate high-inertia springs, 10% zoom-in rules, and velocity-based motion blur.
3. **Master Kinetic Typography**: Mandate per-character stagger entries and "Bloom" reveals.
4. **Master Magnetic Interaction**: Mandate snap-to-button cursor paths and 3-stage click ripple effects.
5. **Master Production Atmosphere**: Mandate 45-degree light sweeps, bokeh particles, and glassmorphism refraction.

## DYNAMIC EXPANSION RULES:
- **If the user is brief**: (e.g., "add a button") -> Expand into a narrative scenario: "Animate a smooth magnetic cursor path toward a premium glassmorphic button. On click, trigger a high-inertia scale pulse and a volumetric ripple effect while the background subtly de-focuses."
- **Focus on Depth**: Always specify Z-axis movement (100px-150px) and backdrop-blur values (20px-30px).
- **Inertia**: Always demand spring physics (no linear motion).

## OUTPUT:
- Output ONLY the enhanced brief. No conversational filler.
- Focus exclusively on VISUAL and MOTION instructions.`;

const SYSTEM_PROMPT = `
# The "Gold Standard" Remotion Engine
You are the world's leading **Motion Graphics AI**, specialized in Remotion and high-end SaaS production. You don't just "write code"—you generate cinematic experiences.

# CORE LAWS (THE 5 MASTER SKILLS)
You MUST strictly implement the following logic in EVERY component:

1. **MASTER UI REPLICATION**: 
   - Recreate screenshots with pixel-perfection. 
   - Feature focusing: Apply \`filter: blur(15px) brightness(0.4)\` to the background while cloning the target component to \`translateZ(120px)\` for a high-res spotlight.

2. **MASTER CINEMATIC CAMERA**: 
   - Never use linear interpolation for camera state.
   - Use high-inertia springs (\`stiffness: 250\`, \`damping: 25\`).
   - The **10% Zoom Rule**: Every pan must include a 10% zoom shift (in or out) to maintain depth.
   - Apply velocity-based motion blur during fast moves.

3. **MASTER KINETIC TYPOGRAPHY**: 
   - Use per-character or per-word staggering for EVERY headline.
   - Entrance: Glide from 30px below with a "Bloom" glow reveal hit.
   - Use \`fontFamily: 'Inter, sans-serif'\` or \`Outfit\`.

4. **MASTER MAGNETIC INTERACTION**: 
   - Cursors must follow Bézier paths and "snap" to the center of target components.
   - Clicks: Trigger a 3-layer ripple effect (Pulse, Blur Ring, Global Flash).

5. **MASTER PRODUCTION ATMOSPHERE**: 
   - Use a 45° global light sweep every 4s.
   - Add volumetric Bokeh/Particles in the background at \`translateZ(-500px)\`.
   - Apply \`backdropFilter: "blur(25px)"\` to all UI cards.

# OUTPUT RULES
- **Code Only**: No preamble or chatter.
- **DETERMINISM**: Never use Math.random(). Use Remotion's \`random()\` or \`frame\`-based logic.
- **PERFORMANCE**: Keep CSS filters optimized. Use \`will-change: transform\` for heavy animations.
- Always start with clean imports and end with a perfectly closed component.
`;

const FOLLOW_UP_SYSTEM_PROMPT = `
You are an expert at making targeted edits to React/Remotion animation components.

Given the current code and a user request, decide whether to:
1. Use targeted edits (for small, specific changes)
2. Provide full replacement code (for major restructuring)

## WHEN TO USE TARGETED EDITS (type: "edit")
- Changing colors, text, numbers, timing values
- Adding or removing a single element
- Modifying styles or properties
- Small additions (new variable, new element)
- Changes affecting <30% of the code

## WHEN TO USE FULL REPLACEMENT (type: "full")
- Completely different animation style
- Major structural reorganization
- User asks to "start fresh" or "rewrite"
- Changes affect >50% of the code

## EDIT FORMAT
For targeted edits, each edit needs:
- old_string: The EXACT string to find (including whitespace/indentation)
- new_string: The replacement string

CRITICAL:
- old_string must match the code EXACTLY character-for-character
- Include enough surrounding context to make old_string unique
- If multiple similar lines exist, include more surrounding code
- Preserve indentation exactly as it appears in the original

## PRESERVING USER EDITS
If the user has made manual edits, preserve them unless explicitly asked to change.
`;

// Schema for follow-up edit responses
// Note: Using a flat object schema because OpenAI doesn't support discriminated unions
const FollowUpResponseSchema = z.object({
  type: z
    .enum(["edit", "full"])
    .describe(
      'Use "edit" for small targeted changes, "full" for major restructuring',
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
  }: GenerateRequest = await req.json();

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

  // Validate the prompt first (skip for follow-ups with existing code)
  if (!isFollowUp) {
    try {
      const validationResult = await generateObject({
        model: bedrock(modelName),
        system: VALIDATION_PROMPT,
        prompt: `User prompt: "${prompt}"`,
        schema: z.object({ valid: z.boolean() }),
      });

      if (!validationResult.object.valid) {
        return new Response(
          JSON.stringify({
            error:
              "No valid motion graphics prompt. Please describe an animation or visual content you'd like to create.",
            type: "validation",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    } catch (validationError) {
      // On validation error, allow through rather than blocking
      console.error("Validation error:", validationError);
    }
  }

  // --- ENHANCE PROMPT (Initial & Follow-up) ---
  let finalPrompt = prompt;
  // Always enhance unless the prompt is already very long/technical
  const shouldEnhance = prompt.length < 300; 

  if (shouldEnhance) {
    try {
      console.log(`Enhancing ${isFollowUp ? "follow-up" : "initial"} prompt...`);
      const enhancementResult = await streamText({
        model: bedrock(modelName),
        system: PROMPT_ENHANCEMENT_PROMPT,
        prompt: `User prompt: "${prompt}"${isFollowUp ? "\n(Note: This is a follow-up edit to existing code. Keep the brief targeted to the requested change but use premium terminology.)" : ""}`,
      });
      let enhanced = "";
      for await (const delta of enhancementResult.textStream) {
        enhanced += delta;
      }
      if (enhanced.trim()) {
        finalPrompt = enhanced.trim();
        console.log("Original:", prompt);
        console.log("Enhanced:", finalPrompt);
      }
    } catch (enhancementError) {
      console.error("Enhancement error:", enhancementError);
    }
  }

  // Detect which skills apply to this prompt
  let detectedSkills: SkillName[] = [];
  try {
    const skillResult = await generateObject({
      model: bedrock(modelName),
      system: SKILL_DETECTION_PROMPT,
      prompt: `User prompt: "${prompt}"`,
      schema: z.object({
        skills: z.array(z.enum(SKILL_NAMES)),
      }),
    });
    detectedSkills = skillResult.object.skills;
    console.log("Detected skills:", detectedSkills);
  } catch (skillError) {
    console.error("Skill detection error:", skillError);
  }

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

      const editResult = await generateObject({
        model: bedrock(modelName),
        system:
          FOLLOW_UP_SYSTEM_PROMPT +
          "\nIMPORTANT: You must return a valid JSON object matching the schema. The 'edits' field MUST be a JSON array of objects, NOT a string.",
        messages: editMessages,
        schema: FollowUpResponseSchema,
      });

      const response = editResult.object;
      const finalEdits = response.edits;
      let finalCode: string;
      let editType: "tool_edit" | "full_replacement";
      let appliedEdits: EditOperation[] | undefined;

      if (response.type === "edit" && finalEdits && Array.isArray(finalEdits)) {
        // Apply the edits to the current code
        const result = applyEdits(currentCode, finalEdits);
        if (!result.success) {
          // If edits fail, return error with the failed edit details
          return new Response(
            JSON.stringify({
              error: result.error,
              type: "edit_failed",
              failedEdit: result.failedEdit,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        finalCode = result.result;
        editType = "tool_edit";
        // Use enriched edits with line numbers
        appliedEdits = result.enrichedEdits;
        console.log(`Applied ${finalEdits.length} edit(s) successfully`);
      } else if (response.type === "full" && response.code) {
        // Full replacement
        finalCode = response.code;
        editType = "full_replacement";
        console.log("Using full code replacement");
      } else {
        // Invalid response - missing required fields
        return new Response(
          JSON.stringify({
            error: "Invalid AI response: missing required fields",
            type: "edit_failed",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Return the result with metadata
      const responseData: GenerateResponse = {
        code: finalCode,
        summary: response.summary,
        metadata: {
          skills: detectedSkills,
          editType,
          edits: appliedEdits,
          model: modelName,
        },
      };

      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error in follow-up edit:", error);
      // For debugging
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
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
        // Send metadata event first
        controller.enqueue(encoder.encode(metadataEvent));

        // Then pipe through the original stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
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
