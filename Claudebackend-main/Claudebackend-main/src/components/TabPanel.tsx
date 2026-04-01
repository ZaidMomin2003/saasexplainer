"use client";

import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { useState } from "react";

export type TabId = "code" | "preview";

interface TabPanelProps {
  codeContent: React.ReactNode;
  previewContent: React.ReactNode;
  defaultTab?: TabId;
}

export function TabPanel({
  codeContent,
  previewContent,
  defaultTab = "preview",
}: TabPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const visibleTabs = [
    { id: "preview" as const, label: "Video Preview", icon: Play },
  ];

  return (
    <div className="flex flex-col h-full min-w-0">
      {visibleTabs.length > 1 && (
        <div className="inline-flex w-fit mb-4 shrink-0 rounded-lg overflow-hidden border border-border">
          {visibleTabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                index > 0 && "border-l border-border",
                activeTab === tab.id
                  ? "bg-accent text-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent/30",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 min-h-0">
        {activeTab === "code" ? codeContent : previewContent}
      </div>
    </div>
  );
}
