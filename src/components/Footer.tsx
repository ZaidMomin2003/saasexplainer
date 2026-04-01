"use client";

import React from "react";
import Link from "next/link";
import { 
  Play, 
  ShieldCheck, 
  Zap 
} from "lucide-react";
import SocialButton from "./SocialButton";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0b10] text-white pt-16 pb-8 px-6 relative overflow-hidden border-t border-white/5">
      {/* ── Ambient background glows ── */}
      <div className="absolute top-0 left-1/4 w-[30%] h-[30%] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 items-start border-b border-white/5 pb-12">
          {/* Branding Column */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-rose-600 text-white p-1.5 rounded-lg shadow-lg shadow-rose-900/20 group-hover:scale-110 transition-all duration-500">
                <Play size={14} className="fill-current ml-0.5" />
              </div>
              <span className="font-black tracking-tighter text-xl group-hover:text-rose-400 transition-colors">
                SaaSVideo
              </span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed tracking-tight text-sm max-w-[240px]">
              The generative motion engine for world-class SaaS explainers.
            </p>
            <div className="scale-90 origin-left">
              <SocialButton buttonText="Social Links" className="min-w-[160px]" />
            </div>
          </div>

          {/* Uptime Status */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Live Status
             </div>
             <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between max-w-[200px]">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Rendering</span>
                   <span className="text-xs font-bold text-white tracking-tight">99.9% Uptime</span>
                </div>
                <Zap size={16} className="text-emerald-400" />
             </div>
          </div>

          {/* Links Columns */}
          {[
            {
              title: "Product",
              links: [
                { name: "About Us", href: "/about" },
                { name: "Roadmap", href: "/roadmap" }
              ]
            },
            {
              title: "Legal",
              links: [
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Service Delivery", href: "/delivery" }
              ]
            }
          ].map((col, i) => (
            <div key={i} className="flex flex-col gap-5">
              <h5 className="text-white font-black text-[11px] uppercase tracking-widest leading-none border-l-2 border-rose-600 pl-3">{col.title}</h5>
              <div className="flex flex-col gap-3">
                {col.links.map((link, j) => (
                  <Link key={j} href={link.href} className="text-gray-500 hover:text-rose-400 text-xs font-bold transition-colors w-fit">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Section: Meta ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500/50" />
              SSL Encrypted
            </div>
            <span>© 2026 SaaSVideo.online</span>
          </div>

          <div className="text-[9px] font-black text-gray-700 tracking-widest uppercase">
             Secure Payments via Dodo Payments
          </div>
        </div>
      </div>
    </footer>
  );
};
