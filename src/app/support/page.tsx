"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  LifeBuoy, 
  Send, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  User,
  MessageSquare
} from "lucide-react";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setDescription("");
      removeScreenshot();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[var(--font-inter)] text-slate-900">
      <DashboardNav />
      
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-rose-600/20 mb-6"
          >
            <LifeBuoy size={32} />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-4"
          >
            How can we <span className="text-rose-600">help</span> today?
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium max-w-lg"
          >
            Running into an issue or have a feature request? Our team of engineers is ready to help you build the perfect explainer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Form Side */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100"
          >
            {isSuccess ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Ticket Received!</h3>
                <p className="text-slate-500 font-medium mb-8">We'll get back to you at <strong>{user?.email}</strong> as soon as possible.</p>
                <Button 
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="rounded-xl border-slate-200"
                >
                  Send another request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <User size={16} />
                      </div>
                      <input 
                        type="text" 
                        disabled
                        value={user?.displayName || "Director"} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={16} />
                      </div>
                      <input 
                        type="email" 
                        disabled
                        value={user?.email || "loading..."} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-900 opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Describe the problem</label>
                  <div className="relative">
                    <div className="absolute left-4 top-5 text-slate-400">
                      <MessageSquare size={16} />
                    </div>
                    <textarea 
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What's happening? Be as descriptive as possible..."
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 pl-12 pr-4 font-bold text-slate-900 focus:bg-white focus:border-rose-500 outline-none transition-all placeholder:text-slate-300 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Screenshot (Optional)</label>
                   {!screenshot ? (
                     <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50 hover:border-rose-300 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={20} />
                        </div>
                        <span className="text-sm font-bold text-slate-500">Click to upload screenshot</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase mt-1">PNG, JPG or WebP</span>
                     </label>
                   ) : (
                     <div className="relative rounded-3xl overflow-hidden border border-slate-200 group">
                        <img src={previewUrl!} alt="Screenshot Preview" className="w-full aspect-video object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                           <button 
                             type="button"
                             onClick={removeScreenshot}
                             className="p-3 bg-white text-rose-600 rounded-2xl font-black shadow-xl hover:scale-110 transition-transform"
                           >
                             <X size={24} />
                           </button>
                        </div>
                     </div>
                   )}
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting || !description}
                  className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-rose-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isSubmitting ? "Sending to Studio..." : "Submit Support Request"}
                  {!isSubmitting && <Send size={20} />}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Quick Support Sidebar */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[60px] rounded-full" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-4">Direct Help</h4>
                <p className="font-bold text-lg mb-6 leading-tight">Our support aim for a <span className="text-rose-400">4-hour response time</span> during studio hours.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Email us</p>
                      <p className="text-sm font-bold">hello@saasexplainer.online</p>
                    </div>
                  </div>
                </div>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <AlertCircle size={24} />
                </div>
                <h4 className="font-black text-slate-900 mb-2 tracking-tight">Before you message:</h4>
                <ul className="space-y-3">
                   {["Check your project status in dashboard", "Ensure all assets are high-res", "Try resetting the studio player"].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-500 leading-tight">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 bg-rose-600 shrink-0" />
                         {step}
                      </li>
                   ))}
                </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
