"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, X, ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "notion",
    title: "Notion AI",
    category: "Product Explainer",
    vimeoId: "824804225",
    color: "bg-slate-900",
    tags: ["Glassmorphism", "3D Camera", "Sync Audio"]
  },
  {
    id: "stripe",
    title: "Stripe Billing",
    category: "Financial SaaS",
    vimeoId: "824804225",
    color: "bg-indigo-600",
    tags: ["High Fidelity", "Data Viz", "Cinematic"]
  }
];

export const Showcase = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <section id="showcase" className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Ambient background deco */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-rose-50/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
             >
               <Sparkles size={12} fill="currentColor" />
               Studio Showcase
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-4xl md:text-6xl font-black text-slate-950 tracking-tight leading-[0.9]"
             >
               Vibe is the <br/>
               <span className="text-rose-600">New Standard.</span>
             </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 font-medium max-w-sm"
          >
            See how the world's most high-growth startups use Bake Studio to forge cinematic product stories.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative cursor-pointer flex flex-col"
              onClick={() => setSelectedProject(project)}
            >
              {/* Mobile Text Info (Visible only on mobile) */}
              <div className="md:hidden mb-6 px-2">
                 <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1 block">
                    {project.category}
                 </span>
                 <h3 className="text-3xl font-black text-slate-950 tracking-tight mb-4">
                    {project.title}
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 uppercase tracking-wider border border-slate-200">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="relative aspect-[16/10] rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-slate-200/50 transition-all duration-700 group-hover:shadow-rose-500/10 group-hover:border-rose-500/20">
                {/* Device Frame UI Mockup (Desktop only) */}
                <div className="absolute inset-0 bg-slate-950 flex flex-col pt-4">
                   <div className="hidden md:flex items-center justify-center gap-1.5 mb-4 px-4 overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-slate-800 shrink-0" />
                      <div className="w-12 h-1 bg-slate-800 rounded-full shrink-0" />
                   </div>
                   <div className="flex-1 relative overflow-hidden pointer-events-none">
                      <iframe 
                        src={`https://player.vimeo.com/video/${project.vimeoId}?background=1&autoplay=1&loop=1&muted=1`} 
                        className="absolute inset-0 w-full h-full scale-[1.01]"
                        allow="autoplay; fullscreen"
                      />
                      {/* Play Button Overlay (Desktop only) */}
                      <div className="absolute inset-0 hidden md:flex items-center justify-center">
                         <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center scale-90 group-hover:scale-110 transition-transform duration-500">
                            <Play size={32} className="text-white fill-white ml-1" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Text Overlays (Desktop only) */}
                <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />
                
                <div className="absolute inset-0 p-6 md:p-8 hidden md:flex flex-col justify-end pointer-events-none">
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-0">
                      <div>
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 block">
                          {project.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {project.tags.map((tag, i) => (
                             <span key={i} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
                               {tag}
                             </span>
                           ))}
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                         <ArrowUpRight size={20} />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden"
            >
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative w-full max-w-6xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-rose-600 hover:border-rose-500 transition-all active:scale-95 group"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>

                {/* Video Embed */}
                <div className="w-full h-full">
                  <iframe 
                    src={`https://player.vimeo.com/video/${selectedProject.vimeoId}?autoplay=1`} 
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowFullScreen
                  />
                </div>

                {/* Bottom Metadata Info */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 block">
                          Now Playing • {selectedProject.category}
                        </span>
                        <h4 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                          {selectedProject.title}
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        {selectedProject.tags.map((tag, i) => (
                           <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-[9px] font-bold text-white uppercase tracking-wider border border-white/5">
                             {tag}
                           </span>
                        ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Call to Action Badge */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-20 flex justify-center"
        >
           <div className="inline-flex items-center gap-8 px-8 py-4 bg-white rounded-3xl shadow-xl border border-slate-100">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                   </div>
                 ))}
              </div>
              <div className="h-6 w-[1px] bg-slate-100" />
              <p className="text-sm font-bold text-slate-900 tracking-tight">
                 Forging the future of <span className="text-rose-600">SaaS Content.</span>
              </p>
           </div>
        </motion.div>
      </div>
    </section>
  );
};
