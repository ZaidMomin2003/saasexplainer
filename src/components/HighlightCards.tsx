"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wand2, RefreshCw, Download, Sparkles, Check, DollarSign } from "lucide-react";

const cards = [
  {
    icon: <Wand2 className="text-rose-600" size={28} />,
    title: "Vibe edit the video",
    desc: "Describe the vibe in English and watch our Director AI handle the motion graphics, transitions, and storyboards instantly.",
    span: "md:col-span-2",
    accent: "bg-rose-50",
    delay: 0,
    tag: "Director AI"
  },
  {
    icon: <RefreshCw className="text-rose-600" size={28} />,
    title: "Unlimited Iterations",
    desc: "Tweak your script, voice-over, and assets until it's perfect. No extra costs.",
    span: "md:col-span-1",
    accent: "bg-emerald-50",
    delay: 0.1,
    tag: "Free Edits"
  },
  {
    icon: <Download className="text-white" size={28} />,
    title: "Pay Only to Export",
    desc: "Generate and preview as much as you want. Commit only when you're 100% satisfied with the final result. Studio-grade quality for a flat $16 fee.",
    span: "md:col-span-3",
    accent: "bg-gray-950 text-white",
    delay: 0.2,
    tag: "Flat Pricing"
  }
];

export const HighlightCards = () => {
  return (
    <section className="py-12 md:py-16 px-6 relative bg-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(225,29,72,0.02)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: card.delay, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className={`${card.span} p-8 md:p-12 rounded-[3rem] border border-gray-100 flex flex-col justify-between group relative overflow-hidden transition-all duration-500 hover:border-rose-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] ${card.accent === 'bg-gray-950 text-white' ? 'bg-gray-950 text-white border-transparent' : 'bg-white'}`}
            >
              {/* Internal Sheen */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 blur-[50px] rounded-full" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${card.accent === 'bg-gray-950 text-white' ? 'bg-white/10 border-white/10' : 'bg-white'}`}>
                    {card.icon}
                  </div>
                  {card.tag && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${card.accent === 'bg-gray-950 text-white' ? 'text-rose-400' : 'text-gray-400 group-hover:text-rose-600'}`}>
                      {card.tag}
                    </span>
                  )}
                </div>

                <div className="mt-auto">
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter leading-none italic-italic">
                    {card.title}
                  </h3>
                  <p className={`text-lg font-medium leading-relaxed tracking-tight max-w-xl ${card.accent === 'bg-gray-950 text-white' ? 'text-white/60' : 'text-gray-500'}`}>
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Decorative Geometric Elements */}
              {card.title === "Pay Only to Export" && (
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none">
                  <DollarSign size={200} fill="currentColor" />
                </div>
              )}
              {card.title === "Vibe edit the video" && (
                <div className="absolute -bottom-5 -right-5 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 pointer-events-none">
                  <Sparkles size={160} fill="currentColor" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
