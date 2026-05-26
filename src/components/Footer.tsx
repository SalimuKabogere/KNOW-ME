import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/5 bg-[#16120F]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />
      <div className="container-x px-5 py-14 sm:px-8 lg:px-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white shadow-glow-blue">
                {site.initials}
              </span>
              <span className="text-base font-semibold text-white">
                {site.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              {site.tagline}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
                >
                  <Github className="h-4 w-4" /> GitHub
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
                >
                  <Mail className="h-4 w-4" /> {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Based in
            </p>
            <p className="mt-4 text-sm text-white/75">
              {site.location} — available for remote work and collaboration.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-300">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to opportunities
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. Built with Next.js, Tailwind, and GSAP.
          </p>
          <p className="font-mono">crafted in Uganda · {year}</p>
        </div>
      </div>
    </footer>
  );
}
