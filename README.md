# Salimu Kabogere — Portfolio

A modern personal portfolio built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP** (+ ScrollTrigger), and **Lucide React** icons.

## Stack
- Next.js 14 / React 18
- TypeScript (strict)
- Tailwind CSS
- GSAP + ScrollTrigger (primary animation library)
- Lucide React icons

## Local development

```bash
npm install
npm run dev
```

The app runs at <http://localhost:3000>.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

This project is ready for Vercel — push it to a Git provider and import the repo at <https://vercel.com/new>. No environment variables are required.

## Project structure

```
src/
  app/
    layout.tsx         # Root layout, fonts, metadata
    page.tsx           # Assembles all sections
    globals.css        # Design tokens, utilities, components
  components/
    Navbar.tsx
    Hero.tsx
    About.tsx
    Skills.tsx
    Projects.tsx
    ProjectCard.tsx
    LearningJourney.tsx
    GitHubActivity.tsx
    Contact.tsx
    Footer.tsx
    SectionTitle.tsx
  data/
    site.ts            # Name, links, social handles
    skills.ts          # Skill groups
    projects.ts        # Project entries (edit here)
    learning.ts        # Cybersecurity learning timeline
  lib/
    useIsomorphicLayoutEffect.ts
```

## Customising
- **Profile image** — drop a square `profile.jpg` in `/public` and replace the placeholder in `Hero.tsx`.
- **CV** — drop `cv.pdf` in `/public` to enable the Download CV button.
- **Projects / skills / learning** — edit the files in `src/data/`.
- **Colours** — see `tailwind.config.ts` for the brand palette.
