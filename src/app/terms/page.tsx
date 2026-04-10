"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="bg-[var(--color-background)] min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-[var(--font-outfit)] tracking-tight">Terms & Conditions</h1>
          <p className="text-gray-500 font-medium">Last Updated: April 6, 2026</p>
        </div>
        
        <div className="prose prose-lg text-gray-600 font-medium">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="mb-8">
            These Terms & Conditions govern your use of <strong>saasexplainer.online</strong>. By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services</h2>
          <p className="mb-8">
            saasexplainer.online provides AI-powered video generation services for SaaS products. By providing a website link and a logo, our engine automatically generates a promotional video. Generating previews and requesting unlimited revisions is free. You only pay the specified flat fee to export and download the final video file without watermarks once you are satisfied with the result.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Intellectual Property</h2>
          <p className="mb-8">
            Upon full payment and download of a video file, you are granted a full, commercial, royalty-free license to use that specific video. You retain all ownership rights to the assets (Website URLs, logos, text) you provide to our engine.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
          <p className="mb-8">
            You are responsible for ensuring that you have the rights to any content, URLs, or assets you provide to our AI engine. You agree not to use saasvideo.online for any unlawful or prohibited purposes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact</h2>
          <p className="mb-8">
            If you have any questions regarding these terms, please contact us at <a href="mailto:hello@saasexplainer.online" className="text-indigo-600 hover:underline">hello@saasexplainer.online</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
