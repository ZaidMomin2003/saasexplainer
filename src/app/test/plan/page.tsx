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
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

export default function ChatPlanPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your Creative Director. To get started, what is the <b>Name of your business</b> and your <b>website URL</b>?" 
    }
  ]);
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
        
        ONLY ASK THESE QUESTIONS (one or two at a time):
        1. Project Name & Website URL? (Start with this)
        2. What is the ONE specific pain point we are solving? (The "Hook")
        3. Visual Aesthetic Style: Apple Luxury, Cyber-SaaS, or Midnight Stealth?
        4. Do you have a logo or dashboard screenshots? (Remind them they can use the upload buttons)
        5. Target Duration (15s, 30s, or 60s)?

        RULES:
        - Be premium, brief, and elite. 
        - Analyze the user's input to extract these fields.
        - If you have enough info (at least Name, URL, Style, and Duration), append "[[BAKE_READY]]" to your final response.
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

      // Meta-extraction for the internal state
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
        Fields: name, website, style, duration, notes (the pain point).
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

  const handleFinalBake = () => {
    localStorage.setItem('sandbox_project_data', JSON.stringify({
        ...extraction,
        targetAudience: "SaaS Decision Makers" // Defaulting or can be extracted
    }));
    router.push("/test/prompt");
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-900 font-inter selection:bg-rose-100 overflow-hidden">
      {/* Navbar */}
      <nav className="h-20 px-10 flex items-center justify-between border-b border-slate-50 shrink-0 bg-white/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-600/20">
            <Zap size={20} className="fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter uppercase italic font-[var(--font-outfit)] leading-none">Creative Studio <span className="text-rose-600">PRO</span></span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">AI Director v4.6</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           {extraction.name && (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{extraction.name}</span>
              </div>
           )}
           <button onClick={() => window.location.reload()} className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"><RefreshCw size={18} /></button>
        </div>
      </nav>

      {/* Chat Canvas */}
      <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar px-6 md:px-12 py-12" ref={scrollRef}>
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
      </div>

      {/* Control Deck */}
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
                  Bake Master Prompt 
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
    </div>
  );
}

