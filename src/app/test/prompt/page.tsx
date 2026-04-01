"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Sparkles, Terminal, CheckCircle2, ShieldCheck, Zap, Wand2, Loader2, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MasterPromptPage() {
  const [data, setData] = useState<any>(null);
  const [isBaking, setIsBaking] = useState(true);
  const [bakedPrompt, setBakedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('sandbox_project_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      setData(parsed);
      bakeMasterPrompt(parsed);
    }
  }, []);

  const bakeMasterPrompt = async (projectData: any) => {
    setIsBaking(true);
    
    // Simulate Gemini 3.1 Flash Lite Processing
    setTimeout(() => {
      const manifest = `[[ SYSTEM ROLE ]] 
You are a Senior Motion Designer and Lead Creative Technologist. Your task is to generate a Main.tsx Remotion component that rivals a $5,000 After Effects production.

[[ USER INPUTS ]]
URL: ${projectData.website || "N/A"}
LOGO: ${projectData.logo ? "User Uploaded (Base64)" : "Default Branding"}
SCREENSHOTS: ${projectData.screenshots?.length > 0 ? "Array(" + projectData.screenshots.length + ") User Uploaded" : "Generic Dashboard Mock"}
VIBE: ${projectData.style || "Apple Luxury"}
DURATION: ${projectData.duration || 30}s
TARGET AUDIENCE: ${projectData.targetAudience || "SaaS Decision Makers"}

[[ I. MOTION PHYSICS ENGINE ]]
Spring-Only Movement: Prohibit linear interpolation for UI elements. Use Remotion's spring() with these precise configs:
Standard Entry: { stiffness: 100, damping: 10, mass: 1 }
Snappy Text: { stiffness: 200, damping: 15, mass: 0.5 }
Heavy Device Slide: { stiffness: 50, damping: 20, mass: 2 }

The "Inertia" Rule: No element should ever reach a velocity of 0 abruptly. Use Easing.out(Easing.quad) for all camera pans to ensure a smooth "settle."

[[ II. VISUAL STYLING & COMPOSITION ]]
Dynamic Branding: Scan the URL. Extract the primary Hex code and use it for:
- Background mesh gradient colors.
- Box-shadow glow on active buttons.
- SVG cursor trail color.

Layered Glassmorphism: Implement the UI as a stack of z-index layers.
- Background: 4k Noise texture + slow-moving linear-gradient.
- Device: A 3D-rotated CSS MacBook/iPhone frame containing the user's screenshots.
- HUD: Floating glass panels (backdrop-filter: blur(12px)) with white 10% opacity borders.

[[ III. SECOND-BY-SECOND CINEMATOGRAPHY ]]
0s-5s (The Hook): Start with a pitch-black frame. Use a "Spotlight" effect where the user's logo is revealed via a circular mask that follows the cursor.
5s-15s (The Reveal): Transition to the "Vibe" background. Slide the device frame in from the bottom with a heavy spring. The screenshot should "scale up" from 1.1 to 1.0 within the frame to simulate a camera zoom.
15s-30s (The Interaction): Code a "Ghost Cursor" (SVG). It must move toward the most prominent button in the screenshot, "click" (scale 0.9), and trigger a "Ripple" effect (expanding circular border).
Final 5s (The CTA): Blur the entire scene. Bring the URL and Logo to the dead center. Use a "Magnetic" pull effect where the text slightly follows the mouse/center-point.

[[ IV. TECHNICAL CONSTRAINTS ]]
Framerate: 60fps for maximum fluidity.
Resolution: 1920x1080.
Audio Sync: Trigger sfx_pop at the peak of every spring entrance and sfx_click at the cursor's interaction frame.
No Boilerplate: Output only the functional React components. Ensure all imports (Remotion, Lucide-React for icons) are correct.

[[ BEGIN CODE GENERATION ]]
`;
      setBakedPrompt(manifest.trim());
      setIsBaking(false);
    }, 4000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bakedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-inter selection:bg-rose-100 p-6 md:p-12 lg:p-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 h-full">
        
        {/* Left Sidebar: Project Intel */}
        <div className="lg:w-1/3 space-y-12 shrink-0">
           <div className="space-y-6">
              <Link href="/test/plan" className="inline-flex items-center gap-2 text-slate-400 hover:text-rose-600 transition-all font-black text-xs uppercase tracking-widest group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Re-Draft
              </Link>
              <h1 className="text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 font-[var(--font-outfit)]">
                The <span className="text-rose-600">Manifest.</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium tracking-tight">
                Your **Senior Motion Designer** persona has been activated. The physics engine is now primed for <b>60FPS</b> production.
              </p>
           </div>

           <div className="space-y-4 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 text-rose-600 font-black text-xs uppercase tracking-widest">
                <ShieldCheck size={16} /> Technical Context
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</span>
                    <span className="text-sm font-black text-slate-900">{data.name || "Untitled"}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aesthetic</span>
                    <span className="text-sm font-black text-rose-600">{data.style || "Custom"}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assets</span>
                    <span className="text-sm font-black text-slate-900">{data.screenshots?.length || 0} Screenshots</span>
                 </div>
              </div>
              <div className="pt-4 flex gap-2 overflow-x-auto pb-2">
                 {data.logo && (
                    <div className="w-16 h-16 bg-white rounded-xl border-2 border-slate-100 p-2 shrink-0">
                       <img src={data.logo} className="w-full h-full object-contain" />
                    </div>
                 )}
                 {data.screenshots?.map((s: string, i: number) => (
                    <div key={i} className="w-16 h-16 bg-white rounded-xl border-2 border-slate-50 overflow-hidden shrink-0">
                       <img src={s} className="w-full h-full object-cover opacity-50" />
                    </div>
                 ))}
              </div>
           </div>

           <div className="pt-8 block">
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                 <div className="w-12 h-[1px] bg-slate-100" />
                 Production Status
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-400 italic">
                 {isBaking ? (
                    <span className="flex items-center gap-2 animate-pulse text-rose-600">
                       <Zap size={14} className="fill-current" /> High-Inertia Computation...
                    </span>
                 ) : (
                    <span className="flex items-center gap-2 text-green-500">
                       <CheckCircle2 size={14} /> manifest_v2_final.ts
                    </span>
                 )}
              </div>
           </div>
        </div>

        {/* Right Section: The Baked Prompt */}
        <div className="flex-1 flex flex-col min-h-[600px]">
           <AnimatePresence mode="wait">
              {isBaking ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col items-center justify-center space-y-12 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-100"
                >
                   <div className="relative">
                      <div className="w-32 h-32 border-8 border-slate-100 border-t-rose-600 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Layers size={40} className="text-rose-600 animate-pulse" />
                      </div>
                   </div>
                   <div className="text-center space-y-4">
                      <h3 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Activating Design Persona...</h3>
                      <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Consulting the Lead Technologist</p>
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col space-y-8"
                >
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-gray-950 rounded-xl flex items-center justify-center text-white shadow-xl">
                            <Terminal size={20} />
                         </div>
                         <h2 className="text-2xl font-black tracking-tight uppercase tracking-tight">Main.<span className="text-rose-600">ts</span> Prompt</h2>
                      </div>
                      <div className="flex gap-4">
                         <button 
                            onClick={copyToClipboard}
                            className={`flex items-center gap-3 px-8 p-4 rounded-2xl font-black transition-all shadow-2xl ${copied ? 'bg-green-500 text-white' : 'bg-gray-950 text-white hover:bg-rose-600'}`}
                          >
                            {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                            {copied ? "Prompt Stored!" : "Copy Manifest"}
                         </button>
                      </div>
                   </div>

                   <div className="flex-1 relative group">
                      <div className="absolute inset-0 bg-rose-600 blur-[120px] opacity-[0.05] group-hover:opacity-[0.08] transition-opacity" />
                      <div className="relative h-full min-h-[600px] bg-gray-950 rounded-[3rem] p-10 font-mono text-[13px] leading-relaxed text-slate-300 shadow-2xl overflow-y-auto border border-white/5 selection:bg-rose-500/30">
                         <pre className="whitespace-pre-wrap">{bakedPrompt}</pre>
                         
                         <div className="absolute top-10 right-10 flex gap-2">
                            <div className="w-2.5 h-2.5 bg-red-500/20 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-yellow-500/20 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-green-500/20 rounded-full" />
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

