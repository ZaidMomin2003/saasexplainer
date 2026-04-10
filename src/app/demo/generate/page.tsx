"use client";

import { 
  Loader2, 
  Sparkles, 
  Layout, 
  Code2, 
  Save, 
  Play, 
  RefreshCw, 
  Zap, 
  Check, 
  ChevronRight,
  Monitor,
  AlertCircle,
  Hash,
  Layers,
  MousePointer2,
  List
} from "lucide-react";
import { toast } from "sonner";
import type { NextPage } from "next";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AnimationPlayer } from "@/components/AnimationPlayer";
import { RenderControls } from "@/components/AnimationPlayer/RenderControls";
import { CodeEditor } from "@/components/CodeEditor/CodeEditor";
import { useAnimationState } from "@/hooks/useAnimationState";

const SCENE_CATEGORIES = [
  { id: 'intro', name: 'Intro', icon: <Sparkles size={14} /> },
  { id: 'problem', name: 'Problem', icon: <AlertCircle size={14} /> },
  { id: 'painpoint', name: 'Painpoint', icon: <Hash size={14} /> },
  { id: 'solution', name: 'Solution', icon: <Zap size={14} /> },
  { id: 'features', name: 'Features', icon: <Layers size={14} /> },
  { id: 'demo', name: 'Demo', icon: <Monitor size={14} /> },
  { id: 'cta', name: 'CTA/Outro', icon: <MousePointer2 size={14} /> }
];

