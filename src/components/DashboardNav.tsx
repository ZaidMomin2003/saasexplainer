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
    <nav className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <div className="bg-rose-600 text-white p-1.5 rounded-lg shadow-sm">
          <Play size={14} className="fill-current ml-0.5" />
        </div>
        <span className="font-[var(--font-outfit)] font-black tracking-tight text-gray-900 text-xl">
          SaaSVideo
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {onTriggerTour && (
          <button 
            onClick={onTriggerTour}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-gray-500 hover:text-rose-600 font-bold text-sm"
          >
            <HelpCircle size={18} />
            <span className="hidden md:inline">Tour</span>
          </button>
        )}
        
        <div className="relative">
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-sm uppercase">
            {initial}
          </div>
          <div className="flex flex-col items-start hidden sm:flex text-left">
            <span className="text-sm font-bold text-gray-900 leading-tight truncate max-w-[120px]">
              {user?.displayName || "User"}
            </span>
            <span className="text-[11px] font-medium text-gray-500 leading-tight">Pay as you go</span>
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
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100 mb-2">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                </div>

                <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition-colors">
                  <User size={16} />
                  Profile Settings
                </Link>
                <Link href="/downloads" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition-colors">
                  <Download size={16} />
                  My Downloads
                </Link>
                <Link href="/billing" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition-colors">
                  <CreditCard size={16} />
                  Billing & Subscription
                </Link>
                
                <div className="h-px bg-gray-100 my-2"></div>
                
                <button 
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Log out
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
