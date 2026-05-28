"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, ShieldCheck, CloudCog, Server } from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import Corners from "./Corners";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const pillars = [
  {
    icon: Server,
    title: "Backend Engineering",
    body: "Designing dependable APIs and services in Python, Node.js, Django, and FastAPI — the part of the stack I'm most drawn to.",
    accent: "from-brand-primary/30 to-brand-deep/10",
  },
  {
    icon: CloudCog,
    title: "Cloud & Infrastructure",
    body: "Linux administration, containers, networking, and the discipline of keeping production systems running reliably.",
    accent: "from-brand-medium/30 to-brand-deep/10",
  },
  {
    icon: Code2,
    title: "Web & Mobile",
    body: "Clean, responsive frontends in React and Next.js, plus cross-platform mobile apps with Flutter.",
    accent: "from-brand-deep/30 to-brand-primary/10",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity & AI",
    body: "Studying how systems break and how to defend them, and exploring how AI and ML can fit responsibly into real products.",
    accent: "from-brand-medium/30 to-brand-primary/10",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-about-card]",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: "[data-about-grid]",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        "[data-about-paragraph]",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-about-paragraph]",
            start: "top 85%",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} className="section-pad relative">
      <div className="container-x">
        <SectionTitle
          eyebrow="About"
          title="A developer who likes"
          highlight="understanding the whole stack."
        />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <p
            data-about-paragraph
            className="max-w-2xl text-lg leading-relaxed text-white/70"
          >
            I am a Computer Science graduate based in Uganda, passionate about{" "}
            <span className="text-white">backend development</span>,{" "}
            <span className="text-white">cloud management</span>, and{" "}
            <span className="text-white">infrastructure</span>. I enjoy
            designing dependable APIs and services, understanding how systems
            actually run in production — Linux, networking, deployments — and
            building clean web and mobile interfaces on top. I'm also working
            through the <span className="text-white">NDG Linux Essentials</span>{" "}
            certificate, and exploring how{" "}
            <span className="text-white">AI / ML</span> and{" "}
            <span className="text-white">cybersecurity</span> can fit
            responsibly into real-world products.
          </p>

          <div className="card-frame group p-6 sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-primary">
              Currently
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                Working toward a backend, cloud, and infrastructure career —
                building APIs and shipping the systems behind them.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                Pursuing the NDG Linux Essentials certificate alongside
                hands-on labs in networking and web security.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                Exploring AI / ML foundations and mobile development with
                Flutter on the side.
              </li>
            </ul>
            <Corners inset />
          </div>
        </div>

        <div
          data-about-grid
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pillars.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              data-about-card
              className="card-frame group p-6"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
              <Corners inset />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
