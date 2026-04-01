"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check for email verification
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email address before logging in. Check your inbox.");
        await signOut(auth);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      console.error("Google sync failed:", err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-6 selection:bg-rose-100 selection:text-rose-900 relative overflow-hidden font-inter">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-50/50 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-6 py-8 md:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative z-10 my-4"
      >
        <Link href="/" className="flex items-center justify-center gap-2 group mb-6 md:mb-10">
          <div className="bg-rose-600 text-white p-1.5 rounded-lg shadow-md shadow-rose-600/20">
            <Play size={14} className="fill-current ml-0.5" />
          </div>
          <span className="font-[var(--font-outfit)] font-black tracking-tight text-gray-900 text-xl md:text-2xl">
            SaaSVideo
          </span>
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 font-[var(--font-outfit)] tracking-tight">Welcome back</h1>
          <p className="text-sm md:text-base text-gray-500 font-medium">Enter your details to log in.</p>
        </div>

        {error && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 flex items-start gap-3 border border-red-100"
             >
                <AlertCircle size={18} className="shrink-0" />
                {error}
             </motion.div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Email address</label>
            <input 
              required
              type="email" 
              placeholder="founder@startup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all font-medium text-gray-900 text-sm placeholder:text-gray-400"
            />
          </div>
          <div>
             <div className="flex items-center justify-between ml-1 text-xs uppercase tracking-wider">
                <label className="font-bold text-gray-700">Password</label>
                <Link href="/forgot-password" className="font-bold text-rose-600 hover:text-rose-700 transition-colors">Forgot?</Link>
             </div>
             <div className="relative mt-1">
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all font-medium text-gray-900 text-sm placeholder:text-gray-400 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             </div>
          </div>

          <button 
             disabled={loading}
             className="w-full mt-2 py-3.5 bg-gray-900 text-white rounded-xl font-[var(--font-outfit)] font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign in"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="relative my-6 text-center flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-gray-200 object-center"></div>
          <span className="relative z-10 bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
        </div>

        <div className="space-y-3">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-gray-500">
          Don't have an account? <Link href="/signup" className="font-bold text-rose-600 hover:text-rose-700">Sign up</Link>
        </p>

      </motion.div>
    </div>
  );
}
