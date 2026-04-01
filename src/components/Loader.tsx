"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    size?: "sm" | "md" | "lg";
}

export default function Loader({
    title = "Processing...",
    subtitle = "Please wait while we perform this action",
    size = "md",
    className,
    ...props
}: LoaderProps) {
    const sizeConfig = {
        sm: {
            container: "size-20",
            titleClass: "text-sm/tight font-medium",
            subtitleClass: "text-xs/relaxed",
            spacing: "space-y-2",
            maxWidth: "max-w-48",
        },
        md: {
            container: "size-32",
            titleClass: "text-base/snug font-medium",
            subtitleClass: "text-sm/relaxed",
            spacing: "space-y-3",
            maxWidth: "max-w-56",
        },
        lg: {
            container: "size-40",
            titleClass: "text-lg/tight font-semibold",
            subtitleClass: "text-base/relaxed",
            spacing: "space-y-4",
            maxWidth: "max-w-64",
        },
    };

    const config = sizeConfig[size];
    const redColor = "rgb(225, 29, 72)"; // rose-600

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-8 p-8",
                className
            )}
            {...props}
        >
            <motion.div
                className={cn("relative", config.container)}
                animate={{
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: [0.4, 0, 0.6, 1],
                }}
            >
                {/* Visual Backup: Minimal solid ring for robustness */}
                <div className="absolute inset-0 rounded-full border-4 border-rose-50 opacity-20" />

                {/* Outer elegant ring with shimmer */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, ${redColor} 90deg, transparent 180deg)`,
                        maskImage: `radial-gradient(circle at 50% 50%, transparent 32%, black 35%, black 42%, transparent 45%)`,
                        WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 32%, black 35%, black 42%, transparent 45%)`,
                        opacity: 0.8,
                    }}
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                />

                {/* Primary animated ring with gradient */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(from 0deg, transparent 0deg, ${redColor} 120deg, rgba(225, 29, 72, 0.5) 240deg, transparent 360deg)`,
                        maskImage: `radial-gradient(circle at 50% 50%, transparent 40%, black 44%, black 50%, transparent 54%)`,
                        WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 40%, black 44%, black 50%, transparent 54%)`,
                        opacity: 0.9,
                    }}
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: [0.4, 0, 0.6, 1],
                    }}
                />

                {/* Secondary elegant ring - counter rotation */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(from 180deg, transparent 0deg, rgba(225, 29, 72, 0.6) 45deg, transparent 90deg)`,
                        maskImage: `radial-gradient(circle at 50% 50%, transparent 50%, black 54%, black 58%, transparent 62%)`,
                        WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 50%, black 54%, black 58%, transparent 62%)`,
                        opacity: 0.35,
                    }}
                    animate={{
                        rotate: [0, -360],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: [0.4, 0, 0.6, 1],
                    }}
                />

                {/* Accent particles */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(from 270deg, transparent 0deg, rgba(225, 29, 72, 0.4) 20deg, transparent 40deg)`,
                        maskImage: `radial-gradient(circle at 50% 50%, transparent 60%, black 62%, black 65%, transparent 68%)`,
                        WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 60%, black 62%, black 65%, transparent 68%)`,
                        opacity: 0.5,
                    }}
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                />
            </motion.div>

            {/* Enhanced Typography with Breathing Animation */}
            <motion.div
                className={cn("text-center", config.spacing, config.maxWidth)}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: 0.4,
                    duration: 1,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                <motion.h1
                    className={cn(
                        config.titleClass,
                        "text-slate-900 font-black tracking-tight leading-[1.15] antialiased lowercase"
                    )}
                >
                    <motion.span
                        animate={{ opacity: [0.9, 0.7, 0.9] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                        {title}
                    </motion.span>
                </motion.h1>

                <motion.p
                    className={cn(
                        config.subtitleClass,
                        "text-slate-500 font-medium tracking-tight leading-[1.45] antialiased"
                    )}
                >
                    <motion.span
                        animate={{ opacity: [0.6, 0.4, 0.6] }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    >
                        {subtitle}
                    </motion.span>
                </motion.p>
            </motion.div>
        </div>
    );
}
