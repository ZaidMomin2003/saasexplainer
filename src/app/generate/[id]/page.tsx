"use client";

import { Loader2 } from "lucide-react";
import type { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimationPlayer } from "@/components/AnimationPlayer";
import { RenderControls } from "@/components/AnimationPlayer/RenderControls";
import { ChatSidebar, type ChatSidebarRef } from "@/components/ChatSidebar";
import { CodeEditor } from "@/components/CodeEditor/CodeEditor";
import { useAnimationState } from "@/hooks/useAnimationState";
import { useAutoCorrection } from "@/hooks/useAutoCorrection";
import { useConversationState } from "@/hooks/useConversationState";
import { useProjectState } from "@/hooks/useProjectState";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { EditOperation, AssistantMetadata, ErrorCorrectionContext } from "@/types/conversation";
import type { GenerationErrorType, StreamPhase } from "@/types/generation";

const MAX_CORRECTION_ATTEMPTS = 3;

function GeneratePageContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamPhase, setStreamPhase] = useState<StreamPhase>("idle");
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [generationError, setGenerationError] = useState<{
    message: string;
    type: GenerationErrorType;
    failedEdit?: EditOperation;
  } | null>(null);

  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionContext | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [prompt, setPrompt] = useState("");

  const {
    messages,
    hasManualEdits,
    pendingMessage,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    getFullContext,
    getPreviouslyUsedSkills,
    getLastUserAttachedImages,
    setPendingMessage,
    clearPendingMessage,
    isFirstGeneration,
    clearConversation,
  } = useConversationState(id);

  const { 
    discoveryStep, 
    assets, 
    script 
  } = useProjectState(messages);

  const {
    code,
    Component,
    error: compilationError,
    isCompiling,
    setCode,
    compileCode,
  } = useAnimationState(id as string);

  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const codeError = compilationError || runtimeError;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStreamingRef = useRef(isStreaming);
  const codeRef = useRef(code);
  const chatSidebarRef = useRef<ChatSidebarRef>(null);

  const { markAsAiGenerated, markAsUserEdited } = useAutoCorrection({
    maxAttempts: MAX_CORRECTION_ATTEMPTS,
    compilationError: codeError,
    generationError: generationError ? generationError : null,
    isStreaming,
    isCompiling,
    hasGeneratedOnce,
    code,
    errorCorrection: errorCorrection ? errorCorrection : null,
    onTriggerCorrection: useCallback(
      (correctionPrompt: string, context: ErrorCorrectionContext) => {
        setErrorCorrection(context);
        const lastImages = getLastUserAttachedImages();
        setTimeout(() => {
          chatSidebarRef.current?.triggerGeneration({
            silent: true,
            attachedImages: lastImages,
          });
        }, 100);
      },
      [getLastUserAttachedImages],
    ),
    onAddErrorMessage: addErrorMessage,
    onClearGenerationError: useCallback(() => setGenerationError(null), []),
    onClearErrorCorrection: useCallback(() => setErrorCorrection(null), []),
  });

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "projects", id as string), (doc) => {
      if (doc.exists()) {
        setProject(doc.data());
        if (doc.data().status === "PLANNING") {
          router.push(`/plan/${id}`);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      setLoading(false);
    });
    return () => unsub();
  }, [id, router]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    const wasStreaming = isStreamingRef.current;
    isStreamingRef.current = isStreaming;
    if (wasStreaming && !isStreaming) {
      markAsAiGenerated();
      compileCode(codeRef.current);
    }
  }, [isStreaming, markAsAiGenerated, compileCode]);

  useEffect(() => {
    // If project is loaded and we have a script from the plan phase, pre-fill it in the chat
    if (project && project.script && !hasAutoStarted) {
      setHasAutoStarted(true);
      
      const bakedPrompt = `Story approved! Here is the finalized script for the video: "${project.script}". Now, write the full Remotion animation code for this SaaS explainer. Use ALL skills (3D, transitions, mockups) to make it premium.`;
      
      setPrompt(bakedPrompt);
    }
  }, [project, hasAutoStarted]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (!isStreamingRef.current) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        markAsUserEdited();
        compileCode(newCode);
      }, 500);
    }
  }, [setCode, compileCode, markAsUserEdited]);

  const onGenerationComplete = useCallback((finalCode: string, summary?: string, metadata?: AssistantMetadata) => {
    addAssistantMessage(summary || "Code updated", finalCode, metadata);
    setHasGeneratedOnce(true);
    setGenerationError(null);
    setErrorCorrection(null);
  }, [addAssistantMessage]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-inter">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-400/5 blur-[120px] rounded-full" />
      </div>

      <ChatSidebar
        ref={chatSidebarRef}
        messages={messages}
        pendingMessage={pendingMessage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        hasManualEdits={hasManualEdits}
        onCodeGenerated={handleCodeChange}
        onStreamingChange={setIsStreaming}
        onStreamPhaseChange={setStreamPhase}
        onError={(m, t, f) => setGenerationError({ message: m, type: t, failedEdit: f })}
        prompt={prompt}
        onPromptChange={setPrompt}
        currentCode={code}
        conversationHistory={getFullContext()}
        previouslyUsedSkills={getPreviouslyUsedSkills()}
        isFollowUp={!isFirstGeneration}
        onMessageSent={(p, img) => addUserMessage(p, img)}
        onGenerationComplete={onGenerationComplete}
        onErrorMessage={addErrorMessage}
        errorCorrection={errorCorrection ?? undefined}
        onPendingMessage={setPendingMessage}
        onClearPendingMessage={clearPendingMessage}
        onResetChat={() => {
          clearConversation();
          setHasAutoStarted(false);
          setCode("");
        }}
        Component={Component}
        fps={30}
        durationInFrames={parseInt(project?.duration || "30") * 30}
        currentFrame={currentFrame}
      />

      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Studio Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                {project?.name || "Untitled Studio"}
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-200">Director Mode</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium font-mono uppercase tracking-widest leading-none mt-1">
                {project?.duration || 30}s • 30fps • 1080p Cinematic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <RenderControls 
              code={code} 
              durationInFrames={parseInt(project?.duration || "30") * 30} 
              fps={30} 
              projectId={id as string}
              projectName={project?.name}
            />
          </div>
        </header>

        {/* Studio Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
          <div className="flex-1 min-h-0 flex flex-col gap-6">
            {/* Preview Section */}
            <section className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative group overflow-hidden flex-1 flex flex-col">
               <AnimationPlayer
                Component={generationError ? null : Component}
                durationInFrames={parseInt(project?.duration || "30") * 30}
                fps={30}
                onDurationChange={() => {}} 
                onFpsChange={() => {}}
                isCompiling={isCompiling}
                isStreaming={isStreaming}
                error={generationError?.message || codeError || undefined}
                errorType={(generationError?.type as any) || "api"}
                code={code}
                onRuntimeError={setRuntimeError}
                onFrameChange={setCurrentFrame}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );
}

const GeneratePage: NextPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GeneratePageContent />
    </Suspense>
  );
};

export default GeneratePage;
