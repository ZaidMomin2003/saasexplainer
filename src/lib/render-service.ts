import {
  AwsRegion,
  renderMediaOnLambda,
  RenderMediaOnLambdaOutput,
  speculateFunctionName,
} from "@remotion/lambda/client";
import {
  DISK,
  RAM,
  REGION,
  SITE_NAME,
  TIMEOUT,
} from "@/config.mjs"; 
import { COMP_NAME } from "@/types/constants";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface RenderParams {
  projectId: string;
  inputProps: {
    code: string;
    durationInFrames: number;
    fps: number;
  };
}

export async function triggerRender({ projectId, inputProps }: RenderParams): Promise<RenderMediaOnLambdaOutput> {
  if (
    !process.env.AWS_ACCESS_KEY_ID &&
    !process.env.REMOTION_AWS_ACCESS_KEY_ID
  ) {
    throw new TypeError(
      "Set up Remotion Lambda to render videos.",
    );
  }
  
  if (
    !process.env.AWS_SECRET_ACCESS_KEY &&
    !process.env.REMOTION_AWS_SECRET_ACCESS_KEY
  ) {
    throw new TypeError(
      "The environment variable REMOTION_AWS_SECRET_ACCESS_KEY is missing.",
    );
  }

  const result = await renderMediaOnLambda({
    codec: "h264",
    functionName: speculateFunctionName({
      diskSizeInMb: DISK,
      memorySizeInMb: RAM,
      timeoutInSeconds: TIMEOUT,
    }),
    region: REGION as AwsRegion,
    serveUrl: SITE_NAME,
    composition: COMP_NAME,
    inputProps: inputProps,
    framesPerLambda: 60,
    downloadBehavior: {
      type: "download",
      fileName: `video-${projectId}.mp4`,
    },
  });

  // Track the render in Firestore
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, {
    status: "rendering",
    "render.renderId": result.renderId,
    "render.bucketName": result.bucketName,
    "render.status": "invoking",
    "render.progress": 0,
    "render.updatedAt": Date.now(),
  });

  return result;
}
