"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: <Zap size={22} className="text-rose-600" />,
    step: "01",
    title: "Upload your Vibe",
    description: "Just drag and drop your screenshots and logos. No complex setup or URL crawling needed.",
    bg: "bg-rose-50 border-rose-100/50 shadow-sm"
  },
  {
    icon: <Sparkles size={24} className="text-gray-900" />,
    step: "02",
    title: "AI takes the wheel",
    description: "Our Director AI writes the script, selects the best layouts, and generates pixel-perfect motion graphics automatically.",
    bg: "bg-gray-50 border-transparent shadow-none"
  },
  {
    icon: <Download size={24} className="text-gray-900" />,
    step: "03",
    title: "Ready to Export",
    description: "Preview the full video for free. Ask for as many AI tweaks as you want, and pay only when you download.",
    bg: "bg-rose-50 border-rose-100/50 shadow-sm"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-16 px-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(225,29,72,0.02)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-black text-rose-600 mb-6 uppercase tracking-[0.2em]"
          >
            Process
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-[4.5rem] font-black tracking-[-0.05em] text-gray-950 mb-10 leading-[0.95]"
          >
            Link to video in <br /> <span className="font-normal leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 px-4 py-2" style={{ fontFamily: 'var(--font-cursive)', textShadow: '0 0 40px rgba(225,29,72,0.1)' }}>3 simple</span> clicks.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 font-medium leading-relaxed tracking-tight max-w-2xl"
          >
            We've abstracted away the timeline, the keyframes, and the rendering so you can focus purely on your product's message.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
               viewport={{ once: true }}
               className={`group relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5 ${step.bg}`}
             >
               <div className="flex items-center justify-between mb-12">
                 <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                   {step.icon}
                 </div>
                 <span className="text-6xl font-black text-gray-950/5 tracking-tighter transition-colors group-hover:text-gray-950/10">
                   {step.step}
                 </span>
               </div>
               
               <h3 className="text-2xl font-black text-gray-950 mb-4 tracking-tight">{step.title}</h3>
               <p className="text-gray-500 leading-relaxed font-medium text-[16px]">
                 {step.description}
               </p>
               
               {/* Internal glass sheen on hover */}
               <div className="absolute inset-x-4 top-4 bottom-4 rounded-[2rem] bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none" />
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
