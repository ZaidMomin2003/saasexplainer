"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Wand2, MonitorPlay } from "lucide-react";

export const EditorPrototype = () => {
  return (
    <section className="px-6 pb-32">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 mb-6 uppercase tracking-widest"
          >
            Vibe Editing
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-6 font-[var(--font-outfit)]"
          >
            Just chat with your Editor.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 font-medium leading-relaxed"
          >
            Don't drag clips or adjust keyframes. Tell the AI what you want to see, and watch it generate the timeline and motion graphics in real-time.
          </motion.p>
        </div>

        {/* UI Prototype / App Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="w-full relative max-w-[1000px] perspective-[2000px]"
        >
          {/* Decorative Elements behind mock */}
          <div className="absolute -inset-10 bg-gradient-to-b from-indigo-50/50 to-transparent blur-2xl rounded-[3rem] -z-10" />
          
          <div className="w-full bg-white rounded-t-[2rem] rounded-b-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-200/60 overflow-hidden transform-gpu flex flex-col">
            
            {/* Mockup Header */}
            <div className="h-14 bg-gray-50/80 border-b border-gray-100 px-6 flex items-center gap-4 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-32 py-1.5 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-400 flex items-center gap-2 shadow-sm">
                  <MonitorPlay size={12} />
                  saasvideo.com/project/landing-demo
                </div>
              </div>
            </div>

            {/* Mockup Body */}
            <div className="flex h-[500px] bg-gray-50/30 w-full">
              
              {/* Fake Sidebar AI Chat */}
              <div className="w-[30%] border-r border-gray-100 bg-white/50 p-6 flex flex-col justify-between">
                <div className="space-y-6">
                   <div className="flex items-center gap-2 mb-8">
                     <Wand2 size={16} className="text-indigo-600" />
                     <span className="text-sm font-black text-gray-900 font-[var(--font-outfit)]">AI Director</span>
                   </div>
                   
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                     className="bg-indigo-50 text-indigo-900 p-4 rounded-2xl rounded-tl-none text-xs font-medium leading-relaxed"
                   >
                     I've analyzed the Stripe landing page. Should we start with the "Payment Flow" or the "Dashboard Grid" scene?
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1.2 }}
                     className="bg-gray-900 text-white p-4 rounded-2xl rounded-tr-none text-xs font-medium self-end ml-10 shadow-md"
                   >
                     Let's focus on the Dashboard Grid. Make it fast paced.
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 2.0 }}
                     className="bg-indigo-50 text-indigo-900 p-4 rounded-2xl rounded-tl-none text-xs font-medium leading-relaxed flex items-center gap-3"
                   >
                     <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                     Generating timeline and animations...
                   </motion.div>
                </div>
                
                <div className="mt-auto h-12 bg-white border border-gray-200 rounded-xl px-4 flex items-center text-xs text-gray-400 font-medium shadow-sm">
                   Type a prompt for the AI...
                </div>
              </div>

              {/* Fake Canvas */}
              <div className="flex-1 p-8 flex flex-col min-w-0">
                 <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative flex items-center justify-center group w-full">
                    <div className="absolute inset-0 bg-indigo-50/50 flex flex-col items-center justify-center p-12">
                       <motion.div 
                         animate={{ y: [0, -5, 0] }} 
                         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                         className="w-full max-w-sm"
                       >
                          <div className="h-6 w-32 bg-indigo-200/50 rounded-full mb-4" />
                          <div className="h-12 w-full bg-gray-900 rounded-lg mb-4" />
                          <div className="flex gap-4">
                             <div className="h-32 w-1/2 bg-white border border-gray-100 rounded-xl shadow-sm" />
                             <div className="h-32 w-1/2 bg-white border border-gray-100 rounded-xl shadow-sm" />
                          </div>
                       </motion.div>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                       <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-indigo-600">
                          <Play className="fill-current ml-1" size={24} />
                       </div>
                    </div>
                 </div>

                 {/* Fake Timeline */}
                 <div className="mt-6 h-16 bg-white border border-gray-100 rounded-xl p-3 flex gap-2">
                    <div className="w-1/4 h-full bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">00:00</div>
                    <div className="flex-1 h-full bg-indigo-500 rounded-lg shadow-sm flex flex-col justify-center px-3 relative overflow-hidden">
                       <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/20" />
                       <span className="text-[10px] font-black text-white z-10">Dashboard Scene</span>
                       <div className="h-1 w-full bg-black/20 rounded-full mt-1 overflow-hidden z-10">
                          <motion.div 
                            initial={{ width: "0%" }} 
                            animate={{ width: "100%" }} 
                            transition={{ duration: 4, repeat: Infinity }}
                            className="h-full bg-white" 
                          />
                       </div>
                    </div>
                    <div className="w-1/4 h-full bg-gray-50 rounded-lg border border-gray-100 shrink-0" />
                 </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
};
