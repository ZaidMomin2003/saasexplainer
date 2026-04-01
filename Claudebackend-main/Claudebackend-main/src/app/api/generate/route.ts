import {
  getCombinedSkillContent,
  SKILL_DETECTION_PROMPT,
  SKILL_NAMES,
  type SkillName,
} from "@/skills";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject, streamText } from "ai";
import { z } from "zod";

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

const PROMPT_ENHANCEMENT_PROMPT = `You are a world-class Motion Graphics Director specializing in SaaS Explainer Videos. Your job is to take a simple user request and expand it into a high-fidelity, professional animation brief for a React/Remotion developer.

## YOUR TASK:
1. Identify the CORE intent of the user.
2. Enrich it with PROFESSIONAL motion graphics vocabulary:
   - SaaS Focus: (e.g., Premium device mockups, browser windows, cursor interactions, UI highlighting)
   - Visual Styles: (e.g., Glassmorphism, Neumorphism, Minimalist, Metallic, Glowing, Cyberpunk)
   - Animation Techniques: (e.g., Spring physics, Parallax, Staggered entries, Easing, Camera zooms, Particle effects)
   - Layout & Composition: (e.g., Rule of thirds, Dynamic framing, Large kinetic typography, Subtle textures)
3. Ensure the result is a concise, but highly descriptive paragraph (2-4 sentences).

## EXAMPLES:
- User: "Bar chart"
- Director: "Create a modern, data-driven bar chart with a semi-transparent glassmorphism background. The bars should grow in from the bottom using spring-loaded physics with a slight overshoot. Include floating labels and a subtle background grid for a technical, high-end feel."

- User: "Show my dashboard"
- Director: "Design a cinematic SaaS reveal using a premium MacOS-style browser mockup. Use a smooth, spring-animated cursor to highlight key metrics in the dashboard, accompanied by subtle parallax movements and a clean, high-contrast typography intro."

## OUTPUT:
- Output ONLY the enhanced prompt. No introductions or meta-talk.
- Do not mention implementation details like "use React" - focus on the VISUAL and MOTION brief.`;

const SYSTEM_PROMPT = `
You are an expert in generating React components for Remotion animations.

## COMPONENT STRUCTURE

1. Start with ES6 imports
2. Export as: export const MyAnimation = () => { ... };
3. Component body order:
   - Multi-line comment description (2-3 sentences)
   - Hooks (useCurrentFrame, useVideoConfig, etc.)
   - Constants (COLORS, TEXT, TIMING, LAYOUT) - all UPPER_SNAKE_CASE
   - Calculations and derived values
   - return JSX

## CONSTANTS RULES (CRITICAL)

ALL constants MUST be defined INSIDE the component body, AFTER hooks:
- Colors: const COLOR_TEXT = "#000000";
- Text: const TITLE_TEXT = "Hello World";
- Timing: const FADE_DURATION = 20;
- Layout: const PADDING = 40;

This allows users to easily customize the animation.

## LAYOUT RULES

- Use full width of container with appropriate padding
- Never constrain content to a small centered box
- Use Math.max(minValue, Math.round(width * percentage)) for responsive sizing

## ANIMATION RULES

- Prefer spring() for organic motion (entrances, bounces, scaling)
- Use interpolate() for linear progress (progress bars, opacity fades)
- Always use { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
- Add stagger delays for multiple elements

## AVAILABLE IMPORTS

\`\`\`tsx
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring, Sequence } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Circle, Rect, Triangle, Star, Ellipse, Pie } from "@remotion/shapes";
import { ThreeCanvas } from "@remotion/three";
import { useState, useEffect } from "react";
\`\`\`

## RESERVED NAMES (CRITICAL)

NEVER use these as variable names - they shadow imports:
- spring, interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill, Sequence

## STYLING RULES

- Use inline styles only
- ALWAYS use fontFamily: 'Inter, sans-serif'
- Keep colors minimal (2-4 max)
- ALWAYS set backgroundColor on AbsoluteFill from frame 0 - never fade in backgrounds

## OUTPUT FORMAT (CRITICAL)

- Output ONLY code - no explanations, no questions
- Response must start with "import" and end with "};"
- If prompt is ambiguous, make a reasonable choice - do not ask for clarification

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
    .union([
      z.array(
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
      ),
      z.string(),
    ])
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

  // --- ENHANCE PROMPT ---
  let finalPrompt = prompt;
  if (!isFollowUp) {
    try {
      console.log("Enhancing prompt for initial generation...");
      const enhancementResult = await streamText({
        model: bedrock(modelName),
        system: PROMPT_ENHANCEMENT_PROMPT,
        prompt: `User prompt: "${prompt}"`,
      });
      // We'll read the full enhanced prompt
      let enhanced = "";
      for await (const delta of enhancementResult.textStream) {
        enhanced += delta;
      }
      if (enhanced.trim()) {
        finalPrompt = enhanced.trim();
        console.log("Original prompt:", prompt);
        console.log("Enhanced prompt:", finalPrompt);
      }
    } catch (enhancementError) {
      console.error("Enhancement error:", enhancementError);
      // Fallback to original prompt on error
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

  // Automatically add 'storyboarding' skill if a storyboard is provided
  if (storyboard && !detectedSkills.includes("storyboarding")) {
    detectedSkills.push("storyboarding");
  }

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
          "\nIMPORTANT: The 'edits' field must be a valid JSON array of objects. Do not wrap the array in a string. Only use a string if you absolutely must, in which case it must be valid JSON.",
        messages: editMessages,
        schema: FollowUpResponseSchema,
      });

      // ADD THIS REPAIR LOGIC IMMEDIATELY AFTER:
      let finalEdits = editResult.object.edits;
      if (typeof finalEdits === "string") {
        try {
          finalEdits = JSON.parse(finalEdits);
        } catch (e) {
          console.error("Failed to parse stringified edits array:", e);
        }
      }

      const response = editResult.object;
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
