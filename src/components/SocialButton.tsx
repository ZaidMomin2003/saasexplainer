"use client";

import { Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Custom SVG Icons to avoid Lucide-React version conflicts (for v1.6.0)
const TwitterIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  buttonText?: string;
}

export default function SocialButton({
  className,
  buttonText = "Share",
  ...props
}: SocialButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const shareButtons = [
    { 
      icon: TwitterIcon, 
      label: "X (Twitter)", 
      url: "https://x.com/zaidbuilds",
      color: "hover:bg-gray-900"
    },
    { 
      icon: InstagramIcon, 
      label: "Instagram", 
      url: "https://www.instagram.com/fallen_zaid",
      color: "hover:bg-rose-500"
    },
    { 
      icon: LinkedinIcon, 
      label: "LinkedIn", 
      url: "https://www.linkedin.com/in/arshad-momin-a3139b21b/",
      color: "hover:bg-blue-600"
    },
    { 
      icon: LinkIcon, 
      label: "Copy Link", 
      url: "#",
      color: "hover:bg-emerald-500"
    },
  ];

  const handleShare = (url: string, index: number) => {
    setActiveIndex(index);
    if (url === "#") {
      navigator.clipboard.writeText(window.location.href);
    } else {
      window.open(url, "_blank");
    }
    setTimeout(() => setActiveIndex(null), 300);
  };

  return (
    <div
      className="relative h-10 w-44"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <motion.div
        animate={{
          opacity: isVisible ? 0 : 1,
          scale: isVisible ? 0.95 : 1
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0"
      >
        <button
          className={cn(
            "w-full h-full flex items-center justify-center gap-2",
            "bg-white/5",
            "hover:bg-white/10",
            "text-white/60 hover:text-white",
            "border border-white/10",
            "rounded-xl",
            "transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em]",
            className
          )}
          {...props}
        >
          <LinkIcon className="h-3 w-3" />
          {buttonText}
        </button>
      </motion.div>

      <motion.div
        animate={{
          width: isVisible ? "100%" : 0,
          opacity: isVisible ? 1 : 0
        }}
        initial={{ width: 0, opacity: 0 }}
        className="absolute top-0 left-0 flex h-10 overflow-hidden z-20 bg-gray-950 rounded-xl border border-white/10 shadow-2xl"
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {shareButtons.map((button, i) => (
          <motion.button
            animate={{
              opacity: isVisible ? 1 : 0,
              x: isVisible ? 0 : -20,
            }}
            aria-label={button.label}
            className={cn(
              "h-10",
              "flex-1",
              "flex items-center justify-center",
              "text-white/40",
              "border-white/5 border-r last:border-r-0",
              "transition-all duration-300",
              button.color,
              "hover:text-white hover:scale-110 active:scale-90"
            )}
            key={`share-${button.label}`}
            onClick={() => handleShare(button.url, i)}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1],
              delay: isVisible ? i * 0.05 : 0,
            }}
            type="button"
          >
             <button.icon className="h-4 w-4" />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
