"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  ArrowRight,
  Loader2,
  Sparkles,
  ChevronLeft,
  Upload
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import imageCompression from 'browser-image-compression';

const THEMES = [
  { 
    id: "tech_minimal", 
    name: "Tech Minimal", 
    desc: "Dark mode, neon highlights, clean geometry",
    gradient: "from-slate-900 to-slate-800",
    icon: "💠"
  },
  { 
    id: "premium_luxury", 
    name: "Premium Luxury", 
    desc: "Gold accents, smooth ease, rich glassmorphism",
    gradient: "from-amber-900 via-slate-900 to-slate-900",
    icon: "💎"
  },
  { 
    id: "fast_paced", 
    name: "High Entropy", 
    desc: "Rapid cuts, high-tempo, vibrant 2D/3D shapes",
    gradient: "from-rose-600 to-indigo-700",
    icon: "🔥"
  },
  { 
    id: "corporate_clean", 
    name: "Corporate Clean", 
    desc: "Light mode, trustworthy blues, soft shadows",
    gradient: "from-blue-500 to-blue-700",
    icon: "💼"
  },
];

export default function PlanPage() {
  return (
    <ProtectedRoute>
      <PlanContent />
    </ProtectedRoute>
  );
}

function PlanContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  
  const [project, setProject] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isBaking, setIsBaking] = useState(false);
  
  const [website, setWebsite] = useState("");
  const [theme, setTheme] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Project Data
  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "projects", id as string);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProject(data);
        if (data.website) setWebsite(data.website);
        if (data.theme) setTheme(data.theme);
        if (data.inspiration) setInspiration(data.inspiration);
        if (data.assets?.screenshots) setScreenshots(data.assets.screenshots);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [id]);

  // Manual Step Transition logic handled by nextStep() and prevStep()

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
      const newScreenshots = [...screenshots];
      for (const file of Array.from(files)) {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onloadend = () => {
            newScreenshots.push(reader.result as string);
            resolve(true);
          };
          reader.readAsDataURL(compressedFile);
        });
      }
      setScreenshots(newScreenshots);
      await updateDoc(doc(db, "projects", id as string), {
        "assets.screenshots": newScreenshots,
        updatedAt: Date.now()
      });
      toast.success("Assets synchronized.");
    } catch (err) {
      console.error("Compression failed:", err);
      toast.error("Asset upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !website) return toast.error("Please enter your website URL");
    if (step === 2 && !theme) return toast.error("Please select a visual theme");
    if (step === 3 && !inspiration) return toast.error("Please provide an inspiration link");
    setStep(s => Math.min(4, s + 1));
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const goToStep = (target: number) => {
    if (target === step) return;
    
    // Moving Backward: Always allowed
    if (target < step) {
      setStep(target);
      return;
    }

    // Moving Forward: Check dependencies
    if (target >= 2 && !website) return toast.error("Website URL required");
    if (target >= 3 && !theme) return toast.error("Theme selection required");
    if (target >= 4 && !inspiration) return toast.error("Inspiration required");
    
    setStep(target);
  };

  const handleCreateVideo = async () => {
    if (!website || !theme || isBaking || !id) return;
    setIsBaking(true);
    
    const toastId = toast.loading("Analyzing Website & Style Reference...");

    try {
      await updateDoc(doc(db, "projects", id as string), {
        website,
        theme,
        inspiration,
        status: "DRAFT_ANALYZING",
        updatedAt: Date.now()
      });

      const res = await fetch("/api/director", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          website,
          theme,
          inspiration,
          screenshots,
          duration: project?.duration || 30
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Director analysis failed");
      }

      const { blueprint } = await res.json();

      await updateDoc(doc(db, "projects", id as string), {
        scenes: blueprint.scenes ?? [],
        branding: blueprint.branding ?? { primaryColor: "#E11D48", tone: "Minimal" },
        style_blueprint: blueprint.style_blueprint ?? { pacing: "dynamic" },
        status: "DRAFT_READY",
        updatedAt: Date.now()
      });

      toast.success("Architect's Blueprint Ready!", { id: toastId });
      router.push(`/director/${id}`);
      
    } catch (err) {
      console.error("Discovery failed:", err);
      toast.error("Failed to sync with the Director engine.", { id: toastId });
    } finally {
      setIsBaking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-rose-600" size={32} />
        <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Opening Manifest</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white text-slate-900 font-inter selection:bg-rose-100 overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 blur-[180px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <nav className="h-16 px-8 flex items-center justify-between relative z-50 shrink-0 border-b border-slate-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <ChevronLeft size={18} />
          </Link>
          <Logo />
        </div>

        <div className="flex flex-col items-center">
           <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1.5 opacity-60">Production Manifest</div>
           <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <button 
                  key={i} 
                  onClick={() => goToStep(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${step >= i ? 'w-10 bg-slate-900 shadow-[0_0_10px_rgba(0,0,0,0.1)]' : 'w-4 bg-slate-100'}`} 
                />
              ))}
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-900">Project: {project?.name || "Untitled"}</span>
              <span className="text-[9px] text-slate-400 font-medium">Baking in progress</span>
           </div>
           <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-rose-500">
              <Sparkles size={16} fill="currentColor" />
           </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-8 flex flex-col justify-center relative z-10 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section
              key="step1"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-3">
                <span className="text-rose-600 font-black uppercase tracking-[0.4em] text-[10px]">Foundation</span>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter font-heading leading-[0.9]">
                  What are we <br/><span className="text-rose-600">building?</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed">
                  Enter your product's home base.
                </p>
              </div>

              <div className="relative group max-w-3xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-rose-400 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition" />
                <input 
                  type="text"
                  placeholder="https://your-product.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="relative w-full px-12 py-10 bg-white border-2 border-slate-100 rounded-[2.5rem] text-4xl font-black italic text-rose-600 outline-none shadow-2xl focus:border-rose-600 transition-all placeholder:text-slate-100"
                  autoFocus
                />
                <button 
                  onClick={nextStep}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-6 bg-rose-600 text-white rounded-3xl hover:bg-rose-700 transition-all shadow-xl active:scale-95"
                >
                  <ArrowRight size={28} />
                </button>
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-12"
            >
              <div className="space-y-3">
                <span className="text-rose-600 font-black uppercase tracking-[0.4em] text-[10px]">Aesthetic</span>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter font-heading leading-[0.9]">
                  Set the <br/><span className="text-rose-600">vibe.</span>
                </h1>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`group text-left p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden ${
                      theme === t.id 
                        ? 'border-slate-900 bg-slate-50 shadow-lg' 
                        : 'border-slate-50 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="relative z-10 flex flex-col h-full gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xl shadow-lg`}>
                        {t.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{t.name}</h3>
                        <p className="text-slate-400 font-bold text-[10px] mt-1 leading-tight">{t.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={prevStep}
                  className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-sm hover:text-slate-900 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-base hover:bg-rose-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-12"
            >
              <div className="space-y-3">
                <span className="text-rose-600 font-black uppercase tracking-[0.4em] text-[10px]">Influence</span>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter font-heading leading-[0.9]">
                  Visual <br/><span className="text-rose-600">idols.</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium max-w-lg">
                  Paste inspiration link.
                </p>
              </div>

              <div className="relative group max-w-3xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-rose-400 rounded-[2rem] blur opacity-10 group-focus-within:opacity-20 transition" />
                <input 
                  type="text"
                  placeholder="https://youtube.com/..."
                  value={inspiration}
                  onChange={(e) => setInspiration(e.target.value)}
                  className="relative w-full px-8 py-8 bg-white border-2 border-slate-100 rounded-[2rem] text-2xl font-black italic text-slate-900 outline-none shadow-xl focus:border-slate-900 transition-all placeholder:text-slate-100"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={prevStep}
                  className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-sm hover:text-slate-900 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-base hover:bg-rose-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  Confirm Inspiration <ArrowRight size={18} />
                </button>
              </div>
            </motion.section>
          )}

          {step === 4 && (
            <motion.section
              key="step4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="space-y-3">
                <span className="text-rose-600 font-black uppercase tracking-[0.4em] text-[10px]">Assets</span>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter font-heading leading-[0.9]">
                  The <br/><span className="text-rose-600">logic.</span>
                </h1>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-rose-600 hover:border-rose-600 hover:bg-rose-50 transition-all group"
                >
                   <Plus size={20} />
                   <span className="text-[9px] font-black uppercase tracking-widest">{isUploading ? "..." : "Add"}</span>
                </button>
                <input 
                  type="file" 
                  multiple 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleFileUpload}
                  accept="image/*"
                />

                <AnimatePresence>
                  {screenshots.map((src, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                    >
                      <img src={src} className="w-full h-full object-cover" />
                      <button 
                        onClick={async () => {
                          const next = screenshots.filter((_, idx) => idx !== i);
                          setScreenshots(next);
                          await updateDoc(doc(db, "projects", id as string), {
                            "assets.screenshots": next
                          });
                        }}
                        className="absolute inset-0 bg-rose-600/90 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all backdrop-blur-sm"
                      >
                         <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={prevStep}
                  className="px-8 py-5 text-slate-400 font-black hover:text-slate-900 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleCreateVideo}
                  disabled={isBaking}
                  className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-900/20 relative overflow-hidden group"
                >
                  {isBaking ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} fill="currentColor" />}
                  {isBaking ? "Processing..." : "Bake Production"}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
