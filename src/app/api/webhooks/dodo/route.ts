import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { triggerRender } from "@/lib/render-service";
import crypto from "crypto";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("x-dodo-signature");
  const secret = process.env.DODOPAYMENTS_WEBHOOK_SECRET;

  // 1. Signature Verification
  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");

  if (signature !== digest) {
    console.error("Invalid Webhook Signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse Event
  const event = JSON.parse(payload);
  
  // Dodo event types: payment.captured, order.paid, session.completed
  // Check metadata for projectId
  const metadata = event.metadata || {};
  const projectId = metadata.projectId;

  if (!projectId) {
    console.warn("No projectId found in webhook metadata");
    return NextResponse.json({ received: true });
  }

  // 3. Trigger Logic
  // Only trigger for success events
  const successfulEvents = ['payment.captured', 'order.paid', 'payment.succeeded', 'payment.succeed'];
  if (successfulEvents.includes(event.type)) {
      console.log(`Payment confirmed for project: ${projectId}. Starting render...`);
      
      const projectRef = doc(db, "projects", projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (!projectSnap.exists()) {
        console.error(`Project ${projectId} not found in Firestore`);
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      const projectData = projectSnap.data();
      
      // Update payment status
      await updateDoc(projectRef, {
        "render.paid": true,
        "render.paidAt": Date.now(),
        status: "preparing"
      });

      // Trigger the actual Lambda rendering
      try {
        await triggerRender({
          projectId,
          inputProps: {
            code: projectData.code || "",
            durationInFrames: parseInt(projectData.duration || "30") * 30,
            fps: 30
          }
        });
      } catch (renderError) {
        console.error("Failed to trigger Lambda render:", renderError);
        // We still return 200 because the payment was successful
      }
  }

  return NextResponse.json({ received: true });
}
