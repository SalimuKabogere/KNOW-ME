export type SkillGroup = {
  title: string;
  description: string;
  detail: string;
  items: string[];
  image: string;
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend",
    description: "Building APIs and services — my main focus.",
    detail:
      "Backend is where I'm most at home. I design and build dependable REST APIs and services — handling authentication, data modelling, and business logic — with Python (Django, FastAPI) and Node.js (Express). I focus on clean, well-documented endpoints that are easy to consume and safe to run in production.",
    items: [
      "Python",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express",
      "Django",
      "FastAPI",
    ],
    image: "/skills/backend.png",
  },
  {
    title: "Frontend",
    description: "Clean, responsive, accessible interfaces.",
    detail:
      "I turn designs into accessible, fast-loading interfaces that work on any screen. Using React and Next.js with Tailwind CSS, I build responsive layouts with attention to detail — and I'm comfortable wiring them straight into the backends I build.",
    items: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS"],
    image: "/skills/frontend.png",
  },
  {
    title: "Mobile",
    description: "Cross-platform apps that feel native.",
    detail:
      "I build cross-platform mobile apps with Flutter, shipping a single codebase to both Android and iOS. My focus is mobile-first layouts that feel native and perform well on the kinds of devices and networks common across my region.",
    items: ["Flutter", "Mobile-first UI"],
    image: "/skills/mobile.png",
  },
  {
    title: "Cloud & Infrastructure",
    description: "Shipping it — then keeping it running.",
    detail:
      "I'm comfortable beyond just writing code — I deploy it and keep it running. I daily-drive Linux, containerise apps with Docker, and understand networking and cloud fundamentals well enough to ship a service and keep it healthy in production.",
    items: ["Linux", "Docker", "Networking", "Cloud Computing"],
    image: "/skills/cloud.png",
  },
  {
    title: "Workflow & Systems",
    description: "The skills behind the code.",
    detail:
      "Good engineering is more than code. I work confidently with Git and GitHub, keep projects organised, and can troubleshoot systems — and even repair hardware — when something breaks. These are the practical skills that keep a project moving.",
    items: [
      "Git",
      "GitHub",
      "VS Code",
      "Project Management",
      "Hardware Repair",
      "System Troubleshooting",
    ],
    image: "/skills/workflow.png",
  },
  {
    title: "Currently Learning",
    description: "Where I'm actively levelling up.",
    detail:
      "I'm actively levelling up in the areas I'm most curious about — working through the NDG Linux Essentials certificate, studying the OWASP Top 10 and cybersecurity fundamentals, exploring cloud security, and getting hands-on with AI and machine learning.",
    items: [
      "NDG Linux Essentials",
      "AI & Machine Learning",
      "Cybersecurity",
      "Cloud Security",
    ],
    image: "/skills/currently.png",
  },
];
