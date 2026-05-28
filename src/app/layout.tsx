import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";
import StatusBar from "@/components/StatusBar";

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

export const metadata: Metadata = {
  title: "Salimu Kabogere — Web Developer & Cybersecurity Learner",
  description:
    "Salimu Kabogere is a Computer Science student and web developer based in Uganda, building clean, responsive applications while growing in cybersecurity, cloud and software engineering.",
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
      "Clean, responsive web applications. Growing in cybersecurity, cloud, and software engineering.",
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
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-surface-ink text-[#ECECEC] font-sans antialiased selection:bg-brand-primary/30">
        <ScrollManager />
        <Navbar />
        <main className="relative min-h-screen">{children}</main>
        <Footer />
        <StatusBar />
      </body>
    </html>
  );
}
