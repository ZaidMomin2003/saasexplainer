"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Do I need to know how to edit videos?",
    answer: "Not at all. Our system is fully automated. You just drop in a link to your landing page or type a quick prompt, and our AI constructs the timeline, animates the elements, and builds your assets into scenes."
  },
  {
    question: "What if I don't have screenshots or assets?",
    answer: "No problem! You can just describe your product, and the AI will generate placeholder UI elements, text, and motion graphics that look professional and clean."
  },
  {
    question: "How long does it take?",
    answer: "Generating the video timeline takes less than 10 minutes. Rendering the final 1080p MP4 usually takes about 2-3 minutes depending on server load."
  },
  {
    question: "Why only $29?",
    answer: "We built a programmatic rendering engine. Since we don't have to hire human motion designers to drag keyframes in After Effects, we can pass those massive savings directly to you at a fraction of the market cost."
  }
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 md:py-16 px-6 bg-[#fafafa] relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-gray-200/50 text-[11px] font-black text-gray-500 mb-6 uppercase tracking-[0.2em]"
            >
              Support
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-[4.5rem] font-black tracking-[-0.05em] text-gray-950 mb-10 leading-[0.95]"
            >
              Got <span className="font-normal leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 px-4 py-2" style={{ fontFamily: 'var(--font-cursive)', textShadow: '0 0 40px rgba(225,29,72,0.1)' }}>Questions?</span> <br /> We have answers.
            </motion.h2>
        </div>
        
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
             const isOpen = openIdx === idx;
             return (
               <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
                 <button 
                   onClick={() => setOpenIdx(isOpen ? null : idx)} 
                   className="w-full flex items-center justify-between p-8 text-left"
                 >
                   <span className="font-black text-lg text-gray-950 tracking-tight">{faq.question}</span>
                   <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180 bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-gray-400'}`}>
                     <ChevronDown size={18} />
                   </div>
                 </button>
                 <AnimatePresence>
                   {isOpen && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                       className="overflow-hidden"
                     >
                       <div className="p-8 pt-0 text-gray-500 font-medium leading-relaxed tracking-tight text-[16px]">
                          {faq.answer}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             )
          })}
        </div>
      </div>
    </section>
  );
};
