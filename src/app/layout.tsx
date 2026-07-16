import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";
import StatusBar from "@/components/StatusBar";
import PageTransition from "@/components/PageTransition";
import AmbientField from "@/components/three/AmbientFieldLoader";
import localFont from "next/font/local";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const nameFont = localFont({
  src: "../fonts/SalimuFont.otf",
  variable: "--font-name",
  display: "swap",
});

const headingFont = localFont({
  src: "../fonts/Mexcellent 3d.otf",
  variable: "--font-heading",
  display: "swap",
});

const pixelFont = localFont({
  src: "../fonts/Punktype.ttf",
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salimu Kabogere",
  description:
    "Salimu Kabogere is a Computer Science student and web developer based in Uganda, building clean, responsive applications, cloud and software engineering.",
  keywords: [
    "Salimu Kabogere",
    "Web Developer",
    "Cybersecurity",
    "Uganda",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Salimu Kabogere" }],
  openGraph: {
    title: "Salimu Kabogere — Portfolio",
    description:
      "Clean, responsive web applications. Growing in emerging IT trends, cloud, and software engineering.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${nameFont.variable} ${headingFont.variable} ${pixelFont.variable}`}>
      <body className="bg-surface-ink text-[#ECECEC] font-sans antialiased selection:bg-brand-primary/30">
        <AmbientField />
        <ScrollManager />
        <Navbar />
        <main className="relative min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <StatusBar />
      </body>
    </html>
  );
}
