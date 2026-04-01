"use client";

import React, { useState, useEffect } from "react";
import { Plus, LayoutDashboard, Sparkles, Clock, ChevronRight, Video, Construction, Search, Play, MoreVertical, Layout, Trash2, Rocket, Wand2, ArrowRight, Mic2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { OnboardingTour } from "@/components/OnboardingTour";
import { NewProjectModal } from "@/components/NewProjectModal";

interface Project {
  id: string;
  name: string;
  status: string;
  updatedAt: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem("hasSeenOnboardingTour");
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500); // Slight delay for premium feel
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseTour = () => {
    localStorage.setItem("hasSeenOnboardingTour", "true");
    setShowTour(false);
  };

  const triggerTour = () => {
    setShowTour(true);
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "projects"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      
      // Client-side sort to avoid composite index requirement
      projectsList.sort((a, b) => b.updatedAt - a.updatedAt);
      
      setProjects(projectsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createProject = () => {
    setIsModalOpen(true);
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this project forever?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter selection:bg-rose-100">
      <DashboardNav onTriggerTour={triggerTour} />
      
      <OnboardingTour 
        isOpen={showTour} 
        onClose={handleCloseTour} 
      />

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">Saas Explainer studio</h1>
            <p className="text-gray-400 font-medium max-w-lg">Manage your cinematic drafts and professional video assets in one place.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* ENLARGED QUICK SEARCH BOX */}
            <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-medium text-gray-400 min-w-[320px] transition-all focus-within:ring-2 focus-within:ring-rose-600/20 focus-within:border-rose-600/30">
              <Search size={18} className="text-gray-300" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-transparent border-none outline-none w-full text-gray-600 placeholder:text-gray-300 font-bold"
              />
            </div>
            <button 
              onClick={createProject}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-rose-600 hover:translate-y-[-2px] transition-all shadow-xl shadow-gray-200"
            >
              <Plus size={20} strokeWidth={3} />
              New Project
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 inline-flex items-center gap-3 p-1.5 pr-4 bg-rose-50 border border-rose-100 rounded-full"
        >
           <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
              <Mic2 size={14} />
           </div>
           <p className="text-[13px] font-bold text-rose-600 tracking-tight">
             Neural Voiceover & Music Sync <span className="opacity-60 font-medium">— launching tomorrow.</span>
           </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Create New Card */}
          <motion.div 
            onClick={createProject}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group cursor-pointer aspect-square bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-rose-600 hover:bg-rose-50/20 transition-all duration-500"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:rotate-12">
              <Plus size={24} strokeWidth={3} />
            </div>
            <h3 className="text-lg font-black text-gray-900 font-[var(--font-outfit)] group-hover:text-rose-600 transition-colors tracking-tight">New Project</h3>
          </motion.div>

          {/* Project Preview Sequence */}
          {projects.map((project) => {
            const projectUrl = project.status === "Planning" 
              ? `/plan/${project.id}`
              : `/generate/${project.id}`;

            return (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group relative aspect-square bg-white border border-gray-50 rounded-[2.5rem] overflow-hidden flex flex-col p-6 shadow-sm hover:shadow-2xl hover:shadow-rose-600/5 transition-all duration-500"
              >
                <div className="flex-1 rounded-[1.5rem] bg-gray-50 border border-gray-50 group-hover:border-rose-100 flex items-center justify-center relative overflow-hidden transition-all duration-500">
                  <Video className="text-gray-200 group-hover:text-rose-100 transition-colors" size={48} />
                  
                  {/* UNIFIED BLUE STATUS BADGE */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      project.status === "Ready" || project.status === "Draft"
                        ? "bg-rose-600 text-white" 
                        : "bg-rose-600 text-white"
                    }`}>
                      {project.status || "Draft"}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-rose-900/0 group-hover:bg-rose-900/40 backdrop-blur-0 group-hover:backdrop-blur-sm flex items-center justify-center transition-all duration-500 opacity-0 group-hover:opacity-100">
                     <Link 
                        href={projectUrl}
                        className="p-4 bg-white rounded-2xl text-rose-600 shadow-xl hover:scale-110 transition-transform"
                     >
                       <Play fill="currentColor" size={24} />
                     </Link>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{project.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       <Clock size={10} strokeWidth={3} />
                       <span>{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Invalid Date'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => deleteProject(project.id, e)}
                    className="w-10 h-10 bg-gray-50 text-gray-300 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
