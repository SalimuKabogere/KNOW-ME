import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About — Salimu Kabogere",
};

export default function AboutPage() {
  return <About />;
}
