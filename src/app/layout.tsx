import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

import { QueryProvider } from "@/providers/QueryProvider";
import { Navbar } from "@/components/layout/Navbar";
import { GlobalPreloader } from "@/components/ui/GlobalPreloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export const metadata: Metadata = {
  title: "RaceTime | 2026 World Championship",
  description: "The definitive 2026 World Championship schedule, standings, and live tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} dark`}>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen flex flex-col selection:bg-race-accent selection:text-black">
        <QueryProvider>
          <GlobalPreloader />
          <SmoothScroll />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
