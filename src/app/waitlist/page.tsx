"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Star, 
  Zap, 
  DollarSign, 
  Mail, 
  User, 
  ChevronDown,
  ShieldCheck,
  Globe
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MacOSWindow } from "@/components/ui/MacOSWindow";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const faqs = [
  {
    question: "How do I get the $16 pricing?",
    answer: "Waitlist members lock in a $16 per video export fee for their first 6 months. After public launch, the price will increase to $49."
  },
  {
    question: "Do I need complex editing skills?",
    answer: "No. Our 'Vibe Edit' technology automates the timeline for you. You just provide the context, and we build a cinematic SaaS explainer in minutes."
  },
  {
    question: "When is the launch?",
    answer: "We are onboarding our waitlist in batches starting April 7th. Early sign-ups get priority access."
  },
  {
    question: "Can I use my own brand assets?",
    answer: "Yes. Waitlist members get access to a custom Brand Kit feature where you can upload logos, fonts, and colors for consistent video generation."
  }
];

export default function WaitlistPage() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "waitlist"), {
        ...formData,
        joinedAt: serverTimestamp(),
        source: "waitlist_redesign_v2",
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown"
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Waitlist error:", err);
      setSubmitted(true); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden scroll-smooth font-inter">
      <Navbar />

      <main className="relative pt-40 pb-32">
        {/* Ambient background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-rose-50/50 to-transparent blur-3xl opacity-60" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-orange-50/40 blur-[130px] rounded-full" />
          <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-50/30 blur-[130px] rounded-full" />
          
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dot-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="black" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>

        {/* --- HERO SECTION --- */}
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
           {/* Badge */}
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5 }}
             className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-gray-100 bg-white/80 backdrop-blur-md shadow-sm"
           >
             <div className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
             <span className="text-[11px] font-black text-gray-500 tracking-[0.1em] uppercase">
               Launching April 7th • 120+ Founders Signed Up
             </span>
             <Sparkles size={12} className="text-gray-400" />
           </motion.div>

           {/* Heading */}
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="text-5xl md:text-8xl font-black tracking-[-0.05em] text-gray-950 leading-[0.95] mb-10 font-outfit"
           >
             The Future of <br /> <span className="text-rose-600 italic font-medium" style={{ fontFamily: 'var(--font-outfit), serif' }}>SaaS Video.</span>
           </motion.h1>

           {/* Subtext */}
           <motion.p
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
             className="text-xl md:text-2xl text-gray-500 font-medium tracking-tight mb-12 max-w-2xl leading-relaxed"
           >
             Get professional explainer videos for <span className="text-gray-950 font-black">$16</span>. <br className="hidden md:block" />
             Vibe edit with text and speech. No complex software required.
           </motion.p>

           {/* Centered Form */}
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl"
           >
              {!submitted ? (
                <div className="p-2 rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-xl shadow-black/[0.03]">
                  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="Name" 
                        className="w-full bg-white border border-transparent rounded-[2rem] py-5 pl-14 pr-4 transition-all focus:outline-none focus:ring-4 focus:ring-rose-500/5 font-semibold text-gray-900"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="flex-[1.5] relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" size={18} />
                      <input 
                        required
                        type="email" 
                        placeholder="Work Email" 
                        className="w-full bg-white border border-transparent rounded-[2rem] py-5 pl-14 pr-4 transition-all focus:outline-none focus:ring-4 focus:ring-rose-500/5 font-semibold text-gray-900"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-gray-950 text-white px-10 py-5 rounded-[2rem] font-black text-base shadow-xl hover:bg-rose-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {loading ? "..." : "Join"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 bg-emerald-50 border border-emerald-100 rounded-[3rem] text-center"
                >
                   <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                      <Check size={32} />
                   </div>
                   <h3 className="text-3xl font-black text-emerald-950 mb-3 tracking-tight font-outfit">You're on the list!</h3>
                   <p className="text-emerald-700 font-medium">Check your inbox for a special welcome gift. Launching April 7th.</p>
                </motion.div>
              )}
              <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                 <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> SECURE LINK</div>
                 <div className="flex items-center gap-2"><DollarSign size={14} className="text-rose-500" /> $16 GUARANTEED</div>
                 <div className="flex items-center gap-2"><Globe size={14} className="text-blue-500" /> EARLY ACCESS</div>
              </div>
           </motion.div>
        </div>

        {/* --- VIDEO SECTION --- */}
        <div className="max-w-6xl mx-auto px-6 mt-40 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
             <MacOSWindow dark className="w-full aspect-video shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative group overflow-hidden bg-black">
                <Image 
                  src="/waitlist_hero.png" 
                  alt="SaaS Video Preview" 
                  fill 
                  className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale-[20%] group-hover:grayscale-0"
                />
                
                {/* Floating Vibe Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                   <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-1/4 right-[10%] bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl hidden md:block"
                   >
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white">
                            <Zap size={16} fill="white" />
                         </div>
                         <span className="text-[12px] font-black text-white uppercase tracking-widest">Vibe Active</span>
                      </div>
                      <p className="text-white/60 text-[11px] font-bold">Matching rhythm to brand text...</p>
                   </motion.div>
                </div>

                {/* Big Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white shadow-2xl scale-90 group-hover:scale-110 transition-transform duration-500">
                      <Play size={32} className="fill-current ml-2" />
                   </div>
                </div>

                <div className="absolute bottom-10 left-10 flex flex-col gap-2">
                   <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] leading-none">Rendering Timeline</span>
                   </div>
                   <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.1em] ml-2">No expert needed</div>
                </div>
             </MacOSWindow>
          </motion.div>
        </div>

        {/* --- FAQ SECTION --- */}
        <section id="faq" className="mt-48 px-6 relative max-w-3xl mx-auto">
          <div className="text-center mb-20 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-100 text-[11px] font-black text-gray-500 mb-6 uppercase tracking-[0.2em]"
            >
              Learn More
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-950 tracking-[-0.04em] font-outfit mb-4">
               The <span className="text-rose-600">Details.</span>
            </h2>
          </div>

          <div className="space-y-4">
             {faqs.map((faq, idx) => {
               const isOpen = openFaq === idx;
               return (
                  <div 
                    key={idx} 
                    className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${isOpen ? 'bg-gray-50 border-gray-200 shadow-xl shadow-black/[0.02]' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                  >
                     <button 
                       onClick={() => setOpenFaq(isOpen ? null : idx)}
                       className="w-full text-left p-8 flex items-center justify-between group"
                     >
                       <span className={`text-lg font-black tracking-tight transition-colors ${isOpen ? 'text-gray-950' : 'text-gray-600 group-hover:text-gray-950'}`}>
                         {faq.question}
                       </span>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-gray-950 text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                          <ChevronDown size={20} />
                       </div>
                     </button>
                     <AnimatePresence>
                        {isOpen && (
                           <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: "auto", opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                           >
                              <div className="px-8 pb-10 text-gray-500 font-medium leading-relaxed tracking-tight text-[16px] max-w-2xl">
                                 {faq.answer}
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               )
             })}
          </div>

          {/* Final Simple Footer inside Main */}
          <div className="mt-40 text-center">
             <Link href="/">
                <button className="text-[12px] font-black text-gray-400 hover:text-rose-600 transition-colors uppercase tracking-[0.3em]">
                   Back to Home
                </button>
             </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
