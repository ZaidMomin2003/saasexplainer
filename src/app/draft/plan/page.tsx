"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Globe, 
  Sparkles, 
  Video, 
  Upload, 
  Plus, 
  ChevronRight, 
  Trash2, 
  ArrowRight,
  Monitor,
  Loader2,
  CheckCircle2,
  Camera
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import imageCompression from 'browser-image-compression';

const THEMES = [
  { id: "tech_minimal", name: "Tech Minimal", desc: "Dark mode, neon highlights, clean geometry" },
  { id: "premium_luxury", name: "Premium Luxury", desc: "Gold accents, smooth ease, rich glassmorphism" },
  { id: "fast_paced", name: "Fast-Paced Explainer", desc: "Rapid cuts, high-tempo, vibrant 2D/3D shapes" },
  { id: "corporate_clean", name: "Corporate Professional", desc: "Light mode, trustworthy blues, soft shadows" },
];

export default function DraftPlanPage() {
  return (
    <ProtectedRoute>
      <DraftPlanContent />
    </ProtectedRoute>
  );
}

function DraftPlanContent() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isBaking, setIsBaking] = useState(false);
  
  const [website, setWebsite] = useState("");
  const [theme, setTheme] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Progressive reveal logic
  useEffect(() => {
    if (website.includes(".") && step === 1) {
       const timer = setTimeout(() => setStep(2), 800);
       return () => clearTimeout(timer);
    }
  }, [website, step]);

  useEffect(() => {
    if (theme && step === 2) {
       const timer = setTimeout(() => setStep(3), 800);
       return () => clearTimeout(timer);
    }
  }, [theme, step]);

  useEffect(() => {
    if (inspiration.includes("youtube.com") || inspiration.includes("youtu.be") && step === 3) {
       const timer = setTimeout(() => setStep(4), 800);
       return () => clearTimeout(timer);
    }
  }, [inspiration, step]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setIsUploading(true);
    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1280,
      useWebWorker: true
    };

    try {
      for (const file of Array.from(files)) {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setScreenshots(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(compressedFile);
      }
    } catch (err) {
      console.error("Compression failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateVideo = async () => {
    if (!website || !theme || isBaking) return;
    setIsBaking(true);
    
    const toastId = toast.loading("Analyzing Website & Style Reference...");

    try {
      // 1. Create Project in Firestore
      const docRef = await addDoc(collection(db, "projects"), {
        userId: user?.uid,
        name: "Cinematic Draft: " + (website.split('.')[0] || "Untitled"),
        website,
        theme,
        inspiration,
        status: "DRAFT_ANALYZING",
        createdAt: serverTimestamp(),
        updatedAt: Date.now(),
        audioSettings: {
          includeSFX: true,
          includeSpeech: true,
          includeMusic: true
        }
      });

      // 2. Trigger Gemini 2.5 Pro Director Mode (API call)
      const res = await fetch("/api/director", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: docRef.id,
          website,
          theme,
          inspiration,
          screenshots
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Director analysis failed");
      }

      const { blueprint } = await res.json();

      // 3. SECURE SYNC: Update Firestore from client-side (keeps authenticated permissions)
      await updateDoc(doc(db, "projects", docRef.id), {
        scenes: blueprint.scenes ?? [],
        branding: blueprint.branding ?? { primaryColor: "#E11D48", tone: "Minimal" },
        style_blueprint: blueprint.style_blueprint ?? { pacing: "dynamic" },
        status: "DRAFT_READY",
        updatedAt: Date.now()
      });

      toast.success("Architect's Blueprint Ready!", { id: toastId });
      router.push(`/draft/director/${docRef.id}`);
      
    } catch (err) {
      console.error("Discovery failed:", err);
      toast.error("Failed to sync with the Director engine. Check links.", { id: toastId });
    } finally {
      setIsBaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-inter selection:bg-rose-100 overflow-x-hidden">
      {/* Visual Accents */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-600 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600 blur-[150px] rounded-full" />
      </div>

      <nav className="h-20 px-8 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-rose-600 shadow-xl shadow-slate-900/10 rotate-3">
              <Sparkles size={20} fill="currentColor" />
           </div>
           <span className="text-sm font-black uppercase tracking-[0.2em] italic font-heading">Antigravity <span className="text-rose-600">Draft</span></span>
        </div>
        <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Discard Draft</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-8 pt-20 pb-40 relative z-10">
        <header className="mb-24">
           <div className="flex items-center gap-3 text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] mb-4">
              <Monitor size={14} /> Cinema Architect v2.0
           </div>
           <h1 className="text-7xl font-black text-slate-900 leading-[1.05] tracking-tight font-heading mb-6">
              Drafting your cinematic <span className="text-rose-600">blueprint.</span>
           </h1>
           <p className="text-xl text-slate-400 font-medium max-w-2xl">
              Fill in the vision manifest. Sequential intelligence will extract your brand and style reference automatically.
           </p>
        </header>

        <div className="space-y-20 relative">
          {/* Timeline Connector */}
          <div className="absolute left-6 top-10 bottom-10 w-[2px] bg-slate-100 -z-10" />

          {/* Line 1: Website */}
          <Section step={1} active={step >= 1} completed={step > 1}>
            <div className="text-2xl font-black text-slate-900 flex flex-wrap items-center gap-4">
               <span>I wanna create a SaaS explainer video for my business website</span>
               <input 
                 type="text"
                 placeholder="e.g. saasexplainer.online"
                 value={website}
                 onChange={(e) => setWebsite(e.target.value)}
                 className="bg-slate-50 border-b-4 border-rose-100 focus:border-rose-600 focus:bg-white px-4 py-2 text-rose-600 outline-none transition-all placeholder:text-slate-200 min-w-[200px]"
                 autoFocus
               />
               <span>.</span>
            </div>
          </Section>

          {/* Line 2: Theme */}
          <AnimatePresence>
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Section step={2} active={step >= 2} completed={step > 2}>
                  <div className="text-2xl font-black text-slate-900 flex flex-wrap items-center gap-4">
                    <span>The overall aesthetic should feel like</span>
                    <select 
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="bg-slate-50 border-b-4 border-rose-100 focus:border-rose-600 focus:bg-white px-4 py-2 text-rose-600 outline-none transition-all cursor-pointer min-w-[200px] appearance-none"
                    >
                      <option value="">Select Theme</option>
                      {THEMES.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <span>.</span>
                  </div>
                  {theme && (
                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{THEMES.find(t => t.id === theme)?.desc}</p>
                  )}
                </Section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Line 3: Inspiration */}
          <AnimatePresence>
            {step >= 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Section step={3} active={step >= 3} completed={step > 3}>
                  <div className="text-2xl font-black text-slate-900 flex flex-wrap items-center gap-4">
                    <span>And I’ve got this video inspiration:</span>
                    <div className="flex-1 min-w-[300px] relative">
                        <Video size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                          type="text"
                          placeholder="Paste a YouTube link..."
                          value={inspiration}
                          onChange={(e) => setInspiration(e.target.value)}
                          className="w-full bg-slate-50 border-b-4 border-rose-100 focus:border-rose-600 focus:bg-white pl-12 pr-4 py-2 text-rose-600 outline-none transition-all placeholder:text-slate-200"
                        />
                    </div>
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Line 4: Screenshots */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Section step={4} active={step >= 4} completed={screenshots.length > 0}>
                  <div className="text-2xl font-black text-slate-900 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <span>Plus, here are some raw captures of my dashboard:</span>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-white border-2 border-dashed border-rose-200 rounded-2xl text-rose-600 text-sm font-black flex items-center gap-2 hover:bg-rose-50 transition-all"
                      >
                         <Upload size={16} /> 
                         {isUploading ? "Uploading..." : "Drop Screenshots"}
                      </button>
                      <input 
                        type="file" 
                        multiple 
                        hidden 
                        ref={fileInputRef} 
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                    </div>

                    {/* Screenshot Preview */}
                    <div className="flex flex-wrap gap-4">
                      <AnimatePresence>
                        {screenshots.map((src, i) => (
                           <motion.div 
                             key={i} 
                             initial={{ opacity: 0, scale: 0.8 }} 
                             animate={{ opacity: 1, scale: 1 }} 
                             exit={{ opacity: 0, scale: 0.8 }}
                             className="group relative w-32 aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm"
                           >
                              <img src={src} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => setScreenshots(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                              >
                                 <Trash2 size={20} />
                              </button>
                           </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Final Logic CTA */}
          <AnimatePresence>
            {screenshots.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, y: 30 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 className="pt-20 flex flex-col items-center"
               >
                  <button 
                    onClick={handleCreateVideo}
                    disabled={isBaking}
                    className="group relative px-20 py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl flex items-center gap-4 hover:bg-rose-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                  >
                     {isBaking ? <Loader2 className="animate-spin" size={28} /> : <Sparkles size={28} fill="currentColor" />}
                     {isBaking ? "Analyzing Vision..." : "Craft my video"}
                     <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] flex items-center gap-2">
                     <Monitor size={12} /> Gemini 2.5 Pro Director Mode Enabled
                  </p>
               </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

function Section({ children, step, active, completed }: { children: React.ReactNode, step: number, active: boolean, completed: boolean }) {
  return (
    <div className={`relative flex gap-10 transition-all duration-700 ${active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 blur-md pointer-events-none'}`}>
      <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all ${
        completed ? 'bg-emerald-500 text-white rotate-12' : active ? 'bg-slate-900 text-white rotate-0' : 'bg-slate-50 text-slate-200'
      }`}>
        {completed ? <CheckCircle2 size={24} /> : step}
      </div>
      <div className="flex-1 pt-1">
        {children}
      </div>
    </div>
  );
}
