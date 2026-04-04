"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Clock, Type, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal = ({ isOpen, onClose }: NewProjectModalProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);

  const durations = [
    { value: "15", label: "15 Seconds", desc: "Short & punchy teaser" },
    { value: "30", label: "30 Seconds", desc: "Perfect for quick intros" },
    { value: "45", label: "45 Seconds", desc: "Great for social ads" },
    { value: "60", label: "60 Seconds", desc: "Standard explainer" },
    { value: "90", label: "90 Seconds", desc: "Deep dive detail" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    
    setLoading(true);

    try {
      // Create a new project in Firestore to get a persistent ID
      const docRef = await addDoc(collection(db, "projects"), {
        userId: user?.uid || "anonymous",
        name: name.trim(),
        duration: parseInt(duration),
        status: "PLANNING",
        createdAt: serverTimestamp(),
        discoveryStep: "LOGO",
        assets: {
          logo: null,
          screenshots: []
        }
      });

      // Navigate to the planning phase with the new ID
      router.push(`/plan/${docRef.id}`);
      onClose();
    } catch (err) {
      console.error("Error creating project:", err);
      // Fallback if Firebase fails
      router.push(`/plan/temp-${Date.now()}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex items-center justify-center p-12"
            >
               <Loader 
                title="Baking Studio" 
                subtitle="Initializing cinematic manifests and production pipelines..." 
               />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between px-10 py-10 border-b border-slate-100">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                 <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Production</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Initialize cinematic manifest</p>
              </div>
           </div>
           <button 
             onClick={onClose} 
             className="text-slate-300 hover:text-rose-600 transition-colors p-2 rounded-xl hover:bg-rose-50"
           >
             <X size={24} strokeWidth={2.5} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
           <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <Type size={14} className="text-rose-500" /> Production Title
              </label>
              <input 
                autoFocus 
                type="text" 
                placeholder="e.g. Acme SaaS Explainer v1" 
                className="w-full text-xl font-bold p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-900" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={loading}
              />
           </div>

           <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <Clock size={14} className="text-rose-500" /> Target Duration
              </label>
              <div className="grid grid-cols-2 gap-4">
                 {durations.map((d) => (
                   <button
                     key={d.value}
                     type="button"
                     onClick={() => setDuration(d.value)}
                     disabled={loading}
                     className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                       duration === d.value 
                         ? 'border-rose-600 bg-rose-50/50' 
                         : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                     }`}
                   >
                      <div className={`text-base font-bold mb-0.5 transition-colors ${duration === d.value ? 'text-rose-900' : 'text-slate-900'}`}>
                        {d.label}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        {d.desc}
                      </div>
                      
                      {duration === d.value && (
                        <div className="absolute top-3 right-3 w-4 h-4 bg-rose-600 rounded-full flex items-center justify-center">
                           <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                   </button>
                 ))}
              </div>
           </div>

           <div className="pt-2">
              <button 
                type="submit" 
                disabled={!name.trim() || loading}
                className="w-full py-6 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-rose-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-30 disabled:pointer-events-none group"
              >
                {loading ? "Initializing..." : "Create Production"} 
                <ArrowRight size={22} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </form>
      </motion.div>

    </div>
  );
};
