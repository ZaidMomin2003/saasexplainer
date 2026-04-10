"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Type, Sparkles, Volume2, Mic, Music2 } from "lucide-react";
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
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [includeSFX, setIncludeSFX] = useState(true);
  const [includeSpeech, setIncludeSpeech] = useState(true);
  const [includeMusic, setIncludeMusic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newScreenshots: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newScreenshots.push(reader.result as string);
        if (newScreenshots.length === files.length) {
          setScreenshots(prev => [...prev, ...newScreenshots].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !websiteUrl.trim() || !logo || loading) return;
    
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "projects"), {
        userId: user?.uid,
        name: name.trim(),
        website: websiteUrl.trim(),
        duration: 30,
        fps: 120,
        status: "PLANNING",
        createdAt: serverTimestamp(),
        audioSettings: {
          includeSFX,
          includeSpeech,
          includeMusic,
        },
        assets: {
          logo: logo,
          screenshots: screenshots
        },
        updatedAt: Date.now()
      });

      router.push(`/generate/${docRef.id}`);
      onClose();
    } catch (err) {
      console.error("Error creating project:", err);
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
                subtitle="Initializing cinematic manifests and production pipelines at 120 FPS..." 
               />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                 <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">One-Click Forge</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5" style={{ color: '#64748b' }}>Instant Elite Production</p>
              </div>
           </div>
           <button 
             onClick={onClose} 
             className="text-slate-300 hover:text-rose-600 transition-colors p-2 rounded-xl hover:bg-rose-50"
           >
             <X size={24} strokeWidth={2.5} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto max-h-[75vh]">
           <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                 <Type size={14} className="text-rose-500" /> Project Name
              </label>
              <input 
                autoFocus 
                type="text" 
                placeholder="Product Launch v1" 
                className="w-full text-lg font-bold p-5 bg-slate-100/50 border border-slate-200 rounded-2xl focus:border-rose-300 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-900" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={loading}
              />
           </div>

           <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                 <Sparkles size={14} className="text-rose-500" /> Website URL
              </label>
              <input 
                type="url" 
                placeholder="https://your-saas.com" 
                className="w-full text-lg font-bold p-5 bg-slate-100/50 border border-slate-200 rounded-2xl focus:border-rose-300 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-900" 
                value={websiteUrl} 
                onChange={(e) => setWebsiteUrl(e.target.value)} 
                disabled={loading}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                   Upload Logo
                </label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={loading}
                  />
                  <div className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${logo ? 'border-green-500 bg-green-50' : 'border-slate-200 group-hover:border-rose-300 bg-slate-50'}`}>
                    <div className={`p-2 rounded-lg ${logo ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 border border-slate-100'}`}>
                      <Type size={18} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest text-center ${logo ? 'text-green-700' : 'text-slate-600'}`}>{logo ? 'Logo Uploaded' : 'Drop Logo'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                   Screenshots
                </label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleScreenshotsChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    disabled={loading}
                  />
                  <div className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${screenshots.length > 0 ? 'border-green-500 bg-green-50' : 'border-slate-200 group-hover:border-rose-300 bg-slate-50'}`}>
                    <div className={`p-2 rounded-lg ${screenshots.length > 0 ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 border border-slate-100'}`}>
                      <Sparkles size={18} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest text-center ${screenshots.length > 0 ? 'text-green-700' : 'text-slate-600'}`}>
                      {screenshots.length > 0 ? `${screenshots.length} Loaded` : 'Drop UI Shots'}
                    </span>
                  </div>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-3">
              <button 
                type="button"
                onClick={() => setIncludeSFX(!includeSFX)}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  includeSFX ? 'border-rose-600 bg-rose-50/50 text-rose-600' : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                 <Volume2 size={16} />
                 <div className="text-[9px] font-black uppercase tracking-widest">Haptics</div>
              </button>

              <button 
                type="button"
                onClick={() => setIncludeMusic(!includeMusic)}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  includeMusic ? 'border-rose-600 bg-rose-50/50 text-rose-600' : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                 <Music2 size={16} />
                 <div className="text-[9px] font-black uppercase tracking-widest">Music</div>
              </button>

              <button 
                type="button"
                onClick={() => setIncludeSpeech(!includeSpeech)}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  includeSpeech ? 'border-rose-600 bg-rose-50/50 text-rose-600' : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                 <Mic size={16} />
                 <div className="text-[9px] font-black uppercase tracking-widest">Speech</div>
              </button>
           </div>

           <div className="pt-2">
              <button 
                type="submit" 
                disabled={!name.trim() || !websiteUrl.trim() || !logo || loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-rose-600 active:scale-[0.98] transition-all shadow-xl disabled:opacity-30 disabled:pointer-events-none group"
              >
                {loading ? "Baking Studio..." : "Forge Production"} 
                <ArrowRight size={22} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </form>
      </motion.div>
    </div>
  );
};
