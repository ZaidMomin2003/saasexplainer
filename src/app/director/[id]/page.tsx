"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Zap, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Play, 
  Sparkles, 
  Clock, 
  Video,
  LayoutGrid,
  Save
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Link from "next/link";

interface Scene {
  index: number;
  title: string;
  prompt: string;
  duration: number;
  approved?: boolean;
}

export default function DirectorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  
  const [project, setProject] = useState<any>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const unsubscribe = onSnapshot(doc(db, "projects", id as string), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProject(data);
        if (data.scenes) {
          // Initialize approved state if not present
          const initializedScenes = data.scenes.map((s: Scene) => ({
            ...s,
            approved: s.approved ?? false
          }));
          setScenes(initializedScenes);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const updateScenePrompt = (index: number, newPrompt: string) => {
    setScenes(prev => prev.map(s => s.index === index ? { ...s, prompt: newPrompt } : s));
  };

  const toggleApproval = (index: number) => {
    setScenes(prev => prev.map(s => s.index === index ? { ...s, approved: !s.approved } : s));
  };

  const handleStartProduction = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "projects", id as string), {
        scenes: scenes,
        status: "GENERATING",
        updatedAt: Date.now()
      });
      router.push(`/generate/${id}`);
    } catch (err) {
      console.error("Failed to save storyboard:", err);
      alert("Failed to sync with studio. Check connection.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-rose-600 rounded-full animate-spin" />
        <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Opening Storyboard</p>
      </div>
    );
  }

  const allApproved = scenes.every(s => s.approved);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-inter selection:bg-rose-100">
      {/* Navbar */}
      <nav className="h-20 px-10 flex items-center justify-between border-b border-slate-50 shrink-0 bg-white/80 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href={`/plan/${id}`} className="p-3 text-slate-300 hover:text-slate-900 bg-slate-50 rounded-2xl transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
            <Video size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter uppercase italic font-[var(--font-outfit)] leading-none">Director Studio <span className="text-rose-600">Storyboard</span></span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{project?.name} • {project?.duration}s Rendering</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 px-6 py-2 border-r border-slate-100">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Approved</span>
                <span className="text-sm font-black text-rose-600">{scenes.filter(s => s.approved).length} / {scenes.length}</span>
             </div>
          </div>
          <button 
            onClick={handleStartProduction}
            disabled={isSaving}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
              allApproved 
                ? 'bg-rose-600 text-white shadow-rose-600/20 hover:bg-slate-900' 
                : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-rose-600'
            }`}
          >
            {isSaving ? <Save className="animate-spin" size={18} /> : <Zap size={18} className="fill-current" />}
            {allApproved ? "Initiate Production" : "Save & Continue"}
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-10 py-16">
        <header className="mb-16 space-y-4">
           <div className="flex items-center gap-3 text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">
              <Sparkles size={14} /> Cinema Architect v1.0
           </div>
           <h1 className="text-6xl font-black text-slate-900 tracking-tighter font-heading lowercase">
              Scene by Scene<span className="text-rose-600">.</span>
           </h1>
           <p className="text-slate-400 font-medium text-xl max-w-2xl">
              Review your production script. Edit the visual prompts to ensure the AI engine captures your exact designer intent.
           </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           <AnimatePresence>
              {scenes.map((scene, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 ${
                    scene.approved ? 'border-emerald-500/20 shadow-2xl shadow-emerald-500/5' : 'border-slate-100 hover:border-rose-100 shadow-sm hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-start justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-colors ${
                          scene.approved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'
                        }`}>
                           {scene.index + 1}
                        </div>
                        <div>
                           <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg">{scene.title}</h3>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              <Clock size={12} /> {scene.duration} Seconds
                           </div>
                        </div>
                     </div>
                     <button 
                       onClick={() => toggleApproval(scene.index)}
                       className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                         scene.approved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-300 hover:text-rose-600 hover:bg-rose-50'
                       }`}
                     >
                        {scene.approved ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                     </button>
                  </div>

                  <div className="space-y-4">
                     <label className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">
                        <Edit3 size={12} /> Visual Prompt
                     </label>
                     <textarea 
                        value={scene.prompt}
                        onChange={(e) => updateScenePrompt(scene.index, e.target.value)}
                        className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-6 font-bold text-slate-700 outline-none focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/5 transition-all resize-none leading-relaxed"
                     />
                  </div>

                  <div className="mt-6 flex items-center justify-between px-2">
                     <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${scene.approved ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${scene.approved ? 'text-emerald-600' : 'text-slate-300'}`}>
                           {scene.approved ? 'Locked' : 'Reviewing'}
                        </span>
                     </div>
                     <div className="text-[10px] font-mono text-slate-200 font-bold">
                        SCENE_{scene.index.toString().padStart(2, '0')}
                     </div>
                  </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-20 flex flex-col items-center">
            <button 
              onClick={handleStartProduction}
              className="group relative px-20 py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl flex items-center gap-4 hover:bg-rose-600 transition-all shadow-2xl active:scale-95"
            >
               <Zap size={28} className="fill-current group-hover:rotate-12 transition-transform" />
               Initiate Studio Render
               <Play size={24} fill="currentColor" className="ml-2" />
            </button>
            <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Sequential Forging Enabled</p>
        </div>
      </main>
    </div>
  );
}
