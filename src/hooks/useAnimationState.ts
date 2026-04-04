"use client";

import { useCallback, useEffect, useState } from "react";
import {
  compileCode as compile,
  type CompilationResult,
} from "../remotion/compiler";
import { db } from "@/lib/firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

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

  const [isLoaded, setIsLoaded] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

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
    
    // Sync to Firestore
    if (projectId) {
      updateDoc(doc(db, "projects", projectId), {
        code: newCode,
        updatedAt: Date.now()
      }).catch(console.error);
    }
  }, [projectId]);

  // Unified Sync & Migration logic
  useEffect(() => {
     if (!projectId || typeof window === "undefined") {
       setIsLoaded(true);
       return;
     }

     const docRef = doc(db, "projects", projectId);

     const unsubscribe = onSnapshot(docRef, async (docSnap) => {
        if (docSnap.exists()) {
           const data = docSnap.data();
           const remoteCode = data.code;

           if (remoteCode) {
              // If remote code exists, it's the source of truth
              setState((prev) => {
                if (prev.code !== remoteCode) {
                   compileCode(remoteCode);
                   return { ...prev, code: remoteCode };
                }
                return prev;
              });
              setIsLoaded(true);
           } else if (!isMigrating) {
              // Check for migration
              const stored = localStorage.getItem(`anim_code_${projectId}`);
              if (stored) {
                 console.log(`[Sync] Migrating Code for ${projectId} to Firestore...`);
                 setIsMigrating(true);
                 await updateDoc(docRef, { code: stored });
                 setState(prev => ({ ...prev, code: stored }));
                 compileCode(stored);
              }
              setIsLoaded(true);
           }
        } else {
          setIsLoaded(true);
        }
     });

     return () => unsubscribe();
  }, [projectId, isMigrating, compileCode]);

  return {
    ...state,
    setCode,
    compileCode,
  };
}

