"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  Download, 
  Zap, 
  CheckCircle2, 
  Rocket,
  CreditCard,
  RotateCcw
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
  color: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Welcome to Saas Explainer Studio",
    description: "Your AI-powered motion designer. Think of it as 'Lovable' for video creation. Transform your SaaS UI into high-converting explainers in seconds.",
    icon: <Rocket className="w-8 h-8" />,
    tips: ["Start by creating a new project", "Paste your app URL", "Let the AI analyze your brand"],
    color: "from-rose-500 to-orange-500"
  },
  {
    id: 2,
    title: "The Art of Prompting",
    description: "Better prompts mean better results. Be specific about the vibe, pacing, and camera movements. The more context you give, the more cinematic the output.",
    icon: <Sparkles className="w-8 h-8" />,
    tips: ["Use words like 'Cinematic', 'Glassmorphism', 'Sleek'", "Mention specific features to highlight", "Define the target audience's vibe"],
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: 3,
    title: "Visual Assets Matter",
    description: "Ample screenshots lead to seamless transitions. Upload high-resolution captures of your dashboard, features, and logos to give the AI more to work with.",
    icon: <Layers className="w-8 h-8" />,
    tips: ["Upload your SVG logo for crisp renders", "Provide screenshots of key user flows", "Use the 'Upload Assets' button in the builder"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 4,
    title: "Export in 4K for Just $16",
    description: "Professional grade renders at your fingertips. Pay once, get high-fidelity 4K exports for your commercial projects. Plus, enjoy free unlimited edits forever.",
    icon: <CreditCard className="w-8 h-8" />,
    tips: ["4K High-Bitrate Export for $16", "Free unlimited project edits", "Lottie & GIF exports supported"],
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 5,
    title: "Revolutionary Editing",
    description: "Forget complex timelines. Refine your video using our AI-assisted frame replacement and scene-specific fine-tuning tools.",
    icon: <Zap className="w-8 h-8" />,
    tips: ["AI-assisted frame replacement", "Real-time scene specific refinement", "One-click brand identity swapping"],
    color: "from-amber-500 to-orange-600"
  }
];

const TinderCard = ({ slide, index, total, onSwipe }: { slide: Slide; index: number; total: number; onSwipe: () => void }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: total - index }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing p-4 md:p-8"
    >
      <div className="w-full h-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden relative">
        {/* Card Header with Icon */}
        <div className={`h-[35%] bg-gradient-to-br ${slide.color} flex items-center justify-center relative overflow-hidden`}>
           <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
           <motion.div 
             initial={{ scale: 0, rotate: -45 }}
             animate={{ scale: 1, rotate: 0 }}
             className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white border border-white/30 shadow-xl relative z-10"
           >
             {slide.icon}
           </motion.div>
           
           {/* Swipe indicators */}
           <div className="absolute top-4 left-6 right-6 flex justify-between opacity-30 pointer-events-none">
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-white">
                <ChevronLeft size={12} /> Swipe
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-white">
                Swipe <ChevronRight size={12} />
             </div>
           </div>
        </div>

        {/* Card Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight leading-tight">
              {slide.title}
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
              {slide.description}
            </p>

            <div className="pt-2 md:pt-4 space-y-2 md:space-y-3">
              {slide.tips.map((tip, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 text-[12px] md:text-[13px] font-bold text-gray-700"
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white bg-gradient-to-br ${slide.color} shrink-0`}>
                    <CheckCircle2 size={12} />
                  </div>
                  <span className="line-clamp-2">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 pt-4">
             <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                Card {slide.id} of {total}
             </div>
             <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${slide.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(slide.id / total) * 100}%` }}
                />
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function OnboardingTour({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [deck, setDeck] = useState<Slide[]>(slides);

  const handleSwipe = () => {
    setDeck(prev => {
      const [first, ...rest] = prev;
      return [...rest, first]; // Cycle the deck
    });
  };

  const handleFinish = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-900/60 backdrop-blur-xl p-4 md:p-8 overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-rose-500/15 rounded-full blur-[160px]" />
           <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/15 rounded-full blur-[160px]" />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        </div>

        {/* Top Navigation */}
        <div className="w-full max-w-sm mb-6 flex justify-between items-center px-2 relative z-10">
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 leading-none mb-1">Interactive</span>
              <span className="text-2xl font-[var(--font-outfit)] font-black text-white">Project Tour</span>
           </div>
           <button 
              onClick={handleFinish}
              className="group p-3 bg-white/10 hover:bg-white text-white hover:text-gray-900 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95"
            >
              <X size={20} strokeWidth={3} />
            </button>
        </div>

        {/* Deck Container */}
        <div className="relative w-full max-w-[380px] aspect-[4/5.5] md:aspect-[3/4.2]">
          <div className="relative w-full h-full">
            <AnimatePresence mode="popLayout">
              {deck.map((slide, index) => {
                // Render top 3 cards for depth stack
                if (index > 2) return null;
                
                return (
                  <motion.div
                    key={slide.id}
                    initial={index === 0 ? { scale: 0.9, y: 0, opacity: 0 } : {}}
                    animate={{ 
                      scale: 1 - index * 0.05, 
                      y: index * 12, 
                      opacity: 1,
                      zIndex: deck.length - index,
                      filter: `blur(${index * 1.5}px)`
                    }}
                    exit={{ x: 500, rotate: 45, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <TinderCard 
                      slide={slide} 
                      index={index} 
                      total={slides.length} 
                      onSwipe={handleSwipe} 
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Finish Trigger */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 relative z-10"
        >
          <button 
            onClick={handleFinish}
            className="px-12 py-5 bg-white text-gray-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-5px_rgba(255,255,255,0.2)] hover:bg-rose-600 hover:text-white hover:translate-y-[-4px] active:translate-y-0 transition-all border border-white/50"
          >
            I'm ready to build
          </button>
        </motion.div>

        {/* Swipe Instruction */}
        <motion.p 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-6 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2"
        >
          <ChevronLeft size={12} /> Swipe cards to explore <ChevronRight size={12} />
        </motion.p>
      </div>
    </AnimatePresence>
  );
}
