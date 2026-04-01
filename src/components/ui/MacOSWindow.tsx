"use client";

import React from "react";
import { motion } from "framer-motion";

interface MacOSWindowProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  dark?: boolean;
}

export const MacOSWindow: React.FC<MacOSWindowProps> = ({ 
  children, 
  title, 
  className = "", 
  dark = false 
}) => {
  return (
    <div className={`rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500 group ${dark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'} ${className}`}>
      {/* Title Bar */}
      <div className={`flex items-center px-4 py-3 border-b ${dark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/5 hover:opacity-80 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/5 hover:opacity-80 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] border border-black/5 hover:opacity-80 transition-opacity" />
        </div>
        {title && (
          <div className={`flex-1 text-center pr-12 text-[13px] font-semibold ${dark ? 'text-zinc-400' : 'text-gray-500'}`}>
            {title}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};