// VARIANT GENERATORS - Using String Concatenation to avoid host-side template literal bugs
const V1_EDITORIAL = (name: string) => "export const Scene = () => {\n  const frame = useCurrentFrame();\n  const { fps } = useVideoConfig();\n  const entry = spring({ frame, fps, durationInFrames: 30 });\n  const scale = interpolate(entry, [0, 1], [0.95, 1]);\n  return (\n    <AbsoluteFill style={{ backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n      <div style={{ opacity: entry, transform: \"scale(\" + scale + \")\", textAlign: 'center' }}>\n        <h1 style={{ color: '#fff', fontSize: 100, fontWeight: 900, letterSpacing: '-0.05em' }}>" + name.toUpperCase() + "</h1>\n        <div style={{ height: 4, width: entry * 200, backgroundColor: '#E11D48', margin: '20px auto' }} />\n      </div>\n    </AbsoluteFill>\n  );\n};";
const V2_GLASS = (name: string) => "export const Scene = () => {\n  const frame = useCurrentFrame();\n  const move = spring({ frame, fps: 120, durationInFrames: 60 });\n  return (\n    <AbsoluteFill style={{ backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n      <div style={{ \n        width: 800, height: 450, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)',\n        borderRadius: 40, border: '1px solid rgba(255, 255, 255, 0.1)',\n        display: 'flex', flexDirection: 'column', padding: 60,\n        opacity: move, transform: \"translateY(\" + ((1 - move) * 100) + \"px)\"\n      }}>\n        <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, fontSize: 24, marginBottom: 20 }}>PHASE: " + name.toUpperCase() + "</div>\n        <div style={{ height: 60, width: '70%', background: 'white', borderRadius: 12 }} />\n        <div style={{ height: 180, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 20, marginTop: 40 }} />\n      </div>\n    </AbsoluteFill>\n  );\n};";
const V3_DATA = (name: string) => "export const Scene = () => {\n  const frame = useCurrentFrame();\n  return (\n    <AbsoluteFill style={{ backgroundColor: '#000', color: '#fff' }}>\n      <div style={{ padding: 100 }}>\n        <div style={{ fontSize: 24, fontWeight: 900, color: '#E11D48', marginBottom: 20 }}>LIVE_TELEMETRY // " + name.toUpperCase() + "</div>\n        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>\n          {[1,2,3,4].map(i => {\n             const h = spring({ frame: frame - (i*10), fps: 120, durationInFrames: 60 });\n             return <div key={i} style={{ height: h * 400, background: '#1e293b', border: '1px solid #334155', alignSelf: 'end', borderRadius: 12 }} />\n          })}\n        </div>\n      </div>\n    </AbsoluteFill>\n  );\n};";
const V4_PRODUCT = (name: string) => "export const Scene = () => {\n  const frame = useCurrentFrame();\n  const enter = spring({ frame, fps: 120, durationInFrames: 60 });\n  return (\n    <AbsoluteFill style={{ backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n      <div style={{ \n        width: 1000, height: 600, background: 'white', borderRadius: 24, \n        boxShadow: '0 40px 100px -20px rgba(0,0,0,0.2)',\n        overflow: 'hidden', border: '1px solid #E2E8F0',\n        transform: \"scale(\" + (0.8 + enter * 0.2) + \")\", opacity: enter\n      }}>\n        <div style={{ height: 40, background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', paddingLeft: 20, gap: 8 }}>\n           <div style={{ width: 12, height: 12, borderRadius: 10, background: '#CBD5E1' }} />\n           <div style={{ width: 12, height: 12, borderRadius: 10, background: '#CBD5E1' }} />\n        </div>\n        <div style={{ padding: 60 }}>\n          <h2 style={{ color: '#0F172A', fontSize: 60, fontWeight: 900 }}>" + name.toUpperCase() + "</h2>\n        </div>\n      </div>\n    </AbsoluteFill>\n  );\n};";
const V5_3D = (name: string) => "export const Scene = () => {\n  const frame = useCurrentFrame();\n  const rot = interpolate(frame, [0, 480], [0, 20]);\n  return (\n    <AbsoluteFill style={{ backgroundColor: '#000', perspective: 1000 }}>\n       <div style={{ \n         width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',\n         transform: \"rotateY(\" + rot + \"deg) rotateX(\" + (rot/2) + \"deg)\"\n       }}>\n          <div style={{ width: 600, height: 400, background: 'white', borderRadius: 40, boxShadow: '0 50px 100px rgba(225, 29, 72, 0.2)' }}>\n             <div style={{ padding: 60, color: '#000', fontSize: 40, fontWeight: 900 }}>" + name.toUpperCase() + " [3D]</div>\n          </div>\n       </div>\n    </AbsoluteFill>\n  );\n};";
const V6_TECH = (name: string) => "export const Scene = () => {\n  const frame = useCurrentFrame();\n  return (\n    <AbsoluteFill style={{ backgroundColor: '#050510' }}>\n       <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle, #E11D48 0%, transparent 70%)' }} />\n       <div style={{ padding: 100, fontFamily: 'monospace' }}>\n          <div style={{ color: '#444' }}>$ wisdom init " + name.toLowerCase() + "</div>\n          <div style={{ color: '#E11D48', marginTop: 10 }}>[SUCCESS] Module compiled.</div>\n          <div style={{ color: '#fff', fontSize: 80, fontWeight: 900, marginTop: 40 }}>" + name.toUpperCase() + "()</div>\n       </div>\n    </AbsoluteFill>\n  );\n};";

