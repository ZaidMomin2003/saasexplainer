"use client";

import React from "react";
import { motion } from "framer-motion";

interface InfiniteSliderProps {
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  speedOnHover?: number;
}

export const InfiniteSlider = ({ children, speed = 40, gap = 40, speedOnHover }: InfiniteSliderProps) => {
  return (
    <div className="overflow-hidden whitespace-nowrap mask-x">
      <motion.div
        className="flex"
        style={{ gap: `${gap}px` }}
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={speedOnHover ? { transition: { duration: speedOnHover } } : undefined}
      >
        <div className="flex" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
