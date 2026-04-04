"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Trash2, 
  Zap, 
  Loader2, 
  ArrowRight,
  RefreshCw,
  Info,
  Image as ImageIcon,
  Camera,
  Layers,
  X,
  ChevronLeft,
  Wand2,
  Video,
  Plus,
  Paperclip,
  ArrowUp
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
}

interface ExtractionState {
  name?: string;
  website?: string;
  style?: string;
  duration?: number;
  notes?: string;
  logo?: string;
  screenshots: string[];
}

export default function PlanPage() {
  return (
    <ProtectedRoute>
      <PlanContent />
    </ProtectedRoute>
  );
}

function PlanContent() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || "Director";
  const router = useRouter();
  const { id } = useParams();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBaking, setIsBaking] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [bakedPrompt, setBakedPrompt] = useState("");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [creativeBrief, setCreativeBrief] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [extraction, setExtraction] = useState<ExtractionState>({ screenshots: [] });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  // 1. Initial Project Fetch (Firebase)
  useEffect(() => {
    if (!id) return;
    
    // We only fetch once to get Name and Duration
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProject(data);
          
          // Load local history if it exists
          const localKey = `chat_history_${id}`;
          const localExtractKey = `chat_extraction_${id}`;
          const savedMessages = localStorage.getItem(localKey);
          const savedExtraction = localStorage.getItem(localExtractKey);

          if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
          } else {
            // Initial assistant message
            setMessages([
              { 
                role: 'assistant', 
                content: `Hello! I'm your Creative Director. I've got your project <b>"${data.name}"</b> locked in for <b>${data.duration} seconds</b>. To start building our cinematic vision, what is your <b>website URL</b> and what is the <b>primary goal</b> of this video?` 
              }
            ]);
          }

          if (savedExtraction) {
            setExtraction(JSON.parse(savedExtraction));
          } else {
            setExtraction({
              name: data.name,
              duration: data.duration,
              screenshots: []
            });
          }
        }
      } catch (err) {
        console.error("Permission or fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // 2. Persist to LocalStorage whenever state changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_history_${id}`, JSON.stringify(messages));
    }
  }, [messages, id]);

  useEffect(() => {
    if (extraction.name) {
      localStorage.setItem(`chat_extraction_${id}`, JSON.stringify(extraction));
    }
  }, [extraction, id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleEnhancePrompt = async () => {
    if (!creativeBrief || creativeBrief.length < 5 || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           prompt: creativeBrief, 
           name: extraction.name || "Untitled Production"
        })
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setCreativeBrief(data.enhancedPrompt);
      }
    } catch (err) {
      console.error("Enhance failed:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleRemoveAsset = (type: 'logo' | 'screenshot', index?: number) => {
    if (type === 'logo') {
      setExtraction(prev => ({ ...prev, logo: undefined }));
    } else if (index !== undefined) {
      setExtraction(prev => ({
        ...prev,
        screenshots: prev.screenshots.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "screenshot") => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === "logo") {
          setExtraction(prev => ({ ...prev, logo: base64 }));
          setMessages(prev => [...prev, { role: 'user', content: "I've uploaded the master logo.", images: [base64] }]);
        } else {
          setExtraction(prev => ({ ...prev, screenshots: [...prev.screenshots, base64] }));
          setMessages(prev => [...prev, { role: 'user', content: "Here is a screenshot of our dashboard.", images: [base64] }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFinalBake = async () => {
    setIsBaking(true);
    
    try {
      const model = genAI?.getGenerativeModel({ model: "gemini-2.0-pro-exp" });
      
      const bakePrompt = `
        You are a Senior Hollywood Director & Storyboard Artist. 
        Analyze the following Creative Brief and produce a highly detailed, scene-by-scene script.
        
        PROJECT DATA:
        Name: ${extraction.name}
        Duration: ${extraction.duration}s
        Style: ${extraction.style || "Premium Aesthetic"}
        Creative Brief: ${creativeBrief}
        
        ASSETS:
        Logo: ${extraction.logo ? "Available" : "None"}
        Screenshots: ${extraction.screenshots.length} Provided

        OUTPUT REQUIREMENT:
        Return ONLY valid JSON. The output must be an object with a "scenes" property containing an array of objects.
        Each scene object MUST have:
        - index: integer (starting from 0)
        - title: string (short catchy title for the scene)
        - prompt: string (EXTREMELY detailed visual instructions for the AI motion engine. Describe camera moves, colors, exact UI elements to show, and motion physics).
        - duration: number (seconds for this scene, total must equal ${extraction.duration})

        Example Schema:
        {
          "scenes": [
            { "index": 0, "title": "The Hook", "prompt": "...", "duration": 5 },
            ...
          ]
        }

        CRITICAL: Use high-end cinematic terminology. Be specific about 3D depth, glassmorphism, and easing.
      `;

      const result = await model?.generateContent(bakePrompt);
      const manifestText = result?.response.text() || "{}";
      
      const cleanJsonStr = manifestText.replace(/```json|```/g, "").trim();
      const manifest = JSON.parse(cleanJsonStr);
      
      setBakedPrompt(JSON.stringify(manifest));

      await updateDoc(doc(db, "projects", id as string), {
        status: "STORYBOARDING",
        scenes: manifest.scenes,
        creativeBrief: creativeBrief,
        "style": extraction.style || "Apple Luxury",
        "assets.logo": extraction.logo || null,
        "assets.screenshots": extraction.screenshots || [],
        updatedAt: Date.now()
      });

      setTimeout(() => {
        localStorage.removeItem(`chat_history_${id}`);
        localStorage.removeItem(`chat_extraction_${id}`);
        router.push(`/director/${id}`);
      }, 1500);

    } catch (err) {
      console.error("Bake failed:", err);
      alert("Final sync failed. Please check your connection.");
    } finally {
      setIsBaking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-rose-600" size={32} />
        <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Preparing Studio</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-inter selection:bg-rose-100 overflow-hidden flex flex-col">
      <nav className="h-14 px-6 flex items-center justify-between relative z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <Link href="/dashboard" className="p-2 text-slate-300 hover:text-slate-900 bg-white border border-slate-100 rounded-xl transition-all shadow-sm">
          <ChevronLeft size={18} />
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">V2.4 • Online</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 pb-12 overflow-hidden">
        <AnimatePresence mode="wait">
          {isBaking ? (
            <motion.div key="baking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-slate-100 border-t-rose-600 rounded-full animate-spin" />
               <h3 className="text-xl font-bold text-slate-900 tracking-tight font-[var(--font-outfit)] leading-none">Architecting Storyboard...</h3>
            </motion.div>
          ) : (
            <motion.div key="brief" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl flex flex-col items-center space-y-6">
               <div className="text-center max-w-2xl px-6">
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900 font-[var(--font-outfit)] leading-tight mb-1">
                     Good Afternoon, <span className="text-slate-400 font-medium">{firstName}.</span><br/>What's on <span className="text-rose-600">your mind?</span>
                  </h2>
               </div>

               <div className="w-full bg-white rounded-3xl p-4 shadow-xl border border-slate-100 relative group transition-all">
                  <textarea 
                    value={creativeBrief}
                    onChange={(e) => setCreativeBrief(e.target.value)}
                    placeholder="Ask AI to architect a video or make a request..."
                    className="w-full h-32 bg-transparent text-lg font-medium outline-none placeholder:text-slate-200 resize-none leading-relaxed text-slate-800 p-2"
                  />

                  {(extraction.logo || extraction.screenshots.length > 0) && (
                     <div className="flex flex-wrap gap-4 px-6 pt-2 pb-6">
                        {extraction.logo && (
                           <div className="relative group/asset">
                              <div className="w-14 h-14 rounded-2xl border border-purple-100 overflow-hidden shadow-sm p-2 bg-white ring-2 ring-purple-600/5 group-hover/asset:ring-rose-500/50 transition-all">
                                 <img src={extraction.logo} className="w-full h-full object-contain" />
                              </div>
                              <button onClick={() => handleRemoveAsset('logo')} className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover/asset:opacity-100 transition-opacity hover:bg-rose-600">
                                 <X size={10} />
                              </button>
                           </div>
                        )}
                        {extraction.screenshots.map((shot, idx) => (
                           <div key={idx} className="relative group/asset">
                              <div className="w-14 h-14 rounded-2xl border border-slate-100 overflow-hidden shadow-sm ring-2 ring-transparent group-hover/asset:ring-rose-500 transition-all">
                                 <img src={shot} className="w-full h-full object-cover" />
                              </div>
                              <button onClick={() => handleRemoveAsset('screenshot', idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover/asset:opacity-100 transition-opacity hover:bg-rose-600">
                                 <X size={10} />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}

                  <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-slate-50 rounded-b-3xl">
                     <div className="flex items-center gap-2">
                        <button onClick={() => logoInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 transition-all group/btn active:scale-95">
                           <Paperclip size={12} className="text-slate-400 group-hover/btn:text-rose-600" /> 
                           Logo
                        </button>
                        <button onClick={() => screenshotInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 transition-all group/btn active:scale-95">
                           <ImageIcon size={12} className="text-slate-400 group-hover/btn:text-rose-600" /> 
                           Screens
                        </button>
                        <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "logo")} />
                        <input type="file" ref={screenshotInputRef} className="hidden" accept="image/*" multiple onChange={(e) => handleFileUpload(e, "screenshot")} />
                        
                        <div className="w-[1px] h-4 bg-slate-100 mx-1" />

                        <button 
                          onClick={handleEnhancePrompt}
                          disabled={creativeBrief.length < 5 || isEnhancing}
                          className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-bold hover:bg-rose-600 hover:text-white transition-all disabled:opacity-30 group/magic active:scale-95"
                        >
                           {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                           Polish Vision
                        </button>
                     </div>

                     <button 
                        onClick={handleFinalBake}
                        disabled={creativeBrief.length < 20 || isBaking}
                        className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-all hover:bg-rose-600 active:scale-90 disabled:opacity-10 shadow-lg group/submit"
                     >
                        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
                     </button>
                  </div>
               </div>

               <div className="flex items-center justify-center gap-2 w-full max-w-4xl pt-2">
                  {[
                     { label: "Apple Style", prompt: "A sleek, Apple-style introduction with smooth zooming transitions..." },
                     { label: "Cyberpunk", prompt: "Neon-noir aesthetic with high-contrast UI pop-ups and glitch effects..." },
                     { label: "Product Reveal", prompt: "Epic lighting, slow-motion rotations, and dramatic shadows..." }
                  ].map((card, i) => (
                     <button 
                        key={i} 
                        onClick={() => setCreativeBrief(card.prompt)}
                        className="flex-1 px-4 py-3 bg-white border border-slate-100 shadow-sm rounded-2xl text-[10px] font-bold text-slate-400 hover:border-rose-200 hover:text-rose-600 transition-all text-center flex items-center justify-center gap-2 group"
                     >
                        {card.label}
                        <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
                     </button>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
