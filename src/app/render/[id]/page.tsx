"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  CircleDashed, 
  Download, 
  Rocket, 
  Sparkles, 
  Video, 
  Clock, 
  ShieldCheck, 
  CloudIcon,
  ArrowLeft,
  ExternalLink,
  Share2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Link from "next/link";

const steps = [
  { id: "preparing", label: "Preparing Assets", icon: Sparkles },
  { id: "rendering", label: "Rendering Frames", icon: Video },
  { id: "finalizing", label: "Finalizing Export", icon: Rocket },
  { id: "uploading", label: "Uploading to Cloud", icon: CloudIcon },
];

export default function RenderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, "projects", id as string), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProject(data);
        
        const currentProgress = data.render?.progress || 0;
        setProgress(currentProgress);

        // Adjust step index based on status and progress
        if (data.status === "preparing") {
          setCurrentStepIndex(0);
        } else if (currentProgress < 70) {
          setCurrentStepIndex(1);
        } else if (currentProgress < 90) {
          setCurrentStepIndex(2);
        } else {
          setCurrentStepIndex(3);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Real progress polling for Lambda
  useEffect(() => {
    if (!id || !project?.render?.renderId || progress >= 100) return;

    const poll = async () => {
      try {
        const res = await fetch("/api/lambda/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucketName: project.render.bucketName,
            id: project.render.renderId,
          }),
        });

        const data = await res.json();

        if (data.type === "progress") {
          const newProgress = Math.floor(data.progress * 100);
          if (newProgress > progress) {
             const projectRef = doc(db, "projects", id as string);
             await updateDoc(projectRef, {
               "render.progress": newProgress,
               "render.status": "rendering"
             });
          }
        } else if (data.type === "done") {
          const projectRef = doc(db, "projects", id as string);
          await updateDoc(projectRef, {
            "render.progress": 100,
            "render.publicUrl": data.url,
            "render.size": data.size,
            "render.completedAt": Date.now(),
            "status": "completed"
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    const interval = setInterval(poll, 4000);
    return () => clearInterval(interval);
  }, [id, project?.render?.renderId, progress]);

  const isCompleted = progress === 100;
  const downloadUrl = project?.render?.publicUrl;


  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-inter selection:bg-rose-100 relative overflow-hidden">
      {/* Immersive Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 blur-[140px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-400/10 blur-[140px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-violet-400/5 blur-[120px] rounded-full" 
        />
      </div>

      <header className="h-20 px-8 flex items-center justify-between z-50">
        <Link href="/dashboard" className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-bold text-sm bg-white/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/40 shadow-sm">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/40">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">PROJECT ID</span>
                <span className="text-[11px] font-mono text-slate-600 font-bold">{id}</span>
            </div>
            <button className="p-2.5 rounded-xl bg-white/40 backdrop-blur-md border border-white/40 text-slate-600 hover:text-slate-900 transition-colors">
                <Share2 size={18} />
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          {/* Main Glass Card - Compact Version */}
          <div className="glass shadow-premium rounded-[2.5rem] p-8 sm:p-12 border-white/60 relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-500/10 to-transparent blur-3xl opacity-50" />
            
            <div className="relative flex flex-col items-center">
              {/* Progress Visual - Scaled Down */}
              <div className="relative mb-8 scale-75 sm:scale-90">
                <div className="absolute inset-[-20%] bg-rose-500/10 blur-[60px] rounded-full animate-pulse" />
                
                {(() => {
                  const radius = 104;
                  const circumference = 2 * Math.PI * radius;
                  const segmentLength = (progress / 100) * circumference;
                  
                  return (
                    <svg className="w-56 h-56 transform -rotate-90">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#e11d48" />
                          <stop offset="100%" stopColor="#fb7185" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="112"
                        cy="112"
                        r={radius}
                        stroke="#edeff2"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="112"
                        cy="112"
                        r={radius}
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - segmentLength }}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(225,29,72,0.4)]"
                      />
                    </svg>
                  );
                })()}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center">
                    <motion.span 
                      key={progress}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-6xl font-black text-slate-900 font-heading tracking-tight tabular-nums"
                    >
                      {progress}<span className="text-2xl opacity-30">%</span>
                    </motion.span>
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 transition-colors ${isCompleted ? "text-rose-600" : "text-slate-400"}`}>
                      {isCompleted ? "SUCCESS" : "BAKING"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              <div className="text-center space-y-4 max-w-md">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading leading-tight tracking-tight">
                    {isCompleted ? "Ready for takeoff." : "Generating greatness."}
                  </h2>
                  <p className="text-slate-500 font-medium text-base leading-relaxed px-4">
                    {isCompleted 
                      ? "Your high-fidelity video is optimized and ready." 
                      : "We're currently stitching your motion frames."}
                  </p>
                </div>

                {/* Stepper Grid - More Compact */}
                <div className="grid grid-cols-4 gap-2 w-full pt-4">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isDone = idx < currentStepIndex || isCompleted;
                    const isActive = idx === currentStepIndex && !isCompleted;
                    
                    return (
                      <div 
                        key={step.id} 
                        className={`group relative p-2.5 rounded-xl transition-all duration-500 border ${
                           isDone 
                           ? "bg-rose-500/5 border-rose-500/10" 
                           : isActive 
                             ? "bg-white border-slate-200 shadow-md" 
                             : "bg-white/30 border-slate-100/30"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg mb-2 flex items-center justify-center mx-auto transition-all duration-500 ${
                          isDone 
                            ? "bg-rose-600 text-white shadow shadow-rose-200" 
                            : isActive 
                              ? "bg-rose-100 text-rose-600" 
                              : "bg-slate-100 text-slate-300"
                        }`}>
                          {isDone ? <CheckCircle2 size={12} strokeWidth={3} /> : (isActive ? <CircleDashed size={12} className="animate-spin" /> : <Icon size={12} />)}
                        </div>
                        <span className={`text-[7px] font-black uppercase tracking-[0.1em] block leading-tight truncate ${
                          isDone || isActive ? "text-slate-900" : "text-slate-400"
                        }`}>
                          {step.id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full sm:w-auto mt-8">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <button 
                        onClick={() => downloadUrl && window.open(downloadUrl, "_blank")}
                        className="group relative w-full sm:w-64 py-3.5 bg-slate-900 text-white rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-lg hover:translate-y-[-2px] active:scale-[0.98]"
                      >
                        Download
                        <Download size={18} strokeWidth={3} />
                      </button>
                      
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            1080P
                         </div>
                         <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            <Rocket size={12} className="text-blue-500" />
                            FAST CDN
                         </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-slate-400 font-bold text-[10px] bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/40"
                    >
                      <div className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
                      RENDERING...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-4 flex flex-col items-center">
        <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-40">
           Antigravity AI
        </div>
      </footer>
    </div>
  );
}
