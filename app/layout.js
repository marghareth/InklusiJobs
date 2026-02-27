//app/layout.js

"use client";

import { Lexend, Roboto } from "next/font/google";
import "./globals.css";
import SkipLink from "@/components/accessibility/SkipLink";
import AccessibilityPanel from "@/components/accessibility/AccessibilityPanel";
import { AuthModalProvider } from "@/components/landing/AuthModalContext";
import { useEffect } from "react";
import { initMockData } from "@/lib/initMockData";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

// NOTE: metadata export won't work with "use client"
// so we move it to a separate file or just remove it for the demo.
// The title still shows in the browser tab from the HTML directly.

export default function RootLayout({ children }) {
  useEffect(() => {
    initMockData();
  }, []);

  return (
    <html lang="en" className={`${lexend.variable} ${roboto.variable}`}>
      <body className="antialiased bg-white text-[#000000]">
        <SkipLink />
        <AuthModalProvider>
          {children}
          <AccessibilityPanel />
        </AuthModalProvider>
      </body>
    </html>
  );
}