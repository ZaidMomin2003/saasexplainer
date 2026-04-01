"use client";

import { useCallback, useEffect, useState } from "react";
import {
  compileCode as compile,
  type CompilationResult,
} from "../remotion/compiler";

export interface AnimationState {
  code: string;
  Component: React.ComponentType | null;
  error: string | null;
  isCompiling: boolean;
}

export function useAnimationState(projectId?: string, initialCode: string = "") {
  const [state, setState] = useState<AnimationState>({
    code: initialCode,
    Component: null,
    error: null,
    isCompiling: false,
  });

  // Compile code when it changes (with debouncing handled by caller)
  const compileCode = useCallback((code: string) => {
    setState((prev) => ({ ...prev, isCompiling: true }));

    const result: CompilationResult = compile(code);

    setState((prev) => ({
      ...prev,
      Component: result.Component,
      error: result.error,
      isCompiling: false,
    }));
  }, []);

  // Update code and trigger compilation
  const setCode = useCallback((newCode: string) => {
    setState((prev) => ({ ...prev, code: newCode }));
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-compile when component mounts with initial code or cached code
  useEffect(() => {
    let codeToCompile = initialCode;
    
    if (projectId && typeof window !== "undefined") {
      const stored = localStorage.getItem(`anim_code_${projectId}`);
      if (stored) {
        codeToCompile = stored;
        setState((prev) => ({ ...prev, code: stored }));
      }
    }
    
    if (codeToCompile) {
      compileCode(codeToCompile);
    }
    setIsLoaded(true);
  }, [projectId, initialCode, compileCode]);

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && projectId && typeof window !== "undefined") {
      localStorage.setItem(`anim_code_${projectId}`, state.code);
    }
  }, [state.code, projectId, isLoaded]);

  return {
    ...state,
    setCode,
    compileCode,
  };
}
