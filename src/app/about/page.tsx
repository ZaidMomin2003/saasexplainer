"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Target, Eye, Camera, Send } from "lucide-react";

// Modern Social Icons (Direct SVGs for stability)
const InstagramIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export default function AboutPage() {
  return (
    <div className="bg-[var(--color-background)] min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto min-h-screen">
        <div className="text-center mb-24 max-w-3xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 mb-6 uppercase tracking-widest"
          >
            About Us
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6 font-[var(--font-outfit)] leading-tight"
          >
            Built by a founder, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-700">for founders.</span>
          </motion.h1>
        </div>
        
        {/* Founder Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-indigo-100/50 rounded-[3rem] transform -rotate-3 blur-sm" />
            <img 
              src="/zaid.jpg" 
              alt="Arshad - Founder" 
              className="relative rounded-[3rem] object-cover w-full aspect-[4/5] shadow-2xl shadow-indigo-500/10 border border-gray-100 filter contrast-105"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 font-[var(--font-outfit)] tracking-tight">Meet Zaid.</h2>
            <div className="flex items-center gap-2 text-gray-500 font-bold mb-8 uppercase tracking-widest text-sm">
              <MapPin size={16} className="text-indigo-600" />
              Bangalore, India
            </div>

            <div className="prose prose-lg text-gray-600 font-medium mb-10 max-w-2xl">
              <p>
                Yo! I'm <strong>Zaid</strong>. I built saasexplainer.online because I was tired of seeing incredible solo founders struggle to market their products simply because they couldn't afford a $2,000 agency video or didn't know how to use After Effects.
              </p>
              <p>
                I combined my love for programmatic UI generation with the latest AI reasoning models to create a "Vibe Editor". Now, anyone can generate a pixel-perfect, motion-graphics masterpiece in just 10 minutes.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://x.com/zaidbuilds" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95 group">
                <TwitterIcon size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                @zaidbuilds
              </a>
              <a href="http://instagram.com/fallen_zaid" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-pink-50 text-pink-600 border border-pink-100 rounded-xl font-bold hover:bg-pink-100 transition-all active:scale-95 group">
                <InstagramIcon size={18} className="group-hover:scale-110 transition-transform" />
                @fallen_zaid
              </a>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gray-900 text-white rounded-[2.5rem] p-12 relative overflow-hidden group border border-gray-800"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 backdrop-blur-md">
                <Target size={28} className="text-white" />
             </div>
             <h3 className="text-3xl font-black mb-4 font-[var(--font-outfit)] tracking-tight">Our Mission</h3>
             <p className="text-gray-400 font-medium leading-relaxed text-lg">
               To hyper-democratize high-end marketing. We believe that if you can write code to build a great SaaS, you shouldn't have to learn timeline editing software to show it off to the world. We turn a 2-week agency delay into a 10-minute automated flow.
             </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="bg-indigo-50 border border-indigo-100 text-gray-900 rounded-[2.5rem] p-12 relative overflow-hidden group"
          >
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 border border-gray-200 shadow-sm">
                <Eye size={28} className="text-indigo-600" />
             </div>
             <h3 className="text-3xl font-black mb-4 font-[var(--font-outfit)] tracking-tight">Our Vision</h3>
             <p className="text-gray-600 font-medium leading-relaxed text-lg">
               To completely bridge the gap between "I have an idea" and "Here is my stunning launch video." We envision a future where <strong>saasexplainer.online</strong> is the default render engine for every solo founder and indie maker globally.
             </p>
          </motion.div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
