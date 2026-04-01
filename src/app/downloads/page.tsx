"use client";

import React, { useState } from "react";
import { Search, Download, Video, Calendar, Clock, HardDrive, ArrowLeft, MoreVertical, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardNav } from "@/components/DashboardNav";
import Link from "next/link";

interface DownloadItem {
  id: string;
  name: string;
  renderDate: string;
  duration: string;
  size: string;
  status: "Completed";
  previewUrl: string;
}

const mockDownloads: DownloadItem[] = [
  {
    id: "v-1",
    name: "SaaS Product Demo - Fintech App",
    renderDate: "Mar 24, 2026",
    duration: "0:45",
    size: "24.5 MB",
    status: "Completed",
    previewUrl: "#",
  },
  {
    id: "v-2",
    name: "Hero Section Animation - V2",
    renderDate: "Mar 22, 2026",
    duration: "0:15",
    size: "12.8 MB",
    status: "Completed",
    previewUrl: "#",
  },
  {
    id: "v-3",
    name: "Landing Page Explainer (Spanish)",
    renderDate: "Mar 20, 2026",
    duration: "1:20",
    size: "85.2 MB",
    status: "Completed",
    previewUrl: "#",
  }
];

export default function DownloadsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockDownloads.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter selection:bg-indigo-100">
      <DashboardNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-3">
             <Link href="/dashboard" className="inline-flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
                <ArrowLeft size={14} />
                Back to Dashboard
             </Link>
            <h1 className="text-5xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">My Downloads</h1>
            <p className="text-gray-400 font-medium max-w-lg">Access and download your high-fidelity cinematic renders and purchases.</p>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-300 group-focus-within:text-rose-600 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search your library..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm outline-none font-bold text-gray-600 placeholder:text-gray-300 focus:ring-4 focus:ring-rose-600/5 focus:border-rose-600/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Video List (Long Boxes) */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((video, index) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white border border-gray-50 rounded-[2rem] p-5 flex items-center gap-6 hover:shadow-2xl hover:shadow-rose-600/5 hover:border-rose-100 transition-all duration-300"
              >
                {/* Preview Thumbnail Placeholder */}
                <div className="w-24 h-16 rounded-2xl bg-slate-50 flex items-center justify-center relative overflow-hidden shrink-0 group-hover:bg-rose-50 transition-colors">
                  <Video size={24} className="text-slate-200 group-hover:text-rose-200" />
                  <div className="absolute inset-0 bg-rose-900/0 group-hover:bg-rose-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <PlayCircle size={20} className="text-white fill-rose-600" />
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-gray-900 font-[var(--font-outfit)] truncate mb-1.5 group-hover:text-rose-600 transition-colors leading-tight">
                    {video.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-300" />
                      <span>{video.renderDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-gray-300" />
                      <span>{video.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive size={13} className="text-gray-300" />
                      <span>{video.size}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-lg shadow-rose-100">
                    <Download size={14} strokeWidth={3} />
                    Download 4K
                  </button>
                  <button className="w-12 h-12 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <HardDrive size={32} />
               </div>
               <div className="space-y-1">
                 <h3 className="text-xl font-bold text-gray-900">No videos found</h3>
                 <p className="text-gray-400 font-medium">Try searching for a different project name.</p>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
