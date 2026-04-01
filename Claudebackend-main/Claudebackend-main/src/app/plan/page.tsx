"use client";

import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useImageAttachments } from "@/hooks/useImageAttachments";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  Layout, 
  Loader2, 
  MousePointer2, 
  Palette,
  Plus, 
  Rocket, 
  Type,
  Upload, 
  X 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

type Duration = 15 | 30 | 45 | 60 | 75 | 90;

const STEPS = [
  { id: "project", label: "Project Name", icon: Layout },
  { id: "duration", label: "Duration", icon: Clock },
  { id: "script", label: "Script & Goal", icon: FileText },
  { id: "assets", label: "Brand Assets", icon: ImageIcon },
  { id: "design", label: "Visual Identity", icon: Palette },
];

export default function PlanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [projectName, setProjectName] = useState("");
  const [duration, setDuration] = useState<Duration>(30);
  const [script, setScript] = useState("");
  
  // Image Hooks
  const logoAttachment = useImageAttachments();
  const screenshotAttachments = useImageAttachments();

  // Visual Identity State
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [vibe, setVibe] = useState<"snappy" | "smooth">("snappy");

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));

  const isStepComplete = useMemo(() => {
    if (currentStep === 0) return projectName.trim().length > 0;
    if (currentStep === 1) return true; // Duration always has a default
    if (currentStep === 2) return script.trim().length > 10;
    if (currentStep === 3) return logoAttachment.attachedImages.length > 0 && screenshotAttachments.attachedImages.length > 0;
    if (currentStep === 4) return true; // Visual identity always has defaults
    return false;
  }, [currentStep, projectName, script, logoAttachment.attachedImages, screenshotAttachments.attachedImages]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Construct the "Master Director's Brief"
    const masterPrompt = `
      # MASTER PRODUCTION BRIEF: ${projectName}
      
      ## CORE OBJECTIVE
      ${script}
      
      ## TECHNICAL SPECS
      - Duration: ${duration} seconds
      - Frame Rate: 30fps
      - Style: High-end SaaS Explainer
      - Theme: Modern, Clean, Professional
      
      ## PRODUCTION RULES
      - Use 'saas-mockups' for all screenshot displays.
      - Use 'cursors' for all human-interactive moments.
      - Use 'storyboarding' to ensure frame-accurate sync with this timeline.
      - Ensure 'spring-physics' are applied to all UI entrances.
      
      ## VISUAL IDENTITY (HARMONY)
      - Primary Color: ${primaryColor} (Use this for highlights, interactive elements, and key callouts).
      - Typography: ${fontFamily} (Use this as the global font. Ensure it's imported via @remotion/google-fonts).
      - Animation Vibe: ${vibe === "snappy" ? "Snappy and Fast (Instant UI feedback)" : "Smooth and Organic (Professional Easing)"}.
      - Apply the 'timing' and 'fonts' skills to enforce this harmony.
    `;

    // Save plan to sessionStorage to be picked up by the generator
    const plan = {
      projectName,
      durationInSeconds: duration,
      initialPrompt: masterPrompt.trim(),
      logo: logoAttachment.attachedImages[0],
      screenshots: screenshotAttachments.attachedImages,
    };

    sessionStorage.setItem("saas-production-plan", JSON.stringify(plan));
    
    // Redirect to the generate page
    router.push("/generate?mode=plan");
  };

  return (
    <PageLayout showLogoAsLink>
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {/* Progress Stepper */}
        <div className="flex items-center gap-4 mb-12 w-full justify-center">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  idx <= currentStep 
                    ? "bg-primary text-primary-foreground shadow-lg scale-110" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx < currentStep ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-12 h-0.5 rounded ${idx < currentStep ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full bg-card border rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{STEPS[currentStep].label}</h1>
            <p className="text-muted-foreground">Answer the question below to help the AI Director plan your video.</p>
          </div>

          <div className="flex-1">
            {currentStep === 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">What should we call this video?</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g. Acme Dashboard Launch"
                  className="w-full bg-muted/50 border-2 border-transparent focus:border-primary rounded-xl px-6 py-4 text-xl outline-none transition-all"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && isStepComplete && nextStep()}
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Select Video Duration</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[15, 30, 45, 60, 75, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d as Duration)}
                      className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        duration === d 
                          ? "border-primary bg-primary/5 shadow-inner scale-95" 
                          : "border-muted-foreground/10 hover:border-primary/50"
                      }`}
                    >
                      <span className="text-2xl font-bold">{d}s</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Seconds</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">What's the script or main goal?</label>
                <textarea 
                  autoFocus
                  placeholder="e.g. Show how easy it is to import data into our platform. Start with the login page, move to the dashboard, and then click the 'Import' button."
                  className="w-full bg-muted/50 border-2 border-transparent focus:border-primary rounded-xl px-6 py-4 text-lg outline-none transition-all min-h-[200px] resize-none"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-4">
                  <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Brand Logo</label>
                  <div 
                    onClick={() => logoAttachment.fileInputRef.current?.click()}
                    className={`h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      logoAttachment.attachedImages.length > 0 ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
                    }`}
                  >
                    {logoAttachment.attachedImages.length > 0 ? (
                      <div className="relative group">
                        <img src={logoAttachment.attachedImages[0]} alt="Logo" className="h-20 object-contain p-2" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); logoAttachment.clearImages(); }}
                          className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Upload Logo</span>
                      </>
                    )}
                    <input ref={logoAttachment.fileInputRef} type="file" className="hidden" onChange={logoAttachment.handleFileSelect} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">SaaS Screenshots</label>
                  <div className="grid grid-cols-2 gap-2">
                    {screenshotAttachments.attachedImages.map((src, idx) => (
                      <div key={idx} className="relative group h-14 bg-muted rounded-lg overflow-hidden border">
                        <img src={src} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => screenshotAttachments.removeImage(idx)}
                          className="absolute inset-0 bg-destructive/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {screenshotAttachments.canAddMore && (
                      <button 
                        onClick={() => screenshotAttachments.fileInputRef.current?.click()}
                        className="h-14 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <input ref={screenshotAttachments.fileInputRef} type="file" multiple className="hidden" onChange={screenshotAttachments.handleFileSelect} />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Colors */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Primary Accent Color</label>
                    <div className="flex flex-wrap gap-3">
                      {["#4F46E5", "#06B6D4", "#F59E0B", "#10B981", "#EF4444", "#EC4899"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setPrimaryColor(c)}
                          className={`w-12 h-12 rounded-full border-4 transition-all ${
                            primaryColor === c ? "border-foreground scale-110 shadow-lg" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <div className="relative">
                        <input 
                          type="color" 
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-12 rounded-full overflow-hidden bg-transparent border-none cursor-pointer p-0 opacity-0 absolute"
                        />
                        <div 
                          className="w-12 h-12 rounded-full border shadow-sm flex items-center justify-center pointer-events-none"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Plus className="w-5 h-5 text-white mix-blend-difference" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fonts */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Global Typography</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Inter", "Roboto", "Poppins", "Outfit", "Space Grotesk", "EB Garamond"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFontFamily(f)}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            fontFamily === f ? "border-primary bg-primary/5 text-primary" : "border-muted-foreground/10 hover:border-primary/30"
                          }`}
                          style={{ fontFamily: f }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vibe */}
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground text-center block">Animation Vibe</label>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => setVibe("snappy")}
                        className={`flex-1 max-w-[240px] p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                          vibe === "snappy" ? "border-primary bg-primary/5 shadow-inner" : "border-muted-foreground/10"
                        }`}
                      >
                        <div className="bg-primary/20 p-3 rounded-full">
                          <Rocket className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center">
                          <span className="block font-bold">Snappy</span>
                          <span className="text-[10px] text-muted-foreground">High-energy, instant feedback</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setVibe("smooth")}
                        className={`flex-1 max-w-[240px] p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                          vibe === "smooth" ? "border-primary bg-primary/5 shadow-inner" : "border-muted-foreground/10"
                        }`}
                      >
                        <div className="bg-primary/20 p-3 rounded-full">
                          <MousePointer2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center">
                          <span className="block font-bold">Smooth</span>
                          <span className="text-[10px] text-muted-foreground">Organic, professional easing</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              className={`${currentStep === 0 ? "opacity-0 pointer-events-none" : ""}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button
                disabled={!isStepComplete || isGenerating}
                onClick={handleGenerate}
                size="lg"
                className="rounded-full px-8 bg-primary shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Composing...
                  </>
                ) : (
                  <>
                    Generate Project <Rocket className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                disabled={!isStepComplete}
                onClick={nextStep}
                size="lg"
                className="rounded-full px-8 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Multi-Scene Storyboarding
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> AI Visual Enhancement
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Professional Device Mockups
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