function DemoLabPageContent() {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [activeDraftIdxs, setActiveDraftIdxs] = useState<number[]>(new Array(7).fill(0));
  const [labData, setLabData] = useState<string[][]>(() => {
    return SCENE_CATEGORIES.map(cat => [
      V1_EDITORIAL(cat.name).trim(),
      V2_GLASS(cat.name).trim(),
      V3_DATA(cat.name).trim(),
      V4_PRODUCT(cat.name).trim(),
      V5_3D(cat.name).trim(),
      V6_TECH(cat.name).trim()
    ]);
  });
  const [showCode, setShowCode] = useState(true);
  const [runtimeError, setRuntimeError] = useState(null);

  const activeCategory = SCENE_CATEGORIES[activeCategoryIdx];
  const activeDraftIdx = activeDraftIdxs[activeCategoryIdx];

  const MASTER_LIBRARY_SHELL = useMemo(() => {
    // STACKING LOGIC: We stitch all 7 scenes based on their selected variation
    const sceneAssignments = SCENE_CATEGORIES.map((cat, i) => {
      const draftCode = labData[i][activeDraftIdxs[i]];
      // Rename export const Scene to unique const to avoid collisions in the shell
      return draftCode.replace(/export const Scene =/g, "const Scene_" + i + " =");
    }).join("\n\n");

    return "import React from 'react';\nimport { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Series } from 'remotion';\nimport * as Icons from 'lucide-react';\n\n" + 
      sceneAssignments + 
      "\n\nexport const Main = () => {\n  return (\n    <Series>\n      " + 
      SCENE_CATEGORIES.map((_, i) => "<Series.Sequence durationInFrames={360}><Scene_" + i + " /></Series.Sequence>").join("\n      ") + 
      "\n    </Series>\n  );\n};";
  }, [labData, activeDraftIdxs]);

  const { code, Component, error: compilationError, isCompiling, setCode, compileCode } = useAnimationState(undefined);
  const codeError = compilationError || runtimeError;

  useEffect(() => {
    setCode(MASTER_LIBRARY_SHELL);
    compileCode(MASTER_LIBRARY_SHELL);
  }, [MASTER_LIBRARY_SHELL, setCode, compileCode]);

  const handleSnippetChange = (newSnippet: string) => {
    const newData = [...labData];
    newData[activeCategoryIdx][activeDraftIdx] = newSnippet;
    setLabData(newData);
  };

  const selectDraft = (idx: number) => {
    const newIdxs = [...activeDraftIdxs];
    newIdxs[activeCategoryIdx] = idx;
    setActiveDraftIdxs(newIdxs);
    toast.info("Active Variant Changed");
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <aside className="w-80 bg-slate-900/50 border-r border-white/5 flex flex-col shrink-0 z-30">
        <div className="p-8 border-b border-white/5">
           <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-2">Wisdom Lab</div>
           <h2 className="text-xl font-black italic tracking-tighter">Modular Builder</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
           {SCENE_CATEGORIES.map((cat, i) => (
             <button
               key={cat.id}
               onClick={() => setActiveCategoryIdx(i)}
               className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${
                 activeCategoryIdx === i ? 'bg-rose-600 border-rose-500 text-white' : 'bg-white/5 border-transparent text-slate-400'
               }`}
             >
               <div className="flex items-center gap-3">
                  {cat.icon}
                  <span className="text-xs font-black uppercase tracking-tight">{cat.name}</span>
               </div>
               <div className="px-2 py-0.5 rounded-lg bg-black/20 text-[9px]">V{activeDraftIdxs[i] + 1}</div>
             </button>
           ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest">{activeCategory.name}</div>
             <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onClick={() => selectDraft(i)}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${
                      activeDraftIdx === i ? 'bg-white border-white text-slate-900' : 'bg-white/5 border-white/5 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowCode(!showCode)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${showCode ? 'bg-white text-slate-900' : 'bg-transparent text-slate-400'}`}>
              <Code2 size={16} />{showCode ? "Focus Preview" : "Edit Scene Logic"}
            </button>
            <RenderControls code={code} durationInFrames={360 * 7} fps={120} projectId="modular-lab" projectName="Modular Sandbox" />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          <section className={`rounded-[2.5rem] bg-black border border-white/5 relative group overflow-hidden transition-all duration-700 flex flex-col ${showCode ? 'w-[45%]' : 'w-full'}`}>
             <AnimationPlayer Component={Component} durationInFrames={360 * 7} fps={120} isCompiling={isCompiling} isStreaming={false} error={codeError} code={code} onRuntimeError={setRuntimeError} onFrameChange={() => {}} onDurationChange={() => {}} onFpsChange={() => {}} />
          </section>

          {showCode && (
            <section className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right-8 duration-700">
               <div className="flex-1 bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border border-white/5 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-4 pt-2">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Code2 size={14} className="text-rose-500" /> Snippet Editor
                     </span>
                  </div>
                  <div className="flex-1 overflow-hidden rounded-2xl border border-white/5">
                    <CodeEditor code={labData[activeCategoryIdx][activeDraftIdx]} onChange={handleSnippetChange} isStreaming={false} />
                  </div>
               </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

const DemoLabPage: NextPage = () => (
  <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-rose-500" size={40} /></div>}>
    <DemoLabPageContent />
  </Suspense>
);

export default DemoLabPage;
