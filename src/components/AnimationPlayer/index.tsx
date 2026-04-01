"use client";

import { Player, type ErrorFallback, type PlayerRef } from "@remotion/player";
import React, { useEffect, useRef } from "react";
import { ErrorDisplay, type ErrorType } from "../ErrorDisplay";

import AILoadingState from "../AILoadingState";

const errorTitles: Record<ErrorType, string> = {
  validation: "Invalid Prompt",
  api: "API Error",
  compilation: "Compilation Error",
};

const renderErrorFallback: ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <ErrorDisplay
      error={error.message || "An error occurred while rendering"}
      title="Runtime Error"
      variant="fullscreen"
      size="lg"
    />
  );
};

interface AnimationPlayerProps {
  Component: React.ComponentType | null;
  durationInFrames: number;
  fps: number;
  onDurationChange: (duration: number) => void;
  onFpsChange: (fps: number) => void;
  isCompiling: boolean;
  isStreaming: boolean;
  error: string | null;
  errorType?: ErrorType;
  code: string;
  onRuntimeError?: (error: string) => void;
  onFrameChange?: (frame: number) => void;
}

export const AnimationPlayer: React.FC<AnimationPlayerProps> = ({
  Component,
  durationInFrames,
  fps,
  onDurationChange,
  onFpsChange,
  isCompiling,
  isStreaming,
  error,
  errorType = "compilation",
  code,
  onRuntimeError,
  onFrameChange,
}) => {
  const playerRef = useRef<PlayerRef>(null);

  // Listen for runtime errors from the Player's error boundary
  // Component is included in deps because the Player remounts when Component changes (via key={Component.toString()})
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !onRuntimeError) return;

    const handleError = (e: { detail: { error: Error } }) => {
      onRuntimeError(e.detail.error.message);
    };

    player.addEventListener("error", handleError);
    return () => {
      player.removeEventListener("error", handleError);
    };
  }, [onRuntimeError, Component]);

  // Listen for frame changes and report to parent
  // Component is included in deps because the Player remounts when Component changes (via key={Component.toString()})
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !onFrameChange) return;

    const handleFrameUpdate = (e: { detail: { frame: number } }) => {
      onFrameChange(e.detail.frame);
    };

    player.addEventListener("frameupdate", handleFrameUpdate);
    return () => {
      player.removeEventListener("frameupdate", handleFrameUpdate);
    };
  }, [onFrameChange, Component]);

  const renderContent = () => {
    if (isStreaming || isCompiling) {
      return (
        <div className="w-full aspect-video max-h-[calc(100%-80px)] flex flex-col justify-center items-center bg-white border border-slate-100 rounded-lg overflow-hidden shadow-sm">
          <AILoadingState />
        </div>
      );
    }

    if (error) {
      return (
        <ErrorDisplay
          error={error}
          title={errorTitles[errorType]}
          variant="fullscreen"
          size="lg"
        />
      );
    }

    if (!Component) {
      return (
        <div className="w-full aspect-video max-h-[calc(100%-80px)] flex justify-center items-center bg-slate-50 border border-slate-100 rounded-lg overflow-hidden font-sans text-slate-400">
          Select an example to get started
        </div>
      );
    }

    return (
      <div className="w-full aspect-video max-h-full bg-white rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <Player
          ref={playerRef}
          key={Component.toString()}
          component={Component}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionHeight={1080}
          compositionWidth={1920}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
          controls
          autoPlay
          loop
          errorFallback={renderErrorFallback}
          spaceKeyToPlayOrPause={false}
          clickToPlay={false}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white min-w-0 h-full w-full rounded-2xl">
      <div className="w-full h-full flex flex-col items-center justify-center p-4">{renderContent()}</div>
    </div>
  );
};
