import type { Metadata } from "next";
import { Inter, Outfit, Great_Vibes } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/components/ModalProvider";
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

import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Analytics tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T3XX7DGTKS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-T3XX7DGTKS');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${cursive.variable} font-inter bg-white text-gray-900 antialiased selection:bg-indigo-100 selection:text-indigo-950`}>
        <GoogleAnalytics />
        <AuthProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
