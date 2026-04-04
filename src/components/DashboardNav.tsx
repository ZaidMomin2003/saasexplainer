"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, CreditCard, LogOut, User, Download, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export const DashboardNav = ({ onTriggerTour }: { onTriggerTour?: () => void }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const initial = user?.displayName?.[0] || user?.email?.[0] || "?";

  return (
    <nav className="h-24 sticky top-0 z-50 flex items-center justify-between px-10 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200">
      <Link href="/dashboard" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-lg shadow-slate-900/10 group-hover:bg-rose-600 transition-colors duration-500">
          <Play size={18} className="fill-current ml-0.5" />
        </div>
        <span className="font-heading font-black tracking-tighter text-slate-900 text-2xl lowercase">
          Studio<span className="text-rose-600">.</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {onTriggerTour && (
          <button 
            onClick={onTriggerTour}
            className="hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-slate-900 font-bold text-sm"
          >
            <HelpCircle size={20} className="text-rose-500" />
            Tour
          </button>
        )}
        
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-4 p-1.5 pr-4 rounded-2xl hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-sm hover:shadow-md"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-slate-900/10">
              {initial}
            </div>
            <div className="flex flex-col items-start hidden sm:flex text-left">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {user?.displayName?.split(' ')[0] || "Director"}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Studio Pro</span>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-0 top-full mt-4 w-72 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-50 mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all">
                      <User size={18} />
                      Studio Settings
                    </Link>
                    <Link href="/downloads" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all">
                      <Download size={18} />
                      Project Exports
                    </Link>
                    <Link href="/billing" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all">
                      <CreditCard size={18} />
                      Billing Portal
                    </Link>
                  </div>
                  
                  <div className="h-px bg-slate-50 my-2 mx-2"></div>
                  
                  <button 
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
