import type { Metadata } from "next";
import LearningJourney from "@/components/LearningJourney";

export const metadata: Metadata = {
  title: "Learning — Salimu Kabogere",
};

export default function LearningPage() {
  return <LearningJourney />;
}
