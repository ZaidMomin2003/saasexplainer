"use client";

import React, { useState, useEffect } from "react";
import { Plus, Clock, Search, Play, Trash2, Video, Activity, Sparkles, SortAsc, Calendar, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { OnboardingTour } from "@/components/OnboardingTour";
import { NewProjectModal } from "@/components/NewProjectModal";
import { useConfirm, useLoading } from "@/components/ModalProvider";
import Loader from "@/components/Loader";

interface Project {
  id: string;
  name: string;
  status: string;
  updatedAt: number;
  duration?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const confirmAction = useConfirm();
  const setGlobalLoading = useLoading();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alpha">("newest");

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenOnboardingTour");
    if (!hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseTour = () => {
    localStorage.setItem("hasSeenOnboardingTour", "true");
    setShowTour(false);
  };

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "projects"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isConfirmed = await confirmAction({
      title: "Delete Production?",
      description: "This will permanently remove the cinematic manifest and all associated assets. This action is irreversible.",
      confirmText: "Delete Forever",
      cancelText: "Keep Project",
      variant: "danger"
    });

    if (isConfirmed) {
      try {
        setGlobalLoading(true, { 
          title: "Deleting Production", 
          subtitle: "Cleaning up assets and manifests from the studio..." 
        });
        await deleteDoc(doc(db, "projects", id));
        await new Promise(r => setTimeout(r, 800));
      } catch (err) {
        console.error("Error deleting project:", err);
      } finally {
        setGlobalLoading(false);
      }
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === "newest") return b.updatedAt - a.updatedAt;
    if (sortBy === "oldest") return a.updatedAt - b.updatedAt;
    if (sortBy === "alpha") return a.name.localeCompare(b.name);
    return 0;
  });

  const filteredProjects = sortedProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-inter selection:bg-rose-100 relative overflow-hidden">
      {/* Immersive Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-400/5 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-rose-400/5 blur-[120px] rounded-full" 
          />
      </div>

      <DashboardNav onTriggerTour={() => setShowTour(true)} />
      
      <OnboardingTour isOpen={showTour} onClose={handleCloseTour} />
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 relative z-10">
        
        {/* Header Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-rose-500"
            >
              <Activity size={12} />
              Production Suite
            </motion.div>
            <h1 className="text-6xl font-black text-slate-900 font-heading tracking-tight leading-none lowercase">
               Studio<span className="text-rose-600">.</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm max-w-md leading-relaxed">
               Welcome back, <span className="text-slate-900 border-b-2 border-rose-100">{user?.displayName?.split(' ')[0] || 'Director'}</span>. Your cinematic workspace is ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group min-w-[320px]">
                <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Seach productions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-premium outline-none font-bold text-slate-600 placeholder:text-slate-300 focus:ring-8 focus:ring-rose-500/5 focus:border-rose-200 transition-all"
                />
             </div>
             
             <button 
               onClick={() => setIsModalOpen(true)}
               className="h-[64px] px-10 bg-rose-600 text-white rounded-[2rem] font-black text-base flex items-center gap-3 hover:bg-rose-700 hover:translate-y-[-4px] shadow-[0_20px_40px_-10px_rgba(225,29,72,0.3)] transition-all active:scale-95"
             >
                <Plus size={20} strokeWidth={3} />
                New Production
             </button>
          </div>
        </div>

        {/* Projects Grid Container */}
        <div className="space-y-8">
           {/* Enhanced Filtration Bar */}
           <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                 <LayoutGrid size={16} className="text-rose-500" />
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Library <span className="text-slate-200 mx-2">/</span> <span className="text-slate-900">{filteredProjects.length}</span></h2>
              </div>
              
              <div className="flex items-center bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100 backdrop-blur-sm">
                 {[
                   { label: 'Newest', value: 'newest', icon: Clock },
                   { label: 'Oldest', value: 'oldest', icon: Calendar },
                   { label: 'A-Z', value: 'alpha', icon: SortAsc },
                 ].map((opt) => (
                   <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      sortBy === opt.value 
                        ? 'bg-white text-rose-600 shadow-sm border border-slate-100' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                   >
                     <opt.icon size={12} />
                     {opt.label}
                   </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pt-4">
              {/* Ultra-Modern Add Project Card */}
              <motion.button 
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 0.98, y: -4 }}
                className="group relative aspect-square bg-white border-2 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center gap-6 hover:border-rose-400 hover:bg-rose-50/10 transition-all duration-500 shadow-sm"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 group-hover:bg-rose-600 group-hover:text-white transition-all duration-700 shadow-sm group-hover:rotate-90 group-hover:scale-110">
                  <Plus size={28} strokeWidth={3} />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-rose-600 transition-colors">Start Fresh</span>
                  <span className="block text-[10px] font-bold text-slate-300 mt-1 uppercase">Cinematic Manifest</span>
                </div>
              </motion.button>

              {/* Project Card Design */}
              {loading ? (
                <div className="col-span-full py-32 flex items-center justify-center">
                   <Loader 
                    title="Fetching your studio..." 
                    subtitle="Syncing cinematic manifests and production drafts"
                   />
                </div>
              ) : (
                filteredProjects.map((project, index) => {
                  const projectUrl = project.status === "PLANNING" || project.status === "Planning" ? `/plan/${project.id}` : `/generate/${project.id}`;
                  const isReady = project.status === "READY" || project.status === "Ready";
                  
                  return (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative aspect-square bg-white rounded-[3.5rem] p-7 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 overflow-hidden border border-slate-50"
                    >
                      {/* Interactive Visual Base */}
                      <div className="flex-1 h-[72%] rounded-[2.5rem] bg-slate-50 relative overflow-hidden transition-all duration-700 group-hover:scale-[1.02]">
                        {/* Background Patterns for "not boring" effect */}
                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-600 via-transparent to-transparent" />
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform duration-700">
                            <Video size={24} className="text-slate-200 group-hover:text-rose-500 transition-colors" />
                          </div>
                        </div>
                        
                        {/* Status Float - Minimal & Glassmorphic */}
                        <div className="absolute top-5 left-5 z-20">
                          <span className={`px-4 py-2 backdrop-blur-md rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/40 shadow-sm ${
                            isReady ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                          }`}>
                             {project.status || "Drafting"}
                          </span>
                        </div>

                        {/* Hover Actions Overlay */}
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 backdrop-blur-0 group-hover:backdrop-blur-md flex items-center justify-center transition-all duration-700 opacity-0 group-hover:opacity-100">
                          <Link 
                            href={projectUrl}
                            className="w-20 h-20 bg-rose-600 rounded-[2rem] text-white flex items-center justify-center shadow-2xl shadow-rose-600/40 hover:scale-110 active:scale-95 transition-all group/play"
                          >
                            <Play fill="currentColor" size={32} className="ml-1 group-hover/play:scale-110 transition-transform" />
                          </Link>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="mt-6 flex items-center justify-between">
                         <div className="min-w-0 pr-4">
                            <h3 className="font-heading font-black text-slate-900 truncate text-lg group-hover:text-rose-600 transition-colors leading-tight">{project.name}</h3>
                            <div className="flex items-center gap-3 mt-1.5">
                               <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                  <Clock size={12} className="text-slate-300" />
                                  {new Date(project.updatedAt).toLocaleDateString()}
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex-shrink-0">
                            <button 
                              onClick={(e) => deleteProject(project.id, e)}
                              className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-100"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
           </div>
        </div>
      </main>

      <footer className="py-12 flex flex-col items-center opacity-20 mt-12">
        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
           Antigravity Studio Engine v3.1
        </div>
      </footer>
    </div>
  );
}
