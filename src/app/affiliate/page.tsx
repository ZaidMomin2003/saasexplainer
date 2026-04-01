"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Share2
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { NextPage } from "next";

const AffiliatePage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="bg-[var(--color-background)] min-h-screen selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-x-0 -top-40 -z-10 flex justify-center opacity-40">
          <div className="w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-black uppercase tracking-[0.2em] mb-10"
          >
            <Sparkles size={14} className="animate-pulse" />
            Join the Movement
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-8"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Earn <span className="text-emerald-600 block sm:inline">$10.00</span> per <br/>video sale.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mb-12 leading-relaxed"
          >
            Partners get $10.00 commission <span className="text-gray-900 font-black">every single time</span> a user buys an export from your link. No caps, no complicated tiers. Just pure profit.
          </motion.p>

          {/* Form UI */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg relative"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="bg-white p-2 rounded-[2rem] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col sm:flex-row gap-2"
                >
                  <input 
                    type="email" 
                    placeholder="Enter your email for early access"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-8 py-5 rounded-2xl bg-gray-50 outline-none font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all border-none"
                  />
                  <button 
                    type="submit"
                    className="bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    Get Early Invite <ArrowRight size={18} />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-600 p-10 rounded-[2.5rem] shadow-2xl text-white text-center"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-2 font-[var(--font-outfit)]">Welcome to the Inner Circle!</h3>
                  <p className="text-emerald-50 opacity-80 font-medium">We'll contact you at {email} when we launch on April 7th.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-6 text-gray-400 font-bold text-xs uppercase tracking-widest">
              <span className="flex items-center gap-2"><Calendar size={14} className="text-emerald-500" /> Active 7th April</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              <span className="flex items-center gap-2"><Target size={14} className="text-emerald-500" /> No Minimum Payout</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- BENEFITS GRID --- */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<TrendingUp className="text-emerald-600" />}
              title="High Conversion"
              desc="Our editor turns links into videos in seconds. It sells itself, you just provide the bridge."
            />
            <BenefitCard 
              icon={<DollarSign className="text-emerald-600" />}
              title="Recurring Income"
              desc="Every time your referral pays to export a video, you get paid. For life."
            />
            <BenefitCard 
              icon={<Users className="text-emerald-600" />}
              title="Founder Network"
              desc="Join a network of elite SaaS founders and promoters scaling the future of video."
            />
          </div>
        </div>
      </section>

      {/* --- PROGRAM SPECS --- */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4 font-[var(--font-outfit)] tracking-tight">The Mechanics</h2>
            <p className="text-gray-500 font-medium">Simple. Profitable. Efficient.</p>
          </div>

          <div className="space-y-6">
            <SpecRow label="Payout per Sale" value="$10.00" />
            <SpecRow label="Cookie Duration" value="60 Days" />
            <SpecRow label="Active Date" value="April 7th, 2024" />
            <SpecRow label="Payment Methods" value="PayPal, Wise, Crypto" />
            <SpecRow label="Frequency" value="Paid Weekly" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const BenefitCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-emerald-50 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-4 font-[var(--font-outfit)] tracking-tight">{title}</h3>
    <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

const SpecRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between py-6 border-b border-gray-50 last:border-none">
    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{label}</span>
    <span className="text-xl font-black text-gray-900 font-[var(--font-outfit)]">{value}</span>
  </div>
);

const AnimatePresence = ({ children, mode }: { children: React.ReactNode, mode?: "wait" | "popLayout" }) => (
  <div className="relative overflow-hidden">
    {children}
  </div>
);

export default AffiliatePage;
