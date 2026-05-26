export type SkillGroup = {
  title: string;
  description: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend",
    description: "Building APIs and services — my main focus.",
    items: [
      "Python",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express",
      "Django",
      "FastAPI",
    ],
  },
  {
    title: "Frontend",
    description: "Clean, responsive, accessible interfaces.",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    title: "Mobile",
    description: "Cross-platform apps that feel native.",
    items: ["Flutter", "Mobile-first UI"],
  },
  {
    title: "Cloud & Infrastructure",
    description: "Shipping it — then keeping it running.",
    items: ["Linux", "Docker", "Networking", "Cloud Computing"],
  },
  {
    title: "Workflow & Systems",
    description: "The skills behind the code.",
    items: [
      "Git",
      "GitHub",
      "VS Code",
      "Project Management",
      "Hardware Repair",
      "System Troubleshooting",
    ],
  },
  {
    title: "Currently Learning",
    description: "Where I'm actively levelling up.",
    items: [
      "NDG Linux Essentials",
      "AI & Machine Learning",
      "Cybersecurity",
      "Cloud Security",
    ],
  },
];
