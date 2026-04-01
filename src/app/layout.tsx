import type { Metadata } from "next";
import { Inter, Outfit, Great_Vibes } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cursive = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Professional SaaS Explainer Videos",
  description: "Upload your link, prompt, or screenshots, and we will generate a motion graphics SaaS explainer video in 10 minutes.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} ${cursive.variable} font-inter bg-white text-gray-900 antialiased selection:bg-indigo-100 selection:text-indigo-950`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
