"use client";

import React from "react";
import { ArrowRight, Sparkles, Zap, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as gtag from "@/lib/gtag";

export const CTA = () => {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <motion.div 
         initial={{ opacity: 0, scale: 0.98 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
         className="max-w-5xl mx-auto bg-gray-950 p-12 md:p-20 rounded-[3rem] relative z-10 text-center flex flex-col items-center overflow-hidden border border-white/10 group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
      >
        {/* Cinematic Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(225,29,72,0.1)_0%,_transparent_50%)] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.05)_0%,_transparent_50%)] pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
        
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-lg border border-white/20 relative z-20 group-hover:scale-110 transition-transform duration-500"
        >
           <Rocket className="text-gray-950 fill-gray-950" size={28} />
        </motion.div>
        
        <h2 className="text-4xl md:text-7xl font-black tracking-[-0.05em] leading-[0.95] mb-8 text-white relative z-20">
          Stop <span className="text-rose-600">Waiting</span>. <br /> Start <span className="font-normal leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 px-4 py-2" style={{ fontFamily: 'var(--font-cursive)', textShadow: '0 0 40px rgba(225,29,72,0.1)' }}>Shipping</span>.
        </h2>
        
        <p className="text-lg md:text-xl text-white/50 font-medium mb-12 max-w-xl mx-auto leading-relaxed tracking-tight relative z-20">
          The era of manual keyframes is over. <span className="text-white font-black">Get started for free</span> and join 124+ founders already building their dream explainers.
        </p>

        <div className="relative group/btn z-20 w-full sm:w-auto">
          {/* Animated Glow behind button */}
          <div className="absolute inset-x-0 -inset-y-4 bg-rose-600/30 blur-[30px] rounded-full opacity-40 group-hover/btn:opacity-80 transition-opacity duration-700 pointer-events-none" />
          
          <Link 
            href="/signup"
            onClick={() => gtag.event({ action: 'cta_sign_up_click', category: 'conversion' })}
            className="relative w-full sm:w-auto px-12 py-5 rounded-2xl bg-rose-600 text-white font-black text-xl flex items-center justify-center gap-3 transition-all duration-500 hover:bg-rose-700 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-rose-500/20 border border-white/5 group"
          >
             Start for free
             <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="mt-12 relative z-20 flex flex-col items-center gap-6">
           <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
              <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                 Founding member deal
              </div>
              <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                 Instant Access
              </div>
           </div>
        </div>
      </motion.div>
    </section>
  );
};
