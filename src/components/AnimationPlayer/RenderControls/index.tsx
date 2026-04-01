"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRendering } from "../../../helpers/use-rendering";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./Error";
import { ProgressBar } from "./ProgressBar";
import RenderPaymentDrawer from "../../RenderPaymentDrawer";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const RenderControls: React.FC<{
  code: string;
  durationInFrames: number;
  fps: number;
  projectId?: string;
  projectName?: string;
}> = ({ code, durationInFrames, fps, projectId, projectName }) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { renderMedia, state, undo } = useRendering({
    code,
    durationInFrames,
    fps,
  });
  const previousPropsRef = useRef({ code, durationInFrames, fps });

  // Reset rendering state when code, duration, or fps changes
  useEffect(() => {
    const prev = previousPropsRef.current;
    const hasChanged =
      prev.code !== code ||
      prev.durationInFrames !== durationInFrames ||
      prev.fps !== fps;

    if (hasChanged && state.status !== "init") {
      undo();
    }
    previousPropsRef.current = { code, durationInFrames, fps };
  }, [code, durationInFrames, fps, state.status, undo]);

  const handlePay = async () => {
    // In a real-world scenario, you would call your backend to create a Dodo Checkout session
    // const response = await fetch('/api/payments/create-session', { method: 'POST', body: JSON.stringify({ projectId }) });
    // const { url } = await response.json();
    // window.location.href = url;

    // For this demonstration, we'll simulate the redirect to the render screen after "payment"
    console.log("Redirecting to Dodo Payments...");
    setIsDrawerOpen(false);
    
    // Simulate successful payment redirect back to our render page
    setTimeout(() => {
      router.push(`/render/${projectId}`);
    }, 1000);
  };

  if (
    state.status === "init" ||
    state.status === "invoking" ||
    state.status === "error"
  ) {
    return (
      <div>
        <RenderPaymentDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onPay={handlePay}
          projectName={projectName}
        />
        
        <Button
          disabled={state.status === "invoking" || !code}
          onClick={() => setIsDrawerOpen(true)}
          className="bg-gray-900 text-white hover:bg-rose-600 transition-all rounded-xl font-bold px-6 py-5 h-auto shadow-lg shadow-gray-200"
        >
          <Download className="w-5 h-5 mr-2 opacity-60" />
          {state.status === "invoking"
            ? "Preparing..."
            : "Render & Download"}
        </Button>
        {state.status === "error" && (
          <ErrorComp message={state.error.message} />
        )}
      </div>
    );
  }

  if (state.status === "rendering") {
    return <ProgressBar progress={state.progress} />;
  }

  if (state.status === "done") {
    return <DownloadButton state={state} undo={undo} />;
  }

  return null;
};
