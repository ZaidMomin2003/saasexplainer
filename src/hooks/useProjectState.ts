import { useState, useCallback, useEffect } from "react";
import { ProjectState, DiscoveryStep, ProjectAsset } from "@/types/project";
import { ConversationMessage } from "@/types/conversation";

export function useProjectState(messages: ConversationMessage[], initialAssets: ProjectAsset[] = []) {
  const [state, setState] = useState<ProjectState>({
    discoveryStep: initialAssets.length > 0 ? "COMPLETED" : "SPEECH",
    hasSpeech: null,
    assets: initialAssets,
    script: null,
    isScriptApproved: false,
  });

  const [isAssetsOpen, setIsAssetsOpen] = useState(false);

  // Sync initial assets if they change (e.g. loaded from plan)
  useEffect(() => {
    if (initialAssets.length > 0 && state.assets.length === 0) {
      setState(prev => ({ 
        ...prev, 
        assets: initialAssets,
        discoveryStep: "COMPLETED" 
      }));
    }
  }, [initialAssets]);

  const toggleAssets = useCallback(() => setIsAssetsOpen(prev => !prev), []);

  const approveScript = useCallback(() => {
    setState(prev => ({ ...prev, isScriptApproved: true, discoveryStep: "COMPLETED" }));
  }, []);

  // Auto-advance logic based on messages and state
  useEffect(() => {
    if (messages.length === 0) return;

    // Logic to determine current step based on conversation history
    const lastMessage = messages[messages.length - 1];
    const userMessages = messages.filter(m => m.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1];

    if (state.discoveryStep === "SPEECH" && lastUserMessage) {
      const content = lastUserMessage.content.toLowerCase();
      if (content.includes("yes") || content.includes("sure") || content.includes("yeah")) {
        setState(prev => ({ ...prev, hasSpeech: true, discoveryStep: "LOGO" }));
      } else if (content.includes("no") || content.includes("nah")) {
        setState(prev => ({ ...prev, hasSpeech: false, discoveryStep: "LOGO" }));
      }
    }

    if (state.discoveryStep === "LOGO" && lastUserMessage?.attachedImages?.length) {
       const logoAsset: ProjectAsset = {
         id: `logo-${Date.now()}`,
         type: "logo",
         url: lastUserMessage.attachedImages[0],
         name: "App Logo",
         timestamp: Date.now(),
       };
       setState(prev => ({ 
         ...prev, 
         assets: [...prev.assets, logoAsset],
         discoveryStep: "SCREENSHOTS" 
       }));
    }

    if (state.discoveryStep === "SCREENSHOTS" && lastUserMessage?.attachedImages?.length) {
      const newScreenshots = lastUserMessage.attachedImages.map((url, i) => ({
        id: `screenshot-${Date.now()}-${i}`,
        type: "screenshot" as const,
        url,
        name: `Screenshot ${i + 1}`,
        timestamp: Date.now(),
      }));
      setState(prev => ({ 
        ...prev, 
        assets: [...prev.assets, ...newScreenshots],
        discoveryStep: "SCRIPT" 
      }));
    }
  }, [messages, state.discoveryStep]);

  return {
    ...state,
    isAssetsOpen,
    toggleAssets,
    approveScript,
  };
}
