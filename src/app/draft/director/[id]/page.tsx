"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
  Save,
  Monitor,
  Camera
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface Scene {
  index: number;
  title: string;
  prompt: string;
  duration: number;
  approved?: boolean;
}

export default function DraftDirectorPage() {
  return (
    <ProtectedRoute>
      <DraftDirectorContent />
    </ProtectedRoute>
  );
}

function DraftDirectorContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  
  const [project, setProject] = useState<any>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    // Using onSnapshot for real-time updates as Director AI finishes analysis
    const unsubscribe = onSnapshot(doc(db, "projects", id as string), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProject(data);
        if (data.scenes) {
          const initializedScenes = data.scenes.map((s: Scene) => ({
            ...s,
            approved: s.approved ?? false
          }));
          setScenes(initializedScenes);
        }
        
        // If we just got the blueprint, stop loading
        if (data.status !== "DRAFT_ANALYZING") {
           setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [id]);

  const updateScenePrompt = (index: number, newPrompt: string) => {
    setScenes(prev => prev.map(s => s.index === index ? { ...s, prompt: newPrompt } : s));
  };

  const toggleApproval = (index: number) => {
    setScenes(prev => prev.map(s => s.index === index ? { ...s, approved: !s.approved } : s));
  };

  const handleForge = async () => {
    const toastId = toast.loading("Confirming Blueprint...");
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "projects", id as string), {
        scenes: scenes,
        status: "GENERATING",
        updatedAt: Date.now()
      });
      toast.success("Design Blueprint Locked! Moving to Studio...", { id: toastId });
      router.push(`/generate/${id}`);
    } catch (err) {
      console.error("Forge failed:", err);
      toast.error("Failed to sync blueprint. Check connection.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || project?.status === "DRAFT_ANALYZING") {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center p-8 text-center">
         <div className="relative mb-12">
            <div className="w-24 h-24 border-8 border-slate-100 border-t-rose-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-rose-600">
               <Sparkles size={32} fill="currentColor" className="animate-pulse" />
            </div>
         </div>
         <h1 className="text-4xl font-black text-slate-900 font-heading mb-4 tracking-tighter">Director is <span className="text-rose-600 italic">thinking...</span></h1>
         <div className="max-w-md bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <div className="space-y-6">
                <StatusItem active label="Grounding with Website Data" />
                <StatusItem active={false} label="Analyzing YouTube Style Reference" />
                <StatusItem active={false} label="Architecting 3D Production Blueprint" />
            </div>
         </div>
      </div>
    );
  }

  const allApproved = scenes.every(s => s.approved);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-inter selection:bg-rose-100 pb-40">
      <nav className="h-20 px-8 flex items-center justify-between border-b border-slate-50 bg-white/80 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/draft/plan" className="p-3 text-slate-300 hover:text-slate-900 bg-slate-50 rounded-2xl transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10 rotate-3">
            <Monitor size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.2em] italic font-[var(--font-outfit)] leading-none">Draft <span className="text-rose-600 italic">Blueprint</span></span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{project?.name || 'Untitled Production'}</span>
          </div>
        </div>

        <button 
          onClick={handleForge}
          disabled={isSaving}
          className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-rose-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
        >
          {isSaving ? <Save className="animate-spin" size={18} /> : <Zap size={18} className="fill-current" />}
          Forge Production
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-10 pt-20">
        <header className="mb-20 text-center">
           <div className="flex items-center justify-center gap-3 text-[10px] font-black text-rose-600 uppercase tracking-[0.5em] mb-6">
              <Camera size={14} /> Cinema Architect v2.2
           </div>
           <h1 className="text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter font-heading mb-8">
              Review your <span className="text-rose-600 italic">vision.</span>
           </h1>
           <div className="flex items-center justify-center gap-8">
              <VibeBadge value={project?.theme?.replace(/_/g, ' ') || 'Tech Minimal'} label="Production Theme" />
              <VibeBadge value={project?.branding?.tone || 'Premium'} label="Extraction Tone" />
              <VibeBadge value={project?.style_blueprint?.pacing || 'Dynamic'} label="Cinematic Pacing" />
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <AnimatePresence>
              {scenes.map((scene, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative bg-white rounded-[3rem] p-10 border-2 transition-all duration-500 ${
                    scene.approved ? 'border-emerald-500/20 shadow-2xl' : 'border-slate-50 hover:border-rose-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-8">
                     <div className="flex gap-4">
                        <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-lg ${
                           scene.approved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'
                        }`}>
                           {scene.index + 1}
                        </div>
                        <div>
                           <h3 className="font-black text-xl text-slate-900 tracking-tight">{scene.title}</h3>
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                             <Clock size={10} /> {scene.duration} Seconds
                           </span>
                        </div>
                     </div>
                     <button 
                        onClick={() => toggleApproval(scene.index)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          scene.approved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-200 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                     >
                        <CheckCircle2 size={24} />
                     </button>
                  </div>

                  <div className="space-y-4">
                     <textarea 
                        value={scene.prompt}
                        onChange={(e) => updateScenePrompt(scene.index, e.target.value)}
                        className="w-full h-40 bg-slate-50/50 border-2 border-transparent focus:border-rose-300 focus:bg-white rounded-3xl p-8 font-bold text-slate-900 outline-none transition-all resize-none leading-relaxed text-sm"
                     />
                  </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatusItem({ active, label }: { active: boolean, label: string }) {
  return (
    <div className={`flex items-center gap-4 transition-all ${active ? 'opacity-100' : 'opacity-40'}`}>
       <div className={`w-2 h-2 rounded-full ${active ? 'bg-rose-600 animate-ping' : 'bg-slate-200'}`} />
       <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">{label}</span>
    </div>
  );
}

function VibeBadge({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</span>
       <span className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest">{value}</span>
    </div>
  );
}
