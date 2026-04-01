"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRendering } from "@/helpers/use-rendering";
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
    try {
      console.log("Creating Dodo Checkout session...");
      const response = await fetch('/api/payments/checkout', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }) 
      });
      
      const result = await response.json();
      
      if (result.type === 'success' && result.data.checkout_url) {
        window.location.href = result.data.checkout_url;
      } else {
        throw new Error(result.message || "Failed to create checkout session");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Failed to start payment. Please try again.");
    }
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
