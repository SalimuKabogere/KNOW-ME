import type { Metadata } from "next";
import LearningJourney from "@/components/LearningJourney";

export const metadata: Metadata = {
  title: "Learning",
};

export default function LearningPage() {
  return <LearningJourney />;
}
