"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-6 relative overflow-hidden font-inter">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 md:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative z-10"
      >
        <Link href="/" className="flex items-center justify-center gap-2 group mb-10">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-600/20">
            <Play size={14} className="fill-current ml-0.5" />
          </div>
          <span className="font-[var(--font-outfit)] font-black tracking-tight text-gray-900 text-2xl">
            SaaSVideo
          </span>
        </Link>

        {isSent ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3 font-[var(--font-outfit)] tracking-tight">Email Sent</h1>
            <p className="text-gray-500 font-medium mb-8">
              We've sent a password reset link to <span className="text-gray-900 font-bold">{email}</span>. Please check your inbox.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
               Return to Login <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-2 font-[var(--font-outfit)] tracking-tight">Forgot password?</h1>
              <p className="text-gray-500 font-medium">No worries, we'll send you reset instructions.</p>
            </div>

            {error && (
               <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 flex items-start gap-3">
                  {error}
               </div>
            )}

            <form className="space-y-6" onSubmit={handleReset}>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Email address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input 
                    required
                    type="email" 
                    placeholder="founder@startup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-[var(--font-outfit)] font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Reset Password"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-gray-500">
              Wait, I remember it! <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">Go back</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
