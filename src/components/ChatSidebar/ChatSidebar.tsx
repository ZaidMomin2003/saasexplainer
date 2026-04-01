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
    },
    ref,
  ) {
    const promptRef = useRef<string>("");

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
              <Logo />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Start over? This will clear the chat history and reset your animation.",
                      )
                    ) {
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
      </div>
    );
  },
);
