import { stripMarkdownFences, extractComponentCode } from "@/helpers/sanitize-response";
import * as Babel from "@babel/standalone";
import { Lottie } from "@remotion/lottie";
import * as RemotionShapes from "@remotion/shapes";
import { ThreeCanvas } from "@remotion/three";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/google-fonts/Inter";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Audio,
  Easing,
  random,
  continueRender,
  delayRender,
  Series,
} from "remotion";
import * as Icons from "lucide-react";
import * as THREE from "three";

export interface CompilationResult {
  Component: React.ComponentType | null;
  error: string | null;
}

// Strip imports and extract component body from LLM-generated code
// Safety layer in case LLM includes full ES6 syntax despite instructions
// Strip imports and identify the component logic from LLM-generated code
function extractComponentBody(code: string): { helpers: string; body: string } {
  // Step 1: Strip markdown fences and get balanced code
  let cleaned = stripMarkdownFences(code);
  cleaned = extractComponentCode(cleaned);

  // Step 2: Strip all import statements
  cleaned = cleaned.replace(/import\s+[\s\S]*?from\s*["'][^"']+["'];?/g, "");
  cleaned = cleaned.replace(/import\s*["'][^"']+["'];?/g, "");

  // Step 3: Extract the body of the component if it's wrapped in export const ... = () => { ... }
  // We use a more forgiving regex that allows for code before the component (helpers)
  const componentMatch = cleaned.match(/([\s\S]*?)export\s+const\s+\w+.*?\s*=>\s*\{([\s\S]*)\};?\s*$/);
  
  if (componentMatch) {
    return {
      helpers: componentMatch[1].trim(),
      body: componentMatch[2].trim(),
    };
  }

  return { helpers: "", body: cleaned };
}

