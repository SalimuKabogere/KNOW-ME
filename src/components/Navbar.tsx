"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { navLinks, site } from "@/data/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex items-center justify-between px-5 py-3.5 sm:px-8 lg:px-16">
        {/* Logo + identity */}
        <Link href="/" className="group flex items-center gap-3" aria-label="Go to home">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-white/[0.03] text-[11px] font-semibold tracking-wider text-white transition-colors group-hover:border-brand-primary/60">
            {site.initials}
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-medium tracking-[0.05em] text-white">
              {site.name}
            </span>
            <span className="hud-label">Software Developer</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-white" : "text-white/45 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-2 left-0 h-px w-full bg-brand-primary/70" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-white/12 text-white/60 transition-colors hover:border-brand-primary/50 hover:text-white sm:inline-flex"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-white/12 text-white/60 transition-colors hover:border-brand-primary/50 hover:text-white sm:inline-flex"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <Link
            href="/contact"
            className="hidden rounded-full border border-white/16 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:border-brand-primary/60 hover:bg-brand-primary/10 sm:inline-flex"
          >
            Get in touch
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/12 text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="container-x flex flex-col px-5 py-3">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block w-full border-b border-white/5 px-1 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
