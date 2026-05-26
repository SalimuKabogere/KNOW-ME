export type ProjectCategory = "Web" | "Tools" | "Cybersecurity" | "Learning";
export type ProjectStatus = "Live" | "In Progress" | "Concept";

export type Project = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  github?: string;
  demo?: string;
  // Optional screenshot in /public — overrides the gradient placeholder
  image?: string;
  // Accent for placeholder thumbnail
  accent: "blue" | "deep" | "warm";
};

// Featured projects — shipped or actively being worked on, with screenshots.
export const featuredProjects: Project[] = [
  {
    slug: "llama-video-narration",
    title: "LLAMA Video Narration",
    description:
      "Final-year project. A web app that accepts an uploaded video and generates a human-like audio narration alongside a written transcript — combining a vision-language model with text-to-speech.",
    stack: ["Next.js", "Python", "FastAPI", "LLM", "TTS"],
    category: "Tools",
    status: "In Progress",
    github: "https://github.com/salimukabogere/llama-video-narration",
    demo: "https://llama-narration.vercel.app",
    image: "/LLAMA.png",
    accent: "deep",
  },
  {
    slug: "katrico-league",
    title: "Katrico League Website",
    description:
      "Official website for the Katrico League — match fixtures, standings, team profiles, and news. Designed for fans, players, and organisers on mobile-first networks.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    category: "Web",
    status: "In Progress",
    github: "https://github.com/SalimuKabogere/katrico",
    demo: "https://frontend-psi-kohl-27.vercel.app/",
    image: "/katrico.png",
    accent: "deep",
  },
  {
    slug: "garden-courts-voting",
    title: "Garden Courts Voting System",
    description:
      "An online voting platform built for Garden Courts hostel — secure student authentication, real-time tallies, and a clean admin view for managing candidates and election windows.",
    stack: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
    category: "Web",
    status: "Live",
    github: "https://github.com/SalimuKabogere/garden_courts",
    demo: "https://garden-courts.vercel.app/",
    image: "/garden.png",
    accent: "blue",
  },
  {
    slug: "eezytask",
    title: "EezyTask",
    description:
      "A task management web app for individuals and small teams — projects, due dates, priority levels, and a focused daily view that helps you actually finish what matters.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    category: "Tools",
    status: "In Progress",
    github: "https://github.com/SalimuKabogere/AIBOS",
    demo: "https://eezytask.vercel.app/",
    image: "/task.png",
    accent: "warm",
  },
  {
    slug: "salon-booking",
    title: "The Salon",
    description:
      "A booking platform for small salons with service catalogues, staff schedules, and SMS reminder hooks. Designed mobile-first for the Ugandan market.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    category: "Web",
    status: "In Progress",
    github: "https://github.com/salimukabogere/salon-booking",
    demo: "https://staging.salon-frontend-463.pages.dev/",
    image: "/salon.png",
    accent: "warm",
  },
];

// Upcoming / in-the-pipeline — concepts and projects still to be built.
export const upcomingProjects: Project[] = [
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio Website",
    description:
      "The site you're looking at. A Next.js portfolio with GSAP-driven scroll animations, a glassmorphism design system, and a focus on clean typography.",
    stack: ["Next.js", "TypeScript", "Tailwind", "GSAP"],
    category: "Web",
    status: "Live",
    github: "https://github.com/salimukabogere/portfolio",
    demo: "#",
    accent: "blue",
  },
  {
    slug: "github-repo-health",
    title: "GitHub Repo Health Checker",
    description:
      "A small dashboard that scores public repositories on commit cadence, README quality, issue hygiene, and license presence using the GitHub REST API.",
    stack: ["Next.js", "TypeScript", "GitHub API"],
    category: "Tools",
    status: "In Progress",
    github: "https://github.com/salimukabogere/repo-health",
    accent: "deep",
  },
  {
    slug: "wifi-qr-poster",
    title: "Wi-Fi QR Poster Generator",
    description:
      "Generates printable A4 posters with a Wi-Fi QR code, network name, and password — handy for cafés, offices, and guest houses.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    category: "Tools",
    status: "Concept",
    github: "https://github.com/salimukabogere/wifi-qr-poster",
    accent: "blue",
  },
  {
    slug: "student-revision-tracker",
    title: "Student Revision Tracker",
    description:
      "Tracks revision sessions, topics covered, and confidence scores using spaced-repetition style nudges. Built for fellow CS students.",
    stack: ["Next.js", "TypeScript", "Prisma", "SQLite"],
    category: "Learning",
    status: "Concept",
    github: "https://github.com/salimukabogere/revision-tracker",
    accent: "deep",
  },
];

// Full list (kept for any consumer that wants everything in one array).
export const projects: Project[] = [...featuredProjects, ...upcomingProjects];

export const projectFilters: ("All" | ProjectCategory)[] = [
  "All",
  "Web",
  "Tools",
  "Cybersecurity",
  "Learning",
];
