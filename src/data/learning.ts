export type LearningItem = {
  title: string;
  summary: string;
  topics: string[];
  status: "Completed" | "In Progress" | "Up Next";
};

export const learningJourney: LearningItem[] = [
  {
    title: "Linux Fundamentals",
    summary:
      "Daily-driving Linux for development. Comfortable with the shell, permissions, package management, and writing small bash utilities.",
    topics: ["Shell", "Permissions", "Processes", "systemd"],
    status: "Completed",
  },
  {
    title: "Git & GitHub Workflows",
    summary:
      "Branching strategies, code review etiquette, and using GitHub Actions for small CI pipelines on personal projects.",
    topics: ["Branching", "Code Review", "CI/CD", "Open Source"],
    status: "Completed",
  },
  {
    title: "Networking Basics",
    summary:
      "Building a mental model of how packets actually move — the OSI model, TCP/IP, DNS, HTTP, and inspecting traffic with common tooling.",
    topics: ["TCP/IP", "DNS", "HTTP", "Wireshark"],
    status: "In Progress",
  },
  {
    title: "NDG Linux Essentials Certificate",
    summary:
      "Currently working through the NDG Linux Essentials course — system administration, command-line proficiency, networking, security, and shell scripting on Linux.",
    topics: ["Linux Admin", "Bash", "Networking", "Security"],
    status: "In Progress",
  },
  {
    title: "Web Security",
    summary:
      "Studying the OWASP Top 10 alongside my own web development work — XSS, CSRF, injection, auth flaws, and how to defend against them.",
    topics: ["OWASP Top 10", "AuthN/AuthZ", "Headers", "Validation"],
    status: "In Progress",
  },
  {
    title: "Cloud Security",
    summary:
      "Understanding identity, least-privilege, and how misconfigurations turn into incidents on cloud platforms.",
    topics: ["IAM", "Least Privilege", "Secrets", "Monitoring"],
    status: "Up Next",
  },
  {
    title: "AI & Machine Learning",
    summary:
      "Exploring the fundamentals — classical ML, modern LLMs, and how to apply ML responsibly inside real-world web and backend products.",
    topics: ["Python", "ML Basics", "LLMs", "AI Ethics"],
    status: "Up Next",
  },
];
