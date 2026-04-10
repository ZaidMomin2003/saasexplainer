'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Code, Star, ExternalLink, Zap, Video, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Particles } from '@/components/ui/particles';
import { Spotlight } from '@/components/ui/spotlight';
import { Outfit, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const outfit = Outfit({
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin'],
});

// Sample users for the waitlist display
const users = [
  { imgUrl: 'https://avatars.githubusercontent.com/u/111780029' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/123104247' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/115650165' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/71373838' },
];

export default function WaitlistPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // App theme: Rose color for particles
  const color = '#e11d48';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, "waitlist"), {
        ...formData,
        joinedAt: serverTimestamp(),
        source: "premium_waitlist_v1",
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown"
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Waitlist error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={cn("relative flex min-h-screen w-full items-center justify-center overflow-hidden xl:h-screen bg-white text-gray-900", inter.className)}>
      <Spotlight fill="rgba(225, 29, 72, 0.1)" />

      <Particles
        className="absolute inset-0 z-0"
        quantity={120}
        ease={80}
        refresh
        color={color}
      />

      <div className="relative z-[100] mx-auto max-w-3xl px-4 py-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-rose-100 from-rose-50 to-white mb-8 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 backdrop-blur-sm shadow-sm"
        >
          <div className="h-6 w-6 bg-rose-600 rounded-full flex items-center justify-center">
            <Video className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">SaaS Explainer</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <ArrowRight className="h-4 w-4 text-rose-500" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={cn(
            'from-gray-950 via-gray-900 to-gray-700 mb-4 cursor-crosshair bg-gradient-to-b bg-clip-text text-5xl font-black text-transparent sm:text-7xl tracking-tighter',
            outfit.className,
          )}
        >
          Join the{' '}
          <span className="text-rose-600 italic font-medium">
            Waitlist
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-gray-500 mt-2 mb-12 sm:text-lg font-medium"
        >
          Generate professional SaaS explainer videos in minutes.
          <br className="hidden sm:block" /> Free to start. No credit card required.
        </motion.p>

        {/* Highlight Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-3"
        >
          <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/30 p-4 backdrop-blur-md shadow-sm">
            <Zap className="text-rose-600 mb-2 h-5 w-5" />
            <span className="text-xl font-black text-gray-950">120 FPS</span>
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Rendering</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/30 p-4 backdrop-blur-md shadow-sm">
            <MousePointer2 className="text-rose-600 mb-2 h-5 w-5" />
            <span className="text-xl font-black text-gray-950">Vibe Edit</span>
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">No Skill Needed</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/30 p-4 backdrop-blur-md shadow-sm">
            <Star className="text-rose-600 mb-2 h-5 w-5" />
            <span className="text-xl font-black text-gray-950">Free</span>
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">To Start</span>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="mx-auto flex flex-col gap-3 sm:flex-row max-w-2xl"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <>
                <div className="relative flex-1">
                  <motion.input
                    key="name-input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-rose-300 focus:ring-rose-200/50 w-full rounded-2xl border bg-white px-6 py-4 transition-all focus:ring-4 focus:outline-none shadow-sm font-semibold"
                  />
                </div>
                <div className="relative flex-[1.5]">
                  <motion.input
                    key="email-input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your work email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-rose-300 focus:ring-rose-200/50 w-full rounded-2xl border bg-white px-6 py-4 transition-all focus:ring-4 focus:outline-none shadow-sm font-semibold"
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-destructive/40 bg-destructive/10 text-destructive mt-2 rounded-xl border px-4 py-1 text-sm sm:absolute"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="group relative overflow-hidden rounded-2xl bg-gray-950 px-8 py-4 font-black text-white transition-all duration-300 hover:bg-rose-600 hover:shadow-[0_20px_40px_-10px_rgba(225,29,72,0.3)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 tracking-tight">
                    {isSubmitting ? 'Joining...' : 'Get Access'}
                    <Sparkles className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
                  </span>
                </button>
              </>
            ) : (
              <motion.div
                key="thank-you-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="flex-1 cursor-pointer rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 px-6 py-4 font-black shadow-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  You're on the list!{' '}
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-10 flex items-center justify-center gap-1"
        >
          <div className="flex -space-x-3">
            {users.map((user, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1 + i * 0.2 }}
                className="border-white size-10 rounded-full border-2 bg-rose-100 overflow-hidden shadow-sm"
              >
                <img
                  src={user.imgUrl}
                  alt="Avatar"
                  className="rounded-full transition-all duration-300 hover:scale-110 hover:rotate-6"
                  width={40}
                  height={40}
                />
              </motion.div>
            ))}
          </div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-gray-500 ml-2 font-bold"
          >
            <span className="text-gray-900 font-black">120+</span> founders joined ✨
          </motion.span>
        </motion.div>

        {/* Navigation Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mt-12"
        >
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-rose-600 transition-colors">
            Back to Home
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes spotlight {
          0% {
            opacity: 0;
            transform: translate(-72%, -62%) scale(0.5);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -40%) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
