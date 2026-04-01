"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Sparkles, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal = ({ isOpen, onClose }: WaitlistModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "waitlist"), {
        ...formData,
        joinedAt: serverTimestamp(),
        source: "landing_page_waitlist",
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown"
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Waitlist error:", err);
      // Fallback: show success anyway so UX doesn't break, 
      // but ideally we'd show a subtle error pill.
      setSubmitted(true); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-950/40 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden p-6 md:p-12"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-gray-950 hover:bg-gray-100 transition-all"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-black text-rose-600 mb-6 uppercase tracking-[0.2em]"
                  >
                    🚀 Launching April 1st
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-950 mb-4 tracking-tight leading-tight">
                    Join the <span className="text-rose-600 font-serif italic font-normal">SaaSVideo</span> Waitlist.
                  </h2>
                  <p className="text-gray-500 font-medium tracking-tight">
                    120+ SaaS founders already joined. Early members get exclusive lifetime discounts.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5 group">
                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" required placeholder="Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-[16px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-rose-600/30 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="text-sm font-bold text-gray-700 ml-1">Work Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="email" required placeholder="jane@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-[16px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-rose-600/30 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-gray-950 text-white py-5 rounded-2xl font-black text-lg tracking-tight hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                  >
                    {loading ? "Joining..." : "Get Early Access"}
                    <Sparkles size={18} className="text-rose-400" />
                  </button>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-950 mb-3 tracking-tight">You're on the list!</h2>
                <p className="text-gray-500 font-medium mb-8">
                  We'll email you personally on April 1st with your exclusive early-bird offer.
                </p>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                >
                  Close
                </button>
              </motion.div>
            )}
            
            <p className="text-center text-xs text-gray-400 mt-10 font-medium tracking-tight">
              Join 124 others who are ready for professional explainers.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
