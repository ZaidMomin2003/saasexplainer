"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export const VideoSection = () => {
  return (
    <section id="demo" className="px-6 pb-32 pt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 mb-6 uppercase tracking-widest"
          >
            Product Demo
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-6 font-[var(--font-outfit)]"
          >
            See how it works in action
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 font-medium leading-relaxed"
          >
            Watch a raw, unedited preview of exactly how our AI director ingests a single link and generates a high-converting 4K explainer video in minutes.
          </motion.p>
        </div>

        <div className="rounded-[2.5rem] p-4 md:p-6 bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative aspect-video rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 group cursor-pointer flex flex-col items-center justify-center"
          >
            {/* Fallback image if video fails to load, or use actual dummy video */}
            <div className="absolute inset-0 bg-indigo-50/20 mix-blend-multiply flex items-center justify-center backdrop-blur-sm group-hover:bg-black/10 transition-colors z-10">
              <div className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center text-indigo-600 shadow-xl group-hover:scale-110 transition-transform">
                <Play className="fill-indigo-600 ml-1" size={40} />
              </div>
            </div>
            <img 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
              alt="Explainer Canvas" 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
