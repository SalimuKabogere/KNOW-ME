export type Lesson = {
  title: string;
  body: string;
};

export const lessons: Lesson[] = [
  {
    title: "Production is the real teacher",
    body: "Shipping at Equity Bank and AIBOS taught me more than any tutorial — real systems fail in ways labs never show, and that's where the learning happens.",
  },
  {
    title: "Understand the whole stack",
    body: "From repairing hardware and troubleshooting workstations to deploying cloud services, knowing how the layers connect makes me a calmer, faster engineer.",
  },
  {
    title: "Security is a default, not a patch",
    body: "Studying the OWASP Top 10 and setting up secure workstations showed me that safe defaults beat scrambling to fix things after the fact.",
  },
  {
    title: "Read carefully before you fix",
    body: "Most bugs aren't mysteries — they're a message I hadn't read closely enough yet. Slowing down to understand beats guessing every time.",
  },
  {
    title: "Build for the people using it",
    body: "Designing mobile-first for low-bandwidth users in Uganda keeps me honest about performance, clarity, and what actually matters in a product.",
  },
  {
    title: "Grow in the open",
    body: "Certificates, side projects, and public notes — I learn fastest when I'm building real things and sharing the process, not waiting to feel ready.",
  },
];
