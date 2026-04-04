"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-rose-600" size={32} />
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Verifying Identity...
        </p>
      </div>
    );
  }

  // If not loading and no user, show nothing while the redirect happens
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
