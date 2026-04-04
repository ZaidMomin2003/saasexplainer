"use client";

import { Loader2, Undo2, Redo2, Sparkles } from "lucide-react";
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
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

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
    undo,
    redo,
    canUndo,
    canRedo,
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

  // Sync activeSceneIndex with conversation history on load
  useEffect(() => {
    if (messages.length > 0 && project?.scenes) {
      let maxIndex = 0;
      messages.forEach(m => {
        if (m.role === "user") {
          const match = m.content.match(/Implement Scene (\d+)/);
          if (match) {
            const index = parseInt(match[1]) - 1;
            if (index > maxIndex) maxIndex = index;
          }
        }
      });
      setActiveSceneIndex(maxIndex);
    }
  }, [messages, project?.scenes]);

  /* Hollywood Workflow: Auto-start Scene 1 removed as per user request to avoid re-pasting prompts on visit */
  /*
    useEffect(() => {
      if (project?.scenes && project.scenes.length > 0 && !hasGeneratedOnce && !isStreaming && !hasAutoStarted) {
        setHasAutoStarted(true);
        const firstScene = project.scenes[0];
        
        setTimeout(() => {
          chatSidebarRef.current?.triggerGeneration({
            customPrompt: `INITIAL FORGE: Implement Scene 1: "${firstScene.title}". Duration: ${firstScene.duration}s. Visual Instructions: ${firstScene.prompt}`,
            forceInitial: true
          });
        }, 1000);
      }
    }, [project, hasGeneratedOnce, isStreaming, hasAutoStarted]);
  */

  const handleNextScene = useCallback(() => {
    if (!project?.scenes || activeSceneIndex >= project.scenes.length - 1) return;

    const nextIndex = activeSceneIndex + 1;
    const nextScene = project.scenes[nextIndex];

    setActiveSceneIndex(nextIndex);

    chatSidebarRef.current?.triggerGeneration({
      customPrompt: `FORGE NEXT SCENE: Implement Scene ${nextIndex + 1}: "${nextScene.title}". Duration: ${nextScene.duration}s. Visual Instructions: ${nextScene.prompt}. IMPORTANT: Integrate this scene seamlessly into the existing timeline (likely using <Series> or sequential blocks). DO NOT remove previous scenes.`,
    });
  }, [project, activeSceneIndex]);

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
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-200">Hollywood Studio</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[11px] text-slate-500 font-medium font-mono uppercase tracking-widest leading-none">
                  {project?.duration || 30}s • 30fps
                </p>
                <div className="h-1 w-1 bg-slate-300 rounded-full" />
                <p className="text-[11px] text-rose-600 font-black uppercase tracking-widest leading-none">
                  Scene {activeSceneIndex + 1} of {project?.scenes?.length || "?"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => {
                  const previousCode = undo();
                  if (previousCode !== null) {
                    setCode(previousCode);
                    compileCode(previousCode);
                  }
                }}
                disabled={!canUndo || isStreaming}
                className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-all text-slate-600"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button
                onClick={() => {
                  const nextCode = redo();
                  if (nextCode !== null) {
                    setCode(nextCode);
                    compileCode(nextCode);
                  }
                }}
                disabled={!canRedo || isStreaming}
                className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:pointer-events-none transition-all text-slate-600"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </button>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />

            <div className="flex items-center gap-2">
              {project?.scenes && project.scenes.map((scene: any, i: number) => {
                // If this is the next scene to be added (i.e. we have added up to i-1)
                // We'll show the button for any scene index that is greater than or equal to what we've 'active'
                if (i <= activeSceneIndex && messages.length > 0) return null;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveSceneIndex(i);
                      chatSidebarRef.current?.triggerGeneration({
                        customPrompt: `FORGE SCENE ${i + 1}: Implement Scene ${i + 1}: "${scene.title}". Duration: ${scene.duration}s. Visual Instructions: ${scene.prompt}. IMPORTANT: Integrate this scene seamlessly into the existing timeline. DO NOT remove previous scenes.`,
                      });
                    }}
                    disabled={isStreaming}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all disabled:opacity-20 shadow-lg active:scale-95 animate-in fade-in slide-in-from-right-2"
                  >
                    Forge Scene {i + 1}
                  </button>
                );
              })}

              {/* Fallback Next Scene button if no specific scene buttons are calculated but we aren't at the end */}
              {project?.scenes && activeSceneIndex < project.scenes.length - 1 && (!project.scenes[activeSceneIndex + 1] || messages.length === 0) && (
                <button
                  onClick={handleNextScene}
                  disabled={isStreaming}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all disabled:opacity-20 shadow-lg shadow-slate-900/10 active:scale-95"
                >
                  <Sparkles size={14} className="fill-current" />
                  Forge Scene {activeSceneIndex + 2}
                </button>
              )}
            </div>

            <RenderControls
              code={code}
              durationInFrames={parseInt(project?.duration || "30") * 30}
              fps={30}
              projectId={(id as string) || ""}
              projectName={project?.name || "Untitled Production"}
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
                onDurationChange={() => { }}
                onFpsChange={() => { }}
                isCompiling={isCompiling}
                isStreaming={isStreaming}
                error={generationError?.message || codeError || null}
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
