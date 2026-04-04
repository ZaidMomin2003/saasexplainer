"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Wand2, MonitorPlay, MessageCircle, Box } from "lucide-react";
import Link from "next/link";
import * as gtag from "@/lib/gtag";

export const Pricing = () => {
  return (
    <section id="pricing" className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto flex flex-col items-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} 
             whileInView={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-gray-200/50 text-[11px] font-black text-gray-500 mb-6 uppercase tracking-[0.2em]"
           >
             Pricing
           </motion.div>
           <motion.h2 
             initial={{ opacity: 0, y: 15 }} 
             whileInView={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-[4.5rem] font-black tracking-[-0.05em] text-gray-950 mb-10 leading-[0.95]"
           >
             The <span className="font-normal leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 px-4 py-2" style={{ fontFamily: 'var(--font-cursive)', textShadow: '0 0 40px rgba(225,29,72,0.1)' }}>Studio</span> grade <br /> of video generation.
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 10 }} 
             whileInView={{ opacity: 1, y: 0 }}
             className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl tracking-tight"
           >
             Zero subscription fees. Zero manual keyframing. Just pay for the hardware time when you're ready to download.
           </motion.p>
        </div>

        {/* Pricing Card */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
           
           {/* Left: Key features list */}
           <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                    { icon: <MessageCircle size={20} className="text-gray-900" />, title: "Natural Language Editing", desc: "Just say 'Move this to the top', and AI handles the motion logic." },
                    { icon: <Box size={20} className="text-gray-900" />, title: "Dynamic 3D Mockups", desc: "AI transforms screenshots into realistic high-end mockups." },
                    { icon: <Wand2 size={20} className="text-gray-900" />, title: "Studio Voice Synthesis", desc: "Automated, perfectly timed voice-overs synced to your visuals." },
                    { icon: <MonitorPlay size={20} className="text-gray-900" />, title: "AE-Grade Motion", desc: "Pixel-perfect easing and smooth transitions baked in." },
                 ].map((feat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group flex flex-col p-8 bg-gray-50/50 border border-gray-100 rounded-[2rem] hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
                    >
                       <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          {feat.icon}
                       </div>
                       <h4 className="font-black text-gray-950 mb-2 leading-none tracking-tight">{feat.title}</h4>
                       <p className="text-sm text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
                    </motion.div>
                 ))}
              </div>
              <div className="p-8 glass rounded-[2.5rem] border-gray-200/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-black/5">
                 <div>
                    <h3 className="text-2xl font-black mb-1 text-gray-950 tracking-tight">Drafting is free.</h3>
                    <p className="text-gray-500 font-medium text-sm">Scripts, revisions, and full previews. $0 forever.</p>
                 </div>
                 <div className="flex items-center gap-2 bg-gray-950/5 px-4 py-2 rounded-full border border-gray-950/10 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Render Pipeline Active</span>
                 </div>
              </div>
           </div>

           {/* Right: The actual pricing card */}
           <div className="lg:col-span-2">
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 className="h-full bg-gray-950 rounded-[3rem] p-12 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group"
              >
                 {/* Internal glow */}
                 <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-[80px] rounded-full" />
                 
                 <div className="relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-12">
                       <div>
                          <h4 className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] mb-3">One-Time License</h4>
                          <h3 className="text-3xl font-black tracking-tight leading-none text-white">Studio Render</h3>
                       </div>
                        <div className="bg-white/5 text-white/50 text-[9px] font-black px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-[0.2em]">
                           April Offer
                        </div>
                    </div>

                      <div className="flex flex-col gap-2 mb-10 p-6 bg-white/5 rounded-[2rem] border border-white/5 relative overflow-hidden group/price">
                         <div className="flex items-end gap-3 text-white">
                            <span className="text-7xl font-black tracking-[-0.05em] leading-[0.85] tabular-nums">$16</span>
                            <div className="flex flex-col mb-1 leading-none">
                               <span className="text-[11px] font-black opacity-40 uppercase tracking-[0.1em]">per render</span>
                               <span className="text-[10px] font-black text-red-500/80 mt-2 uppercase tracking-tighter line-through opacity-80 tabular-nums">Soon $49.00</span>
                            </div>
                         </div>
                         <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">
                               Valid until April 30
                            </p>
                            <Sparkles size={14} className="text-rose-400" />
                         </div>
                         
                         {/* subtle price glow */}
                         <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent scale-x-0 group-hover/price:scale-x-100 transition-transform duration-1000" />
                      </div>

                    <ul className="space-y-6 mb-12 flex-1">
                        {[
                           "Unlimited Edits & Previews",
                           "Remove All Watermarks",
                           "4K Ultra-HD MP4 Export",
                           "AI Native Voice-over",
                           "Commercial License",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-4 text-sm font-semibold text-white/80">
                             <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                <Check size={12} className="text-rose-400" />
                             </div>
                             {item}
                          </li>
                       ))}
                    </ul>

                    <Link 
                      href="/signup"
                      onClick={() => gtag.event({ action: 'pricing_sign_up_click', category: 'conversion' })}
                      className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-lg tracking-tight hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20 active:scale-[0.98] block text-center"
                    >
                      Start For Free
                    </Link>
                    <p className="text-center mt-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">No account shared required</p>
                 </div>
              </motion.div>
           </div>

        </div>

        {/* Footer trust line */}
        <div className="mt-32 text-gray-300 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-6 text-center">
           <span className="hidden sm:block w-16 h-px bg-gray-100"></span>
           Stop Editing. Start Prompting.
           <span className="hidden sm:block w-16 h-px bg-gray-100"></span>
        </div>

      </div>
    </section>
  );
};
