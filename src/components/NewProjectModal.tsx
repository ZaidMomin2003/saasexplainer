"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowRight, Clock, Type, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

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
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
                 <Sparkles size={20} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">New Project</h2>
           </div>
           <button 
             onClick={onClose} 
             className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-50"
           >
             <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
           <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-rose-600 uppercase tracking-widest">
                 <Type size={14} /> Project Name
              </label>
              <input 
                autoFocus 
                type="text" 
                placeholder="e.g. Acme SaaS Intro" 
                className="w-full text-xl font-bold p-5 rounded-2xl border-2 border-gray-100 focus:border-rose-400 outline-none transition-all placeholder:text-gray-300" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={loading}
              />
           </div>

           <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black text-rose-600 uppercase tracking-widest">
                 <Clock size={14} /> Video Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                 {durations.map((d) => (
                   <button
                     key={d.value}
                     type="button"
                     onClick={() => setDuration(d.value)}
                     disabled={loading}
                     className={`p-4 rounded-2xl border-2 text-left transition-all group ${
                       duration === d.value 
                         ? 'border-rose-600 bg-rose-50/50' 
                         : 'border-gray-50 hover:border-gray-200 bg-gray-50/30'
                     }`}
                   >
                      <div className={`text-sm font-black mb-0.5 ${duration === d.value ? 'text-rose-900' : 'text-gray-900'}`}>
                        {d.label}
                      </div>
                      <div className="text-[10px] font-medium text-gray-400 group-hover:text-gray-500">
                        {d.desc}
                      </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="pt-4">
              <button 
                type="submit" 
                disabled={!name.trim() || loading}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl disabled:opacity-30 disabled:pointer-events-none"
              >
                {loading ? "Creating..." : "Create Project"} <ArrowRight size={22} />
              </button>
           </div>
        </form>
      </motion.div>
    </div>
  );
};
