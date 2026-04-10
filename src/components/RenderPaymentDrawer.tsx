"use client";

import { CreditCard, Download, Sparkles, X, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface PriceTagProps {
  price: number;
  discountedPrice: number;
}

function PriceTag({ price, discountedPrice }: PriceTagProps) {
  return (
    <div className="mx-auto flex max-w-fit items-center justify-around gap-6 py-4">
      <div className="flex items-baseline gap-2">
        <span className="bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text font-black text-5xl text-transparent font-[var(--font-outfit)] tracking-tighter">
          ${discountedPrice}
        </span>
        <span className="text-xl text-zinc-500 line-through font-bold">
          ${price}
        </span>
      </div>
      <div className="flex flex-col items-start gap-1">
        <span className="font-bold text-sm text-white uppercase tracking-widest leading-none">
          Full License
        </span>
        <span className="text-[11px] font-bold text-rose-400 uppercase tracking-tight">
          One-time Export
        </span>
      </div>
    </div>
  );
}

const drawerVariants = {
  hidden: {
    y: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
};

export default function RenderPaymentDrawer({
  isOpen,
  onClose,
  onPay,
  projectName = "Your Video"
}: {
  isOpen: boolean;
  onClose: () => void;
  onPay: () => void;
  projectName?: string;
}) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="mx-auto max-w-[450px] rounded-t-[2.5rem] p-4 shadow-2xl border-none bg-zinc-950">
        <motion.div
          animate="visible"
          className="mx-auto w-full space-y-8 p-6"
          initial="hidden"
          variants={drawerVariants as any}
        >
          <motion.div variants={itemVariants as any}>
            <DrawerHeader className="space-y-4 px-0">
              <DrawerTitle className="flex flex-col items-center gap-6">
                <motion.div variants={itemVariants as any}>
                  <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
                    <Download size={32} />
                  </div>
                </motion.div>
                <div className="text-center space-y-1">
                  <motion.span variants={itemVariants as any} className="block text-3xl font-black text-white font-[var(--font-outfit)] tracking-tight">
                    Export Ready
                  </motion.span>
                  <motion.span variants={itemVariants as any} className="block text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    {projectName}
                  </motion.span>
                </div>
              </DrawerTitle>
              <motion.div variants={itemVariants as any}>
                <DrawerDescription className="text-center text-sm font-medium text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                    Unlock full 4K rendering, custom branding, and watermark removal with one click.
                </DrawerDescription>
              </motion.div>
            </DrawerHeader>
          </motion.div>

          <motion.div variants={itemVariants as any}>
            <PriceTag discountedPrice={27} price={49} />
          </motion.div>

          <motion.div variants={itemVariants as any} className="space-y-4">
             <div className="flex flex-col items-center gap-3">
                <button
                  onClick={onPay}
                  className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-rose-500 transition-all shadow-xl shadow-rose-500/20 active:scale-[0.98]"
                >
                  Confirm & Pay $27
                  <CreditCard size={22} className="opacity-60" />
                </button>
                
                <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest pt-2">
                   <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> One-time</div>
                   <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Secure</div>
                   <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Instant</div>
                </div>
             </div>
             
             <DrawerClose asChild>
                <Button
                  variant="ghost"
                  className="w-full h-12 rounded-xl text-zinc-500 font-bold hover:text-white transition-colors hover:bg-white/5"
                >
                  Review Video
                </Button>
             </DrawerClose>
          </motion.div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
