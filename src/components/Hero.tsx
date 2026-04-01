"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Globe, DollarSign, Check, Sparkles, Play, MessageSquare, MousePointer2, BarChart3, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const Hero = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <section className="relative pt-40 pb-12 overflow-hidden bg-white">
      {/* ── Ambient background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-50/40 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-orange-50/30 blur-[120px] rounded-full" />
        
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#000" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* ── Floating Decorative Elements ── */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[18%] left-[8%] opacity-20 text-rose-600 hidden lg:block"
        >
          <Play size={48} fill="currentColor" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[28%] right-[10%] opacity-20 text-orange-400 hidden lg:block"
        >
          <Sparkles size={64} fill="currentColor" />
        </motion.div>

        {/* New Hovering Component 1: Video Timeline Card */}
        <motion.div 
          animate={{ x: [0, 10, 0], y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[45%] left-[5%] hidden xl:block"
        >
          <div className="p-4 rounded-2xl bg-white shadow-2xl border border-gray-100 backdrop-blur-xl flex flex-col gap-3 w-48">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-rose-500" />
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-rose-500" 
                />
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 flex-1 bg-gray-50 rounded-md border border-gray-100" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* New Hovering Component 2: Engagement Bubble */}
        <motion.div 
          animate={{ y: [0, 25, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[60%] right-[6%] hidden xl:block"
        >
          <div className="p-4 rounded-3xl bg-gray-950 shadow-2xl border border-gray-800 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-rose-600/20 flex items-center justify-center">
              <BarChart3 size={18} className="text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Engagement</span>
              <span className="text-sm font-bold text-white">+84% Conversion</span>
            </div>
          </div>
        </motion.div>

        {/* New Hovering Component 3: Cursor & Tooltip */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 hidden lg:block opacity-40 pointer-events-none"
        >
          <div className="relative">
            <MousePointer2 size={32} className="text-gray-950 fill-white" />
            <div className="absolute top-full left-full mt-2 bg-rose-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
              VIBE EDITING...
            </div>
          </div>
        </motion.div>

        {/* New Hovering Component 4: Feedback Card */}
        <motion.div 
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[20%] right-[12%] hidden lg:block"
        >
          <div className="p-4 rounded-2xl bg-white shadow-xl border border-gray-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <MessageSquare size={14} className="text-emerald-600" />
             </div>
             <span className="text-xs font-bold text-gray-900 tracking-tight italic">"This vibes so hard!"</span>
          </div>
        </motion.div>
      </div>

      {/* ── Headline Container ── */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* ── Animated Badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full border border-gray-100 bg-white/80 backdrop-blur-md shadow-sm"
        >
          <div className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[13px] font-bold text-gray-800 tracking-tight leading-none">
            Join <span className="text-rose-600">120+ founders</span> building their first videos
          </span>
          <ArrowRight size={14} className="text-gray-400 ml-1" />
        </motion.div>

        {/* ── Main Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-[6.5rem] font-black tracking-[-0.05em] text-gray-950 leading-[0.9] mb-10 max-w-5xl"
        >
          The <span className="font-normal leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 px-4 py-2 text-[1.15em]" style={{ fontFamily: 'var(--font-cursive)', textShadow: '0 0 40px rgba(225,29,72,0.1)' }}>Lovable</span> <br /> of SaaS Explainer.
        </motion.h1>

        {/* ── Sub-headline ── */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-gray-500 font-medium tracking-tight mb-14 max-w-3xl leading-relaxed"
        >
          Vibe edit your SaaS explainer video with Speech and text—<span className="text-gray-950 font-black tracking-tight">no screen record required</span>. <span className="text-gray-950 font-black tracking-tight">Start for free today</span> and get your first video in minutes. Edit unlimited and export only if you like it for <span className="text-rose-600 font-black underline decoration-rose-200 underline-offset-4">just $9</span>.
        </motion.p>

        {/* ── Primary Actions ── */}
        <div className="relative w-full flex flex-col items-center mb-32 group">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
             className="w-full flex justify-center"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-rose-600 text-white px-10 py-5 rounded-2xl font-black text-lg tracking-tight shadow-[0_25px_60px_-15px_rgba(225,29,72,0.4)] hover:bg-rose-700 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
              >
                Start for free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => document.getElementById("video-preview")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto bg-white text-gray-950 px-10 py-5 rounded-2xl font-black text-lg tracking-tight border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98] block text-center"
              >
                Watch Demo
              </button>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
             <motion.div 
               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
               className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-gray-100 shadow-xl shadow-black/5"
             >
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                   <Check size={12} className="text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-gray-900 tracking-tight">Unlimited Free Edits</span>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
               className="flex items-center gap-2 px-5 py-2.5 bg-gray-950 rounded-xl border border-gray-800 shadow-xl shadow-black/20"
             >
                <span className="text-sm font-bold text-white tracking-tight">$9 Per Export</span>
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                   <Sparkles size={12} className="text-rose-400" />
                </div>
             </motion.div>
          </div>
        </div>
      </div>

      {/* ── Full Width Widescreen Preview ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        id="video-preview"
        className="w-full relative px-0 scroll-mt-32"
      >
        <div className="w-full aspect-[21/9] bg-gray-950 relative group cursor-pointer overflow-hidden border-y border-gray-100/10">
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center shadow-xl scale-90 sm:scale-100">
                <Play size={32} className="text-gray-900 fill-current ml-1" />
              </div>
              <span className="text-white font-black text-xs uppercase tracking-widest bg-rose-600 px-4 py-2 rounded-full shadow-lg">Watch 2min Trailer</span>
            </div>
          </div>
          <img
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            alt="SaaS Video Preview"
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2564&auto=format&fit=crop"
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </motion.div>

      {/* Affiliate Section Hidden per user request */}
      {/* <div className="max-w-6xl mx-auto px-6">...</div> */}
    </section>
  );
};
