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
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface Project {
  id: string;
  name: string;
  status: string;
  updatedAt: number;
  duration?: string;
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter selection:bg-rose-100 relative overflow-hidden">
      {/* Subtle Atmospheric Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-200/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-rose-200/20 blur-[100px] rounded-full" />
      </div>

      <DashboardNav onTriggerTour={() => setShowTour(true)} />
      
      <OnboardingTour isOpen={showTour} onClose={handleCloseTour} />
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-16 relative z-10">
        
        {/* Header Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-rose-600"
            >
              <Sparkles size={12} strokeWidth={3} />
              Creative Engine v3.1
            </motion.div>
            <h1 className="text-7xl font-black text-slate-900 font-heading tracking-tighter leading-none lowercase">
               Studio<span className="text-rose-600">.</span>
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-sm leading-relaxed">
               Welcome back, <span className="text-slate-900 font-bold">{user?.displayName?.split(' ')[0] || 'Director'}</span>. Resume your cinematic production workflow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
             <div className="relative group min-w-[340px]">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Seach productions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-300 transition-all text-lg"
                />
             </div>
             
             <button 
               onClick={() => setIsModalOpen(true)}
               className="h-[68px] px-10 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-rose-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10 hover:shadow-rose-600/20"
             >
                <Plus size={24} strokeWidth={2.5} />
                New Video
             </button>
          </div>
        </div>

        {/* Projects Grid Container */}
        <div className="space-y-10">
           {/* Library Controls */}
           <div className="flex items-center justify-between border-b border-slate-200 pb-8">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white">
                    <LayoutGrid size={16} strokeWidth={2.5} />
                 </div>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">Your Productions <span className="text-slate-300 mx-2">|</span> <span className="text-rose-600">{filteredProjects.length}</span></h2>
              </div>
              
              <div className="flex items-center p-1.5 bg-slate-200/50 rounded-xl">
                 {[
                   { label: 'Newest', value: 'newest', icon: Clock },
                   { label: 'Oldest', value: 'oldest', icon: Calendar },
                   { label: 'A-Z', value: 'alpha', icon: SortAsc },
                 ].map((opt) => (
                   <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value as any)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      sortBy === opt.value 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                   >
                     <opt.icon size={14} />
                     {opt.label}
                   </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-4">
              {/* Add Project Card */}
              <motion.button 
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 0.98, y: -4 }}
                className="group relative aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-rose-500 hover:bg-white transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <Plus size={32} strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Create Prototype</span>
                </div>
              </motion.button>

              {/* Project Card Design */}
              {loading ? (
                <div className="col-span-full py-40 flex items-center justify-center">
                   <Loader 
                    title="Accessing Vault" 
                    subtitle="Decrypting cinematic drafts"
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
                      transition={{ delay: index * 0.04 }}
                      className="group relative aspect-square bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-slate-200 flex flex-col"
                    >
                      {/* Interactive Visual Base */}
                      <div className="flex-1 rounded-2xl relative overflow-hidden transition-all duration-500">
                        {/* Dynamic Deterministic Mesh Gradient */}
                        {(() => {
                          const id = project.id;
                          let hash = 0;
                          for (let i = 0; i < id.length; i++) {
                            hash = id.charCodeAt(i) + ((hash << 5) - hash);
                          }
                          
                          const palette = [
                            '#d3fc72', // Lime
                            '#553199', // Purple
                            '#00f5d4', // Teal
                            '#f15bb5', // Pink
                            '#fee440', // Yellow
                          ];
                          
                          const c1 = palette[Math.abs(hash % palette.length)];
                          const c2 = palette[Math.abs((hash * 2) % palette.length)];
                          const c3 = palette[Math.abs((hash * 3) % palette.length)];
                          
                          return (
                            <div className="absolute inset-0 overflow-hidden transition-transform duration-700 group-hover:scale-105">
                                <div 
                                    className="absolute inset-[-50%] blur-[60px] opacity-80"
                                    style={{
                                        background: `
                                        radial-gradient(circle at 20% 20%, ${c1} 0%, transparent 40%),
                                        radial-gradient(circle at 80% 10%, ${c2} 0%, transparent 40%),
                                        radial-gradient(circle at 50% 80%, ${c3} 0%, transparent 50%),
                                        radial-gradient(circle at 100% 100%, ${c1} 0%, transparent 40%),
                                        #111
                                        `
                                    }}
                                />
                                {/* Noise Overlay */}
                                <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none" 
                                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
                                />
                            </div>
                          );
                        })()}
                        
                        {/* Static Subtle Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,_white_0%,_transparent_1px)] bg-[length:20px_20px]" />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                              <Video size={20} className="text-slate-400 group-hover:text-rose-600 transition-colors" />
                           </div>
                        </div>
                        
                        {/* Status Float */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className={`px-4 py-1.5 bg-white/90 backdrop-blur-md border border-white/60 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
                            isReady ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                             {project.status || "Draft"}
                          </span>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                          <Link 
                            href={projectUrl}
                            className="w-16 h-16 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                          >
                            <Play fill="currentColor" size={24} className="ml-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="mt-5 flex items-center justify-between">
                         <div className="min-w-0 pr-4">
                            <h3 className="font-bold text-slate-900 truncate text-lg leading-tight group-hover:text-rose-600 transition-colors">{project.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                               <Clock size={12} className="text-slate-400" />
                               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                  {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                               </span>
                            </div>
                         </div>
                         
                         <button 
                            onClick={(e) => deleteProject(project.id, e)}
                            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                    </motion.div>
                   );
                })
              )}
           </div>
        </div>
      </main>

      <footer className="py-20 flex flex-col items-center opacity-30">
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.6em]">
           <div className="w-12 h-[1px] bg-slate-300" />
           Antigravity Studio Engine
           <div className="w-12 h-[1px] bg-slate-300" />
        </div>
      </footer>
    </div>
  );
}
