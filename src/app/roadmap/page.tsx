"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowLeft, Sparkles, MessageSquare, Zap, Box, Volume2, Layout, Clock, X, Send } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";

const roadmapItems = [
  {
    date: "March 25, 2026",
    status: "Today",
    title: "Brand Overhaul & 'Lovable' Redesign",
    description: "Launched the new design system focusing on aesthetics and user joy. Introduced the 'Lovable of Video Editing' philosophy across the platform.",
    icon: <Layout className="text-indigo-600" size={20} />,
    color: "bg-indigo-600",
    completed: true,
    highlight: true
  },
  {
    date: "March 24, 2026",
    status: "Just Added",
    title: "High-End AI Speech Synthesis",
    description: "Integrated studio-quality voice generation that perfectly syncs with video timelines. No more robotic voices; full emotional range for explainers.",
    icon: <Volume2 className="text-emerald-600" size={20} />,
    color: "bg-emerald-500",
    completed: true
  },
  {
    date: "March 22, 2026",
    status: "Completed",
    title: "3D Perspective & Mockup Scenes",
    description: "Added support for 3D UI structures. Flat screenshots are now automatically converted into dynamic 3D scenes with depth and shadow.",
    icon: <Box className="text-purple-600" size={20} />,
    color: "bg-purple-600",
    completed: true
  },
  {
    date: "March 18, 2026",
    status: "Completed",
    title: "After Effects Grade Motions",
    description: "Launched the complex easing engine. Every transition now feels like it was manually keyframed by a professional motion designer.",
    icon: <Zap className="text-amber-500" size={20} />,
    color: "bg-amber-500",
    completed: true
  },
  {
    date: "March 12, 2026",
    status: "Completed",
    title: "JIT Rendering Engine",
    description: "Implemented Just-In-Time rendering infrastructure. Videos are now generated and previewed live in the browser without server wait times.",
    icon: <Layout className="text-blue-500" size={20} />,
    color: "bg-blue-500",
    completed: true
  },
  {
    date: "March 8, 2026",
    status: "Inception",
    title: "Project Alpha Launch",
    description: "The dream began. First successful conversion of a landing page URL into a multi-scene video timeline.",
    icon: <Sparkles className="text-gray-900" size={20} />,
    color: "bg-gray-900",
    completed: true
  },
  {
    date: "April 2026",
    status: "Up Next",
    title: "Multi-Language Localization",
    description: "Automatically translate your video scripts and voice-overs into 25+ languages, maintaining your brand's unique tone.",
    icon: <MessageSquare className="text-gray-400" size={20} />,
    color: "bg-gray-200",
    completed: false
  }
];

export default function RoadmapPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: user?.displayName || "",
    email: user?.email || "",
    feature: ""
  });

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({ 
        ...prev, 
        name: user.displayName || "", 
        email: user.email || "" 
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "feature_requests"), {
        ...formData,
        userId: user?.uid || "Anonymous",
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setFormData(prev => ({ ...prev, feature: "" }));
      }, 2000);
    } catch (err) {
      console.error("Error submitting feature request:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] selection:bg-indigo-100 selection:text-indigo-900 font-inter">
      
      {/* Feature Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative border border-gray-100"
            >
              {submitted ? (
                <div className="p-16 flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} />
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 font-[var(--font-outfit)] mb-2">Thank you!</h2>
                   <p className="text-gray-500 font-medium tracking-tight">We've received your idea. Let's build it together.</p>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <div className="p-10 md:p-12">
                    <header className="mb-10">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                        <MessageSquare size={24} />
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">Submit your idea.</h2>
                      <p className="text-gray-500 font-medium mt-1">We appreciate you helping us shape the future of SaaSVideo.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                           <input 
                             required
                             type="text" 
                             placeholder="Steve Jobs"
                             value={formData.name}
                             onChange={e => setFormData({ ...formData, name: e.target.value })}
                             className="w-full h-14 bg-gray-50 border border-transparent focus:border-indigo-400 focus:bg-white rounded-xl px-4 font-bold text-gray-900 transition-all outline-none text-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Work Email</label>
                           <input 
                             required
                             type="email" 
                             placeholder="founder@startup.com"
                             value={formData.email}
                             onChange={e => setFormData({ ...formData, email: e.target.value })}
                             className="w-full h-14 bg-gray-50 border border-transparent focus:border-indigo-400 focus:bg-white rounded-xl px-4 font-bold text-gray-900 transition-all outline-none text-sm"
                           />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">What should we build next?</label>
                        <textarea 
                          required
                          rows={4}
                          placeholder="Tell us about the features or changes you'd love to see..."
                          value={formData.feature}
                          onChange={e => setFormData({ ...formData, feature: e.target.value })}
                          className="w-full bg-gray-50 border border-transparent focus:border-indigo-400 focus:bg-white rounded-xl p-4 font-bold text-gray-900 transition-all outline-none text-sm resize-none"
                        ></textarea>
                      </div>

                      <button 
                         disabled={loading}
                         type="submit"
                         className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                         {loading ? "Sending..." : "Submit Idea"}
                         {!loading && <Send size={20} />}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* Header */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black italic text-indigo-600 mb-6 uppercase tracking-[0.2em]"
          >
            The Journey So Far
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight mb-6">
            Platform <span className="text-indigo-600">Roadmap.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
            From an idea on March 8th to a fully automated AI video studio. Here's what we've built and where we're headed.
          </p>
        </header>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-100 z-0" />

          <div className="space-y-16">
            {roadmapItems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex items-start gap-10 group"
              >
                {/* Node */}
                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${item.completed ? 'bg-white border-2 border-gray-100' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}>
                   {item.completed ? item.icon : <Circle size={20} className="text-gray-300" />}
                   {item.highlight && (
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white animate-ping" />
                   )}
                </div>

                {/* Content */}
                <div className="pt-2">
                   <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">{item.date}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        item.status === "Today" || item.status === "Just Added" 
                          ? "bg-indigo-600 text-white" 
                          : item.completed ? "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-400"
                      }`}>
                         {item.status}
                      </span>
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2 font-[var(--font-outfit)] tracking-tight group-hover:text-indigo-600 transition-colors">
                     {item.title}
                   </h3>
                   <p className="text-gray-500 font-medium leading-relaxed max-w-lg">
                      {item.description}
                   </p>
                   
                   {item.completed && idx === 0 && (
                      <div className="mt-6 flex items-center gap-4">
                         <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                               <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                            ))}
                         </div>
                         <span className="text-[11px] font-bold text-gray-400">84+ people already using this</span>
                      </div>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-32 p-10 bg-gray-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                 <h2 className="text-2xl font-black text-white mb-2 font-[var(--font-outfit)]">Have a feature request?</h2>
                 <p className="text-gray-400 font-medium text-sm">We build Based on what our users need.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-black text-sm hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                 Submit Idea
              </button>
           </div>
        </div>

      </main>

    </div>
  );
}
