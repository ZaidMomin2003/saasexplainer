"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Wand2, 
  Sparkles, 
  Check, 
  CameraOff, 
  Cpu, 
  Volume2, 
  History, 
  Download,
  Zap,
  MousePointer2,
  Clock
} from "lucide-react";

export const HighlightCards = () => {
  return (
    <section className="py-24 px-6 relative bg-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(225,29,72,0.02)_0%,_transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_rgba(249,115,22,0.02)_0%,_transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(240px,auto)]">
          
          {/* ── CARD 1: THE AI DIRECTOR (2x2) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 p-10 rounded-[3rem] bg-slate-50 border border-slate-100 flex flex-col justify-between group relative overflow-hidden transition-all duration-700 hover:border-rose-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)]"
          >
            {/* Graphic Component: Prompt to Video */}
            <div className="absolute top-10 right-10 w-48 h-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 flex flex-col gap-3 group-hover:-translate-y-4 transition-transform duration-700 rotate-6 group-hover:rotate-0">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Director Input</span>
               </div>
               <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-slate-50 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-slate-50 rounded-full" />
                  <div className="h-1.5 w-1/2 bg-rose-500/10 rounded-full" />
               </div>
               <div className="flex-1 mt-4 relative bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-rose-500 opacity-40"
                  >
                    <Sparkles size={40} />
                  </motion.div>
                  <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                       animate={{ width: ["0%", "100%", "0%"] }}
                       transition={{ duration: 3, repeat: Infinity }}
                       className="h-full bg-rose-500"
                     />
                  </div>
               </div>
            </div>

            <div>
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-rose-600 mb-8">
                <Wand2 size={28} />
              </div>
              <h3 className="text-4xl font-black tracking-tighter leading-none mb-4 italic italic-italic">
                Vibe edit the <br/> whole production.
              </h3>
              <p className="text-lg text-slate-500 font-medium max-w-sm">
                Describe the vibe in plain English. Our Director AI handles the motion graphics, transitions, and cinematic manifests instantly.
              </p>
            </div>
          </motion.div>

          {/* ── CARD 2: NO SCREEN RECORD (1x1) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 p-8 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col justify-between group relative overflow-hidden transition-all duration-500 hover:border-emerald-100 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.05)]"
          >
             <div className="flex-1 flex items-center justify-center mb-6">
                <div className="relative">
                   <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center text-white shadow-2xl relative z-10">
                      <CameraOff size={32} />
                   </div>
                   <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                   {/* Diagonal line X overlay */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-rose-500 rotate-45 rounded-full z-20 shadow-lg" />
                </div>
             </div>
             <div>
                <h4 className="text-xl font-black tracking-tight mb-2 uppercase">Zero Friction</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  No screen recordings. No mouse tracking. Just pure code-driven aesthetics.
                </p>
             </div>
          </motion.div>

          {/* ── CARD 3: RENDERING (1x1) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 p-8 rounded-[2.5rem] bg-slate-950 text-white flex flex-col justify-between group relative overflow-hidden transition-all duration-500"
          >
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <Cpu size={120} />
             </div>
             <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2">
                   <div className="px-2 py-0.5 rounded bg-rose-600 text-[10px] font-black uppercase tracking-tighter">Hyper-Render</div>
                </div>
                <div className="text-5xl font-black tracking-tighter text-white">0.2s</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Frame Bake Time</div>
             </div>
             <p className="text-sm text-slate-400 font-medium leading-relaxed">
               Powered by Remotion & AWS for instant, cloud-scale video compilation.
             </p>
          </motion.div>

          {/* ── CARD 4: UNLIMITED EDITS (2x1) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 p-10 rounded-[2.5rem] bg-white border border-slate-100 flex items-center gap-10 group relative overflow-hidden transition-all duration-500 hover:border-slate-300"
          >
             <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <History size={20} />
                   </div>
                   <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Unlimited Iterations</span>
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-4 leading-none italic italic-italic">
                  Iterate until <br/> it hits right.
                </h3>
                <p className="text-base text-slate-500 font-medium max-w-[280px]">
                   Tweak your scripts, swap assets, and adjust timing. No extra cost for baking.
                </p>
             </div>

             <div className="hidden lg:flex flex-col gap-3 flex-shrink-0 group-hover:translate-x-2 transition-transform duration-500">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`px-4 py-3 rounded-2xl border flex items-center gap-3 shadow-sm ${i === 3 ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-white border-slate-100 text-slate-400 opacity-50'}`}>
                     <Check size={14} strokeWidth={3} />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none text-left">Version 0.{i} Baked</span>
                  </div>
                ))}
             </div>
          </motion.div>

          {/* ── CARD 5: THE PRICE TAG (4x1 / Full Width Bottom) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 p-12 rounded-[3.5rem] bg-gradient-to-br from-rose-600 to-rose-700 text-white flex flex-col md:flex-row items-center justify-between group relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(225,29,72,0.3)] transition-all duration-700 hover:scale-[1.01]"
          >
             {/* Decorative Background Texture */}
             <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                   <pattern id="grid-white" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                   </pattern>
                   <rect width="100%" height="100%" fill="url(#grid-white)" />
                </svg>
             </div>

             <div className="relative z-10 mb-8 md:mb-0">
                <div className="flex items-center gap-3 mb-4">
                   <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Fair Play Protocol</div>
                   <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <Sparkles key={i} size={12} className="text-orange-300" />)}
                   </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4 italic italic-italic">
                  Commit only when <br/> you're 100% obsessed.
                </h3>
                <p className="text-lg text-white/80 font-medium max-w-xl">
                  Build and preview your entire video for free. Pay the <span className="text-white font-black underline decoration-white/30 underline-offset-4 tracking-normal">$29 studio fee</span> only when you ready to export the final Hollywood render.
                </p>
             </div>

             <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-[2rem] bg-white text-rose-600 flex items-center justify-center shadow-2xl scale-110 group-hover:scale-125 transition-transform duration-700">
                   <Download size={40} strokeWidth={2.5} />
                </div>
                <div className="text-center group-hover:translate-y-2 transition-transform duration-700">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Ready for Launch</span>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
