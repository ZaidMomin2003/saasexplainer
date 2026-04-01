"use client";

import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { examplePrompts } from "@/examples/prompts";
import { useImageAttachments } from "@/hooks/useImageAttachments";
import { MODELS, type ModelId } from "@/types/generation";
import {
  ArrowUp,
  BarChart3,
  ChevronRight,
  Disc,
  Hash,
  MessageCircle,
  Paperclip,
  SquareArrowOutUpRight,
  Type,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const iconMap: Record<string, LucideIcon> = {
  Type,
  MessageCircle,
  Hash,
  BarChart3,
  Disc,
};

interface LandingPageInputProps {
  onNavigate: (
    prompt: string,
    model: ModelId,
    durationSeconds: number,
    attachedImages?: string[],
  ) => void;
  isNavigating?: boolean;
  showCodeExamplesLink?: boolean;
}

export function LandingPageInput({
  onNavigate,
  isNavigating = false,
  showCodeExamplesLink = false,
}: LandingPageInputProps) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<ModelId>("claude-sonnet-4-6-20251101-v1:0:low");
  const [durationSeconds, setDurationSeconds] = useState(15);
  const {
    attachedImages,
    isDragging,
    fileInputRef,
    removeImage,
    handleFileSelect,
    handlePaste,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    canAddMore,
    error,
    clearError,
  } = useImageAttachments();

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isNavigating) return;
    onNavigate(
      prompt,
      model,
      durationSeconds,
      attachedImages.length > 0 ? attachedImages : undefined,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (Shift+Enter for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <h1 className="text-5xl font-bold text-foreground mb-10 text-center tracking-tight">
        What do you want to create?
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div
          className={`bg-background-elevated rounded-xl border p-4 transition-colors ${
            isDragging ? "border-blue-500 bg-blue-500/10" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Error message */}
          {error && (
            <ErrorDisplay
              error={error}
              variant="inline"
              size="md"
              onDismiss={clearError}
              className="mb-3"
            />
          )}

          {/* Image previews */}
          {attachedImages.length > 0 && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 pt-2">
              {attachedImages.map((img, index) => (
                <div key={index} className="relative flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Attached ${index + 1}`}
                    className="h-20 w-auto rounded border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1.5 -right-1.5 bg-background border border-border rounded-full p-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={
              isDragging
                ? "Drop images here..."
                : "Describe your animation... (paste or drop images)"
            }
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground-dim focus:outline-none resize-none overflow-y-auto text-base min-h-[60px] max-h-[200px]"
            style={{ fieldSizing: "content" }}
            disabled={isNavigating}
          />

          {/* Duration Dragger */}
          <div className="mt-4 mb-2 px-2">
            <div className="flex justify-between text-[11px] text-muted-foreground-dim mb-3 uppercase tracking-widest font-semibold">
              <span>Animation Duration</span>
              <span className="text-primary">{durationSeconds} Seconds</span>
            </div>
            <div className="relative h-6 flex items-center group">
              <div className="absolute w-full h-1 bg-border rounded-full" />
              <div 
                className="absolute h-1 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((durationSeconds - 15) / (90 - 15)) * 100}%` }}
              />
              <div className="absolute w-full flex justify-between px-0.5">
                {[15, 30, 45, 60, 75, 90].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDurationSeconds(val)}
                    className={`w-2 h-2 rounded-full z-10 transition-all ${val <= durationSeconds ? "bg-primary/60" : "bg-border-dim hover:bg-border"}`}
                  />
                ))}
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={[15, 30, 45, 60, 75, 90].indexOf(durationSeconds)}
                onChange={(e) => {
                  const options = [15, 30, 45, 60, 75, 90];
                  setDurationSeconds(options[parseInt(e.target.value)]);
                }}
                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                disabled={isNavigating}
              />
              <div 
                className="absolute w-4 h-4 bg-primary border-2 border-background shadow-lg rounded-full z-10 pointer-events-none transition-all duration-300 transform -translate-x-1/2"
                style={{ left: `${((durationSeconds - 15) / (90 - 15)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 px-1">
              {[15, 30, 45, 60, 75, 90].map((val) => (
                <span key={val} className={`text-[10px] transition-colors ${val === durationSeconds ? "text-primary font-bold" : "text-muted-foreground-dim"}`}>
                  {val}s
                </span>
              ))}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <Select
              value={model}
              onValueChange={(value: string) => setModel(value as ModelId)}
              disabled={isNavigating}
            >
              <SelectTrigger className="w-auto bg-transparent border-none text-muted-foreground hover:text-foreground transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background-elevated border-border">
                {MODELS.map((m) => (
                  <SelectItem
                    key={m.id}
                    value={m.id}
                    className="text-foreground focus:bg-secondary focus:text-foreground"
                  >
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isNavigating || !canAddMore}
                className="text-muted-foreground hover:text-foreground"
                title="Attach images"
              >
                <Paperclip className="w-5 h-5" />
              </Button>

              <Button
                type="submit"
                size="icon-sm"
                disabled={!prompt.trim() || isNavigating}
                loading={isNavigating}
                className="bg-foreground text-background hover:bg-gray-200"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center mt-6 gap-2">
          <span className="text-muted-foreground-dim text-xs mr-1">
            Prompt Examples
          </span>
          {examplePrompts.map((example) => {
            const Icon = iconMap[example.icon];
            return (
              <button
                key={example.id}
                type="button"
                onClick={() => setPrompt(example.prompt)}
                style={{
                  borderColor: `${example.color}40`,
                  color: example.color,
                }}
                className="rounded-full bg-background-elevated border hover:brightness-125 transition-all flex items-center gap-1 px-1.5 py-0.5 text-[11px]"
              >
                <Icon className="w-3 h-3" />
                {example.headline}
              </button>
            );
          })}
        </div>

        {showCodeExamplesLink && (
          <div className="flex justify-center mt-4 text-center">
            <Link
              href="/code-examples"
              className="text-muted-foreground-dim hover:text-muted-foreground text-xs transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              View Code examples
              <SquareArrowOutUpRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link
            href="/plan"
            className="group relative flex items-center gap-3 px-8 py-4 bg-background-elevated border border-primary/20 hover:border-primary/50 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <Wand2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start leading-tight text-left">
              <span className="text-sm font-bold text-foreground">Plan with AI Director</span>
              <span className="text-[10px] text-muted-foreground-dim uppercase tracking-widest font-semibold">Pro SaaS Explainer Mode</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground-dim group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </form>
    </div>
  );
}
