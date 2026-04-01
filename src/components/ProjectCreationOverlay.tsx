"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, Upload, Globe, Type, Send, Wand2, Loader2, Play, Image as ImageIcon, Trash2, Plus, Eye, CheckCircle2 } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import imageCompression from 'browser-image-compression';

export const ProjectCreationOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingAssetIndex, setEditingAssetIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    audience: "",
    oneLiner: "",
    assets: [] as { name: string, url: string, description: string }[],
    prompt: "",
    ttsRequested: true
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create instant local preview so the UI feels perfectly fast
    const localUrl = URL.createObjectURL(file);
    const newIndex = formData.assets.length;
    
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, { name: file.name, url: localUrl, description: "" }]
    }));
    setEditingAssetIndex(newIndex);

    if (!user) return;
    
    setIsUploading(true);
    try {
      // 1. Ultra-fast Client Side Compression Matrix
      const options = {
        maxSizeMB: 0.4,          // Crush down to maximum 400KB limit
        maxWidthOrHeight: 1920,  // Standard HD boundary constraints
        useWebWorker: true,
        initialQuality: 0.8
      };
      
      const compressedFile = await imageCompression(file, options);
      console.log(`Payload compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

      // 2. Transmit lightweight payload to cloud
      const storageRef = ref(storage, `projects/${user.uid}/assets/${Date.now()}_${compressedFile.name || file.name}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);
      
      // Update the temporary local URL with the live remote URL gracefully
      setFormData(prev => {
         const newAssets = [...prev.assets];
         if (newAssets[newIndex]) {
             newAssets[newIndex].url = url;
         }
         return { ...prev, assets: newAssets };
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Asset upload to cloud delayed, but you can continue your setup.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEnhancePrompt = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance-prompt", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ prompt: formData.prompt, audience: formData.audience, name: formData.name })
      });
      if (response.ok) {
         const { enhancedPrompt } = await response.json();
         setFormData(prev => ({ ...prev, prompt: enhancedPrompt }));
      }
    } catch (err) {
      console.error("Enhance failed:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const updateAssetDescription = (index: number, val: string) => {
    const newAssets = [...formData.assets];
    newAssets[index].description = val;
    setFormData({ ...formData, assets: newAssets });
  };

  const removeAsset = (index: number) => {
    setFormData({ ...formData, assets: formData.assets.filter((_, i) => i !== index) });
    setEditingAssetIndex(null);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...formData,
        userId: user.uid,
        status: "Generating",
        manifest: null,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
      });
      const params = new URLSearchParams({ 
        prompt: formData.prompt, 
        name: formData.name,
        duration: "5", // Default or extract from settings if available
        model: "gemini-2.0-flash" 
      });
      router.push(`/generate?${params.toString()}`);
    } catch (err: any) {
      console.error("Error creating project:", err);
      setError("Failed to initialize project. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* STEP CONTENT */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col"
      >
        {/* Progress Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 shrink-0">
           <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'w-8 bg-rose-600' : 'w-4 bg-gray-100'}`} />
              ))}
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-50"><X size={20} /></button>
        </div>

        <div className="flex-1 p-10 flex flex-col justify-center overflow-y-auto max-h-[70vh] custom-scrollbar">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 text-rose-600 mb-2 font-bold text-sm tracking-widest uppercase"><Type size={16} /> Step 01</div>
                  <h2 className="text-4xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">Project Name.</h2>
                  <input autoFocus type="text" placeholder="e.g. Acme Promo" className="w-full text-2xl font-bold p-6 rounded-2xl border-2 border-gray-100 focus:border-rose-400 outline-none transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <div className="pt-4"><button onClick={nextStep} disabled={!formData.name} className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-800 transition-all">Next Step <ArrowRight size={20} /></button></div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 text-rose-600 mb-2 font-bold text-sm tracking-widest uppercase"><Globe size={16} /> Step 02</div>
                  <h2 className="text-4xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">Website.</h2>
                  <input autoFocus type="url" placeholder="https://..." className="w-full text-2xl font-bold p-6 rounded-2xl border-2 border-gray-100 focus:border-rose-400 outline-none transition-all" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                  <div className="flex items-center gap-4 pt-4"><button onClick={prevStep} className="text-gray-500 font-bold p-4">Back</button><button onClick={nextStep} className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-bold">Continue</button></div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 text-rose-600 mb-2 font-bold text-sm tracking-widest uppercase"><Type size={16} /> Step 03</div>
                  <h2 className="text-4xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">Audience.</h2>
                  <input autoFocus type="text" placeholder="B2B Leads..." className="w-full text-2xl font-bold p-6 rounded-2xl border-2 border-gray-100 focus:border-rose-400 outline-none transition-all" value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} />
                  <div className="flex items-center gap-4 pt-4"><button onClick={prevStep} className="text-gray-500 font-bold p-4">Back</button><button onClick={nextStep} className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold">Next Step</button></div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 text-rose-600 mb-2 font-bold text-sm tracking-widest uppercase"><Play size={16} /> Step 04</div>
                  <h2 className="text-4xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">Audio Toggle.</h2>
                  <div onClick={() => setFormData({...formData, ttsRequested: true})} className={`p-8 rounded-3xl border-2 cursor-pointer transition-all ${formData.ttsRequested ? 'border-rose-600 bg-rose-50' : 'border-gray-100 opacity-60'}`}>
                     <span className="text-xl font-bold text-gray-900">High-End Speech + Music</span>
                  </div>
                  <div onClick={() => setFormData({...formData, ttsRequested: false})} className={`p-8 rounded-3xl border-2 cursor-pointer transition-all ${!formData.ttsRequested ? 'border-gray-900 bg-gray-50' : 'border-gray-100 opacity-60'}`}>
                     <span className="text-xl font-bold text-gray-900">Silent Cinematic Mode</span>
                  </div>
                  <div className="flex items-center gap-4 pt-4"><button onClick={prevStep} className="text-gray-500 font-bold p-4">Back</button><button onClick={nextStep} className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold">Next Step</button></div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                   <div className="flex items-center gap-3 text-rose-600 mb-2 font-bold text-sm tracking-widest uppercase"><Upload size={16} /> Step 05</div>
                   <h2 className="text-4xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">Brand Assets.</h2>

                   <div className="grid grid-cols-2 gap-4 mt-8">
                      {formData.assets.map((asset, i) => (
                        <div key={i} onClick={() => setEditingAssetIndex(i)} className="group relative aspect-video bg-gray-50 rounded-2xl border-2 border-transparent hover:border-rose-400 overflow-hidden cursor-pointer transition-all shadow-sm">
                           <img src={asset.url} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                              <Eye size={24} className="mb-2" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Preview & Add Text</span>
                           </div>
                        </div>
                      ))}

                      <label className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-rose-400 transition-all text-gray-400 hover:text-rose-600 group">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform"><Plus size={24} /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest mt-3">Add Screenshot</span>
                      </label>
                   </div>

                   <div className="flex items-center gap-4 pt-4">
                      <button onClick={prevStep} className="text-gray-500 font-bold p-4">Back</button>
                      <button onClick={nextStep} disabled={formData.assets.length === 0 && isUploading} className={`px-10 py-5 text-white rounded-2xl font-bold flex items-center gap-3 transition-all ${formData.assets.length === 0 ? 'bg-rose-600' : 'bg-gray-900 shadow-xl'}`}>
                         {formData.assets.length === 0 ? "Skip for now" : "Confirm Assets"} <ArrowRight size={20} />
                      </button>
                   </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-rose-600 font-bold text-sm tracking-widest uppercase"><Sparkles size={16} /> Step 06</div>
                     <button onClick={handleEnhancePrompt} disabled={isEnhancing} className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 group">
                        {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />}
                        {isEnhancing ? "Enhancing..." : "Generate with AI"}
                     </button>
                   </div>
                   <h2 className="text-4xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight">The Vision.</h2>
                   <textarea autoFocus placeholder="e.g. A fast-paced dark mode aesthetic..." className="w-full text-lg font-medium p-8 rounded-3xl border-2 border-gray-100 focus:border-gray-900 outline-none min-h-[220px]" value={formData.prompt} onChange={(e) => setFormData({...formData, prompt: e.target.value})} />
                   <div className="flex items-center gap-4 pt-4"><button onClick={prevStep} className="text-gray-500 font-bold p-4">Back</button><button onClick={handleSubmit} disabled={isSubmitting || isUploading || isEnhancing} className="flex-1 py-5 bg-rose-600 text-white rounded-2xl font-black text-[18px] flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50">
                     {isSubmitting ? "Initializing..." : isUploading ? "Waiting for uploads..." : "Enter Laboratory" }
                   </button></div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </motion.div>

      {/* DEDICATED PREVIEW POPUP (AS REQUESTED) */}
      <AnimatePresence>
        {editingAssetIndex !== null && formData.assets[editingAssetIndex] && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 30 }}
               className="w-full max-w-2xl max-h-[90vh] bg-white rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border border-white/20"
             >
                <div className="h-[280px] shrink-0 bg-gray-50 flex items-center justify-center relative border-b border-gray-100 p-6">
                   <button onClick={() => setEditingAssetIndex(null)} className="absolute top-6 right-6 p-3 bg-white hover:bg-gray-100 text-gray-900 rounded-2xl shadow-lg z-20 transition-all hover:scale-105 border border-gray-100"><X size={20} /></button>
                   <div className="h-full w-full rounded-2xl overflow-hidden flex items-center justify-center relative border border-gray-200/50 bg-[var(--color-background)] shadow-inner">
                       <img src={formData.assets[editingAssetIndex]?.url} className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
                       <div className="absolute top-4 left-4 px-3 py-1.5 bg-rose-600/90 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">Asset Preview</div>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-white space-y-5 custom-scrollbar">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-2xl font-black text-gray-900 font-[var(--font-outfit)]">Scene Context</span>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Tell the AI Director what to do with this frame</span>
                      </div>
                      <button onClick={() => removeAsset(editingAssetIndex)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20} /></button>
                   </div>

                   <textarea 
                     autoFocus
                     placeholder="e.g. This is our analytics dashboard. Should enter with a zoom-in effect while the narration talks about insights..." 
                     className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-400 rounded-3xl p-6 text-base font-bold outline-none transition-all min-h-[120px] resize-none"
                     value={formData.assets[editingAssetIndex]?.description || ""}
                     onChange={(e) => updateAssetDescription(editingAssetIndex, e.target.value)}
                   />

                   <div className="flex gap-4 pt-2">
                      <button onClick={() => setEditingAssetIndex(null)} className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                        Save & Close <CheckCircle2 size={18} />
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
