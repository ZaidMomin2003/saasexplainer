"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HighlightCards } from "@/components/HighlightCards";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
export default function Home() {
  return (
    <div className="bg-white min-h-screen selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden scroll-smooth">
      <Navbar />
      <Hero />
      <HighlightCards />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
