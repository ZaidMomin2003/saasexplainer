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
import { captureFrame } from "@/helpers/capture-frame";
import { useImageAttachments } from "@/hooks/useImageAttachments";
import { MODELS, type ModelId } from "@/types/generation";
import { ArrowUp, Camera, Paperclip, X } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

interface ChatInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  isLoading: boolean;
  onSubmit: (attachedImages?: string[]) => void;
  // Frame capture props
  Component?: ComponentType | null;
  fps?: number;
  durationInFrames?: number;
  currentFrame?: number;
}

export function ChatInput({
  prompt,
  onPromptChange,
  isLoading,
  onSubmit,
  Component,
  fps = 30,
  durationInFrames = 150,
  currentFrame = 0,
}: ChatInputProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const {
    attachedImages,
    isDragging,
    fileInputRef,
    addImages,
    removeImage,
    clearImages,
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
    if (!prompt.trim()) return;
    onSubmit(attachedImages.length > 0 ? attachedImages : undefined);
    clearImages();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (Shift+Enter for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCapture = async () => {
    if (!Component || isCapturing || !canAddMore) return;

    setIsCapturing(true);
    try {
      const base64 = await captureFrame(Component, currentFrame, {
        width: 1920,
        height: 1080,
        fps,
        durationInFrames,
      });
      addImages([base64]);
    } catch (error) {
      console.error("Failed to capture frame:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const canCapture = Component && !isLoading && !isCapturing && canAddMore;

  return (
    <div className="px-4 pt-4 pb-4">
      <form onSubmit={handleSubmit}>
        <div
          className={`bg-slate-50 rounded-xl border p-3 transition-colors ${
            isDragging ? "border-rose-400 bg-rose-50" : "border-slate-200 shadow-sm"
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
              size="sm"
              onDismiss={clearError}
              className="mb-2 py-2"
            />
          )}

          {/* Image previews */}
          {attachedImages.length > 0 && (
            <div className="mb-2">
              <div className="flex gap-2 overflow-x-auto pb-1 pt-2">
                {attachedImages.map((img, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Attached ${index + 1}`}
                      className="h-16 w-16 rounded border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1.5 -right-1.5 bg-white border border-slate-200 rounded-full p-0.5 hover:bg-rose-500 hover:text-white transition-colors shadow-sm"
                    >
                      <X className="w-3 h-3 text-slate-700 hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground-dim mt-1">
                Images for reference only, they cannot be embedded in the
                animation
              </p>
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={
              isDragging
                ? "Drop images here..."
                : "Tune your animation... (paste or drop images)"
            }
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none text-sm min-h-[36px] max-h-[120px]"
            style={{ fieldSizing: "content" } as React.CSSProperties}
            disabled={isLoading}
          />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
            <div className="flex-1" />

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !canAddMore}
                className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-7 w-7"
                title="Attach images"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!canCapture}
                onClick={handleCapture}
                className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-7 px-2 text-xs"
                title="Use current frame of Preview as image in chat"
              >
                <Camera className="w-3.5 h-3.5 mr-1" />
                Use Frame
              </Button>

              <Button
                type="submit"
                size="icon-sm"
                disabled={!prompt.trim() || isLoading}
                loading={isLoading}
                className="bg-slate-900 text-white hover:bg-slate-800 h-7 w-7 ml-1 shadow-sm"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