// Standalone compile function for use outside React components
export function compileCode(code: string): CompilationResult {
  if (!code?.trim()) {
    return { Component: null, error: "No code provided" };
  }

  try {
    const { helpers, body } = extractComponentBody(code);

    // Shared Typography/Branding Components accessible to the AI
    const SiteLabel = ({ text, color = "#000" }: { text: string, color?: string }) => 
      React.createElement('div', { 
        style: { fontStyle: 'italic', fontWeight: 900, fontSize: 32, letterSpacing: '0.1em', color, textTransform: 'uppercase' } 
      }, text);

    const Logo = ({ color = "#E11D48" }: { color?: string }) => 
      React.createElement('div', { 
        style: { display: 'flex', alignItems: 'center', gap: 12 } 
      }, [
        React.createElement('div', { 
          key: 'logo-bg',
          style: { backgroundColor: color, borderRadius: 12, padding: 8 } 
        }, React.createElement('svg', { 
            width: "24", height: "24", viewBox: "0 0 24 24", fill: "white" 
          }, React.createElement('path', { d: "M8 5v14l11-7z" })
        )),
        React.createElement('span', { 
          key: 'logo-text',
          style: { fontWeight: 700, fontSize: 24, color: '#0F172A' } 
        }, 'SaaSVideo')
      ]);

    // INJECT HALLUCINATION FALLBACKS (Only if not already declared by the AI)
    // We use a safe check to avoid "Identifier already declared" errors during cinematic Forge cycles.
    const injectIfMissing = (name: string, fallback: string) => {
      const isDeclared = code.includes(`const ${name}`) || code.includes(`let ${name}`) || code.includes(`var ${name}`) || code.includes(`function ${name}`);
      return isDeclared ? "" : `var ${name} = ${fallback};`;
    };

    const fallbacks = `
      ${injectIfMissing("codeLines", '[ "// Production Logic", "const app = () => {", "  return <Studio />;", "};" ]')}
      ${injectIfMissing("dashboardData", '[ { label: "Mon", value: 45 }, { label: "Tue", value: 52 }, { label: "Wed", value: 38 } ]')}
      ${injectIfMissing("userProfile", '{ name: "SaaS Producer", avatar: "https://i.pravatar.cc/150?u=saas" }')}
      ${injectIfMissing("TOTAL_CODE_CHARS", "1000")}
      ${injectIfMissing("LINE_STAGGER", "3")}
      ${injectIfMissing("CHAR_STAGGER", "0.1")}
      ${injectIfMissing("typedChars", "0")}
    `;

    // Flatten the code into a single executable script body for the 'new Function'
    // We define the function as a variable so Babel doesn't complain about top-level returns.
    const scriptBody = `
      ${fallbacks}
      ${helpers}
      const DynamicAnimation = (props) => {
        ${body}
      };
    `;

    const transpiled = Babel.transform(scriptBody, {
      presets: ["react", "typescript"],
      filename: "dynamic-animation.tsx",
    });

    if (!transpiled.code) {
      return { Component: null, error: "Transpilation failed" };
    }

    // Now that Babel has transpiled the body safely, we append the actual return for use in createComponent
    const wrappedCode = `${transpiled.code}\nreturn DynamicAnimation;`;

    const createComponent = new Function(
      "React",
      "Remotion",
      "Series",
      "RemotionShapes",
      "Icons",
      "Lottie",
      "ThreeCanvas",
      "THREE",
      "AbsoluteFill",
      "interpolate",
      "useCurrentFrame",
      "useVideoConfig",
      "spring",
      "Sequence",
      "Img",
      "useState",
      "useEffect",
      "useMemo",
      "useRef",
      "Rect",
      "Circle",
      "Triangle",
      "Star",
      "Polygon",
      "Ellipse",
      "Heart",
      "Pie",
      "makeRect",
      "makeCircle",
      "makeTriangle",
      "makeStar",
      "makePolygon",
      "makeEllipse",
      "makeHeart",
      "makePie",
      // Transitions
      "TransitionSeries",
      "linearTiming",
      "springTiming",
      "fade",
      "slide",
      "wipe",
      "flip",
      "clockWipe",
      "loadFont",
      // Branding
      "staticFile",
      "Audio",
      "Easing",
      "random",
      "continueRender",
      "delayRender",
      "SiteLabel",
      "Logo",
      wrappedCode,
    );

    const Component = createComponent(
      React,
      {
        AbsoluteFill,
        interpolate,
        useCurrentFrame,
        useVideoConfig,
        spring,
        Sequence,
        Img,
        Series,
      },
      Series,
      RemotionShapes,
      Icons,
      Lottie,
      ThreeCanvas,
      THREE,
      AbsoluteFill,
      interpolate,
      useCurrentFrame,
      useVideoConfig,
      spring,
      Sequence,
      Img,
      useState,
      useEffect,
      useMemo,
      useRef,
      RemotionShapes.Rect,
      RemotionShapes.Circle,
      RemotionShapes.Triangle,
      RemotionShapes.Star,
      RemotionShapes.Polygon,
      RemotionShapes.Ellipse,
      RemotionShapes.Heart,
      RemotionShapes.Pie,
      RemotionShapes.makeRect,
      RemotionShapes.makeCircle,
      RemotionShapes.makeTriangle,
      RemotionShapes.makeStar,
      RemotionShapes.makePolygon,
      RemotionShapes.makeEllipse,
      RemotionShapes.makeHeart,
      RemotionShapes.makePie,
      // Transitions
      TransitionSeries,
      linearTiming,
      springTiming,
      fade,
      slide,
      wipe,
      flip,
      clockWipe,
      loadFont,
      staticFile,
      Audio,
      Easing,
      random,
      continueRender,
      delayRender,
      // Branding Components
      SiteLabel,
      Logo,
    );

    if (typeof Component !== "function") {
      return {
        Component: null,
        error: "Code must be a function that returns a React component",
      };
    }

    return { Component, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown compilation error";
    return { Component: null, error: errorMessage };
  }
}
