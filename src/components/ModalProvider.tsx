"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash2 } from "lucide-react";

import Loader from "@/components/Loader";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

interface LoadingOptions {
  title?: string;
  subtitle?: string;
}

interface ModalContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  setLoading: (isLoading: boolean, options?: LoadingOptions) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  // Loading state
  const [isLoading, setIsLoadingGlobal] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState<LoadingOptions | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const setLoading = useCallback((loading: boolean, opts?: LoadingOptions) => {
    setIsLoadingGlobal(loading);
    if (opts) setLoadingOptions(opts);
    else setLoadingOptions(null);
  }, []);

  const handleClose = (value: boolean) => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(value);
  };

  return (
    <ModalContext.Provider value={{ confirm, setLoading }}>
      {children}
      
      {/* Global Loader Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex items-center justify-center p-6"
          >
             <Loader 
                size="lg"
                title={loadingOptions?.title || "Baking Production"} 
                subtitle={loadingOptions?.subtitle || "Please wait while we finalize your video"} 
             />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose(false)}>
        <DialogContent 
          className="sm:max-w-[440px] rounded-[3rem] p-0 border-none bg-white shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          <div className="p-10 pt-16">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center ${options?.variant === 'danger' ? 'bg-rose-50 text-rose-600 shadow-rose-200/50' : 'bg-blue-50 text-blue-600 shadow-blue-200/50'} shadow-2xl relative`}>
                 <div className="absolute inset-0 rounded-[2.5rem] border-4 border-white/40" />
                 {options?.variant === 'danger' ? <Trash2 size={40} strokeWidth={2.5} /> : <AlertCircle size={40} strokeWidth={2.5} />}
              </div>

              <div className="space-y-3">
                <DialogTitle className="text-3xl font-black text-slate-900 font-heading tracking-tight leading-none lowercase">
                  {options?.title || "Are you sure?"}
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-bold text-sm leading-relaxed max-w-[280px] mx-auto opacity-80">
                  {options?.description || "This action cannot be undone."}
                </DialogDescription>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-12">
              <button
                onClick={() => handleClose(true)}
                className={`w-full py-5 ${options?.variant === 'danger' ? 'bg-rose-600 shadow-rose-600/20' : 'bg-slate-900 shadow-slate-900/20'} text-white rounded-[1.5rem] font-black text-base shadow-2xl hover:translate-y-[-2px] hover:shadow-hover transition-all active:scale-95`}
              >
                {options?.confirmText || "Confirm"}
              </button>
              <button
                onClick={() => handleClose(false)}
                className="w-full py-5 bg-white text-slate-400 rounded-[1.5rem] font-black text-base hover:text-slate-900 transition-all"
              >
                {options?.cancelText || "Not now"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useConfirm must be used within a ModalProvider");
  return context.confirm;
};

export const useLoading = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useLoading must be used within a ModalProvider");
  return context.setLoading;
};
