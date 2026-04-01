"use client";

import { Loader2 } from "lucide-react";
import type { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PageLayout } from "@/components/PageLayout";

function DraftPageContent() {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name") || "Draft Project";

  return (
    <PageLayout title={projectName} isEditor={true}>
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 p-20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 font-[var(--font-outfit)]">Preparing Editor...</h2>
          <p className="text-gray-500 font-medium">Please wait while we initialize the studio components.</p>
        </div>
      </div>
    </PageLayout>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );
}

const DraftPage: NextPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DraftPageContent />
    </Suspense>
  );
};

export default DraftPage;
