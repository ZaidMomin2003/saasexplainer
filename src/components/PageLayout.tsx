"use client";

import { Header } from "./Header";

interface PageLayoutProps {
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  showLogoAsLink?: boolean;
  title?: string;
  isEditor?: boolean;
}

export function PageLayout({
  children,
  rightContent,
  showLogoAsLink = false,
  title,
  isEditor = false,
}: PageLayoutProps) {
  return (
    <div className="h-screen w-screen bg-background flex flex-col">
      <header className="flex justify-between items-start py-4 px-12 shrink-0">
        <Header asLink={showLogoAsLink} />
        {rightContent}
      </header>
      {children}
    </div>
  );
}
