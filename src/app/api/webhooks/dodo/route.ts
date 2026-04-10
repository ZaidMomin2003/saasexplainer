import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { triggerRender } from "@/lib/render-service";
import { dodo } from "@/lib/dodo";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-dodo-signature") || "";

    if (!signature) {
      console.warn("Webhook attempt without signature header.");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // 1. Verify Webhook Signature using SDK helper
    let event;
    try {
      const headersObject: Record<string, string> = {};
      req.headers.forEach((value, key) => {
        headersObject[key] = value;
      });

      event = dodo.webhooks.unwrap(rawBody, {
        headers: headersObject,
        key: process.env.DODOPAYMENTS_WEBHOOK_SECRET,
      });
      console.log("Verified Dodo Webhook signature successfully.");
    } catch (err: any) {
      console.error("Webhook Verification Failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Extract Metadata
    const type = event.type;
    const data = event.data as any;
    const metadata = data?.metadata || {};
    const { projectId, userId } = metadata;

    console.log(`Payment Webhook Event: ${type} for User: ${userId}, Project: ${projectId}`);

    // Dodo event types: payment.captured, order.paid, payment.succeeded
    const successfulEvents = ["payment.succeeded", "order.paid", "payment.captured"];

    if (successfulEvents.includes(type) && projectId) {
      const projectRef = doc(db, "projects", projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        console.error(`Project ${projectId} not found in Firestore`);
        return NextResponse.json({ received: true }); // Still return 200
      }

      const projectData = projectSnap.data();

      // Check for Idempotency (avoid double rendering)
      if (projectData.status === "rendering" || projectData.status === "completed" || projectData.render?.renderId) {
        console.log(`Project ${projectId} already processed or rendering. Skipping.`);
        return NextResponse.json({ received: true });
      }

      // 3. Update User Credits
      if (userId && userId !== "anonymous") {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          credits: increment(1),
          lastPaymentAt: Date.now(),
        }).catch((err) => {
          console.error("Failed to update user credits:", err);
        });
      }

      // 4. Mark as PAID and Status to PREPARING
      await updateDoc(projectRef, {
        status: "preparing",
        "render.paid": true,
        "render.paidAt": Date.now(),
        payment: {
          id: data.payment_id || data.order_id,
          amount: data.total_amount,
          currency: data.currency,
          completedAt: new Date().toISOString(),
        },
      });

      // 5. Trigger the actual Lambda rendering
      console.log(`Triggering render for project: ${projectId}`);
      try {
        await triggerRender({
          projectId,
          inputProps: {
            code: projectData.code || "",
            durationInFrames: parseInt(projectData.duration || "10") * 30, // Default 10s if missing
            fps: 30,
          },
        });
        console.log(`Lambda render triggered successfully for ${projectId}`);
      } catch (renderError) {
        console.error("Failed to trigger Lambda render:", renderError);
        // Maybe update status to FAILED if render trigger fails
        await updateDoc(projectRef, {
           status: "FAILED",
           "render.error": "Failed to invoke rendering engine"
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
