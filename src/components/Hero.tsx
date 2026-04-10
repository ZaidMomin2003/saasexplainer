"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import * as gtag from "@/lib/gtag";

export const Hero = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <section className="relative pt-40 pb-12 overflow-hidden bg-[#FCFCFD]">
      {/* ── Ambient background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-100 to-transparent opacity-40" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-100 to-transparent opacity-40" />
        <div className="absolute top-[35%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-40" />
        
        <motion.div 
          animate={{ 
            x: [0, 50, -30, 0], 
            y: [0, 20, 50, 0],
            scale: [1, 1.2, 0.9, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-rose-100/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 60, 0], 
            y: [0, -30, -10, 0],
            scale: [1, 1.1, 1.3, 1] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-pink-100/30 rounded-full blur-[120px]" 
        />
        
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#000" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* ── Headline Container ── */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* ── Animated Badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full border border-rose-100 bg-rose-50/30 shadow-sm"
        >
          <Sparkles size={14} className="text-rose-600 fill-rose-600/20" />
          <span className="text-[13px] font-bold text-gray-800 tracking-tight leading-none">
            Now includes <span className="text-rose-600 font-black">AI Speech & Music</span>
          </span>
          <div className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse ml-1" />
        </motion.div>

        {/* ── Main Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-[5.5rem] font-black tracking-tighter text-gray-950 leading-[0.85] mb-10 max-w-6xl"
        >
          The <span className="font-normal leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500 px-2 py-2 text-[1.1em]" style={{ fontFamily: 'var(--font-cursive)', textShadow: '0 10px 30px rgba(225,29,72,0.1)' }}>Lovable</span> <br /> of SaaS Explainer.
        </motion.h1>

        {/* ── Sub-headline ── */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-gray-500 font-medium tracking-tight mb-10 max-w-3xl leading-relaxed"
        >
          Paste your website link and logo. Our engine creates a <span className="text-gray-950 font-black tracking-tight">high-end SaaS animation</span> with SFX, music, and AI speech automatically. <span className="text-rose-600 font-black tracking-tight underline decoration-rose-200 underline-offset-4">No screen record required</span> (screenshots are appreciated). <span className="text-rose-600 font-black">Free to start</span>. No credit card required.
        </motion.p>

        {/* ── URL Input & Primary Actions ── */}
        <div className="relative w-full flex flex-col items-center mb-20 group">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
             className="w-full flex justify-center"
          >
            <div className="w-full max-w-2xl">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Globe size={20} className="text-gray-400 group-focus-within/input:text-rose-500 transition-colors" />
                </div>
                <input 
                  type="text"
                  placeholder="Paste your SaaS website link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white border-2 border-gray-100 rounded-full py-5 pl-16 pr-44 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50/50 shadow-xl shadow-black/5 transition-all"
                />
                <button
                  onClick={() => router.push("/waitlist")}
                  className="absolute right-3 top-2 bottom-2 bg-rose-600 text-white px-8 rounded-full font-black text-base tracking-tight hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-2 group/btn"
                >
                  Create Video <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
             <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
               className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-gray-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]"
             >
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                   <Check size={14} className="text-white" />
                </div>
                <span className="text-sm font-black text-gray-900 tracking-tight">Satisfied or Pay $0</span>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
               className="flex items-center gap-3 px-6 py-3 bg-gray-950 rounded-2xl border border-gray-800 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)]"
             >
                <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center">
                   <Sparkles size={14} className="text-white" />
                </div>
                <span className="text-sm font-black text-white tracking-tight">Unlimited Revisions</span>
             </motion.div>
          </div>
        </div>
      </div>

      {/* ── High-Fidelity Vimeo Preview ── */}
      <div className="mt-52 w-full max-w-6xl mx-auto px-6 relative scroll-mt-32 mb-32">
         <div className="relative group">
            {/* High-End Branding Label */}
            <div className="absolute -top-16 left-4 hidden md:flex items-center gap-6 pointer-events-none">
               <span className="text-4xl font-normal text-rose-500" style={{ fontFamily: 'var(--font-cursive)' }}>
                  Made with SaaSExplainer
               </span>
            </div>

            {/* Video Container (High-Contrast Browser Mockup) */}
            <div className="w-full aspect-video bg-neutral-950 rounded-3xl md:rounded-[3rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] relative border-[16px] border-white group-hover:border-rose-50 transition-all duration-700">
               {/* Browser Status Bar */}
               <div className="absolute top-0 inset-x-0 h-12 bg-white border-b border-gray-100 flex items-center px-8 gap-3 z-30">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-rose-100 border border-rose-200" />
                     <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-200" />
                     <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200" />
                  </div>
                  <div className="mx-auto bg-gray-100/50 px-12 py-1.5 rounded-lg text-xs font-black text-gray-400 tracking-tighter">
                     studio.saasexplainer.online/project/vibe
                  </div>
               </div>

               <div className="absolute inset-0 pt-12">
                  <iframe 
                    src="https://player.vimeo.com/video/824804225?autoplay=1&loop=1&background=1&muted=1" 
                    className="w-full h-full scale-[1.02]"
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowFullScreen
                  />
               </div>
               
               {/* Vibrant Overlays for Depth */}
               <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none z-20" />
            </div>
         </div>
      </div>
    </section>
  );
};
