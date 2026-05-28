export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  stack: string[];
  current?: boolean;
};

export const experience: ExperienceItem[] = [
  {
    role: "Software Engineer",
    company: "AIBOS Uganda",
    period: "Dec 2025 — Present",
    location: "Arie Towers, Kampala",
    description:
      "Building across teams — mobile development with React Native & Expo plus the matching web app, and an AI video platform that generates videos using multiple models in a monolith architecture. Learning a lot alongside the wider engineering team.",
    stack: ["React Native", "Expo", "Next.js", "AI / LLMs", "Monolith"],
    current: true,
  },
  {
    role: "Undergraduate Trainee",
    company: "Equity Bank Limited",
    period: "Jun 2025 — Dec 2025",
    location: "Kampala, Uganda",
    description:
      "Hands-on software development and IT support. Built and deployed backend services with FastAPI, Docker and Git, and supported staff with troubleshooting, hardware repair and secure workstation setup across enterprise IT, DevOps and secure coding.",
    stack: ["FastAPI", "Docker", "Git", "DevOps", "Secure coding"],
  },
  {
    role: "Intern — Equity Leaders Program",
    company: "Equity Bank Limited",
    period: "May 2023 — Aug 2023",
    location: "Ntungamo, Uganda",
    description:
      "Practical experience in banking operations and customer service, helping handle fintech applications to improve service efficiency alongside a range of administrative and technical tasks.",
    stack: ["Fintech", "Operations", "Support"],
  },
];
