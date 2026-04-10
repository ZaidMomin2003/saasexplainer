"use client";

import { Loader2, Undo2, Redo2, Sparkles, Zap, Play } from "lucide-react";
import { toast } from "sonner";
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
import { MASTER_ENGINE_TEMPLATE } from "@/templates/MasterEngine";

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
  const [showCode, setShowCode] = useState(false);

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

  // AUTO-HYDRATION LOGIC (Instantly Forge Draft 1)
  useEffect(() => {
    if (isFirstGeneration && project?.assets?.logo && project?.status === "PLANNING" && !isStreaming && !hasAutoStarted) {
      // Trigger Director API
      const handleHydration = async () => {
        setHasAutoStarted(true);
        toast.info("Director analyzing brand assets...");
        
        try {
          const res = await fetch("/api/director", {
            method: "POST",
            body: JSON.stringify({
              website: project.website,
              screenshots: project.assets.screenshots
            })
          });
          const data = await res.json();
          
          if (data.success) {
            const blueprint = data.blueprint;
            const hydratedCode = MASTER_ENGINE_TEMPLATE
              .replace("/* {{BRANDING_JSON}} */", JSON.stringify(blueprint.branding))
              .replace("/* {{CHAPTER_DATA_JSON}} */", JSON.stringify(blueprint.scenes))
              .replace("/* {{TOGGLES_JSON}} */", JSON.stringify(project.audioSettings));

            addAssistantMessage("Draft 1: Production Skeleton (120 FPS)", hydratedCode);
            setCode(hydratedCode);
            compileCode(hydratedCode);
            setHasGeneratedOnce(true);
          }
        } catch (e) {
          console.error("Hydration failed", e);
        }
      };

      handleHydration();
    }
  }, [isFirstGeneration, project, isStreaming, hasAutoStarted, addAssistantMessage, setCode, compileCode]);

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-rose-600" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-inter">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-400/5 blur-[120px] rounded-full" />
      </div>

      <ChatSidebar
        ref={chatSidebarRef}
        messages={messages}
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
        isFollowUp={!isFirstGeneration}
        onMessageSent={(p, img) => addUserMessage(p, img)}
        onGenerationComplete={(finalCode, summary, metadata) => {
          addAssistantMessage(summary || "Production refined", finalCode, metadata);
          setHasGeneratedOnce(true);
        }}
        Component={Component}
        fps={120}
        durationInFrames={30 * 120}
        currentFrame={currentFrame}
        audioSettings={project?.audioSettings}
        projectId={id as string}
      />

      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {project?.name || "Untitled Studio"}
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-200">120 FPS Forge</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCode(!showCode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                showCode 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-inner' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <code className={showCode ? "text-rose-500" : "text-slate-400"}>&lt;/&gt;</code>
              {showCode ? "Designer View" : "Engine Logic"}
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-2">
              {project?.scenes && project.scenes.map((scene: any, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSceneIndex(i);
                    chatSidebarRef.current?.triggerGeneration({
                      customPrompt: `REPRODUCTION LOGIC: Update Chapter ${i + 1}: "${scene.title}". 
                      Current Instruction: ${scene.prompt}.
                      Identify the constant block "CHAPTER_${i + 1}_...".
                      SURGICALLY update the visual logic. Use type: "edit".`,
                    });
                  }}
                  disabled={isStreaming}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                >
                  Phase {i + 1}
                </button>
              ))}
            </div>
          </div>

            <RenderControls
              code={code}
              durationInFrames={30 * 120}
              fps={120}
              projectId={(id as string) || ""}
              projectName={project?.name || "Untitled Production"}
            />
        </header>

        <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
          <section className={`bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative group overflow-hidden transition-all duration-500 flex flex-col ${
            showCode ? 'h-[35%] p-4' : 'flex-1 p-8'
          }`}>
            <AnimationPlayer
                Component={Component}
                durationInFrames={30 * 120}
                fps={120}
                isCompiling={isCompiling}
                isStreaming={isStreaming}
                error={generationError?.message || codeError || null}
                code={code}
                onRuntimeError={setRuntimeError}
                onFrameChange={setCurrentFrame}
                onDurationChange={() => {}}
                onFpsChange={() => {}}
              />
          </section>

          {showCode && (
            <section className="flex-1 min-h-0 bg-white rounded-[2rem] p-4 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8">
              <CodeEditor
                code={code}
                onChange={handleCodeChange}
                isStreaming={isStreaming}
                streamPhase={streamPhase}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

const GeneratePage: NextPage = () => (
  <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><Loader2 className="animate-spin text-rose-600" /></div>}>
    <GeneratePageContent />
  </Suspense>
);

export default GeneratePage;
