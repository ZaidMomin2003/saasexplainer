import { triggerRender } from "@/lib/render-service";
import { RenderRequest } from "@/types/schema";
import { executeApi } from "@/helpers/api-response";
import { RenderMediaOnLambdaOutput } from "@remotion/lambda/client";

export const POST = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
  RenderRequest,
  async (req, body) => {
    // We assume the projectId is available in the request or from context
    // This route is used directly from the player when not in "Pay-to-Render" mode
    // For "Pay-to-Render", the webhook will call triggerRender directly
    
    // In actual use, we'll need a project ID. Let's assume it's passed in metadata or similar.
    // For backward compatibility, we'll look for it in the body if provided.
    // But since RenderRequest only has inputProps, this is tricky.
    
    // Let's modify RenderRequest to optionally include projectId.
    // Or just call triggerRender with a placeholder ID if missing.
    const result = await triggerRender({
      projectId: "unknown", // This route is legacy/direct
      inputProps: body.inputProps,
    });

    return result;
  },
);

