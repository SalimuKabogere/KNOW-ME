import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

const links = [
  { label: "GitHub", href: site.github, external: true },
  { label: "LinkedIn", href: site.linkedin, external: true },
  { label: "Email", href: `mailto:${site.email}`, external: false },
  { label: "CV", href: site.cvUrl, external: true },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/10 bg-surface-ink">
      <div className="container-x px-5 pt-20 sm:px-8 lg:px-16">
        {/* CTA + links */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="hud-label">Have something to build?</p>
            <a
              href={`mailto:${site.email}`}
              className="group mt-4 inline-flex items-center gap-3 text-2xl font-extralight tracking-tight text-white transition-colors hover:text-brand-primary sm:text-4xl"
            >
              {site.email}
              <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer" : undefined}
                  className="group inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
                >
                  {l.label}
                  <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Meta row */}
        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="hud-label">© {year} {site.name}</span>
          <span className="hud-label">{site.location} — Open to work</span>
          <span className="hud-label">Learn by breaking</span>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="relative mt-10 overflow-hidden">
        <p
          className="select-none whitespace-nowrap pb-10 text-center font-extralight leading-[0.8] tracking-[-0.02em] text-white/90 text-[21vw]"
          style={{
            textShadow:
              "0 0 25px rgba(121, 178, 218, 0.45), 0 0 70px rgba(121, 178, 218, 0.3), 0 10px 40px rgba(48, 108, 147, 0.35)",
          }}
        >
          SALIMU
        </p>
      </div>
    </footer>
  );
}
