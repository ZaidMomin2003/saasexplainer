"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Sparkles, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import * as gtag from "@/lib/gtag";

export const Navbar = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle the "scrolled" state for background styling
      setScrolled(currentScrollY > 10);

      // Handle the "isVisible" state for show/hide on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.div
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 inset-x-0 z-[60] pointer-events-none"
      >
        {/* ── Funded by AWS Strip ── */}
        <div className="bg-rose-600 py-2 px-6 flex items-center justify-center gap-3 group pointer-events-auto shadow-[0_4px_20px_-10px_rgba(225,29,72,0.3)] border-b border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
             Funded by <span className="font-black underline decoration-white/30 underline-offset-4">AWS Startups</span>
          </span>
        </div>

        {/* ── Navbar ── */}
        <nav className="mt-4 flex justify-center px-6">
          <div 
            className={`w-full max-w-5xl pointer-events-auto rounded-full transition-all duration-700 flex items-center justify-between px-6 h-14 ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-2xl shadow-black/5 border border-gray-200/50 scale-[1.02]' : 'bg-white/40 border-transparent scale-100'}`}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-rose-600 text-white p-1.5 rounded-lg transition-transform group-hover:scale-110 shadow-lg shadow-rose-500/20">
                <Play size={12} className="fill-current ml-0.5" />
              </div>
              <span className="font-bold tracking-tight text-gray-900 text-base leading-none">
                SaaSExplainer
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-gray-500">
              <Link href="/#how-it-works" className="hover:text-gray-900 transition-colors">How it works</Link>
              <Link href="/#features" className="hover:text-gray-900 transition-colors">Features</Link>
              <Link href="/#showcase" className="hover:text-gray-900 transition-colors">Showcase</Link>
              <Link href="/#faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                {user ? (
                  <Link 
                    href="/dashboard"
                    onClick={() => gtag.event({ action: 'go_to_app', category: 'navigation' })}
                    className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-[13px] hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-500/20 flex items-center gap-2 group pointer-events-auto"
                  >
                    Go to app
                    <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform opacity-70" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/waitlist"
                      onClick={() => gtag.event({ action: 'sign_up_click', category: 'conversion' })}
                      className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-[13px] hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-500/20 flex items-center gap-2 group pointer-events-auto"
                    >
                      Join Waitlist
                      <Sparkles size={14} className="group-hover:rotate-12 transition-transform opacity-70" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden text-gray-900 p-2 pointer-events-auto" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed inset-x-6 top-32 z-[70] md:hidden bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 pointer-events-auto"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-center">
              <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-gray-900 font-bold text-lg">How it works</Link>
              <Link href="/#features" onClick={() => setIsOpen(false)} className="text-gray-900 font-bold text-lg">Features</Link>
              <Link href="/#showcase" onClick={() => setIsOpen(false)} className="text-gray-900 font-bold text-lg">Showcase</Link>
              <Link href="/#faq" onClick={() => setIsOpen(false)} className="text-gray-900 font-bold text-lg">FAQ</Link>
              <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-gray-100">
                {user ? (
                  <Link 
                    href="/dashboard"
                    onClick={() => {
                      setIsOpen(false);
                      gtag.event({ action: 'go_to_app', category: 'navigation' });
                    }}
                    className="bg-rose-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2"
                  >
                    Go to app
                    <LayoutDashboard size={18} />
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/waitlist"
                      onClick={() => {
                        setIsOpen(false);
                        gtag.event({ action: 'sign_up_click', category: 'conversion' });
                      }}
                      className="bg-rose-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2"
                    >
                      Join Waitlist
                      <Sparkles size={18} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
