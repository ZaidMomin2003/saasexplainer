"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect to login if user is not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
         <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
         <p className="font-bold text-gray-500 font-[var(--font-outfit)] uppercase tracking-widest text-xs animate-pulse">Authenticating...</p>
      </div>
    );
  }

  // Only render dashboard content if user exists
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {children}
    </div>
  );
}
