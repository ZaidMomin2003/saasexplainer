"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Play, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center relative overflow-hidden px-6 selection:bg-indigo-100 selection:text-indigo-900 font-inter text-center">
      
      {/* ── Background Elements ── */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 blur-[150px] rounded-full pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50/50 blur-[150px] rounded-full pointer-events-none -ml-30 -mb-30" />
      
      {/* Subtle grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-bg" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-bg)" />
      </svg>

      <div className="relative z-10 max-w-2xl flex flex-col items-center">
        
        {/* ── Brand Logo ── */}
        <Link href="/" className="flex items-center gap-2 group mb-16 hover:opacity-80 transition-opacity">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-600/20">
            <Play size={14} className="fill-current ml-0.5" />
          </div>
          <span className="font-[var(--font-outfit)] font-black tracking-tight text-gray-900 text-2xl">
            SaaSVideo
          </span>
        </Link>

        {/* ── Main Illustration / 404 Animation ── */}
        <div className="relative mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[10rem] md:text-[14rem] font-black text-gray-900/5 leading-none select-none font-[var(--font-outfit)]"
          >
            404
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div
               animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 border border-indigo-50 relative"
             >
                <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-indigo-600 relative overflow-hidden">
                   <Search size={40} className="relative z-10 animate-pulse" />
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.2, 1],
                       opacity: [0.1, 0.2, 0.1]
                     }}
                     transition={{ duration: 3, repeat: Infinity }}
                     className="absolute inset-0 bg-indigo-500 rounded-full"
                   />
                </div>
                <h1 className="text-2xl md:text-3xl font-[var(--font-outfit)] font-black text-gray-900 mb-2 tracking-tight">Lost in the Clouds?</h1>
                <p className="text-gray-500 font-medium">We couldn't find the page you were looking for.</p>
                
                {/* Floating decor orbs */}
                <motion.div 
                   animate={{ y: [0, -10, 0] }} 
                   transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                   className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-12"
                >
                   <Sparkles size={20} />
                </motion.div>
             </motion.div>
          </div>
        </div>

        {/* ── Content & CTA ── */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="space-y-8"
        >
          <div className="max-w-md mx-auto">
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Don't worry, your link is safe. Head back to the homepage to turn your vision into a studio-quality explainer video.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-[var(--font-outfit)] font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 active:scale-[0.98] group ring-4 ring-transparent hover:ring-indigo-100"
            >
              <Home size={22} className="group-hover:-translate-y-0.5 transition-transform" />
              Back to Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="px-10 py-5 bg-white text-gray-900 border border-gray-100 rounded-2xl font-[var(--font-outfit)] font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/50 active:scale-[0.98] group"
            >
              <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>

          <div className="pt-12 text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-4 select-none">
             <span className="w-8 h-px bg-gray-200"></span>
             Trusted by over 100 founders
             <span className="w-8 h-px bg-gray-200"></span>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
