"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, Github, Linkedin, MapPin, type LucideIcon } from "lucide-react";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import SectionTitle from "./SectionTitle";
import Corners from "./Corners";
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
    icon: Phone,
    label: "Phone",
    value: "+256 772 043489",
    href: `tel:${site.phone}`,
  },
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

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-card]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-contact-cards]",
            start: "top 85%",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={ref} className="section-pad relative">
      <div className="container-x">
        <SectionTitle
          eyebrow="Contact"
          title="Let's build something"
          highlight="useful, secure, well-designed."
          subtitle="Have an idea, an opportunity, or just want to say hi? Reach me on any of these."
        />

        {/* Contact cards */}
        <div
          data-contact-cards
          className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map(({ icon: Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              data-contact-card
              className="card-frame group p-5"
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
              <Corners inset />
            </a>
          ))}
        </div>

        {/* Closing line */}
        <div className="card-frame group mx-auto mt-12 max-w-5xl p-8 text-center sm:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-primary">
            Closing thought
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-xl font-medium leading-snug text-white sm:text-2xl">
            &quot;Let&apos;s build something useful, secure, and well-designed.&quot;
          </p>
          <Corners inset />
        </div>
      </div>
    </section>
  );
}
