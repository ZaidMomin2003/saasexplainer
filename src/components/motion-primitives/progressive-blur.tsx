"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
  className?: string;
  direction?: "left" | "right";
  blurIntensity?: number;
}

export const ProgressiveBlur = ({ className, direction = "left" }: ProgressiveBlurProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none",
        direction === "left" 
          ? "bg-gradient-to-r from-background to-transparent" 
          : "bg-gradient-to-l from-background to-transparent",
        className
      )}
    />
  );
};
