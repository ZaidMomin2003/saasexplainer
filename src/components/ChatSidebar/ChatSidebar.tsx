"use client";

import { Button } from "@/components/ui/button";
import { useGenerationApi } from "@/hooks/useGenerationApi";
import { cn } from "@/lib/utils";
import type {
  AssistantMetadata,
  ConversationContextMessage,
  ConversationMessage,
  EditOperation,
  ErrorCorrectionContext,
} from "@/types/conversation";
import {
  MODELS,
  type GenerationErrorType,
  type ModelId,
  type StreamPhase,
} from "@/types/generation";
import { PanelLeftClose, PanelLeftOpen, RotateCcw } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { Logo } from "@/components/logo";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { useConfirm } from "@/components/ModalProvider";

export interface ChatSidebarRef {
  triggerGeneration: (options?: {
    silent?: boolean;
    attachedImages?: string[];
    storyboard?: any[];
    customPrompt?: string;
    forceInitial?: boolean;
  }) => void;
}

interface ChatSidebarProps {
  messages: ConversationMessage[];
  pendingMessage?: {
    skills?: string[];
    startedAt: number;
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  hasManualEdits: boolean;
  onResetChat?: () => void;
  // Generation callbacks
  onCodeGenerated?: (code: string) => void;
  onStreamingChange?: (isStreaming: boolean) => void;
  onStreamPhaseChange?: (phase: StreamPhase) => void;
  onError?: (
    error: string,
    type: GenerationErrorType,
    failedEdit?: EditOperation,
  ) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  currentCode?: string;
  conversationHistory?: ConversationContextMessage[];
  previouslyUsedSkills?: string[];
  isFollowUp?: boolean;
  onMessageSent?: (prompt: string, attachedImages?: string[]) => void;
  onGenerationComplete?: (
    code: string,
    summary?: string,
    metadata?: AssistantMetadata,
  ) => void;
  onErrorMessage?: (
    message: string,
    errorType: "edit_failed" | "api" | "validation",
  ) => void;
  errorCorrection?: ErrorCorrectionContext;
  onPendingMessage?: (skills?: string[]) => void;
  onClearPendingMessage?: () => void;
  // Frame capture props
  Component?: ComponentType | null;
  fps?: number;
  durationInFrames?: number;
  currentFrame?: number;
  storyboard?: any[];
  audioSettings?: {
    includeSFX: boolean;
    includeSpeech: boolean;
  };
  projectId: string; // Required for payment verification
}

export const ChatSidebar = forwardRef<ChatSidebarRef, ChatSidebarProps>(
  function ChatSidebar(
    {
      messages,
      pendingMessage,
      isCollapsed,
      onToggleCollapse,
      hasManualEdits,
      onResetChat,
      onCodeGenerated,
      onStreamingChange,
      onStreamPhaseChange,
      onError,
      prompt,
      onPromptChange,
      currentCode,
      conversationHistory = [],
      previouslyUsedSkills = [],
      isFollowUp = false,
      onMessageSent,
      onGenerationComplete,
      onErrorMessage,
      errorCorrection,
      onPendingMessage,
      onClearPendingMessage,
      Component,
      fps = 30,
      durationInFrames = 150,
      currentFrame = 0,
      storyboard: initialStoryboard,
      audioSettings,
      projectId,
    },
    ref,
  ) {
    const router = useRouter();
    const confirmAction = useConfirm();
    const promptRef = useRef<string>("");
    const [showDashboardConfirm, setShowDashboardConfirm] = useState(false);

    const { isLoading, runGeneration } = useGenerationApi();

    // Keep prompt ref in sync for use in triggerGeneration
    useEffect(() => {
      promptRef.current = prompt;
    }, [prompt]);

    const handleGeneration = async (options?: {
      silent?: boolean;
      attachedImages?: string[];
      storyboard?: any[];
      customPrompt?: string;
      forceInitial?: boolean;
    }) => {
      const currentPrompt = options?.customPrompt || promptRef.current;
      if (!currentPrompt.trim()) return;

      onPromptChange(""); // Clear input immediately

      // Automatic model logic: High for initial, Medium for edits
      const actualIsFollowUp = options?.forceInitial ? false : isFollowUp;
      const modelToUse: ModelId = actualIsFollowUp 
        ? "claude-sonnet-4-6-20251101-v1:0:medium" 
        : "claude-sonnet-4-6-20251101-v1:0:high";

      await runGeneration(
        currentPrompt,
        modelToUse,
        {
          currentCode,
          conversationHistory,
          previouslyUsedSkills,
          isFollowUp: actualIsFollowUp,
          hasManualEdits,
          errorCorrection,
          frameImages: options?.attachedImages,
          durationSeconds: durationInFrames / fps,
          storyboard: options?.storyboard || initialStoryboard,
          audioSettings,
          projectId, // Pass projectId to API
        },
        {
          onCodeGenerated,
          onStreamingChange,
          onStreamPhaseChange,
          onError,
          onMessageSent,
          onGenerationComplete,
          onErrorMessage,
          onPendingMessage,
          onClearPendingMessage,
        },
        options,
      );
    };

    // Expose triggerGeneration via ref
    useImperativeHandle(ref, () => ({
      triggerGeneration: handleGeneration,
    }));

    return (
      <div
        className={cn(
          "flex flex-col bg-slate-50 transition-all duration-300",
          isCollapsed
            ? "w-12 shrink-0"
            : "w-full h-[40vh] min-[1000px]:h-auto min-[1000px]:w-[40%] min-[1000px]:min-w-[320px] min-[1000px]:max-w-[520px] shrink border-r border-slate-200",
        )}
      >
        {isCollapsed ? (
          <div className="flex justify-center px-4 mb-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleCollapse}
              className="text-muted-foreground hover:text-foreground"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          /* Chat area with subtle backdrop */
          <div className="flex-1 flex flex-col min-h-0 m-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <button 
                onClick={() => setShowDashboardConfirm(true)}
                className="hover:opacity-70 transition-opacity cursor-pointer text-left"
              >
                <Logo />
              </button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    const isConfirmed = await confirmAction({
                      title: "Reset Production?",
                      description: "This will permanently clear your current conversation and reset all code changes. You cannot undo this.",
                      confirmText: "Reset Everything",
                      cancelText: "Keep Working",
                      variant: "danger"
                    });
                    if (isConfirmed) {
                      onResetChat?.();
                    }
                  }}
                  title="Reset Chat"
                  className="text-muted-foreground hover:text-foreground text-xs gap-1 h-7 px-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onToggleCollapse}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ChatHistory messages={messages} pendingMessage={pendingMessage} />

            {/* Input */}
            <ChatInput
              prompt={prompt}
              onPromptChange={onPromptChange}
              isLoading={isLoading}
              onSubmit={(attachedImages) =>
                handleGeneration({ attachedImages })
              }
              Component={Component}
              fps={fps}
              durationInFrames={durationInFrames}
              currentFrame={currentFrame}
            />
          </div>
        )}
        {/* Dashboard Confirmation Modal */}
        <AnimatePresence>
          {showDashboardConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDashboardConfirm(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative">
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                    <LogOut size={24} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Back to Dashboard?</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Your current progress will be safe. You can return and continue this production anytime from your dashboard.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => router.push('/dashboard')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold transition-all active:scale-[0.98]"
                    >
                      Yes, take me back
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => setShowDashboardConfirm(false)}
                      className="w-full text-slate-500 hover:text-slate-900 rounded-xl h-12 font-medium"
                    >
                      Wait, stay here
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
