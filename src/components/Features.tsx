"use client";

import React from "react";
import { Clock, Download, Settings, RefreshCcw, HandCoins, Activity, Sparkles, MonitorSmartphone, MousePointer2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Clock size={24} className="text-rose-600" />,
    title: "10-Minute Generation",
    description: "Our distributed cloud engine renders your SaaS explainer in minutes, not days. Parallel processing at its finest.",
    size: "col-span-1 md:col-span-2",
    bg: "bg-white",
    delay: 0,
    tag: "Distrubuted Cloud"
  },
  {
    icon: <HandCoins size={24} className="text-rose-600" />,
    title: "$16 Flat Fee",
    description: "No subscription trap. Pay only when you're 100% happy with the result.",
    size: "col-span-1",
    bg: "bg-rose-50/50",
    delay: 0.1,
    tag: "Risk Free"
  },
  {
    icon: <Sparkles size={24} className="text-rose-600" />,
    title: "AI Scene Crafting",
    description: "Director AI analyzes your website assets to create custom mockups, transitions, and storyboards.",
    size: "col-span-1",
    bg: "bg-white",
    delay: 0.2,
    tag: "Generative AI"
  },
  {
    icon: <Activity size={24} className="text-white" />,
    title: "Pro Motion Graphics",
    description: "Every video is built with high-end physics, spring easing, and cinematic camera movements.",
    size: "col-span-1 md:col-span-2",
    bg: "bg-gray-950 text-white",
    delay: 0.3,
    tag: "After Effects Grade"
  },
  {
    icon: <MonitorSmartphone size={24} className="text-rose-600" />,
    title: "Multi-Platform Export",
    description: "One-click export for LinkedIn (Landscape), TikTok (Portrait), or Twitter (Square). Optimized for engagement.",
    size: "col-span-1 md:col-span-3",
    bg: "bg-white",
    delay: 0.4,
    tag: "Social Ready"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-12 md:py-16 px-6 relative overflow-hidden bg-white">
      {/* ── Ambient Background Elements ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-50/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <div className="mb-20 max-w-2xl px-4 md:px-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-rose-600" />
            <span className="text-[12px] font-black text-rose-600 uppercase tracking-[0.3em]">Capabilities</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black tracking-[-0.05em] text-gray-950 mb-8 leading-[0.9]"
          >
            Everything needed to <br />
            <span className="font-normal leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 px-4 py-2" style={{ fontFamily: 'var(--font-cursive)', textShadow: '0 0 40px rgba(225,29,72,0.1)' }}>ship high-end</span> video.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-medium leading-relaxed tracking-tight max-w-xl"
          >
            We've automated the entire production pipeline. No studios, no complex software, no infinite revision loops.
          </motion.p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: feature.delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               viewport={{ once: true }}
               className={`group relative flex flex-col p-8 md:p-12 rounded-[3.5rem] border border-gray-100 transition-all duration-700 hover:border-rose-200 hover:shadow-[0_40px_80px_-15px_rgba(225,29,72,0.1)] cursor-default overflow-hidden ${feature.size} ${feature.bg}`}
             >
                {/* Internal Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-rose-50/50 blur-[60px] rounded-full" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-12">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-xl shadow-black/5 border border-gray-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {feature.icon}
                    </div>
                    {feature.tag && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-rose-600 transition-colors">
                        {feature.tag}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter text-inherit leading-none">{feature.title}</h3>
                    <p className="opacity-60 leading-relaxed font-medium text-inherit/80 text-[17px] max-w-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Geometric Decoration */}
                <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 text-current pointer-events-none">
                   {idx % 2 === 0 ? <Zap size={200} fill="currentColor" /> : <MousePointer2 size={180} fill="currentColor" />}
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
