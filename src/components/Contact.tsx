"use client";

import { useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Send,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import { site } from "@/data/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ContactCard = {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

const cards: ContactCard[] = [
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@salimukabogere",
    href: site.github,
    external: true,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Salimu Kabogere",
    href: site.linkedin,
    external: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: site.location,
    href: "#",
  },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-contact-card]", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: "[data-contact-cards]",
          start: "top 85%",
        },
      });
      gsap.from("[data-contact-form]", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-contact-form]",
          start: "top 85%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(
      `Portfolio inquiry from ${data.get("name") || "someone"}`
    );
    const body = encodeURIComponent(
      `${data.get("message") || ""}\n\n— ${data.get("name") || ""}\n${data.get("email") || ""}`
    );
    // Open the user's mail client as a graceful no-backend fallback.
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    form.reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" ref={ref} className="section-pad relative">
      <div className="container-x">
        <SectionTitle
          eyebrow="Contact"
          title="Let's build something"
          highlight="useful, secure, well-designed."
          subtitle="Have an idea, an opportunity, or just want to say hi? My inbox is open."
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Form */}
          <form
            data-contact-form
            onSubmit={handleSubmit}
            className="glass-strong relative overflow-hidden rounded-2xl p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-primary/20 blur-3xl" />

            <div className="relative grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/55"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand-primary/60 focus:bg-white/[0.06]"
                />
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/55"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand-primary/60 focus:bg-white/[0.06]"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/55"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell me about your project or what you're hoping to build…"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand-primary/60 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-white/45">
                Form opens your mail client — no data is sent to a server.
              </p>
              <button type="submit" className="btn-primary">
                {submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Sent — talk soon
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Contact cards */}
          <div data-contact-cards className="grid gap-4 sm:grid-cols-2">
            {cards.map(({ icon: Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                data-contact-card
                className="glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-glow-soft"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="mt-4 text-xs uppercase tracking-wider text-white/45">
                  {label}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-white">
                  {value}
                </p>
                <span className="pointer-events-none absolute right-4 top-4 text-white/30 transition-colors group-hover:text-brand-primary">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Closing line */}
        <div className="mt-16 rounded-3xl border border-brand-primary/20 bg-[radial-gradient(circle_at_20%_20%,rgba(121,178,218,0.18),transparent_60%)] p-8 text-center sm:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-primary">
            Closing thought
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-xl font-medium leading-snug text-white sm:text-2xl">
            "Let's build something useful, secure, and well-designed."
          </p>
        </div>
      </div>
    </section>
  );
}
