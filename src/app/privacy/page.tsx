"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="bg-[var(--color-background)] min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-[var(--font-outfit)] tracking-tight">Privacy Policy</h1>
          <p className="text-gray-500 font-medium">Last Updated: March 24, 2026</p>
        </div>
        
        <div className="prose prose-lg text-gray-600 font-medium">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="mb-8">
            When you use <strong>saasvideo.online</strong>, we collect information you provide, such as your email address when you create an account, and any data (URLs, screenshots, or text prompts) you input into our AI Director to generate videos. We also collect usage data to improve application performance.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="mb-8">
            We use your data solely to generate the videos you request. Your inputs are sent to our AI models strictly for the purpose of script and layout generation. We do not sell your personal data or user-generated content to third parties.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Services</h2>
          <p className="mb-8">
            We use reliable third-party providers for authentication and payments (such as Firebase auth and DodoPayments). These services have their own privacy policies. We do not store full credit card details on our servers at any time.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security & Storage</h2>
          <p className="mb-8">
            We employ industry-standard security measures to protect your account and the rendering pipeline. Videos you generate are stored securely for you to re-download if necessary. You may request account deletion at any time via your Profile dashboard.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact</h2>
          <p className="mb-8">
            For questions or concerns about how your data is handled, please contact our privacy team at <a href="mailto:hello@saasvideo.online" className="text-indigo-600 hover:underline">hello@saasvideo.online</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
