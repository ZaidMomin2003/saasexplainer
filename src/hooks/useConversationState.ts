import type {
  AssistantMetadata,
  ConversationContextMessage,
  ConversationMessage,
  ConversationState,
  EditOperation,
} from "@/types/conversation";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

export function useConversationState(projectId?: string) {
  const [state, setState] = useState<ConversationState & { futureMessages: ConversationMessage[] }>({
    messages: [],
    futureMessages: [],
    hasManualEdits: false,
    lastGenerationTimestamp: null,
    pendingMessage: undefined,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  // 1. Unified Sync & Migration Logic
  useEffect(() => {
    if (!projectId || typeof window === "undefined") {
      setIsLoaded(true);
      return;
    }

    const docRef = doc(db, "projects", projectId);
    
    // Listen for remote changes
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const remoteState = data.conv_state;
        
        if (remoteState) {
          // If remote state exists, use it as source of truth
          setState((prev) => ({ ...prev, ...remoteState }));
          setIsLoaded(true);
        } else if (!isMigrating) {
          // If no remote state, check if we need to migrate from localStorage
          const stored = localStorage.getItem(`conv_state_${projectId}`);
          if (stored) {
            try {
              const localData = JSON.parse(stored);
              if (localData && localData.messages && localData.messages.length > 0) {
                console.log(`[Sync] Migrating LocalStorage for project ${projectId} to Firestore...`);
                setIsMigrating(true);
                await updateDoc(docRef, { conv_state: localData });
                setState((prev) => ({ ...prev, ...localData }));
              }
            } catch (e) {
              console.error("Migration failed", e);
            }
          }
          setIsLoaded(true);
        }
      } else {
        setIsLoaded(true);
      }
    });

    return () => unsubscribe();
  }, [projectId, isMigrating]);

  // Track the last AI-generated code to detect manual edits
  const lastAiCodeRef = useRef<string>("");

  const addUserMessage = useCallback(
    async (content: string, attachedImages?: string[]) => {
      const message: ConversationMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: Date.now(),
        attachedImages,
      };

      const newState = {
        ...state,
        messages: [...state.messages, message],
        futureMessages: [],
      };

      setState(newState);

      // Sync to Firestore
      if (projectId) {
        try {
          await updateDoc(doc(db, "projects", projectId), {
            conv_state: {
              messages: newState.messages,
              hasManualEdits: newState.hasManualEdits,
              lastGenerationTimestamp: newState.lastGenerationTimestamp
            }
          });
        } catch (err) {
          console.error("Firestore sync failed:", err);
        }
      }
      
      return message.id;
    },
    [state, projectId],
  );

  const addAssistantMessage = useCallback(
    async (content: string, codeSnapshot: string, metadata?: AssistantMetadata) => {
      const message: ConversationMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: Date.now(),
        codeSnapshot,
        metadata,
      };
      
      lastAiCodeRef.current = codeSnapshot;
      const newState = {
        ...state,
        messages: [...state.messages, message],
        futureMessages: [],
        hasManualEdits: false,
        lastGenerationTimestamp: Date.now(),
      };

      setState(newState);

      // Sync to Firestore
      if (projectId) {
        try {
          await updateDoc(doc(db, "projects", projectId), {
            conv_state: {
              messages: newState.messages,
              hasManualEdits: newState.hasManualEdits,
              lastGenerationTimestamp: newState.lastGenerationTimestamp
            }
          });
        } catch (err) {
          console.error("Firestore assistant sync failed:", err);
        }
      }

      return message.id;
    },
    [state, projectId],
  );

  const addErrorMessage = useCallback(
    (
      content: string,
      errorType: "edit_failed" | "api" | "validation",
      failedEdit?: EditOperation,
    ) => {
      const message: ConversationMessage = {
        id: `error-${Date.now()}`,
        role: "error",
        content,
        timestamp: Date.now(),
        errorType,
        failedEdit,
      };
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
      return message.id;
    },
    [],
  );

  const markManualEdit = useCallback(async (currentCode: string) => {
    // Only mark as manual edit if code differs from last AI generation
    if (currentCode !== lastAiCodeRef.current && lastAiCodeRef.current !== "") {
      const newState = { ...state, hasManualEdits: true };
      setState(newState);
      
      if (projectId) {
         await updateDoc(doc(db, "projects", projectId), {
            "conv_state.hasManualEdits": true
         }).catch(console.error);
      }
    }
  }, [state, projectId]);

  const clearConversation = useCallback(async () => {
    lastAiCodeRef.current = "";
    const newState = {
      messages: [],
      futureMessages: [],
      hasManualEdits: false,
      lastGenerationTimestamp: null,
      pendingMessage: undefined,
    };
    setState(newState);
    
    if (projectId) {
      await updateDoc(doc(db, "projects", projectId), {
        conv_state: {
          messages: [],
          hasManualEdits: false,
          lastGenerationTimestamp: null
        }
      }).catch(console.error);
    }
  }, [projectId]);

  const setPendingMessage = useCallback((skills?: string[]) => {
    setState((prev) => ({
      ...prev,
      pendingMessage: {
        skills,
        startedAt: Date.now(),
      },
    }));
  }, []);

  const clearPendingMessage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingMessage: undefined,
    }));
  }, []);

  // Get full conversation context (excludes error messages)
  const getFullContext = useCallback((): ConversationContextMessage[] => {
    // Filter out error messages - they're not part of the conversation context for the AI
    return state.messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.role === "user" ? m.content : (m.content || "[Generated Code]"),
        // Include attached images for user messages so the AI remembers what was shared
        ...(m.role === "user" && m.attachedImages && m.attachedImages.length > 0
          ? { attachedImages: m.attachedImages }
          : {}),
      }));
  }, [state.messages]);

  // Get all skills that have been used in the conversation (to avoid redundant skill content)
  const getPreviouslyUsedSkills = useCallback((): string[] => {
    const allSkills = new Set<string>();
    state.messages.forEach((m) => {
      if (m.role === "assistant" && m.metadata?.skills) {
        m.metadata.skills.forEach((skill) => allSkills.add(skill));
      }
    });
    return Array.from(allSkills);
  }, [state.messages]);

  // Get attached images from the last user message (for retry scenarios)
  const getLastUserAttachedImages = useCallback((): string[] | undefined => {
    for (let i = state.messages.length - 1; i >= 0; i--) {
      const msg = state.messages[i];
      if (
        msg.role === "user" &&
        msg.attachedImages &&
        msg.attachedImages.length > 0
      ) {
        return msg.attachedImages;
      }
    }
    return undefined;
  }, [state.messages]);

  const undo = useCallback(async () => {
    if (state.messages.length < 2) return null;

    // Find the last assistant/user pair
    const newMessages = [...state.messages];
    const undone: ConversationMessage[] = [];

    // Remove the assistant message
    const last = newMessages.pop();
    if (last) undone.unshift(last);

    // Remove the user message (or multiple errors leading up to it)
    while (newMessages.length > 0 && newMessages[newMessages.length - 1].role !== "user") {
      const msg = newMessages.pop();
      if (msg) undone.unshift(msg);
    }
    const userMsg = newMessages.pop();
    if (userMsg) undone.unshift(userMsg);

    const newState = {
      ...state,
      messages: newMessages,
      futureMessages: [...undone, ...state.futureMessages],
    };
    setState(newState);

    if (projectId) {
      await updateDoc(doc(db, "projects", projectId), {
        "conv_state.messages": newMessages
      }).catch(console.error);
    }

    // Return the code snapshot of the NEW last assistant message
    for (let i = newMessages.length - 1; i >= 0; i--) {
      if (newMessages[i].role === "assistant") {
        return newMessages[i].codeSnapshot || "";
      }
    }
    return ""; // Return empty string if no code snapshots remain
  }, [state, projectId]);

  const redo = useCallback(async () => {
    if (state.futureMessages.length < 1) return null;

    const newFuture = [...state.futureMessages];
    const redone: ConversationMessage[] = [];

    // Take the user/assistant pair back
    const userMsg = newFuture.shift();
    if (userMsg) redone.push(userMsg);

    while (newFuture.length > 0 && newFuture[0].role !== "assistant") {
      const msg = newFuture.shift();
      if (msg) redone.push(msg);
    }
    const assistantMsg = newFuture.shift();
    if (assistantMsg) redone.push(assistantMsg);

    const newState = {
      ...state,
      messages: [...state.messages, ...redone],
      futureMessages: newFuture,
    };
    setState(newState);

    if (projectId) {
      await updateDoc(doc(db, "projects", projectId), {
        "conv_state.messages": newState.messages
      }).catch(console.error);
    }

    return assistantMsg?.codeSnapshot || "";
  }, [state, projectId]);

  const canUndo = state.messages.length >= 2;
  const canRedo = state.futureMessages.length >= 2;

  return {
    ...state,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    markManualEdit,
    clearConversation,
    getFullContext,
    getPreviouslyUsedSkills,
    getLastUserAttachedImages,
    setPendingMessage,
    clearPendingMessage,
    undo,
    redo,
    canUndo,
    canRedo,
    isFirstGeneration: state.messages.length === 0,
  }
}
;
