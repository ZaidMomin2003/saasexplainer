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
  ChevronLeft
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Link from "next/link";

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
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBaking, setIsBaking] = useState(false);
  const [bakedPrompt, setBakedPrompt] = useState("");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBakeButton, setShowBakeButton] = useState(false);
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

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping || !genAI) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
      
      const systemPrompt = `
        You are the Creative Director of 'SaaS Explainer Studio'. 
        Your task is to conversationally collect the BARE MINIMUM data to generate a high-end SaaS explainer video.
        
        FORMATTING RULE: Use HTML tags (e.g., <b>bold</b>, <i>italic</i>) for emphasis. DO NOT USE MARKDOWN (no **bold**).
        
        Context: Project "${extraction.name}" is ${extraction.duration} seconds.
        
        ONLY ASK THESE QUESTIONS (one or two at a time):
        1. Website URL & The "Hook" (What specific pain point are we solving?)
        2. Visual Aesthetic Style: Apple Luxury, Cyber-SaaS, or Midnight Stealth?
        3. Assets: Remind them they can use the upload buttons for logo/screenshots if they haven't.

        RULES:
        - Be premium, brief, and elite. 
        - Analyze the user's input to extract these fields.
        - If you have enough info (at least Name, URL, Style, and Goals/Hook), append "[[BAKE_READY]]" to your final response.
        - Current Data: ${JSON.stringify(extraction)}

        CONVERSATION SO FAR:
        ${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
        USER: ${userMsg}
      `;

      const result = await model.generateContent(systemPrompt);
      const responseText = result.response.text();
      
      if (responseText.includes("[[BAKE_READY]]")) setShowBakeButton(true);

      const cleanText = responseText.replace("[[BAKE_READY]]", "").trim();
      setMessages(prev => [...prev, { role: 'assistant', content: cleanText }]);

      // Meta-extraction for internal local state (NO FIREBASE SYNC YET)
      extractMetadata(userMsg, cleanText);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "My apologies, I had a brief sync issue. Please continue." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const extractMetadata = async (userMsg: string, aiMsg: string) => {
    if (!genAI) return;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
      const extractPrompt = `
        Current extracted data: ${JSON.stringify(extraction)}
        Extract any new project data from this snippet in JSON. 
        Fields: website, style, notes (the pain point/hook).
        Snippet: 
        USER: ${userMsg}
        ASSISTANT: ${aiMsg}
      `;
      const res = await model.generateContent(extractPrompt);
      const text = res.response.text();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const json = JSON.parse(text.substring(jsonStart, jsonEnd));
        setExtraction(prev => ({ ...prev, ...json }));
      }
    } catch (e) {
      console.log("Extraction fail", e);
    }
  };

  const handleFinalBake = async () => {
    setIsBaking(true);
    
    try {
      const model = genAI?.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
      
      const bakePrompt = `
        You are a Senior Motion Designer. Turn this project data into a detailed, structured technical manifest for a Remotion SaaS explainer video.
        
        PROJECT DATA:
        Name: ${extraction.name}
        Website: ${extraction.website}
        Duration: ${extraction.duration}s
        Style: ${extraction.style}
        Goals/Notes: ${extraction.notes}
        Logo: ${extraction.logo ? "Uploaded" : "None"}
        Screenshots: ${extraction.screenshots.length} uploaded

        OUTPUT FORMAT:
        Produce a MISSION-CRITICAL MANIFEST following this structure:
        [[ SYSTEM ROLE ]] Lead Motion Designer.
        [[ USER INPUTS ]] Project data summary.
        [[ I. MOTION PHYSICS ENGINE ]] Detailed spring/easing definitions for the ${extraction.style} style.
        [[ II. VISUAL STYLING & COMPOSITION ]] Exact HEX colors, glow values, and glassmorphism specs.
        [[ III. SCENE-BY-SCENE CINEMATOGRAPHY ]] Second-by-second breakdown of every visual transition.
        [[ IV. TECHNICAL CONSTRAINTS ]] Resolution, FPS, and responsive rules.

        CRITICAL: DO NOT WRITE CODE. ONLY WRITE THE PRODUCTION MANIFEST.
      `;

      const result = await model?.generateContent(bakePrompt);
      const manifest = result?.response.text() || "Generation failed.";
      
      setBakedPrompt(manifest);

      // 3. FINAL SYNC TO FIREBASE (Everything at once)
      await updateDoc(doc(db, "projects", id as string), {
        status: "GENERATING",
        script: manifest,
        "businessDetails.website": extraction.website || "",
        "businessDetails.description": extraction.notes || "",
        "style": extraction.style || "Apple Luxury",
        "assets.logo": extraction.logo || null,
        "assets.screenshots": extraction.screenshots || [],
        updatedAt: Date.now()
      });

      // Clear local storage for this project with a delay to prevent UI flickers before redirect
      setTimeout(() => {
        localStorage.removeItem(`chat_history_${id}`);
        localStorage.removeItem(`chat_extraction_${id}`);
        router.push(`/generate/${id}`);
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
    <div className="flex flex-col h-screen bg-white text-slate-900 font-inter selection:bg-rose-100 overflow-hidden">
      {/* Navbar */}
      <nav className="h-20 px-10 flex items-center justify-between border-b border-slate-50 shrink-0 bg-white/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-3 text-slate-300 hover:text-slate-900 bg-slate-50 rounded-2xl transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-600/20">
            <Zap size={20} className="fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter uppercase italic font-[var(--font-outfit)] leading-none">Planning Studio <span className="text-rose-600">PRO</span></span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{extraction.name} • {extraction.duration}s</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           {extraction.website && (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{extraction.website.replace('https://', '').replace('http://', '')}</span>
              </div>
           )}
           <button onClick={() => { localStorage.removeItem(`chat_history_${id}`); window.location.reload(); }} className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all" title="Reset Local Chat"><RefreshCw size={18} /></button>
        </div>
      </nav>

      {/* Chat Canvas or Baking Loader */}
      <AnimatePresence mode="wait">
        {isBaking ? (
          <motion.div 
            key="baking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center space-y-12"
          >
             <div className="relative">
                <div className="w-32 h-32 border-8 border-slate-50 border-t-rose-600 rounded-full animate-spin shadow-2xl" />
                <div className="absolute inset-0 flex items-center justify-center animate-pulse"><Sparkles className="text-rose-600" size={40} /></div>
             </div>
             <div className="text-center space-y-4">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-[var(--font-outfit)]">Baking Master Manifest...</h3>
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em] animate-pulse">Syncing with Creative Director</p>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar px-6 md:px-12 py-12" 
            ref={scrollRef}
          >
            <div className="max-w-4xl mx-auto space-y-12">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'assistant' ? 'bg-slate-900 shadow-slate-900/10 text-white' : 'bg-rose-600 shadow-rose-600/10 text-white'}`}>
                      {m.role === 'assistant' ? <Bot size={22} /> : <User size={22} />}
                    </div>
                    <div className={`space-y-4 max-w-[80%]`}>
                       {m.role === 'assistant' ? (
                         <div 
                           className="text-lg leading-relaxed text-slate-700 [&>b]:text-rose-600 [&>strong]:text-rose-600"
                           dangerouslySetInnerHTML={{ __html: m.content }}
                         />
                       ) : (
                         <div className="text-lg leading-relaxed text-slate-900 font-bold bg-slate-50 p-6 rounded-[2rem] rounded-tr-none">
                           {m.content}
                         </div>
                       )}
                       {m.images && m.images.length > 0 && (
                          <div className="flex gap-2">
                            {m.images.map((img, idx) => (
                              <div key={idx} className="w-32 h-32 rounded-2xl border-4 border-slate-50 overflow-hidden shadow-xl">
                                <img src={img} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                       )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg"><Bot size={22} /></div>
                    <div className="flex items-center gap-2 p-6">
                       <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Deck */}
      {!isBaking && (
        <div className="p-8 md:p-12 shrink-0 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <AnimatePresence>
              {showBakeButton && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinalBake}
                    className="w-full py-8 bg-rose-600 text-white rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 shadow-2xl shadow-rose-600/30 hover:bg-gray-900 transition-all group"
                  >
                    <Sparkles size={32} className="group-hover:rotate-12 transition-transform" /> 
                    Bake Master Manifest 
                    <ArrowRight size={32} />
                  </motion.button>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-[3.5rem] border border-slate-100 shadow-inner group-focus-within:bg-white group-focus-within:border-rose-100 group-focus-within:shadow-2xl transition-all">
              <div className="flex gap-3 px-4 pt-2">
                  <button onClick={() => logoInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all uppercase tracking-widest shadow-sm">
                    <Camera size={14} /> Add Logo
                  </button>
                  <button onClick={() => screenshotInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all uppercase tracking-widest shadow-sm">
                    <Layers size={14} /> Add Screenshot
                  </button>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "logo")} />
                  <input type="file" ref={screenshotInputRef} className="hidden" accept="image/*" multiple onChange={(e) => handleFileUpload(e, "screenshot")} />
              </div>

              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  autoFocus
                  disabled={isTyping}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your vision or answer my question..."
                  className="w-full bg-transparent p-8 pr-32 rounded-[2.5rem] text-xl font-bold outline-none placeholder:text-slate-200"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-4 w-16 h-16 bg-gray-950 text-white rounded-full flex items-center justify-center hover:bg-rose-600 disabled:opacity-20 transition-all shadow-xl"
                >
                  <Send size={24} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
