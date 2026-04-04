"use client";

/**
 * @author: @kokonutui
 * @description: AI Loading State - Customized for SaaS Video Generator
 * @version: 1.0.1
 * @license: MIT
 */

import { useEffect, useState, useRef } from "react";

const TASK_SEQUENCES = [
    {
        status: "Analyzing Vision",
        lines: [
            "Deconstructing scene hierarchy...",
            "Contextualizing narrative flow...",
            "Identifying key feature highlights...",
            "Mapping cinematic beats...",
            "Preparing motion manifest...",
        ],
    },
    {
        status: "Crafting Video elements",
        lines: [
            "Initializing Virtual Camera system...",
            "Crafting high-inertia transitions...",
            "Synthesizing 3D mockup layers...",
            "Applying easing functions...",
            "Optimizing render performance...",
            "Injecting dynamic SVG paths...",
            "Configuring keyframe sequences...",
            "Finalizing animation logic...",
        ],
    },
    {
        status: "Polishing Fidelity",
        lines: [
            "Enhancing lighting and shadows...",
            "Refining glassmorphic effects...",
            "Syncing text overlays...",
            "Reviewing component hierarchy...",
            "Validating motion consistency...",
            "Testing responsive layouts...",
            "Adding subtle micro-animations...",
            "Finalizing cinematic polish...",
        ],
    },
];

const LoadingAnimation = ({ progress }: { progress: number }) => (
    <div className="relative w-8 h-8">
        <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-label={`Loading progress: ${Math.round(progress)}%`}
        >
            <title>Loading Progress Indicator</title>

            <defs>
                <mask id="progress-mask">
                    <rect width="240" height="240" fill="black" />
                    <circle
                        r="120"
                        cx="120"
                        cy="120"
                        fill="white"
                        strokeDasharray={`${(progress / 100) * 754}, 754`}
                        transform="rotate(-90 120 120)"
                    />
                </mask>
            </defs>

            <style>
                {`
                    @keyframes rotate-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .g-spin circle {
                        transform-origin: 120px 120px;
                    }
                    .g-spin circle:nth-child(1) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(2) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(3) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(4) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(5) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(6) { animation: rotate-ccw 8s linear infinite; }

                    .g-spin circle:nth-child(2n) { animation-delay: 0.2s; }
                    .g-spin circle:nth-child(3n) { animation-delay: 0.3s; }
                `}
            </style>

            <g
                className="g-spin"
                strokeWidth="16"
                strokeDasharray="18% 40%"
                mask="url(#progress-mask)"
            >
                <circle
                    r="150"
                    cx="120"
                    cy="120"
                    stroke="#f43f5e"
                    opacity="0.95"
                />
                <circle
                    r="130"
                    cx="120"
                    cy="120"
                    stroke="#8b5cf6"
                    opacity="0.95"
                />
                <circle
                    r="110"
                    cx="120"
                    cy="120"
                    stroke="#06b6d4"
                    opacity="0.95"
                />
                <circle
                    r="90"
                    cx="120"
                    cy="120"
                    stroke="#10b981"
                    opacity="0.95"
                />
                <circle
                    r="70"
                    cx="120"
                    cy="120"
                    stroke="#f59e0b"
                    opacity="0.95"
                />
                <circle
                    r="50"
                    cx="120"
                    cy="120"
                    stroke="#6366f1"
                    opacity="0.95"
                />
            </g>
        </svg>
    </div>
);

export default function AILoadingState() {
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [visibleLines, setVisibleLines] = useState<
        Array<{ text: string; number: number }>
    >([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const codeContainerRef = useRef<HTMLDivElement>(null);
    const lineHeight = 28;

    const currentSequence = TASK_SEQUENCES[sequenceIndex];
    const totalLines = currentSequence.lines.length;

    useEffect(() => {
        const initialLines = [];
        for (let i = 0; i < Math.min(5, totalLines); i++) {
            initialLines.push({
                text: currentSequence.lines[i],
                number: i + 1,
            });
        }
        setVisibleLines(initialLines);
        setScrollPosition(0);
    }, [sequenceIndex, currentSequence.lines, totalLines]);

    // Handle line advancement
    useEffect(() => {
        const advanceTimer = setInterval(() => {
            // Get the current first visible line index
            const firstVisibleLineIndex = Math.floor(
                scrollPosition / lineHeight
            );
            const nextLineIndex = (firstVisibleLineIndex + 3) % totalLines;

            // If we're about to wrap around, move to next sequence
            if (nextLineIndex < firstVisibleLineIndex && nextLineIndex !== 0) {
                setSequenceIndex(
                    (prevIndex) => (prevIndex + 1) % TASK_SEQUENCES.length
                );
                return;
            }

            // Add the next line if needed
            if (
                nextLineIndex >= visibleLines.length &&
                nextLineIndex < totalLines
            ) {
                setVisibleLines((prevLines) => [
                    ...prevLines,
                    {
                        text: currentSequence.lines[nextLineIndex],
                        number: nextLineIndex + 1,
                    },
                ]);
            }

            // Scroll to the next line
            setScrollPosition((prevPosition) => prevPosition + lineHeight);
        }, 1500);

        return () => clearInterval(advanceTimer);
    }, [
        scrollPosition,
        visibleLines,
        totalLines,
        sequenceIndex,
        currentSequence.lines,
        lineHeight,
    ]);

    // Apply scroll position
    useEffect(() => {
        if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop = scrollPosition;
        }
    }, [scrollPosition]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-white/40 backdrop-blur-md rounded-2xl">
            <div className="space-y-6 w-full max-w-md px-8">
                <div className="flex items-center justify-center space-x-4 text-slate-900 font-bold mb-4">
                    <LoadingAnimation
                        progress={((sequenceIndex + 1) / TASK_SEQUENCES.length) * 100}
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-widest text-rose-500 mb-0.5">Automated Director</span>
                        <span className="text-xl tracking-tight font-black">{currentSequence.status}...</span>
                    </div>
                </div>

                <div className="relative bg-slate-900/[0.03] dark:bg-slate-900/[0.05] rounded-3xl p-6 overflow-hidden border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <div
                        ref={codeContainerRef}
                        className="font-mono text-[11px] overflow-hidden w-full h-[112px] relative"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        <div className="space-y-0">
                            {visibleLines.map((line, index) => (
                                <div
                                    key={`${line.number}-${line.text}`}
                                    className="flex h-[28px] items-center px-1"
                                >
                                    <div className="text-slate-400 font-bold pr-4 select-none w-10 text-right opacity-40 text-[9px]">
                                        {line.number.toString().padStart(2, '0')}
                                    </div>

                                    <div className="text-slate-700 font-semibold flex-1 flex items-center gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse" />
                                        {line.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Overlay for Fade Effect */}
                    <div
                        className="absolute inset-0 pointer-events-none rounded-3xl opacity-100"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0) 75%, rgba(255,255,255,1) 100%)",
                        }}
                    />
                </div>
                
                <div className="flex flex-col items-center gap-3">
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-rose-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                            style={{ width: `${((sequenceIndex + 1) / TASK_SEQUENCES.length) * 100}%` }}
                        />
                    </div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] animate-pulse">
                        SaaS Video Engine Active
                    </p>
                </div>
            </div>
        </div>
    );
}
